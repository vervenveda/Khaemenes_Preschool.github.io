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

 await openPanel("pinsTitle");
 const pins=page.locator("#prek-panel-pinsTitle");
 const favoriteId=await page.evaluate(()=>window.KhaemenesPreschoolCatalog.childActivities()[0].id);
 await pins.locator("#adventureSelect").selectOption(favoriteId);
 await pins.locator("#pinAdventure").click();
 assert.match(await pins.locator("#pinStatus").innerText(),/pinned/i);
 await pins.locator("#unpinAdventure").click();
 assert.match(await pins.locator("#pinStatus").innerText(),/unpinned|removed|no longer pinned/i);
 console.log("PASS favorite-game pin and unpin controls on registered test learner");

 await pins.locator(".prek-pop-close").click();
 await openPanel("kindergartenHandoff");
 const graduation=page.locator("#prek-panel-kindergartenHandoff");
 await graduation.locator("#showHandoff").click();
 assert.equal(await graduation.locator("#showHandoff").getAttribute("aria-expanded"),"true");
 console.log("PASS Kindergarten preview action without promotion");
 assert.deepEqual(errors,[],"uncaught client JS: "+JSON.stringify(errors));
 console.log("PASS complete Pre-K Student Profile click-through and landing audit");
}finally{await context.close();await browser.close()}
