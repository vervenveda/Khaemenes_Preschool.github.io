/* Khaemenes Preschool · early-learning global standard v1.1.0
   Early learning exception: NO 333 ticker.
   Required on child-facing pages: AutoPopulate ticker -> child-safe local header -> local-only 3x2 learning dock. No ecosystem escape controls.
   Typography: 18px readable floor · 33px ordinary titles · one 66px primary title.
   Semantics: eyebrow = category/brand; title = heading; description = paragraph.
   Existing preschool visual styling is preserved.
*/
(()=>{"use strict";
if(window.__KHAEMENES_PRESCHOOL_GLOBAL_STANDARD_V1__)return;
window.__KHAEMENES_PRESCHOOL_GLOBAL_STANDARD_V1__=true;

const VNV="https://vervenveda.com/assets/";
const ROOT="https://vervenveda.com/Khaemenes_Preschool.github.io/";
const STYLE_ID="khaemenesPreschoolTypographyStandardV1";
const PRIMARY_ATTR="data-khaemenes-primary-title";
const SCRIPTS={
  tickerAuto:VNV+"vnv-ticker-autopopulate.js",
  header:VNV+"vnv-header-autopopulate.js",
  childDock:ROOT+"assets/khaemenes-child-safe-learning-dock.js",
  toolbar:VNV+"vnv-ecosystem-toolbar.js"
};

function strip333(){
  document.querySelectorAll('script[src*="vnv-333-ticker.js"]').forEach(s=>s.remove());
  document.querySelectorAll('#vnv333NetworkTicker,[data-vnv-333-ticker],.vnv-333-ticker').forEach(el=>el.remove());
  document.documentElement.dataset.khaemenes333Ticker="intentionally-omitted-early-learning";
}
function hasScript(pathname){
  return [...document.scripts].some(s=>{try{return new URL(s.src,location.href).pathname===pathname}catch{return false}});
}
function load(src,key){
  const url=new URL(src,location.href);
  if(hasScript(url.pathname))return Promise.resolve();
  return new Promise(resolve=>{
    const s=document.createElement("script");
    s.src=url.href;s.defer=true;s.dataset[key]="true";
    s.addEventListener("load",resolve,{once:true});
    s.addEventListener("error",resolve,{once:true});
    (document.head||document.documentElement).append(s);
  });
}
function visible(el){
  if(!el||!el.isConnected||el.hidden||el.getAttribute("aria-hidden")==="true")return false;
  const cs=getComputedStyle(el);
  return cs.display!=="none"&&cs.visibility!=="hidden";
}
function markPrimary(){
  const current=document.querySelector('['+PRIMARY_ATTR+'="true"]');
  if(current&&visible(current))return current;
  document.querySelectorAll('['+PRIMARY_ATTR+']').forEach(el=>el.removeAttribute(PRIMARY_ATTR));
  const chosen=[...document.querySelectorAll(
    'main .hero h1,main h1,.hero h1,[data-hero] h1,[data-page-hero] h1,h1,.hero-title,.main-title,.page-title'
  )].find(visible)||null;
  if(chosen)chosen.setAttribute(PRIMARY_ATTR,"true");
  return chosen;
}
function hasReadableText(el){
  if(!el||el.nodeType!==1)return false;
  if(el.matches("script,style,noscript,template,svg,svg *,canvas,iframe,br,hr,source,track,meta,link"))return false;
  return [...el.childNodes].some(n=>n.nodeType===Node.TEXT_NODE&&String(n.nodeValue||"").trim())||
    el.matches("input,select,textarea,button,option");
}
function enforceFloor(root=document.body){
  if(!root)return;
  const nodes=[];
  if(root.nodeType===1)nodes.push(root);
  if(root.querySelectorAll)nodes.push(...root.querySelectorAll("*"));
  for(const el of nodes){
    if(!hasReadableText(el))continue;
    if(el.matches("h1,h2,h3,h4,h5,h6,[role=heading],["+PRIMARY_ATTR+"]"))continue;
    const size=parseFloat(getComputedStyle(el).fontSize||"0");
    if(size>0&&size<18){
      el.style.setProperty("font-size","18px","important");
      el.dataset.khaemenesMinText="18";
    }
  }
}
function installTypography(){
  if(!document.head||!document.body)return;
  if(!document.getElementById(STYLE_ID)){
    const style=document.createElement("style");
    style.id=STYLE_ID;
    style.textContent=`
html:root body{font-size:18px!important}
html:root body :is(
  p,li,dt,dd,blockquote,figcaption,caption,legend,label,
  a,button,input,select,textarea,option,output,
  td,th,summary,small,strong,em,b,i,u,s,mark,time,
  .eyebrow,.kicker,.subtitle,.subheading,.lead,.description,
  .breadcrumbs,.breadcrumb,.badge,.chip,.pill,.status,.meta,
  .caption,.note,.helper,.hint,.message,.toast,
  .brand-name,.brand-sub,.menu-group,.menu-link,.menu-link small,.menu-link strong
){font-size:max(18px,1em)!important}
html:root body :is(
  h1,h2,h3,h4,h5,h6,[role="heading"],
  .page-title,.hero-title,.main-title,.section-title,.card-title,
  .display-title,.site-title,.brand-title,.modal-title,.dialog-title
){
  font-size:33px!important;
  line-height:1.2!important;
  font-weight:400!important;
  overflow-wrap:anywhere;
  text-wrap:balance
}
html:root body [${PRIMARY_ATTR}="true"]{
  font-size:66px!important;
  line-height:1.05!important;
  font-weight:400!important;
}
@media(max-width:560px){
  html:root body [${PRIMARY_ATTR}="true"]{font-size:66px!important}
}
@media print{html:root body{font-size:18px!important}}
`;
    document.head.append(style);
  }
  markPrimary();
  enforceFloor();
  document.documentElement.dataset.khaemenesPreschoolTypography="18-33-66";
}

const LABELS=".eyebrow,.kicker,[data-eyebrow],[data-kicker]";
const clean=s=>String(s||"").replace(/\s+/g," ").trim();
const words=s=>clean(s).split(/\s+/).filter(Boolean);
const brandLike=s=>/^(?:verve\s*n\s*veda|khaemenes academy)(?:\b|\s*[·|—-])/i.test(clean(s));
const titleLike=s=>{const t=clean(s),w=words(t);return !!t&&t.length<=100&&w.length>=1&&w.length<=10&&!/[.!?…]$/.test(t)};
const sentenceLike=s=>{const t=clean(s),w=words(t);return /[.!?…]$/.test(t)||w.length>=9||(w.length>=6&&/[,;:]/.test(t))};
function normalizeLabel(label){
  if(!label||label.dataset.khaemenesHierarchyChecked==="true")return;
  label.dataset.khaemenesHierarchyChecked="true";
  if(label.closest("nav,footer,[data-khaemenes-no-semantic-normalize]"))return;
  const heading=label.nextElementSibling;
  if(!heading||!/^H[1-6]$/.test(heading.tagName))return;
  if(label.children.length||heading.children.length)return;
  const eyebrowText=clean(label.textContent),headingText=clean(heading.textContent);
  if(!sentenceLike(headingText)||!titleLike(eyebrowText))return;
  if(brandLike(eyebrowText)){
    heading.dataset.khaemenesHierarchyReview="brand-eyebrow-sentence-heading";
    return;
  }
  const desc=document.createElement("p");
  desc.className="khaemenes-section-description";
  desc.textContent=headingText;
  desc.dataset.khaemenesDemotedFromHeading="true";
  heading.dataset.khaemenesOriginalHeading=headingText;
  heading.dataset.khaemenesPromotedFromEyebrow=eyebrowText;
  heading.textContent=eyebrowText;
  label.dataset.khaemenesOriginalEyebrow=eyebrowText;
  label.textContent="Khaemenes Academy";
  heading.insertAdjacentElement("afterend",desc);
  heading.closest("section,article,header,main,div")?.setAttribute("data-khaemenes-hierarchy-normalized","true");
}
function normalizeHierarchy(root=document){
  root.querySelectorAll?.(LABELS).forEach(normalizeLabel);
  document.documentElement.dataset.khaemenesHierarchy="title-description-v1";
}


function childFacingSurface(){
  const p=location.pathname;
  return !/(?:\/|^)(?:family|teacher-tools?|teacher|teachers|admin)(?:\/|$)/i.test(p);
}
function stripEscapeControls(){
  if(!childFacingSurface())return;
  document.querySelectorAll('#vnvEcosystemUtilityDock,#vnvEcosystemMenuButton,[data-vnv-ecosystem-slot]').forEach(el=>el.remove());
  document.querySelectorAll('header a,nav a').forEach(a=>{
    try{
      const u=new URL(a.href,location.href);
      const same=u.pathname.startsWith("/Khaemenes_Preschool.github.io/");
      if(!same&&(u.hostname===location.hostname||/vervenveda\.com$/i.test(u.hostname)||/github\.io$/i.test(u.hostname)))a.remove();
    }catch{}
  });
  document.documentElement.dataset.khaemenesEarlyLearningBoundary="local-only";
}

function mountAuto(){
  try{if(!document.getElementById("vnvTickerAutoPopulate"))window.VNV_TICKER?.autoPopulate?.({mode:"auto"})}catch{}
  strip333();
}
function mountHeader(){
  try{
    window.VNV_HEADER?.mount?.({
      title:"Khaemenes Academy",
      subtitle:"Preschool",
      icon:"K",
      home:"https://vervenveda.com/KhaemenesAcademy_Home.github.io/",
      actions:[
        {label:"Preschool Home",href:ROOT},
        {label:"ABC",href:ROOT+"apps/ABC_adventure_hub_index.html"},
        {label:"Numbers",href:ROOT+"apps/math_cloud_index.html"},
        {label:"Stories",href:ROOT+"apps/ABC_Story_Time/"},
        {label:"Art",href:ROOT+"apps/art_drawing_tool_index.html"}
      ]
    });
  }catch{}
}
function mountToolbar(){
  if(childFacingSurface()){
    stripEscapeControls();
    return;
  }
  try{window.VNVEcosystemToolbar?.mount?.()}catch{}
}
let pending=false;
function schedule(){
  if(pending)return;
  pending=true;
  requestAnimationFrame(()=>{
    pending=false;
    strip333();installTypography();normalizeHierarchy(document);mountAuto();mountHeader();mountToolbar();stripEscapeControls();
  });
}
async function start(){
  if(!document.body)return;
  strip333();installTypography();normalizeHierarchy(document);
  await load(SCRIPTS.tickerAuto,"khaemenesPreschoolAutoTicker");mountAuto();
  await load(SCRIPTS.header,"khaemenesPreschoolHeader");mountHeader();
  if(childFacingSurface()){
    stripEscapeControls();
    await load(SCRIPTS.childDock,"khaemenesPreschoolChildDock");
    stripEscapeControls();
    document.documentElement.dataset.khaemenesPreschoolChrome="auto-child-safe-header-local-dock-no-333";
  }else{
    await load(SCRIPTS.toolbar,"khaemenesPreschoolToolbar");mountToolbar();
    document.documentElement.dataset.khaemenesPreschoolChrome="adult-surface-auto-header-toolbar-no-333";
  }
  strip333();
  if(typeof MutationObserver==="function")new MutationObserver(schedule).observe(document.documentElement,{childList:true,subtree:true});
  window.addEventListener("resize",schedule,{passive:true});
}
if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",start,{once:true});
else start();
})();