const assert=require('node:assert/strict'),W=require('../web/world.js');
for(let zone=0;zone<3;zone++){
 assert(W.validPosition(zone,W.START));assert(!W.canWalk(zone,0,0));assert(!W.canWalk(zone,-1,3));assert.equal(W.tile(zone,10,10),'path');
 const q=[[W.START.x,W.START.y]],seen=new Set([q[0].join(',')]);for(let i=0;i<q.length;i++){const [x,y]=q[i];for(const [dx,dy] of [[1,0],[-1,0],[0,1],[0,-1]]){const nx=x+dx,ny=y+dy,k=nx+','+ny;if(!seen.has(k)&&W.canWalk(zone,nx,ny)){seen.add(k);q.push([nx,ny]);}}}
 let grass=0;for(let y=0;y<W.H;y++)for(let x=0;x<W.W;x++)if(W.tile(zone,x,y)==='grass'){grass++;assert(seen.has(x+','+y),'hierba inaccesible');}assert(grass>30);
}
console.log('PASS: límites, obstáculos y acceso a toda la hierba de los tres biomas.');
