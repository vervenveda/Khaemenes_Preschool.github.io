/* Storybird Grove · Eiren's gentle story questions.
   Only the current public-facing story is read; no tracking, account writes or cloud access. */
(function(root){"use strict";
const safe=s=>String(s||"").trim().slice(0,1800);
function questions(record){
 const sel=record?.meta?.selection||{},text=safe(record?.text),parts=text.split(/\n\s*\n/).filter(Boolean);
 if(!text||!sel.character||!sel.setting||!sel.verb)return [];
 const subject=safe(sel.character).slice(0,90),place=safe(sel.setting).slice(0,90),action=safe(sel.verb).slice(0,90);
 const out=[
  {kind:"Who",ask:"Who is the main story friend?",hint:"Look at the character you chose.",answer:"Our story friend is the "+subject+"."},
  {kind:"Where",ask:"Where does the story happen?",hint:"Look for the place in the story.",answer:"The story happens in "+place+"."},
  {kind:"First",ask:"What happened at the beginning?",hint:"Listen to the first part of the story.",answer:parts[0]||text}
 ];
 if(record?.meta?.mode==="growing"&&sel.feeling){
  out.push({kind:"Feeling",ask:"How did the story friend feel?",hint:"Remember the feeling card you chose.",answer:"The feeling you chose was "+safe(sel.feeling).slice(0,40)+"."});
 }
 if(parts.length>=3){
  out.push({kind:"Next",ask:"What happened next?",hint:"Listen to the middle part of your story.",answer:parts[1]});
  out.push({kind:"End",ask:"How did the story end?",hint:"Listen to the last part of the story.",answer:parts.at(-1)});
 }else{
  out.push({kind:"Action",ask:"What did the story friend try to do?",hint:"Look at the action card.",answer:"The action you chose was "+action+"."});
 }
 return out;
}
let active=[],index=-1,recordId="";
function by(id){return root.document?.getElementById(id)||null;}
function announce(message){const el=by("eirenQuestionStatus");if(el)el.textContent=message;}
function render(){
 const q=active[index];const prompt=by("eirenQuestionPrompt"),reveal=by("eirenQuestionAnswer");
 if(prompt)prompt.textContent=q?("Question "+(index+1)+" of "+active.length+": "+q.ask):"Make or open a story, then ask Eiren for a story question.";
 if(reveal){reveal.textContent="";reveal.hidden=true;}
 const next=by("eirenQuestionNext"),hint=by("eirenQuestionHint"),show=by("eirenQuestionReveal"),speak=by("eirenQuestionSpeak");
 if(next)next.disabled=!active.length;
 for(const btn of [hint,show,speak])if(btn)btn.disabled=!q;
}
function setStory(record){
 const signature=record?String(record.id||"")+"|"+safe(record.text):"";
 if(signature===recordId)return;
 recordId=signature;active=questions(record);index=-1;
 render();
 announce(active.length?"Eiren has "+active.length+" gentle questions ready for this story.":"Grow a story first, then Eiren can ask questions.");
}
function next(){
 if(!active.length){announce("Grow a story first, then Eiren can ask questions.");return;}
 index=(index+1)%active.length;render();announce("Tell the answer out loud, or ask a grown-up to listen. There are no scores.");
}
function reveal(){
 const q=active[index];if(!q)return;
 const el=by("eirenQuestionAnswer");if(el){el.textContent=q.answer;el.hidden=false;}
 announce("That is one way to remember the story. You can tell it in your own words, too.");
}
function hint(){const q=active[index];if(q)announce(q.hint);}
function speak(){
 const q=active[index];if(!q)return;
 if(!("speechSynthesis" in root)||typeof root.SpeechSynthesisUtterance!=="function"){announce("Reading the question aloud is not available on this device.");return;}
 try{root.speechSynthesis.cancel();const utterance=new root.SpeechSynthesisUtterance(q.ask);utterance.lang="en-US";utterance.rate=.85;root.speechSynthesis.speak(utterance);}
 catch{announce("Please read the question together; this device could not start narration.");}
}
function init(){
 const buttons=[["eirenQuestionStart",next],["eirenQuestionNext",next],["eirenQuestionHint",hint],["eirenQuestionReveal",reveal],["eirenQuestionSpeak",speak]];
 for(const [id,fn] of buttons){const el=by(id);if(el&&!el.dataset.boundEiren){el.dataset.boundEiren="yes";el.addEventListener("click",fn);}}
 render();
}
root.StorybirdEirenQuestions=Object.freeze({questions,setStory,init});
})(window);
