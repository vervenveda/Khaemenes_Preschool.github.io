"use strict";

const $=id=>document.getElementById(id);
const $$=selector=>[...document.querySelectorAll(selector)];
const C=window.KhaemenesPreschoolCatalog||null;

const PROGRESS_KEY="khaemenes_preschool_child_mentor_progress_v3";
const VOICE_KEY="khaemenes_preschool_child_mentor_voice_v2";
const LEGACY_PROFILE_KEY="khaemenes_preschool_profile_v1";

const ARCHAEMENES_FALLBACK=Object.freeze({
  id:"archaemenes",
  name:"Archaemenes",
  title:"Scholar Owl",
  avatar:"🦉",
  colors:["#48baf0","#6bd8e7"],
  intro:"I am Archaemenes the Owl. Let’s look closely, wonder together, and choose one good next step.",
  presentationMode:"preschool-fallback",
  assignedBy:"NAIB"
});

const VOICE_FRIENDS=Object.freeze({
  sunny:Object.freeze({name:"Bright",rate:.84,pitch:1.06,preferred:/samantha|aria|jenny|ava|karen|victoria|allison|susan|zira|google us english|natural|enhanced|premium/i,greeting:"Hello, learning friend. Archaemenes is ready for a bright little adventure."}),
  bunny:Object.freeze({name:"Playful",rate:.86,pitch:1.10,preferred:/samantha|aria|jenny|ava|karen|victoria|allison|susan|zira|google us english|natural|enhanced|premium/i,greeting:"Hello, learning friend. Archaemenes is ready for a playful learning adventure."}),
  rainbow:Object.freeze({name:"Warm",rate:.85,pitch:1.07,preferred:/natural|enhanced|premium|samantha|aria|jenny|ava|victoria|allison|susan|google us english/i,greeting:"Hello, learning friend. Archaemenes is ready for a warm and colorful learning adventure."}),
  owl:Object.freeze({name:"Story",rate:.78,pitch:1.01,preferred:/samantha|serena|moira|aria|ava|karen|allison|susan|natural|enhanced|premium/i,greeting:"Hello, careful listener. Archaemenes is ready for a gentle storytime adventure."})
});
const VOICE_SPEEDS=Object.freeze({slow:.91,normal:1,lively:1.07});
const AVOID_VOICE=/alex|daniel|fred|ralph|bruce|tom\b|thomas|albert|junior|jorge|diego|aaron|gordon|lee\b|reed\b/i;
const FRIENDLY_VOICE=/samantha|aria|jenny|ava|karen|victoria|allison|susan|zira|serena|moira|google us english|natural|enhanced|premium/i;

const GARDEN_DOMAINS=Object.freeze([
  {id:"letters",label:"Letters & Stories",icon:"🔤",colors:["#ff7d74","#f27db8"],aliases:["letters","literacy","stories","language","words"]},
  {id:"numbers",label:"Numbers",icon:"🔢",colors:["#48baf0","#6bd8e7"],aliases:["numbers","math","counting","reasoning","shapes"]},
  {id:"creative",label:"Art & Music",icon:"🎨",colors:["#7c65d7","#f27db8"],aliases:["creative","art","music","imagination"]},
  {id:"movement",label:"Move & Life Skills",icon:"🦘",colors:["#5ac996","#9edb5c"],aliases:["movement","physical","life","health"]},
  {id:"wonder",label:"Weather & Wonder",icon:"🔭",colors:["#f6bf3a","#ff942b"],aliases:["wonder","science","nature","weather","space"]}
]);
const BREAKS=Object.freeze([
  "Stretch your arms up like a tall tree. Wiggle your fingers like leaves.",
  "Find three blue things in the room, then come back.",
  "March slowly in place while you count to ten.",
  "Take three gentle breaths and pretend you are smelling a flower.",
  "Look out a window. What is one thing moving and one thing staying still?",
  "Touch your toes, reach for the sky, then shake out your hands.",
  "Get a sip of water and notice whether it feels cold, cool, or warm.",
  "Walk like your favorite animal for thirty seconds."
]);

let registry=null;
let learner=null;
let legacy=null;
let mentor=ARCHAEMENES_FALLBACK;
let mentorAssignment=null;
let currentFeeling="okay";
let currentPlan=[];
let activeApp=null;
let progress={completed:{},stars:0};
let voices=[];
let selectedVoice=null;
let voiceFriend="sunny";
let voiceSpeed="normal";
let restoreFocus=null;

