import { createState, start, transition, step, STEP } from './simulation.js';
import { createInput } from './input.js';
import { createRenderer } from './render.js';
import { createAudio } from './audio.js';
import { createUI } from './ui.js';
const state=createState();
// The title uses a fresh, unplayed expedition as its backdrop.
start(state);state.mode='title';
const audio=createAudio(), canvas=document.getElementById('ocean');
const renderer=createRenderer(canvas);
function action(name) {
  if(name!=='blur') audio.unlock();
  if(name==='mute'){ui.mute(audio.toggle());return;}
  if(name==='blur'){if(state.mode==='play')transition(state,'pause');return;}
  transition(state,name);
}
const ui=createUI(action),input=createInput(canvas,action,audio.unlock);
let last=performance.now(),accumulator=0;
function frame(now){
  accumulator+=Math.min(.1,(now-last)/1000);last=now;
  while(accumulator>=STEP){step(state,STEP,input.read());state.events.forEach(audio.play);accumulator-=STEP;}
  renderer.draw(state,ui.quiet());ui.update(state);requestAnimationFrame(frame);
}
document.addEventListener('visibilitychange',()=>{if(document.hidden&&state.mode==='play')transition(state,'pause');});
requestAnimationFrame(frame);
