import { STAGES } from './simulation.js';
export function createUI(action) {
  const $=id=>document.getElementById(id); let previous='';
  $('primary').onclick=()=>action('confirm');$('pause').onclick=()=>action('pause');$('mute').onclick=()=>action('mute');
  const motion=$('motion');motion.checked=matchMedia('(prefers-reduced-motion: reduce)').matches;
  function update(s) {
    const playing=s.mode==='play';$('hud').hidden=s.mode==='title';$('panel').hidden=playing;
    $('pause').hidden=['title','won','lost'].includes(s.mode);
    $('pause').textContent=s.mode==='paused'?'▶ Resume':'Ⅱ Pause';
    const notice=playing && s.noticeTime>0?s.notice:'';
    if($('notice').textContent!==notice) $('notice').textContent=notice;
    $('stage-label').textContent=`0${Math.min(3,s.stage+1)} / ${STAGES[Math.min(2,s.stage)].toUpperCase()}`;
    $('objective').textContent=s.mode==='won'?'All lanterns restored':`Recover ${s.stage+3} lights · ${s.delivered} delivered`;
    $('progress').innerHTML=Array.from({length:Math.min(5,s.stage+3)},(_,i)=>`<i class="${i<s.delivered?'on':''}"></i>`).join('');
    $('hull').textContent='◆'.repeat(Math.max(0,s.health))+'◇'.repeat(5-Math.max(0,s.health));
    $('cargo').textContent=`${s.cargo.length} / 3`;$('score').textContent=String(s.score).padStart(5,'0')+(s.combo>1?` ×${s.combo}`:'');
    const secs=Math.max(0,Math.ceil(s.remaining));$('clock').textContent=`${Math.floor(secs/60)}:${String(secs%60).padStart(2,'0')}`;
    if(s.mode!==previous){
      previous=s.mode;
      if(s.mode==='paused') { $('eyebrow').textContent='THE CURRENT CAN WAIT';$('title').textContent='At anchor';$('subtitle').textContent='Your expedition is paused.';$('primary').firstChild.textContent='Resume expedition '; }
      if(s.mode==='won'||s.mode==='lost') {
        $('eyebrow').textContent=s.mode==='won'?'ALL THREE LANTERNS RESTORED':'EXPEDITION ENDED';
        $('title').textContent=s.mode==='won'?'Dawn returns':'Lost at sea';
        $('subtitle').textContent=s.notice;
        $('summary').textContent=`${s.score.toLocaleString()} light score · ${s.total} relics saved · ${Math.floor(s.time)}s at sea`;
        $('primary').firstChild.textContent='Sail again ';
      }
      if(s.mode!=='title') { $('tutorial').hidden=true;$('menu-hint').textContent=s.mode==='paused'?'P / ESC TO RESUME':'ENTER TO SAIL AGAIN'; }
    }
  }
  return { update, quiet:()=>motion.checked, mute(value){$('mute').textContent=value?'♪ Muted':'♪ Sound on';$('mute').setAttribute('aria-pressed',String(value));} };
}
