// SPDX-License-Identifier: MIT
// THE SKY IS ONLY PAPER — an original procedural paper sculpture.
import { mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { deflateSync } from 'node:zlib';
const W=960, S=2, N=W*S;
const pixels=new Uint8Array(N*N*3);
const rgb=(hex)=>hex.match(/\w\w/g).map(v=>parseInt(v,16));
function poly(points, color, alpha=1){
 const c=typeof color==='string'?rgb(color):color;
 const p=points.map(([x,y])=>[x*S,y*S]);
 const lo=Math.max(0,Math.floor(Math.min(...p.map(v=>v[1]))));
 const hi=Math.min(N-1,Math.ceil(Math.max(...p.map(v=>v[1]))));
 for(let y=lo;y<=hi;y++){
  const xs=[];for(let j=0,k=p.length-1;j<p.length;k=j++){
   const a=p[k],b=p[j];if((a[1]>y+.5)!==(b[1]>y+.5))xs.push(a[0]+(y+.5-a[1])*(b[0]-a[0])/(b[1]-a[1]));
  }xs.sort((a,b)=>a-b);
  for(let j=0;j<xs.length;j+=2)for(let x=Math.max(0,Math.ceil(xs[j]-.5));x<Math.min(N,xs[j+1]-.5);x++){
   const i=(y*N+x)*3;for(let k=0;k<3;k++)pixels[i+k]=pixels[i+k]*(1-alpha)+c[k]*alpha;
  }
 }
}
function line(a,b,width,color,alpha=1){const dx=b[0]-a[0],dy=b[1]-a[1],l=Math.hypot(dx,dy),x=-dy/l*width/2,y=dx/l*width/2;poly([[a[0]+x,a[1]+y],[b[0]+x,b[1]+y],[b[0]-x,b[1]-y],[a[0]-x,a[1]-y]],color,alpha);}
function circle(x,y,r,c,alpha=1){poly(Array.from({length:64},(_,i)=>[x+r*Math.cos(i*Math.PI/32),y+r*Math.sin(i*Math.PI/32)]),c,alpha);}
// Quiet ink field, with reflected light concentrated behind the breach.
for(let y=0;y<N;y++)for(let x=0;x<N;x++){
 const d=Math.exp(-(((x/S-520)/370)**2+((y/S-520)/420)**2));
 const i=(y*N+x)*3;pixels[i]=3+3*d;pixels[i+1]=5+10*d;pixels[i+2]=14+20*d;
}
const tear=[[153,842],[193,722],[170,664],[259,609],[244,530],[334,477],[333,394],[424,366],[438,291],[533,274],[569,208],[667,203],[728,126],[756,211],[830,243],[788,334],[822,404],[748,471],[759,548],[669,588],[657,669],[543,681],[504,756],[393,746],[342,816],[250,796]];
// A restrained atmospheric halo, then the hard aperture.
for(let k=18;k>0;k--)poly(tear.map(([x,y])=>[520+(x-520)*(1+k*.004),490+(y-490)*(1+k*.004)]),'07899b',.017);
poly(tear,'073d68');
poly([[153,842],[334,477],[569,208],[728,126],[655,423],[504,756]],'086579');
poly([[334,477],[438,291],[667,203],[655,423],[393,746]],'087c8c');
poly([[728,126],[830,243],[748,471],[657,669],[504,756],[655,423]],'162e91');
poly([[748,471],[657,669],[543,681],[504,756],[588,510]],'224dc0');
// Folded flaps expose blue undersides against the unbroken black sheet.
poly([[193,722],[170,664],[259,609],[224,686]],'21cfcc');
poly([[170,664],[224,686],[151,745]],'0c1622');
poly([[333,394],[424,366],[438,291],[384,378]],'56e4d4');
poly([[333,394],[384,378],[351,459]],'101a27');
poly([[788,334],[822,404],[748,471],[782,399]],'44dadb');
poly([[822,404],[782,399],[836,360]],'10182a');
poly([[543,681],[504,756],[393,746],[494,716]],'64dfdc');
poly([[504,756],[494,716],[554,776]],'0b1624');
// Long orbital arcs, partially occluded by the sculpture.
for(let t=0;t<2;t++){
 let last=null;for(let i=0;i<=180;i++){
  const a=(i/180*1.48+.08)*Math.PI,x=492+Math.cos(a)*365,y=495+Math.sin(a)*190;
  const q=[x+(y-495)*.58,y];if(last)line(last,q,t? .6:1.1,t?'1e6f94':'38aab1',.65);last=q;
 }
}
// Light spills from the paper creature onto the cold aperture behind it.
const lightShape=[[293,719],[351,569],[467,440],[652,263],[763,242],[805,307],[753,391],[579,540],[398,722]];
for(let k=24;k>0;k--)poly(lightShape.map(([x,y])=>[550+(x-550)*(1+k*.003),480+(y-480)*(1+k*.003)]),'ffb631',.009);
// Black fractures identify the surrounding blue as an opened sheet.
poly([[438,291],[475,252],[458,324],[424,366]],'070e1a');
poly([[657,669],[705,705],[679,620]],'070e1a');
poly([[259,609],[287,549],[244,530],[267,575]],'070e1a');
// The forked tail: large, dark cut-paper blades edged in molten gold.
poly([[342,660],[166,563],[183,711],[115,826],[279,786],[383,702]],'080f20');
poly([[342,660],[166,563],[236,695]],'ffb329');
poly([[166,563],[183,711],[236,695]],'8f4817');
poly([[236,695],[115,826],[279,786],[383,702]],'e78514');
poly([[236,695],[279,786],[383,702]],'ffd25c');
poly([[115,826],[249,749],[279,786]],'ffd873');
// Enormous dorsal sail and ventral fin; deliberate negative spaces.
poly([[389,579],[306,335],[469,399],[545,426],[487,561]],'090d19');
poly([[306,335],[469,399],[451,455]],'ffd268');
poly([[306,335],[451,455],[389,579]],'aa5819');
poly([[451,455],[469,399],[545,426],[487,561]],'f39317');
poly([[491,574],[647,716],[638,536],[589,470]],'080e1b');
poly([[491,574],[647,716],[575,560]],'e99118');
poly([[575,560],[647,716],[638,536]],'ffcd4a');
// Curved body assembled from a coherent low-poly fold network.
const A=[329,697],B=[357,584],C=[442,483],D=[549,367],E=[675,260],F=[762,249],G=[798,304],H=[758,382],I=[659,447],J=[567,531],K=[457,632],L=[383,711],M=[485,538],O=[620,381],P=[713,313];
poly([A,B,C,D,E,F,G,H,I,J,K,L],'ffb124');
for(const [ps,col] of [ [[A,B,M,L],'b25a12'],[[B,C,M],'ffcb43'],[[C,D,O,M],'fff19d'],[[D,E,P,O],'ffe386'],[[E,F,P],'fff9c6'],[[F,G,P],'ffd54b'],[[G,H,P],'c56a10'],[[P,H,I,O],'f9a318'],[[O,I,J,M],'df780c'],[[M,J,K,L],'ffbd2d'],[[L,K,A],'f9dc78'],[[C,O,M],'ffd351']])poly(ps,col);
// Pectoral fin sweeps out like a folded knife.
poly([[605,419],[771,472],[691,518],[554,476]],'070e1a');
poly([[605,419],[771,472],[626,465]],'fff1a1');
poly([[626,465],[771,472],[691,518],[554,476]],'f39113');
poly([[626,465],[691,518],[554,476]],'ac4c12');
// Fold seams are selective, leaving broad luminous uninterrupted planes.
for(const [a,b] of [[A,M],[C,O],[D,O],[O,P],[P,F],[M,J]])line(a,b,1.3,'fff5bf',.65);
// Brilliant thin creases catch the light along the rising spine.
line(C,D,3.2,'fff5c6',.92);line(D,E,3.2,'fff7cd',.95);
line(E,F,2.4,'fffbe3');line([166,563],[342,660],1.6,'ffeab0');
line([306,335],[469,399],2,'ffeda6');
// Recognizable koi face: ink eye, highlight, folded cheek and mouth.
poly([[732,286],[753,298],[733,312],[717,302]],'a95a13');
circle(739,297,8,'071525');circle(741,294,2.4,'fff6ce');
line([778,321],[755,329],3,'743a12');
line([777,323],[808,341],1.8,'ffe2a0');
line([808,341],[828,334],1.4,'ffe2a0');
line([765,337],[784,365],1.6,'ffc95a');
// A few scale cues: orbiting black paper shards with luminous cut edges.
const shards=[[[[825,163],[866,132],[854,188]],'26ded9'],[[[213,449],[239,425],[246,466]],'1688b6'],[[[750,647],[793,620],[781,674]],'57ded9'],[[[328,864],[362,841],[374,862]],'ecb44b'],[[[113,528],[131,519],[128,545]],'33b8b6'],[[[618,144],[638,128],[642,154]],'ffda7b']];
for(const [p,c] of shards){poly(p,c);const [a,b,d]=p;poly([b,d,[(a[0]+b[0]+d[0])/3,(a[1]+b[1]+d[1])/3]],'101a2c');}
for(const [x,y,r] of [[843,510,2],[282,292,1.5],[668,802,2],[476,169,1.4],[151,354,1],[852,735,1.4],[401,824,1]])circle(x,y,r,'92c9d5');
// Resolve supersampling, then encode a complete RGB PNG with CRC-checked chunks.
const raw=Buffer.alloc(W*(1+W*3));
for(let y=0;y<W;y++)for(let x=0;x<W;x++)for(let c=0;c<3;c++){
 let v=0;for(let dy=0;dy<S;dy++)for(let dx=0;dx<S;dx++)v+=pixels[(((y*S+dy)*N+x*S+dx)*3)+c];raw[y*(1+W*3)+1+x*3+c]=Math.round(v/(S*S));
}
function crc32(b){let n=0xffffffff;for(const v of b){n^=v;for(let k=0;k<8;k++)n=(n>>>1)^((n&1)?0xedb88320:0);}return (n^0xffffffff)>>>0;}
function chunk(type,data){const t=Buffer.from(type),b=Buffer.alloc(data.length+12);b.writeUInt32BE(data.length);t.copy(b,4);data.copy(b,8);b.writeUInt32BE(crc32(Buffer.concat([t,data])),b.length-4);return b;}
const header=Buffer.alloc(13);header.writeUInt32BE(W,0);header.writeUInt32BE(W,4);header[8]=8;header[9]=2;
const png=Buffer.concat([Buffer.from([137,80,78,71,13,10,26,10]),chunk('IHDR',header),chunk('IDAT',deflateSync(raw,{level:9})),chunk('IEND',Buffer.alloc(0))]);
const out=process.env.MAKEFUN_OUTPUT_DIR||'/output';mkdirSync(out,{recursive:true});writeFileSync(join(out,'entry.png'),png);
console.log(`Wrote ${W}x${W} entry.png (${png.length} bytes)`);
