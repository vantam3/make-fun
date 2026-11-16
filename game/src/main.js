import {createState,newRound,buy,deploy,step,throwGrenade,STEP} from './sim.js';
import {createInput} from './input.js';
import {createRenderer} from './render.js';
import {updateHUD} from './hud.js';
let view;
try{view=createRenderer(document.getElementById('game'));}catch(error){document.getElementById('error').hidden=false;throw error;}
let state=createState();const sample={};let accumulator=0,last=performance.now(),previous='title',triggerHeld=false;
const input=createInput(view.canvas,()=>{accumulator=0;},code=>{if(code==='Enter'&&state.phase==='buy')launch();if(code==='KeyG'&&input.state.locked)throwGrenade(state);});
function launch(){deploy(state);input.lock();}
document.getElementById('play').onclick=()=>{state.phase='buy';};
document.getElementById('deploy').onclick=launch;
document.getElementById('resume').onclick=()=>input.lock();
document.getElementById('next').onclick=()=>{if(state.wins>=4||state.losses>=4){state=createState();state.phase='buy';}else newRound(state);};
for(const button of document.querySelectorAll('[data-buy]'))button.onclick=()=>{document.getElementById('buy-status').textContent=buy(state,button.dataset.buy)?'Equipment issued.':'Equipment unavailable.';};
function frame(now){const dt=Math.min(.1,(now-last)/1000);last=now;
  if(state.phase==='live'&&input.state.locked){state.player.yaw-=input.state.dx*.0022;state.player.pitch=Math.max(-1.35,Math.min(1.35,state.player.pitch-input.state.dy*.0022));input.state.dx=input.state.dy=0;input.sample(sample);accumulator+=dt;while(accumulator>=STEP){const held=sample.fire;sample.fire=held&&(state.player.weapon==='tide'||!triggerHeld);step(state,sample);sample.fire=held;triggerHeld=held;accumulator-=STEP;}}
  else {accumulator=0;triggerHeld=false;}
  if(state.phase==='end'&&previous!=='end'&&document.pointerLockElement)document.exitPointerLock();previous=state.phase;
  updateHUD(state,input.state.locked);view.draw(state,now/1000);requestAnimationFrame(frame);
}requestAnimationFrame(frame);
