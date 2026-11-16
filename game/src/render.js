import { WIDTH, HEIGHT } from './simulation.js';
const TAU = Math.PI * 2;
export function createRenderer(canvas) {
  const c = canvas.getContext('2d'); let scale = 1, ox = 0, oy = 0;
  function resize() {
    const dpr = Math.min(devicePixelRatio || 1, 2);
    canvas.width = Math.round(innerWidth * dpr); canvas.height = Math.round(innerHeight * dpr);
    scale = Math.min(canvas.width / WIDTH, canvas.height / HEIGHT);
    ox = (canvas.width - WIDTH * scale) / 2; oy = (canvas.height - HEIGHT * scale) / 2;
  }
  function line(points, color, width = 1) {
    c.beginPath(); points.forEach(([x,y],i) => i ? c.lineTo(x,y) : c.moveTo(x,y)); c.strokeStyle = color; c.lineWidth = width; c.stroke();
  }
  function circle(x,y,r,color,width=1) { c.beginPath(); c.arc(x,y,Math.max(.1,r),0,TAU); c.strokeStyle=color;c.lineWidth=width;c.stroke(); }
  function glow(x,y,r,color) { const g=c.createRadialGradient(x,y,0,x,y,r);g.addColorStop(0,color);g.addColorStop(1,'transparent');c.fillStyle=g;c.fillRect(x-r,y-r,r*2,r*2); }
  function label(t,x,y,color='#a5c9bf',size=10) { c.font=`${size}px Arial`;c.textAlign='center';c.fillStyle=color;c.fillText(t,x,y); }
  function relic(x,y,a=0) {
    glow(x,y,32,'#5ff5cd35'); c.save();c.translate(x,y);c.rotate(a);
    c.fillStyle='#c5ffe5';c.shadowColor='#64ffd1';c.shadowBlur=14;c.beginPath();c.moveTo(0,-10);c.lineTo(7,0);c.lineTo(0,11);c.lineTo(-7,0);c.closePath();c.fill();c.shadowBlur=0;
    line([[0,-6],[0,6]],'#268a80',1);c.restore();
  }
  function lighthouse(s,t) {
    const {x,y}=s.sanctuary;
    glow(x,y,125,'#d9b65e22');
    c.save();c.translate(x,y);
    c.save();c.rotate(t*.18-.9);
    const beam=c.createLinearGradient(0,0,370,0);beam.addColorStop(0,'#f2d79835');beam.addColorStop(1,'#f2d79800');c.fillStyle=beam;
    c.beginPath();c.moveTo(0,-5);c.lineTo(370,-100);c.lineTo(370,100);c.lineTo(0,5);c.fill();c.restore();
    circle(0,0,72,'#e4c97b70');circle(0,0,66,'#e4c97b20');
    for(let i=0;i<12;i++){const a=i*TAU/12;line([[Math.cos(a)*76,Math.sin(a)*76],[Math.cos(a)*81,Math.sin(a)*81]],'#d3bc7980');}
    c.fillStyle='#173e44';c.strokeStyle='#988b5e';c.lineWidth=2;c.beginPath();c.ellipse(0,13,35,24,0,0,TAU);c.fill();c.stroke();
    c.fillStyle='#a7bdb0';c.beginPath();c.moveTo(-13,10);c.lineTo(-8,-44);c.lineTo(8,-44);c.lineTo(13,10);c.closePath();c.fill();
    c.fillStyle='#173c42';c.fillRect(-4,-11,8,19);c.fillRect(-13,-49,26,10);
    c.fillStyle='#ffdd88';c.shadowColor='#f9cc67';c.shadowBlur=22;c.fillRect(-7,-46,14,9);c.shadowBlur=0;
    c.fillStyle='#bfb17c';c.beginPath();c.moveTo(-16,-51);c.lineTo(0,-63);c.lineTo(16,-51);c.fill();
    label('SANCTUARY',0,104,'#e0ca8c',11); label('DELIVER • REPAIR • SHELTER',0,119,'#8daba2',8);c.restore();
  }
  function skiff(s,t,quiet) {
    const p=s.player;
    for(let i=0;i<5;i++) { const d=18+i*12;const a=p.angle;circle(p.x-Math.cos(a)*d,p.y-Math.sin(a)*d,5+i*3,`rgba(101,217,192,${.15-i*.025})`); }
    glow(p.x,p.y,42,'#73ffe02e');
    if(s.tether) { line([[p.x,p.y],[s.tether.x,s.tether.y]],'#b2ffdc',2);circle(s.tether.x,s.tether.y,16,'#c1ffe3'); }
    c.save();c.translate(p.x,p.y);c.rotate(p.angle+Math.PI/2);
    c.globalAlpha=s.invulnerable>0 && !quiet ? .5+.5*Math.sin(t*25)**2 : 1;
    c.fillStyle='#d6ddba';c.strokeStyle='#5cd8c4';c.lineWidth=2;c.beginPath();c.moveTo(0,-22);c.bezierCurveTo(19,-8,17,17,0,22);c.bezierCurveTo(-17,17,-19,-8,0,-22);c.fill();c.stroke();
    c.fillStyle='#17484d';c.fillRect(-5,-5,10,18);c.fillStyle='#d9ffcd';c.shadowBlur=16;c.shadowColor='#b0ffe2';c.fillRect(-3,-12,6,7);c.restore();
    s.cargo.forEach((r,i)=>relic(p.x-Math.cos(p.angle)*(34+i*20),p.y-Math.sin(p.angle)*(34+i*20),t));
    circle(p.x,p.y,115,'#85d8c110');
  }
  function draw(s,quiet=false) {
    const t=quiet?0:s.time;
    c.setTransform(1,0,0,1,0,0);c.fillStyle='#06151f';c.fillRect(0,0,canvas.width,canvas.height);
    c.setTransform(scale,0,0,scale,ox,oy);
    const bg=c.createLinearGradient(0,0,WIDTH,HEIGHT);bg.addColorStop(0,'#09212e');bg.addColorStop(.5,'#0a3540');bg.addColorStop(1,'#061923');c.fillStyle=bg;c.fillRect(0,0,WIDTH,HEIGHT);
    // Bathymetric contours: a deterministic original chart, animated with small tidal offsets.
    for(let j=0;j<27;j++){
      const points=[];for(let x=0;x<=WIDTH;x+=16){const y=95+j*25+Math.sin(x*.006+j*.33+t*.13)*20+Math.sin(x*.015-j*.6)*6;points.push([x,y]);}
      line(points,j%4===0?'#76bdad17':'#72bba80a');
    }
    for(let i=0;i<85;i++){const x=(i*173.3+Math.sin(t*.12+i)*9)%WIDTH,y=130+(i*97.7)%560;c.fillStyle=i%7===0?'#e4d29a60':'#7bc7b82a';c.fillRect(x,y,i%7===0?2:1,1);}
    // Rocky outer shoals frame the navigable water.
    for(const [x,y,r] of [[40,210,75],[1130,570,105],[1030,165,46],[145,690,100]]){
      for(let k=3;k>0;k--)circle(x,y,r+k*13,'#4b9c8e13');
      c.beginPath();for(let i=0;i<10;i++){const a=i*TAU/10,rr=r*(.75+.2*Math.sin(i*8+x));const xx=x+Math.cos(a)*rr,yy=y+Math.sin(a)*rr*.6;i?c.lineTo(xx,yy):c.moveTo(xx,yy);}c.closePath();c.fillStyle='#081e28';c.fill();c.strokeStyle='#3b706c55';c.stroke();
    }
    c.save();c.translate(1070,270);circle(0,0,34,'#9eb9a12b');line([[-43,0],[43,0]],'#9eb9a12b');line([[0,-43],[0,43]],'#9eb9a12b');label('N',0,-49,'#a1b4a1',9);c.restore();
    lighthouse(s,t);
    for(const pulse of s.pulses){
      if(pulse.age<0){circle(pulse.x,pulse.y,48,'#f2917ba0',2);circle(pulse.x,pulse.y,48*(-pulse.age/1.6),'#f1b58b60');label('PULSE INCOMING',pulse.x,pulse.y-65,'#ffc4a0',10);}
      else{circle(pulse.x,pulse.y,pulse.radius,'#ee987a90',4);circle(pulse.x,pulse.y,pulse.radius+9,'#d79b7a25',7);}
    }
    for(const r of s.relics) { circle(r.x,r.y,18,'#70dec336');relic(r.x,r.y,quiet?0:Math.sin(t+r.phase)*.2); }
    skiff(s,t,quiet);
    if(s.mode==='title'){label('THE LIGHTHOUSE IS STILL WAITING',865,610,'#b9c7ae',11);line([[820,625],[910,625]],'#e3c88770');}
    const vignette=c.createRadialGradient(600,380,200,600,380,750);vignette.addColorStop(0,'transparent');vignette.addColorStop(1,'#020d1899');c.fillStyle=vignette;c.fillRect(0,0,WIDTH,HEIGHT);
  }
  resize();window.addEventListener('resize',resize);return { draw };
}
