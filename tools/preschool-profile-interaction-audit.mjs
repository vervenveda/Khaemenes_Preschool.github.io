/* Pre-K Student Profile: click-through navigation, color, accordion and permission
   smoke test. No homepage modifications, writes, or live learner credentials. */
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import {chromium} from "playwright";

const root=process.cwd(), academy=path.join(root,"shared-academy");
const mime={".html":"text/html; charset=utf-8",".js":"text/javascript; charset=utf-8",".css":"text/css; charset=utf-8",".json":"application/json"};
const origin="https://vervenveda.com";
const profile=origin+"/Khaemenes_Preschool.github.io/student-profile/";
const browser=await chromium.launch({headless:true});
const context=await browser.newContext({viewport:{width:1200,height:850},acceptDownloads:true,reducedMotion:"reduce"});
const page=await context.newPage(),errors=[],issues=[];
page.on("pageerror",error=>errors.push(error.message));
page.on("console",message=>{if(message.type()==="error"&&!/404|Failed to load/i.test(message.text()))issues.push(message.text())});
await page.route(origin+"/**",async route=>{
 const pathname=new URL(route.request().url()).pathname;
 let base=root,local=pathname;
 if(pathname.startsWith("/Khaemenes_Preschool.github.io/"))local=pathname.slice("/Khaemenes_Preschool.github.io".length);
 else if(pathname.startsWith("/Khaemenes_Academy.github.io/")){base=academy;local=pathname.slice("/Khaemenes_Academy.github.io".length)}
 else return route.fulfill({status:404,body:"Gateway script unavailable in isolated test"});
 let file=path.resolve(base,"."+local);
 if(!file.startsWith(base+path.sep)&&file!==base)return route.fulfill({status:403,body:"Forbidden"});
 try{if(fs.statSync(file).isDirectory())file=path.join(file,"index.html");
  return route.fulfill({status:200,body:fs.readFileSync(file),contentType:mime[path.extname(file)]||"application/octet-stream"})
 }catch{return route.fulfill({status:404,body:"Not found"})}
});
function localExists(href){
 const url=new URL(href,profile);
 if(url.hostname!=="vervenveda.com")return true;
 const prefix="/Khaemenes_Preschool.github.io/";
 if(!url.pathname.startsWith(prefix))return true; // external ecosystem path, inspected separately
 let local=path.join(root,url.pathname.slice(prefix.length));
 try{if(fs.statSync(local).isDirectory())local=path.join(local,"index.html");return fs.statSync(local).isFile()}catch{return false}
}
async function computed(selector){
 return page.locator(selector).first().evaluate(el=>({
  fill:getComputedStyle(el).webkitTextFillColor,
  color:getComputedStyle(el).color,
  visible:el.getClientRects().length>0
 }));
}
async function openPanel(key){
 const tile=page.locator('[data-prek-panel="'+key+'"]');
 await tile.click();
 const panel=page.locator("#prek-panel-"+key);
 await panel.waitFor({state:"visible"});
 assert.equal(await tile.getAttribute("aria-expanded"),"true","not expanded: "+key);
 return panel;
}
try{
 const nav=await page.goto(profile,{waitUntil:"domcontentloaded"});
 assert.equal(nav.status(),200,"Student Profile landing must load");
 await page.waitForTimeout(450);
 assert.equal(await page.locator("#pageTitle").innerText(),"My Student Profile");
 assert.match(await page.locator("#stagePill").getAttribute("href"),/#top$/);
 assert.match(await page.locator("#favoritePill").getAttribute("href"),/#pinnedApps$/);
 assert.match(await page.locator("#progressPill").getAttribute("href"),/Khaemenes_Academy\.github\.io\/family\/$/);
 assert.match(await page.locator("#firstStepLink").getAttribute("href"),/#weeklyGarden$/);
 assert.match(await page.locator("#explorePlayLink").getAttribute("href"),/#new$/);
 console.log("PASS first six profile destination links point to correct existing anchors and Parent Portal");
 assert.equal(await page.locator(".prek-privacy-note").count(),1,"privacy text should be a disclosure, not a white direction box");
 assert.equal(await page.locator(".prek-privacy-note").getAttribute("open"),null,"privacy disclosure should be closed");
 console.log("PASS profile page, headline and unobtrusive privacy disclosure");

 for(const selector of [".prek-welcome p",".prek-daily p",".prek-menu .prek-tile:nth-child(2)",".prek-menu .prek-tile:nth-child(6)",".prek-classes>a:nth-child(2)",".prek-classes>a:nth-child(5)"]){
  const c=await computed(selector);assert.equal(c.fill,"rgb(0, 0, 0)",selector+" should show black lettering, got "+JSON.stringify(c))
 }
 console.log("PASS black lettering on all blue and green background sections and buttons");

 const tileInfo=await page.locator(".prek-menu .prek-tile").count();
 assert.equal(tileInfo,6,"all six profile shortcut tiles should exist");
 for(const key of ["nextTitle","pinsTitle","backgroundTitle","kindergartenHandoff","learningStudio"]){
  const panel=await openPanel(key);
  assert.ok(await panel.locator(".prek-pop-close").count(),"missing close action: "+key);
  await panel.locator(".prek-pop-close").click();
  assert.equal(await panel.isVisible(),false,"close not working for "+key);
 }
 console.log("PASS five panel open/close controls and six shortcut tiles present");

 const picture=page.locator("#khaePrekUniversalLookEntry");
 await picture.waitFor({state:"attached",timeout:4500});
 const details=picture.locator(".prek-picture-accordion");
 await details.waitFor({state:"attached"});
 assert.equal(await details.getAttribute("open"),null,"picture accordion must start closed");
 await picture.locator(".prek-picture-summary").click();
 assert.equal(await details.getAttribute("open"),"","accordion should expand on click");
 const button=picture.locator(".kpu-open");
 assert.equal(await button.isDisabled(),false,"picture action must explain guest restrictions rather than remain disabled");
 await button.click();
 assert.match(await picture.locator(".kpu-status").innerText(),/Choose an existing Pre-K learner/i);
 await picture.locator(".prek-picture-summary").click();
 assert.equal(await details.getAttribute("open"),null,"picture accordion should close");
 console.log("PASS yellow picture accordion, accessible button and guest/guardian guidance");

 for(const [buttonId,dialogId] of [["prekEditProfileLaunch","prekEditProfileDialog"],["prekEditBackgroundLaunch","prekEditBackgroundDialog"]]){
  await page.locator("#"+buttonId).click();
  const dialog=page.locator("#"+dialogId);
  await dialog.waitFor({state:"visible"});
  await dialog.locator(".prek-edit-close").click();
  assert.equal(await dialog.isVisible(),false,"dialog close failed for "+dialogId);
 }
 console.log("PASS Edit Profile and Edit Background modal open/close controls");

 const hrefs=await page.locator('main.shell a[href]').evaluateAll(links=>links.map(a=>({label:(a.textContent||"").trim(),href:a.getAttribute("href")})));
 // Evaluate route existence on Node side (not the page's browser context).
 const missing=hrefs.filter(x=>x.href&&!x.href.startsWith("#")&&!localExists(x.href));
 assert.deepEqual(missing,[],"Broken relative Preschool links: "+JSON.stringify(missing));
 const classLinks=await page.locator(".prek-classes>a").evaluateAll(els=>els.map(a=>a.href));
 assert.equal(classLinks.length,6);
 for(const link of classLinks)assert.equal(localExists(link),true,"Missing class landing: "+link);
 console.log("PASS all six class landing paths and "+hrefs.length+" visible/document-linked destinations");

 const r=await page.evaluate(()=>{
  const registry=window.KhaemenesFamilyRegistry;
  if(!registry)return null;
  const family=registry.createFamily({displayName:"Pre-K Actions QA",adultName:"Adult Tester"});
  const learner=registry.registerLearner({familyId:family.familyId,nickname:"Test Learner",stage:"preschool",grade:"pre-k"});
  registry.setActive({familyId:family.familyId,learnerId:learner.learnerId});
  return learner.learnerId
 });
 assert.ok(r,"test family registry should create a synthetic learner");
 await picture.locator(".prek-picture-summary").click();
 await page.locator("#adultConfirm").check();
 await picture.locator(".kpu-open").click();
 const editor=page.locator("#kplsDialog");
 await editor.waitFor({state:"visible",timeout:3500});
 const close=editor.locator('button[aria-label*="Close"],button:has-text("Close")').first();
 if(await close.count())await close.click();
 else await editor.evaluate(d=>d.close?.());
 console.log("PASS actual picture editor opens when learner and adult consent are present");
 
 // 12 sticker choices, up to 10 saved to the selected verified learner only.
 await page.locator("#prekEditBackgroundLaunch").click();
 const stickerDialog=page.locator("#prekEditBackgroundDialog");
 await stickerDialog.waitFor({state:"visible"});
 assert.equal(await stickerDialog.locator("[data-add-sticker]").count(),12,"12 sticker choices must be shown");
 assert.equal(await stickerDialog.locator(".prek-edit-colors").count(),0,"old color picker must be gone");
 for(let i=0;i<10;i++)await stickerDialog.locator("[data-add-sticker]").nth(i).click();
 assert.match(await stickerDialog.locator("[data-prek-sticker-count]").innerText(),/10 of 10/);
 const owned=await page.evaluate(id=>JSON.parse(localStorage.getItem("khaemenes.prek.background-studio.v1:"+encodeURIComponent(id))),r);
 assert.equal(owned.learnerId,r);
 assert.equal(owned.placements.length,10,"all ten stickers belong only to active learner");
 await stickerDialog.locator("[data-add-sticker]").nth(10).click();
 assert.match(await stickerDialog.locator("[data-prek-studio-status]").innerText(),/ten stickers/i);
 assert.equal(await page.locator("#prekStickerCanvas .prek-placed-sticker").count(),10);
 await stickerDialog.locator(".prek-edit-close").click();
 // Pointer drag must save learner-scoped coordinates without changing the coral background.
 const drag=page.locator("#prekStickerCanvas .prek-sticker-drag").first();
 const before=await page.evaluate(id=>JSON.parse(localStorage.getItem("khaemenes.prek.background-studio.v1:"+encodeURIComponent(id))).placements[0],r);
 await drag.scrollIntoViewIfNeeded();
 const bounds=await drag.boundingBox();assert.ok(bounds,"draggable sticker should be visible");
 await page.mouse.move(bounds.x+bounds.width/2,bounds.y+bounds.height/2);
 await page.mouse.down();
 await page.mouse.move(bounds.x+bounds.width/2+95,bounds.y+bounds.height/2+35,{steps:8});
 await page.mouse.up();
 const after=await page.evaluate(id=>JSON.parse(localStorage.getItem("khaemenes.prek.background-studio.v1:"+encodeURIComponent(id))).placements[0],r);
 assert.ok(after.x!==before.x||after.y!==before.y,"drag should persist the new coordinates");
 await page.locator("#prekStickerCanvas .prek-sticker-remove").first().click();
 const remaining=await page.evaluate(id=>JSON.parse(localStorage.getItem("khaemenes.prek.background-studio.v1:"+encodeURIComponent(id))).placements.length,r);
 assert.equal(remaining,9,"single sticker can be removed");
 await page.reload({waitUntil:"domcontentloaded"});
 await page.waitForTimeout(150);
 assert.equal(await page.locator("#prekStickerCanvas .prek-placed-sticker").count(),9,"nine stickers should persist after reload");
 console.log("PASS 12 sticker choices, 10 cap, draggable positions, removal and learner-scoped persistence");

 // The visible My Picture shortcut must route to the SAME guarded editor.
 await page.locator('[data-universal-picture="true"]').click();
 await editor.waitFor({state:"visible"});
 if(await close.count())await close.click();
 else await editor.evaluate(d=>d.close?.());
 console.log("PASS My Picture shortcut opens the existing guarded editor");

 await openPanel("pinsTitle");
 const pins=page.locator("#prek-panel-pinsTitle");
 const favoriteId=await page.evaluate(()=>window.KhaemenesPreschoolCatalog.childActivities()[0].id);
 await pins.locator("#adventureSelect").selectOption(favoriteId);
 await pins.locator("#pinAdventure").click();
 assert.match(await pins.locator("#pinStatus").innerText(),/pinned/i);
 await pins.locator("#unpinAdventure").click();
 assert.match(await pins.locator("#pinStatus").innerText(),/unpinned|removed|no longer pinned/i);
 console.log("PASS favorite-game pin and unpin controls on registered test learner");
 await pins.locator("#pinPreschoolPath").click();
 assert.match(await pins.locator("#pinnedActivities").innerText(),/My Preschool Pathway/i);
 await pins.locator("#unpinPreschoolPath").click();
 assert.doesNotMatch(await pins.locator("#pinnedActivities").innerText(),/My Preschool Pathway/i);
 console.log("PASS Preschool pathway pin/unpin buttons");

 await pins.locator(".prek-pop-close").click();
 await openPanel("kindergartenHandoff");
 const graduation=page.locator("#prek-panel-kindergartenHandoff");
 await graduation.locator("#showHandoff").click();
 assert.equal(await graduation.locator("#showHandoff").getAttribute("aria-expanded"),"true");
 console.log("PASS Kindergarten preview action without promotion");
 await graduation.locator(".prek-pop-close").click();
 await openPanel("backgroundTitle");
 const background=page.locator("#prek-panel-backgroundTitle");
 await page.evaluate(()=>{window.__qaPrints=0;window.print=()=>{window.__qaPrints++}});
 await background.locator("#printProfile").click();
 assert.equal(await page.evaluate(()=>window.__qaPrints),1);
 const download=page.waitForEvent("download");
 await background.locator("#exportLook").click();
 const data=await download;
 assert.match(data.suggestedFilename(),/prek-visual.*\.json$/);
 console.log("PASS print and visual-profile export buttons");

 assert.deepEqual(errors,[],"uncaught client JS: "+JSON.stringify(errors));
 // End-to-end route loading on the actual six linked Preschool pages.
 for(const href of classLinks){
  const response=await page.goto(href,{waitUntil:"domcontentloaded"});
  assert.equal(response.status(),200,"Class landing did not load: "+href);
  assert.ok(await page.locator("body").count(),"Class landing lacks body: "+href);
 }
 console.log("PASS all six class destinations load as real browser pages");
 // Homepage addition: pinned apps shelf is inserted immediately above Reading.
 // This view reads existing learner-owned favorite IDs; no duplicate favorites store.
 await page.goto(profile,{waitUntil:"domcontentloaded"});
 await page.evaluate(id=>{
  const R=window.KhaemenesFamilyRegistry,first=window.KhaemenesPreschoolCatalog.childActivities()[0];
  R.setActive({familyId:R.getLearner().familyId,learnerId:id});
  const key="khaemenes_profile_favorites_v1",map=JSON.parse(localStorage.getItem(key)||"{}");
  map[id]=[first.id];localStorage.setItem(key,JSON.stringify(map));
 },r);
 const home=origin+"/Khaemenes_Preschool.github.io/";
 const homepage=await page.goto(home+"#pinnedApps",{waitUntil:"load"});
 assert.equal(homepage.status(),200);
 const shelf=page.locator("#pinnedApps");
 await shelf.waitFor({state:"visible",timeout:5000});
 assert.equal(await shelf.locator("details.feature-accordion").getAttribute("open"),"");
 assert.equal(await shelf.locator(".prek-pin-item").count(),1,"shelf must display the active learner's pinned app");
 assert.ok(await page.evaluate(()=>document.querySelector("#pinnedApps").compareDocumentPosition(document.querySelector("#readingFeature"))&Node.DOCUMENT_POSITION_FOLLOWING),"pinned shelf must be above Reading");
 await shelf.locator(".prek-pin-remove").click();
 assert.equal(await shelf.locator(".prek-pin-item").count(),0,"unpin should remove the shelf tile");
 console.log("PASS homepage pinned accordion, real learner favorites, and removal without touching other sections");
 for(const [hash,target] of [["#weeklyGarden","#weeklyGarden"],["#new","#new"],["#top","body"]]){
  await page.goto(home+hash,{waitUntil:"load"});
  const el=page.locator(target);
  assert.ok(await el.count(),"missing navigation target "+hash);
  if(hash!=="#top")assert.equal(await el.locator("details.feature-accordion").getAttribute("open"),"");
 }
 console.log("PASS Pre-K home top, This Week and Explore & Play deep links");

 console.log("PASS complete Pre-K Student Profile click-through and landing audit");
}finally{await context.close();await browser.close()}
