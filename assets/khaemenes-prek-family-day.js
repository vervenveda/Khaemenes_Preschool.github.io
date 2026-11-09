/* Pre-K family-assisted daily learning and observation keepsakes.
 * No formal grades, cloud storage, account verification or placement changes.
 */
(function(global){
"use strict";
if(global.KhaemenesPreKFamilyDay)return;
const SCHEMA="khaemenes.prek.family-day.v1",PREFIX=SCHEMA+":",TASKS=["story","create","move","connect"];
const $=id=>document.getElementById(id);
const nowDay=()=>{const d=new Date();return [d.getFullYear(),String(d.getMonth()+1).padStart(2,"0"),String(d.getDate()).padStart(2,"0")].join("-")};
function selected(){
 const R=global.KhaemenesFamilyRegistry,ids=R?.activeIds?.()||{};
 const learner=R?.getLearner?.(ids.learnerId),family=R?.getFamily?.(ids.familyId);
 if(!learner||!family||learner.learnerId!==ids.learnerId||learner.familyId!==family.familyId||
    learner.stage!=="preschool"||learner.grade!=="pre-k"||learner.selfDirectedAdult||
    !family.learnerIds?.includes(learner.learnerId))return null;
 return learner;
}
const key=id=>PREFIX+encodeURIComponent(id);
function read(id){
 if(!id)return null;
 try{
  const raw=global.localStorage.getItem(key(id));
  if(!raw)return {schema:SCHEMA,learnerId:id,days:{}};
  const value=JSON.parse(raw);
  return value?.schema===SCHEMA&&value.learnerId===id&&value.days&&typeof value.days==="object"&&!Array.isArray(value.days)?value:null;
 }catch{return null}
}
function save(id,record){
 try{
  const serialized=JSON.stringify(record);
  global.localStorage.setItem(key(id),serialized);
  return global.localStorage.getItem(key(id))===serialized;
 }catch{return false}
}
function normalizeDay(row){
 const checks={};
 for(const task of TASKS)checks[task]=row?.checks?.[task]===true;
 return {checks,observation:typeof row?.observation==="string"?row.observation.slice(0,240):""};
}
function update(kind,payload){
 const learner=selected(),id=learner?.learnerId,day=nowDay();
 if(!id)return {ok:false,reason:"Select a registered Pre-K learner first."};
 const record=read(id);
 if(!record)return {ok:false,reason:"Existing family records require review. Nothing was overwritten."};
 const current=normalizeDay(record.days[day]);
 if(kind==="checks")current.checks=Object.fromEntries(TASKS.map(task=>[task,payload?.[task]===true]));
 else if(kind==="observation")current.observation=String(payload||"").trim().slice(0,240);
 else return {ok:false,reason:"Unknown family activity."};
 if(selected()?.learnerId!==id)return {ok:false,reason:"The selected learner changed; nothing was saved."};
 const days={...record.days,[day]:current};
 const keys=Object.keys(days).filter(x=>/^\d{4}-\d{2}-\d{2}$/.test(x)).sort().reverse().slice(0,14);
 const retained=Object.fromEntries(keys.map(k=>[k,normalizeDay(days[k])]));
 const next={schema:SCHEMA,learnerId:id,updatedAt:new Date().toISOString(),days:retained};
 if(!save(id,next))return {ok:false,reason:"This browser did not confirm the save."};
 return {ok:true,reason:"Saved for this child on this browser."};
}
function view(){
 const child=selected();
 if(!child)return {kind:"select",days:[],today:null};
 const record=read(child.learnerId);
 if(!record)return {kind:"invalid",days:[],today:null};
 const days=Object.entries(record.days).filter(([date])=>/^\d{4}-\d{2}-\d{2}$/.test(date)).sort((a,b)=>b[0].localeCompare(a[0])).slice(0,14).map(([date,row])=>({date,...normalizeDay(row)}));
 return {kind:"ready",learnerId:child.learnerId,today:normalizeDay(record.days[nowDay()]),days};
}
function render(){
 const s=view();
 const status=$("prekDayStatus"),journalStatus=$("prekKeepsakeStatus"),journal=$("prekKeepsakeEntries");
 if(!status||!journalStatus||!journal)return;
 const ready=s.kind==="ready";
 for(const task of TASKS){const checkbox=$("prekTask_"+task);if(checkbox){checkbox.checked=ready&&s.today.checks[task];checkbox.disabled=!ready}}
 const observation=$("prekObservation");
 if(observation){observation.value=ready?s.today.observation:"";observation.disabled=!ready}
 for(const btn of ["prekSaveDay","prekSaveObservation"])if($(btn))$(btn).disabled=!ready;
 status.textContent=ready?"Today's activity choices are ready for a grown-up to save.":"Select a registered child to use this family-assisted checklist.";
 journalStatus.textContent=ready?"Only short family reflections are saved on this browser. They are not formal assessments.":"No learner-selected observations are displayed.";
 journal.replaceChildren();
 if(!ready)return;
 const items=s.days.filter(x=>x.observation);
 if(!items.length){const p=document.createElement("p");p.textContent="No family learning keepsakes saved yet.";journal.append(p)}
 for(const entry of items){
  const row=document.createElement("article"),heading=document.createElement("strong"),p=document.createElement("p");
  heading.textContent=entry.date;p.textContent=entry.observation;
  row.className="prek-keepsake-entry";row.append(heading,p);journal.append(row);
 }
}
function init(){
 const dayButton=$("prekSaveDay"),noteButton=$("prekSaveObservation");
 if(!dayButton||!noteButton)return;
 dayButton.addEventListener("click",()=>{
  if(!$("prekDayAdultConfirm")?.checked){$("prekDayStatus").textContent="A grown-up must confirm before saving.";return}
  const result=update("checks",Object.fromEntries(TASKS.map(task=>[task,$("prekTask_"+task)?.checked===true])));
  render();$("prekDayStatus").textContent=result.reason;
 });
 noteButton.addEventListener("click",()=>{
  if(!$("prekKeepsakeAdultConfirm")?.checked){$("prekKeepsakeStatus").textContent="A grown-up must confirm before saving.";return}
  const result=update("observation",$("prekObservation")?.value||"");
  render();$("prekKeepsakeStatus").textContent=result.reason;
 });
 render();
}
if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",init,{once:true});else init();
for(const name of ["pageshow","khaemenes-family-changed"])global.addEventListener(name,()=>{
 for(const id of ["prekDayAdultConfirm","prekKeepsakeAdultConfirm"])if($(id))$(id).checked=false;
 render();
});
global.addEventListener("storage",event=>{
 if(event.key==="khaemenes_family_registry_v1"||event.key==="khaemenes_active_learner_v1"||event.key?.startsWith(PREFIX))render();
});
global.KhaemenesPreKFamilyDay=Object.freeze({version:"1.0.0",selected,view,update});
})(window);
