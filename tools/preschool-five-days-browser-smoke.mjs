/* Browser regression for the isolated five-day Preschool weekly engine.
   Uses local repository files; no live learner data or external network reads. */
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import {chromium} from "playwright";

const root=process.cwd();
const origin="https://vervenveda.com";
const url=origin+"/Khaemenes_Preschool.github.io/learning/five-days-of-discovery.html";
const mime={".html":"text/html; charset=utf-8",".css":"text/css; charset=utf-8",".js":"text/javascript; charset=utf-8",".json":"application/json"};
const browser=await chromium.launch({headless:true});
const context=await browser.newContext({viewport:{width:1280,height:900},reducedMotion:"reduce"});
const page=await context.newPage();
const errors=[];
page.on("pageerror",e=>errors.push(e.message));
await page.route(origin+"/**",async route=>{
 const url=new URL(route.request().url());
 const prefix="/Khaemenes_Preschool.github.io/";
 if(!url.pathname.startsWith(prefix)){
  // Load the real canonical VNV header and ticker, checked out by this workflow.
  if(url.pathname==="/assets/vnv-header-autopopulate.js"||
     url.pathname==="/assets/vnv-ticker-autopopulate.js"){
   const local=path.resolve(root,"shared-vnv","."+url.pathname);
   return route.fulfill({status:200,contentType:"text/javascript; charset=utf-8",body:fs.readFileSync(local)});
  }
  // Other shared services are out of scope for this isolated lesson-engine test.
  return route.fulfill({status:200,contentType:"text/javascript; charset=utf-8",body:""});
 }
 const local=decodeURIComponent(url.pathname.slice(prefix.length));
 let file=path.resolve(root,local);
 if(!file.startsWith(root+path.sep))return route.fulfill({status:403,body:"Forbidden"});
 try{
  if(fs.statSync(file).isDirectory())file=path.join(file,"index.html");
  return route.fulfill({status:200,contentType:mime[path.extname(file)]||"application/octet-stream",body:fs.readFileSync(file)});
 }catch{return route.fulfill({status:404,body:"Not found: "+local})}
});
function exists(link){
 const url=new URL(link);
 const pre="/Khaemenes_Preschool.github.io/";
 if(!url.pathname.startsWith(pre))return true;
 let p=path.resolve(root,decodeURIComponent(url.pathname.slice(pre.length)));
 try{if(fs.statSync(p).isDirectory())p=path.join(p,"index.html");return fs.statSync(p).isFile()}catch{return false}
}
try{
 const resp=await page.goto(url,{waitUntil:"load"});
 assert.equal(resp.status(),200);
 const ticker=page.locator("#vnvTickerAutoPopulate");
 const header=page.locator("#vnvHeaderAutoPopulate");
 await ticker.waitFor({state:"attached"});
 await header.waitFor({state:"attached"});
 const fullWidth=await page.evaluate(()=>{
  const ticker=document.getElementById("vnvTickerAutoPopulate");
  const header=document.getElementById("vnvHeaderAutoPopulate");
  const lessons=document.querySelector(".discover-shell");
  const t=ticker.getBoundingClientRect(),h=header.getBoundingClientRect(),m=lessons.getBoundingClientRect();
  return {tickerParent:ticker.parentElement===document.body,headerParent:header.parentElement===document.body,
   tickerWidth:t.width,headerWidth:h.width,lessonWidth:m.width,viewport:document.documentElement.clientWidth,
   tickerBeforeHeader:ticker.nextElementSibling===header};
 });
 assert.equal(fullWidth.tickerParent,true,"ticker must mount directly under body");
 assert.equal(fullWidth.headerParent,true,"header must mount directly under body");
 assert.ok(fullWidth.tickerWidth>=fullWidth.viewport-3,"ticker fails full width: "+JSON.stringify(fullWidth));
 assert.ok(fullWidth.headerWidth>=fullWidth.viewport-3,"header fails full width: "+JSON.stringify(fullWidth));
 assert.ok(fullWidth.lessonWidth<fullWidth.viewport-100,"lesson cards should remain centered, not stretch full width");
 assert.equal(fullWidth.tickerBeforeHeader,true,"one ticker followed by one canonical header");
 assert.equal(await ticker.count(),1);
 assert.equal(await header.count(),1);
 console.log("PASS real canonical ticker and header full width; centered lesson content retained");
 assert.equal(await page.locator(".discover-lesson").count(),5);
 assert.equal(await page.locator("#discoveryWeekSelect option").count(),42);
 assert.match(await page.locator("#discoveryWeekTheme").innerText(),/Welcome to Our Learning Garden/);
 assert.equal(await page.locator("#day1").getAttribute("open"),"");
 console.log("PASS five days, canonical Week 1 and 42-week selector");
 // The shared VNV translator skips OPTION nodes: the weekly engine must
 // translate the native options and regenerated status itself.
 await page.evaluate(()=>{
  document.documentElement.lang="bn";
  document.dispatchEvent(new CustomEvent("vnv:language-change",{detail:{language:"bn"}}));
 });
 assert.match(await page.locator("#discoveryWeekSelect option").first().innerText(),/সপ্তাহ/);
 assert.match(await page.locator("#discoveryWeekCount").innerText(),/সপ্তাহ/);
 assert.match(await page.locator("#discoveryStatus").innerText(),/প্রস্তুত/);
 await page.locator("#discoveryWeekSelect").selectOption("7");
 assert.match(await page.locator("#discoveryStatus").innerText(),/7তম সপ্তাহ প্রস্তুত/);
 await page.evaluate(()=>{
  document.documentElement.lang="en";
  document.dispatchEvent(new CustomEvent("vnv:language-change",{detail:{language:"en"}}));
 });
 assert.equal(await page.locator("#discoveryWeekSelect option").first().innerText(),"Week 1");
 assert.match(await page.locator("#discoveryStatus").innerText(),/Week 7 is ready/);
 await page.locator("#discoveryWeekSelect").selectOption("1");
 console.log("PASS Bengali week dropdown and status, switching weeks, returning to English");


 const bg=await page.locator("body").evaluate(el=>getComputedStyle(el).backgroundColor);
 assert.equal(bg,"rgb(36, 48, 56)","charcoal background should match homepage");
 for(const sel of [".discover-hero",".discover-summary",".discover-week",".discover-lesson"]){
  const bw=await page.locator(sel).first().evaluate(el=>getComputedStyle(el).borderTopWidth);
  assert.equal(bw,"5px",sel+" should have a five-pixel frame");
 }
 console.log("PASS charcoal and rainbow layout with 5px section borders");
 // The page loads the shared Preschool color contract via its existing
 // language loader, not a duplicate stylesheet or another translator.
 await page.waitForFunction(()=>[...document.querySelectorAll('link[rel="stylesheet"]')].some(
  link=>link.href.includes("preschool-shared-chrome.css")
 ),null,{timeout:5000});
 const cream=await page.evaluate(()=>{
  const color=selector=>getComputedStyle(document.querySelector(selector)).color;
  return {
   purple:color(".discover-summary"),
   coral:color(".discover-parent"),
   orange:color("#day5"),
   violetPlay:color(".discover-play.primary"),
   yellow:color(".discover-hero"),
   aqua:color(".discover-week")
  };
 });
 for(const key of ["purple","coral","orange","violetPlay"])
  assert.equal(cream[key],"rgb(255, 251, 234)",key+" should display approved cream lettering");
 for(const key of ["yellow","aqua"])
  assert.equal(cream[key],"rgb(0, 0, 0)",key+" should preserve dark lettering");
 console.log("PASS shared cream text contract on purple/coral/orange, with yellow/aqua dark");


 await page.locator(".discover-day-nav a[href='#day4']").click();
 await page.waitForFunction(()=>document.getElementById("day4").open&&!document.getElementById("day1").open,null,{timeout:3000});
 assert.equal(await page.locator("#day4").getAttribute("open"),"");
 assert.equal(await page.locator("#day1").getAttribute("open"),null);
 console.log("PASS day navigation and expandable lesson sections");

 await page.locator("#discoveryWeekSelect").selectOption("19");
 assert.match(await page.locator("#discoveryWeekTheme").innerText(),/Moon and Night Sky/);
 assert.equal(await page.evaluate(()=>localStorage.getItem("khaemenes.preschool.week")),"19");
 assert.match(page.url(),/week=19/);
 for(const link of await page.locator(".discover-play:not([hidden])").evaluateAll(nodes=>nodes.map(a=>a.href))){
  assert.equal(exists(link),true,"linked curriculum activity file missing: "+link);
 }
 console.log("PASS Week 19 themes, learner-free week continuity and real app destinations");

 await page.reload({waitUntil:"load"});
 assert.equal(await page.locator("#discoveryWeekSelect").inputValue(),"19");
 await page.locator("#discoveryNext").click();
 assert.equal(await page.locator("#discoveryWeekSelect").inputValue(),"20");
 await page.locator("#discoveryPrev").click();
 assert.equal(await page.locator("#discoveryWeekSelect").inputValue(),"19");
 await page.locator("#discoveryWeekSelect").selectOption("42");
 assert.match(await page.locator("#discoveryWeekTheme").innerText(),/Ready for the Next Garden/);
 await page.locator("#discoveryNext").click();
 assert.equal(await page.locator("#discoveryWeekSelect").inputValue(),"1");
 console.log("PASS persistence, previous/next, and Week 42-to-1 wraparound");

 const allLabels=await page.locator(".discover-play:not([hidden])").evaluateAll(nodes=>nodes.map(a=>a.textContent.trim()));
 assert.ok(allLabels.length>=5);
 assert.ok(allLabels.every(x=>x==="PLAY"),"child-facing activity links all say PLAY");
 const nav=await page.locator(".discover-foot a").getAttribute("href");
 assert.equal(nav,"../#weeklyGarden");
 assert.deepEqual(errors,[],"uncaught JS errors: "+JSON.stringify(errors));
 console.log("PASS five-day weekly engine interaction audit");
}finally{await context.close();await browser.close()}
