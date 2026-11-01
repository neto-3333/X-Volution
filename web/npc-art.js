(function(root){
'use strict';
function draw(c,x,y,p){const roles={ranger:['#43816b','#785737'],scholar:['#6573a0','#6c4850'],scout:['#d39456','#b67843'],smith:['#876050','#d4c0a5'],traveler:['#b89070','#554340'],sailor:['#447e9b','#433a44'],healer:['#b6ccaa','#9b7051']};const [coat,hair]=roles[p.role]||['#883f55','#383144'];c.save();c.translate(x,y);c.lineJoin='round';
 function poly(points,fill){c.beginPath();points.forEach((a,i)=>i?c.lineTo(...a):c.moveTo(...a));c.closePath();c.fillStyle=fill;c.fill();c.strokeStyle='#263745';c.lineWidth=.45;c.stroke();}function oval(x,y,rx,ry,fill){c.fillStyle=fill;c.beginPath();c.ellipse(x,y,rx,ry,0,0,Math.PI*2);c.fill();}
 oval(0,8,5.5,1.3,'#12232a55');poly([[-3,3],[-.5,3],[-.6,7],[-3.8,7]],'#374252');poly([[.5,3],[3,3],[3.8,7],[.6,7]],'#374252');poly([[-3.5,-4],[3.5,-4],[4.7,3],[2.8,5],[-3.6,4]],coat);poly([[-3,-3],[-5,-1],[-4.8,3],[-3,3]],coat);poly([[3,-3],[5,-1],[4.8,3],[3,3]],coat);oval(-4,3,1,.9,'#e9bf9b');oval(4,3,1,.9,'#e9bf9b');oval(0,-7,4.3,4.4,hair);oval(0,-6,3.6,3.5,'#e9bf9b');poly([[-4,-8],[-2,-11],[2,-11],[4,-8],[1,-8],[-2,-6]],hair);oval(-1.3,-6,.38,.5,'#273848');oval(1.3,-6,.38,.5,'#273848');c.strokeStyle='#a16b5d';c.lineWidth=.35;c.beginPath();c.moveTo(-.7,-4.3);c.lineTo(.7,-4.3);c.stroke();
 poly([[-3,-2],[3,-1.6],[3,-.8],[-3,-1.2]],'#e2c481');poly([[-.7,-3],[.7,-3],[.7,3],[-.7,3]],'#cfb28a');
 if(p.role==='scholar'){c.strokeStyle='#dccda2';c.lineWidth=.35;for(const x of [-1.4,1.4]){c.beginPath();c.arc(x,-6,1,0,Math.PI*2);c.stroke();}poly([[2,0],[5,-.5],[5.3,3],[2.4,3.5]],'#c6a275');}
 if(p.role==='ranger'||p.role==='scout'){poly([[-5,-9],[-3,-12],[2,-12],[4,-9],[6,-8],[-5,-8]],coat);poly([[1,-11],[3,-15],[4,-11]],'#c9dfac');}
 if(p.role==='smith'){poly([[-2,-2],[2,-2],[2.5,4],[-2.5,4]],'#664738');poly([[4,-2],[5,-2],[5,5],[4,5]],'#caa46e');poly([[3,-3],[7,-3],[7,-1],[3,-1]],'#a2adb4');}
 if(p.role==='sailor')poly([[-4,-10],[4,-10],[3,-8],[-3,-8]],'#cddbd8');if(p.role==='healer'){poly([[-4,-10],[4,-10],[4,-8],[-4,-8]],'#edf0da');c.fillStyle='#789375';c.fillRect(-.5,-10,1,3);c.fillRect(-1.5,-9,3,1);}
 c.restore();}
function portrait(canvas,p){const c=canvas.getContext('2d');c.clearRect(0,0,canvas.width,canvas.height);const scale=canvas.width/24;c.save();c.scale(scale,scale);draw(c,12,15,p);c.restore();}
root.NPCArt={draw,portrait};
})(window);
