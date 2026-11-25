/* Khaemenes Preschool · canonical translator resource loader */
(()=>{"use strict";
if(window.KhaemenesPreschoolLanguageLoader)return;
const resources=[
 "https://vervenveda.com/assets/khaemenes-campus-phrases.js",
 "https://vervenveda.com/assets/khaemenes-interlingual-core.js",
 "https://vervenveda.com/Khaemenes_Linguistics.github.io/assets/khaemenes-translator-loader.js?v=1.1.1",
 "https://vervenveda.com/assets/vnv-language.js?v=20261124-header-slot"
];
function load(src){return new Promise(resolve=>{
 const requested=new URL(src,location.href);
 // The canonical interface is not safe to execute twice under different query versions.
 if([...document.scripts].some(s=>{
  if(!s.src)return false;
  const existing=new URL(s.src,location.href);
  return existing.href===requested.href||
   (requested.pathname==="/assets/vnv-language.js"&&existing.origin===requested.origin&&existing.pathname===requested.pathname);
 })){resolve();return}
 const s=document.createElement("script");s.src=src;s.defer=true;s.onload=resolve;s.onerror=resolve;(document.head||document.documentElement).append(s);
})}
function sharedChrome(){
 if(document.querySelector('link[data-preschool-shared-chrome]'))return;
 const link=document.createElement("link");
 link.rel="stylesheet";link.href="/Khaemenes_Preschool.github.io/assets/preschool-shared-chrome.css?v=20261123-4";
 link.dataset.preschoolSharedChrome="true";document.head.append(link);
}
async function start(){
 sharedChrome();
 let rail=document.getElementById("vnv-language-rail");
 if(!rail){rail=document.createElement("div");rail.id="vnv-language-rail";rail.setAttribute("role","group");rail.setAttribute("aria-label","Page translation tools");
 const header=document.getElementById("vnvHeaderAutoPopulate");(header?.parentNode||document.body).insertBefore(rail,header?.nextSibling||document.body.firstChild)}
 for(const src of resources)await load(src);
 try{await window.KhaemenesTranslatorLoader?.ensure?.({full:true,upgradeLegacyCore:true});window.VNVLanguage?.refresh?.()}catch{}
 /* Official language script may mount before <main> on non-gateway pages.
    Rehome its ONE control into the shared rail; do not clone or rebuild it. */
 const attach=()=>{
  const canonical=document.getElementById("vnv-language-switch");
  const target=document.getElementById("vnv-language-rail");
  if(!canonical||!target)return false;
  if(canonical.parentElement!==target)target.append(canonical);
  return true;
 };
 if(!attach()){
  const watch=new MutationObserver(()=>{if(attach())watch.disconnect()});
  watch.observe(document.body,{childList:true,subtree:true});
  document.addEventListener("vnv:language-change",()=>watch.disconnect(),{once:true});
 }
}
window.KhaemenesPreschoolLanguageLoader=Object.freeze({start});
if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",start,{once:true});else start();
})();