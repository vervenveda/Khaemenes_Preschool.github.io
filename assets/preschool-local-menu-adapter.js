/* Khaemenes Preschool · local hamburger adapter
   Supplies the canonical VNV header engine with a Preschool-only menu. */
(()=>{"use strict";
if(window.VNV_ENRICHED_MENU?.prekContained)return;
const ID="vnvEnrichedMenuOverlay";
const HOME="https://vervenveda.com/Khaemenes_Preschool.github.io/";
const links=[
 ["🏡 Preschool Home",HOME],
 ["☀️ Today",HOME+"#today"],
 ["🌈 Learning Garden",HOME+"#activities"],
 ["📚 Reading Time",HOME+"#readingFeature"],
 ["😊 My Profile",HOME+"student-profile/"],
 ["🎓 Graduation Garden",HOME+"graduation/"],
 ["🧑‍🧒 Grown-Up Corner",HOME+"?view=grownup#profiles"]
];
let returnFocus=null;
function mount(){
 if(document.getElementById(ID))return document.getElementById(ID);
 const overlay=document.createElement("div");
 overlay.id=ID; overlay.dataset.open="false"; overlay.setAttribute("aria-hidden","true");
 overlay.innerHTML='<aside class="prek-local-menu-panel" role="dialog" aria-modal="true" aria-label="Preschool menu"><div class="prek-local-menu-top"><strong>Preschool Menu</strong><button type="button" class="prek-local-menu-close" aria-label="Close Preschool menu">×</button></div><nav class="prek-local-menu-list" aria-label="Preschool destinations"></nav></aside>';
 const nav=overlay.querySelector("nav");
 for(const [label,href] of links){const a=document.createElement("a");a.href=href;a.textContent=label;nav.append(a)}
 overlay.querySelector(".prek-local-menu-close").addEventListener("click",close);
 overlay.addEventListener("click",e=>{if(e.target===overlay)close()});
 document.addEventListener("keydown",e=>{if(e.key==="Escape"&&overlay.dataset.open==="true")close()});
 document.body.append(overlay);
 return overlay;
}
function open(){
 const overlay=mount(); returnFocus=document.activeElement;
 overlay.dataset.open="true"; overlay.setAttribute("aria-hidden","false");
 overlay.querySelector(".prek-local-menu-close")?.focus();
}
function close(){
 const overlay=document.getElementById(ID); if(!overlay)return;
 overlay.dataset.open="false"; overlay.setAttribute("aria-hidden","true");
 if(returnFocus&&typeof returnFocus.focus==="function")returnFocus.focus();
}
window.VNV_ENRICHED_MENU=Object.freeze({prekContained:true,mount,open,close});
})();