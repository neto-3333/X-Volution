/* Shared rig for map, character editor and all four walking directions. */
(function(root){
'use strict';
function draw(c,x,y,facing,phase=0,profile=null){
 const p=profile||{},hair=['#b18051','#49382e','#d3b16d','#a05b3d'][p.hair??0],skin=['#efc5a0','#d6a07c','#ad7757','#80543f'][p.skin??0],eyes=['#3f5156','#66937b','#58789e','#845c41'][p.eyes??0],coat=['#386b77','#687da5','#9b6479','#6a885f'][p.coat??0],style=p.style??0,cap=p.cap??0,glasses=p.glasses??0;
 const tint=(hex,n)=>'#'+hex.slice(1).match(/../g).map(v=>Math.min(255,Math.max(0,Math.round(parseInt(v,16)*n))).toString(16).padStart(2,'0')).join('');
 const back=facing==='up',side=facing==='left'||facing==='right',moving=phase!==0,swing=moving?Math.sin(phase):0,bob=moving?Math.abs(Math.sin(phase))*.22:0;
 const ink='#293949';
 function shape(points,fill,stroke=ink,width=.38){c.beginPath();points.forEach((v,i)=>i?c.lineTo(...v):c.moveTo(...v));c.closePath();c.fillStyle=fill;c.fill();if(stroke){c.strokeStyle=stroke;c.lineWidth=width;c.stroke();}}
 function oval(x,y,rx,ry,fill,stroke=null,width=.38){c.beginPath();c.ellipse(x,y,rx,ry,0,0,Math.PI*2);if(fill){c.fillStyle=fill;c.fill();}if(stroke){c.strokeStyle=stroke;c.lineWidth=width;c.stroke();}}
 function line(points,color,w=.3){c.beginPath();points.forEach((v,i)=>i?c.lineTo(...v):c.moveTo(...v));c.strokeStyle=color;c.lineWidth=w;c.stroke();}
 c.save();c.translate(x,y);if(facing==='left')c.scale(-1,1);c.lineCap='round';c.lineJoin='round';oval(0,1.4,5.5,1.05,'#142d3840');
 // Feet swing around fixed hips; the shadow stays on the ground.
 for(const s of [-1,1]){const stride=s*swing*.8;c.save();c.translate(side?s*.95:s*1.8,-3.7);c.rotate((side?s*swing*.18:s*swing*.08));shape([[-1.15,0],[1.15,0],[1.05,3.8+stride],[-1.1,3.8+stride]],s===-1?'#304354':'#3c5366');shape([[-1.15,3+stride],[1.2,3+stride],[1.7,4.5+stride],[-1.4,4.5+stride]],'#6b5443');line([[-1,4.1+stride],[1.25,4.1+stride]],'#d4b68b',.28);c.restore();}
 c.save();c.translate(0,-bob);
 // Back layers: hair tails, backpack, then body and head. They never cross the eyes.
 if(style===2)shape([[-5.15,-16.3],[-5.6,-8],[-4.6,-6.9],[-3.3,-7.4],[3.3,-7.4],[4.6,-6.9],[5.6,-8],[5.15,-16.3]],tint(hair,.85));
 if(style===3){if(side){shape([[-4.3,-16.1],[-7.2,-16],[-9,-13+swing*.12],[-8,-8+swing*.22],[-5.7,-9.2],[-6.2,-13]],hair);oval(-5,-15,1,.6,'#dfb86d',ink,.2);}else{const tailX=4.6;shape([[tailX-.8,-16.2],[tailX+2.2,-16],[tailX+3,-12.7+swing*.12],[tailX+1.8,-8.1+swing*.22],[tailX-.8,-9.4],[tailX+.2,-12.9]],hair);oval(tailX+.3,-15,1,.6,'#dfb86d',ink,.2);}}
 if(side)shape([[-3.5,-9],[-5.8,-8.5],[-5.5,-3.5],[-3.3,-3]],'#b38858');
 shape([[side?-2.8:-3.5,-9],[3.1,-9],[3.6,-3],[-3.4,-3]],coat);shape([[.4,-8],[2.7,-8],[2.8,-4],[.4,-4]],tint(coat,1.14));line([[0,-8.2],[0,-3.9]],'#cdbc8b',.35);shape([[-3.2,-4.3],[3.2,-4.3],[3.2,-3.3],[-3.2,-3.3]],'#74583f');shape([[-.5,-4.4],[.7,-4.4],[.7,-3.2],[-.5,-3.2]],'#e3c58a');shape([[1,-6.1],[2.5,-6.1],[2.5,-4.8],[1,-4.8]],tint(coat,.75));
 for(const s of [-1,1]){c.save();c.translate(side?s*2.7:s*3.1,-8.4);c.rotate(s*swing*(side?.22:.12));shape([[-.65,0],[.9,.5],[1,4.3],[-.7,4.3]],tint(coat,s<0?.9:1.1));line([[-.6,3.5],[1,3.5]],'#cabd94',.45);oval(.15,4.5,.85,.95,skin,'#795e4a',.25);c.restore();}
 if(back){shape([[-2.8,-8.7],[2.8,-8.7],[3.1,-4],[-3.1,-4]],'#a77c51');shape([[-2.7,-8.4],[2.7,-8.4],[2.2,-6.4],[-2.2,-6.4]],'#c79c65');line([[-2.2,-5.9],[2.2,-5.9]],'#73533d');shape([[-.5,-6.8],[.5,-6.8],[.5,-5.6],[-.5,-5.6]],'#ead19b');}
 // One stable head, with the face and its accessories in the same coordinate frame.
 oval(0,-13.5,5.1,5.15,tint(hair,.82),ink);
 if(!back){oval(side?.35:0,-12.9,4.65,4.55,skin,ink);oval(side?-3.7:-4.25,-12.6,.8,1.1,tint(skin,.94));if(!side)oval(4.25,-12.6,.8,1.1,tint(skin,.94));}
 // Four genuinely different silhouettes, including separate rear views.
 if(style===0){shape([[-4.9,-14.5],[-5.4,-17.1],[-3.7,-17.8],[-2.5,-19.7],[-.7,-18.5],[.9,-19.3],[2.6,-18.3],[4.6,-18],[5,-15.1],[3.7,-14.1],[2.6,-15.6],[1.1,-14.7],[-.1,-15.8],[-1.8,-14.8],[-3.1,-15.4],[-4.3,-13.7]],hair);line([[-3.8,-17],[-2.2,-18],[-.5,-17.4],[1,-18.1],[3.7,-16.9]],tint(hair,1.25),.5);}
 if(style===1){c.beginPath();c.moveTo(-4.8,-14.8);c.bezierCurveTo(-5.2,-19.7,4.5,-20,4.9,-15);c.lineTo(3.3,-15.1);c.lineTo(1,-15.9);c.lineTo(-1.6,-15.4);c.lineTo(-4.8,-14.8);c.closePath();c.fillStyle=hair;c.fill();c.strokeStyle=ink;c.lineWidth=.38;c.stroke();line([[-3.4,-17.3],[-1.4,-17.8],[1.4,-17.9],[3.4,-17.2]],tint(hair,1.2),.4);}
 if(style===2){shape([[-5.1,-13.3],[-5.15,-16.6],[-3.1,-18.7],[0,-19.1],[3.1,-18.7],[5.15,-16.6],[5.1,-13.3],[4,-14.3],[2.7,-15.8],[0,-17.2],[-2.7,-15.8],[-4,-14.3]],hair);line([[-4.3,-16.7],[-2.6,-17.9],[0,-18.3],[2.6,-17.9],[4.3,-16.7]],tint(hair,1.22),.45);}
 if(style===3){shape([[-4.9,-14],[-5,-16.5],[-3,-18.5],[.8,-18.9],[4,-17.8],[5,-15],[3.4,-14.4],[2.6,-16],[.8,-16.5],[-1,-16.2],[-3.1,-14.7]],hair);line([[-3.5,-17],[0,-18],[2.6,-17.3]],tint(hair,1.23),.5);}
 if(back){oval(0,-13.1,4.7,4.5,hair);for(let i=-1;i<=1;i++)line([[i*1.7,-16.2],[i*1.8,-10.4]],tint(hair,i===0?1.15:.88),.28);if(style===1)line([[-3.3,-10.8],[3.3,-10.8]],tint(hair,.78),.6);}
 const eyeX=side?[0,2.7]:[-1.8,1.8],eyeY=-12.8;
 if(!back){for(let i=0;i<2;i++){const ex=eyeX[i],rx=side&&i===0?.6:.8;oval(ex,eyeY,rx,1.05,'#fff9e8');oval(ex+.07,eyeY+.06,rx*.59,.72,eyes);oval(ex-.1,eyeY-.33,.17,.23,'#fff');line([[ex-rx*.7,-14.15],[ex+rx*.7,-14.1]],tint(hair,.65),.3);if(p.gender===1)line([[ex-rx,eyeY-.55],[ex-rx-.2,eyeY-.9]],ink,.22);}line([[side?3.6:.1,-11.8],[side?4:-.1,-11.3]],tint(skin,.74),.28);line([[side?1.5:-.7,-10],[side?2.9:.7,-10]],'#a56e5a',.32);oval(side?1.4:-2.8,-11,.65,.25,'#e7a08b55');
  if(glasses){const frameColor='#344758';for(let i=0;i<2;i++){const ex=eyeX[i],rx=side&&i===0?.95:1.35;if(glasses===1)oval(ex,eyeY,rx,1.45,null,frameColor,.36);else{c.strokeStyle=frameColor;c.lineWidth=.36;c.strokeRect(ex-rx,eyeY-1.25,rx*2,2.5);}}line([[eyeX[0]+(side?.95:1.35),eyeY-.15],[eyeX[1]-1.35,eyeY-.15]],frameColor,.3);line([[-4,eyeY-.4],[eyeX[0]-(side?.95:1.35),eyeY-.4]],frameColor,.28);if(!side)line([[eyeX[1]+1.35,eyeY-.4],[4,eyeY-.4]],frameColor,.28);}
 }else if(glasses){line([[-4.7,-12.6],[-3.8,-12.2]],'#344758',.35);line([[3.8,-12.2],[4.7,-12.6]],'#344758',.35);}
 if(cap){const capColor=cap===1?'#426b97':'#b8574d';c.beginPath();c.moveTo(-5,-15.3);c.bezierCurveTo(-5.8,-22,5.1,-22,5.1,-15.3);c.closePath();c.fillStyle=capColor;c.fill();c.strokeStyle=ink;c.lineWidth=.4;c.stroke();line([[0,-19.6],[.2,-15.5]],tint(capColor,1.22),.3);if(back){shape([[-2,-15.6],[2,-15.6],[1.5,-14.8],[-1.5,-14.8]],tint(capColor,.75));}else if(side){shape([[-1,-15.4],[5,-15.4],[7.4,-14.5],[4.1,-14.1],[-1,-14.5]],tint(capColor,.86));}else{shape([[-4.9,-15.5],[4.9,-15.5],[5.4,-14.5],[2,-14.2],[-2,-14.2],[-5.4,-14.5]],tint(capColor,.84));oval(0,-17.3,1,1,tint(capColor,1.35));} }
 shape([[-2.8,-8.8],[0,-9.2],[2.8,-8.8],[2.4,-7.8],[0,-8],[-2.5,-7.8]],'#df9c67');if(!back)shape([[-2,-8],[-.6,-7.7],[-1.1,-5.3],[-2.4,-5.8]],'#e6ae78');
 c.restore();c.restore();
}
root.HeroArt={draw};
})(window);
