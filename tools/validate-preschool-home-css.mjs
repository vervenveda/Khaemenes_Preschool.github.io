#!/usr/bin/env node
import fs from "node:fs";

const html=fs.readFileSync("index.html","utf8");
const css=fs.readFileSync("assets/creche-vivid-seven-radius-v1.css","utf8");
const problems=[];

if(/<style\b/i.test(html)) problems.push("index.html contains inline <style> blocks");
const localCss=[...html.matchAll(/<link[^>]+rel=["']stylesheet["'][^>]*href=["']([^"']+)["'][^>]*>/gi)]
  .map(m=>m[1]).filter(h=>!/^https?:/i.test(h));
if(localCss.length!==1 || !localCss[0].includes("creche-vivid-seven-radius-v1.css")){
  problems.push("Preschool home must have exactly one local CSS owner; found: "+JSON.stringify(localCss));
}
const headerMounts=(html.match(/VNV_HEADER\\.mount\\(/g)||[]).length;
const toolbar=(html.match(/<nav class="hero-orbit-labels"[\\s\\S]*?<\\/nav>/)||[])[0]||"";
const heroToolbarControls=(toolbar.match(/<(?:a|button)\\b/g)||[]).length;
if(heroToolbarControls!==16) problems.push("expected 16 unique hero-toolbar controls; found "+heroToolbarControls);
if(/<div class="actions">/.test((html.match(/<div class="hero-copy">[\\s\\S]*?<div class="hero-playground"/)||[])[0]||"")) problems.push("hero oval still contains the retired action block");
for(const id of ["surpriseHero","menuBtn","childViewBtn","grownupViewBtn","readingTimeBtn"]){
  const count=(html.match(new RegExp('id=["\\\\']'+id+'["\\\\']','g'))||[]).length;
  if(count!==1) problems.push("expected exactly one #"+id+"; found "+count);
}
if(headerMounts!==1) problems.push("expected one VNV_HEADER.mount call; found "+headerMounts);
if(!/VNV_HEADER\.mount\(\{[^;]*"actions":\[\]\}/s.test(html)) problems.push("official header must remain hamburger-only with actions:[]");
if(!css.includes("--prek-font-floor:18px")) problems.push("18px Preschool font floor missing");
if(!css.includes("--prek-content:1080px")) problems.push("shared Preschool content width token missing");
for(const token of ["--prek-yellow:#FFD63D","--prek-aqua:#8FE6F9","--prek-green:#B3EE75","--prek-pink:#FFADCF","--prek-orange:#FFBF64","--prek-lavender:#D5BFFF"]){
  if(!css.includes(token)) problems.push("palette token missing: "+token);
}
for(const size of ["112px","96px","84px"]){
  if(!css.includes("width:"+size+"!important")) problems.push("orbit size missing: "+size);
}
if(problems.length){
  console.error(JSON.stringify({status:"FAIL",problems},null,2));
  process.exit(1);
}
console.log(JSON.stringify({
  status:"PASS",
  inlineStyleBlocks:0,
  localCssOwner:localCss[0],
  headerMounts,
  fontFloor:"18px",
  contentWidth:"1080px",
  orbitSizes:["112px","96px","84px"]
},null,2));
