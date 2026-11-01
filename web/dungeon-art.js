(function(root){
'use strict';
// Cached at the physical resolution of the viewport, never enlarged from a thumbnail.
function floor(index,w,h,scale){const canvas=document.createElement('canvas');canvas.width=Math.ceil(w*scale);canvas.height=Math.ceil(h*scale);const c=canvas.getContext('2d');c.scale(scale,scale);
 const palette=[['#243b35','#355249','#607063','#a9c486'],['#252933','#34353f','#65545a','#ffab58'],['#1c3447','#29485d','#4e7486','#a7e5ef']][index];const [bg,tile,edge,glow]=palette;
 c.fillStyle=bg;c.fillRect(0,0,w,h);
 function line(points,color,width=1){c.beginPath();points.forEach((p,i)=>i?c.lineTo(...p):c.moveTo(...p));c.strokeStyle=color;c.lineWidth=width;c.stroke();}
 function poly(points,color){c.beginPath();points.forEach((p,i)=>i?c.lineTo(...p):c.moveTo(...p));c.closePath();c.fillStyle=color;c.fill();c.strokeStyle=edge;c.lineWidth=.7;c.stroke();}
 // Broken masonry, bevelled seams and chips form a continuous traversable floor.
 for(let y=0,row=0;y<h;y+=24,row++){for(let x=-20+(row%2)*20;x<w;x+=40){c.fillStyle=tile;c.fillRect(x+1,y+1,38,22);line([[x+2,y+22],[x+2,y+2],[x+37,y+2]],edge+'66',.6);line([[x+8,y+5],[x+11,y+9],[x+9,y+13]],bg,.6);if((row+Math.floor(x/40))%3===0){c.fillStyle=bg+'88';c.fillRect(x+29,y+17,4,1);}}}
 const cy=h*.24;
 c.strokeStyle=edge;c.lineWidth=6;c.beginPath();c.ellipse(160,cy,94,65,0,0,Math.PI*2);c.stroke();c.strokeStyle=glow+'88';c.lineWidth=1;c.beginPath();c.ellipse(160,cy,84,55,0,0,Math.PI*2);c.stroke();
 for(let i=0;i<12;i++){const a=i*Math.PI/6,x=160+Math.cos(a)*89,y=cy+Math.sin(a)*60;line([[x-2,y-3],[x+3,y],[x-2,y+3]],glow,1);}
 for(const side of [0,1]){const x=side?w-21:5;for(let y=18;y<h-20;y+=68){c.fillStyle='#0c182655';c.fillRect(x+2,y+6,18,38);c.fillStyle=edge;c.fillRect(x,y,16,30);c.fillStyle=tile;c.fillRect(x+3,y+3,10,25);line([[x,y],[x+16,y]],glow+'88',1);
  if(index===0){line([[x+8,y+30],[x+14,y+13],[x+9,y-6],[x+19,y-15]],'#172d29',4);line([[x+8,y+30],[x+14,y+13],[x+9,y-6]],'#789263',1);for(let j=0;j<3;j++)poly([[x+10,y+j*6],[x+18,y+j*6-3],[x+14,y+j*6+3]],'#65865b');}
  if(index===1){c.fillStyle='#171f29';c.fillRect(x+2,y+4,12,18);for(let j=0;j<4;j++)line([[x+3,y+7+j*4],[x+13,y+7+j*4]],'#c77847',1);c.fillStyle='#ffd291';c.fillRect(x+6,y+10,3,6);}
  if(index===2){poly([[x+2,y+19],[x+1,y+3],[x+8,y-14],[x+15,y+1],[x+13,y+21]],'#66a7bc');line([[x+8,y-12],[x+7,y+19]],'#d2f4f7',1);}}
 }
 if(index===0){for(let i=0;i<8;i++){const y=h*.4+i*39;line([[0,y],[24,y+8],[34,y+23],[55,y+27]],'#182a23',5);line([[0,y],[24,y+8],[34,y+23],[55,y+27]],'#738252',1.2);for(let j=0;j<4;j++){c.fillStyle='#76a86d88';c.beginPath();c.ellipse(26+j*5,y+8+j*4,4,2,-.7,0,Math.PI*2);c.fill();}}}
 if(index===1){for(const x of [39,277]){line([[x,0],[x-7,h*.2],[x+5,h*.45],[x-4,h*.7],[x,h]],'#172027',12);line([[x,0],[x-7,h*.2],[x+5,h*.45],[x-4,h*.7],[x,h]],'#d76b3e',5);line([[x,0],[x-7,h*.2],[x+5,h*.45],[x-4,h*.7],[x,h]],'#ffc776',1.5);}for(let y=h*.5;y<h;y+=58){c.fillStyle='#22232e';c.fillRect(87,y,148,8);for(let x=90;x<234;x+=9)line([[x,y+1],[x,y+7]],edge,2);}}
 if(index===2){for(let y=h*.42;y<h;y+=66){c.fillStyle='#76bed012';c.beginPath();c.ellipse(160,y,90,14,0,0,Math.PI*2);c.fill();line([[95,y],[130,y+3],[160,y-2],[198,y+3],[226,y]],'#9edcea66',.7);}for(let i=0;i<8;i++){const x=50+(i*37)%220,y=h*.48+i*27;poly([[x,y+5],[x-3,y-3],[x+2,y-10],[x+6,y],[x+3,y+6]],'#6da5b8');}}
 return canvas;}
root.DungeonArt={floor};
})(window);