function cleanText(value,max=120){
  return String(value??"").replace(/[\u0000-\u001F\u007F]/g,"").trim().slice(0,max);
}
function loadJSON(key,fallback=null){
  try{const raw=localStorage.getItem(key);return raw?JSON.parse(raw):fallback}catch{return fallback}
}
function saveJSON(key,value){
  try{localStorage.setItem(key,JSON.stringify(value));return true}catch{return false}
}
function getRegistry(){registry=window.KhaemenesFamilyRegistry||null;return registry}
function getActiveLearner(){return getRegistry()?.getLearner?.()||null}
function getLegacyProfile(learnerId){const profile=loadJSON(LEGACY_PROFILE_KEY,null);return profile?.learnerId===learnerId?profile:null}
function preschoolStage(value){return !value||cleanText(value,40).toLowerCase()==="preschool"}
function currentAgeBand(){return cleanText(learner?.ageBand||legacy?.ageBand||"4-5",30)}
function currentInterests(){const value=learner?.interests?.length?learner.interests:(legacy?.interests||[]);return Array.isArray(value)?value.slice(0,12).map(v=>cleanText(v,60)).filter(Boolean):[]}
function sessionMinutes(){const raw=Number(legacy?.minutes||30);return [20,30,45].includes(raw)?raw:30}
function stationCount(){const minutes=sessionMinutes();return minutes<=20?3:minutes>=45?5:4}

function mentorDisplay(){
  const naib=window.KhaemenesNAIB||null;
  mentorAssignment=naib?.assignMentor?.({
    stage:learner?.stage||legacy?.pathway||"preschool",
    ageBand:currentAgeBand(),
    interests:currentInterests(),
    surface:"khaemenes-preschool-mentor",
    intent:"learning-mentor"
  })||null;
  if(mentorAssignment?.status==="assigned"&&mentorAssignment.mentor){
    try{window.dispatchEvent(new CustomEvent("khaemenes-mentor-assigned",{detail:{assignedBy:"NAIB",mentorId:mentorAssignment.mentorId,specialist:mentorAssignment.specialist,stage:mentorAssignment.stage,presentationMode:mentorAssignment.mentor.presentationMode}}))}catch{}
    return mentorAssignment.mentor;
  }
  return ARCHAEMENES_FALLBACK;
}
function catalogActivities(){
  if(!C)return [];
  return typeof C.mentorActivities==="function"?C.mentorActivities():(C.activities||[]).filter(activity=>activity.mentor?.eligible);
}
function safeActivityPath(file){
  const raw=cleanText(file,500).replace(/\\/g,"/");
  if(!raw||raw.startsWith("/")||raw.includes("..")||raw.includes("?")||raw.includes("#")||/^[a-z][a-z0-9+.-]*:/i.test(raw))return "";
  const parts=raw.split("/").filter(Boolean);
  if(!parts.length||parts.some(part=>part==="."||part===".."))return "";
  return parts.map(encodeURIComponent).join("/");
}
function appUrl(activity){const safe=safeActivityPath(activity?.file);return safe?`../apps/${safe}`:""}

function updateAnchorOffset(){const header=document.querySelector(".header");const offset=Math.ceil(header?.getBoundingClientRect().height||0)+22;document.documentElement.style.setProperty("--anchor-offset",`${offset}px`);return offset}
function cleanTarget(hash){if(!hash||hash==="#")return null;let target=null;try{target=document.querySelector(hash)}catch{return null}return target?.closest("section[id]")||target}
function goTo(hash,{history=true,behavior="smooth"}={}){const target=cleanTarget(hash);if(!target)return false;const offset=updateAnchorOffset();const top=Math.max(0,target.getBoundingClientRect().top+window.scrollY-offset);window.scrollTo({top,behavior:matchMedia("(prefers-reduced-motion: reduce)").matches?"auto":behavior});if(history){try{window.history.pushState(null,"",hash)}catch{}}return true}

function openMenu(){$("menuPanel").hidden=false;$("menuButton").setAttribute("aria-expanded","true");document.body.classList.add("menu-open")}
function closeMenu(){$("menuPanel").hidden=true;$("menuButton").setAttribute("aria-expanded","false");document.body.classList.remove("menu-open")}
function toggleMenu(){$("menuPanel").hidden?openMenu():closeMenu()}

