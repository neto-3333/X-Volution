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
function draw(canvas,zone,p,steps,landmarks=[],player=null){if(!canvas)return;const rows=15,cols=Math.max(7,Math.min(25,Math.round(rows*(canvas.clientWidth||336)/(canvas.clientHeight||240))));const density=Math.max(1,(canvas.clientWidth||cols*16)/(cols*16))*(window.devicePixelRatio||1);canvas.width=Math.round(cols*16*density);canvas.height=Math.round(rows*16*density);const c=canvas.getContext('2d');c.scale(canvas.width/(cols*16),canvas.height/(rows*16));c.imageSmoothingEnabled=true;const b=BIOMES[zone];const ox=Math.max(0,Math.min(W-cols,p.x-(cols-1)/2)),oy=Math.max(0,Math.min(H-rows,p.y-(rows-1)/2));c.translate(-ox*16,-oy*16);function R(x,y,w,h,col){c.fillStyle=col;c.fillRect(x,y,w,h);}function oval(x,y,rx,ry,col){c.beginPath();c.ellipse(x,y,rx,ry,0,0,Math.PI*2);c.fillStyle=col;c.fill();}
 for(let y=Math.floor(oy);y<Math.ceil(oy+rows);y++)for(let x=Math.floor(ox);x<Math.ceil(ox+cols);x++)OverworldArt.tile(c,x,y,tile(zone,x,y),b,zone);
 // Mark interactions directly in the explored world.
 for(const mark of landmarks){const mx=mark.x*16+8,my=mark.y*16+5;if(mark.symbol==='▲'){R(mx-7,my-4,14,14,'#4a4654');R(mx-5,my-8,10,6,'#8b846f');R(mx-4,my,8,10,'#202b32');R(mx-2,my+1,4,7,'#9ad277');}else if(mark.symbol==='◇'){R(mx-5,my-2,10,12,'#8d8291');R(mx-3,my-5,6,6,'#e8dba9');R(mx-2,my+2,4,4,'#f0d38a');}else if(mark.symbol==='◎'){R(mx-8,my-13,4,23,'#a697bb');R(mx+4,my-13,4,23,'#a697bb');R(mx-8,my-14,16,4,'#d4c5df');oval(mx,my-2,4,9,'#b6a2e2');}else{NPCArt.draw(c,mx,my+2,mark);}c.fillStyle='#182c39';c.fillRect(mx-4,my-14,8,7);c.fillStyle=mark.symbol==='▲'?'#ffce79':mark.symbol==='◆'?'#ff8e8e':'#c1f4a3';c.font='bold 7px sans-serif';c.textAlign='center';c.fillText(mark.symbol,mx,my-8);}
 if(zone!==3)OverworldArt.camp(c,9.3,11.7);
 HeroArt.draw(c,p.x*16+8,p.y*16+14,p.facing,steps,player);
}
root.World={W,H,START,BIOMES,tile,canWalk,validPosition,draw};if(typeof module!=='undefined')module.exports=root.World;
})(typeof window==='undefined'?globalThis:window);
