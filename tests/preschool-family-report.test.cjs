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
