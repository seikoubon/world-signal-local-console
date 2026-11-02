"use strict";
(() => {
 const svg=document.getElementById('earth'),box=svg.parentElement;
 let zoom=1,x=0,y=0,drag=null;
 function draw(){const w=1000/zoom,h=500/zoom;x=Math.max(0,Math.min(1000-w,x));y=Math.max(0,Math.min(500-h,y));svg.setAttribute('viewBox',`${x} ${y} ${w} ${h}`);box.classList.toggle('zoomed',zoom>1);document.getElementById('mapScale').textContent=zoom+'× · 拡大後にドラッグで移動';document.getElementById('mapIn').disabled=zoom>=8;document.getElementById('mapOut').disabled=zoom<=1;}
 function scale(next){const cx=x+500/zoom,cy=y+250/zoom;zoom=next;x=cx-500/zoom;y=cy-250/zoom;draw();}
 document.getElementById('mapIn').addEventListener('click',()=>scale(Math.min(8,zoom*2)));
 document.getElementById('mapOut').addEventListener('click',()=>scale(Math.max(1,zoom/2)));
 document.getElementById('mapReset').addEventListener('click',()=>{zoom=1;x=y=0;draw();});
 svg.addEventListener('pointerdown',e=>{if(zoom===1||e.button!==0)return;drag={id:e.pointerId,px:e.clientX,py:e.clientY,x,y};svg.setPointerCapture(e.pointerId);});
 svg.addEventListener('pointermove',e=>{if(!drag||drag.id!==e.pointerId)return;const r=svg.getBoundingClientRect(),unit=Math.min(r.width/(1000/zoom),r.height/(500/zoom));x=drag.x-(e.clientX-drag.px)/unit;y=drag.y-(e.clientY-drag.py)/unit;draw();});
 for(const name of ['pointerup','pointercancel','lostpointercapture'])svg.addEventListener(name,()=>{drag=null;});draw();
})();
