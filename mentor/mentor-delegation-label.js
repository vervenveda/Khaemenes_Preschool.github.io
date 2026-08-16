(() => {
  "use strict";
  function apply(){
    const label=document.getElementById("mentorLabel");
    if(label)label.textContent="Khaemenes Academy Mentor · delegated through NAIB";
  }
  document.addEventListener("DOMContentLoaded",apply);
  window.addEventListener("khaemenes-naib-ready",()=>setTimeout(apply,0));
  window.addEventListener("khaemenes-family-changed",()=>setTimeout(apply,0));
})();
