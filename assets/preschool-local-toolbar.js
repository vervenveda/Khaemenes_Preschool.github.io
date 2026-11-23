/* Preschool external-link boundary · preserved after retirement of local toolbar.
   Navigation safety only. The lower-left toolbar is owned by VNV Class Tools. */
(()=>{"use strict";
if(window.KhaemenesPreschoolExitGuard)return;
window.KhaemenesPreschoolExitGuard=true;
function samePreschool(url){
 try{
  const u=new URL(url,location.href);
  return /\/Khaemenes_Preschool\.github\.io(?:\/|$)/.test(u.pathname);
 }catch{return true}
}
function guardExternal(event){
 const anchor=event.target.closest?.("a[href]");
 if(!anchor||anchor.hasAttribute("download")||anchor.dataset.prekGrownupExit==="true")return;
 if(samePreschool(anchor.href))return;
 if(anchor.closest("#vnvEnrichedMenuOverlay")||anchor.closest("#vnvHeaderAutoPopulate")||anchor.closest("#vnvClassToolsToolbar"))return;
 if(anchor.closest("#prekParentCenter")||document.body.dataset.view==="grownup")return;
 event.preventDefault();
 const notice=document.getElementById("prekExitNotice");
 if(notice){notice.hidden=false;notice.querySelector("button")?.focus()}
}
function mount(){
 if(!document.body)return;
 // Retire any old local floating toolbar. Do not interfere with canonical VNV tools.
 document.getElementById("prekLocalToolbar")?.remove();
 if(!document.getElementById("prekExitNotice")){
  const notice=document.createElement("div");
  notice.id="prekExitNotice";notice.hidden=true;
  notice.innerHTML='<div class="prek-exit-card" role="dialog" aria-modal="true" aria-label="Grown-up link notice"><strong>Grown-Up Link</strong><p>This destination is outside Preschool. Please ask a grown-up to use the Grown-Up Corner from Preschool Home.</p><button type="button">Return to Preschool</button></div>';
  document.body.append(notice);
  notice.querySelector("button").addEventListener("click",()=>{
   notice.hidden=true;
   document.getElementById("vnvClassToolsToggle")?.focus();
  });
 }
 document.addEventListener("click",guardExternal,true);
}
if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",mount,{once:true});
else mount();
})();
