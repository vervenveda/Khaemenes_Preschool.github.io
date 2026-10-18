/*
  Khaemenes Preschool learner-scoped storage v1.0
  Keeps open guest play unchanged while isolating activity progress for each
  intentionally created child profile. Data never leaves this browser.
*/
(function attachPreschoolLearnerStorage(global){
  "use strict";

  const VERSION="1.0.0";
  const PROFILE_KEY="khaemenes_preschool_profile_v1";
  const PREFIX="khaemenes.preschool.learner.v1::";
  const nativeGet=Storage.prototype.getItem;
  const nativeSet=Storage.prototype.setItem;
  const nativeRemove=Storage.prototype.removeItem;

  function isLocal(storage){
    try{return storage===global.localStorage}catch{return false}
  }
  function profile(){
    try{
      const raw=nativeGet.call(global.localStorage,PROFILE_KEY);
      const value=raw?JSON.parse(raw):null;
      return value&&value.learnerId?value:null;
    }catch{return null}
  }
  function learnerId(){return String(profile()?.learnerId||"").trim()}
  function isSystemKey(key){
    key=String(key);
    return key===PROFILE_KEY||key.startsWith("khaemenes_")||key.startsWith("khaemenes.")||key.startsWith("creche-preschool-")||key.startsWith("vnv-");
  }
  function scopedKey(key,id=learnerId()){
    key=String(key);
    return id&&!isSystemKey(key)?`${PREFIX}${encodeURIComponent(id)}::${key}`:key;
  }
  function removedKey(key,id=learnerId()){
    return id&&!isSystemKey(key)?`${PREFIX}${encodeURIComponent(id)}::__removed__::${String(key)}`:"";
  }
  Storage.prototype.getItem=function(key){
    if(!isLocal(this))return nativeGet.call(this,key);
    const id=learnerId();
    if(!id||isSystemKey(key))return nativeGet.call(this,key);
    const scoped=scopedKey(key,id),removed=removedKey(key,id);
    if(nativeGet.call(this,removed)!==null)return null;
    const saved=nativeGet.call(this,scoped);
    if(saved!==null)return saved;
    // Read legacy device progress once as a non-destructive migration source.
    const legacy=nativeGet.call(this,String(key));
    if(legacy!==null)nativeSet.call(this,scoped,legacy);
    return legacy;
  };
  Storage.prototype.setItem=function(key,value){
    if(!isLocal(this)||!learnerId()||isSystemKey(key))return nativeSet.call(this,key,String(value));
    nativeRemove.call(this,removedKey(key));
    return nativeSet.call(this,scopedKey(key),String(value));
  };
  Storage.prototype.removeItem=function(key){
    if(!isLocal(this)||!learnerId()||isSystemKey(key))return nativeRemove.call(this,key);
    nativeRemove.call(this,scopedKey(key));
    nativeSet.call(this,removedKey(key),"1");
  };
  global.KhaemenesPreschoolLearnerStorage=Object.freeze({
    version:VERSION,
    activeLearnerId:learnerId,
    activeProfile:profile,
    scopedKey,
    mode:()=>learnerId()?"learner":"guest"
  });
})(window);
