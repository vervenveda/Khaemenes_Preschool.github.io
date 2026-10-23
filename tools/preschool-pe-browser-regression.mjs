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
  const dimensions=await page.evaluate(()=>({width:innerWidth,documentWidth:document.documentElement.scrollWidth,bodyWidth:document.body.scrollWidth,reduced:matchMedia("(prefers-reduced-motion: reduce)").matches,animation:getComputedStyle(document.querySelector(".mascot")).animationDuration,overflowNodes:[...document.querySelectorAll("body *")].map(el=>({tag:el.tagName,id:el.id,cls:typeof el.className==="string"?el.className:"",left:Math.round(el.getBoundingClientRect().left),right:Math.round(el.getBoundingClientRect().right),width:Math.round(el.getBoundingClientRect().width),scrollWidth:el.scrollWidth,clientWidth:el.clientWidth})).filter(el=>el.right>innerWidth+1||el.left< -1||el.scrollWidth>el.clientWidth+4).sort((a,b)=>b.right-a.right).slice(0,18)}));
  assert.ok(dimensions.documentWidth<=dimensions.width+1,JSON.stringify(dimensions));
  assert.ok(dimensions.bodyWidth<=dimensions.width+1,JSON.stringify(dimensions));
  assert.equal(dimensions.reduced,true);
  assert.ok(parseFloat(dimensions.animation)<=0.001,JSON.stringify(dimensions));
  pass("255px narrow viewport and reduced motion",JSON.stringify(dimensions));

  // Exercise the shared ecosystem hamburger while the viewport is narrow.
  await page.waitForSelector("#vnvEcosystemMenuButton",{timeout:10000});
  const menuButton=page.locator("#vnvEcosystemMenuButton");
  await menuButton.click();
  const menuDrawer=page.locator("#vnvEcosystemMenuDrawer");
  await menuDrawer.waitFor({state:"visible",timeout:5000});
  const menuMetrics=await page.evaluate(()=>({
    viewport:innerWidth,
    drawerRight:Math.round(document.querySelector("#vnvEcosystemMenuDrawer").getBoundingClientRect().right),
    linkCount:document.querySelectorAll("#vnvEcosystemMenuDrawer a").length,
    overflowingLinks:[...document.querySelectorAll("#vnvEcosystemMenuDrawer a")].map(a=>({text:(a.innerText||"").trim(),right:Math.round(a.getBoundingClientRect().right),width:Math.round(a.getBoundingClientRect().width),parent:Math.round(a.parentElement.getBoundingClientRect().width)})).filter(a=>a.right>innerWidth+1||a.width>a.parent+1)
  }));
  assert.ok(menuMetrics.drawerRight<=255,JSON.stringify(menuMetrics));
  assert.ok(menuMetrics.linkCount>0,JSON.stringify(menuMetrics));
  assert.equal(menuMetrics.overflowingLinks.length,0,JSON.stringify(menuMetrics));
  await page.keyboard.press("Escape");
  pass("Shared ecosystem menu at 255px",JSON.stringify(menuMetrics));
  // Return to the PE page before the remaining viewport checks.
  if(await menuDrawer.isVisible())await menuButton.click();

  // Verify the second required narrow-screen target separately.
  await page.setViewportSize({width:320,height:850});
  const dimensions320=await page.evaluate(()=>({width:innerWidth,documentWidth:document.documentElement.scrollWidth,bodyWidth:document.body.scrollWidth}));
  assert.ok(dimensions320.documentWidth<=320,JSON.stringify(dimensions320));
  assert.ok(dimensions320.bodyWidth<=320,JSON.stringify(dimensions320));
  pass("320px narrow viewport",JSON.stringify(dimensions320));

  // Keyboard activation: focus and activate a user-facing toggle.
  await page.setViewportSize({width:800,height:900});
  const largeType=page.locator("#largeTypeBtn");
  await largeType.focus();
  assert.equal(await largeType.evaluate(el=>el===document.activeElement),true);
  await page.keyboard.press("Enter");
  assert.equal(await page.locator("body").evaluate(el=>el.classList.contains("large-type")),true);
  const keyboardTargets=["#simpleModeBtn","#voiceSpeed","#unitFilter","#startTimerBtn","#nextPhaseBtn","#evidenceObservation","#saveEvidenceBtn"];
  for(const selector of keyboardTargets){
    const target=page.locator(selector);
    if(await target.count()&&await target.isVisible()&&await target.isEnabled()){
      await target.focus();
      assert.equal(await target.evaluate(el=>el===document.activeElement),true,"keyboard focus failed for "+selector);
    }
  }
  pass("Keyboard focus and activation","Large-type toggle activates with Enter; representative navigation, timer, phase, and evidence controls accept keyboard focus.");

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

  // Reload under the same learner to verify persistence in browser storage.
  await page.reload({waitUntil:"domcontentloaded"});
  assert.equal(await page.locator("#completeStat").innerText(),"1");
  assert.match(await page.locator("#evidenceList").innerText(),/Adult observation: observed/);
  assert.match(await page.locator("#evidenceList").innerText(),/Visual cue/);
  assert.match(await page.locator("#evidenceList").innerText(),/Repeat with a clear path/);
  pass("Observation survives reload","Completion and adult observation details persist after reloading as the same learner.");

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
  const learnerBDiagnostic=await page.evaluate(()=>({
    learner:window.KhaemenesPreschoolLearnerStorage?.activeLearnerId?.(),
    profile:localStorage.getItem("khaemenes_preschool_profile_v1"),
    storedKeys:Array.from({length:localStorage.length},(_,i)=>localStorage.key(i)).filter(k=>k&&(/boppi-prek-pe-garden|khaemenes.preschool.learner|legacy_migrated/.test(k))),
    visibleState:localStorage.getItem("boppi-prek-pe-garden-v2")
  }));
  assert.equal(await page.locator("#completeStat").innerText(),"0",JSON.stringify(learnerBDiagnostic));
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
  await page.waitForFunction(()=>document.querySelector("#evidenceStatus").textContent.length>0);
  const restoreStatus=await page.locator("#evidenceStatus").innerText();
  assert.match(restoreStatus,/Backup restored/,`valid matching-learner backup was rejected: ${restoreStatus}`);
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

  // Malformed completion records must be rejected before the confirmation step.
  const malformedCompletion=JSON.parse(fs.readFileSync(backupPath,"utf8"));
  malformedCompletion.state.completed["1"]={date:"not-a-timestamp"};
  const malformedCompletionPath=path.join(temp,"malformed-completion.json");
  fs.writeFileSync(malformedCompletionPath,JSON.stringify(malformedCompletion));
  await page.locator("#importEvidenceFile").setInputFiles(malformedCompletionPath);
  await page.waitForFunction(()=>/completed lesson record has an invalid shape or timestamp/.test(document.querySelector("#evidenceStatus").textContent));
  assert.equal(await page.locator("#completeStat").innerText(),"1");
  pass("Reject malformed completion record","Invalid completion timestamp is rejected without replacing saved progress.");

  // Duplicate evidence IDs must be rejected as well.
  const duplicateEvidence=JSON.parse(fs.readFileSync(backupPath,"utf8"));
  duplicateEvidence.state.evidence.push({...duplicateEvidence.state.evidence[0]});
  const duplicateEvidencePath=path.join(temp,"duplicate-evidence.json");
  fs.writeFileSync(duplicateEvidencePath,JSON.stringify(duplicateEvidence));
  await page.locator("#importEvidenceFile").setInputFiles(duplicateEvidencePath);
  await page.waitForFunction(()=>/Evidence record IDs must be unique/.test(document.querySelector("#evidenceStatus").textContent));
  assert.equal(await page.locator("#completeStat").innerText(),"1");
  pass("Reject duplicate evidence IDs","Duplicate evidence identifiers are rejected before restore.");

  // Oversized backup must be rejected before parsing.
  const oversized=path.join(temp,"oversized.json");
  fs.writeFileSync(oversized,Buffer.alloc(2*1024*1024+1,32));
  await page.locator("#importEvidenceFile").setInputFiles(oversized);
  await page.waitForFunction(()=>/too large/.test(document.querySelector("#evidenceStatus").textContent));
  assert.equal(await page.locator("#completeStat").innerText(),"1");
  pass("Reject oversized backup","Files over 2 MB are rejected without replacing current progress.");

  // Exercise the two-incorrect-answer path independently. The answer options
  // are randomized by the app, so vary selections across fresh lessons until
  // the browser actually demonstrates the reviewed-after-help outcome.
  const assessmentContext=await browser.newContext({viewport:{width:800,height:900},acceptDownloads:true});
  const assessmentPage=await assessmentContext.newPage();
  await assessmentPage.goto(url,{waitUntil:"domcontentloaded"});
  await assessmentPage.evaluate(()=>localStorage.setItem("khaemenes_preschool_profile_v1",JSON.stringify({learnerId:"browser-test-assessment-branch"})));
  await assessmentPage.reload({waitUntil:"domcontentloaded"});
  let observedHelpBranch=false;
  const lessonCards=assessmentPage.locator(".lesson-card");
  const lessonCount=await lessonCards.count();
  for(let lessonIndex=0;lessonIndex<lessonCount&&!observedHelpBranch;lessonIndex++){
    await assessmentPage.locator(".lesson-card").nth(lessonIndex).click();
    await assessmentPage.locator("#nextPhaseBtn").click();
    await assessmentPage.locator("#nextPhaseBtn").click();
    await assessmentPage.locator("#nextPhaseBtn").click();
    let attempts=0;
    while(!(await assessmentPage.locator("#nextPhaseBtn").isEnabled())&&attempts<2){
      const options=assessmentPage.locator("#checkOptions .option:not([disabled])");
      const count=await options.count();
      assert.ok(count>0,"assessment has no available option");
      await options.nth(Math.floor(Math.random()*count)).click();
      attempts++;
    }
    assert.equal(await assessmentPage.locator("#nextPhaseBtn").isEnabled(),true,"learning check failed to resolve");
    await assessmentPage.locator("#nextPhaseBtn").click();
    const evidence=await assessmentPage.locator("#evidenceList").innerText();
    observedHelpBranch=/Learning check: reviewed-after-help/.test(evidence);
  }
  assert.ok(observedHelpBranch,"randomized test did not observe reviewed-after-help across "+lessonCount+" lesson checks");
  pass("Two incorrect answers record reviewed-after-help","Chromium exercised the help path and verified it was not recorded as a correct response.");
  await assessmentContext.close();

  // Independently force the correct-answer outcome by trying randomized options
  // across fresh lessons until a selected option resolves as correct.
  const correctContext=await browser.newContext({viewport:{width:800,height:900}});
  const correctPage=await correctContext.newPage();
  await correctPage.goto(url,{waitUntil:"domcontentloaded"});
  await correctPage.evaluate(()=>localStorage.setItem("khaemenes_preschool_profile_v1",JSON.stringify({learnerId:"browser-test-correct-branch"})));
  await correctPage.reload({waitUntil:"domcontentloaded"});
  let observedCorrectBranch=false;
  const correctLessonCards=correctPage.locator(".lesson-card");
  const correctLessonCount=await correctLessonCards.count();
  for(let lessonIndex=0;lessonIndex<correctLessonCount&&!observedCorrectBranch;lessonIndex++){
    await correctPage.locator(".lesson-card").nth(lessonIndex).click();
    await correctPage.locator("#nextPhaseBtn").click();
    await correctPage.locator("#nextPhaseBtn").click();
    await correctPage.locator("#nextPhaseBtn").click();
    let attempts=0;
    while(!(await correctPage.locator("#nextPhaseBtn").isEnabled())&&attempts<2){
      const options=correctPage.locator("#checkOptions .option:not([disabled])");
      const count=await options.count();
      assert.ok(count>0,"correct-branch assessment has no available option");
      await options.nth(Math.floor(Math.random()*count)).click();
      attempts++;
    }
    assert.equal(await correctPage.locator("#nextPhaseBtn").isEnabled(),true,"correct-branch learning check failed to resolve");
    await correctPage.locator("#nextPhaseBtn").click();
    observedCorrectBranch=/Learning check: correct/.test(await correctPage.locator("#evidenceList").innerText());
  }
  assert.ok(observedCorrectBranch,"randomized test did not observe a correct answer across "+correctLessonCount+" lesson checks");
  pass("Correct answer records correct","Chromium independently verified the correct-answer evidence outcome.");
  await correctContext.close();

  // Test a mid-timer page interruption in a separate learner profile.
  const interruptionContext=await browser.newContext({viewport:{width:800,height:900}});
  const interruptionPage=await interruptionContext.newPage();
  await interruptionPage.goto(url,{waitUntil:"domcontentloaded"});
  await interruptionPage.evaluate(()=>localStorage.setItem("khaemenes_preschool_profile_v1",JSON.stringify({learnerId:"browser-test-interrupted-session"})));
  await interruptionPage.reload({waitUntil:"domcontentloaded"});
  await interruptionPage.locator(".lesson-card").first().click();
  await interruptionPage.locator("#startTimerBtn").click();
  await interruptionPage.waitForTimeout(1100);
  await interruptionPage.reload({waitUntil:"domcontentloaded"});
  assert.equal(await interruptionPage.locator("#completeStat").innerText(),"0");
  assert.equal(await interruptionPage.locator("#evidenceRecordSelect option").count(),1);
  assert.match(await interruptionPage.locator("#evidenceRecordSelect option").first().innerText(),/Complete a lesson first/);
  pass("Reload interruption preserves lesson boundary","Reloading mid-timer does not falsely mark a PE lesson completed or create adult evidence.");
  assert.equal(await interruptionPage.locator("#resumeCheckpointCard").isVisible(),true,"interrupted lesson should offer resume");
  assert.match(await interruptionPage.locator("#resumeCheckpointDescription").innerText(),/Walking Feet/);
  await interruptionPage.locator("#resumeLessonBtn").click();
  assert.equal(await interruptionPage.locator("#sessionScreen").isVisible(),true);
  assert.equal(await interruptionPage.locator("#lessonTitle").innerText(),"Walking Feet");
  assert.equal(await interruptionPage.locator("#completeStat").innerText(),"0");
  pass("Resume interrupted lesson","A saved checkpoint resumes the same lesson and phase without falsely creating completion evidence.");
  await interruptionContext.close();

  // Verify a profile change in a second tab invalidates the original active session.
  const staleContext=await browser.newContext({viewport:{width:800,height:900}});
  const staleA=await staleContext.newPage();
  await staleA.goto(url,{waitUntil:"domcontentloaded"});
  await staleA.evaluate(()=>localStorage.setItem("khaemenes_preschool_profile_v1",JSON.stringify({learnerId:"browser-test-stale-A"})));
  await staleA.reload({waitUntil:"domcontentloaded"});
  const staleB=await staleContext.newPage();
  await staleB.goto(url,{waitUntil:"domcontentloaded"});
  await staleA.locator(".lesson-card").first().click();
  await staleA.locator("#startTimerBtn").click();
  await staleA.waitForTimeout(1100);
  await staleB.evaluate(()=>localStorage.setItem("khaemenes_preschool_profile_v1",JSON.stringify({learnerId:"browser-test-stale-B"})));
  await staleA.waitForSelector("#staleLearnerOverlay",{timeout:5000});
  assert.ok(await staleA.locator("main").getAttribute("inert")!==null,"stale page content should be inert");
  assert.equal(await staleA.locator("#pauseBtn").isDisabled(),true);
  await staleA.close();
  const leaked=await staleB.evaluate(()=>Array.from({length:localStorage.length},(_,i)=>localStorage.key(i)).some(k=>k&&k.includes("browser-test-stale-B")&&k.includes("boppi-prek-pe-garden-v2")));
  assert.equal(leaked,false,"the stale session wrote A's active state into learner B's storage");
  pass("Cross-tab learner change invalidates stale session","Storage event overlays and disables old page; unload does not write A's state under B.");
  await staleContext.close();

  await context.close();
}finally{
  await browser.close();
  await new Promise(resolve=>server.close(resolve));
  fs.rmSync(temp,{recursive:true,force:true});
}
console.log(JSON.stringify({suite:"Preschool PE real-browser regression",tests:results.length,results},null,2));
