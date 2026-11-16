import {rayBox,wallDistance} from './map.js';
export const WEAPONS = {
  needle:{name:'N-7 NEEDLE',cost:0,mag:12,reserve:60,gap:.27,reload:1.45,damage:40,head:3,spread:.0018,kick:.012},
  tide:{name:'T-4 TIDE',cost:1600,mag:26,reserve:104,gap:.105,reload:2.1,damage:27,head:4,spread:.004,kick:.018}
};
export function equip(p,id){const w=WEAPONS[id];p.weapon=id;p.mag=w.mag;p.reserve=w.reserve;p.reload=0;p.cooldown=0;}
export function reload(p){const w=WEAPONS[p.weapon];if(!p.reload&&p.mag<w.mag&&p.reserve>0)p.reload=w.reload;}
export function tickWeapon(p,dt){p.cooldown=Math.max(0,p.cooldown-dt);p.flash=Math.max(0,(p.flash||0)-dt);p.hit=Math.max(0,(p.hit||0)-dt);
  if(p.reload>0){p.reload=Math.max(0,p.reload-dt);if(!p.reload){const n=Math.min(WEAPONS[p.weapon].mag-p.mag,p.reserve);p.mag+=n;p.reserve-=n;}}
}
export function damage(s,target,amount,head=false){if(target.hp<=0)return;
  if(target===s.player&&!head&&target.armor>0){const absorbed=Math.min(target.armor,Math.ceil(amount/2));target.armor-=absorbed;amount-=absorbed;}
  target.hp=Math.max(0,target.hp-amount);
  if(target===s.player){target.hurt=.35;s.message='UNDER FIRE';}
  else {s.player.hit=.18;s.message=head?'HEADSHOT':'HIT';if(target.hp===0){s.money+=300;s.kills++;s.message=head?'HEADSHOT · +300':'SENTRY DOWN · +300';}}
}
export function trace(s,ox,oy,oz,dx,dy,dz,targets,amount,headMultiplier=3){let closest=wallDistance(ox,oy,oz,dx,dy,dz),target=null,head=false;
  for(const b of targets){if(b.hp<=0)continue;const crouch=b.crouch||false,eye=crouch?1:1.6;
    const h=rayBox(ox,oy,oz,dx,dy,dz,b.x,eye,b.z,.38,.38,.38);
    const body=rayBox(ox,oy,oz,dx,dy,dz,b.x,eye-.59,b.z,.6,crouch?.7:1.05,.48);
    const d=Math.min(h,body);if(d<closest){closest=d;target=b;head=h<=body;}}
  if(target)damage(s,target,amount*(head?headMultiplier:1),head);
  s.tracer.x=ox+dx*closest;s.tracer.y=oy+dy*closest;s.tracer.z=oz+dz*closest;s.tracer.life=.07;
  return target;
}
export function fire(s,random=Math.random){const p=s.player,w=WEAPONS[p.weapon];if(p.hp<=0||p.mag<=0||p.reload||p.cooldown>0)return false;
  p.mag--;p.cooldown=w.gap;p.flash=.055;s.noise=2;s.noiseX=p.x;s.noiseZ=p.z;
  const spread=w.spread+Math.hypot(p.vx,p.vz)*.007+(p.crouch?-.001:0)+p.bloom;
  const yaw=p.yaw+(random()-.5)*spread*2,pitch=p.pitch+(random()-.5)*spread*2;
  trace(s,p.x,p.eye,p.z,-Math.sin(yaw)*Math.cos(pitch),Math.sin(pitch),-Math.cos(yaw)*Math.cos(pitch),s.bots,w.damage,w.head);
  p.pitch=Math.min(1.35,p.pitch+w.kick);p.yaw+=(random()-.5)*w.kick*.4;p.bloom=Math.min(.03,p.bloom+.006);return true;
}
