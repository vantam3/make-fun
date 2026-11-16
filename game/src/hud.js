import {BOXES,SITE,visible} from './map.js';
import {WEAPONS} from './combat.js';
const el=id=>document.getElementById(id),text=(id,value)=>{el(id).textContent=value;};
export function updateHUD(s,locked){const p=s.player;
  for(const [id,show] of [['overlay',s.phase==='title'],['buy',s.phase==='buy'],['pause',s.phase==='live'&&!locked],['end',s.phase==='end']])el(id).hidden=!show;
  text('score',`BREACH ${String(s.wins).padStart(2,'0')} : ${String(s.losses).padStart(2,'0')} SENTRY`);
  text('phase',s.planted?'TRANSMITTING':s.phase==='live'?'BREACH IN PROGRESS':s.phase.toUpperCase());text('round',`ROUND ${String(s.round).padStart(2,'0')}`);
  const t=Math.max(0,Math.ceil(s.planted?s.charge:s.time));text('clock',`${String(Math.floor(t/60)).padStart(2,'0')}:${String(t%60).padStart(2,'0')}`);
  text('health',Math.ceil(p.hp));text('armor',`${p.armor||0} ARMOR`);text('weapon',WEAPONS[p.weapon].name);text('ammo',`${p.mag} / ${p.reserve}`);text('equipment',`${p.grenades} FRAG · ${s.bots.filter(b=>b.hp>0).length} SENTRIES`);text('notice',p.reload?'RELOADING':p.hp<=0&&s.planted?'OPERATOR DOWN · UPLINK STILL ACTIVE':s.message);
  el('hit').style.opacity=p.hit>0?1:0;el('shade').style.backgroundColor=p.hurt>0?'#d4474733':'transparent';el('crosshair').style.fontSize=`${25+p.bloom*500+Math.hypot(p.vx,p.vz)*2}px`;
  el('progress').firstElementChild.style.width=`${Math.min(100,(s.planted?s.defuse/5:s.plant/3)*100)}%`;text('objective-copy',s.planted?`Protect signal · defuse ${s.defuse.toFixed(1)} / 5s`:'Eastern yard · stop and hold E for 3s');
  el('stance').firstChild.textContent=p.crouch?'CROUCHED / PRECISE ':'STANDING ';text('money',s.money.toLocaleString());text('buy-round',s.round);
  for(const b of document.querySelectorAll('[data-buy]')){const id=b.dataset.buy;b.classList.toggle('selected',id===p.weapon);b.disabled=id==='armor'?!!p.armor||s.money<500:id==='grenade'?p.grenades>=2||s.money<300:id===p.weapon||s.money<WEAPONS[id].cost;}
  const match=s.wins>=4||s.losses>=4;text('end-label',match?'OPERATION COMPLETE':'ROUND COMPLETE');text('end-title',s.message);text('end-reason',s.result);text('end-score',`${s.wins} : ${s.losses}`);text('end-reward',`Supply balance ${s.money} · ${s.kills} sentries neutralized`);text('next',match?'NEW OPERATION ↗':'NEXT ROUND ↗');
  const c=el('map').getContext('2d');c.clearRect(0,0,180,180);c.save();c.translate(90,90);c.scale(5,5);c.fillStyle='#738b88';for(const b of BOXES)c.fillRect(b.x-b.w/2,b.z-b.d/2,b.w,b.d);c.strokeStyle='#ffb747';c.lineWidth=.2;c.strokeRect(SITE.x-2,SITE.z-2,4,4);
  for(const b of s.bots)if(b.hp>0&&visible(p,b,p.eye,1.6)){c.fillStyle='#ffb747';c.beginPath();c.arc(b.x,b.z,.5,0,7);c.fill();}
  c.translate(p.x,p.z);c.rotate(-p.yaw);c.fillStyle='#e4f6e9';c.beginPath();c.moveTo(0,-1);c.lineTo(-.6,.6);c.lineTo(.6,.6);c.fill();c.restore();
}
