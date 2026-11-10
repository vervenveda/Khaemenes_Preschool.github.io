"use strict";
/* Synthetic source regression. No real learner records or browser writes. */
const test=require("node:test"),assert=require("node:assert/strict"),fs=require("node:fs"),path=require("node:path");
const html=fs.readFileSync(path.join(__dirname,"../student-profile/index.html"),"utf8");
test("sibling selection requires current adult and exact linked learner membership",()=>{
 assert.ok(html.includes('R?.activeIds?.()||{}'));
 assert.ok(html.includes('R?.getAdult?.(ids.adultId)'));
 assert.ok(html.includes('R?.canAdult?.(ids.adultId,id,"progress.view")===true'));
 assert.ok(html.includes('family?.adultIds?.includes(ids.adultId)'));
});
test("switch checks saved family, adult and learner before treating selection as successful",()=>{
 assert.ok(html.includes('R.activeIds?.()||{}'));
 assert.ok(html.includes('after.familyId!==family.familyId'));
 assert.ok(html.includes('after.adultId!==ids.adultId'));
 assert.ok(html.includes('after.learnerId!==id'));
});
test("permission denial does not update learner context",()=>{
 assert.ok(html.includes("if(!permitted)"));
 assert.ok(html.includes("select.value=activeId")||html.includes("event.target.value=activeId"));
 assert.ok(html.includes('$("adultConfirm").checked=false'));
});
test("original learner progress and course evidence are not deleted by the navigation guard",()=>{
 assert.ok(!html.includes("parent-learner-guard-delete-all-records"));
 assert.ok(html.includes("Existing work is unchanged")||html.includes("Existing work is unchanged."));
});

