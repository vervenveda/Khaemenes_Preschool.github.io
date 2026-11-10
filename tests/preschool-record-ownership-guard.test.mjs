import assert from "node:assert/strict";
import fs from "node:fs";
import vm from "node:vm";
const source=fs.readFileSync(new URL("../assets/preschool-record-ownership-guard.js",import.meta.url),"utf8");
const context={window:{}};
vm.runInNewContext(source,context);
const guard=context.window.KhaemenesPreschoolRecordOwnershipGuard;
const valid=()=>({
 localProfile:{learnerId:"child-A"},
 activeIds:{learnerId:"child-A",familyId:"family-1"},
 registryLearner:{learnerId:"child-A",familyId:"family-1",stage:"preschool"},
 registryFamily:{familyId:"family-1",learners:[{learnerId:"child-A",familyId:"family-1"},{learnerId:"child-B",familyId:"family-1"}]},
 adultAuthorization:true
});
assert.equal(guard.check(valid()).ok,true);
const mutate=(fn)=>{const data=valid();fn(data);return guard.check(data)};
assert.equal(mutate(d=>d.localProfile.learnerId="child-B").code,"LEARNER_MISMATCH");
assert.equal(mutate(d=>d.activeIds.learnerId="child-B").code,"LEARNER_MISMATCH");
assert.equal(mutate(d=>d.registryLearner.familyId="family-2").code,"FAMILY_MISMATCH");
assert.equal(mutate(d=>d.registryFamily.learners=[]).code,"MEMBERSHIP_UNVERIFIED");
assert.equal(mutate(d=>d.adultAuthorization=false).code,"AUTHORIZATION_REQUIRED");
assert.equal(mutate(d=>delete d.adultAuthorization).code,"AUTHORIZATION_REQUIRED");
assert.equal(mutate(d=>d.registryLearner.stage="kindergarten").code,"STAGE_MISMATCH");
assert.equal(mutate(d=>d.localProfile=null).code,"MISSING_IDENTITY");
assert.equal(guard.check(null).code,"INVALID_INPUT");
const decision=guard.check(valid());
assert.equal(guard.classifyRecord({learnerId:"child-A"},decision),"eligible");
assert.equal(guard.classifyRecord({learnerId:"child-B"},decision),"other-learner");
assert.equal(guard.classifyRecord({learnerId:"child-A",familyId:"family-2"},decision),"other-family");
assert.equal(guard.classifyRecord({value:1},decision),"unverified");
assert.equal(guard.classifyRecord({learnerId:"child-A"},guard.check(null)),"blocked");
assert.deepEqual(Object.keys(valid()).length,5);
console.log("PASS: Preschool ownership guard, fail-closed authorization, sibling isolation, record classification");