function loadProgress(){const map=loadJSON(PROGRESS_KEY,{});const state=map?.[learner.learnerId]||{};progress={completed:state.completed&&typeof state.completed==="object"?state.completed:{},stars:Number(state.stars||0)}}
function saveProgress(){const map=loadJSON(PROGRESS_KEY,{})||{};map[learner.learnerId]={...progress,updatedAt:new Date().toISOString()};saveJSON(PROGRESS_KEY,map)}

function eligibleActivities(){const age=currentAgeBand();return catalogActivities().filter(activity=>{const ages=activity.mentor?.ages||[];if(ages.length&&!ages.includes(age))return false;const energy=cleanText(activity.mentor?.energy||"steady",30).toLowerCase();if(["tired","frustrated"].includes(currentFeeling)&&energy==="wiggly")return false;return Boolean(appUrl(activity))})}
function seededNumber(text){let h=2166136261;for(const ch of String(text)){h^=ch.charCodeAt(0);h=Math.imul(h,16777619)}h+=h<<13;h^=h>>>7;h+=h<<3;h^=h>>>17;h+=h<<5;return(h>>>0)/4294967295}
function activityScore(activity){let score=seededNumber(`${learner.learnerId}:${new Date().toDateString()}:${currentFeeling}:${activity.id}`)*1.5;for(const interest of currentInterests()){if((activity.mentor?.interests||[]).includes(interest))score+=2.2}const energy=cleanText(activity.mentor?.energy||"steady",30).toLowerCase();if(currentFeeling==="wiggly"&&energy==="wiggly")score+=3;if(["tired","frustrated"].includes(currentFeeling)&&energy==="gentle")score+=3;if(progress.completed[activity.id])score-=1.3;return score}
function buildPath(){const count=stationCount();const pool=[...eligibleActivities()].sort((a,b)=>activityScore(b)-activityScore(a));const picked=[];const domains=new Set();for(const activity of pool){const domain=activity.mentor?.domain||activity.category||"wonder";if(!domains.has(domain)){picked.push(activity);domains.add(domain)}if(picked.length>=count)break}for(const activity of pool){if(picked.length>=count)break;if(!picked.some(item=>item.id===activity.id))picked.push(activity)}currentPlan=picked;renderPlan()}

function makePlanCard(activity,index){
  const card=document.createElement("article");card.className="plan-card";
  const icon=document.createElement("span");icon.className="icon";icon.textContent=cleanText(activity.icon||"✨",8);
  const title=document.createElement("h3");title.textContent=cleanText(activity.title||"Learning Adventure",140);
  const meta=document.createElement("div");meta.className="meta";
  for(const value of [`Step ${index+1}`,`${cleanText(activity.mentor?.minutes||"?",12)} min`,cleanText(activity.mentor?.domain||activity.category||"learning",80)]){const tag=document.createElement("span");tag.textContent=value;meta.append(tag)}
  const desc=document.createElement("p");desc.textContent=cleanText(activity.mentor?.desc||activity.desc||"A little Crechè learning adventure.",400);
  const button=document.createElement("button");button.className="play-btn";button.type="button";button.dataset.openApp=cleanText(activity.id,120);button.textContent=progress.completed[activity.id]?"Play Again ↻":"Play This →";
  card.append(icon,title,meta,desc,button);return card;
}
function renderPlan(){const grid=$("planGrid");grid.replaceChildren();if(!currentPlan.length){const card=document.createElement("article");card.className="plan-card";const h=document.createElement("h3");h.textContent="Let’s try another path.";const p=document.createElement("p");p.textContent="No Mentor-ready activities matched this learning stage yet.";card.append(h,p);grid.append(card);return}currentPlan.forEach((activity,index)=>grid.append(makePlanCard(activity,index)));$("pathIntro").textContent=`${mentor.name} chose ${currentPlan.length} little adventures for ${learner.nickname||"you"} from the public Crechè learning garden.`;renderProgress()}
function matchesDomain(activity,domain){const hay=[activity.mentor?.domain,activity.category,activity.tags,...(activity.mentor?.interests||[])].filter(Boolean).join(" ").toLowerCase();return domain.aliases.some(alias=>hay.includes(alias))}
function renderGarden(){const garden=$("garden");garden.replaceChildren();const pool=eligibleActivities();for(const domain of GARDEN_DOMAINS){const candidates=pool.filter(activity=>matchesDomain(activity,domain)).sort((a,b)=>activityScore(b)-activityScore(a));const sample=candidates[0]||null;const card=document.createElement("article");card.className="garden-card";card.style.background=`linear-gradient(145deg,${domain.colors[0]},${domain.colors[1]})`;const icon=document.createElement("span");icon.textContent=domain.icon;const h=document.createElement("h3");h.textContent=domain.label;card.append(icon,h);if(sample){const button=document.createElement("button");button.type="button";button.dataset.openApp=cleanText(sample.id,120);button.textContent="Try One →";card.append(button)}garden.append(card)}}
function renderProgress(){const completed=Object.keys(progress.completed).length;const total=Math.max(1,catalogActivities().length);const percent=Math.min(100,Math.round((completed/total)*100));$("starCount").textContent=`${progress.stars} star${progress.stars===1?"":"s"} ⭐`;$("progressFill").style.width=`${percent}%`;$("progressText").textContent=completed?`${completed} Mentor adventures explored`:"Let’s begin!"}

