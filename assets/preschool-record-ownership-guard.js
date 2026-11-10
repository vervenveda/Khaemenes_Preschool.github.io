/*
 * Preschool record ownership guard v1.0.0
 * Pure, read-only decision layer. Does not export, mutate storage, authenticate
 * an adult, or authorize STOS admission. Caller must independently verify the
 * adult's export permission in a trusted authority before using records.
 */
(function attachPreschoolRecordOwnershipGuard(global) {
  "use strict";
  const VERSION = "1.0.0";
  const clean = value => typeof value === "string" ? value.trim() : "";
  const fail = (code, detail) => Object.freeze({ok:false,code,detail,learnerId:null,familyId:null});
  function check(input) {
    if (!input || typeof input !== "object") return fail("INVALID_INPUT","Missing ownership evidence");
    const local = input.localProfile;
    const active = input.activeIds;
    const learner = input.registryLearner;
    const family = input.registryFamily;
    if (!local || !active || !learner || !family) return fail("MISSING_IDENTITY","All identity sources are required");
    const id = clean(local.learnerId);
    const registryId = clean(active.learnerId);
    const recordId = clean(learner.learnerId);
    const familyId = clean(active.familyId);
    if (!id || !registryId || !recordId || !familyId) return fail("MISSING_IDENTITY","Blank identity field");
    if (id !== registryId || id !== recordId) return fail("LEARNER_MISMATCH","Local profile and family registry disagree");
    if (familyId !== clean(learner.familyId) || familyId !== clean(family.familyId)) return fail("FAMILY_MISMATCH","Family ownership disagrees");
    if (clean(learner.stage).toLowerCase() !== "preschool") return fail("STAGE_MISMATCH","Learner is not in Preschool");
    if (!Array.isArray(family.learners) || !family.learners.some(x => x && clean(x.learnerId) === id && clean(x.familyId || familyId) === familyId)) {
      return fail("MEMBERSHIP_UNVERIFIED","Selected learner not confirmed in family roster");
    }
    // Deliberately no fallback from missing permission to browser identity.
    if (input.adultAuthorization !== true) return fail("AUTHORIZATION_REQUIRED","Adult export permission must be independently verified");
    return Object.freeze({ok:true,code:"OWNERSHIP_CONFIRMED",learnerId:id,familyId});
  }
  function classifyRecord(record, decision) {
    if (!decision || !decision.ok) return "blocked";
    if (!record || typeof record !== "object") return "unverified";
    if (clean(record.learnerId) !== decision.learnerId) return record.learnerId ? "other-learner" : "unverified";
    if (record.familyId && clean(record.familyId) !== decision.familyId) return "other-family";
    return "eligible";
  }
  global.KhaemenesPreschoolRecordOwnershipGuard = Object.freeze({version:VERSION,check,classifyRecord});
})(typeof window !== "undefined" ? window : globalThis);
