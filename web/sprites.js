(function(root){
'use strict';
const G=root.Genetics,SIZE=288;
function draw(canvas,m){
 canvas.width=SIZE;canvas.height=SIZE;
 const c=canvas.getContext('2d');c.scale(3,3);c.lineJoin='round';c.lineCap='round';
 const v=k=>G.value(m,k),base=G.colors[v('color')],accent=G.accents[v('accent')],ink='#273548';
 function tint(hex,f){return '#'+hex.slice(1).match(/../g).map(x=>Math.min(255,Math.round(parseInt(x,16)*f)).toString(16).padStart(2,'0')).join('');}
 const shade=tint(base,.72),light=tint(base,1.16);
 function path(points,fill,stroke=ink,width=1.35){c.beginPath();c.moveTo(...points[0]);for(let i=1;i<points.length;i++)c.lineTo(...points[i]);c.closePath();if(fill===base||fill===accent){const ys=points.map(p=>p[1]),top=Math.min(...ys),bottom=Math.max(...ys),g=c.createLinearGradient(0,top,0,Math.max(top+.1,bottom));g.addColorStop(0,tint(fill,1.18));g.addColorStop(.5,fill);g.addColorStop(1,tint(fill,.62));c.fillStyle=g;}else c.fillStyle=fill;c.fill();if(stroke){c.strokeStyle=stroke;c.lineWidth=width;c.stroke();}}
 function ellipse(x,y,rx,ry,fill,stroke=ink,width=1.2){rx=Math.max(1,rx);ry=Math.max(1,ry);c.beginPath();c.ellipse(x,y,rx,ry,0,0,Math.PI*2);if(fill===base||fill===accent||fill===shade||fill===light){const g=c.createRadialGradient(x-rx*.36,y-ry*.45,0,x+rx*.06,y+ry*.13,Math.max(rx,ry)*1.15);g.addColorStop(0,tint(fill,1.28));g.addColorStop(.36,tint(fill,1.1));g.addColorStop(.72,fill);g.addColorStop(1,tint(fill,.56));c.fillStyle=g;}else c.fillStyle=fill;c.fill();if(stroke){c.strokeStyle=stroke;c.lineWidth=width;c.stroke();}if(fill===base||fill===accent){c.save();c.clip();const g=c.createLinearGradient(x,y-ry,x,y+ry);g.addColorStop(0,'#ffffff12');g.addColorStop(.54,'#ffffff00');g.addColorStop(1,'#132b5140');c.fillStyle=g;c.fillRect(x-rx,y-ry,rx*2,ry*2);c.restore();}}
 function line(points,color=ink,width=1.5){c.beginPath();c.moveTo(...points[0]);for(let i=1;i<points.length;i++)c.lineTo(...points[i]);c.strokeStyle=color;c.lineWidth=width;c.stroke();}
 const a=v('anatomy'),b=v('body'),len=v('bodyLength'),size=v('size'),headSize=v('headSize'),neck=v('neck'),limb=v('limbLength');
 // A common coordinate system keeps anatomical parts anchored to each body plan.
 const rigs=[{x:48,y:59,rx:15,ry:19,hx:48,hy:34},{x:43,y:62,rx:24,ry:13,hx:67,hy:43},{x:44,y:72,rx:25,ry:8,hx:68,hy:39},{x:48,y:59,rx:12,ry:17,hx:48,hy:34},{x:48,y:67,rx:24,ry:15,hx:48,hy:54},{x:42,y:63,rx:22,ry:13,hx:65,hy:46},{x:45,y:62,rx:23,ry:13,hx:67,hy:49}];
 const q=rigs[a],x=q.x,y=q.y,rx=q.rx+(b===0?3:b===1?-2:2)+len*1.5,ry=q.ry+(b===2?3:b===1?-1:0),hr=9+headSize*1.4,hx=neck===3?(a===0||a===3||a===4?x:Math.min(75,x+rx*.67)):q.hx,hy=neck===3?y-ry*.60:q.hy-([0,7,4][neck]);
 const poseScale=[.85,.93,1][size];c.save();c.translate(48,85);c.scale(poseScale,poseScale);c.translate(-48,-85);
 ellipse(48,85,28,3,'#111d2c36',null);ellipse(48,84.8,18,1.7,'#111d2c33',null);
 // Tail follows the rear of the body and terminates in an inherited silhouette.
 const tx=x-rx+3,ty=y+2;
 c.beginPath();c.moveTo(tx+4,ty);c.bezierCurveTo(tx-4,ty+6,Math.max(8,tx-11),ty-4,Math.max(11,tx-8),ty-12);c.strokeStyle=ink;c.lineWidth=6;c.stroke();c.strokeStyle=shade;c.lineWidth=4;c.stroke();
 const tailX=Math.max(11,tx-8),tailY=ty-12;
 if(v('tail')===0){path([[tailX,tailY+3],[tailX-7,tailY-3],[tailX-4,tailY-12],[tailX+4,tailY-6]],accent);line([[tailX,tailY],[tailX-3,tailY-7]],shade,.8);}
 if(v('tail')===1){path([[tailX-4,tailY+2],[tailX-6,tailY-6],[tailX-2,tailY-4],[tailX,tailY-14],[tailX+5,tailY-7],[tailX+4,tailY+2]],'#f39959');ellipse(tailX,tailY-3,2,4,'#ffe6a3',null);}
 if(v('tail')===2){ellipse(tailX,tailY-3,6,5,accent);ellipse(tailX-2,tailY-5,2,1,light,null);}
 // Wings originate behind the torso; each shape has a clear attachment.
 const wing=v('wings');if(wing||a===3){const w=wing||2;for(const side of [-1,1]){const ox=x+side*5,oy=y-8,tip=Math.max(3,Math.min(93,x+side*(rx+16)));if(w===1){path([[ox,oy],[tip,y-26],[tip-side*3,y-5],[ox+side*9,y+4],[ox,y+3]],accent);line([[ox,oy+2],[tip,y-26]],shade,1);line([[ox+side*7,y],[tip-side*3,y-5]],shade,1);}else if(w===2){path([[ox,oy],[tip,y-24],[tip-side*4,y-8],[tip-side*8,y-5],[tip-side*5,y-3],[ox+side*8,y+7],[ox,y+5]],accent);for(let j=0;j<3;j++)line([[ox+side*4,y+j*2],[tip-side*(6+j*3),y-14+j*4]],light,.9);}else{ellipse(x+side*(rx*.68),y-10,10,14,accent);line([[x+side*rx*.4,y-18],[x+side*rx*.95,y-3]],shade,1);}}}
 function foot(px,py){const f=v('legs');if(f===2){path([[px-3,py-2],[px-6,py+3],[px+1,py+2],[px+5,py+3],[px+3,py-2]],accent);}else{ellipse(px,py,4.2,2.5,f===1?shade:base);if(f===0)for(let i=-1;i<=1;i++)line([[px+i*2,py],[px+i*2,py+2]],'#f5e8bc',1);if(f===3)line([[px-3,py],[px+3,py]],accent,1.5);}}
 function leg(px,py,behind){let l=7+limb*2;let end=Math.min(82,py+l);c.beginPath();c.moveTo(px,py);c.quadraticCurveTo(px+(v('legs')===3?4:0),py+4,px,end);c.strokeStyle=ink;c.lineWidth=6;c.stroke();const lg=c.createLinearGradient(px-3,py,px+4,end);lg.addColorStop(0,behind?shade:light);lg.addColorStop(.5,behind?tint(base,.65):base);lg.addColorStop(1,tint(base,.55));c.strokeStyle=lg;c.lineWidth=4;c.stroke();foot(px,end);}
 if(a===0||a===3){leg(x-8,y+ry-4,true);leg(x+8,y+ry-4,false);}
 if(a===1){leg(x-14,y+ry-5,true);leg(x+13,y+ry-5,true);leg(x-10,y+ry-3,false);leg(x+17,y+ry-3,false);}
 if(a===5){for(let i=0;i<3;i++){const lx=x-13+i*12;line([[lx,y+4],[lx-8,y+12],[lx-10,y+18+limb]],ink,3);line([[lx,y+4],[lx-8,y+12],[lx-10,y+18+limb]],shade,1.5);foot(lx-10,y+18+limb);}}
 if(a===6){path([[x-3,y+ry-3],[x+5,y+ry+11],[x+12,y+ry-2]],accent);path([[x-rx+3,y-3],[x-rx-12,y-11],[x-rx-11,y+12],[x-rx+3,y+5]],accent);}
 if(a===2){ellipse(x,y,rx,ry,shade);ellipse(x+4,y-2,rx-5,ry-2,base);}
 else if(a===4){c.beginPath();c.moveTo(x-rx,y+ry-2);c.bezierCurveTo(x-rx-4,y+4,x-rx+3,y-ry,x,y-ry);c.bezierCurveTo(x+rx-3,y-ry,x+rx+4,y+4,x+rx,y+ry-2);c.quadraticCurveTo(x+rx/2,y+ry+4,x,y+ry);c.quadraticCurveTo(x-rx/2,y+ry+4,x-rx,y+ry-2);c.closePath();c.fillStyle=base;c.fill();c.strokeStyle=ink;c.lineWidth=1.6;c.stroke();ellipse(x-9,y-7,4,2,light,null);}
 else {ellipse(x,y,rx,ry,base);ellipse(x+3,y+4,rx*.49,ry*.53,tint(base,1.08),null);ellipse(x-rx*.35,y-ry*.42,rx*.26,ry*.12,'#ffffff42',null);}
 // Neck attaches at the torso and follows the inherited shape. A neckless head sits directly on the body.
 if(neck!==3){
  const nx=(a===0||a===3||a===4)?x:Math.min(x+rx*.68,hx),ny=(a===2?y-1:y-ry*.52),endY=hy+hr*.65;
  const curveX=neck===2?hx+(hx>=nx?9:-9):(nx+hx)/2;
  c.beginPath();c.moveTo(nx,ny);c.quadraticCurveTo(curveX,(ny+endY)/2,hx,endY);c.strokeStyle=ink;c.lineWidth=neck===1?10:12;c.stroke();
  const ng=c.createLinearGradient(nx-5,ny,hx+5,endY);ng.addColorStop(0,shade);ng.addColorStop(.48,base);ng.addColorStop(1,light);c.strokeStyle=ng;c.lineWidth=neck===1?7:9;c.stroke();
 }
 // Contact shadows and rim light make overlaps read as a three-dimensional form.
 if(a!==2&&a!==4){c.save();c.beginPath();c.ellipse(x,y,rx-1,ry-1,0,0,Math.PI*2);c.clip();ellipse(hx-2,hy+hr*.93,hr*.9,3.8,'#24314845',null);c.beginPath();c.ellipse(x+rx*.28,y+ry*.05,rx*.67,ry*.87,0,.25,2.6);c.strokeStyle='#16263b35';c.lineWidth=2.1;c.stroke();c.restore();}
 // Patterns and textures remain constrained inside the body.
 c.save();c.beginPath();c.ellipse(x,y,Math.max(1,rx-2),Math.max(1,ry-2),0,0,Math.PI*2);c.clip();
 if(v('pattern')===1){for(let i=0;i<8;i++){const px=x-rx*.7+(i%4)*rx*.45,py=y-ry*.55+Math.floor(i/4)*ry*.8;ellipse(px,py,2.2,1.7,accent,null);}}
 if(v('pattern')===2){for(let i=-2;i<=2;i++)line([[x+i*8-4,y-ry],[x+i*8+4,y+ry]],shade,2.2);}
 if(v('surface')===1){for(let i=-2;i<=2;i++)for(let j=-1;j<=1;j++)line([[x+i*7,y+j*6+1],[x+i*7+2,y+j*6-1]],shade,.9);}
 if(v('surface')===2){for(let i=-2;i<=2;i++)for(let j=-1;j<=1;j++){c.beginPath();c.arc(x+i*7,y+j*6,2,0,Math.PI);c.strokeStyle=shade;c.lineWidth=.8;c.stroke();}}
 if(v('surface')===3){for(let i=-2;i<=2;i++)for(let j=-1;j<=1;j++)ellipse(x+i*8,y+j*7,3,2,shade,null);}
 c.restore();
 if(v('shell')){c.save();c.beginPath();c.ellipse(x-2,y-ry*.37,rx*.83,ry*.48,0,Math.PI,Math.PI*2);c.quadraticCurveTo(x,y+ry*.12,x-rx*.83,y-ry*.37);c.closePath();const shellLight=c.createLinearGradient(x-rx*.5,y-ry,x+rx*.6,y);shellLight.addColorStop(0,tint(base,1.12));shellLight.addColorStop(.45,shade);shellLight.addColorStop(1,tint(base,.46));c.fillStyle=shellLight;c.fill();c.strokeStyle=ink;c.lineWidth=1.2;c.stroke();line([[x-rx*.65,y-ry*.38],[x,y-ry*.18],[x+rx*.65,y-ry*.38]],accent,1.2);line([[x,y-ry*.82],[x,y-ry*.18]],accent,1);for(let side of [-1,1])line([[x+side*rx*.42,y-ry*.73],[x+side*rx*.3,y-ry*.28]],accent,.8);c.restore();if(v('shell')===2)for(let i=-2;i<=2;i++)path([[x+i*6-3,y-ry*.68],[x+i*6,y-ry*.68-5],[x+i*6+3,y-ry*.68]],accent);}
 if(v('crest')===1||v('crest')===3){for(let i=-2;i<=2;i++)path([[x+i*6-3,y-ry*.65],[x+i*6,y-ry*.65-5-v('crest')],[x+i*6+3,y-ry*.65]],accent);}
 // Optional arms use shoulder, elbow, hand and fingers, layered in front of the torso.
 const arms=v('arms');
 if(arms){
  const sideways=![0,3,4].includes(a), shoulderY=y-ry*.32, reach=arms===1?9:arms===2?15:12;
  for(const side of [-1,1]){
   const sx=sideways?x+rx*(side===-1?-.34:.42):x+side*rx*.78;
   const sy=shoulderY+(sideways&&side===-1?-2:0), ex=Math.max(8,Math.min(88,sx+side*(reach*.65))), ey=sy+reach*.42;
   const wx=Math.max(8,Math.min(88,ex+side*reach*.35)),wy=Math.min(80,ey+reach*.48);
   c.beginPath();c.moveTo(sx,sy);c.quadraticCurveTo(ex,sy+2,ex,ey);c.quadraticCurveTo(ex,wy-1,wx,wy);c.strokeStyle=ink;c.lineWidth=6;c.stroke();
   const ag=c.createLinearGradient(sx,sy,wx,wy);ag.addColorStop(0,light);ag.addColorStop(.5,base);ag.addColorStop(1,shade);c.strokeStyle=ag;c.lineWidth=4;c.stroke();
   ellipse(sx,sy,3,3,base,ink,.8);
   if(arms===3){path([[wx-side*2,wy-2],[wx+side*5,wy-4],[wx+side*7,wy+2],[wx+side*2,wy+4]],accent,ink,1);line([[wx,wy],[wx+side*5,wy+1]],light,.8);}
   else{ellipse(wx,wy,3.5,2.8,base,ink,.8);for(let f=-1;f<=1;f++)line([[wx+side*1.5,wy+f],[wx+side*3.6,wy+f*1.8]],ink,.7);}
  }
 }
 if(v('crest')===2)ellipse(hx,hy,hr+5,hr+4,shade);
 // Ears and antennae belong to the head, so they stay attached across all rigs.
 if(v('ears')===0){path([[hx-hr+3,hy-4],[hx-hr-1,hy-hr-8],[hx-3,hy-hr+2]],base);path([[hx+hr-3,hy-4],[hx+hr+1,hy-hr-8],[hx+3,hy-hr+2]],base);}
 if(v('ears')===1){path([[hx-hr+2,hy-3],[hx-hr-9,hy-10],[hx-hr-7,hy+3],[hx-hr+2,hy+5]],accent);path([[hx+hr-2,hy-3],[hx+hr+9,hy-10],[hx+hr+7,hy+3],[hx+hr-2,hy+5]],accent);}
 if(v('ears')===2){ellipse(hx-hr+1,hy-hr*.55,5,5,shade);ellipse(hx+hr-1,hy-hr*.55,5,5,shade);}
 const head=v('head');
 if(head===1)path([[hx-hr,hy-hr*.5],[hx-hr*.65,hy-hr],[hx+hr*.55,hy-hr],[hx+hr,hy-hr*.4],[hx+hr*.9,hy+hr*.65],[hx+hr*.5,hy+hr],[hx-hr*.65,hy+hr],[hx-hr,hy+hr*.4]],base);
 else ellipse(hx,hy,hr*(head===3?1.16:1),hr*(head===2?1.08:.9),base);ellipse(hx-hr*.31,hy-hr*.48,hr*.29,hr*.13,'#ffffff7a',null);ellipse(hx+hr*.32,hy+hr*.48,hr*.28,hr*.11,'#17253a25',null);
 if(head===3){ellipse(hx-hr*.65,hy-hr*.72,4,4,light);ellipse(hx+hr*.65,hy-hr*.72,4,4,light);}
 if(head===4){ellipse(hx-hr*.66,hy,3.5,5,accent);ellipse(hx+hr*.66,hy,3.5,5,accent);}
 if(head===2)path([[hx-3,hy+3],[hx+6,hy+3],[hx+2,hy+9]],accent);
 const eyes=v('eyes');for(const side of [-1,1]){const ex=hx+side*hr*.48,ey=hy-1;if(eyes===0){line([[ex-2,ey],[ex+2,ey]],ink,1.7);}else{ellipse(ex,ey,eyes===2?3.1:2.5,eyes===2?3.7:3.1,'#f5f5e5',ink,.65);ellipse(ex+.3,ey+.3,eyes===2?2.1:1.7,eyes===2?2.8:2.3,ink,null);ellipse(ex-.6,ey-1,1.05,1.05,'#fffdf0',null);if(eyes===1)line([[ex-2,ey-3],[ex+2,ey-2]],shade,1.2);}}
 const muzzle=v('muzzle');if(muzzle===2){path([[hx-3,hy+3],[hx+7,hy+4],[hx+1,hy+9]],accent);}else{ellipse(hx+1,hy+5,muzzle===1?7:4,muzzle===1?3.3:2.8,light);ellipse(hx-1,hy+4,muzzle===1?2.8:1.7,.55,'#ffffff70',null);ellipse(hx+2+(muzzle===1?3:0),hy+4,1.2,.8,ink,null);line([[hx,hy+7],[hx+1.5,hy+8],[hx+3,hy+7]],shade,.7);}
 const horns=v('horns');for(let i=0;i<horns;i++){const xx=horns===1?hx:hx+(i?hr*.6:-hr*.6);path([[xx-2,hy-hr*.8],[xx,hy-hr-8],[xx+3,hy-hr*.7]],'#f2e4bd');}
 if(v('antennae'))for(const side of [-1,1]){const sx=hx+side*4,ex=sx+side*(v('antennae')===2?9:4);line([[sx,hy-hr],[sx+side*3,hy-hr-7],[ex,hy-hr-11]],ink,1.3);ellipse(ex,hy-hr-11,2,2,accent);}
 c.restore();
}
root.Sprites={draw,SIZE};
})(window);