function renderMentor(){mentor=mentorDisplay();document.documentElement.style.setProperty("--ma",mentor.colors[0]);document.documentElement.style.setProperty("--mb",mentor.colors[1]);$("mentorAvatar").textContent=mentor.avatar;$("mentorName").textContent=mentor.name;$("mentorLabel").textContent=`${learner.nickname||"Your"}’s learning Mentor · assigned by NAIB`;$("brandName").textContent=`${learner.nickname||"My"}’s Mentor`;const title=$("childTitle");const span=document.createElement("span");span.textContent="Ready to learn and play?";title.replaceChildren(document.createTextNode(`Hello, ${cleanText(learner.nickname||"friend",60)}!`),span);$("childIntro").textContent=`${mentor.name} can help you choose one little next step, a game, a story, or a real-world break.`;$("mentorSpeech").textContent=`${mentor.name}: ${mentor.intro} What would you like to try first?`}
function mentorResponse(action){const child=cleanText(learner.nickname||"friend",60);const lines={hint:`${mentor.name}: ${child}, let’s make it smaller. Look at just one part. What is the first thing you notice?`,play:`${mentor.name}: Yes! I’ll pick a learning game that matches how you feel today.`,stuck:`${mentor.name}: Being stuck is okay. We can try one tiny step, or ask a nearby grown-up to look with us.`,break:`${mentor.name}: Great noticing. Let’s take a real-world break. Stretch, breathe, get some water, and come back when your body feels ready.`};$("mentorSpeech").textContent=lines[action]||lines.hint;if(action==="play")openRandomGame();if(action==="break")newBreakIdea()}
function setFeeling(feeling){if(!["happy","okay","wiggly","tired","frustrated"].includes(feeling))return;currentFeeling=feeling;$$('[data-feeling]').forEach(button=>button.setAttribute("aria-pressed",String(button.dataset.feeling===feeling)));const messages={happy:`${mentor.name}: Happy energy! Let’s use some of it for a bright learning adventure.`,okay:`${mentor.name}: That sounds just right. We can take one comfortable step at a time.`,wiggly:`${mentor.name}: Wiggly bodies can learn too! I’ll look for movement and hands-on play.`,tired:`${mentor.name}: We can keep today gentle and short. No rushing.`,frustrated:`${mentor.name}: Thank you for telling me. We’ll slow down, choose something gentle, and make the next step very small.`};$("mentorSpeech").textContent=messages[feeling];buildPath();renderGarden()}

function openRandomGame(){const pool=eligibleActivities();if(pool.length)openApp(pool[Math.floor(Math.random()*pool.length)])}
function openApp(activity){if(!activity)return;const url=appUrl(activity);if(!url){$("mentorSpeech").textContent=`${mentor.name}: I could not safely open that activity. Let’s choose another one.`;return}activeApp=activity;restoreFocus=document.activeElement;$("appTitle").textContent=cleanText(activity.title||"Crechè Adventure",160);$("appFrame").src=url;$("appModal").hidden=false;$("appModal").setAttribute("aria-hidden","false");document.body.classList.add("app-open");setTimeout(()=>$("appClose").focus(),30)}
function closeApp(){$("appModal").hidden=true;$("appModal").setAttribute("aria-hidden","true");$("appFrame").src="about:blank";$("appWin").classList.remove("max");$("appMax").textContent="□";$("appMax").setAttribute("aria-label","Maximize app window");document.body.classList.remove("app-open");activeApp=null;restoreFocus?.focus?.()}
function markAppDone(){if(!activeApp)return;if(!progress.completed[activeApp.id]){progress.completed[activeApp.id]={completedAt:new Date().toISOString(),title:cleanText(activeApp.title,160)};progress.stars+=1;saveProgress()}$("mentorSpeech").textContent=`${mentor.name}: You did it, ${cleanText(learner.nickname||"friend",60)}! I noticed your effort. You earned a learning star! ⭐`;renderPlan();renderProgress();closeApp()}
function newBreakIdea(){$("breakIdea").textContent=BREAKS[Math.floor(Math.random()*BREAKS.length)]}

