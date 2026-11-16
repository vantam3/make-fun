// Pure fixed-step state. No DOM, renderer, clock, network or three.js dependency.
import {move,blocked,SITE,visible} from './map.js';
import {WEAPONS,equip,tickWeapon,reload,fire,damage} from './combat.js';
import {createBots,updateBots} from './ai.js';
export const STEP=1/60;
export function createState(){const s={phase:'title',round:0,wins:0,losses:0,money:2400,kills:0,time:90,planted:false,charge:28,plant:0,defuse:0,noise:0,noiseX:0,noiseZ:0,message:'',result:'',grenade:null,blast:0,tracer:{x:0,y:0,z:0,life:0},player:{},bots:[]};newRound(s);s.phase='title';return s;}
export function newRound(s){s.round++;s.phase='buy';s.time=90;s.planted=false;s.charge=28;s.plant=0;s.defuse=0;s.grenade=null;s.blast=0;s.result='';s.noise=0;s.message='SELECT EQUIPMENT · ENTER TO DEPLOY';
  const old=s.player; s.player={x:0,z:12,vx:0,vz:0,yaw:0,pitch:0,eye:1.6,crouch:false,hp:100,grenades:1,bloom:0,hurt:0,flash:0,hit:0};equip(s.player,old.hp>0&&old.weapon?old.weapon:'needle');s.bots=createBots();}
export function buy(s,item){if(s.phase!=='buy')return false;
  if(item==='grenade'){if(s.money<300||s.player.grenades>=2)return false;s.money-=300;s.player.grenades++;return true;}
  if(item==='armor'){if(s.money<500||s.player.armor)return false;s.money-=500;s.player.armor=60;return true;}
  const w=WEAPONS[item];if(!w||s.money<w.cost||s.player.weapon===item)return false;s.money-=w.cost;equip(s.player,item);return true;
}
export function deploy(s){if(s.phase==='buy'){s.phase='live';s.message='REACH UPLINK A · HOLD E TO PLANT';}}
export function finish(s,win,reason){if(s.phase!=='live')return;s.phase='end';s.result=reason;s.money+=win?2200:1400;if(win)s.wins++;else s.losses++;s.message=win?'ROUND SECURED':'SIGNAL LOST';}
export function throwGrenade(s){const p=s.player;if(s.phase!=='live'||p.grenades===0||s.grenade)return false;p.grenades--;s.grenade={x:p.x,z:p.z,y:p.eye,vx:-Math.sin(p.yaw)*10,vz:-Math.cos(p.yaw)*10,vy:4,fuse:1.8};return true;}
function grenadeStep(s,dt){const g=s.grenade;if(!g)return;g.fuse-=dt;g.vy-=12*dt;g.y+=g.vy*dt;
  if(blocked(g.x+g.vx*dt,g.z,.12))g.vx*=-.45;else g.x+=g.vx*dt;
  if(blocked(g.x,g.z+g.vz*dt,.12))g.vz*=-.45;else g.z+=g.vz*dt;
  if(g.y<.15){g.y=.15;g.vy=Math.abs(g.vy)*.35;g.vx*=.94;g.vz*=.94;}
  if(g.fuse<=0){s.blast= .45;s.blastX=g.x;s.blastZ=g.z;s.noise=3;s.noiseX=g.x;s.noiseZ=g.z;
    for(const b of [...s.bots,s.player]){const d=Math.hypot(b.x-g.x,b.z-g.z);if(d<6&&visible(g,b,.3,1))damage(s,b,Math.round(120*(1-d/6)));}s.grenade=null;}}
export function step(s,input,dt=STEP,random=Math.random){if(s.phase!=='live')return;const p=s.player;s.time-=dt;s.noise=Math.max(0,s.noise-dt);s.blast=Math.max(0,s.blast-dt);s.tracer.life=Math.max(0,s.tracer.life-dt);p.hurt=Math.max(0,p.hurt-dt);
  p.crouch=!!input.crouch;p.eye+=( (p.crouch?1:1.6)-p.eye)*Math.min(1,dt*14);
  let fx=input.forward||0,sx=input.strafe||0,len=Math.hypot(fx,sx);if(len>1){fx/=len;sx/=len;}
  const speed=p.crouch?2:input.sprint?6.4:4.2,blend=Math.min(1,dt*11);
  p.vx+=((-Math.sin(p.yaw)*fx+Math.cos(p.yaw)*sx)*speed-p.vx)*blend;
  p.vz+=((-Math.cos(p.yaw)*fx-Math.sin(p.yaw)*sx)*speed-p.vz)*blend;
  if(p.hp>0)move(p,p.vx*dt,p.vz*dt);p.bloom=Math.max(0,p.bloom-dt*.035);tickWeapon(p,dt);
  if(input.reload)reload(p);if(input.fire&&!input.sprint&&!input.interact)fire(s,random);
  const near=Math.hypot(p.x-SITE.x,p.z-SITE.z)<SITE.radius;
  if(!s.planted&&near&&input.interact&&p.hp>0&&Math.hypot(p.vx,p.vz)<.4){s.plant+=dt;if(s.plant>=3){s.planted=true;s.money+=400;s.message='UPLINK ACTIVE · PREVENT DEFUSE';s.defuse=0;}}
  else s.plant=0;
  grenadeStep(s,dt);updateBots(s,dt,random);
  if(s.planted){s.charge-=dt;if(s.defuse>=5)finish(s,false,'Sentries severed the uplink');else if(s.charge<=0)finish(s,true,'Transmission complete');}
  if(s.phase!=='live')return;
  if(!s.bots.some(b=>b.hp>0))finish(s,true,'All sentries neutralized');
  else if(p.hp<=0&&!s.planted)finish(s,false,'Operator down');
  else if(s.time<=0&&!s.planted)finish(s,false,'Uplink window expired');
}
