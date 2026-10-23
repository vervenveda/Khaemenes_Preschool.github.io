import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { chromium } from "playwright";

const root=process.cwd();
const academy=path.join(root,"shared-academy");
const mime={".html":"text/html; charset=utf-8",".js":"text/javascript; charset=utf-8",".css":"text/css; charset=utf-8",".json":"application/json",".png":"image/png"};
const browser=await chromium.launch({headless:true});
const context=await browser.newContext({viewport:{width:1024,height:860},acceptDownloads:true,reducedMotion:"reduce"});
const page=await context.newPage();
const errors=[];
page.on("pageerror",err=>errors.push(err.message));
await page.route("https://vervenveda.com/**",async route=>{
 const pathname=new URL(route.request().url()).pathname;
 let home=root,local=pathname;
 if(pathname.startsWith("/Khaemenes_Preschool.github.io/"))local=pathname.slice("/Khaemenes_Preschool.github.io".length);
 else if(pathname.startsWith("/Khaemenes_Academy.github.io/")){home=academy;local=pathname.slice("/Khaemenes_Academy.github.io".length)}
 else return route.fulfill({status:404,body:"Unavailable in isolated smoke test"});
 let filename=path.resolve(home,"."+local);
 if(!filename.startsWith(home+path.sep)&&filename!==home)return route.fulfill({status:403,body:"Forbidden"});
 try{
  if(fs.statSync(filename).isDirectory())filename=path.join(filename,"index.html");
  const data=fs.readFileSync(filename);
  await route.fulfill({status:200,body:data,contentType:mime[path.extname(filename)]||"application/octet-stream"});
 }catch{await route.fulfill({status:404,body:"Not found"})}
});
const url="https://vervenveda.com/Khaemenes_Preschool.github.io/student-profile/";
try{
 await page.goto(url,{waitUntil:"domcontentloaded"});
 await page.waitForTimeout(100);
 assert.equal(await page.locator("#profileStudio").isVisible(),false,"no fabricated learner in guest mode");
 assert.match(await page.locator("#accountNote").innerText(),/No active Pre-K/);
 console.log("PASS guest boundary: no automatic account or phantom studio");
 const first=await page.evaluate(()=>{
  const R=window.KhaemenesFamilyRegistry;
  assert(R,"registry should load");
  const fam=R.createFamily({displayName:"Browser QA",adultName:"QA Parent"});
  const a=R.registerLearner({familyId:fam.familyId,nickname:"QA Sunshine",stage:"preschool",grade:"pre-k"});
  const b=R.registerLearner({familyId:fam.familyId,nickname:"QA Moonbeam",stage:"preschool",grade:"pre-k"});
  R.setActive({familyId:fam.familyId,learnerId:a.learnerId});
  return {a:a.learnerId,b:b.learnerId};
 });
 assert.equal(await page.locator("#childTitle").innerText(),"QA Sunshine");
 assert.equal(await page.locator("#learnerSelect option").count(),2);
 assert.equal(await page.locator("#profileStudio").isVisible(),true);
 await page.locator("#adultConfirm").check();
 await page.locator("#backgroundChoices button[data-theme='forest']").click();
 assert.equal(await page.locator("body").getAttribute("data-prek-background"),"forest");
 await page.reload({waitUntil:"domcontentloaded"});
 await page.waitForTimeout(80);
 assert.equal(await page.locator("body").getAttribute("data-prek-background"),"forest");
 assert.equal(await page.locator("#childTitle").innerText(),"QA Sunshine");
 console.log("PASS profile appearance persists on reload");
 await page.locator("#adultConfirm").check();
 await page.locator("#avatarChoices button[data-avatar='🦋']").click();
 assert.equal((await page.locator("#photoPreview").innerText()).trim(),"🦋");
 const tinyPng=Buffer.from("iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAusB9pXmKr8AAAAASUVORK5CYII=","base64");
 await page.locator("#childPhoto").setInputFiles({name:"qa.png",mimeType:"image/png",buffer:tinyPng});
 await page.locator("#photoPreview img").waitFor({state:"attached",timeout:3000});
 assert.match(await page.locator("#photoPreview img").getAttribute("src"),/^data:image\/jpeg;base64,/);
 console.log("PASS photo upload converts to browser-local JPEG preview");
 await page.locator("#pv2Goal").fill("Sing the ABC song");
 await page.locator("#pv2SaveCompass").click();
 await page.locator("#learnerSelect").selectOption(first.b);
 assert.equal(await page.locator("#childTitle").innerText(),"QA Moonbeam");
 assert.equal(await page.locator("#photoPreview img").count(),0);
 assert.equal(await page.locator("body").getAttribute("data-prek-background"),"sky");
 assert.notEqual(await page.locator("#pv2Goal").inputValue(),"Sing the ABC song");
 await page.locator("#adultConfirm").check();
 await page.locator("#backgroundChoices button[data-theme='ocean']").click();
 await page.locator("#learnerSelect").selectOption(first.a);
 assert.equal(await page.locator("body").getAttribute("data-prek-background"),"forest");
 assert.equal(await page.locator("#photoPreview img").count(),1);
 assert.equal(await page.locator("#pv2Goal").inputValue(),"Sing the ABC song");
 console.log("PASS same-family learner switch isolates photos, themes, and Academy goals");
 const download=page.waitForEvent("download");
 await page.locator("#exportLook").click();
 const exported=await download;
 assert.match(exported.suggestedFilename(),/^khaemenes-prek-visual-.*\.json$/);
 console.log("PASS visual bundle export");
 assert.deepEqual(errors,[],"uncaught JavaScript errors: "+JSON.stringify(errors));
 console.log("PASS complete Pre-K profile browser smoke");
}finally{await context.close();await browser.close()}
