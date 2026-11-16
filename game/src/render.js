import * as T from 'three';
import {BOXES,SITE} from './map.js';
export function createRenderer(host){
  const renderer=new T.WebGLRenderer({antialias:true});renderer.setPixelRatio(Math.min(devicePixelRatio,1.75));host.append(renderer.domElement);
  renderer.shadowMap.enabled=true;renderer.shadowMap.type=T.PCFSoftShadowMap;renderer.outputColorSpace=T.SRGBColorSpace;renderer.toneMapping=T.ACESFilmicToneMapping;
  const scene=new T.Scene();scene.background=new T.Color('#143c45');scene.fog=new T.Fog('#143c45',25,85);
  const camera=new T.PerspectiveCamera(76,1,.06,160);camera.rotation.order='YXZ';scene.add(camera);
  const mat=(color,metalness=0)=>new T.MeshStandardMaterial({color,roughness:.78,metalness});
  const concrete=mat('#c5c9b7'),dark=mat('#29454a'),steel=mat('#52686a',.5),amber=new T.MeshStandardMaterial({color:'#ffb747',emissive:'#ff9b24',emissiveIntensity:2});
  function box(w,h,d,x,y,z,m=concrete,parent=scene){const o=new T.Mesh(new T.BoxGeometry(w,h,d),m);o.position.set(x,y,z);o.castShadow=true;o.receiveShadow=true;parent.add(o);return o;}
  box(160,.4,160,0,-.25,0,dark);box(30,.12,32,0,-.05,0,concrete);
  for(const b of BOXES){box(b.w,b.h,b.d,b.x,b.h/2,b.z,b.h<2?steel:concrete);
    if(b.h>3){box(b.w+.02,.15,b.d+.02,b.x,.35,b.z,dark);box(b.w+.04,.12,b.d+.04,b.x,b.h-.3,b.z,dark);}
    else {box(b.w+.03,.08,b.d+.03,b.x,b.h-.15,b.z,amber);}}
  // Expansion joints, drainage channels and lane markings give the bare yard a human scale.
  for(let n=-14;n<=14;n+=2)box(29,.012,.015,0,.025,n,steel);
  for(const x of [-10,6])for(let z=-13;z<14;z+=3)box(.1,.018,1.3,x,.035,z,amber);
  for(const [x,z] of [[-14,-12],[14,-12],[-14,12],[14,12]]){box(.22,6,.22,x,3,z,steel);box(.8,.15,.45,x,5.8,z,amber);const l=new T.PointLight('#ffb747',18,12,2);l.position.set(x,5,z);scene.add(l);}
  // The station's signature radar is decorative, beyond the playable perimeter.
  box(5,10,5,-6,5,-22,concrete);box(6,.4,6,-6,10,-22,dark);
  const dish=new T.Group();dish.position.set(-6,12,-22);dish.rotation.x=.45;scene.add(dish);
  const bowl=new T.Mesh(new T.SphereGeometry(4,24,12,0,Math.PI*2,0,Math.PI/2),new T.MeshStandardMaterial({color:'#a5bdb8',side:T.DoubleSide,wireframe:true}));dish.add(bowl);
  const rim=new T.Mesh(new T.TorusGeometry(4,.09,8,48),steel);rim.rotation.x=Math.PI/2;dish.add(rim);box(.13,5,.13,0,1,0,amber,dish);
  const terminal=new T.Group();terminal.position.set(SITE.x,0,SITE.z);scene.add(terminal);box(1.1,1.1,.65,0,.55,0,dark,terminal);const screen=box(.8,.4,.03,0,.86,.34,amber,terminal);
  const ring=new T.Mesh(new T.RingGeometry(2.25,2.35,64),new T.MeshBasicMaterial({color:'#ffb747',side:T.DoubleSide}));ring.rotation.x=-Math.PI/2;ring.position.set(SITE.x,.04,SITE.z);scene.add(ring);
  const sun=new T.DirectionalLight('#fff0cc',3);sun.position.set(-10,25,12);sun.castShadow=true;sun.shadow.mapSize.set(2048,2048);Object.assign(sun.shadow.camera,{left:-24,right:24,top:24,bottom:-24,far:70});sun.shadow.bias=-.0006;scene.add(sun,new T.HemisphereLight('#a9d7db','#465955',2));
  const bots=[];
  for(let i=0;i<3;i++){const g=new T.Group();scene.add(g);box(.57,.8,.4,0,1,0,dark,g);box(.38,.38,.38,0,1.6,0,steel,g);box(.3,.07,.04,0,1.6,-.21,amber,g);for(const x of [-.18,.18]){box(.19,.6,.23,x,.3,0,dark,g);box(.17,.65,.2,x*2,1.05,0,steel,g);}box(.12,.15,.75,.25,1.2,-.4,dark,g);bots.push(g);}
  const gun=new T.Group();camera.add(gun);box(.14,.17,.46,0,0,0,dark,gun);box(.06,.06,.4,0,.02,-.35,steel,gun);box(.09,.22,.12,0,-.17,.03,steel,gun);box(.07,.06,.09,0,.11,-.05,amber,gun);box(.16,.13,.25,0,-.03,.3,dark,gun);
  const flash=new T.Mesh(new T.ConeGeometry(.11,.3,6),new T.MeshBasicMaterial({color:'#ffe6a2'}));flash.rotation.x=-Math.PI/2;flash.position.z=-.67;gun.add(flash);
  const grenade=new T.Mesh(new T.SphereGeometry(.14,8,8),steel);scene.add(grenade);
  const blast=new T.Mesh(new T.SphereGeometry(1,16,12),new T.MeshBasicMaterial({color:'#ffb747',transparent:true,opacity:.25,wireframe:true}));scene.add(blast);
  const tracerGeometry=new T.BufferGeometry().setFromPoints([new T.Vector3(),new T.Vector3()]);const tracer=new T.Line(tracerGeometry,new T.LineBasicMaterial({color:'#ffe1a2'}));scene.add(tracer);
  function resize(){renderer.setSize(innerWidth,innerHeight);camera.aspect=innerWidth/innerHeight;camera.updateProjectionMatrix();}addEventListener('resize',resize);resize();
  return {canvas:renderer.domElement,draw(s,time){const p=s.player,title=s.phase==='title';
    if(title){camera.position.set(12,7,13);camera.lookAt(0,1,-6);}else {camera.position.set(p.x,p.eye,p.z);camera.rotation.set(p.pitch,p.yaw,0);}
    gun.visible=!title;gun.position.set(.26,-.25-Math.sin(p.reload*4)*.12,-.48+p.flash*.8);gun.rotation.set(p.reload?-.5:0,0,p.reload?-.3:0);gun.scale.z=p.weapon==='tide'?1.3:1;flash.visible=p.flash>0;
    for(let i=0;i<bots.length;i++){const b=s.bots[i],g=bots[i];g.position.set(b.x,0,b.z);g.rotation.set(b.hp>0?0:-Math.PI/2,b.yaw,0);if(b.hp>0&&b.state!=='HOLD')g.position.y=Math.sin(time*9+i)*.025;}
    screen.visible=!s.planted||Math.sin(time*12)>0;ring.material.color.set(s.planted?'#74e3d0':'#ffb747');
    grenade.visible=!!s.grenade;if(s.grenade)grenade.position.set(s.grenade.x,s.grenade.y,s.grenade.z);
    blast.visible=s.blast>0;if(s.blast>0){blast.position.set(s.blastX,.5,s.blastZ);blast.scale.setScalar((.5-s.blast)*12);}
    tracer.visible=s.tracer.life>0;const a=tracerGeometry.attributes.position;a.setXYZ(0,p.x,p.eye-.1,p.z);a.setXYZ(1,s.tracer.x,s.tracer.y,s.tracer.z);a.needsUpdate=true;
    renderer.render(scene,camera);
  }};
}
