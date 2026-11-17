/* Khaemenes Preschool · child-safe learning dock v1.0.0
   Same-repository destinations only. No parent/search/ecosystem/support/info controls. */
(()=>{"use strict";
const ROOT="khaemenesEarlyLearningDock";
if(document.getElementById(ROOT))return;
const base="/Khaemenes_Preschool.github.io/";
const items=[
 ["🔤","ABC",base+"apps/ABC_adventure_hub_index.html"],
 ["🔢","Numbers",base+"apps/math_cloud_index.html"],
 ["🔷","Shapes",base+"apps/shapes_game_index.html"],
 ["📚","Stories",base+"apps/ABC_Story_Time/"],
 ["🎨","Art",base+"apps/art_drawing_tool_index.html"],
 ["🏃","Move",base+"apps/PE_move_n_groove_index.html"]
];
const style=document.createElement("style");style.id="khaemenesEarlyLearningDockStyle";style.textContent=`
#${ROOT}{position:fixed;left:max(12px,env(safe-area-inset-left));bottom:max(12px,env(safe-area-inset-bottom));z-index:2147482500;width:min(330px,calc(100vw - 24px));padding:7px;border:3px solid #fff;border-radius:18px;background:rgba(255,253,248,.98);box-shadow:0 12px 30px rgba(35,45,80,.22)}
#${ROOT} .keld-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:7px}
#${ROOT} a{min-height:78px;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:4px;padding:8px 5px;border:2px solid #315f91;border-radius:14px;background:#fff;color:#243038;text-decoration:none;text-align:center;font:700 18px/1.15 "Avenir Next","Trebuchet MS",Arial,sans-serif}
#${ROOT} a span{font-size:30px;line-height:1}
#${ROOT} a:focus-visible{outline:4px solid #ffd63d;outline-offset:2px}
#${ROOT} a:nth-child(2n){background:#fff7d9}#${ROOT} a:nth-child(3n){background:#e8f8ff}
@media(max-width:420px){#${ROOT}{width:min(300px,calc(100vw - 18px));left:9px;bottom:9px}#${ROOT} a{min-height:72px;font-size:18px}}
@media print{#${ROOT}{display:none!important}}
`;
document.head.append(style);
const nav=document.createElement("nav");nav.id=ROOT;nav.setAttribute("aria-label","Preschool learning activities");
const grid=document.createElement("div");grid.className="keld-grid";
for(const [icon,label,href] of items){const a=document.createElement("a");a.href=href;const s=document.createElement("span");s.textContent=icon;s.setAttribute("aria-hidden","true");a.append(s,document.createTextNode(label));grid.append(a)}
nav.append(grid);document.body.append(nav);
document.documentElement.dataset.khaemenesEarlyLearningDock="preschool-local-only";
})();