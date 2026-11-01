(function(root){
'use strict';
const W=61,H=45,START={x:10,y:12,facing:'down'};
const BIOMES=[{name:'BOSQUE ESPORA',ground:'#86ad77',path:'#d8c79b',grass:'#55865f',tree:'#3d7255',dark:'#2b594a',water:'#6eb2b8'}, {name:'CALDERA ÁMBAR',ground:'#b39a77',path:'#dcc195',grass:'#9b6c57',tree:'#786054',dark:'#544940',water:'#b96655'}, {name:'LAGUNA NÁCAR',ground:'#8eb7a1',path:'#dfd4a7',grass:'#5b9685',tree:'#477b6c',dark:'#365f5a',water:'#69a8bd'},{name:'CIUDADELA DEL ECLIPSE',ground:'#34354b',path:'#72718a',grass:'#5a5470',tree:'#55536c',dark:'#27293c',water:'#674b83'}];
function tile(zone,x,y){
 if(x<0||x>=W||y<0||y>=H)return 'wall';
 if(zone===3){if(x===0||y===0||x===W-1||y===H-1)return 'wall';if(x===10||x===20||x===30||y===10||y===20||y===30||y===40)return 'path';if((x%10===0&&y%10>2)||(y%10===4&&x%10<5))return 'wall';return (x+y)%11===0?'water':'ground';}
 if(y===10 && (x===0||x===W-1))return 'gate';
 if(x===0||y===0||x===W-1||y===H-1)return 'wall';
 // A connected grid of paths joins the camp, entrances and landmarks.
 if(x===10||y===10||x%10===0||y%10===0||(x>=8&&x<=12&&y>=9&&y<=13))return 'path';
 if(x===4&&y===8)return 'grass';
 const n=(Math.imul(x,73856093)^Math.imul(y,19349663)^Math.imul(zone+1,83492791))>>>0;
 if(n%23===0)return 'tree';
 if(n%31===0)return 'water';
 return n%3===0?'grass':'ground';
}
function canWalk(zone,x,y){return !['wall','tree','water'].includes(tile(zone,x,y));}
function validPosition(zone,p){return !!p&&Number.isInteger(p.x)&&Number.isInteger(p.y)&&['up','down','left','right'].includes(p.facing)&&canWalk(zone,p.x,p.y);}
function draw(canvas,zone,p,steps,landmarks=[]){if(!canvas)return;const rows=15,cols=Math.max(7,Math.min(25,Math.round(rows*(canvas.clientWidth||336)/(canvas.clientHeight||240))));const density=Math.max(1,(canvas.clientWidth||cols*16)/(cols*16))*(window.devicePixelRatio||1);canvas.width=Math.round(cols*16*density);canvas.height=Math.round(rows*16*density);const c=canvas.getContext('2d');c.scale(canvas.width/(cols*16),canvas.height/(rows*16));c.imageSmoothingEnabled=true;const b=BIOMES[zone];const ox=Math.max(0,Math.min(W-cols,p.x-(cols-1)/2)),oy=Math.max(0,Math.min(H-rows,p.y-(rows-1)/2));c.translate(-ox*16,-oy*16);function R(x,y,w,h,col){c.fillStyle=col;c.fillRect(x,y,w,h);}function oval(x,y,rx,ry,col){c.beginPath();c.ellipse(x,y,rx,ry,0,0,Math.PI*2);c.fillStyle=col;c.fill();}
 for(let y=Math.floor(oy);y<Math.ceil(oy+rows);y++)for(let x=Math.floor(ox);x<Math.ceil(ox+cols);x++){const px=x*16,py=y*16,t=tile(zone,x,y),n=(x*17+y*29+zone*31)%7;R(px,py,16,16,t==='path'?b.path:b.ground);if(t==='path'){R(px+2+n,py+3,2,1,'#ae9d77');R(px+11,py+12-n,2,1,'#f1e0b6');}else{R(px+2+n,py+4,2,1,'#ffffff22');R(px+11,py+10,2,1,'#385b4a22');}if(t==='gate'){R(px,py,16,16,b.path);R(px+4,py+2,8,12,'#f4d789');R(px+7,py+4,2,8,b.dark);}if(t==='water'){R(px,py,16,16,b.water);R(px+2,py+4,8,1,'#d1f0df88');R(px+8,py+11,6,1,'#d1f0df88');}if(t==='grass'){R(px+1,py+8,14,6,b.grass);for(let i=0;i<3;i++){let gx=px+2+i*5;R(gx,py+5+(i%2)*2,2,6,b.grass);R(gx+1,py+4+(i%2)*2,2,2,b.tree);}if(n===0)R(px+9,py+6,2,2,'#e9d38b');}if(t==='wall'||t==='tree'){if(zone===1||zone===3){R(px+2,py+7,12,8,b.dark);R(px+3,py+3,10,9,b.tree);R(px+5,py+1,6,4,'#b69470');R(px+5,py+6,3,2,'#ddaa78');}else{R(px+6,py+9,4,6,'#6c5845');R(px+1,py+4,14,9,b.dark);R(px+2,py+2,12,9,b.tree);R(px+5,py,7,5,b.tree);R(px+4,py+3,4,2,'#a1c98088');}}}
 // Citadel architecture: engraved avenues, inset panels and resonator pylons.
 if(zone===3){for(let ty=Math.floor(oy);ty<Math.ceil(oy+rows);ty++)for(let tx=Math.floor(ox);tx<Math.ceil(ox+cols);tx++){const ax=tx*16,ay=ty*16,t=tile(zone,tx,ty);if(t==='path'){R(ax+1,ay+1,14,14,'#77768d');R(ax+2,ay+2,12,1,'#9994a7');R(ax+2,ay+14,12,1,'#46465f');R(ax+7,ay+6,2,4,'#c4b4db');}else if(t==='ground'){R(ax+1,ay+1,14,14,'#303447');R(ax+2,ay+2,12,1,'#4d5164');R(ax+2,ay+14,12,1,'#232939');if((tx+ty)%3===0){R(ax+6,ay+5,4,6,'#4a425f');R(ax+7,ay+6,2,4,'#8f79b2');}}else if(t==='wall'){R(ax+2,ay+2,12,14,'#25293d');R(ax+3,ay+1,10,12,'#62627c');R(ax+5,ay+2,6,10,'#474960');R(ax+6,ay+4,4,2,'#bda6d0');R(ax+4,ay+12,8,2,'#9090a4');}else if(t==='water'){R(ax+1,ay+1,14,14,'#4c4269');R(ax+3,ay+7,10,2,'#b496de');R(ax+7,ay+3,2,10,'#8168ab');}}}
 // Mark interactions directly in the explored world.
 for(const mark of landmarks){const mx=mark.x*16+8,my=mark.y*16+5;if(mark.symbol==='▲'){R(mx-7,my-4,14,14,'#4a4654');R(mx-5,my-8,10,6,'#8b846f');R(mx-4,my,8,10,'#202b32');R(mx-2,my+1,4,7,'#9ad277');}else if(mark.symbol==='◇'){R(mx-5,my-2,10,12,'#8d8291');R(mx-3,my-5,6,6,'#e8dba9');R(mx-2,my+2,4,4,'#f0d38a');}else if(mark.symbol==='◎'){R(mx-8,my-13,4,23,'#a697bb');R(mx+4,my-13,4,23,'#a697bb');R(mx-8,my-14,16,4,'#d4c5df');oval(mx,my-2,4,9,'#b6a2e2');}else{NPCArt.draw(c,mx,my+2,mark);}c.fillStyle='#182c39';c.fillRect(mx-4,my-14,8,7);c.fillStyle=mark.symbol==='▲'?'#ffce79':mark.symbol==='◆'?'#ff8e8e':'#c1f4a3';c.font='bold 7px sans-serif';c.textAlign='center';c.fillText(mark.symbol,mx,my-8);}
 // A small camp marks the safe starting area.
 R(9*16+2,11*16+8,11,4,'#6d5548');R(9*16+4,11*16+5,7,4,'#ddbd8a');R(9*16+6,11*16+3,3,3,'#ffbd73');
 const px=p.x*16,py=p.y*16,walk=steps%2;oval(px+8,py+14,6,2,'#233f3c66');
 // Chibi explorer: oversized head, hat, backpack and animated feet.
 c.save();c.translate(px+8,py+15);c.scale(1.25,1.25);c.translate(-px-8,-py-15);
 R(px+4+walk,py+12,3,3,'#293c4b');R(px+9-walk,py+12,3,3,'#293c4b');R(px+3,py+7,10,6,'#365e6d');R(px+1,py+8,3,4,'#cfaa76');R(px+12,py+8,3,4,'#cfaa76');R(px+4,py+7,2,5,'#dfc08b');R(px+4,py,9,8,'#a97447');R(px+4,py+2,9,6,'#efc7a1');R(px+4,py,9,3,'#a97447');R(px+3,py+1,2,4,'#a97447');R(px+11,py+1,2,4,'#a97447');R(px+6,py,4,1,'#d09a68');
 if(p.facing==='down'){R(px+6,py+4,1,1,'#24353b');R(px+10,py+4,1,1,'#24353b');R(px+7,py+6,3,1,'#b76f65');}else if(p.facing==='up'){R(px+5,py+2,7,5,'#a97447');R(px+6,py+9,5,3,'#c98a64');}else{let ex=p.facing==='left'?5:11;R(px+ex,py+4,1,1,'#24353b');R(px+(p.facing==='left'?11:4),py+3,2,4,'#604844');}
 c.restore();
}
root.World={W,H,START,BIOMES,tile,canWalk,validPosition,draw};if(typeof module!=='undefined')module.exports=root.World;
})(typeof window==='undefined'?globalThis:window);
