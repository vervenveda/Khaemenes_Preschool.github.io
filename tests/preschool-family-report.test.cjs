"use strict";
const test=require("node:test"),assert=require("node:assert/strict"),fs=require("node:fs"),vm=require("node:vm"),path=require("node:path");
const src=fs.readFileSync(path.resolve(__dirname,"../assets/khaemenes-preschool-continuation.js"),"utf8");
test("Pre-K publisher requires linked profile and family membership",()=>{
 new vm.Script(src);
 assert.match(src,/learner\?\.grade!=="pre-k"/);
 assert.match(src,/family\?\.learnerIds\?\.includes\(learner\.learnerId\)/);
 assert.match(src,/linkedProfile\(learner\)/);
 assert.match(src,/if\(!profile\)return false/);
 assert.match(src,/stage:"preschool"/);
 assert.match(src,/mastery:\{best:null,threshold:null,mastered:false\}/);
});

test("Pre-K profile exposes the same family report without storing academic scores",()=>{
 const html=fs.readFileSync(path.resolve(__dirname,"../student-profile/index.html"),"utf8");
 const module=fs.readFileSync(path.resolve(__dirname,"../assets/khaemenes-prek-family-progress.js"),"utf8");
 assert.match(html,/data-prek-panel="prekFamilyProgress"/);
 assert.match(html,/id="prekFamilyProgressMessage"/);
 assert.match(html,/prekFamilyProgress:\(\)=>document\.getElementById\("prekFamilyProgress"\)/);
 assert.match(html,/khaemenes-prek-family-progress\.js/);
 new vm.Script(module,{filename:"khaemenes-prek-family-progress.js"});
 assert.match(module,/child\.familyId===family\.familyId/);
 assert.match(module,/family\.learnerIds\?\.includes\(child\.learnerId\)/);
 assert.match(module,/report\.learnerId!==child\.learnerId/);
 assert.doesNotMatch(module,/localStorage\.setItem\s*\(/);
 assert.doesNotMatch(module,/C\.publish\s*\(/);
});
test("Pre-K family summary filters another child's record",()=>{
 const module=fs.readFileSync(path.resolve(__dirname,"../assets/khaemenes-prek-family-progress.js"),"utf8");
 const listeners={};
 const family={familyId:"family-1",learnerIds:["child-a"]};
 const child={learnerId:"child-a",familyId:"family-1",grade:"pre-k",stage:"preschool",nickname:"Learner"};
 const window={
  KhaemenesFamilyRegistry:{activeIds:()=>({familyId:"family-1",learnerId:"child-a"}),getLearner:id=>id==="child-a"?child:null,getFamily:()=>family},
  KhaemenesLearningContinuation:{storageKey:"khaemenes.learning.continuation.v1",readCourse:()=>({learnerId:"child-b",courseId:"preschool-adventure-garden",stage:"preschool",grade:"Pre-K"})},
  addEventListener:(name,callback)=>{listeners[name]=callback}
 };
 window.window=window;
 const document={readyState:"loading",addEventListener:()=>{}};
 vm.runInNewContext(module,{window,document,Number,Date},{timeout:2000});
 assert.equal(window.KhaemenesPreKFamilyProgress.summary().kind,"missing");
});

test("Pre-K profile full inline JavaScript parses and keeps native control identities",()=>{
 const html=fs.readFileSync(path.resolve(__dirname,"../student-profile/index.html"),"utf8");
 const scripts=[...html.matchAll(/<script(?:\s[^>]*)?>([\s\S]*?)<\/script>/gi)].map(m=>m[1]);
 assert.ok(scripts.length>=3);
 scripts.forEach((code,i)=>new vm.Script(code,{filename:"prek-inline-"+i+".js"}));
 for(const id of ["adultConfirm","childPhoto","importLook","exportLook","pinAdventure","pinPreschoolPath","learnerSelect","prekFamilyProgress"])
  assert.ok(html.includes('id="'+id+'"'),"Missing original control "+id);
});
test("Bubble 1: learner is confirmed in selected family and grade before personalization",()=>{
 const html=fs.readFileSync(path.resolve(__dirname,"../student-profile/index.html"),"utf8");
 assert.match(html,/value\.learnerId===ids\.learnerId/);
 assert.match(html,/value\.familyId===family\.familyId/);
 assert.match(html,/value\.grade==="pre-k"/);
 assert.match(html,/family\.learnerIds\?\.includes\(value\.learnerId\)/);
});
test("Bubble 2: next-step report belongs to current student and canonical course",()=>{
 const html=fs.readFileSync(path.resolve(__dirname,"../student-profile/index.html"),"utf8");
 assert.match(html,/row\.learnerId!==activeId/);
 assert.match(html,/row\.courseId!=="preschool-adventure-garden"/);
 assert.match(html,/row\.grade!=="Pre-K"/);
 assert.match(html,/target\.origin==="https:\/\/vervenveda\.com"/);
});
test("Bubbles 3 and 4: profile and pins verify browser storage writes",()=>{
 const html=fs.readFileSync(path.resolve(__dirname,"../student-profile/index.html"),"utf8");
 assert.match(html,/function verifiedWrite\(key,payload\)/);
 assert.match(html,/localStorage\.getItem\(key\)===expected/);
 assert.match(html,/verifiedWrite\(profileKey\(\),payload\)/);
 assert.match(html,/verifiedWrite\(FAVORITES_KEY,map\)/);
 assert.match(html,/verifiedWrite\(COURSE_KEY,prior\)/);
 assert.match(html,/learnerId!==activeId\|\|!eligible\(\)\|\|!\$\("adultConfirm"\)\.checked/);
});
test("Bubble 5: backup is one validated write, not a partial two-phase restore",()=>{
 const html=fs.readFileSync(path.resolve(__dirname,"../student-profile/index.html"),"utf8");
 const start=html.indexOf('$("importLook").addEventListener("change",async event=>{');
 const end=html.indexOf('$("learnerSelect").addEventListener',start);
 assert.ok(start>=0&&end>start);
 const code=html.slice(start,end);
 assert.match(code,/const value=JSON\.parse\(await file\.text\(\)\)/);
 assert.match(code,/id!==activeId\|\|!eligible\(\)\|\|!\$\("adultConfirm"\)\.checked/);
 assert.equal((code.match(/verifiedWrite\(profileKey\(\),payload\)/g)||[]).length,1);
 assert.doesNotMatch(code,/localStorage\.setItem\s*\(/);
 assert.doesNotMatch(code,/saveLook\s*\(/);
});

function syntheticDay({id="child-a",familyId="family-a",writeFails=false,sharedStore=null}={}){
 const code=fs.readFileSync(path.resolve(__dirname,"../assets/khaemenes-prek-family-day.js"),"utf8");
 const store=sharedStore||new Map(),events={};
 const child={learnerId:id,familyId,stage:"preschool",grade:"pre-k"};
 const family={familyId,learnerIds:[id]};
 const localStorage={
  getItem:k=>store.get(k)??null,
  setItem:(k,v)=>{if(!writeFails)store.set(k,v)}
 };
 const w={
  localStorage,
  KhaemenesFamilyRegistry:{
   activeIds:()=>({learnerId:id,familyId}),
   getLearner:()=>child,
   getFamily:()=>family
  },
  addEventListener:(name,fn)=>{events[name]=fn}
 };
 w.window=w;
 vm.runInNewContext(code,{window:w,document:{readyState:"loading",addEventListener:()=>{}},Date,Number,Object},{timeout:2000});
 return {api:w.KhaemenesPreKFamilyDay,store,child,family};
}
test("Pre-K family day saves only current child and keeps short bounded observations",()=>{
 const {api,store}=syntheticDay();
 const a=api.update("checks",{story:true,create:false,move:true,connect:true});
 assert.equal(a.ok,true);
 const b=api.update("observation","A".repeat(280));
 assert.equal(b.ok,true);
 const snap=api.view();
 assert.equal(snap.kind,"ready");
 assert.equal(snap.today.checks.story,true);
 assert.equal(snap.today.checks.create,false);
 assert.equal(snap.today.observation.length,240);
 assert.equal(store.size,1);
 assert.match([...store.keys()][0],/child-a/);
});
test("Pre-K daily notes never overwrite mismatched owner records",()=>{
 const {api,store}=syntheticDay();
 store.set("khaemenes.prek.family-day.v1:child-a",JSON.stringify({schema:"khaemenes.prek.family-day.v1",learnerId:"child-b",days:{}}));
 const result=api.update("observation","Sample");
 assert.equal(result.ok,false);
 assert.equal(api.view().kind,"invalid");
 assert.match(store.get("khaemenes.prek.family-day.v1:child-a"),/child-b/);
});
test("Pre-K daily notes fail closed on unverified writes and missing family membership",()=>{
 const bad=syntheticDay({writeFails:true});
 assert.equal(bad.api.update("checks",{story:true}).ok,false);
 assert.equal(bad.store.size,0);
 const missing=syntheticDay();
 missing.family.learnerIds=[];
 assert.equal(missing.api.update("checks",{story:true}).ok,false);
 assert.equal(missing.api.view().kind,"select");
});
test("Pre-K profile keeps both new age-appropriate panels in the shared pop-up menu",()=>{
 const html=fs.readFileSync(path.resolve(__dirname,"../student-profile/index.html"),"utf8");
 for(const panel of ["prekMyDay","prekKeepsakes"]){
  assert.match(html,new RegExp('data-prek-panel="'+panel+'"'));
  assert.match(html,new RegExp('id="'+panel+'"'));
 }
 assert.match(html,/khaemenes-prek-family-day\.js/);
 assert.match(html,/id="prekDayAdultConfirm"/);
 assert.match(html,/id="prekKeepsakeAdultConfirm"/);
 assert.match(html,/maxlength="240"/);
 const module=fs.readFileSync(path.resolve(__dirname,"../assets/khaemenes-prek-family-day.js"),"utf8");
 assert.doesNotMatch(module,/\.publish\(/);
 assert.doesNotMatch(module,/writeState\(/);
 new vm.Script(module);
});

test("Pre-K keeps siblings' local notes separate and trims older observations",()=>{
 const sharedStore=new Map();
 const a=syntheticDay({id:"child-a",sharedStore});
 const b=syntheticDay({id:"child-b",sharedStore});
 assert.equal(a.api.update("observation","Played with shapes").ok,true);
 assert.equal(b.api.update("observation","Read a story").ok,true);
 assert.equal(a.api.view().today.observation,"Played with shapes");
 assert.equal(b.api.view().today.observation,"Read a story");
 assert.equal(sharedStore.size,2);
 const key="khaemenes.prek.family-day.v1:child-a";
 const raw=JSON.parse(sharedStore.get(key));
 for(let n=1;n<=18;n++)raw.days["2026-10-"+String(n).padStart(2,"0")]={checks:{story:true},observation:"old"};
 sharedStore.set(key,JSON.stringify(raw));
 assert.equal(a.api.update("checks",{story:true}).ok,true);
 const retained=JSON.parse(sharedStore.get(key));
 assert.ok(Object.keys(retained.days).length<=14);
 assert.equal(b.api.view().today.observation,"Read a story");
});
