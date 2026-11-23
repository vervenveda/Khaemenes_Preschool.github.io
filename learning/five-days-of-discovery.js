/* Five Days of Discovery · weekly lessons from canonical 42-week spine.
   No grades, diagnostics, learner identity, or personal data collection. */
(()=>{
"use strict";
const spine=window.KhaemenesPreschoolSpine;
const catalog=window.KhaemenesPreschoolCatalog;
const $=id=>document.getElementById(id);
const KEY="khaemenes.preschool.week";

/* The canonical translator intentionally skips SELECT/OPTION.
   Localize native options and engine-generated status explicitly. */
const WEEK_UI=Object.freeze({
 en:{week:"Week",of:"of",ready:"Week {n} is ready. Choose a day to explore."},
 es:{week:"Semana",of:"de",ready:"La semana {n} está lista. Elige un día para explorar."},
 fr:{week:"Semaine",of:"sur",ready:"La semaine {n} est prête. Choisis un jour à explorer."},
 ar:{week:"الأسبوع",of:"من",ready:"الأسبوع {n} جاهز. اختر يومًا للاستكشاف."},
 zh:{week:"第",suffix:"周",of:"共",count:n=>"第 "+n+" 周，共 42 周",ready:"第 {n} 周已准备好。请选择一天开始探索。"},
 de:{week:"Woche",of:"von",ready:"Woche {n} ist bereit. Wähle einen Tag zum Entdecken."},
 ru:{week:"Неделя",of:"из",ready:"Неделя {n} готова. Выбери день для открытий."},
 pt:{week:"Semana",of:"de",ready:"A semana {n} está pronta. Escolha um dia para explorar."},
 hi:{week:"सप्ताह",of:"में से",ready:"सप्ताह {n} तैयार है। खोजने के लिए एक दिन चुनें।"},
 ja:{week:"第",suffix:"週",of:"全",count:n=>"第 "+n+" 週（全42週）",ready:"第 {n} 週の準備ができました。探検する日を選びましょう。"},
 ko:{week:"주",of:"전체",count:n=>"전체 42주 중 "+n+"주",ready:"{n}주차가 준비됐어요. 탐험할 요일을 선택하세요."},
 it:{week:"Settimana",of:"di",ready:"La settimana {n} è pronta. Scegli un giorno da esplorare."},
 bn:{week:"সপ্তাহ",of:"এর মধ্যে",count:n=>"৪২ সপ্তাহের মধ্যে "+n+"তম সপ্তাহ",ready:"{n}তম সপ্তাহ প্রস্তুত। ঘুরে দেখার জন্য একটি দিন বেছে নাও।"}
});
function currentLanguage(){
 const canon=window.VNVLanguage?.getLanguage?.()||document.documentElement.lang||"en";
 const lang=String(canon).toLowerCase().split("-")[0];
 return Object.prototype.hasOwnProperty.call(WEEK_UI,lang)?lang:"en";
}
function localWeek(n){
 const ui=WEEK_UI[currentLanguage()];
 return ui.suffix?ui.week+" "+n+" "+ui.suffix:ui.week+" "+n;
}
function localWeekCount(n){
 const ui=WEEK_UI[currentLanguage()];
 return ui.count?ui.count(n):localWeek(n)+" "+ui.of+" 42";
}
function refreshWeekLanguage(){
 const ui=WEEK_UI[currentLanguage()];
 const label=$("discoveryWeekLabel");
 if(label)label.textContent=ui.week;
 const select=$("discoveryWeekSelect");
 if(select){
  for(const option of select.options)option.textContent=localWeek(Number(option.value));
  select.setAttribute("aria-label",ui.week);
 }
 const count=$("discoveryWeekCount");if(count)count.textContent=localWeekCount(selected);
 const status=$("discoveryStatus");
 if(status)status.textContent=ui.ready.replace("{n}",String(selected));
 // Curriculum theme titles remain with the canonical VNV translator.
 window.VNVLanguage?.refresh?.();
}

const DAYS=[
 {name:"Monday",icon:"📚",topic:"Story & Sounds",domains:["literacy"],
 invitation:theme=>"Start with a story connected to “"+theme+".” Read aloud or tell a familiar story. Pause to notice a character, a picture, a word, or a sound. Clap the beats in one familiar word.",
 tryIt:"Let the child choose a story picture. Ask: “What do you notice?” Then listen, point, sign, or say a word together.",
 evidence:"Show, tell, point to, or draw one thing remembered from the story."},
 {name:"Tuesday",icon:"🔢",topic:"Numbers in Our World",domains:["earlyMath"],
 invitation:theme=>"Explore “"+theme+"” with a small set of safe everyday objects. Count one at a time, move each object as it is counted, then compare two groups using more, fewer, or the same.",
 tryIt:"Invite the child to choose up to five safe objects and make two little groups. Count together and talk about the difference.",
 evidence:"Show two small groups and point to or explain which has more, fewer, or the same."},
 {name:"Wednesday",icon:"🎨",topic:"Color, Nature & Wonder",domains:["wonderScience","creativeArtsMusic"],
 invitation:theme=>"Look closely at something in your world that connects to “"+theme+".” Notice a color, shape, sound, texture, or change. Then choose colors, drawings, or sounds to show what you noticed.",
 tryIt:"Find two colors nearby. Talk about what looks alike or different, then make a two-color picture or a tiny sound pattern.",
 evidence:"Show a drawing, point out a discovery, or describe one choice made while exploring."},
 {name:"Thursday",icon:"💛",topic:"Friendship & Feelings",domains:["feelingsSEL","lifeSkill"],
 invitation:theme=>"Share a pretend story about a friend learning something new during “"+theme+".” Name a feeling, notice a clue, practice a kind question, and choose one gentle way to help.",
 tryIt:"Use a toy or puppet to act out a small helping moment. Practice saying, signing, or showing: “Can I help?”",
 evidence:"Role-play, point to, or explain one kind and respectful response to a pretend friend."},
 {name:"Friday",icon:"🌟",topic:"My Mini Showcase",domains:["storyImagination","movement"],
 invitation:theme=>"Celebrate this week's discoveries about “"+theme+".” Invite the child to retell a story, count objects, show a picture, try a gentle movement, or practice a helpful phrase—whichever feels right.",
 tryIt:"Let the child choose two favorite moments from the week. They may sing, show, move, point, draw, or tell you about them.",
 evidence:"Share three things the learner tried and one curiosity to explore again. A grown-up may remember these privately, without grades or records."}
];
function weekNumber(){
 const url=new URL(location.href),query=Number(url.searchParams.get("week"));
 let stored=1;try{stored=Number(localStorage.getItem(KEY)||1)}catch{}
 const n=Number.isInteger(query)&&query>=1&&query<=42?query:stored;
 return Number.isInteger(n)&&n>=1&&n<=42?n:1;
}
let selected=weekNumber();
function choose(n){
 if(!Number.isInteger(n))return;
 selected=Math.max(1,Math.min(42,n));
 try{localStorage.setItem(KEY,String(selected))}catch{}
 const url=new URL(location.href);url.searchParams.set("week",String(selected));
 history.replaceState(null,"",url.pathname+url.search+url.hash);
 render();
}
function appFor(data,domain){const id=data&&data.recommended&&data.recommended[domain];return id&&catalog&&catalog.byId?catalog.byId(id):null}
function href(app){
 if(!app||typeof app.file!=="string")return "";
 const parts=app.file.replace(/^\/+/,"").split("/").filter(Boolean);
 if(!parts.length||parts.some(p=>p===".."||p==="."))return "";
 return "../apps/"+parts.map(encodeURIComponent).join("/");
}
function assign(link,app,name){
 if(!link)return;
 const url=href(app);
 link.hidden=!url;
 if(url){link.href=url;link.textContent="PLAY";link.title="Play "+app.title;link.setAttribute("aria-label","Play "+app.title+" for "+name)}
 else link.removeAttribute("href");
}
function renderDay(data,def,i){
 const root=$("day"+(i+1));if(!root)return;
 const primary=appFor(data,def.domains[0]);
 const secondary=def.domains[1]?appFor(data,def.domains[1]):null;
 const set=(selector,value)=>{const el=root.querySelector(selector);if(el)el.textContent=value};
 set(".day-topic",def.topic);
 set(".discover-invitation",def.invitation(data.theme));
 set(".discover-try",def.tryIt);
 set(".discover-evidence",def.evidence);
 set(".discover-app-caption",primary&&primary.desc?primary.desc:"Enjoy this gentle activity together.");
 assign(root.querySelector(".discover-play.primary"),primary,def.name);
 assign(root.querySelector(".discover-play.secondary"),secondary,def.name);
 const extra=root.querySelector(".discover-extra-caption");
 if(extra){extra.hidden=!secondary;extra.textContent=secondary&&secondary.desc?secondary.desc:""}
}
function render(){
 const status=$("discoveryStatus");
 if(!spine||!catalog||!Array.isArray(spine.weeks)||spine.weeks.length!==42){
  if(status)status.textContent="The weekly garden is temporarily unavailable. Preschool Home remains open for free play.";
  return;
 }
 const data=spine.weeks[selected-1];
 $("discoveryWeekTheme").textContent=data.theme;
 $("discoveryWeekThemeName").textContent=data.theme;
 $("discoveryWeekSelect").value=String(selected);
 DAYS.forEach((def,i)=>renderDay(data,def,i));
 refreshWeekLanguage();
}
function init(){
 const selector=$("discoveryWeekSelect");
 if(selector)selector.replaceChildren(); // Remove the no-JS Week 1 fallback before populating all 42.
 if(selector)for(let week=1;week<=42;week++){
  const opt=document.createElement("option");opt.value=String(week);opt.textContent=localWeek(week);selector.append(opt);
 }
 selector&&selector.addEventListener("change",()=>choose(Number(selector.value)));
 document.addEventListener("vnv:language-change",refreshWeekLanguage);
 $("discoveryPrev")?.addEventListener("click",()=>choose(selected===1?42:selected-1));
 $("discoveryNext")?.addEventListener("click",()=>choose(selected===42?1:selected+1));
 document.querySelectorAll(".discover-day-nav a[href^='#day']").forEach(link=>{
  link.addEventListener("click",()=>{
   const target=document.querySelector(link.getAttribute("href"));
   if(target&&target.matches(".discover-lesson")){
    document.querySelectorAll(".discover-lesson").forEach(el=>{el.open=el===target});
   }
  });
 });
 document.querySelectorAll(".discover-lesson").forEach((el,i)=>{
  el.open=i===0;
  el.addEventListener("toggle",()=>{if(el.open)document.querySelectorAll(".discover-lesson").forEach(other=>{if(other!==el)other.open=false})});
 });
 render();
}
if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",init,{once:true});else init();
})();
