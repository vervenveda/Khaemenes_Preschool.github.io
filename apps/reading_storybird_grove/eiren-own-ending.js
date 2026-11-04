/* Storybird Grove · Eiren's Own Ending v1.
   Optional, session-only story activity. No mic permission, network access or background save.
   A separate copy enters the existing Story Nest only after explicit user action. */
(function(root){"use strict";
const MAX_ENDING=500, MAX_STORY=1800;
let original=null,signature="",saveVariant=null,speakEnding=null;
const el=id=>root.document?.getElementById(id)||null;
const status=message=>{const node=el("eirenEndingStatus");if(node)node.textContent=message;};
const clean=value=>String(value||"").replace(/\r\n?/g,"\n").trim();
function alternative(record,ending){
 if(!record||typeof record.text!=="string"||!record.meta||!record.id)return {error:"Make or open a Storybird story first."};
 const own=clean(ending);
 if(own.length<5)return {error:"Tell Eiren a little more about your ending before keeping it."};
 if(own.length>MAX_ENDING)return {error:"That ending is longer than 500 characters. Please make it a little shorter."};
 const text=clean(record.text),parts=text.split(/\n\s*\n/).filter(Boolean);
 if(!text)return {error:"Please open a complete story first."};
 let newText;
 if(record.meta.mode==="growing"){
  if(parts.length<3)return {error:"This story does not have three parts to replace. Try a different story."};
  newText=parts.slice(0,-1).join("\n\n")+"\n\n"+own;
 }else{
  newText=text+"\n\n"+own;
 }
 if(newText.length>MAX_STORY)return {error:"The new story is too long to save. Please write a shorter ending."};
 return {record:{
  id:"sbg-"+Date.now()+"-"+Math.random().toString(36).slice(2,8),
  title:(clean(record.title||"Storybird Story").slice(0,99)+" — My New Ending").slice(0,120),
  text:newText,meta:{...record.meta,selection:{...(record.meta.selection||{})}},
  ts:Date.now(),favorite:false
 }};
}
function reset(){
 const input=el("eirenEndingText"),preview=el("eirenEndingPreview");
 if(input)input.value="";
 if(preview){preview.textContent="";preview.hidden=true;}
 status(original?"Your new ending is not saved. Imagine another ending for this story!":"Make or open a story first, then invent an ending with Eiren.");
 render();
}
function setStory(record){
 const next=record?String(record.id||"")+"|"+String(record.text||""):"";
 if(signature===next)return;
 signature=next;original=record||null;
 reset();
}
function render(){
 const active=!!original,input=el("eirenEndingText"),len=el("eirenEndingCount");
 if(input)input.disabled=!active;
 if(len)len.textContent=String(input?.value?.length||0)+" / "+MAX_ENDING+" characters";
 for(const id of ["eirenEndingPreviewBtn","eirenEndingRead","eirenEndingSave","eirenEndingClear"]){
  const b=el(id);if(b)b.disabled=!active;
 }
}
function preview(){
 const input=el("eirenEndingText"),target=el("eirenEndingPreview");
 const result=alternative(original,input?.value);
 if(result.error){status(result.error);if(target){target.textContent="";target.hidden=true;}return null;}
 if(target){target.textContent=result.record.text;target.hidden=false;}
 status("This is a preview only. Your original story is unchanged.");
 return result.record;
}
function read(){
 const result=alternative(original,el("eirenEndingText")?.value);
 if(result.error){status(result.error);return;}
 if(typeof speakEnding!=="function"){status("Reading aloud is not available here. A grown-up can read your ending with you.");return;}
 speakEnding(clean(el("eirenEndingText")?.value));
 status("Eiren is reading your own ending. It is not saved.");
}
function save(){
 const result=alternative(original,el("eirenEndingText")?.value);
 if(result.error){status(result.error);return false;}
 if(typeof saveVariant!=="function"){status("Saving is unavailable. Your original story is safe.");return false;}
 const reply=saveVariant(result.record);
 if(reply?.ok){status("Your new ending was saved as a separate story in My Story Nest. The original is still there.");return true;}
 status(reply?.message||"Your new ending could not be saved. Please try again.");
 return false;
}
function init(options={}){
 saveVariant=options.saveVariant;speakEnding=options.speakEnding;
 const actions=[["eirenEndingPreviewBtn",preview],["eirenEndingRead",read],["eirenEndingSave",save],["eirenEndingClear",reset]];
 for(const [id,handler] of actions){
  const button=el(id);if(button&&!button.dataset.boundOwnEnding){button.dataset.boundOwnEnding="yes";button.addEventListener("click",handler);}
 }
 const input=el("eirenEndingText");
 if(input&&!input.dataset.boundOwnEnding){input.dataset.boundOwnEnding="yes";input.addEventListener("input",()=>{const previewEl=el("eirenEndingPreview");if(previewEl){previewEl.hidden=true;previewEl.textContent="";}render();});}
 render();
}
root.StorybirdOwnEnding=Object.freeze({alternative,setStory,init});
})(window);
