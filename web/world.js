(function(root){
'use strict';
const W=21,H=15,START={x:10,y:12,facing:'down'};
const BIOMES=[{name:'BOSQUE ESPORA',ground:'#86ad77',path:'#d8c79b',grass:'#55865f',tree:'#3d7255',dark:'#2b594a',water:'#6eb2b8'}, {name:'CALDERA ÁMBAR',ground:'#b39a77',path:'#dcc195',grass:'#9b6c57',tree:'#786054',dark:'#544940',water:'#b96655'}, {name:'LAGUNA NÁCAR',ground:'#8eb7a1',path:'#dfd4a7',grass:'#5b9685',tree:'#477b6c',dark:'#365f5a',water:'#69a8bd'}];
function tile(zone,x,y){if(x<0||x>=W||y<0||y>=H)return 'wall';if(x===0||y===0||x===W-1||y===H-1)return 'wall';if(x===10||y===10||(x>=8&&x<=12&&y>=9&&y<=13))return 'path';if((x===3&&y>=2&&y<=5)||(x===16&&y>=3&&y<=6))return 'water';if((x*11+y*7+zone*3)%19===0)return 'tree';if((x>=3&&x<=8&&y>=3&&y<=8)||(x>=12&&x<=18&&y>=4&&y<=8)||(x>=2&&x<=7&&y>=11&&y<=13)||(x>=13&&x<=18&&y>=11&&y<=13))return 'grass';return 'ground';}
function canWalk(zone,x,y){return !['wall','tree','water'].includes(tile(zone,x,y));}
function validPosition(zone,p){return !!p&&Number.isInteger(p.x)&&Number.isInteger(p.y)&&['up','down','left','right'].includes(p.facing)&&canWalk(zone,p.x,p.y);}
function draw(canvas,zone,p,steps){if(!canvas)return;canvas.width=W*16;canvas.height=H*16;const c=canvas.getContext('2d');c.imageSmoothingEnabled=false;const b=BIOMES[zone];function R(x,y,w,h,col){c.fillStyle=col;c.fillRect(x,y,w,h);}function oval(x,y,rx,ry,col){c.beginPath();c.ellipse(x,y,rx,ry,0,0,Math.PI*2);c.fillStyle=col;c.fill();}
 for(let y=0;y<H;y++)for(let x=0;x<W;x++){const px=x*16,py=y*16,t=tile(zone,x,y),n=(x*17+y*29+zone*31)%7;R(px,py,16,16,t==='path'?b.path:b.ground);if(t==='path'){R(px+2+n,py+3,2,1,'#ae9d77');R(px+11,py+12-n,2,1,'#f1e0b6');}else{R(px+2+n,py+4,2,1,'#ffffff22');R(px+11,py+10,2,1,'#385b4a22');}if(t==='water'){R(px,py,16,16,b.water);R(px+2,py+4,8,1,'#d1f0df88');R(px+8,py+11,6,1,'#d1f0df88');}if(t==='grass'){R(px+1,py+8,14,6,b.grass);for(let i=0;i<3;i++){let gx=px+2+i*5;R(gx,py+5+(i%2)*2,2,6,b.grass);R(gx+1,py+4+(i%2)*2,2,2,b.tree);}if(n===0)R(px+9,py+6,2,2,'#e9d38b');}if(t==='wall'||t==='tree'){if(zone===1){R(px+2,py+7,12,8,b.dark);R(px+3,py+3,10,9,b.tree);R(px+5,py+1,6,4,'#b69470');R(px+5,py+6,3,2,'#ddaa78');}else{R(px+6,py+9,4,6,'#6c5845');R(px+1,py+4,14,9,b.dark);R(px+2,py+2,12,9,b.tree);R(px+5,py,7,5,b.tree);R(px+4,py+3,4,2,'#a1c98088');}}}
 // A small camp marks the safe starting area.
 R(9*16+2,11*16+8,11,4,'#6d5548');R(9*16+4,11*16+5,7,4,'#ddbd8a');R(9*16+6,11*16+3,3,3,'#ffbd73');
 const px=p.x*16,py=p.y*16,walk=steps%2;oval(px+8,py+14,6,2,'#233f3c66');
 // Chibi explorer: oversized head, hat, backpack and animated feet.
 c.save();c.translate(px+8,py+15);c.scale(1.25,1.25);c.translate(-px-8,-py-15);
 R(px+4+walk,py+12,3,3,'#293c4b');R(px+9-walk,py+12,3,3,'#293c4b');R(px+3,py+7,10,6,'#365e6d');R(px+1,py+8,3,4,'#cfaa76');R(px+12,py+8,3,4,'#cfaa76');R(px+4,py+7,2,5,'#dfc08b');R(px+5,py+1,7,7,'#4c3838');R(px+4,py+2,9,6,'#efc7a1');R(px+4,py+1,9,2,'#824a4a');R(px+3,py,11,2,'#d76d5e');R(px+5,py-1,7,2,'#e78c78');
 if(p.facing==='down'){R(px+6,py+4,1,1,'#24353b');R(px+10,py+4,1,1,'#24353b');R(px+7,py+6,3,1,'#b76f65');}else if(p.facing==='up'){R(px+5,py+3,7,4,'#604844');R(px+6,py+9,5,3,'#c98a64');}else{let ex=p.facing==='left'?5:11;R(px+ex,py+4,1,1,'#24353b');R(px+(p.facing==='left'?11:4),py+3,2,4,'#604844');}
 c.restore();
}
root.World={W,H,START,BIOMES,tile,canWalk,validPosition,draw};if(typeof module!=='undefined')module.exports=root.World;
})(typeof window==='undefined'?globalThis:window);
