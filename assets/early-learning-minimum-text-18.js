/* Early-learning landing-page minimum text size. Scoped by explicit script inclusion.
 * Leaves larger typography, graphics, and learner data untouched.
 */
(function(){
  "use strict";
  const MIN=18;
  const EXCLUDED="script,style,template,svg,math,canvas,noscript";
  let queued=false;
  function scan(){
    queued=false;
    const nodes=document.body?.querySelectorAll("*")||[];
    for(const el of nodes){
      if(el.matches(EXCLUDED)||el.closest("svg,math,canvas,template")||!el.getClientRects().length)continue;
      // Only nodes with their own direct text, or text-bearing form controls.
      const text=Array.from(el.childNodes).some(n=>n.nodeType===3&&n.textContent.trim());
      const control=el.matches("input,select,textarea,button");
      if(!text&&!control)continue;
      const computed=getComputedStyle(el);
      const px=parseFloat(computed.fontSize);
      if(Number.isFinite(px)&&px<MIN)el.style.setProperty("font-size",MIN+"px","important");
    }
  }
  function queue(){if(!queued){queued=true;requestAnimationFrame(scan)}}
  if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",queue,{once:true});else queue();
  const observer=new MutationObserver(queue);
  observer.observe(document.documentElement,{subtree:true,childList:true,attributes:true,attributeFilter:["class","style","hidden"]});
  addEventListener("resize",queue,{passive:true});
  document.fonts?.ready?.then(queue).catch(()=>{});
})();
