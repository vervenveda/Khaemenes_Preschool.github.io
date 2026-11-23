/* Pre-K isolated Edit Profile + Edit Background studios.
 * Adapted from the High School Grade 09 student-profile-details.js and
 * student-profile-background.js feature patterns, without high-school fields.
 * Identity comes ONLY from the existing Academy family registry.
 * No cloud writes, student grades, IDs, academic progress, or photo keys touched.
 */
(()=>{"use strict";
if(window.KhaemenesPrekPersonalization)return;
const $=id=>document.getElementById(id);
const PROFILE_PREFIX="khaemenes.prek.personal-details.v1:";
const BG_PREFIX="khaemenes.prek.background-studio.v1:";
const DEFAULT="#ffadad";
const choices=[
 ["🪸 Coral","#ffadad"],["🌈 Pink","#ff88c8"],["🌞 Sunshine","#ffe45e"],
 ["🌊 Aqua","#9bf6ff"],["🌱 Garden","#77e6b6"],["🦄 Lavender","#b89cff"],
 ["🍊 Orange","#ffb347"],["💙 Blue","#62e4f5"]
];
const stickers=["🌈","🦋","🌻","⭐","🎨","🦊","🚀","🎵","🐢","🐝"];
const fields=[
 ["about","🌈 All About Me","textarea","What makes you happy?"],
 ["favoriteGame","🎮 My Favorite Game","text","A game I love to play"],
 ["favoriteStory","📚 My Favorite Story","text","A story I love"],
 ["favoriteColor","🎨 My Favorite Color","text","A color I love"],
 ["favoriteActivity","🌟 My Favorite Activity","text","An adventure I enjoy"],
 ["dream","🌱 Something I Want to Learn","textarea","Something I'd like to try"]
];
function active(){
 const r=window.KhaemenesFamilyRegistry;
 const learner=r?.getLearner?.();
 if(!learner||String(learner.stage).toLowerCase()!=="preschool"||!learner.learnerId)return null;
 const family=r?.getFamily?.(learner.familyId);
 if(!family||!Array.isArray(family.learners)||!family.learners.some(x=>x?.learnerId===learner.learnerId))return null;
 return String(learner.learnerId);
}
const key=(prefix,id)=>prefix+encodeURIComponent(id);
function read(prefix,id){
 if(!id)return null;
 try{const v=JSON.parse(localStorage.getItem(key(prefix,id))||"null");
  return v&&v.learnerId===id&&typeof v==="object"&&!Array.isArray(v)?v:null;
 }catch{return null}
}
function permitted(id){
 return Boolean(id&&active()===id&&$("adultConfirm")?.checked);
}
function status(dialog,message){const el=dialog.querySelector("[data-prek-studio-status]");if(el)el.textContent=message}
function save(prefix,id,record,dialog){
 if(!permitted(id)){status(dialog,"A grown-up must select the existing Pre-K learner and check the permission box in My Picture first.");return false}
 try{localStorage.setItem(key(prefix,id),JSON.stringify({schema:"khaemenes.prek.custom.v1",learnerId:id,updatedAt:new Date().toISOString(),...record}));return true}
 catch{status(dialog,"Unable to save on this device. Existing records were not changed.");return false}
}
function node(tag,attrs={},text=""){
 const n=document.createElement(tag);for(const [k,v] of Object.entries(attrs))n.setAttribute(k,v);if(text)n.textContent=text;return n;
}
function dialog(id,title,emoji){
 const d=node("dialog",{id,class:"prek-edit-dialog","aria-labelledby":id+"Title"});
 const head=node("div",{class:"prek-edit-head"});
 head.append(node("span",{"aria-hidden":"true",class:"prek-edit-icon"},emoji),node("h2",{id:id+"Title"},title));
 const close=node("button",{type:"button",class:"prek-edit-close"},"✕ Close");
 close.addEventListener("click",()=>d.close());head.append(close);d.append(head);
 const st=node("p",{"data-prek-studio-status":"","role":"status","aria-live":"polite",class:"prek-edit-status"});
 d.addEventListener("close",()=>{st.textContent=""});
 document.body.append(d);
 return {d,st};
}
function open(d){
 if(d.open)return;
 if(typeof d.showModal==="function")d.showModal();else d.setAttribute("open","");
}
function addLaunches(){
 const area=document.querySelector("main.shell .profile-hero .hero-actions");
 if(!area||$("prekEditProfileLaunch"))return;
 const a=node("button",{type:"button",id:"prekEditProfileLaunch"},"🖍️ Edit Profile");
 const b=node("button",{type:"button",id:"prekEditBackgroundLaunch"},"🌈 Edit Background");
 area.append(a,b);
 a.addEventListener("click",openProfile);
 b.addEventListener("click",openBackground);
}
function renderPublic(){
 const target=$("prekPersonalIntroduction");if(!target)return;
 const id=active(),v=read(PROFILE_PREFIX,id);
 target.replaceChildren();
 if(!v?.values)return;
 const entries=[["about","🌈"],["favoriteGame","🎮"],["favoriteStory","📚"],["favoriteColor","🎨"],["favoriteActivity","🌟"],["dream","🌱"]];
 for(const [key,icon] of entries){
  if(!v.visible?.[key]||!v.values?.[key])continue;
  const row=node("p",{},icon+" "+v.values[key]);target.append(row);
 }
}
function renderBackground(){
 const id=active(),saved=read(BG_PREFIX,id);
 const color=saved?.color&&choices.some(x=>x[1]===saved.color)?saved.color:null;
 // Respect the original Academy theme setting if no additional studio design is saved.
 if(color){
  document.body.style.setProperty("background",color,"important");
  document.body.dataset.prekStudioColor="custom";
 }else{
  document.body.style.removeProperty("background");
  delete document.body.dataset.prekStudioColor;
 }
 const sticker=$("prekStudioSticker");
 if(sticker){
  const chosen=stickers.includes(saved?.sticker)&&saved.sticker!=="🌈"?saved.sticker:"";
  sticker.textContent=chosen;
  sticker.hidden=!chosen;
 }
}
let profileDialog=null,backgroundDialog=null;
function openProfile(){
 if(!profileDialog){
  const {d,st}=dialog("prekEditProfileDialog","Make My Profile My Own","🖍️");profileDialog=d;
  d.append(node("p",{},"Tell your story, choose favorites, and show only the details you want to display. A grown-up helps save changes."));
  const form=node("form",{class:"prek-edit-form"});form.addEventListener("submit",e=>e.preventDefault());
  for(const [key,label,type,placeholder] of fields){
   const wrap=node("div",{class:"prek-edit-field"});
   const lab=node("label",{for:"prekField_"+key},label);
   const inp=node(type==="textarea"?"textarea":"input",{id:"prekField_"+key,placeholder,maxlength:type==="textarea"?"180":"70"});
   if(type==="text")inp.type="text";
   const visibility=node("label",{class:"prek-edit-check"});
   const check=node("input",{type:"checkbox","data-prek-visible":key});
   visibility.append(check,document.createTextNode(" Show on my profile"));
   wrap.append(lab,inp,visibility);form.append(wrap);
  }
  const picture=node("button",{type:"button"},"🎨 Edit My Picture");
  picture.addEventListener("click",()=>{d.close();document.querySelector("[data-universal-picture]")?.click()});
  const submit=node("button",{type:"submit"},"💾 Save My Profile");
  form.append(picture,submit);form.append(st);d.append(form);
  form.addEventListener("submit",()=>{
   const id=active();const values={},visible={};
   for(const [key] of fields){values[key]=$("prekField_"+key).value.trim();visible[key]=Boolean(d.querySelector('[data-prek-visible="'+key+'"]').checked)}
   if(save(PROFILE_PREFIX,id,{values,visible},d)){renderPublic();status(d,"Profile saved for this learner on this device.")}
  });
 }
 const id=active(),v=read(PROFILE_PREFIX,id);
 for(const [key] of fields){$("prekField_"+key).value=v?.values?.[key]||"";profileDialog.querySelector('[data-prek-visible="'+key+'"]').checked=Boolean(v?.visible?.[key])}
 open(profileDialog);
}
function openBackground(){
 if(!backgroundDialog){
  const {d,st}=dialog("prekEditBackgroundDialog","My Background Studio","🌈");backgroundDialog=d;
  d.append(node("p",{},"Choose a cheerful page color and a little sticker. Only the selected learner's appearance is changed."));
  const colors=node("div",{class:"prek-edit-colors"});
  for(const [label,color] of choices){
   const b=node("button",{type:"button","data-color":color,"aria-label":label},label);
   b.style.backgroundColor=color;b.style.color="#273847";
   b.addEventListener("click",()=>{d.dataset.selectedColor=color;for(const x of colors.children)x.setAttribute("aria-pressed",String(x===b))});
   colors.append(b);
  }
  const row=node("div",{class:"prek-edit-stickers"});
  for(const emoji of stickers){
   const b=node("button",{type:"button","data-sticker":emoji,"aria-label":"Choose "+emoji},emoji);
   b.addEventListener("click",()=>{d.dataset.selectedSticker=emoji;for(const x of row.children)x.setAttribute("aria-pressed",String(x===b))});row.append(b);
  }
  const saveButton=node("button",{type:"button"},"💾 Save My Background");
  saveButton.addEventListener("click",()=>{
   const id=active(),color=d.dataset.selectedColor,sticker=d.dataset.selectedSticker;
   if(save(BG_PREFIX,id,{color,sticker},d)){renderBackground();status(d,"Background saved for this learner on this device.")}
  });
  const reset=node("button",{type:"button"},"↺ Use Original Background");
  reset.addEventListener("click",()=>{
   const id=active();
   if(!permitted(id)){status(d,"Ask a grown-up to confirm before changing your background.");return}
   try{localStorage.removeItem(key(BG_PREFIX,id));renderBackground();status(d,"Original background restored.")}
   catch{status(d,"Could not restore the background on this device.")}
  });
  d.append(node("h3",{},"🎨 My Colors"),colors,node("h3",{},"⭐ My Sticker"),row,saveButton,reset,st);
 }
 const v=read(BG_PREFIX,active());
 backgroundDialog.dataset.selectedColor=v?.color||DEFAULT;
 backgroundDialog.dataset.selectedSticker=v?.sticker||"🌈";
 for(const b of backgroundDialog.querySelectorAll("[data-color]"))b.setAttribute("aria-pressed",String(b.dataset.color===backgroundDialog.dataset.selectedColor));
 for(const b of backgroundDialog.querySelectorAll("[data-sticker]"))b.setAttribute("aria-pressed",String(b.dataset.sticker===backgroundDialog.dataset.selectedSticker));
 open(backgroundDialog);
}
function mount(){
 addLaunches();
 const hero=document.querySelector("main.shell .profile-hero>div:last-child");
 if(hero&&!$("prekPersonalIntroduction"))hero.append(node("div",{id:"prekPersonalIntroduction",class:"prek-personal-introduction","aria-live":"polite"}));
 const frame=$("photoPreview");if(frame&&!$("prekStudioSticker")){const sticker=node("span",{id:"prekStudioSticker",class:"prek-studio-sticker","aria-hidden":"true"});sticker.hidden=true;frame.after(sticker)}
 renderPublic();renderBackground();
}
/* Page-owned picture entry adapter. The Academy's shared editor and its
   family/adult permission checks remain authoritative; never write identity. */
function configurePictureAccordion(){
 const section=$("khaePrekUniversalLookEntry");
 if(!section||section.dataset.prekPictureAccordion==="ready")return Boolean(section);
 const heading=section.querySelector("#kpuTitle");
 const button=section.querySelector("button.kpu-open");
 const statusNode=section.querySelector(".kpu-status");
 if(!heading||!button||!statusNode)return false;
 section.dataset.prekPictureAccordion="ready";
 section.removeAttribute("aria-labelledby");
 section.setAttribute("aria-label","My Picture and Colors");
 const details=node("details",{class:"prek-picture-accordion"});
 const summary=node("summary",{class:"prek-picture-summary"},"🎨 My Picture & Colors");
 summary.setAttribute("aria-label","Expand My Picture and Colors");
 const content=node("div",{class:"prek-picture-contents"});
 const original=[...section.children];
 section.replaceChildren(details);
 details.append(summary,content);
 for(const child of original){if(child===heading){heading.remove();continue}content.append(child)}
 details.open=false;
 const linkToParents=()=>{
  const a=node("a",{href:"../#prekParentCenter"},"Open the Preschool Grown-Up Center");
  statusNode.replaceChildren(
   document.createTextNode("Choose an existing Pre-K learner with a grown-up first. "),
   a
  );
 };
 // The shared script disables this action without identity. Keep the action
 // clickable so its reason is explained; NEVER bypass the native editor gates.
 const keepActionResponsive=()=>{if(button.disabled)button.disabled=false};
 keepActionResponsive();
 const disabledObserver=new MutationObserver(keepActionResponsive);
 disabledObserver.observe(button,{attributes:true,attributeFilter:["disabled"]});
 button.addEventListener("click",event=>{
  const identity=window.KhaemenesPreschoolUniversalLookAdapter?.getIdentity?.();
  if(identity)return; // The Academy's original guarded click handler runs.
  event.stopImmediatePropagation();
  linkToParents();
 },true);
 return true;
}
function mountPictureAccordion(){
 if(configurePictureAccordion())return;
 const observer=new MutationObserver(()=>{
  if(configurePictureAccordion())observer.disconnect();
 });
 observer.observe(document.body,{subtree:true,childList:true});
 window.addEventListener("pagehide",()=>observer.disconnect(),{once:true});
}
window.KhaemenesPrekPersonalization=Object.freeze({mount,refresh:()=>{renderPublic();renderBackground()}});
if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",()=>{mount();mountPictureAccordion()},{once:true});else{mount();mountPictureAccordion()}
window.addEventListener("khaemenes-family-changed",()=>{profileDialog?.close();backgroundDialog?.close();renderPublic();renderBackground()});
document.getElementById("learnerSelect")?.addEventListener("change",()=>setTimeout(()=>{renderPublic();renderBackground()},0));
window.addEventListener("storage",e=>{if(e.key?.startsWith(PROFILE_PREFIX)||e.key?.startsWith(BG_PREFIX)){renderPublic();renderBackground()}});
})();