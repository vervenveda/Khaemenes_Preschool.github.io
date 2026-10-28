/*
  Khaemenes Preschool Voice Bridge
  Version: 1.0.0

  Shared browser-speech policy for Preschool learning activities.
  This module does not replace Eiren's creative-specialist adapter.
  It standardizes local SpeechSynthesis voice selection and fallback only.
*/
(function(global){
  "use strict";
  const DEFAULTS=Object.freeze({
    lang:"en-US", rate:.88, pitch:1.06, volume:1,
    role:"eiren", gentle:true
  });
  const FEMALE_HINT=/samantha|victoria|karen|moira|tessa|serena|ava|allison|susan|zira|aria|jenny|female|woman|eiren/i;
  const MALE_HINT=/daniel|alex|oliver|arthur|george|fred|david|guy|male|man|archaemenes/i;
  const QUALITY_HINT=/natural|enhanced|premium|neural|online/i;
  const ENGLISH=/^en([_-]|$)/i;
  let cache=[];

  function supported(){return "speechSynthesis" in global&&"SpeechSynthesisUtterance" in global}
  function refresh(){cache=supported()?(global.speechSynthesis.getVoices()||[]):[];return cache.slice()}
  function voices(){return cache.length?cache.slice():refresh()}
  function score(v,opts){
    const name=String(v?.name||""),lang=String(v?.lang||"");
    let n=0;
    if(opts.lang&&lang.toLowerCase()===opts.lang.toLowerCase())n+=12;
    else if(ENGLISH.test(lang))n+=8;
    if(QUALITY_HINT.test(name))n+=3;
    if(opts.role==="archaemenes"&&MALE_HINT.test(name))n+=9;
    if(opts.role!=="archaemenes"&&FEMALE_HINT.test(name))n+=9;
    if(opts.prefer&&new RegExp(opts.prefer,"i").test(name))n+=14;
    if(opts.avoid&&new RegExp(opts.avoid,"i").test(name))n-=12;
    return n;
  }
  function choose(options={}){
    const opts=Object.assign({},DEFAULTS,options);
    const pool=voices();
    if(!pool.length)return null;
    return pool.slice().sort((a,b)=>score(b,opts)-score(a,opts))[0]||null;
  }
  function stop(){if(supported())global.speechSynthesis.cancel()}
  function utterance(text,options={}){
    if(!supported())return null;
    const phrase=String(text??"").trim(); if(!phrase)return null;
    const opts=Object.assign({},DEFAULTS,options);
    const u=new SpeechSynthesisUtterance(phrase),v=choose(opts);
    if(v)u.voice=v;
    u.lang=v?.lang||opts.lang;
    u.rate=Math.max(.55,Math.min(1.2,Number(opts.rate)||DEFAULTS.rate));
    u.pitch=Math.max(.6,Math.min(1.5,Number(opts.pitch)||DEFAULTS.pitch));
    u.volume=Math.max(0,Math.min(1,Number(opts.volume)));
    if(typeof opts.onstart==="function")u.onstart=opts.onstart;
    if(typeof opts.onend==="function")u.onend=opts.onend;
    if(typeof opts.onerror==="function")u.onerror=opts.onerror;
    return u;
  }
  function speak(text,options={}){
    const u=utterance(text,options); if(!u)return null;
    if(options.cancel!==false)stop();
    global.speechSynthesis.speak(u); return u;
  }
  const api=Object.freeze({
    version:"1.0.0", supported, refresh, voices, choose, utterance, speak, stop,
    profiles:Object.freeze({
      eiren:Object.freeze({role:"eiren",rate:.88,pitch:1.06}),
      gentle:Object.freeze({role:"eiren",rate:.86,pitch:1.08}),
      archaemenes:Object.freeze({role:"archaemenes",rate:.86,pitch:.94})
    })
  });
  global.KhaemenesPreschoolVoice=api;
  if(supported()){
    refresh();
    global.speechSynthesis.addEventListener?.("voiceschanged",refresh);
    setTimeout(refresh,250);
  }
})(window);
