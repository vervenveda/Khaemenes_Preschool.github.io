/* Preschool student profile Family Progress: read-only, learner-scoped. */
(function(global){
"use strict";
if(global.KhaemenesPreKFamilyProgress)return;
const COURSE="preschool-adventure-garden";
const byId=id=>document.getElementById(id);
function active(){
 const R=global.KhaemenesFamilyRegistry,ids=R?.activeIds?.()||{};
 const child=R?.getLearner?.(ids.learnerId),family=R?.getFamily?.(ids.familyId);
 return child&&family&&child.learnerId===ids.learnerId&&child.familyId===family.familyId&&child.stage==="preschool"&&
  child.grade==="pre-k"&&!child.selfDirectedAdult&&family.learnerIds?.includes(child.learnerId)?child:null;
}
function summary(){
 const child=active(),C=global.KhaemenesLearningContinuation;
 if(!child)return Object.freeze({kind:"select"});
 const report=C?.readCourse?.(child.learnerId,COURSE);
 if(!report||report.learnerId!==child.learnerId||report.courseId!==COURSE||report.stage!=="preschool"||report.grade!=="Pre-K")
  return Object.freeze({kind:"missing",nickname:child.nickname||"Learner"});
 const completed=report.progress?.completed,total=report.progress?.total;
 return Object.freeze({
  kind:"available",nickname:child.nickname||"Learner",
  explored:Number.isFinite(completed)&&completed>=0?completed:null,
  total:Number.isFinite(total)&&total>0?total:null,
  next:report.nextTitle||"Choose an adventure",
  stale:report.stale===true,
  updated:report.updatedAt||null
 });
}
function render(){
 const message=byId("prekFamilyProgressMessage"),details=byId("prekFamilyProgressDetails");
 if(!message||!details)return;
 const s=summary();
 details.replaceChildren();
 if(s.kind==="select"){
  message.textContent="Select a registered Pre-K learner from your family to see their activity summary.";
  details.textContent="Anonymous play is not attached to a family profile.";
 }else if(s.kind==="missing"){
  message.textContent=s.nickname+" has no published family adventure summary on this browser yet.";
  details.textContent="This does not mean no learning has happened. Open the Preschool Adventure Garden to refresh available activities.";
 }else{
  message.textContent=s.nickname+" · "+(s.explored===null?"Activity count not reported":s.explored+" of "+(s.total??"available")+" adventures explored");
  const p=document.createElement("p");
  p.textContent="Next adventure: "+s.next;
  const freshness=document.createElement("p");
  freshness.textContent=s.stale?"A newer activity may be available. Reopen the Garden to refresh this summary.":(s.updated?"Last reported: "+new Date(s.updated).toLocaleString():"Last update not reported");
  details.append(p,freshness);
 }
}
function init(){render()}
if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",init,{once:true});else init();
for(const event of ["pageshow","khaemenes-family-changed","khaemenes-learning-continuation-changed"])global.addEventListener(event,render);
global.addEventListener("storage",event=>{
 if(["khaemenes_family_registry_v1","khaemenes_active_learner_v1",global.KhaemenesLearningContinuation?.storageKey].includes(event.key))render();
});
global.KhaemenesPreKFamilyProgress=Object.freeze({version:"1.0.0",summary,render});
})(window);
