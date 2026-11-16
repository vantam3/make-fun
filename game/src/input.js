export function createInput(canvas,onLock,onAction){
  const keys=new Set(),state={locked:false,fire:false,dx:0,dy:0};
  function clear(){keys.clear();state.fire=false;state.dx=state.dy=0;}
  addEventListener('keydown',e=>{if(e.code==='Escape'&&(state.locked||document.pointerLockElement===canvas)){e.preventDefault();state.locked=false;clear();document.exitPointerLock();onLock(false);return;}if(['Space','Tab','ControlLeft','KeyW','KeyS','KeyA','KeyD'].includes(e.code))e.preventDefault();if(!e.repeat)onAction(e.code);if(state.locked)keys.add(e.code);});
  addEventListener('keyup',e=>keys.delete(e.code));
  addEventListener('mousemove',e=>{if(state.locked){state.dx+=e.movementX;state.dy+=e.movementY;}});
  addEventListener('mousedown',e=>{if(state.locked&&e.button===0)state.fire=true;});
  addEventListener('mouseup',()=>state.fire=false);
  addEventListener('blur',()=>{clear();if(document.pointerLockElement)document.exitPointerLock();});
  document.addEventListener('visibilitychange',()=>{if(document.hidden){clear();if(document.pointerLockElement)document.exitPointerLock();}});
  document.addEventListener('pointerlockchange',()=>{state.locked=document.pointerLockElement===canvas;clear();onLock(state.locked);});
  document.addEventListener('pointerlockerror',()=>{state.locked=false;clear();onLock(false);});
  return {state,async lock(){try{await canvas.requestPointerLock();}catch{onLock(false);}},sample(out){out.forward=Number(keys.has('KeyW'))-Number(keys.has('KeyS'));out.strafe=Number(keys.has('KeyD'))-Number(keys.has('KeyA'));out.crouch=keys.has('KeyC')||keys.has('ControlLeft')||keys.has('ControlRight');out.sprint=keys.has('ShiftLeft')||keys.has('ShiftRight');out.reload=keys.has('KeyR');out.interact=keys.has('KeyE');out.fire=state.fire;return out;}};
}
