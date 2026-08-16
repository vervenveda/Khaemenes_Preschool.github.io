/*
  Khaemenes Learner Profile Bridge v1.1
  Local-first continuity reader for Verve N Veda educational portals.
  This file does not transmit data and does not create an account.
*/
(function attachKhaemenesProfileBridge(global) {
  "use strict";

  const KEYS = Object.freeze({
    profile: "khaemenes_preschool_profile_v1",
    continuity: "khaemenes_learning_continuity_v1",
    favoritesByLearner: "khaemenes_profile_favorites_v1",
    visitsByLearner: "khaemenes_profile_visits_v1"
  });

  function readJSON(key, fallback = null) {
    try {
      const value = global.localStorage.getItem(key);
      return value ? JSON.parse(value) : fallback;
    } catch {
      return fallback;
    }
  }

  function getProfile() {
    return readJSON(KEYS.profile, null);
  }

  function getContinuity() {
    return readJSON(KEYS.continuity, null);
  }

  function getPinnedActivities() {
    const record = getContinuity();
    return Array.isArray(record?.favorites) ? record.favorites : [];
  }

  function getFavoriteIds() {
    const record = getContinuity();
    if (Array.isArray(record?.favoriteIds)) return record.favoriteIds;
    return getPinnedActivities().map(item => item.id).filter(Boolean);
  }

  function getVisitedIds() {
    const record = getContinuity();
    return Array.isArray(record?.visitedIds) ? record.visitedIds : [];
  }

  function getSummary() {
    const profile = getProfile();
    return {
      hasProfile: Boolean(profile),
      nickname: profile?.nickname || null,
      ageBand: profile?.ageBand || null,
      pathway: profile?.pathway || "preschool",
      mentorId: profile?.mentorId || null,
      pinnedCount: getFavoriteIds().length,
      visitedCount: getVisitedIds().length,
      updatedAt: getContinuity()?.updatedAt || null
    };
  }

  function subscribe(listener) {
    if (typeof listener !== "function") {
      throw new TypeError("A listener function is required.");
    }
    const handler = event => {
      if (Object.values(KEYS).includes(event.key)) listener(getSummary(), event);
    };
    global.addEventListener("storage", handler);
    return () => global.removeEventListener("storage", handler);
  }

  function ensureBetaProgramLink(){
    if(!global.document)return;
    if(global.document.querySelector('script[data-vnv-beta-link],script[src="https://vervenveda.com/assets/vnv-beta-link.js"]'))return;
    const script=global.document.createElement("script");
    script.src="https://vervenveda.com/assets/vnv-beta-link.js";
    script.defer=true;
    script.dataset.vnvBetaLink="preschool";
    global.document.head.appendChild(script);
  }

  global.KhaemenesLearnerProfile = Object.freeze({
    version: "1.1.0",
    keys: KEYS,
    getProfile,
    getContinuity,
    getPinnedActivities,
    getFavoriteIds,
    getVisitedIds,
    getSummary,
    subscribe,
    ensureBetaProgramLink
  });

  if(global.document?.readyState==="loading")global.document.addEventListener("DOMContentLoaded",ensureBetaProgramLink,{once:true});
  else ensureBetaProgramLink();
})(window);
