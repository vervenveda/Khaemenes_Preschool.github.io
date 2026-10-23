import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import http from "node:http";
import { fileURLToPath } from "node:url";
import { chromium } from "playwright";

const root=process.cwd();
const temp=fs.mkdtempSync(path.join(os.tmpdir(),"prek-pe-browser-"));
const mime={".html":"text/html; charset=utf-8",".js":"text/javascript; charset=utf-8",".css":"text/css; charset=utf-8",".json":"application/json; charset=utf-8",".svg":"image/svg+xml"};
const server=http.createServer((req,res)=>{
  let pathname;
  try{pathname=decodeURIComponent(new URL(req.url,"http://127.0.0.1").pathname)}catch{res.writeHead(400);res.end("Bad URL");return}
  const file=path.resolve(root,"."+pathname);
  if(!file.startsWith(root+path.sep)&&file!==root){res.writeHead(403);res.end("Forbidden");return}
  let target=file;
  try{if(fs.statSync(target).isDirectory())target=path.join(target,"index.html")}catch{}
  fs.readFile(target,(err,data)=>{
    if(err){res.writeHead(404);res.end("Not found");return}
    res.writeHead(200,{"Content-Type":mime[path.extname(target)]||"application/octet-stream","Cache-Control":"no-store"});
    res.end(data);
  });
});
await new Promise(resolve=>server.listen(0,"127.0.0.1",resolve));
const address=server.address();
const base=`http://127.0.0.1:${address.port}`;
const url=base+"/apps/PE_move_n_groove_index.html";
const browser=await chromium.launch({headless:true});
const results=[];
function pass(name,detail=""){results.push({name,result:"PASS",detail})}
try{
  const context=await browser.newContext({viewport:{width:800,height:900},reducedMotion:"reduce",acceptDownloads:true});
  const page=await context.newPage();
  await page.goto(url,{waitUntil:"domcontentloaded"});
  await page.evaluate(()=>localStorage.setItem("khaemenes_preschool_profile_v1",JSON.stringify({learnerId:"browser-test-learner-A"})));
  await page.reload({waitUntil:"domcontentloaded"});
  await page.locator("#autoReadBtn").click();
  assert.match(await page.locator("#autoReadBtn").innerText(),/Auto Read Off/);
  pass("Initial page and learner A profile", "PE portal loads; local learner identity is active.");

  // Test 255px viewport and reduced-motion preference.
  await page.setViewportSize({width:255,height:850});
  await page.waitForTimeout(150);
  const dimensions=await page.evaluate(()=>({width:innerWidth,documentWidth:document.documentElement.scrollWidth,bodyWidth:document.body.scrollWidth,reduced:matchMedia("(prefers-reduced-motion: reduce)").matches,animation:getComputedStyle(document.querySelector(".mascot")).animationDuration}));
  assert.ok(dimensions.documentWidth<=dimensions.width+1,JSON.stringify(dimensions));
  assert.ok(dimensions.bodyWidth<=dimensions.width+1,JSON.stringify(dimensions));
  assert.equal(dimensions.reduced,true);
  assert.ok(parseFloat(dimensions.animation)<=0.001,JSON.stringify(dimensions));
  pass("255px narrow viewport and reduced motion",JSON.stringify(dimensions));

  // Keyboard activation: focus and activate a user-facing toggle.
  await page.setViewportSize({width:800,height:900});
  const largeType=page.locator("#largeTypeBtn");
  await largeType.focus();
  assert.equal(await largeType.evaluate(el=>el===document.activeElement),true);
  await page.keyboard.press("Enter");
  assert.equal(await page.locator("body").evaluate(el=>el.classList.contains("large-type")),true);
  pass("Keyboard focus and activation","Large-type toggle can be focused and activated using Enter.");

  // Open first lesson, pause an actual running timer, and verify it remains paused.
  await page.locator(".lesson-card").first().click();
  await page.locator("#startTimerBtn").click();
  await page.waitForTimeout(1300);
  await page.locator("#pauseBtn").click();
  const pausedAt=await page.locator("#timer").innerText();
  await page.waitForTimeout(1300);
  const pausedAfter=await page.locator("#timer").innerText();
  assert.equal(pausedAfter,pausedAt,"timer continued to change after pause");
  assert.match(await page.locator("#timerLabel").innerText(),/Paused/);
  pass("Timer interruption and pause","Timer stops changing after Pause.");

  // Move through warm-up, activity and cool-down phases, then answer learning check.
  await page.locator("#nextPhaseBtn").click();
  await page.locator("#nextPhaseBtn").click();
  await page.locator("#nextPhaseBtn").click();
  assert.equal(await page.locator("#checkPanel").isVisible(),true);
  let turns=0;
  while(!(await page.locator("#nextPhaseBtn").isEnabled())&&turns<3){
    const option=page.locator("#checkOptions .option:not([disabled])").first();
    assert.ok(await option.count(),"no enabled learning-check option remains");
    await option.click();
    turns++;
  }
  assert.equal(await page.locator("#nextPhaseBtn").isEnabled(),true,"learning check did not resolve");
  await page.locator("#nextPhaseBtn").click();
  await page.waitForFunction(()=>document.querySelectorAll("#evidenceRecordSelect option").length>=1);
  assert.equal(await page.locator("#completeStat").innerText(),"1");
  assert.equal(await page.locator("#evidenceRecordSelect option").count(),1);
  const recordedCheck=await page.locator("#evidenceList").innerText();
  assert.match(recordedCheck,/Learning check: (correct|reviewed-after-help)/);
  pass("Complete lesson and create evidence","A lesson completion record distinguishes participation and the learning-check outcome.");

  // Adult observations save to the selected record.
  await page.locator("#evidenceObservation").selectOption("observed");
  await page.locator("#evidenceAdaptation").fill("Visual cue; supported seated choice offered.");
  await page.locator("#evidenceNextStep").fill("Repeat with a clear path and a grown-up nearby.");
  await page.locator("#saveEvidenceBtn").click();
  assert.match(await page.locator("#evidenceStatus").innerText(),/Observation saved locally/);
  assert.match(await page.locator("#evidenceList").innerText(),/Adult observation: observed/);
  assert.match(await page.locator("#evidenceList").innerText(),/Visual cue/);
  pass("Save adult observation","Observation, adaptation, and next step appear in the record.");

  // Export a genuine browser download and validate its payload.
  const downloadPromise=page.waitForEvent("download");
  await page.locator("#exportEvidenceBtn").click();
  const download=await downloadPromise;
  const backupPath=path.join(temp,"learner-A-pe-backup.json");
  await download.saveAs(backupPath);
  const backup=JSON.parse(fs.readFileSync(backupPath,"utf8"));
  assert.equal(backup.schema,"khaemenes-preschool-pe-backup-v1");
  assert.equal(backup.learnerId,"browser-test-learner-A");
  assert.equal(backup.state.evidence.length,1);
  assert.equal(backup.state.evidence[0].adultObservation,"observed");
  pass("Export PE backup","Downloaded JSON includes schema, learner ID, completion and adult-observation evidence.");

  // Switch to learner B; A's progress/evidence must not leak across the learner scope.
  await page.evaluate(()=>localStorage.setItem("khaemenes_preschool_profile_v1",JSON.stringify({learnerId:"browser-test-learner-B"})));
  await page.reload({waitUntil:"domcontentloaded"});
  assert.equal(await page.locator("#completeStat").innerText(),"0");
  assert.equal(await page.locator("#evidenceRecordSelect option").count(),1);
  assert.match(await page.locator("#evidenceRecordSelect option").first().innerText(),/Complete a lesson first/);
  pass("Switch to learner B","Learner A's completion and observation records are not shown to learner B.");

  // A backup from A must be rejected for learner B and cannot replace B's progress.
  await page.locator("#importEvidenceFile").setInputFiles(backupPath);
  await page.waitForFunction(()=>/Learner IDs do not match/.test(document.querySelector("#evidenceStatus").textContent));
  assert.equal(await page.locator("#completeStat").innerText(),"0");
  pass("Reject cross-learner restore","A's backup cannot be imported while learner B is active.");

  // The matching learner can restore after explicit confirmation.
  await page.evaluate(()=>localStorage.setItem("khaemenes_preschool_profile_v1",JSON.stringify({learnerId:"browser-test-learner-A"})));
  await page.reload({waitUntil:"domcontentloaded"});
  page.once("dialog",dialog=>dialog.accept());
  await page.locator("#importEvidenceFile").setInputFiles(backupPath);
  await page.waitForFunction(()=>/Backup restored/.test(document.querySelector("#evidenceStatus").textContent));
  assert.equal(await page.locator("#completeStat").innerText(),"1");
  assert.match(await page.locator("#evidenceList").innerText(),/Adult observation: observed/);
  pass("Restore matching learner backup","Restore requires confirmation and returns A's completion and observation.");

  // Malformed input is rejected without replacing restored progress.
  const malformed=path.join(temp,"malformed.json");
  fs.writeFileSync(malformed,'{"schema":"wrong-schema","state":{}}');
  await page.locator("#importEvidenceFile").setInputFiles(malformed);
  await page.waitForFunction(()=>/not a recognized PE backup/.test(document.querySelector("#evidenceStatus").textContent));
  assert.equal(await page.locator("#completeStat").innerText(),"1");
  pass("Reject invalid backup","Invalid schema is rejected and existing progress is retained.");

  // Oversized backup must be rejected before parsing.
  const oversized=path.join(temp,"oversized.json");
  fs.writeFileSync(oversized,Buffer.alloc(2*1024*1024+1,32));
  await page.locator("#importEvidenceFile").setInputFiles(oversized);
  await page.waitForFunction(()=>/too large/.test(document.querySelector("#evidenceStatus").textContent));
  assert.equal(await page.locator("#completeStat").innerText(),"1");
  pass("Reject oversized backup","Files over 2 MB are rejected without replacing current progress.");

  await context.close();
}finally{
  await browser.close();
  await new Promise(resolve=>server.close(resolve));
  fs.rmSync(temp,{recursive:true,force:true});
}
console.log(JSON.stringify({suite:"Preschool PE real-browser regression",tests:results.length,results},null,2));
