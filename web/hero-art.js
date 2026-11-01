/* Chibi explorer with directional poses and continuous walk cycles. */
(function(root){
'use strict';
function draw(c,x,y,facing,phase=0,profile=null){const p=profile||{},hair=['#b18051','#49382e','#d3b16d','#a05b3d'][p.hair??0],skin=['#efc5a0','#d6a07c','#ad7757','#80543f'][p.skin??0],eyes=['#3f5156','#66937b','#58789e','#845c41'][p.eyes??0],coat=['#386b77','#687da5','#9b6479','#6a885f'][p.coat??0],style=p.style??0;const tint=(hex,n)=>'#'+hex.slice(1).match(/../g).map(v=>Math.min(255,Math.max(0,Math.round(parseInt(v,16)*n))).toString(16).padStart(2,'0')).join('');const moving=phase!==0,swing=moving?Math.sin(phase)*1.1:0,bob=moving?Math.abs(Math.sin(phase))*.25:0,back=facing==='up',side=facing==='left'||facing==='right';c.save();c.translate(x,y-bob);if(facing==='left')c.scale(-1,1);c.lineCap='round';c.lineJoin='round';
 function shape(points,fill,stroke='#293949',width=.4){c.beginPath();points.forEach((p,i)=>i?c.lineTo(...p):c.moveTo(...p));c.closePath();c.fillStyle=fill;c.fill();if(stroke){c.strokeStyle=stroke;c.lineWidth=width;c.stroke();}}
 function oval(x,y,rx,ry,fill,stroke=null){c.beginPath();c.ellipse(x,y,rx,ry,0,0,Math.PI*2);c.fillStyle=fill;c.fill();if(stroke){c.strokeStyle=stroke;c.lineWidth=.4;c.stroke();}}
 function line(p,color,w=.35){c.beginPath();p.forEach((a,i)=>i?c.lineTo(...a):c.moveTo(...a));c.strokeStyle=color;c.lineWidth=w;c.stroke();}
 oval(0,2,6,1.3,'#142d3850');
 for(const s of [-1,1]){const sy=s*swing;shape([[s*.8,-4],[s*3.4,-4],[s*3.1,sy+.4],[s*.8,sy+.4]],'#33495d');shape([[s*.8,sy-.6],[s*3.2,sy-.6],[s*4.1,sy+1.2],[s*.8,sy+1.2]],'#5e4b41');line([[s*1.1,sy+.5],[s*3.1,sy+.5]],'#ceac78',.25);}
 // Backpack, coat panels, pockets, belt and scarf share the NPC line weight.
 if(!back){shape([[-4.3,-10],[-5.8,-9],[-5.8,-4],[-3.4,-3]],'#a67c51');line([[-5,-8],[-5,-5]],'#e0b77b');}
 shape([[-3.7,-9.6],[3.7,-9.6],[4.3,-3],[-4,-2.8]],coat);shape([[.5,-9],[3,-8.5],[3.3,-4],[.5,-4]],tint(coat,1.15));line([[-3,-8],[-3.2,-4]],'#86a69b');line([[0,-7.5],[0,-3]],'#c9bc90',.35);shape([[-3.5,-4.7],[3.7,-4.7],[3.7,-3.6],[-3.5,-3.6]],'#74583f');shape([[-.6,-4.8],[.8,-4.8],[.8,-3.5],[-.6,-3.5]],'#e2c68a');shape([[1,-6.5],[3.2,-6.5],[3.2,-5.1],[1,-5.1]],'#315864');
 for(const s of [-1,1]){const sway=(back?-1:1)*s*swing*.4;shape([[s*3.3,-9],[s*4.6,-8],[s*4.9,-4+sway],[s*3.4,-4+sway]],tint(coat,1.1));oval(s*4.25,-3.5+sway,.85,1.05,skin,'#675345');line([[s*3.7,-5+sway],[s*4.7,-5+sway]],'#c9bb94',.45);}
 if(back){shape([[-3.5,-9],[3.5,-9],[3.8,-4.3],[2.8,-3],[-3,-3],[-3.8,-4.3]],'#a77c51');shape([[-3.1,-8.6],[3.1,-8.6],[2.5,-6.4],[-2.5,-6.4]],'#c79c65');line([[-2.6,-5.9],[2.6,-5.9]],'#79573d');shape([[-.5,-6.8],[.5,-6.8],[.5,-5.6],[-.5,-5.6]],'#ead19b');}
 if(style===2)shape([[-5,-16],[-5.6,-7],[-3,-6],[-1,-8],[2,-7],[5,-6],[5.5,-16]],hair);if(style===3)oval(side?-5:4.6,-12,2,4.8,hair,'#293949');
 oval(0,-13.2,5.15,5.45,tint(hair,.75),'#293949');
 if(!back){oval(side?1:0,-12.7,4.5,4.8,skin,'#6f5040');oval(4.1,-12,1,1.35,tint(skin,.9));shape([[-4.8,-14.3],[-5.1,-17.6],[-3.7,-18.2],[-2.9,-19.4],[-1.3,-18.4],[.1,-19],[1.8,-18.4],[3.9,-18],[5,-15.4],[3.4,-13.1],[2.8,-15.6],[1.5,-13.7],[.5,-15.1],[-1.4,-13.6],[-2.8,-14.6],[-4.3,-11.8]],hair);if(style===1){shape([[-4.6,-16.6],[-2.5,-18.1],[1,-18.2],[4.8,-16.4],[3.9,-14.6],[1,-15.4],[-2,-14.5]],hair);}line([[-3.5,-17],[-2,-17.7],[-.5,-17.1],[1,-17.8],[3.2,-16.8]],tint(hair,1.22),.6);
  for(const ex of side?[2.6]:[-1.8,1.8]){oval(ex,-12.5,.8,1.1,'#f5eddb');oval(ex+.15,-12.4,.46,.75,eyes);oval(ex,-12.8,.17,.23,'#fff');line([[ex-.65,-13.8],[ex+.55,-13.8]],'#805c3f',.35);}if(p.gender===1){for(const ex of side?[2.6]:[-1.8,1.8])line([[ex-.8,-13.2],[ex-.9,-13.6]],'#4d3c3f',.3);}line([[.1,-11.6],[.6,-11.3]],'#bc886d');line([[-.5,-9.8],[.8,-9.8]],'#9a6657',.35);oval(-2.8,-10.8,.8,.3,'#e8a692');
 }else{shape([[-4.4,-16.9],[-2.7,-18.7],[-.8,-18.2],[1,-18.9],[4.5,-17],[4.6,-11],[2.9,-9.6],[2,-10.5],[.8,-9.5],[-1,-10.3],[-3.5,-9.6],[-4.9,-12]],hair);line([[-2.7,-16.7],[-1,-17.2],[.5,-16.7],[2.5,-17]],tint(hair,1.22),.6);line([[2,-15],[2.8,-12.1]],tint(hair,.8),.45);}
 shape([[-3,-8.7],[0,-9.5],[3,-8.8],[2.5,-7.6],[0,-7.8],[-2.8,-7.5]],'#dd9966');if(!back)shape([[-2,-8],[-.6,-7.5],[-1.2,-5],[-2.5,-5.5]],'#e6ae78');
 c.restore();}
root.HeroArt={draw};
})(window);
