/* Original, fixed vector character designs. No random anatomy or generated seeds. */
(function(root){
'use strict';
function draw(canvas,index,juvenile=false,size=768){canvas.width=canvas.height=size;const c=canvas.getContext('2d');c.scale(size/320,size/320);c.lineJoin='round';c.lineCap='round';
 const palettes=[['#526d48','#9abb69','#d4d48c','#46352c'],['#444656','#8a6570','#ffab4d','#272c39'],['#294e77','#76cadc','#e5f9ff','#202d50']];const [dark,base,light,ink]=palettes[index];
 function poly(points,fill,stroke=ink,w=3){c.beginPath();points.forEach((p,i)=>i?c.lineTo(...p):c.moveTo(...p));c.closePath();if([base,dark,light].includes(fill)){const ys=points.map(p=>p[1]),top=Math.min(...ys),bottom=Math.max(...ys);const gradient=c.createLinearGradient(0,top,0,Math.max(top+1,bottom));gradient.addColorStop(0,light);gradient.addColorStop(.15,fill);gradient.addColorStop(.75,fill);gradient.addColorStop(1,dark);c.fillStyle=gradient;}else c.fillStyle=fill;c.fill();if(stroke){c.strokeStyle=stroke;c.lineWidth=w;c.stroke();}}
 function oval(x,y,rx,ry,fill){c.beginPath();c.ellipse(x,y,rx,ry,0,0,Math.PI*2);c.fillStyle=fill;c.fill();c.strokeStyle=ink;c.lineWidth=2.5;c.stroke();}
 function line(points,color=light,w=2){c.beginPath();points.forEach((p,i)=>i?c.lineTo(...p):c.moveTo(...p));c.strokeStyle=color;c.lineWidth=w;c.stroke();}
 c.save();if(juvenile){c.translate(35,65);c.scale(.78,.76);}
 // Shadows are the only translucent part; outlines remain crisp at any size.
 c.fillStyle='#07111b44';c.beginPath();c.ellipse(160,285,100,14,0,0,Math.PI*2);c.fill();
 if(index===0){
  // Sylvan knight: split antler crown, bark cuirass, articulated limbs, leaf spear.
  for(const side of [-1,1]){c.save();c.translate(160,0);c.scale(side,1);
   poly([[26,190],[48,205],[51,247],[64,273],[28,279],[19,247],[11,220]],dark);
   poly([[23,213],[43,220],[40,251],[25,253]],base);poly([[27,259],[50,256],[62,276],[22,278]],light);
   poly([[34,114],[68,116],[83,140],[65,157],[40,148]],dark);poly([[41,111],[66,104],[83,122],[61,136],[37,129]],base);
   poly([[61,147],[78,153],[76,191],[67,210],[54,202],[59,180]],base);poly([[58,178],[79,177],[84,203],[65,213],[54,200]],dark);
   poly([[15,69],[28,43],[24,12],[38,34],[47,29],[42,48],[31,65]],dark);if(!juvenile)poly([[31,49],[54,27],[60,7],[66,26],[53,52],[27,77]],base);
   line([[28,48],[28,27]],light);c.restore();}
  poly([[116,121],[160,105],[205,121],[193,191],[171,212],[136,201],[122,176]],dark);
  poly([[130,128],[157,119],[183,128],[175,160],[145,165]],base);poly([[139,168],[178,164],[184,186],[160,202],[136,188]],base);
  for(let i=0;i<3;i++)line([[138,139+i*7],[159,146+i*7],[181,136+i*7]],light,1.5);
  oval(160,90,30,29,dark);poly([[133,73],[160,63],[187,73],[180,105],[160,120],[140,105]],base);
  poly([[139,87],[154,91],[151,99],[139,96]],'#e9f7b3');poly([[166,91],[181,87],[181,96],[169,99]],'#e9f7b3');line([[156,101],[160,108],[165,101]],ink,2);
  oval(160,143,8,10,'#ccf1a3');line([[160,134],[160,151]],'#ffffff',2);
  if(!juvenile){line([[247,66],[233,271]],'#5f4938',7);poly([[247,76],[233,45],[253,12],[269,49]],'#bbd78d');line([[251,25],[247,69]],'#edf4b8');poly([[226,214],[242,210],[248,224],[235,235],[223,226]],base);}
 }else if(index===1){
  // Furnace beast: massive jaw, segmented plated back and volcanic exhausts.
  poly([[80,187],[45,166],[21,175],[36,148],[20,132],[65,141],[102,156]],dark);
  oval(157,179,83,52,dark);
  for(let i=0;i<4;i++){const x=95+i*28;poly([[x-13,155],[x-9,126],[x+10,119-i%2*12],[x+23,150],[x+13,174]],base);line([[x-4,134],[x+11,151]],light,2);if(!juvenile)poly([[x-7,126],[x-9,96],[x+4,106],[x+12,123]],dark);}
  for(const x of [100,188]){poly([[x-12,205],[x+13,205],[x+22,258],[x+35,274],[x-12,278],[x-23,260]],dark);poly([[x-13,229],[x+13,227],[x+15,249],[x-16,251]],base);for(let j=0;j<3;j++)poly([[x-9+j*10,267],[x-7+j*10,278],[x+1+j*10,276]],light);}
  poly([[183,131],[214,102],[257,105],[279,126],[271,171],[238,192],[203,177]],base);
  poly([[214,130],[252,129],[279,141],[269,160],[221,162]],ink);
  for(let i=0;i<5;i++)poly([[224+i*9,135],[230+i*9,137],[226+i*9,148]],'#f5dfb7',null);
  poly([[214,116],[234,119],[229,127],[216,125]],'#fff274');poly([[246,115],[260,112],[261,121],[249,124]],'#fff274');
  poly([[229,106],[225,83],[239,57],[243,91],[249,106]],dark);
  line([[119,180],[135,188],[129,201],[149,211]],'#ffad51',5);line([[158,169],[170,183],[165,196],[182,206]],'#ff8449',4);
  if(!juvenile){for(let i=0;i<3;i++){const x=92+i*27;poly([[x,123],[x-6,97],[x+2,64],[x+8,91],[x+16,82],[x+12,122]],'#dc6b37');poly([[x+2,116],[x+1,94],[x+6,82],[x+9,114]],'#ffd382',null);}}
 }else{
  // Crystal dragon: angular wings, elongated tail, jewel armour and fin crown.
  for(const side of [-1,1]){c.save();c.translate(160,0);c.scale(side,1);poly([[20,139],[66,57],[133,35],[111,107],[77,162],[33,188]],dark);poly([[29,139],[72,74],[113,54],[94,113],[60,147]],base);line([[30,140],[72,74],[61,147]],light,2);if(!juvenile)poly([[67,81],[89,42],[126,17],[113,54]],light);poly([[14,209],[39,219],[52,266],[36,280],[14,271]],base);poly([[25,263],[45,264],[60,281],[16,281]],light);c.restore();}
  poly([[153,211],[135,241],[109,258],[72,253],[37,234],[59,263],[99,280],[141,269],[181,228]],dark);
  oval(160,167,35,61,base);poly([[139,137],[159,123],[181,139],[176,205],[159,224],[142,202]],light);
  for(let i=0;i<4;i++)line([[143,152+i*13],[160,161+i*13],[177,152+i*13]],base,2);
  for(const side of [-1,1]){poly([[160+side*22,142],[160+side*42,157],[160+side*54,193],[160+side*39,210],[160+side*31,176]],dark);poly([[160+side*37,188],[160+side*57,189],[160+side*62,208],[160+side*45,218]],base);}
  poly([[132,80],[148,64],[174,64],[190,85],[181,113],[160,129],[138,110]],dark);poly([[140,82],[160,73],[183,86],[175,105],[160,115],[145,104]],base);
  poly([[142,89],[155,94],[150,100],[142,97]],light);poly([[165,94],[179,89],[177,98],[169,100]],light);
  poly([[149,70],[160,26],[171,70],[161,84]],light);poly([[133,86],[119,51],[143,69]],base);poly([[179,69],[202,51],[187,86]],base);
  oval(160,144,9,13,'#b9efff');line([[160,133],[164,143],[158,152]],'#fff',2);
 }
 c.restore();}
root.GuardianArt={draw};
})(window);
