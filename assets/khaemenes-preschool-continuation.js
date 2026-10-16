(function attachKhaemenesPreschoolContinuation(global){
"use strict";
const VERSION="1.0.0";
const PROFILE_KEY="khaemenes_preschool_profile_v1";
const VISITS_KEY="khaemenes_profile_visits_v1";
const FAVORITES_KEY="khaemenes_profile_favorites_v1";
const LAST_KEY="khaemenes_preschool_last_open_v1";
const CONT_URL="https://vervenveda.com/Khaemenes_Academy.github.io/assets/khaemenes-learning-continuation.js";

function read(key,fallback=null){try{const raw=localStorage.getItem(key);return raw?JSON.parse(raw):fallback}catch{return fallback}}
function activePreschoolLearner(){
 const R=global.KhaemenesFamilyRegistry;if(!R)return null;
 const ids=R.activeIds?.()||{};
 const learner=R.getLearner?.(ids.learnerId)||null;
 const stage=R.normalizeStage?R.normalizeStage(learner?.stage):String(learner?.stage||"").toLowerCase();
 return stage==="preschool"?learner:null;
}
function linkedProfile(learner){
 const profile=read(PROFILE_KEY,null);
 if(!learner?.learnerId||!profile?.learnerId)return null;
 return String(profile.learnerId)===String(learner.learnerId)?profile:null;
}
function catalog(){
 const C=global.KhaemenesPreschoolCatalog;
 return Array.isArray(C?.childActivities?.())?C.childActivities():[];
}
function appUrl(app){
 if(!app?.file)return "https://vervenveda.com/Khaemenes_Preschool.github.io/#rooms";
 try{return new URL("./apps/"+String(app.file).split("/").map(encodeURIComponent).join("/"),"https://vervenveda.com/Khaemenes_Preschool.github.io/").href}
 catch{return "https://vervenveda.com/Khaemenes_Preschool.github.io/#rooms"}
}
function publish(){
 const C=global.KhaemenesLearningContinuation,learner=activePreschoolLearner();
 if(!C?.publish||!learner?.learnerId)return false;
 const profile=linkedProfile(learner);
 if(!profile)return false; // Never attach anonymous browser play to a formal learner.

 const apps=catalog(),byId=id=>apps.find(a=>String(a.id)===String(id))||null;
 const visits=read(VISITS_KEY,{})?.[learner.learnerId]||[];
 const favorites=read(FAVORITES_KEY,{})?.[learner.learnerId]||[];
 const visitedIds=Array.isArray(visits)?visits:[];
 const favoriteIds=Array.isArray(favorites)?favorites:[];
 const last=read(LAST_KEY,null);
 const lastApp=last?.id&&visitedIds.includes(last.id)?byId(last.id):null;
 const favoriteApp=favoriteIds.map(byId).find(Boolean)||null;
 const next=lastApp||favoriteApp||apps[0]||null;
 const explored=apps.filter(a=>visitedIds.includes(a.id)).length;
 const total=apps.length||52;
 const pct=Math.round(explored/Math.max(1,total)*100);

 const firstAdventure=explored===0;
 const nextTitle=next?String(next.title||"Crechè Adventure"):"Choose Your First Adventure";
 const nextHref=next?appUrl(next):"https://vervenveda.com/Khaemenes_Preschool.github.io/#rooms";
 const summary=firstAdventure
   ? "Choose a gentle first adventure. Preschool exploration is playful and family-guided; it is not treated as a mastery grade."
   : `${explored} adventure${explored===1?"":"s"} explored · ${favoriteIds.length} favorite${favoriteIds.length===1?"":"s"}. Continue the most recent adventure or choose a new room.`;

 try{
   C.publish({
     learnerId:learner.learnerId,
     courseId:"preschool-adventure-garden",
     school:"Khaemenes Preschool",
     stage:"preschool",
     grade:"Pre-K",
     subject:"Early Learning",
     courseTitle:"Crechè Adventure Garden",
     status:"continue",
     nextLabel:firstAdventure?"Choose an Adventure":"Continue Your Adventure",
     nextTitle,
     nextHref,
     summary,
     progress:{completed:explored,total,percent:pct},
     mastery:{best:null,threshold:null,mastered:false},
     family:{needsAction:false,label:"",summary:"",href:""},
     source:"preschool-adventure-continuity"
   });
   return true;
 }catch{return false}
}
async function ensureContract(){
 if(global.KhaemenesLearningContinuation)return global.KhaemenesLearningContinuation;
 const existing=[...document.scripts].find(s=>s.src===CONT_URL);
 if(existing)return new Promise(resolve=>{existing.addEventListener("load",()=>resolve(global.KhaemenesLearningContinuation),{once:true});setTimeout(()=>resolve(global.KhaemenesLearningContinuation),1200)});
 return new Promise(resolve=>{const s=document.createElement("script");s.src=CONT_URL;s.async=false;s.onload=()=>resolve(global.KhaemenesLearningContinuation);s.onerror=()=>resolve(null);document.head.append(s)});
}
let timer=0;
function schedule(){clearTimeout(timer);timer=setTimeout(()=>ensureContract().then(publish),80)}
function boot(){
 schedule();
 global.addEventListener("khaemenes-preschool-continuity-changed",schedule);
 global.addEventListener("khaemenes-family-changed",schedule);
 global.addEventListener("storage",e=>{if([PROFILE_KEY,VISITS_KEY,FAVORITES_KEY,LAST_KEY].includes(e.key))schedule()});
}
if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",boot,{once:true});else boot();
global.KhaemenesPreschoolContinuation=Object.freeze({version:VERSION,publish});
})(window);