/* Khaemenes Preschool · child-safe local toolbar */
(()=>{"use strict";
if(window.KhaemenesPreschoolLocalToolbar)return;
const HOME="https://vervenveda.com/Khaemenes_Preschool.github.io/";
function samePreschool(url){
 try{
  const u=new URL(url,location.href);
  return /\/Khaemenes_Preschool\.github\.io(?:\/|$)/.test(u.pathname);
 }catch{return true}
}
function guardExternal(event){
 const a=event.target.closest?.("a[href]");
 if(!a||a.hasAttribute("download")||a.dataset.prekGrownupExit==="true")return;
 if(samePreschool(a.href))return;
 event.preventDefault();
 const box=document.getElementById("prekExitNotice");
 if(box){box.hidden=false;box.querySelector("button")?.focus()}
}
function readPage(){
 if(!("speechSynthesis" in window))return;
 speechSynthesis.cancel();
 const h=document.querySelector("main h1,h1");
 const p=document.querySelector("main p,.hero p");
 const text=[h?.textContent,p?.textContent].filter(Boolean).join(". ").trim();
 if(!text)return;
 const u=new SpeechSynthesisUtterance(text);u.rate=.9;speechSynthesis.speak(u);
}
function mount(){
 if(document.getElementById("prekLocalToolbar"))return;
 const wrap=document.createElement("div");wrap.id="prekLocalToolbar";
 wrap.innerHTML='<button class="prek-tool-toggle" type="button" aria-expanded="false" aria-controls="prekToolPanel">Tools</button><div id="prekToolPanel" class="prek-tool-panel" hidden><a href="'+HOME+'">🏡 Home</a><a href="'+HOME+'#today">☀️ Today</a><a href="'+HOME+'student-profile/">😊 Profile</a><a href="'+HOME+'#readingFeature">📚 Reading</a><button type="button" data-prek-read>🔊 Read</button><button type="button" data-prek-calm>🌤️ Calm</button></div>';
 document.body.append(wrap);
 const toggle=wrap.querySelector(".prek-tool-toggle"),panel=wrap.querySelector(".prek-tool-panel");
 toggle.addEventListener("click",()=>{const open=panel.hidden;panel.hidden=!open;toggle.setAttribute("aria-expanded",String(open))});
 wrap.querySelector("[data-prek-read]").addEventListener("click",readPage);
 wrap.querySelector("[data-prek-calm]").addEventListener("click",()=>document.documentElement.classList.toggle("prek-calm"));
 const notice=document.createElement("div");notice.id="prekExitNotice";notice.hidden=true;
 notice.innerHTML='<div class="prek-exit-card" role="dialog" aria-modal="true" aria-label="Grown-up link notice"><strong>Grown-Up Link</strong><p>This destination is outside Preschool. Please ask a grown-up to use the Grown-Up Corner from Preschool Home.</p><button type="button">Return to Preschool</button></div>';
 document.body.append(notice);notice.querySelector("button").addEventListener("click",()=>{notice.hidden=true;toggle.focus()});
 document.addEventListener("click",guardExternal,true);
}
window.KhaemenesPreschoolLocalToolbar=Object.freeze({mount});
if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",mount,{once:true});else mount();
})();