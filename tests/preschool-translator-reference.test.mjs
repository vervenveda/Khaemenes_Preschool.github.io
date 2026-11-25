import test from 'node:test';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import {readFileSync} from 'node:fs';
const src=readFileSync(new URL('../assets/preschool-language-loader.js',import.meta.url),'utf8');
const match=src.match(/function load\(src\)\{[\s\S]*?\n\}\)\}/);
assert.ok(match);
function fixture(existing){
 const appended=[];
 const document={scripts:existing.map(src=>({src})),createElement:()=>({}),head:{append(s){appended.push(s.src);s.onload()}}};
 const load=vm.runInNewContext(match[0]+'\nload',{document,URL,location:{href:'https://vervenveda.com/Khaemenes_Preschool.github.io/'}});
 return {load,appended};
}
const current='https://vervenveda.com/assets/vnv-language.js?v=20261124-header-slot';
test('canonical reference matches gateway version',()=>{assert.ok(src.includes(current));assert.ok(!src.includes('20261108-cream-buttons'))});
test('existing old or current shared translator is not executed twice',async()=>{
 for(const url of [current,'https://vervenveda.com/assets/vnv-language.js?v=older']){
  const f=fixture([url]);await f.load(current);assert.equal(f.appended.length,0);
 }
});
test('new page loads current shared translator',async()=>{const f=fixture([]);await f.load(current);assert.deepEqual(f.appended,[current])});
test('unrelated scripts are not suppressed',async()=>{const f=fixture(['https://vervenveda.com/other/assets/vnv-language.js']);await f.load(current);assert.deepEqual(f.appended,[current])});
