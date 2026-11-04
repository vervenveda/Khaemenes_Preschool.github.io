import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import vm from "node:vm";

const code=readFileSync(new URL("../apps/reading_storybird_grove/eiren-story-questions.js",import.meta.url),"utf8");
const html=readFileSync(new URL("../apps/reading_storybird_grove/index.html",import.meta.url),"utf8");
const example={
 id:"test-story-1",
 text:"A small owl visited a garden.\n\nThe owl felt brave and helped a friend.\n\nEveryone smiled at the end.",
 meta:{mode:"growing",selection:{character:"tiny owl spirit",setting:"the Whispering Grove",verb:"help",feeling:"brave",ending:"helped someone nearby"}}
};
function boot({withDOM=false}={}){
 const nodes=new Map();
 const node=id=>{
  if(!nodes.has(id))nodes.set(id,{id,textContent:"",hidden:false,disabled:false,dataset:{},listeners:{},
   addEventListener(type,fn){this.listeners[type]=fn;}});
  return nodes.get(id);
 };
 const root=withDOM?{document:{getElementById:id=>node(id)}}:{};
 const context={window:root};
 vm.runInNewContext(code,context,{timeout:1000});
 return {api:root.StorybirdEirenQuestions,node};
}
test("Eiren creates story-grounded who, where, feeling and order prompts",()=>{
 const {api}=boot();
 const q=api.questions(example);
 assert.deepEqual(Array.from(q,x=>x.kind),["Who","Where","First","Feeling","Next","End"]);
 assert.match(q[0].answer,/tiny owl spirit/);
 assert.match(q[1].answer,/Whispering Grove/);
 assert.equal(q[2].answer,"A small owl visited a garden.");
 assert.match(q[3].answer,/brave/);
 assert.match(q[4].answer,/helped a friend/);
 assert.match(q[5].answer,/Everyone smiled/);
});
test("Little Story receives grounded prompts without a fabricated feeling or ending",()=>{
 const {api}=boot();
 const little={...example,text:"A little bird sang in a meadow.",meta:{...example.meta,mode:"little",selection:{...example.meta.selection,feeling:null,ending:null}}};
 const q=api.questions(little);
 assert.deepEqual(Array.from(q,x=>x.kind),["Who","Where","First","Action"]);
 assert.equal(q.some(x=>x.kind==="Feeling"||x.kind==="End"),false);
});
test("No story, invalid selection or missing text does not create questions",()=>{
 const {api}=boot();
 assert.equal(api.questions(null).length,0);
 assert.equal(api.questions({text:"A story",meta:{selection:{}}}).length,0);
 assert.equal(api.questions({text:"",meta:example.meta}).length,0);
});
test("UI starts, reveals source-grounded answer and resets on new or cleared story",()=>{
 const {api,node}=boot({withDOM:true});
 api.init();
 api.setStory(example);
 assert.equal(node("eirenQuestionNext").disabled,false);
 node("eirenQuestionStart").listeners.click();
 assert.match(node("eirenQuestionPrompt").textContent,/Who is the main story friend/);
 node("eirenQuestionHint").listeners.click();
 assert.match(node("eirenQuestionStatus").textContent,/character/);
 node("eirenQuestionReveal").listeners.click();
 assert.match(node("eirenQuestionAnswer").textContent,/tiny owl spirit/);
 assert.equal(node("eirenQuestionAnswer").hidden,false);
 node("eirenQuestionNext").listeners.click();
 assert.match(node("eirenQuestionPrompt").textContent,/Where does the story happen/);
 assert.equal(node("eirenQuestionAnswer").hidden,true);
 api.setStory({...example,id:"different"});
 assert.match(node("eirenQuestionPrompt").textContent,/ask Eiren/i);
 api.setStory(null);
 assert.equal(node("eirenQuestionNext").disabled,true);
 assert.equal(node("eirenQuestionAnswer").textContent,"");
});
test("No student answer capture, persistence, third-party dependencies or mutation of Nest",()=>{
 assert.doesNotMatch(code,/localStorage|sessionStorage|indexedDB|fetch\s*\(|XMLHttpRequest|WebSocket/);
 assert.match(html,/src="\.\/eiren-story-questions\.js"/);
 assert.match(html,/window\.StorybirdEirenQuestions\?\.setStory\(record\)/);
 assert.match(html,/window\.StorybirdEirenQuestions\?\.setStory\(null\)/);
 assert.match(html,/const STORAGE_KEY = "storybird_grove_creche_v2"/);
 assert.match(html,/const MAX_NEST = 240/);
});
