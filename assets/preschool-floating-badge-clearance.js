/* Scoped overlap avoidance for the Preschool learner badge.
 * Only moves a matching floating badge when it intersects the Academy toolbar.
 * Never changes the toolbar, its buttons, or learner records.
 */
(function(){
 "use strict";
 const toolbarSelector="#khaemenesLandingToolbar,.khaemenes-landing-toolbar,[data-khaemenes-toolbar]";
 const offsets=new WeakMap();
 let queued=false;
 function intersect(a,b){return a.left<b.right&&a.right>b.left&&a.top<b.bottom&&a.bottom>b.top}
 function check(){
  queued=false;
  const toolbar=document.querySelector(toolbarSelector);
  if(!toolbar||!toolbar.getClientRects().length)return;
  const tr=toolbar.getBoundingClientRect();
  const candidates=Array.from(document.querySelectorAll("body *")).filter(el=>{
   if(el.closest(toolbarSelector)||el.children.length>4)return false;
   const t=(el.textContent||"").trim();
   return t.length<140&&/\bRuby\s*[·-]\s*Kindergarten\b/i.test(t);
  });
  for(const child of candidates){
   let node=child;
   while(node&&node!==document.body&&getComputedStyle(node).position!=="fixed")node=node.parentElement;
   if(!node||node===document.body||node.closest(toolbarSelector))continue;
   if(!offsets.has(node))offsets.set(node,node.style.translate||"");
   node.style.translate=offsets.get(node);
   const r=node.getBoundingClientRect();
   if(!intersect(r,tr))continue;
   const lift=Math.ceil(r.bottom-tr.top+14);
   node.style.translate="0 -"+Math.min(lift,Math.max(0,r.top-12))+"px";
  }
 }
 function queue(){if(!queued){queued=true;requestAnimationFrame(check)}}
 if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",queue,{once:true});else queue();
 new MutationObserver(queue).observe(document.documentElement,{childList:true,subtree:true});
 addEventListener("resize",queue,{passive:true});
})();
