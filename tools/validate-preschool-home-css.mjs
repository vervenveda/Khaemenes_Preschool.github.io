#!/usr/bin/env node
import fs from "node:fs";

const html=fs.readFileSync("index.html","utf8");
const css=fs.readFileSync("assets/creche-home-fresh-v1.css","utf8");
const problems=[];

if(/<style\b/i.test(html)) problems.push("index.html contains inline <style> blocks");
const localCss=[...html.matchAll(/<link[^>]+rel=["']stylesheet["'][^>]*href=["']([^"']+)["'][^>]*>/gi)]
  .map(m=>m[1]).filter(h=>!/^https?:/i.test(h));
if(localCss.length!==1 || !localCss[0].includes("creche-home-fresh-v1.css")){
  problems.push("Preschool home must have exactly one local CSS owner; found: "+JSON.stringify(localCss));
}
if(!html.includes('data-creche-visual-standard="creche-home-fresh-v1"')) problems.push("fresh visual marker missing");

const headerMounts=(html.match(/VNV_HEADER\.mount\(/g)||[]).length;
if(headerMounts!==1) problems.push("expected one VNV_HEADER.mount call; found "+headerMounts);
if(!/VNV_HEADER\.mount\(\{[^;]*"actions":\[\]\}\);/s.test(html)) problems.push("official header must remain hamburger-only");

const hero=(html.match(/<div class="hero-copy"[^>]*>[\s\S]*?<\/div>/)||[])[0]||"";
if(!/>Crechè<\/h1>/.test(hero)) problems.push("hero Crèche title missing");
if(!/class="hero-preschool">Preschool<\/p>/.test(hero)) problems.push("hero Preschool subtitle missing");
if(/Reading Time|heroLead|Khaemenes Preschool|Read · Count/.test(hero)) problems.push("hero contains extra visible copy");
if(!css.includes("background:var(--prek-green);")) problems.push("solid lime hero background missing");
if(!css.includes("font-size:77px!important")) problems.push("77px hero title missing");
if(!css.includes("font-size:44px!important")) problems.push("44px Preschool subtitle missing");

const toolbar=(html.match(/<nav class="hero-orbit-labels"[\s\S]*?<\/nav>/)||[])[0]||"";
const toolbarControls=(toolbar.match(/<(?:a|button)\b/g)||[]).length;
if(toolbarControls!==16) problems.push("expected 16 hero toolbox controls; found "+toolbarControls);
if(/hero-notes|hero-undertray-eyebrow/.test(html)) problems.push("retired toolbox statistics/eyebrow returned");

for(const id of ["surpriseHero","menuBtn","childViewBtn","grownupViewBtn","readingTimeBtn"]){
  const count=(html.split('id="'+id+'"').length-1)+(html.split("id='"+id+"'").length-1);
  if(count!==1) problems.push("expected exactly one #"+id+"; found "+count);
}

const accordions=[...html.matchAll(/<details class="feature-accordion"[^>]*>/g)];
if(accordions.length!==10) problems.push("expected 10 matching feature accordions; found "+accordions.length);
if(accordions.some(m=>/\bopen\b/.test(m[0]))) problems.push("feature accordions must be collapsed by default");
for(const feature of ["reading","weekly","home","discovery","explore","garden","graduation","profile","grownup","support"]){
  if(!html.includes('data-feature="'+feature+'"')) problems.push("missing feature accordion: "+feature);
}
if(!css.includes("--prek-accordion:960px")) problems.push("shared 960px accordion width token missing");
for(const id of ["weeklyGarden","myHome","new","today","profiles","grownups","contribute"]){
  const rx=new RegExp("\\n#"+id+"\\{[^{}]*\\}\\n","g");
  if(rx.test(css)) problems.push("retired full-width section background returned: #"+id);
}
if(!css.includes("margin:11px auto 0")) problems.push("11px hero/toolbox gap missing");
if(!css.includes("font-size:18px;")) problems.push("18px body floor missing");
for(const size of ["112px","96px","84px"]){
  if(!css.includes("width:"+size)) problems.push("orbit size missing: "+size);
}
if(css.includes("CONSOLIDATED HOME VISUAL STANDARD") || css.includes("migrated from #")) problems.push("legacy CSS returned");
if(css.length>60000) problems.push("fresh stylesheet exceeded 60 KB: "+css.length);

if(!html.includes('featureDetails.open=true')) problems.push("accordion-aware navigation missing");
if(!html.includes('"#graduation-garden":"#graduationFeature"')) problems.push("old Graduation anchor is not routed to Graduation accordion");

if(problems.length){
  console.error(JSON.stringify({status:"FAIL",problems},null,2));
  process.exit(1);
}
console.log(JSON.stringify({
  status:"PASS",
  hero:"solid-lime / Crechè 77 / Preschool 44",
  toolbarControls,
  featureAccordions:accordions.length,
  accordionWidth:"960px",
  defaultState:"collapsed",
  heroToolboxGap:"11px",
  fontFloor:"18px"
},null,2));
