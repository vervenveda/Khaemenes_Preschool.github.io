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
if(!html.includes('data-creche-visual-standard="creche-home-fresh-v1"')){
  problems.push("fresh reset visual-standard marker missing from index");
}
const headerMounts=(html.match(/VNV_HEADER\.mount\(/g)||[]).length;
if(headerMounts!==1) problems.push("expected one VNV_HEADER.mount call; found "+headerMounts);
if(!/VNV_HEADER\.mount\(\{[^;]*"actions":\[\]\}\);/s.test(html)){
  problems.push("official header must remain hamburger-only with actions:[]");
}

const hero=(html.match(/<div class="hero-copy">[\s\S]*?<div class="hero-playground"/)||[])[0]||"";
if(/<div class="actions">/.test(hero)) problems.push("hero oval contains retired action block");
const toolbar=(html.match(/<nav class="hero-orbit-labels"[\s\S]*?<\/nav>/)||[])[0]||"";
const toolbarControls=(toolbar.match(/<(?:a|button)\b/g)||[]).length;
if(toolbarControls!==16) problems.push("expected 16 hero-toolbox controls; found "+toolbarControls);

for(const id of ["surpriseHero","menuBtn","childViewBtn","grownupViewBtn","readingTimeBtn"]){
  const count=(html.split('id="'+id+'"').length-1)+(html.split("id='"+id+"'").length-1);
  if(count!==1) problems.push("expected exactly one #"+id+"; found "+count);
}
if(/id=["']navReadingTime["']/.test(html)) problems.push("duplicate Reading Time control returned");

if(!css.includes("FRESH VISUAL SYSTEM · 2026-11-19")) problems.push("fresh stylesheet marker missing");
if(css.includes("migrated from #")) problems.push("legacy migrated CSS returned");
if(css.includes("CONSOLIDATED HOME VISUAL STANDARD")) problems.push("old consolidated override stack returned");
if(css.length>60000) problems.push("fresh Preschool stylesheet grew beyond 60 KB; current "+css.length);
if(!css.includes("font-size:18px;")) problems.push("18px body floor missing");
if(!css.includes("margin:11px auto 0")) problems.push("11px hero/toolbox gap missing");
for(const size of ["112px","96px","84px"]){
  if(!css.includes("width:"+size)) problems.push("orbit size missing: "+size);
}
for(const token of [
  "--prek-sun:#ffe45e","--prek-sky:#67cfff","--prek-aqua:#62e4f5",
  "--prek-mint:#77e6b6","--prek-green:#a6e85c","--prek-pink:#ff88c8",
  "--prek-watermelon:#ff7a8a","--prek-orange:#ffb347","--prek-lavender:#b89cff"
]){
  if(!css.includes(token)) problems.push("fresh palette token missing: "+token);
}
for(const token of ["#weeklyGarden{","#myHome{","#new{","#today{","#profiles{","#grownups{","#contribute{"]){
  const count=css.split(token).length-1;
  if(count!==1) problems.push("expected one section owner "+token+"; found "+count);
}

if(problems.length){
  console.error(JSON.stringify({status:"FAIL",problems},null,2));
  process.exit(1);
}
console.log(JSON.stringify({
  status:"PASS",
  visualSystem:"fresh-reset-20261119",
  cssBytes:css.length,
  localCssOwner:localCss[0],
  inlineStyleBlocks:0,
  headerMounts,
  toolbarControls,
  fontFloor:"18px",
  heroToolboxGap:"11px",
  orbitSizes:["112px","96px","84px"]
},null,2));