function loadVoiceSettings(){const all=loadJSON(VOICE_KEY,{})||{};const state=all[learner.learnerId]||{};voiceFriend=VOICE_FRIENDS[state.friend]?state.friend:"sunny";voiceSpeed=VOICE_SPEEDS[state.speed]?state.speed:"normal"}
function saveVoiceSettings(){const all=loadJSON(VOICE_KEY,{})||{};all[learner.learnerId]={friend:voiceFriend,speed:voiceSpeed,updatedAt:new Date().toISOString()};saveJSON(VOICE_KEY,all)}
function scoreVoice(voice,guide){const name=String(voice?.name||"");const lang=String(voice?.lang||"");if(!/^en([-_]|$)/i.test(lang))return-1000;if(AVOID_VOICE.test(name))return-500;let score=0;if(guide.preferred.test(name))score+=90;if(FRIENDLY_VOICE.test(name))score+=65;if(/natural|enhanced|premium/i.test(name))score+=30;if(/^en-US/i.test(lang))score+=14;if(voice.localService)score+=4;return score}
function refreshVoices(){if(!("speechSynthesis" in window))return;voices=speechSynthesis.getVoices()||[];chooseVoice()}
function chooseVoice(){const guide=VOICE_FRIENDS[voiceFriend]||VOICE_FRIENDS.sunny;const ranked=voices.map(voice=>({voice,score:scoreVoice(voice,guide)})).filter(item=>item.score>0).sort((a,b)=>b.score-a.score);selectedVoice=ranked[0]?.voice||null;if(selectedVoice){$("voiceStatus").textContent=`${guide.name} is ready with a gentle device voice.`}else if(voices.length){$("voiceStatus").textContent="This device is not exposing a suitable gentle English voice, so Mentor read-aloud is staying off."}else{$("voiceStatus").textContent="Loading the device’s friendly story voices…"}}
function speak(text,{preview=false}={}){if(!("speechSynthesis" in window)){$("voiceStatus").textContent="Read-aloud is not available in this browser.";return}refreshVoices();const guide=VOICE_FRIENDS[voiceFriend]||VOICE_FRIENDS.sunny;if(!selectedVoice){$("voiceStatus").textContent="No suitable gentle voice is available on this device. The Mentor will not use an arbitrary default voice.";return}const phrase=preview?guide.greeting:cleanText(text,1000);if(!phrase)return;speechSynthesis.cancel();const utterance=new SpeechSynthesisUtterance(phrase);utterance.lang=selectedVoice.lang||"en-US";utterance.voice=selectedVoice;utterance.rate=Math.max(.70,Math.min(1.12,guide.rate*(VOICE_SPEEDS[voiceSpeed]||1)));utterance.pitch=guide.pitch;utterance.volume=.90;utterance.onstart=()=>{$("voiceStatus").textContent=`${guide.name} is talking…`};utterance.onend=()=>{$("voiceStatus").textContent=`${guide.name} is ready.`};utterance.onerror=()=>{$("voiceStatus").textContent="The friendly voice could not start. Try again or choose another voice style."};speechSynthesis.speak(utterance)}
function updateVoiceButtons(){$$('[data-voice-friend]').forEach(button=>button.setAttribute("aria-pressed",String(button.dataset.voiceFriend===voiceFriend)));$("voiceSpeed").value=voiceSpeed;chooseVoice()}

function showLocked(reason="no-learner"){$("kidApp").hidden=true;$("lockedState").hidden=false;if(reason==="wrong-stage"){$("lockedTitle").textContent="This Mentor Is for Crechè";$("lockedMessage").textContent="The active learner belongs to another Khaemenes school level. Return to Crechè and choose a Preschool learner’s bright Mentor button."}else if(reason==="registry-unavailable"){$("lockedTitle").textContent="Family Profile Connection Needed";$("lockedMessage").textContent="The Khaemenes Family Registry could not load. Public Crechè games are still available from the home page."}else{$("lockedTitle").textContent="Choose Your Mentor Button";$("lockedMessage").textContent="A grown-up can create or open the family account, then choose the bright button with your name on the Crechè home page."}}
function initializeLearner(){if(!C){showLocked("registry-unavailable");return false}const r=getRegistry();if(!r){showLocked("registry-unavailable");return false}learner=getActiveLearner();if(!learner?.learnerId){showLocked("no-learner");return false}legacy=getLegacyProfile(learner.learnerId);if(!preschoolStage(learner.stage||legacy?.pathway)){showLocked("wrong-stage");return false}loadProgress();loadVoiceSettings();$("lockedState").hidden=true;$("kidApp").hidden=false;renderMentor();renderGarden();buildPath();renderProgress();updateVoiceButtons();newBreakIdea();updateAnchorOffset();return true}

