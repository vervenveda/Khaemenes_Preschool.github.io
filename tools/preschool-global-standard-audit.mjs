#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
const ROOT=process.cwd();
const WRITE=process.argv.includes("--write");
const TAG='  <script src="/Khaemenes_Preschool.github.io/assets/preschool-global-standard-v1.js" defer data-preschool-global-standard="18-33-66-auto-no333"></script>\n';
const LOADER=/preschool-global-standard-v1\.js/i;
function walk(dir){
  const out=[];
  for(const e of fs.readdirSync(dir,{withFileTypes:true})){
    if([".git","node_modules"].includes(e.name))continue;
    const full=path.join(dir,e.name);
    if(e.isDirectory())out.push(...walk(full));
    else out.push(path.relative(ROOT,full).split(path.sep).join("/"));
  }
  return out;
}
function inject(source){
  if(LOADER.test(source))return source;
  if(/<\/head>/i.test(source))return source.replace(/<\/head>/i,TAG+"</head>");
  if(/<body\b/i.test(source))return source.replace(/<body\b/i,TAG+"<body");
  return TAG+source;
}
const files=walk(ROOT).filter(f=>/\.html?$/i.test(f)).sort();
let covered=0,changed=0,source333=0;
for(const file of files){
  const abs=path.join(ROOT,file);
  let s=fs.readFileSync(abs,"utf8");
  if(/vnv-333-ticker\.js|vnv333NetworkTicker/i.test(s))source333++;
  if(LOADER.test(s)){covered++;continue}
  if(WRITE){s=inject(s);fs.writeFileSync(abs,s);covered++;changed++}
}
const guard=fs.readFileSync(path.join(ROOT,"assets/preschool-global-standard-v1.js"),"utf8");
const checks=[
 ["18px readable floor",/size<18[\s\S]{0,180}font-size","18px","important"/],
 ["33px heading rule",/font-size:33px!important/],
 ["66px primary-title rule",/font-size:66px!important/],
 ["AutoPopulate ticker loader",/vnv-ticker-autopopulate\.js/],
 ["333 removal authority",/strip333/],
 ["official header",/vnv-header-autopopulate\.js[\s\S]*VNV_HEADER/],
 ["official toolbar",/vnv-ecosystem-toolbar\.js[\s\S]*vnvEcosystemUtilityDock/],
 ["semantic authority",/khaemenesHierarchy="title-description-v1"/],
 ["early-learning marker",/auto-header-menu-toolbar-no-333/]
];
const failures=checks.filter(([,re])=>!re.test(guard)).map(([n])=>n);
console.log(JSON.stringify({
 mode:WRITE?"write":"check",htmlFiles:files.length,covered,changed,missing:files.length-covered,
 sourcePagesStillReferencing333:source333,
 runtime333Policy:"actively removed / intentionally omitted",
 assertionFailures:failures,
 standard:{minimumReadableTextPx:18,ordinaryTitlePx:33,primaryHeroTitlePx:66,chrome:"AutoPopulate -> header/menu -> toolbar; NO 333"}
},null,2));
if(files.length!==covered||failures.length)process.exitCode=1;
