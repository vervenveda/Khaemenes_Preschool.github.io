import fs from "node:fs";
import path from "node:path";

const root=process.cwd();
const dock=fs.readFileSync(path.join(root,"assets","khaemenes-child-safe-learning-dock.js"),"utf8");
const standard=fs.readFileSync(path.join(root,"assets","preschool-global-standard-v1.js"),"utf8");

const bannedLabels=["Parent","Family","Search","Ecosystem","Support","Instructions","Info"];
for(const label of bannedLabels){
  const rx=new RegExp('["\\\']'+label+'["\\\']','i');
  if(rx.test(dock)){
    console.error("FAIL: Preschool child dock contains banned control label:",label);
    process.exit(1);
  }
}
if(/https?:\/\//i.test(dock)){
  console.error("FAIL: Preschool child dock contains an absolute external URL.");
  process.exit(1);
}
const hrefs=[...dock.matchAll(/base\+"([^"]+)"/g)].map(m=>m[1]);
if(hrefs.length!==6){
  console.error("FAIL: Preschool child dock must contain exactly six same-repository destinations. Found:",hrefs.length);
  process.exit(1);
}
if(!standard.includes('khaemenes-child-safe-learning-dock.js')){
  console.error("FAIL: Preschool global standard does not load child-safe dock.");
  process.exit(1);
}
for(const needle of [
  'khaemenesEarlyLearningBoundary="local-only"',
  'vnvEcosystemUtilityDock',
  'vnvEcosystemMenuButton',
  'vnvTickerAutoPopulate',
  'home:childFacingSurface()?ROOT'
]){
  if(!standard.includes(needle)){
    console.error("FAIL: Preschool global standard missing safety boundary:",needle);
    process.exit(1);
  }
}
const actionBlock=standard.match(/actions:\[[\s\S]*?\n      \]/)?.[0]||"";
if(/Ecosystem|Family|Parent|Teacher|Support|Search/i.test(actionBlock)){
  console.error("FAIL: Preschool child header actions expose adult/network destinations.");
  process.exit(1);
}

let htmlCount=0,standardCoverage=0;
function walk(dir){
 for(const entry of fs.readdirSync(dir,{withFileTypes:true})){
  if(entry.name===".git"||entry.name==="node_modules")continue;
  const full=path.join(dir,entry.name);
  if(entry.isDirectory()){walk(full);continue}
  if(!entry.name.endsWith(".html"))continue;
  htmlCount++;
  const html=fs.readFileSync(full,"utf8");
  if(html.includes("preschool-global-standard-v1.js"))standardCoverage++;
 }
}
walk(root);

console.log(JSON.stringify({
 status:"PASS",
 repository:"vervenveda/Khaemenes_Preschool.github.io",
 childDockButtons:hrefs.length,
 localOnly:true,
 bannedAdultControls:"absent",
 networkTickerOnChildSurfaces:"suppressed",
 ecosystemDockOnChildSurfaces:"suppressed",
 htmlPages:htmlCount,
 pagesWithSharedStandard:standardCoverage
},null,2));
