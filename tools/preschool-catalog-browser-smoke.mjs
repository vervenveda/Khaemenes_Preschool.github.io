import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import http from "node:http";
import vm from "node:vm";
import { chromium } from "playwright";

const root=process.cwd();
const temp=fs.mkdtempSync(path.join(os.tmpdir(),"preschool-catalog-smoke-"));
const staticMime={".html":"text/html; charset=utf-8",".js":"text/javascript; charset=utf-8",".css":"text/css; charset=utf-8",".json":"application/json; charset=utf-8",".svg":"image/svg+xml",".png":"image/png",".webp":"image/webp",".jpg":"image/jpeg",".jpeg":"image/jpeg"};
const server=http.createServer((req,res)=>{
  let pathname;
  try{pathname=decodeURIComponent(new URL(req.url,"http://127.0.0.1").pathname)}catch{res.writeHead(400);res.end("Bad URL");return}
  // Mirror the repository's production route so the shared learner toolbar
  // can identify the Preschool surface during this local browser test.
  let routeRoot=root,localPath=pathname;
  if(pathname.startsWith("/Khaemenes_Preschool.github.io/")){
    localPath=pathname.slice("/Khaemenes_Preschool.github.io".length)||"/";
  }else if(pathname.startsWith("/Khaemenes_Academy.github.io/")){
    routeRoot=path.join(root,"shared-academy");
    localPath=pathname.slice("/Khaemenes_Academy.github.io".length)||"/";
  }else if(pathname.startsWith("/Khaemenes_KinderGarden.github.io/")){
    routeRoot=path.join(root,"shared-kindergarten");
    localPath=pathname.slice("/Khaemenes_KinderGarden.github.io".length)||"/";
  }
  const target=path.resolve(routeRoot,"."+localPath);
  if(!target.startsWith(root+path.sep)&&target!==root){res.writeHead(403);res.end("Forbidden");return}
  let file=target;
  try{if(fs.statSync(file).isDirectory())file=path.join(file,"index.html")}catch{}
  fs.readFile(file,(err,data)=>{
    if(err){res.writeHead(404);res.end("Not found: "+pathname);return}
    res.writeHead(200,{"Content-Type":staticMime[path.extname(file).toLowerCase()]||"application/octet-stream","Cache-Control":"no-store"});
    res.end(data);
  });
});
await new Promise(resolve=>server.listen(0,"127.0.0.1",resolve));
const base=`http://127.0.0.1:${server.address().port}`;
const results=[];
function pass(name,detail=""){results.push({name,result:"PASS",detail})}
try{
  const catalogSandbox={window:{},console,Object,Array,Set,Map,String,Number,RegExp,JSON,Math};
  vm.runInNewContext(fs.readFileSync(path.join(root,"assets/preschool-catalog.js"),"utf8"),catalogSandbox,{filename:"preschool-catalog.js"});
  const catalog=catalogSandbox.window.KhaemenesPreschoolCatalog;
  assert.ok(catalog,"shared catalog API should initialize");
  const categories=[...new Set(catalog.childActivities().map(x=>x.category))].filter(x=>x&&x!=="grownup");
  const samples=[];
  for(const category of categories){
    const activity=catalog.childActivities().find(item=>{
      if(item.category!==category||typeof item.file!=="string")return false;
      const relative=item.file.replace(/^\//,"");
      const localPath=relative.startsWith("apps/")?relative:"apps/"+relative;
      return fs.existsSync(path.resolve(root,localPath));
    });
    if(activity){
      const relative=activity.file.replace(/^\//,"");
      samples.push({category,file:relative.startsWith("apps/")?relative:"apps/"+relative,title:activity.title||activity.name||activity.id});
    }
  }
  assert.ok(samples.length>=6,"expected representative activities across at least six Preschool categories; found "+samples.length);
  const browser=await chromium.launch({headless:true});
  try{
    const context=await browser.newContext({viewport:{width:390,height:844},reducedMotion:"reduce"});
    const failures=[];
    for(const sample of samples){
      const page=await context.newPage();
      const pageErrors=[];
      page.on("pageerror",error=>pageErrors.push(error.message));
      await page.goto(base+"/"+sample.file,{waitUntil:"domcontentloaded",timeout:15000});
      await page.waitForTimeout(120);
      const info=await page.evaluate(()=>({
        title:document.title||"",
        text:(document.body?.innerText||"").trim(),
        buttons:[...document.querySelectorAll("button:not([disabled])")].filter(b=>b.getClientRects().length).map(b=>({text:(b.innerText||b.getAttribute("aria-label")||"").trim(),id:b.id})),
        controls:[...document.querySelectorAll("input,select,textarea")].filter(e=>e.getClientRects().length).length
      }));
      assert.ok(info.title.trim(),sample.category+" activity has no document title");
      assert.ok(info.text.length>=30,sample.category+" activity has too little visible content");
      // Exercise one safe, visible button when available. Destructive/reset actions
      // are excluded; this is a smoke check, not a replacement for app-specific tests.
      const candidate=info.buttons.find(b=>b.text&&!/reset|clear|delete|erase|remove|restart|wipe|restore|import|print|close|back|exit/i.test(b.text));
      if(candidate){
        const selector=candidate.id?"#"+candidate.id:null;
        const button=selector?page.locator(selector).first():page.getByRole("button",{name:candidate.text,exact:false}).first();
        if(await button.count()&&await button.isVisible()&&await button.isEnabled()){
          await button.click({timeout:3000}).catch(()=>{});
          await page.waitForTimeout(60);
        }
      }
      if(pageErrors.length)failures.push({category:sample.category,file:sample.file,errors:pageErrors});
      pass("Catalog category: "+sample.category, sample.file+" · title="+info.title+" · visible controls="+(info.buttons.length+info.controls));
      await page.close();
    }
    assert.deepEqual(failures,[],"catalog browser smoke uncovered uncaught page errors: "+JSON.stringify(failures));

    // Language switching: verify the interactive language selector actually
    // changes the displayed partner-language label and persists on reload.
    const languagePage=await context.newPage();
    const languageErrors=[];languagePage.on("pageerror",e=>languageErrors.push(e.message));
    await languagePage.goto(base+"/apps/ABC_bilingual_index.html",{waitUntil:"domcontentloaded"});
    await languagePage.locator("#language").selectOption("fr");
    assert.equal((await languagePage.locator("#partnerLabel").innerText()).trim(),"Français");
    await languagePage.reload({waitUntil:"domcontentloaded"});
    assert.equal(await languagePage.locator("#language").inputValue(),"fr");
    assert.deepEqual(languageErrors,[]);
    pass("Bilingual ABC language preference","Changing to French updates the UI and persists after reload.");
    await languagePage.close();

    // Art studio: exercise canvas drawing, undo/redo, and local image export.
    const artPage=await context.newPage({acceptDownloads:true});
    const artErrors=[];artPage.on("pageerror",e=>artErrors.push(e.message));
    await artPage.goto(base+"/apps/Art_color_studio/index.html",{waitUntil:"domcontentloaded"});
    const canvas=artPage.locator("#canvas");
    assert.ok(await canvas.count(),"Color Studio canvas missing");
    await canvas.scrollIntoViewIfNeeded();
    const box=await canvas.boundingBox();assert.ok(box&&box.width>20&&box.height>20,"Color Studio canvas is not visible");
    await artPage.mouse.move(box.x+box.width*.35,box.y+box.height*.35);
    await artPage.mouse.down();await artPage.mouse.move(box.x+box.width*.55,box.y+box.height*.48,{steps:5});await artPage.mouse.up();
    assert.equal(await artPage.locator("#undoBtn").isEnabled(),true,"drawing did not create undo history");
    await artPage.locator("#undoBtn").click();await artPage.locator("#redoBtn").click();
    const artDownload=artPage.waitForEvent("download");
    await artPage.locator("#saveBtn").click();
    const exported=await artDownload;
    assert.match(exported.suggestedFilename(),/\.(png|webp|jpg|jpeg)$/i);
    assert.deepEqual(artErrors,[]);
    pass("Art studio drawing, undo/redo, export","Pointer drawing creates history; undo/redo and local image export work.");
    await artPage.close();

    // Preschool feelings quiz: launch a session and answer through completion,
    // confirming that the final state and reflection panel are reachable.
    const feelingsPage=await context.newPage();
    const feelingsErrors=[];feelingsPage.on("pageerror",e=>feelingsErrors.push(e.message));
    await feelingsPage.goto(base+"/apps/Feelings_emotional_explorer/index.html",{waitUntil:"domcontentloaded"});
    const start=feelingsPage.getByRole("button",{name:/start|play|begin/i}).first();
    if(await start.count()&&await start.isVisible())await start.click();
    const answerButtons=feelingsPage.locator("#answers button");
    if(await answerButtons.count()){
      let safety=0;
      while(await answerButtons.count()&&safety++<20){
        const answers=feelingsPage.locator("#answers button:not([disabled])");
        if(await answers.count())await answers.first().click();
        const next=feelingsPage.locator("#nextBtn");
        if(await next.count()&&await next.isVisible()&&await next.isEnabled())await next.click();
        if(await feelingsPage.locator("#endPanel").isVisible().catch(()=>false))break;
        await feelingsPage.waitForTimeout(10);
      }
      assert.ok(await feelingsPage.locator("#endPanel").isVisible().catch(()=>false),"feelings quiz did not reach results");
      pass("Feelings quiz completion","A local game session can progress through answers to the results screen.");
    }else{
      assert.ok((await feelingsPage.locator("body").innerText()).length>100,"feelings app content missing");
      pass("Feelings app startup","App loads and renders the current game interface; answer controls require follow-up if not present on startup.");
    }
    assert.deepEqual(feelingsErrors,[]);
    await feelingsPage.close();

    // Piano: changing instrument and toggling rhythm must not throw.
    const musicPage=await context.newPage();
    const musicErrors=[];musicPage.on("pageerror",e=>musicErrors.push(e.message));
    await musicPage.goto(base+"/apps/Music_piano_index.html",{waitUntil:"domcontentloaded"});
    await musicPage.locator("#instrumentSelect").selectOption({index:1});
    const beat=musicPage.locator("#beatButton");
    if(await beat.count()){
      await beat.click();
      assert.equal(await beat.getAttribute("aria-pressed"),"true");
      await beat.click();
    }
    assert.deepEqual(musicErrors,[]);
    pass("Music piano instrument and beat controls","Instrument selection and rhythm toggle respond without uncaught errors.");
    await musicPage.close();

    // Graduation Garden end-to-end: play all three games, unlock/print
    // certificate, verify Kinder Garden link, and confirm learner isolation.
    const gradContext=await browser.newContext({viewport:{width:390,height:844},acceptDownloads:true,reducedMotion:"reduce"});
    const gradPage=await gradContext.newPage();
    const gradErrors=[];gradPage.on("pageerror",e=>gradErrors.push(e.message));
    await gradPage.goto(base+"/graduation/index.html",{waitUntil:"domcontentloaded"});
    await gradPage.evaluate(()=>localStorage.setItem("khaemenes_preschool_profile_v1",JSON.stringify({learnerId:"graduation-browser-A",nickname:"Avery",ageBand:"4-5",pathway:"preschool"})));
    await gradPage.reload({waitUntil:"domcontentloaded"});
    await gradPage.locator('[data-item="book"]').click();
    await gradPage.locator('[data-item="water"]').click();
    await gradPage.locator('[data-item="crayons"]').click();
    await gradPage.locator("#checkBackpack").click();
    assert.match(await gradPage.locator("#backpackStatus").innerText(),/star is saved/);
    await gradPage.locator('#patternChoices [data-answer="rainbow"]').click();
    assert.match(await gradPage.locator("#patternStatus").innerText(),/Pattern star collected/);
    await gradPage.locator('#kindnessChoices [data-answer="hello"]').click();
    assert.match(await gradPage.locator("#kindnessStatus").innerText(),/Kindness star collected/);
    assert.equal(await gradPage.locator("#progressCount").innerText(),"3 of 3 stars ⭐");
    await gradPage.locator("#certificateName").fill("Avery");
    await gradPage.locator("#makeCertificate").click();
    assert.equal(await gradPage.locator("#certificateOutput").isVisible(),true);
    assert.equal(await gradPage.locator("#recipientName").innerText(),"Avery");
    assert.equal(await gradPage.locator("#printCertificate").isEnabled(),true);
    assert.equal(await gradPage.getByRole("link",{name:/Enter Khaemenes Kinder Garden/}).getAttribute("href"),"https://vervenveda.com/Khaemenes_KinderGarden.github.io/?from=preschool-graduation&pinClass=kindergarten");
    await gradPage.reload({waitUntil:"domcontentloaded"});
    assert.equal(await gradPage.locator("#progressCount").innerText(),"3 of 3 stars ⭐","graduation completion should persist for the same learner");
    assert.equal(await gradPage.locator("#certificateOutput").isVisible(),true,"certificate unlock should persist for the same learner");
    await gradPage.evaluate(()=>localStorage.setItem("khaemenes_preschool_profile_v1",JSON.stringify({learnerId:"graduation-browser-B",nickname:"Blake",ageBand:"4-5",pathway:"preschool"})));
    await gradPage.reload({waitUntil:"domcontentloaded"});
    assert.equal(await gradPage.locator("#progressCount").innerText(),"0 of 3 stars ⭐","a second learner must not inherit the first learner's celebration progress");
    assert.equal(await gradPage.locator("#certificateName").inputValue(),"Blake","second learner must receive their own name, not the previous learner's certificate name");
    const graduationKeys=await gradPage.evaluate(()=>JSON.parse(localStorage.getItem("creche-preschool-graduation-v1")||'{"records":{}}'));
    assert.ok(graduationKeys.records["graduation-browser-A"]&&graduationKeys.records["graduation-browser-B"],"graduation state should be kept under explicit learner IDs");
    assert.deepEqual(gradErrors,[]);
    pass("Preschool graduation and Kindergarten handoff","Three games unlock a printable certificate; same-learner progress persists; a second learner starts separately; Kindergarten link requests the pin prompt.");
    await gradContext.close();

    // Verify the actual Kindergarten pin-prompt asset with Academy-style learner
    // APIs: each learner receives an independent course pin in Student Profile.
    const pinContext=await browser.newContext({viewport:{width:390,height:844},reducedMotion:"reduce"});
    await pinContext.addInitScript(()=>{
      const id=()=>localStorage.getItem("test-kindergarten-learner")||"kindergarten-pin-A";
      window.KhaemenesKinderContinuity={getLearnerSummary:()=>({learnerId:id(),nickname:id()==="kindergarten-pin-A"?"Avery":"Blake",stage:"kindergarten",pathway:"kindergarten",hasProfile:true,hasLinkedLearner:true})};
      window.KhaemenesFamilyRegistry={getLearner:()=>({learnerId:id(),nickname:id()==="kindergarten-pin-A"?"Avery":"Blake",stage:"kindergarten"})};
    });
    const pinPage=await pinContext.newPage();
    await pinPage.goto(base+"/graduation/?from=preschool-graduation&pinClass=kindergarten",{waitUntil:"domcontentloaded"});
    await pinPage.addScriptTag({path:path.join(root,"shared-kindergarten","assets","khaemenes-kindergarten-pin-prompt.js")});
    await pinPage.waitForSelector("#kinderPinPrompt:not([hidden])");
    assert.match(await pinPage.locator("#kpTitle").innerText(),/Save Kinder Garden to your profile/);
    await pinPage.locator("#kpSave").click();
    assert.match(await pinPage.locator("#kpTitle").innerText(),/Kinder Garden is pinned/);
    let classPins=await pinPage.evaluate(()=>JSON.parse(localStorage.getItem("khaemenes_course_pins_v1")||'{"learners":{}}'));
    assert.equal(classPins.learners["kindergarten-pin-A"].length,1);
    assert.equal(classPins.learners["kindergarten-pin-A"][0].id,"khaemenes-kindergarten");
    assert.equal(classPins.learners["kindergarten-pin-A"][0].href,"https://vervenveda.com/Khaemenes_KinderGarden.github.io/");
    // Switch the simulated active learner and confirm the prompt creates an
    // independent pin list rather than inheriting Avery's class pin.
    await pinPage.evaluate(()=>localStorage.setItem("test-kindergarten-learner","kindergarten-pin-B"));
    await pinPage.goto(base+"/graduation/?from=preschool-graduation&pinClass=kindergarten",{waitUntil:"domcontentloaded"});
    await pinPage.addScriptTag({path:path.join(root,"shared-kindergarten","assets","khaemenes-kindergarten-pin-prompt.js")});
    await pinPage.waitForSelector("#kinderPinPrompt:not([hidden])");
    assert.match(await pinPage.locator("#kpTitle").innerText(),/Save Kinder Garden to your profile/);
    await pinPage.locator("#kpSave").click();
    classPins=await pinPage.evaluate(()=>JSON.parse(localStorage.getItem("khaemenes_course_pins_v1")||'{"learners":{}}'));
    assert.equal(classPins.learners["kindergarten-pin-A"].length,1);
    assert.equal(classPins.learners["kindergarten-pin-B"].length,1);
    assert.equal(classPins.learners["kindergarten-pin-B"][0].courseId,"khaemenes-kindergarten");
    pass("Kindergarten pin prompt and learner-scoped profile save","Graduation handoff opens the prompt; saving adds a Student Profile course pin; a second learner gets an independent pin.");
    await pinContext.close();

    // A direct first visit without any active learner should still offer the
    // pin path, but Not now must leave the public Kindergarten entrance usable.
    const directContext=await browser.newContext({viewport:{width:390,height:844},reducedMotion:"reduce"});
    const directPage=await directContext.newPage();
    const directErrors=[];directPage.on("pageerror",e=>directErrors.push(e.message));
    await directPage.goto(base+"/Khaemenes_KinderGarden.github.io/",{waitUntil:"domcontentloaded"});
    await directPage.waitForSelector("#kinderPinPrompt:not([hidden])",{timeout:5000});
    assert.match(await directPage.locator("#kpTitle").innerText(),/right learner profile/);
    await directPage.locator("#kpLater").click();
    assert.equal(await directPage.locator("#kinderPinPrompt").isHidden(),true);
    assert.ok((await directPage.locator("body").innerText()).length>100,"Kindergarten page should remain usable after dismissing the pin prompt");
    assert.deepEqual(directErrors,[]);
    pass("Direct Kindergarten arrival remains accessible","A first-time visitor with no active learner sees the class-pin option and can dismiss it to explore the public platform.");
    await directContext.close();

    // Parent journey: register a Pre-K child and a Kindergarten child, then
    // return from Kindergarten profile selection and confirm the intent banner.
    const familyContext=await browser.newContext({viewport:{width:1200,height:900},reducedMotion:"reduce"});
    const familyPage=await familyContext.newPage();
    const familyErrors=[];familyPage.on("pageerror",e=>familyErrors.push(e.message));
    await familyPage.goto(base+"/Khaemenes_Academy.github.io/family/enroll/",{waitUntil:"domcontentloaded"});
    await familyPage.locator("#familyName").fill("Two Child Test Family");
    await familyPage.locator("#adultName").fill("Parent Test");
    await familyPage.locator("#adultRole").selectOption("parent");
    await familyPage.locator("#createFamily").click();
    await familyPage.locator("#nickname").fill("Mia PreK");
    await familyPage.locator("#grade").selectOption("pre-k");
    await familyPage.locator("#addLearner").click();
    await familyPage.locator("#learnerAddedNotice").getByRole("button",{name:"Add Another Learner"}).click();
    await familyPage.locator("#nickname").fill("Theo Kinder");
    await familyPage.locator("#grade").selectOption("k");
    await familyPage.locator("#addLearner").click();
    const existingChildren=await familyPage.locator("#existing").innerText();
    assert.ok(existingChildren.includes("Mia PreK"));
    assert.ok(existingChildren.includes("Theo Kinder"));
    await familyPage.evaluate(()=>sessionStorage.setItem("khaemenes_kindergarten_pin_handoff_v1",JSON.stringify({destination:"https://vervenveda.com/Khaemenes_KinderGarden.github.io/?pinClass=kindergarten",intent:"pin-kindergarten",createdAt:new Date().toISOString()})));
    await familyPage.goto(base+"/Khaemenes_Academy.github.io/family/",{waitUntil:"domcontentloaded"});
    await familyPage.waitForSelector("#kindergartenPinReturn");
    const returnCopy=await familyPage.locator("#kindergartenPinReturn").innerText();
    assert.match(returnCopy,/Theo Kinder/);
    assert.match(returnCopy,/Continue to Kinder Garden & Pin Class/i);
    assert.equal(await familyPage.locator('#kindergartenPinReturn a[href*="Khaemenes_KinderGarden.github.io"]').count(),1);
    assert.deepEqual(familyErrors,[]);
    pass("Parent two-child Preschool-to-Kindergarten journey","Creates distinct Pre-K and Kindergarten records; active Kindergarten child is named in the return banner; pin handoff is preserved.");
    await familyContext.close();

    // Homeschool teacher journey: add five learners without blocking confirm
    // dialogs, then verify all five stay visible in the same family workspace.
    const teacherContext=await browser.newContext({viewport:{width:1200,height:900},reducedMotion:"reduce"});
    const teacherPage=await teacherContext.newPage();
    const teacherErrors=[];teacherPage.on("pageerror",e=>teacherErrors.push(e.message));
    await teacherPage.goto(base+"/Khaemenes_Academy.github.io/family/enroll/",{waitUntil:"domcontentloaded"});
    await teacherPage.locator("#familyName").fill("Five Learner Homeschool");
    await teacherPage.locator("#adultName").fill("Educator Test");
    await teacherPage.locator("#adultRole").selectOption("educator");
    await teacherPage.locator("#createFamily").click();
    const learnerFixtures=[
      {name:"Learner PreK",grade:"pre-k"},
      {name:"Learner Kinder",grade:"k"},
      {name:"Learner One",grade:"01"},
      {name:"Learner Two",grade:"02"},
      {name:"Learner Three",grade:"03"}
    ];
    for(let i=0;i<learnerFixtures.length;i++){
      const learner=learnerFixtures[i];
      await teacherPage.locator("#nickname").fill(learner.name);
      await teacherPage.locator("#grade").selectOption(learner.grade);
      await teacherPage.locator("#addLearner").click();
      if(i<learnerFixtures.length-1)await teacherPage.locator("#learnerAddedNotice").getByRole("button",{name:"Add Another Learner"}).click();
    }
    const learnerList=await teacherPage.locator("#existing").innerText();
    for(const learner of learnerFixtures)assert.ok(learnerList.includes(learner.name),"missing in enrollment list: "+learner.name);
    await teacherPage.goto(base+"/Khaemenes_Academy.github.io/family/",{waitUntil:"domcontentloaded"});
    await teacherPage.waitForSelector(".learner");
    assert.equal(await teacherPage.locator(".learner").count(),5,"Family Hub should render five individual learner cards");
    assert.deepEqual(teacherErrors,[]);
    pass("Homeschool educator five-learner journey","Educator creates one family, adds five learners consecutively without a blocking dialog, and sees all five cards in Family Hub.");
    await teacherContext.close();

    // Exercise the production-shaped home route with the actual shared Academy
    // header CSS and root-site toolbar JavaScript, not the hidden duplicate logo
    // or the older convenience copy bundled with this repository.
    const homeContext=await browser.newContext({viewport:{width:1123,height:820},reducedMotion:"reduce"});
    const homePage=await homeContext.newPage();
    const sharedHeaderCss=fs.readFileSync(path.join(root,"shared-academy","assets","khaemenes-global-header.css"),"utf8");
    const sharedToolbarJs=fs.readFileSync(path.join(root,"shared-verve","assets","vnv-beta-link.js"),"utf8");
    await homePage.route("https://vervenveda.com/Khaemenes_Academy.github.io/assets/khaemenes-global-header.css",route=>route.fulfill({status:200,contentType:"text/css",body:sharedHeaderCss}));
    await homePage.route(base+"/assets/vnv-beta-link.js",route=>route.fulfill({status:200,contentType:"application/javascript",body:sharedToolbarJs}));
    await homePage.route("https://vervenveda.com/assets/vnv-ecosystem-menu.js",route=>route.abort());
    await homePage.route("https://vervenveda.com/assets/vnv-ecosystem-menu.css",route=>route.abort());
    const homeErrors=[];homePage.on("pageerror",e=>homeErrors.push(e.message));
    await homePage.goto(base+"/Khaemenes_Preschool.github.io/",{waitUntil:"domcontentloaded"});
    await homePage.waitForTimeout(300);
    const sharedHeader=homePage.locator("[data-khae-header]");
    await sharedHeader.waitFor({state:"visible",timeout:5000});
    const brandMetrics=await homePage.evaluate(()=>{
      const header=document.querySelector("[data-khae-header]");
      const mark=header?.querySelector("[data-khae-brand-mark]");
      const actions=header?.querySelector("[data-khae-actions]");
      return {
        viewport:innerWidth,
        headerHeight:header?Math.round(header.getBoundingClientRect().height):0,
        brandMark:mark?{width:Math.round(mark.getBoundingClientRect().width),height:Math.round(mark.getBoundingClientRect().height),fontSize:getComputedStyle(mark).fontSize}:null,
        actionCount:actions?[...actions.children].filter(el=>getComputedStyle(el).display!=="none").length:0,
        primaryNavDisplay:header?getComputedStyle(header.querySelector("[data-khae-nav]")).display:"missing"
      };
    });
    assert.ok(brandMetrics.brandMark&&brandMetrics.brandMark.width>=51&&brandMetrics.brandMark.height>=51,"shared Academy logo should be visibly larger: "+JSON.stringify(brandMetrics));
    assert.ok(brandMetrics.headerHeight>=88,"global header should provide more vertical breathing room: "+JSON.stringify(brandMetrics));
    assert.equal(brandMetrics.primaryNavDisplay,"none","at the screenshot viewport, secondary links should use the menu instead of crowding the brand");
    assert.ok(brandMetrics.actionCount<=3,"medium-width header should keep only the primary actions visible");
    const rail=homePage.locator("#khaemenesLearnerUtilityToolbar");
    await rail.waitFor({state:"visible",timeout:5000});
    const inspectToolbar=()=>homePage.evaluate(()=>{
      const dock=document.querySelector("#khaemenesLearnerUtilityToolbar");
      return {viewport:innerWidth,dock:dock?{left:Math.round(dock.getBoundingClientRect().left),right:Math.round(dock.getBoundingClientRect().right),width:Math.round(dock.getBoundingClientRect().width),scrollWidth:dock.scrollWidth,clientWidth:dock.clientWidth}:null,
        buttons:dock?[...dock.querySelectorAll("button,a")].map(el=>({label:(el.innerText||el.getAttribute("aria-label")||"").trim(),width:Math.round(el.getBoundingClientRect().width),height:Math.round(el.getBoundingClientRect().height),scrollWidth:el.scrollWidth,clientWidth:el.clientWidth,whiteSpace:getComputedStyle(el).whiteSpace,overflow:getComputedStyle(el).overflow})):[]};
    });
    let dockMetrics=await inspectToolbar();
    assert.ok(dockMetrics.buttons.length>=3,"learner toolbar should include its profile, beta, and grown-up links");
    assert.ok(dockMetrics.dock.left>=0&&dockMetrics.dock.right<=1123,"toolbar must stay inside desktop viewport: "+JSON.stringify(dockMetrics));
    assert.ok(dockMetrics.buttons.every(b=>b.height>=44&&b.whiteSpace==="normal"&&b.overflow!=="hidden"),"desktop toolbar labels must wrap instead of clipping: "+JSON.stringify(dockMetrics));
    await homePage.setViewportSize({width:255,height:850});
    await homePage.waitForTimeout(120);
    dockMetrics=await inspectToolbar();
    assert.ok(dockMetrics.dock.left>=0&&dockMetrics.dock.right<=255,"mobile toolbar must stay inside 255px viewport: "+JSON.stringify(dockMetrics));
    assert.ok(dockMetrics.dock.scrollWidth<=dockMetrics.dock.clientWidth+1,"toolbar must not overflow horizontally: "+JSON.stringify(dockMetrics));
    assert.ok(dockMetrics.buttons.every(b=>b.height>=42&&b.whiteSpace==="normal"&&b.overflow!=="hidden"),"mobile toolbar labels must remain readable: "+JSON.stringify(dockMetrics));
    assert.ok((await homePage.evaluate(()=>document.documentElement.scrollWidth))<=256,"home page overflows horizontally at a 255px viewport");
    assert.deepEqual(homeErrors,[]);
    pass("Shared header and learner toolbar responsive layout","Production Academy masthead uses a larger logo and roomier row; redundant links collapse, toolbar labels wrap, and the dock fits 255px.");
    await homePage.close();
        await homeContext.close();
    await context.close();
  }finally{await browser.close()}
}finally{
  await new Promise(resolve=>server.close(resolve));
  fs.rmSync(temp,{recursive:true,force:true});
}
console.log(JSON.stringify({suite:"Preschool catalog browser smoke",categories:results.filter(x=>x.name.startsWith("Catalog category")).length,tests:results.length,results},null,2));
