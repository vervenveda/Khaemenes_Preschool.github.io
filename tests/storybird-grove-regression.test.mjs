import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import vm from "node:vm";

const html=readFileSync(new URL("../apps/reading_storybird_grove/index.html",import.meta.url),"utf8");
const extract=(start,end)=>{
 const a=html.indexOf(start),b=html.indexOf(end,a);
 assert.ok(a>=0 && b>a,"Expected Storybird source range: "+start);
 return html.slice(a,b);
};
const mainData=extract("const CHARACTERS = [","const els = {}");
const helpers=extract("function blankSelection()","function weekTopic(week)");
const pathFunctions=extract("function weekTopic(week)","function isGrowing()");
const storageFunctions=extract("function defaultState()","function applySettings()");
const storyFunctions=extract("function pronoun()","function storyTitleFor(");
function fixture(){
 const storage=new Map();
 const code=mainData+"\n"+
 "let state={settings:{mode:'little',pronoun:'they'}},currentWeek=1,selection={},currentStory=null;\n"+
 "const localStorage={getItem:k=>storage.get(k)??null,setItem:(k,v)=>storage.set(k,v)};\n"+
 "function setStatus(){} function renderStats(){}\n"+
 helpers+"\n"+pathFunctions+"\n"+storageFunctions+"\n"+storyFunctions+"\n"+
 "({characters:CHARACTERS,settings:SETTINGS,verbs:VERBS,feelings:FEELINGS,endings:ENDINGS,topics:WEEK_TOPICS,levels:WEEK_LEVELS,moods:Object.keys(TEMPLATES),weekTopic,getWeek,littleText,growingText,sanitizeState,loadState,setMode:m=>state.settings.mode=m,setPronoun:p=>state.settings.pronoun=p,setWeek:n=>currentWeek=n})";
 const engine=vm.runInNewContext(code,{Math,Date,JSON},{timeout:2000});
 return {engine,storage};
}
const sample={character:"tiny owl spirit",setting:"the Whispering Grove",verb:"discover",feeling:"happy",ending:"made a new friend"};

test("every one of the 20 selectable Growing Story endings has its own paragraph",()=>{
 const {engine:e}=fixture();
 assert.equal(e.endings.length,20);
 const conclusions=new Set();
 for(const ending of e.endings){
  const story=e.growingText({...sample,ending},"gentle");
  const paragraphs=story.split("\n\n");
  assert.equal(paragraphs.length,3,ending);
  assert.ok(paragraphs.every(p=>p.trim().length>15),ending);
  assert.ok(!/undefined|null|\[object Object\]/i.test(story),ending);
  assert.ok(!conclusions.has(paragraphs[2]),"reused ending for "+ending);
  conclusions.add(paragraphs[2]);
 }
 assert.equal(conclusions.size,20);
});

test("all 84 Garden Paths have four complete reachable progression cycles",()=>{
 const {engine:e}=fixture();
 assert.equal(e.topics.length,21);
 assert.equal(e.levels.length,4);
 const counts={};
 for(let i=1;i<=84;i++){
  const label=e.weekTopic(i);
  counts[label.level]=(counts[label.level]||0)+1;
  assert.ok(label.name&&label.focus);
  assert.equal(e.getWeek(i,0).characters.length,12);
  assert.equal(e.getWeek(i,0).settings.length,12);
  assert.equal(e.getWeek(i,0).verbs.length,12);
 }
 assert.deepEqual(counts,{Seedling:21,Sprout:21,Bloom:21,Songbird:21});
 assert.match(html,/RESERVED_FUTURE_WEEK_LEVELS\s*=\s*\["Lantern","Starlight"\]/);
});

test("story generation across every path, mood and both modes stays bounded",()=>{
 const {engine:e}=fixture();
 assert.equal(e.moods.length,10);
 let count=0;
 for(let path=1;path<=84;path++){
  e.setWeek(path);
  const choices=e.getWeek(path,0);
  for(const mood of e.moods){
   for(const mode of ["little","growing"]){
    e.setMode(mode);
    for(let i=0;i<4;i++){
     const selection={
      character:choices.characters[i],setting:choices.settings[i],verb:choices.verbs[i],
      feeling:e.feelings[i],ending:e.endings[(path+i)%e.endings.length]
     };
     const story=mode==="little"?e.littleText(selection,mood):e.growingText(selection,mood);
     assert.ok(story.length>20&&story.length<=1800,mode+" "+mood+" "+path);
     assert.ok(!/undefined|null|\[object Object\]/i.test(story),mode+" "+mood+" "+path);
     count++;
    }
   }
  }
 }
 assert.equal(count,6720);
});

test("local Story Nest restores drafts and constrains oversized or invalid records",()=>{
 const {engine:e,storage}=fixture();
 let oversized=e.sanitizeState({
  lastWeek:900,
  nest:Array.from({length:300},(_,i)=>({title:"T"+i,text:"Story "+i,meta:{week:i+1}})),
  settings:{runs:9999,rate:900},
  visitedWeeks:[-4,300]
 });
 assert.equal(oversized.nest.length,240);
 assert.equal(oversized.lastWeek,84);
 assert.equal(oversized.settings.runs,200);
 assert.equal(oversized.settings.rate,1.2);
 assert.equal(oversized.nest[239].meta.week,84);
 const draft={nest:[{title:"My Story",text:"A child and a bird shared a story."}],lastWeek:19,settings:{mode:"growing"}};
 storage.set("storybird_grove_creche_v2",JSON.stringify(draft));
 const loaded=e.loadState();
 assert.equal(loaded.lastWeek,19);
 assert.equal(loaded.settings.mode,"growing");
 assert.equal(loaded.nest[0].text,draft.nest[0].text);
});

test("story backup format and browser-local privacy boundaries remain unchanged",()=>{
 assert.match(html,/const STORAGE_KEY\s*=\s*"storybird_grove_creche_v2"/);
 assert.match(html,/const OLD_STORAGE_KEY\s*=\s*"storybird_grove_sovereign_mc_v1"/);
 assert.match(html,/const MAX_NEST\s*=\s*240/);
 assert.match(html,/const IMPORT_LIMIT\s*=\s*3 \* 1024 \* 1024/);
 assert.match(html,/parsed\.app!=="Storybird Grove"/);
 assert.match(html,/function exportNest\(\)/);
 assert.match(html,/window\.StorybirdGrove=\{/);
});
