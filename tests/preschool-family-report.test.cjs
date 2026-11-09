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
