// One authoritative arena description, shared by collision, navigation and rendering.
export const SITE = { x: 7, z: -10, radius: 2.5 };
export const BOXES = [
  [-15,0,1,32,5], [15,0,1,32,5], [0,16,31,1,4], [0,-16,31,1,5],
  [-6,3,6,1,3.8], [-8,-4,2,13,4.8], [-3,-8,8,2,4.8],
  [4,3,2,9,3.8], [7,-3,8,1,3.6],
  [-3,8,3,1.4,1.15], [9,7,3,2,1.2], [-12,5,2,3,1.1],
  [-2,-1,2.5,2,1.1], [1,-11,2,3,1.2], [11,-8,1.6,3,1.5]
].map(([x,z,w,d,h]) => ({x,z,w,d,h}));
export function blocked(x,z,r=.34) {
  for (const b of BOXES) if (x+r>b.x-b.w/2 && x-r<b.x+b.w/2 && z+r>b.z-b.d/2 && z-r<b.z+b.d/2) return true;
  return false;
}
export function move(body,dx,dz,r=.34) {
  if (!blocked(body.x+dx,body.z,r)) body.x+=dx;
  if (!blocked(body.x,body.z+dz,r)) body.z+=dz;
}
// Slab ray/AABB intersection, including finite height so crouching hides below low cover.
export function rayBox(ox,oy,oz,dx,dy,dz,x,y,z,w,h,d) {
  let near=0,far=100;
  for (let axis=0;axis<3;axis++) {
    const o=axis===0?ox:axis===1?oy:oz, v=axis===0?dx:axis===1?dy:dz;
    const c=axis===0?x:axis===1?y:z, half=(axis===0?w:axis===1?h:d)/2;
    if (Math.abs(v)<1e-8) {if(o<c-half||o>c+half)return Infinity;continue;}
    let a=(c-half-o)/v,b=(c+half-o)/v;
    if(a>b){const t=a;a=b;b=t;} near=Math.max(near,a);far=Math.min(far,b);
    if(near>far)return Infinity;
  }
  return far>=0?near:Infinity;
}
export function wallDistance(ox,oy,oz,dx,dy,dz) {
  let best=100;
  for(const b of BOXES)best=Math.min(best,rayBox(ox,oy,oz,dx,dy,dz,b.x,b.h/2,b.z,b.w,b.h,b.d));
  return best;
}
export function visible(a,b,eye=1.5,targetEye=1.2) {
  const dx=b.x-a.x,dy=targetEye-eye,dz=b.z-a.z,d=Math.hypot(dx,dy,dz);
  return wallDistance(a.x,eye,a.z,dx/d,dy/d,dz/d)>d-.3;
}
// A static one metre walk grid. Search storage is reused, not allocated each AI tick.
const N=29, CELLS=N*N, walk=new Uint8Array(CELLS), parent=new Int16Array(CELLS), queue=new Int16Array(CELLS);
for(let z=0;z<N;z++)for(let x=0;x<N;x++)walk[z*N+x]=!blocked(x-14,z-14,.42);
const cell=(p)=>Math.max(0,Math.min(N-1,Math.round(p.z+14)))*N+Math.max(0,Math.min(N-1,Math.round(p.x+14)));
export function nextWaypoint(a,b,out) {
  const start=cell(a),goal=cell(b);parent.fill(-1);parent[start]=start;queue[0]=start;let head=0,tail=1,found=start;
  while(head<tail){const c=queue[head++];if(c===goal){found=c;break;}
    for(const step of [-N,N,-1,1]){const n=c+step;if(n<0||n>=CELLS||Math.abs(n%N-c%N)>1||!walk[n]||parent[n]!==-1)continue;parent[n]=c;queue[tail++]=n;}
  }
  while(parent[found]!==start&&found!==start)found=parent[found];
  out.x=found%N-14;out.z=Math.floor(found/N)-14;
}
export const ROUTES = [ [{x:7,z:-10},{x:11,z:-5},{x:12,z:2},{x:9,z:11}], [{x:-11,z:-11},{x:-12,z:-2},{x:-12,z:10},{x:-6,z:12}], [{x:0,z:-5},{x:1,z:0},{x:0,z:6},{x:0,z:11}] ];
