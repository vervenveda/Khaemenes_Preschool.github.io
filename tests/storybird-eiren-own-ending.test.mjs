import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import vm from "node:vm";

const source=readFileSync(new URL("../apps/reading_storybird_grove/eiren-own-ending.js",import.meta.url),"utf8");
const html=readFileSync(new URL("../apps/reading_storybird_grove/index.html",import.meta.url),"utf8");
const original={
 id:"sbg-original-1",title:"Owl in Whispering Grove",
 text:"A little owl found a tree.\n\nThe owl made a friend.\n\nThey shared a wonderful discovery.",
 meta:{mode:"growing",week:8,tone:"gentle",selection:{character:"tiny owl spirit",setting:"the Whispering Grove",verb:"discover",feeling:"happy",ending:"shared a wonderful discovery"}},
 ts:99,favorite:true
};
function boot(){
 const nodes=new Map();
 const getNode=id=>{
  if(!nodes.has(id))nodes.set(id,{id,hidden:false,disabled:false,children:[],textContent:"",value:"",dataset:{},events:{},addEventListener(type,handler){this.events[type]=handler;}});
  return nodes.get(id);
 };
 const w={document:{getElementById:id=>getNode(id)}};
 vm.runInNewContext(source,{window:w},{timeout:1000});
 return {api:w.StorybirdOwnEnding,node:getNode};
}
test("Growing Story creates a separate original-ending variant without mutating source",()=>{
 const {api}=boot();
 const before=JSON.stringify(original);
 const result=api.alternative(original,"Then the owl helped a new friend plant a tree.");
 assert.ok(result.record);
 assert.equal(JSON.stringify(original),before);
 assert.equal(result.record.favorite,false);
 assert.notEqual(result.record.id,original.id);
 assert.ok(result.record.title.includes("My New Ending"));
 assert.equal(result.record.meta.selection.character,original.meta.selection.character);
 assert.equal(result.record.text,"A little owl found a tree.\n\nThe owl made a friend.\n\nThen the owl helped a new friend plant a tree.");
 assert.notEqual(result.record.meta.selection,original.meta.selection);
});
test("Little Story adds the child's ending without removing the single paragraph",()=>{
 const {api}=boot();
 const little={...original,meta:{...original.meta,mode:"little"},text:"A tiny owl liked to sing."};
 const result=api.alternative(little,"Then the owl sang with the stars.");
 assert.equal(result.record.text,"A tiny owl liked to sing.\n\nThen the owl sang with the stars.");
});
test("empty, oversized and malformed stories fail closed",()=>{
 const {api}=boot();
 assert.match(api.alternative(null,"A new ending for the bird.").error,/open a Storybird story/);
 assert.match(api.alternative(original,"hi").error,/little more/);
 assert.match(api.alternative(original,"x".repeat(501)).error,/500 characters/);
 const nearLimit={...original,text:"a".repeat(1600),meta:{mode:"little"}};
 assert.match(api.alternative(nearLimit,"b".repeat(500)).error,/too long/);
 const malformed={...original,text:"Only a single paragraph.",meta:{mode:"growing"}};
 assert.match(api.alternative(malformed,"Another ending goes here.").error,/three parts/);
});
test("no save, narration, or external transfer happens until explicit action",()=>{
 const {api,node}=boot();
 let saved=0,spoken=0;
 api.init({saveVariant:()=>{saved++;return {ok:true}},speakEnding:()=>{spoken++}});
 api.setStory(original);
 assert.equal(node("eirenEndingSave").disabled,false);
 node("eirenEndingText").value="The owl made the forest a happy place.";
 node("eirenEndingText").events.input();
 assert.equal(saved,0);
 assert.equal(spoken,0);
 node("eirenEndingPreviewBtn").events.click();
 assert.equal(saved,0);
 assert.match(node("eirenEndingPreview").textContent,/happy place/);
 assert.equal(node("eirenEndingPreview").hidden,false);
 node("eirenEndingRead").events.click();
 assert.equal(saved,0);
 assert.equal(spoken,1);
 node("eirenEndingSave").events.click();
 assert.equal(saved,1);
 assert.match(node("eirenEndingStatus").textContent,/saved as a separate story/);
});
test("changing or clearing a story resets unsaved child text and preview",()=>{
 const {api,node}=boot();
 let saved=0;
 api.init({saveVariant:()=>{saved++;return {ok:true}}});
 api.setStory(original);
 node("eirenEndingText").value="My alternate ending is here.";
 node("eirenEndingPreviewBtn").events.click();
 api.setStory({...original,id:"sbg-another"});
 assert.equal(node("eirenEndingText").value,"");
 assert.equal(node("eirenEndingPreview").hidden,true);
 assert.equal(saved,0);
 api.setStory(null);
 assert.equal(node("eirenEndingText").disabled,true);
 assert.equal(node("eirenEndingSave").disabled,true);
});
test("Story Nest format and consent gate stay inside the parent application",()=>{
 assert.match(html,/function saveOwnEndingToNest\(variant,source\)/);
 assert.match(html,/source\.id!==currentStory\.id/);
 assert.match(html,/state\.nest\.unshift\(sanitizeStory\(variant\)\)/);
 assert.match(html,/saveVariant:saveOwnEndingToNest/);
 assert.match(html,/function saveCurrentStory\(\)/);
 assert.match(html,/const STORAGE_KEY = "storybird_grove_creche_v2"/);
 assert.doesNotMatch(source,/localStorage|sessionStorage|indexedDB|fetch\s*\(|XMLHttpRequest|WebSocket|SpeechRecognition/);
});
