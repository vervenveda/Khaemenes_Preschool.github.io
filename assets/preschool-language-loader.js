/* Khaemenes Preschool · canonical translator resource loader */
(()=>{"use strict";
if(window.KhaemenesPreschoolLanguageLoader)return;
const resources=[
 "https://vervenveda.com/assets/khaemenes-campus-phrases.js",
 "https://vervenveda.com/assets/khaemenes-interlingual-core.js",
 "https://vervenveda.com/Khaemenes_Linguistics.github.io/assets/khaemenes-translator-loader.js?v=1.1.1",
 "https://vervenveda.com/assets/vnv-language.js?v=20261108-cream-buttons"
];
function load(src){return new Promise(resolve=>{
 if([...document.scripts].some(s=>s.src===new URL(src,location.href).href)){resolve();return}
 const s=document.createElement("script");s.src=src;s.defer=true;s.onload=resolve;s.onerror=resolve;(document.head||document.documentElement).append(s);
})}
async function start(){
 let rail=document.getElementById("vnv-language-rail");
 if(!rail){rail=document.createElement("div");rail.id="vnv-language-rail";rail.setAttribute("role","group");rail.setAttribute("aria-label","Page translation tools");
 const header=document.getElementById("vnvHeaderAutoPopulate");(header?.parentNode||document.body).insertBefore(rail,header?.nextSibling||document.body.firstChild)}
 for(const src of resources)await load(src);
 try{await window.KhaemenesTranslatorLoader?.ensure?.({full:true,upgradeLegacyCore:true});window.VNVLanguage?.refresh?.()}catch{}
}
window.KhaemenesPreschoolLanguageLoader=Object.freeze({start});
if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",start,{once:true});else start();
})();