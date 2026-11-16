import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createState,start,step,transition,STEP,distance,WIDTH,HEIGHT } from '../game/src/simulation.js';
import { axes,createInput } from '../game/src/input.js';
const fresh=()=>{const s=createState();start(s);return s;};
test('official dossier library is byte-for-byte unchanged',()=>{
 assert.deepEqual(readFileSync(new URL('../vendor/makefun-game.ts',import.meta.url)),readFileSync('/workspace/makefun-tools/best-game-01-kit/starter/vendor/makefun-game.ts'));
});
test('menu, pause, resume, timeout, restart clear expedition state',()=>{
 const s=createState();transition(s,'confirm');assert.equal(s.mode,'play');
 transition(s,'pause');step(s,STEP,{x:1});assert.equal(s.time,0);transition(s,'confirm');
 s.remaining=.001;step(s,STEP);assert.equal(s.mode,'lost');transition(s,'confirm');
 assert.equal(s.remaining,180);assert.equal(s.score,0);assert.equal(s.pulses.length,0);assert.equal(s.total,0);
});
test('axes cancel; diagonals normalize; movement stays in bounds',()=>{
 assert.deepEqual(axes(new Set(['KeyW','ArrowDown','KeyA','KeyD'])),{x:0,y:0});
 const a=fresh(),b=fresh();step(a,STEP,{x:1});step(b,STEP,{x:1,y:1});
 assert.ok(Math.abs(distance(a.player,{x:600,y:530})-distance(b.player,{x:600,y:530}))<1e-9);
 for(let i=0;i<600;i++)step(a,STEP,{x:1,y:-1});
 assert.ok(a.player.x<=WIDTH-40&&a.player.y>=120&&a.player.y<HEIGHT);
});
test('keyboard tether chooses nearest regardless of stale mouse; hold capacity is three',()=>{
 const s=fresh();s.relics=[{x:610,y:530,phase:0,id:0},{x:710,y:530,phase:0,id:1}];
 step(s,STEP,{tether:true,keyboardTether:true,aim:{x:710,y:530}});assert.equal(s.cargo[0].id,0);
 s.cargo=[{},{},{}];step(s,STEP,{tether:true,keyboardTether:true});assert.equal(s.cargo.length,3);
});
test('storm collision scatters cargo, invulnerability prevents repeated damage; sanctuary shelters',()=>{
 const s=fresh();s.cargo=[{phase:0,id:2}];s.pulses=[{x:s.player.x,y:s.player.y,age:0,radius:0,hit:false}];
 step(s,STEP);assert.equal(s.health,4);assert.equal(s.cargo.length,0);assert.equal(s.relics.length,9);
 s.pulses.push({x:s.player.x,y:s.player.y,age:0,hit:false});step(s,STEP);assert.equal(s.health,4);
 const b=fresh();b.player={...b.sanctuary,angle:0};b.pulses=[{...b.player,age:0,hit:false}];step(b,STEP);assert.equal(b.health,5);
 s.invulnerable=0;s.health=1;s.pulses=[{...s.player,age:0,hit:false}];step(s,STEP);assert.equal(s.mode,'lost');
});
test('held keys and pointer release on blur, action autorepeat ignored',()=>{
 class Host{handlers={};addEventListener(n,f){(this.handlers[n]??=[]).push(f)}send(n,e={}){for(const f of this.handlers[n]||[])f({preventDefault(){},...e})}}
 const h=new Host(),canvas=new Host(),actions=[];const input=createInput(canvas,a=>actions.push(a),()=>{},h);
 h.send('keydown',{code:'KeyD'});canvas.send('pointerdown',{button:0});assert.equal(input.read().x,1);assert.equal(input.read().tether,true);
 h.send('keydown',{code:'KeyP',repeat:true});assert.deepEqual(actions,[]);h.send('blur');assert.equal(input.read().x,0);assert.equal(input.read().tether,false);assert.deepEqual(actions,['blur']);
});
// A reproducible pilot exercising normal rules, with no state writes after start.
export function controls(s){
 const needed=s.stage+3-s.delivered;
 const target=s.cargo.length>=Math.min(3,needed)?s.sanctuary:s.relics.reduce((a,b)=>distance(s.player,a)<distance(s.player,b)?a:b);
 const dx=target.x-s.player.x,dy=target.y-s.player.y;
 return {x:Math.abs(dx)>7?Math.sign(dx):0,y:Math.abs(dy)>7?Math.sign(dy):0,tether:true,keyboardTether:true};
}
test('normal-control pilot completes all three stages, replay is exact, win restarts',()=>{
 function run(){const s=fresh();for(let i=0;i<180*60&&s.mode==='play';i++)step(s,STEP,controls(s));return s;}
 const s=run();assert.equal(s.mode,'won');assert.ok(s.total>=12);assert.deepEqual(s,run());
 console.log(`Pilot: ${s.total} relics, ${s.score} points, ${s.time.toFixed(2)} simulation seconds, hull ${s.health}`);
 transition(s,'confirm');assert.equal(s.stage,0);assert.equal(s.mode,'play');
});
