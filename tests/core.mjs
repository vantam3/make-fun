import assert from 'node:assert/strict';
import {createState,deploy,step,buy,newRound,throwGrenade,STEP} from '../game/src/sim.js';
import {trace,equip,reload,tickWeapon,damage} from '../game/src/combat.js';
import {updateBots} from '../game/src/ai.js';
import {move,blocked,SITE} from '../game/src/map.js';
let count=0;function test(name,run){run();console.log('PASS',name);count++;}
const live=()=>{const s=createState();s.phase='buy';deploy(s);return s;};
const quiet=s=>{for(const b of s.bots){b.x=100;b.z=100;b.wait=999;}};
test('head ray kills; body ray wounds; concrete occludes',()=>{let s=live();s.player.x=10;s.player.z=12;s.bots=[{x:10,z:8,hp:100}];trace(s,10,1.6,12,0,0,-1,s.bots,40,3);assert.equal(s.bots[0].hp,0);s.bots[0].hp=100;trace(s,10,1,12,0,0,-1,s.bots,40,3);assert.equal(s.bots[0].hp,60);s.bots[0]={x:4,z:0,hp:100};trace(s,4,1,12,0,0,-1,s.bots,40,3);assert.equal(s.bots[0].hp,100);});
test('economy and armor depletion',()=>{const s=createState();s.phase='buy';assert.ok(buy(s,'tide'));assert.equal(s.money,800);assert.ok(buy(s,'armor'));assert.ok(!buy(s,'armor'));damage(s,s.player,100);assert.equal(s.player.hp,50);assert.equal(s.player.armor,10);damage(s,s.player,40);assert.equal(s.player.hp,20);assert.equal(s.player.armor,0);});
test('reload conserves scarce ammunition',()=>{let p={};equip(p,'needle');p.mag=2;p.reserve=3;reload(p);tickWeapon(p,2);assert.equal(p.mag,5);assert.equal(p.reserve,0);});
test('collision slides along cover and crouch changes eye height',()=>{const p={x:13,z:0};move(p,2,1);assert.equal(p.x,13);assert.equal(p.z,1);assert.ok(blocked(15,0));let s=live();quiet(s);for(let i=0;i<30;i++)step(s,{crouch:true});assert.ok(s.player.eye<1.01);});
test('elimination rewards once and new round preserves score',()=>{let s=live();for(const b of s.bots)b.hp=0;step(s,{});assert.equal(s.wins,1);assert.equal(s.money,4600);step(s,{});assert.equal(s.money,4600);newRound(s);assert.equal(s.phase,'buy');assert.equal(s.wins,1);});
test('operator death and clock expiry lose rounds',()=>{for(const mode of ['hp','time']){let s=live();if(mode==='hp')s.player.hp=0;else s.time=0;step(s,{});assert.equal(s.losses,1);assert.equal(s.phase,'end');}});
test('plant requires stationary interaction then transmission wins',()=>{const s=live();quiet(s);s.player.x=SITE.x;s.player.z=SITE.z;for(let i=0;i<181;i++)step(s,{interact:true},STEP,()=>.5);assert.ok(s.planted);assert.equal(s.money,2800);s.charge=.001;step(s,{});assert.equal(s.wins,1);});
test('defuse uses wall clock and resets on interruption',()=>{const s=live();s.planted=true;s.player.hp=0;for(const b of s.bots){b.x=SITE.x;b.z=SITE.z;}updateBots(s,.1,()=>.5);assert.equal(s.defuse,.1);for(const b of s.bots){b.x=-12;b.z=-12;}updateBots(s,.1,()=>.5);assert.equal(s.defuse,0);for(const b of s.bots){b.x=SITE.x;b.z=SITE.z;}for(let i=0;i<301&&s.phase==='live';i++)step(s,{},STEP,()=>.5);assert.equal(s.losses,1);assert.match(s.result,/severed/);});
test('bots engage visible operator and investigate noise',()=>{const s=live();s.player.x=10;s.player.z=12;const b=s.bots[0];b.x=10;b.z=10;updateBots(s,1,()=>.5);assert.equal(b.state,'ENGAGE');assert.ok(s.player.hp<100);s.player.x=-12;s.player.z=-12;s.noise=2;s.noiseX=10;s.noiseZ=12;b.alert=0;updateBots(s,.1,()=>.5);assert.equal(b.state,'INVESTIGATE');});
test('grenade consumes stock and explodes on simulation time',()=>{const s=live();quiet(s);assert.ok(throwGrenade(s));assert.ok(!throwGrenade(s));for(let i=0;i<110;i++)step(s,{},STEP,()=>.5);assert.equal(s.grenade,null);assert.ok(s.blast>0);});
console.log(`${count} simulation checks passed`);