$("menuButton").addEventListener("click",event=>{event.stopPropagation();toggleMenu()});
document.addEventListener("click",event=>{
  if(!$("menuPanel").hidden&&!event.target.closest(".menu-wrap"))closeMenu();
  const samePage=event.target.closest('a[href^="#"]');if(samePage){const hash=samePage.getAttribute("href");if(hash&&hash!=="#"){event.preventDefault();closeMenu();goTo(hash);return}}
  const appButton=event.target.closest("[data-open-app]");if(appButton){const id=cleanText(appButton.dataset.openApp,120);const activity=C?.byId?.(id)||(C?.activities||[]).find(item=>item.id===id);if(activity)openApp(activity);return}
  const mentorButton=event.target.closest("[data-mentor-action]");if(mentorButton){mentorResponse(mentorButton.dataset.mentorAction);return}
  const feelButton=event.target.closest("[data-feeling]");if(feelButton){setFeeling(feelButton.dataset.feeling);return}
  const voiceButton=event.target.closest("[data-voice-friend]");if(voiceButton&&VOICE_FRIENDS[voiceButton.dataset.voiceFriend]){voiceFriend=voiceButton.dataset.voiceFriend;saveVoiceSettings();updateVoiceButtons();speak("",{preview:true})}
});
document.addEventListener("keydown",event=>{if(event.key!=="Escape")return;if(!$("appModal").hidden){closeApp();return}if(!$("menuPanel").hidden){closeMenu();$("menuButton").focus()}});
window.addEventListener("resize",updateAnchorOffset,{passive:true});
window.addEventListener("orientationchange",()=>setTimeout(updateAnchorOffset,120),{passive:true});
$("newPath").addEventListener("click",()=>{buildPath();$("mentorSpeech").textContent=`${mentor.name}: I made a fresh learning path for you.`});
$("surpriseGame").addEventListener("click",openRandomGame);
$("hearHello").addEventListener("click",()=>speak($("mentorSpeech").textContent));
$("newBreak").addEventListener("click",newBreakIdea);
$("previewVoice").addEventListener("click",()=>speak("",{preview:true}));
$("stopVoice").addEventListener("click",()=>{if("speechSynthesis" in window)speechSynthesis.cancel();$("voiceStatus").textContent="Voice stopped."});
$("voiceSpeed").addEventListener("change",()=>{voiceSpeed=$("voiceSpeed").value;saveVoiceSettings();$("voiceStatus").textContent="Reading speed saved."});
$("appClose").addEventListener("click",closeApp);$("appDone").addEventListener("click",markAppDone);
$("appMax").addEventListener("click",()=>{const max=$("appWin").classList.toggle("max");$("appMax").textContent=max?"❐":"□";$("appMax").setAttribute("aria-label",max?"Restore app window":"Maximize app window")});
$("appModal").addEventListener("click",event=>{if(event.target===$("appModal"))closeApp()});
if("speechSynthesis" in window){refreshVoices();if(typeof speechSynthesis.addEventListener==="function")speechSynthesis.addEventListener("voiceschanged",refreshVoices);else speechSynthesis.onvoiceschanged=refreshVoices}
window.addEventListener("khaemenes-family-ready",initializeLearner);
window.addEventListener("khaemenes-family-changed",initializeLearner);
window.addEventListener("khaemenes-naib-ready",()=>{if(learner)renderMentor()});
window.addEventListener("storage",event=>{if(["khaemenes_family_registry_v1","khaemenes_active_family_v1","khaemenes_active_learner_v1",LEGACY_PROFILE_KEY].includes(event.key))initializeLearner()});
window.addEventListener("load",()=>{updateAnchorOffset();if(location.hash)requestAnimationFrame(()=>requestAnimationFrame(()=>goTo(location.hash,{history:false,behavior:"auto"})))});
initializeLearner();
