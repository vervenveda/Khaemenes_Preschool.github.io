import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";

const root=process.cwd();
const pePath=path.join(root,"apps/PE_move_n_groove_index.html");
const guidePath=path.join(root,"apps/PE_move_n_groove_teacher_guide.html");
const mapPath=path.join(root,"curriculum/pe/prek-movement-scope-sequence.json");
const html=fs.readFileSync(pePath,"utf8");
const guide=fs.readFileSync(guidePath,"utf8");
const map=JSON.parse(fs.readFileSync(mapPath,"utf8"));

assert.equal((html.match(/<html\b/gi)||[]).length,1,"PE portal should have one document root");
const ids=[...html.matchAll(/\bid=["']([^"']+)["']/gi)].map(m=>m[1]);
assert.equal(new Set(ids).size,ids.length,"PE portal must not contain duplicate IDs");
for(const id of ["evidenceRecordSelect","evidenceObservation","evidenceAdaptation","evidenceNextStep","exportEvidenceBtn","importEvidenceFile","saveEvidenceBtn","evidenceStatus","evidenceList"]){
 assert.ok(ids.includes(id),`missing PE evidence control: ${id}`);
}
assert.match(html,/function finishLesson\(\)[\s\S]{0,1400}state\.evidence\.push/,"lesson completion should append a distinct evidence record");
assert.match(html,/function downloadPEBackup\(\)[\s\S]{0,1400}khaemenes-preschool-pe-backup-v1/,"PE backup export schema should be present");
assert.match(html,/function restorePEBackup\(file\)[\s\S]{0,5200}sourceId!==currentId/,"restore must check learner identity");
assert.match(html,/sourceId!==currentId[\s\S]{0,240}Learner IDs do not match/,"identity mismatch must block restore");
assert.match(html,/Current PE progress will be replaced/,"restore must confirm before replacing data");
assert.match(html,/file\.size>2\*1024\*1024/,"restore must enforce a file-size limit");
assert.match(html,/learningCheck:lastCheckCorrect===true\?"correct"/,"evidence must distinguish a correct check from other completion");

const lessonStart=html.indexOf("const LESSONS=");
const guideStart=html.indexOf(";\nconst PREK_GUIDES=",lessonStart);
const variantsStart=html.indexOf(";\nconst PREK_CHECK_VARIANTS=",guideStart+1);
assert.ok(lessonStart>=0&&guideStart>lessonStart&&variantsStart>guideStart,"lesson data markers must remain present");
const lessons=JSON.parse(html.slice(lessonStart+"const LESSONS=".length,guideStart));
const adultCues=JSON.parse(html.slice(guideStart+";\nconst PREK_GUIDES=".length,variantsStart));
const variantEnd=html.indexOf(";\nLESSONS.forEach",variantsStart+1);
const variants=JSON.parse(html.slice(variantsStart+";\nconst PREK_CHECK_VARIANTS=".length,variantEnd));
assert.equal(lessons.length,42,"expected 42 PE lessons");
assert.equal(Object.keys(adultCues).length,42,"each lesson should have a grown-up cue and adaptation");
assert.equal(Object.keys(variants).length,42,"each lesson should have question variants");
for(const lesson of lessons){
 const pool=[lesson.check,...(variants[String(lesson.id)]||[]).map(([q,options,correct])=>({q,options,correct}))];
 assert.equal(pool.length,3,`lesson ${lesson.id} should have three check questions`);
 assert.equal(new Set(pool.map(q=>q.q)).size,3,`lesson ${lesson.id} prompts should be unique`);
 for(const q of pool){
  assert.ok(q.q.trim(),`lesson ${lesson.id} has a blank prompt`);
  assert.equal(q.options.length,3,`lesson ${lesson.id} prompts need three options`);
  assert.equal(new Set(q.options).size,3,`lesson ${lesson.id} options should be distinct`);
  assert.ok(Number.isInteger(q.correct)&&q.correct>=0&&q.correct<3,`lesson ${lesson.id} has an invalid correct answer index`);
 }
}
assert.equal(map.sequence.length,42,"scope sequence should cover all 42 lessons");
assert.equal(new Set(map.sequence.map(x=>x.lessonId)).size,42,"scope sequence lesson identifiers should be unique");
for(let i=0;i<42;i++){
 const lesson=lessons[i], seq=map.sequence[i];
 assert.equal(seq.lessonId,lesson.id,"scope sequence must retain lesson order and identifiers");
 assert.equal(seq.title,lesson.title,"scope sequence title must match the portal");
 assert.ok(seq.primaryFocus&&seq.intendedOutcome&&seq.setupAndSafety&&seq.adaptationOptions,"scope sequence entries need focus, outcomes, safety, and adaptations");
 assert.equal(seq.evidenceToNotice.length,3,"each lesson must distinguish three evidence types");
 const runtimePoolSize=[lesson.check,...(variants[String(lesson.id)]||[])].length;
 assert.equal(seq.questionPoolSize,runtimePoolSize,`lesson ${lesson.id} questionPoolSize must match the runtime bank`);
}
assert.ok(guide.includes("../curriculum/pe/prek-movement-scope-sequence.json"),"teacher guide must link the scope-and-sequence map");
assert.match(guide,/42-lesson observation map/,"printable guide observation map should remain present");

let inlineCount=0;
for(const match of html.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script>/gi)){
 const attrs=match[1],code=match[2];
 if(/\bsrc\s*=/.test(attrs)||/type=["'](?:application\/json|application\/ld\+json)["']/i.test(attrs))continue;
 inlineCount++;
 new vm.Script(code,{filename:`PE_move_n_groove_index.html:inline-${inlineCount}`});
}
console.log(`PASS: PE portal structure, ${lessons.length} lessons, ${Object.keys(adultCues).length} safety/adaptation guides, ${map.sequence.length} mapped outcomes, evidence flow hooks, restore safeguards, and inline-script syntax.`);
