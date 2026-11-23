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
  // External canonical header, ticker and translator are not the subject of
  // this test. They must have their separate integration checks.
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
 assert.equal(await page.locator(".discover-lesson").count(),5);
 assert.equal(await page.locator("#discoveryWeekSelect option").count(),42);
 assert.match(await page.locator("#discoveryWeekTheme").innerText(),/Welcome to Our Learning Garden/);
 assert.equal(await page.locator("#day1").getAttribute("open"),"");
 console.log("PASS five days, canonical Week 1 and 42-week selector");

 const bg=await page.locator("body").evaluate(el=>getComputedStyle(el).backgroundColor);
 assert.equal(bg,"rgb(36, 48, 56)","charcoal background should match homepage");
 for(const sel of [".discover-hero",".discover-summary",".discover-week",".discover-lesson"]){
  const bw=await page.locator(sel).first().evaluate(el=>getComputedStyle(el).borderTopWidth);
  assert.equal(bw,"5px",sel+" should have a five-pixel frame");
 }
 console.log("PASS charcoal and rainbow layout with 5px section borders");

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
