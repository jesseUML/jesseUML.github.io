import {WORLD_W} from './rooms.js';
const TAU=Math.PI*2;
export const C={ink:'#f3daba',gold:'#edb66e',mint:'#88d7bd',soft:'#a4bac2',dark:'#182334',board:'#285d55'};
export function r(c,x,y,w,h,fill){c.fillStyle=fill;c.fillRect(Math.round(x),Math.round(y),Math.ceil(w),Math.ceil(h));}
export function line(c,x,y,X,Y,stroke,width=2){c.strokeStyle=stroke;c.lineWidth=width;c.beginPath();c.moveTo(x,y);c.lineTo(X,Y);c.stroke()}
export function txt(c,text,x,y,size=14,color='#f7dcc0',align='left',font='mono'){c.textAlign=align;c.fillStyle=color;c.font=`${size}px ${font==='serif'?"Georgia,serif":font==='sans'?"system-ui,sans-serif":"'Courier New',monospace"}`;c.fillText(text,x,y);c.textAlign='left'}
export function box(c,x,y,w,h,fill,stroke='#000',sw=2){r(c,x,y,w,h,fill);if(stroke){c.strokeStyle=stroke;c.lineWidth=sw;c.strokeRect(x,y,w,h)}}
function radial(c,x,y,rx,ry,color,alpha=1){c.save();c.translate(x,y);c.scale(rx,ry);const g=c.createRadialGradient(0,0,0,0,0,1);g.addColorStop(0,color);g.addColorStop(1,'rgba(0,0,0,0)');c.globalAlpha=alpha;c.fillStyle=g;c.fillRect(-1,-1,2,2);c.restore()}
function seeded(i){let x=Math.sin(i*117.713+85.31)*12345.438;return x-Math.floor(x)}

export function skyWindow(c,x,y,w,h,room,time,camera){
  box(c,x-13,y-13,w+26,h+26,'#201c2a','#493c40',7);
  c.save();c.beginPath();c.rect(x,y,w,h);c.clip();
  const grad=c.createLinearGradient(0,y,0,y+h);grad.addColorStop(0,'#11182e');grad.addColorStop(.5,'#273454');grad.addColorStop(1,'#996e6b');r(c,x,y,w,h,grad);
  radial(c,x+w*.58,y+h*.81,w*.55,h*.75,'#ce7e75',.16);
  // A calm fixed starfield: no flickering dots or procedural re-seeding.
  for(let j=0;j<8;j++){
    const xx=Math.round(x+10+seeded(j+6)*(w-20));
    const yy=Math.round(y+10+seeded(j+83)*h*.32);
    r(c,xx,yy,1,1,'rgba(234,230,226,.24)');
  }
  const base=y+h;
  for(let depth=0;depth<2;depth++){
    const hmult=depth===0?.45:.68;
    const col=depth===0?'#313850':'#1b293d';
    const offset=Math.round(-camera*(depth===0?.045:.11));
    const first=Math.floor(-offset/42)-1;
    const count=Math.ceil(w/42)+4;
    for(let i=first;i<first+count;i++){
      // World-space building IDs stay constant as the camera scrolls.
      const bx=Math.round(x+i*42+offset);
      const bw=Math.round(30+seeded(i+depth*59)*18);
      const bh=Math.round(35+seeded(i+depth*17+7)*h*hmult);
      r(c,bx,base-bh,bw,bh,col);
      const rows=Math.floor((bh-16)/13), cols=Math.floor((bw-10)/9);
      for(let row=0;row<rows;row++)for(let column=0;column<cols;column++){
        // IMPORTANT: illumination is tied to the building/window identity,
        // never to moving screen coordinates (which caused sparkling lights).
        const lit=seeded((depth+1)*9999+(i+3)*527+row*71+column*17);
        if(lit>.69){
          const wx=bx+5+column*9, wy=base-bh+10+row*13;
          r(c,wx,wy,3,4,depth===0?'#736d78':'#aa8979');
        }
      }
    }
  }
  r(c,x+w*.50,y,5,h,'#332d35');r(c,x,y+h*.57,w,6,'#332d35');r(c,x+8,y+7,w-16,2,'#a08b8f44');c.restore();
  box(c,x-14,y+h,w+28,13,'#59434c','#201a2b',3);
}
function wall(c,style){let a,b;if(style==='workshop'){a='#39313d';b='#242c37'}else if(style==='gallery'){a='#42414b';b='#333644'}else{a='#373643';b='#292f3d'}let g=c.createLinearGradient(0,0,0,570);g.addColorStop(0,a);g.addColorStop(1,b);r(c,0,0,WORLD_W,540,g);r(c,0,0,WORLD_W,36,'#201f2b');r(c,0,36,WORLD_W,5,'#655261');r(c,0,522,WORLD_W,14,'#584954');r(c,0,534,WORLD_W,6,'#bc8c65');for(let i=0;i<WORLD_W;i+=185){r(c,i,42,2,480,'#ffffff09');}}
function floor(c,room){let grad=c.createLinearGradient(0,539,0,675);grad.addColorStop(0,'#513e40');grad.addColorStop(1,'#211f31');r(c,0,540,WORLD_W,135,grad);r(c,0,540,WORLD_W,8,'#b08060');for(let y=563;y<675;y+=30){r(c,0,y,WORLD_W,2,'#d4a27828')}for(let i=0;i<WORLD_W;i+=140){const f=i+50;line(c,f,540,f-30,675,'#161d2a3a',3)}radial(c,935,620,720,180,'#e4a063',.1)}
export function lamp(c,x,y,time,scale=1){c.save();c.translate(x,y);c.scale(scale,scale);line(c,0,-300,0,-12,'#201a27',6);box(c,-27,-18,54,9,'#3d3337','#110f19',3);c.fillStyle='#a47d56';c.beginPath();c.moveTo(-27,-10);c.lineTo(28,-10);c.lineTo(56,22);c.lineTo(-57,22);c.closePath();c.fill();r(c,-52,17,104,8,'#f0bc80');radial(c,0,30,190,125,'#ffbc74',.13);radial(c,0,29,65,30,'#ffd39a',.21);c.restore()}
function ceilingLights(c,positions,time){for(const p of positions)lamp(c,p[0],p[1],time,p[2]||1)}
function rug(c,x,y,w,h){c.save();c.fillStyle='#303d48';c.beginPath();c.ellipse(x+w/2,y+h/2,w/2,h/2,0,0,TAU);c.fill();c.strokeStyle='#917b79';c.lineWidth=5;c.stroke();c.restore()}
function plant(c,x,y,s=1){c.save();c.translate(x,y);c.scale(s,s);r(c,-24,-39,48,34,'#835c50');r(c,-18,-5,36,6,'#322b37');for(let i=0;i<7;i++){let ang=(i-3)*.32;const endx=Math.sin(ang)*53,endy=-65-Math.cos(ang)*35;line(c,0,-38,endx,endy,'#568373',5);c.fillStyle=i%2?'#54917b':'#385f59';c.beginPath();c.ellipse(endx,endy,14,28,ang,0,TAU);c.fill()}c.restore()}
function sign(c,x,y,w,h,title,sub){box(c,x,y,w,h,'#272b39','#bea27f',5);box(c,x+9,y+9,w-18,h-18,'#252b37','#535863',2);txt(c,title,x+w/2,y+36,21,'#f7d29f','center');txt(c,sub,x+w/2,y+57,10,'#a8c9c3','center')}
function door(c,x,y,label,side){const d=134;const top=y-230;box(c,x-d/2-13,top-13,d+26,259,'#181d2a','#9e7d62',7);box(c,x-d/2,top,d,240,'#3d3c45','#a28a72',4);r(c,x-d/2+12,top+12,d-24,10,'#5d6467');r(c,x-d/2+12,top+31,d-24,132,'#1b2639');radial(c,x,top+88,48,59,side==='gallery'?'#e9a76c':'#8db7ad',.18);r(c,x-d/2+14,top+171,d-28,51,'#433d43');r(c,x+(side==='gallery'?-45:37),top+181,8,19,'#e7bd85');box(c,x-89,top-57,178,32,'#232733','#d2a77b',3);txt(c,label,x,top-36,13,'#f3cf9f','center')}
function bench(c,x,y,w=400){box(c,x,y,w,21,'#8a614d','#2b242c',5);r(c,x+15,y+22,25,90,'#4b3a39');r(c,x+w-42,y+22,25,90,'#4b3a39');r(c,x+48,y+42,w-98,12,'#392e34');r(c,x+12,y-4,w-24,4,'#d8a476')}
function pcb(c,x,y,w=90,h=46,col='#225d55'){box(c,x,y,w,h,col,'#c8a76d',3);for(let i=0;i<12;i++){const xx=x+8+seeded(i+35)*(w-18),yy=y+8+seeded(i+57)*(h-14);r(c,xx,yy,6,3,'#caaf69');if(i%3===0)r(c,xx+4,yy+2,3,11,'#9ab2a6')}box(c,x+w*.35,y+h*.26,w*.24,h*.42,'#172933','#c2c6ae',2)}
function scope(c,x,y,time){box(c,x,y,172,117,'#222b31','#889393',7);box(c,x+12,y+13,122,84,'#0c262a','#51736c',3);r(c,x+17,y+18,112,74,'#0d2e32');for(let i=0;i<=6;i++){r(c,x+17+i*18,y+18,1,74,'#82e6c02d')}for(let i=0;i<=4;i++)r(c,x+17,y+18+i*18,112,1,'#82e6c02d');c.save();c.beginPath();c.rect(x+17,y+18,112,74);c.clip();c.beginPath();for(let i=0;i<=180;i++){const t=i/180*TAU;const ph=time*.72;const sx=x+73+52*Math.sin(3*t+ph);const sy=y+54+31*Math.sin(2*t+ph*.49);if(i===0)c.moveTo(sx,sy);else c.lineTo(sx,sy)}c.strokeStyle='#8effcf';c.lineWidth=2.6;c.shadowColor='#73ffc3';c.shadowBlur=9;c.stroke();c.restore();for(const yy of [y+28,y+53,y+78]){r(c,x+145,yy,14,12,'#748486');r(c,x+148,yy+2,8,7,'#33383c')}r(c,x+15,y+103,18,4,'#b2d7bc');txt(c,'X-Y',x+89,y+107,10,'#b1f7de','center')}
function fg(c,x,y){box(c,x,y,139,69,'#42444a','#92938c',5);box(c,x+11,y+12,65,38,'#1b3332','#7d988c',3);txt(c,'1.0kHz',x+19,y+28,9,'#a1eec2');txt(c,'SINE 1:1.5',x+16,y+43,8,'#91c8bc');for(let k=0;k<3;k++){r(c,x+92+k*13,y+24,9,11,'#9d9b90');r(c,x+92+k*13,y+40,9,5,'#333c40')}txt(c,'FG',x+13,y+62,8,'#f0b981')}
function rework(c,x,y){
  // Two tools, one temperature-controlled chassis: hot air + iron, not
  // two separate stations. Panel is readable even at game scale.
  radial(c,x+88,y+60,154,90,'#edb27b',.055);
  box(c,x,y,179,103,'#333a43','#b7b2a6',6);
  r(c,x+4,y+5,171,9,'#52565a');
  box(c,x+9,y+16,72,46,'#142c32','#809d94',3);
  box(c,x+91,y+16,75,46,'#152e32','#819f98',3);
  txt(c,'IRON',x+16,y+27,9,'#b6dbc4');txt(c,'AIR',x+99,y+27,9,'#a9d8d0');
  txt(c,'350',x+14,y+51,22,'#fac48d');txt(c,'300',x+95,y+51,22,'#a8ecdd');
  txt(c,'°C',x+60,y+51,10,'#ecb17c');txt(c,'°C',x+146,y+51,10,'#9cceca');
  r(c,x+86,y+17,2,78,'#92928a');
  for(const k of [0,1]){
    const xx=x+22+k*84;
    r(c,xx,y+69,13,8,'#948b83');
    r(c,xx+22,y+69,13,8,'#645d5a');
    r(c,xx+46,y+69,8,9,k===0?'#f8bf79':'#83d5c6');
    c.beginPath();c.arc(xx+30,y+89,5,0,TAU);c.fillStyle='#161b24';c.fill();
    c.strokeStyle='#bd9f78';c.lineWidth=2;c.stroke();
  }
  txt(c,'DUAL REWORK • 2 CH',x+87,y+101,9,'#ddcfb8','center');
}
function iron(c,x,y){
  // Iron cradle with wire guard, brass-wool cleaner and handle.
  box(c,x-22,y+17,105,28,'#252c35','#92918a',4);
  box(c,x-13,y+21,26,19,'#735336','#c19e69',2);
  for(let k=0;k<5;k++)line(c,x-9+k*5,y+24,x-13+k*6,y+36,'#dfbd6a',2);
  for(let k=0;k<3;k++)line(c,x+30+k*13,y+25,x+34+k*13,y+40,'#a7a49a',3);
  r(c,x+3,y+8,83,12,'#252d36');r(c,x+17,y+7,48,14,'#c3ab8f');
  r(c,x+69,y+7,18,12,'#45464a');r(c,x+85,y+11,34,4,'#a9b0a5');
  r(c,x+112,y+12,18,2,'#d7c39a');
  r(c,x+34,y+17,13,3,'#e4bb7e');
}
function hotAir(c,x,y){
  // Holstered blower with a thick handle and nozzle clearly separate from iron.
  box(c,x-19,y+19,108,30,'#34383e','#8d908b',4);
  r(c,x-12,y+23,23,19,'#1e2730');
  c.save();c.translate(x,y);c.rotate(-.16);
  box(c,0,0,94,29,'#59575b','#b9b6a9',4);
  box(c,15,6,51,17,'#d7cbbb','#777778',2);
  r(c,33,8,4,13,'#77777a');r(c,43,8,4,13,'#77777a');
  r(c,87,9,36,11,'#aaa9a4');r(c,119,12,17,5,'#8d8a87');
  c.restore();
  // Routing follows the handpieces to the chassis behind them.
  c.strokeStyle='#151d27';c.lineWidth=5;c.beginPath();
  c.moveTo(x+9,y+29);c.bezierCurveTo(x-3,y+66,x-72,y+68,x-111,y+49);c.stroke();
}
function hotPlate(c,x,y){
  // Low-profile ceramic PCB preheater: clearly a raised heating surface, with
  // thermal warning stripes, a board resting on top and front temperature UI.
  radial(c,x+66,y+22,135,70,'#ed9b60',.105);
  r(c,x+15,y+58,15,8,'#252c35');r(c,x+108,y+58,15,8,'#252c35');
  box(c,x,y+22,138,43,'#444953','#abb1aa',5);
  box(c,x+8,y+3,122,26,'#c1beb6','#e3d7bb',4);
  r(c,x+13,y+7,112,15,'#8c9390');
  for(let j=0;j<5;j++)r(c,x+17+j*22,y+10,10,9,'#7d8585');
  // Small PCB being preheated above the ceramic surface.
  box(c,x+40,y-7,60,23,'#27584d','#d8b77c',2);
  r(c,x+48,y-2,13,9,'#142b34');r(c,x+70,y-2,16,8,'#182a32');
  for(let j=0;j<4;j++)r(c,x+48+j*13,y+12,7,2,'#d9b981');
  box(c,x+11,y+38,65,19,'#19323a','#82a39a',2);
  txt(c,'165°C',x+17,y+52,12,'#fdc58d');
  for(let k=0;k<3;k++)r(c,x+89+k*11,y+42,7,8,'#abb6ac');
  txt(c,'HOT',x+102,y+35,8,'#e8c48e','center');
}
function repairLessonsCart(c,x,y){
  // A separate rolling tray immediately BESIDE the main ESD workbench.
  // It holds a spare/failed card and a small row of capacitors for rework notes.
  radial(c,x+57,y+135,110,80,'#df9b69',.09);
  box(c,x+2,y+35,126,18,'#77534a','#d2aa7a',3);
  r(c,x+10,y+54,7,104,'#514249');r(c,x+115,y+54,7,104,'#514249');
  box(c,x+7,y+100,115,9,'#694d45','#b78e70',2);
  for(const wx of [22,111]){r(c,x+wx-7,y+158,13,8,'#33323b');r(c,x+wx-4,y+159,7,5,'#959493')}
  // Propped card with intentional 'failed / rework' tape marker.
  c.save();c.translate(x+17,y+3);c.rotate(-.085);
  box(c,0,0,75,39,'#204d48','#baac81',3);
  for(let j=0;j<3;j++)for(let i=0;i<4;i++)r(c,9+i*16,8+j*9,10,5,'#adae9f');
  r(c,2,27,29,12,'#c79968');txt(c,'R1',x*0+17,36,10,'#231f2b','center');
  c.restore();
  // Short schematic: three ceramic capacitors in series, as a visual lesson
  // motif, not a claim about the real reset-line circuit topology.
  box(c,x+84,y+8,42,30,'#d8c6a8','#7d675d',2);
  line(c,x+89,y+23,x+96,y+23,'#594746',1.4);
  for(const px of [97,108,119]){
    line(c,x+px,y+18,x+px,y+28,'#594746',1.4);
    line(c,x+px+3,y+18,x+px+3,y+28,'#594746',1.4);
    if(px<119)line(c,x+px+3,y+23,x+px+11,y+23,'#594746',1.4);
  }
  r(c,x+32,y+51,67,14,'#282c34');txt(c,'REWORK',x+65,y+61,10,'#f1c18b','center');
  r(c,x+21,y+109,91,34,'#342c32');txt(c,'DEBUG',x+66,y+124,10,'#ebc291','center');
  txt(c,'LESSONS',x+66,y+137,10,'#a9cdc3','center');
}
function architecturePlan(c,x,y){
  // A pinned architecture printout, not an imaginary manufactured memory card.
  // High-level planned hierarchy; actual worker count remains a design target.
  c.save();
  box(c,x+5,y+7,224,124,'#1e222d','#121923',5);
  box(c,x,y,224,124,'#263748','#c7ac80',4);
  for(let gx=12;gx<224;gx+=13)r(c,x+gx,y+3,1,117,'#6d93923b');
  for(let gy=9;gy<124;gy+=13)r(c,x+4,y+gy,218,1,'#6d93923b');
  r(c,x+12,y+0,43,7,'#e0bb80');
  txt(c,'MCU CLUSTER / PLAN',x+112,y+18,11,'#f0d3ac','center');
  // Rounded rectangles and deliberate connectors form a little tree.
  const node=(xx,yy,ww,hh,label,fill='#2b6266')=>{
    box(c,x+xx,y+yy,ww,hh,fill,'#a8d1c7',2);
    txt(c,label,x+xx+ww/2,y+yy+hh/2+3,8,'#f3eee2','center');
  };
  node(68,26,88,22,'SUPERVISOR','#4a5b69');
  line(c,x+112,y+48,x+112,y+59,'#c3dfd4',2);
  line(c,x+58,y+59,x+166,y+59,'#c3dfd4',2);
  line(c,x+58,y+59,x+58,y+67,'#c3dfd4',2);
  line(c,x+166,y+59,x+166,y+67,'#c3dfd4',2);
  node(18,67,79,21,'MANAGER A');
  node(127,67,79,21,'MANAGER B');
  for(const mid of [58,166]){
    line(c,x+mid,y+88,x+mid,y+99,'#c3dfd4',2);
    const ox=mid===58?17:126;
    box(c,x+ox,y+99,82,16,'#425462','#a6bda9',2);
    for(let k=0;k<4;k++)r(c,x+ox+11+k*18,y+104,8,7,'#f4cc87');
  }
  txt(c,'WORKER CARDS ×4 MCU EACH',x+112,y+123,7,'#eac794','center');
  c.restore();
}
function laptop(c,x,y){radial(c,x+75,y+50,155,100,'#f2a263',.16);box(c,x,y,148,103,'#20232d','#867b77',6);box(c,x+9,y+8,130,84,'#4a3132','#b27d60',2);r(c,x+15,y+17,118,12,'#784c42');txt(c,'main.c',x+25,y+27,10,'#ffd09a');for(let i=0;i<5;i++)r(c,x+25,y+38+i*10,75-(i%3)*11,3,['#e9a86a','#99c5b8','#d59b78'][i%3]);r(c,x-16,y+103,178,13,'#63616b');r(c,x+40,y+108,65,2,'#b8a3a0')}
function drawRobot(c,x,y){c.save();c.translate(x,y);box(c,-84,-44,168,72,'#dab580','#fbe0a7',6);box(c,-55,-34,110,43,'#28615e','#c3dbbd',4);r(c,-30,-26,55,24,'#253942');line(c,2,-50,2,-89,'#ccbc9b',6);r(c,-5,-99,14,12,'#f5bf74');for(const xx of [-68,68]){c.beginPath();c.arc(xx,33,22,0,TAU);c.fillStyle='#151d28';c.fill();c.lineWidth=6;c.strokeStyle='#92a5a6';c.stroke()}c.restore()}
function artCard(c,x,y,w,h,kind){box(c,x,y,w,h,'#272e39','#b99d7b',7);box(c,x+14,y+14,w-28,h-62,'#1b3b39','#605c58',3);let px=x+31,py=y+36,pw=w-62,ph=h-113;
  if(kind==='card'){pcb(c,px,py,pw,ph,'#235a4a');for(let row=0;row<5;row++)for(let col=0;col<8;col++)r(c,px+8+col*(pw-18)/8,py+9+row*(ph-15)/5,6,6,(row+col)%3===0?'#f8c78a':'#5b9278')}
  else if(kind==='robot'){drawRobot(c,x+w/2,y+h*.53)}
  else {for(let i=0;i<5;i++){r(c,x+30+i*18,y+37+i*6,50,30,'#3d564e');line(c,x+35+i*18,y+45+i*6,x+60+i*18,y+50+i*6,'#c4a174',3)}}
  r(c,x+12,y+h-43,w-24,30,'#302a33');txt(c,kind==='card'?'STM32 BUSINESS CARD':kind==='robot'?'TEAM FISHIES':'REVISION STUDIES',x+w/2,y+h-24,12,'#f0d3ad','center')
}
function pedestal(c,x,y,w=200){box(c,x-w/2,y,w,34,'#767078','#bcb0a0',5);box(c,x-w/2+26,y+35,w-52,66,'#343642','#77717a',3);box(c,x-w/2+37,y+102,w-74,9,'#1b2636','#90826d',2)}
function drawGallery(c,time){wall(c,'gallery');floor(c,'gallery');rug(c,720,570,450,70);ceilingLights(c,[[405,121,.7],[900,122,.8],[1445,120,.7]],time);sign(c,588,94,550,81,'THE FINISHED COLLECTION','SOMETHING HANDMADE, SOMETHING LEARNED');
  // moulding, spotlights, polished frames
  r(c,0,185,WORLD_W,5,'#857b7a');r(c,0,480,WORLD_W,4,'#585263');
  artCard(c,496,215,305,239,'card');artCard(c,1012,215,305,239,'robot');
  for(const xx of [645,1160]){r(c,xx-50,186,100,7,'#9b816b');radial(c,xx,285,160,160,'#ffbf79',.10)}
  pedestal(c,647,485,245);pedestal(c,1164,485,248);r(c,580,486,137,7,'#d49f68');r(c,1104,486,117,7,'#d49f68');
  // Negative space on this wall is intentional: only complete projects hang here.
  line(c,1415,454,1690,454,'#907d74',2);
  door(c,111,450,'LOBBY','lobby');plant(c,310,543,.8);plant(c,1690,552,.75);
}
function drawLobby(c,time,camera){wall(c,'lobby');floor(c,'lobby');rug(c,847,559,360,90);skyWindow(c,515,105,420,263,'lobby',time,camera);ceilingLights(c,[[345,110,.65],[1105,122,.8],[1445,105,.6]],time);
  box(c,520,70,405,42,'#292a37','#c6a67f',4);txt(c,"JESSE'S STUDIO",721,98,27,'#f4d7ac','center');sign(c,990,197,251,108,'ABOUT THE BUILDER','AN ENGINEER, STILL LEARNING');
  // poster/engineering timeline / informational exhibit
  box(c,562,410,198,80,'#363b46','#d2b48a',5);txt(c,'HELLO THERE!',661,440,17,'#efd7b4','center');txt(c,'PRESS E TO SAY HI',661,463,10,'#b8cbc5','center');
  // reception desk with resume clipboard
  bench(c,1040,467,293);box(c,1117,425,115,40,'#dfc08d','#51404a',4);txt(c,'RESUME',1176,451,19,'#2c3442','center');r(c,1079,484,218,55,'#382f36');r(c,1114,502,149,8,'#d6a46f');
  // cozy seating corner
  box(c,335,455,170,80,'#7c625d','#ddad85',6);box(c,350,475,137,46,'#97776b','#bfa59a',4);r(c,366,523,10,20,'#443740');r(c,477,523,10,20,'#443740');
  // engineering objects
  box(c,1358,270,208,169,'#222f37','#b39b82',6);txt(c,'THIS WAY',1462,301,15,'#e7d1b1','center');txt(c,'THE GALLERY  →',1462,337,14,'#dca873','center');txt(c,'FRAMED BUILDS',1462,359,11,'#a6c8bb','center');pcb(c,1418,376,88,42);
  door(c,104,450,'WORKSHOP','workshop');door(c,1640,450,'GALLERY','gallery');plant(c,942,546,.9);plant(c,1289,548,.75);plant(c,270,548,.73);
  txt(c,'01 // ABOUT',991,188,11,'#f4cf93');
}
function shelves(c){for(const yy of [218,306]){r(c,530,yy,935,10,'#795b4d');r(c,530,yy+11,935,4,'#302e38')}for(let i=0;i<15;i++){const xx=545+i*58;const color=['#758d87','#5f7977','#956f62','#455965'][i%4];box(c,xx,183+(i%3)*3,44,34,color,'#2d383c',3);r(c,xx+8,201,28,3,'#e8c89b')}for(let i=0;i<7;i++){const xx=554+i*113;box(c,xx,265,84,41,i%2?'#3c5e60':'#4e5756','#a18e7e',3);r(c,xx+15,278,54,6,'#aa9b84')}}
function drawWorkshop(c,time,camera){wall(c,'workshop');floor(c,'workshop');skyWindow(c,296,108,327,215,'workshop',time,camera);ceilingLights(c,[[404,122,.6],[879,115,.95],[1360,118,.8]],time);
  txt(c,'WORK IN PROGRESS // PROTOTYPES & IDEAS',807,81,21,'#f1cb9e');txt(c,'A FEW LITTLE THINGS, AND A LOT OF DEBUGGING',807,106,11,'#b5c3bb');
  shelves(c);
  // big ESD bench; tools along rear and active PCB near front
  bench(c,300,486,1300);r(c,347,496,1170,17,'#1b4745');r(c,347,511,1170,6,'#628980');
  scope(c,302,367,time);fg(c,480,415);
  laptop(c,730,359);
  architecturePlan(c,937,352);
  rework(c,1175,371);iron(c,1370,426);hotAir(c,1376,386);hotPlate(c,1500,410);
  repairLessonsCart(c,1609,367);
  // bench tools, components, solder spool
  pcb(c,590,451,112,44,'#20574d');pcb(c,1408,464,112,37,'#2a5960');
  r(c,562,524,23,15,'#cda973');r(c,1051,521,18,17,'#9da2a5');r(c,1570,523,28,11,'#dfb27b');
  // The repair lessons display is on its own cart to the right of the bench.
  door(c,110,450,'LOBBY','lobby');plant(c,209,558,.75);
  // end-of-bench warm pool and small LEDs
  radial(c,922,460,450,130,'#fac47c',.06);
  for(const [x,y,col] of [[644,462,'#f5bd6a'],[1035,471,'#6ce2c4'],[1430,477,'#e6ac5e']]){radial(c,x,y,19,19,col,.18);r(c,x-2,y-2,4,4,col)}
}
export function drawRoom(c,room,time,camera){if(room==='gallery')drawGallery(c,time);else if(room==='workshop')drawWorkshop(c,time,camera);else drawLobby(c,time,camera)}
// An eight-pose, distance-driven pixel-art walk cycle. A shoe stays on the
// floor through its stance phase while the other lifts and steps forward.
// The pose clock advances from actual distance travelled, not elapsed time,
// so walking into a wall cannot animate the feet in place.
const WALK_POSES=[
  {foot: 22,lift:0}, {foot: 7,lift:0}, {foot:-8,lift:0}, {foot:-22,lift:0},
  {foot:-18,lift:7}, {foot:-5,lift:14}, {foot:11,lift:13}, {foot:22,lift:5}
];
function limb(c,ax,ay,bx,by,width,fill){
  c.save();c.strokeStyle=fill;c.lineWidth=width;c.lineCap='square';
  c.lineJoin='bevel';c.beginPath();c.moveTo(Math.round(ax),Math.round(ay));
  c.lineTo(Math.round(bx),Math.round(by));c.stroke();c.restore();
}
function leg(c,hipX,pose,blend,near){
  const ankleX=Math.round(hipX+(pose.foot-hipX)*blend);
  const lift=Math.round(pose.lift*blend);
  const kneeX=Math.round(hipX+(ankleX-hipX)*.54+((near?1:-1)*lift*.20));
  const kneeY=-23-Math.round(lift*.22);
  const color=near?'#35455e':'#263349';
  limb(c,hipX,-36,kneeX,kneeY,12,color);
  limb(c,kneeX,kneeY,ankleX,-10-lift,11,color);
  // The toe and heel visibly separate from the floor during the swing phase.
  r(c,ankleX-7,-9-lift,13,7,color);
  r(c,ankleX-10,-5-lift,22,7,near?'#101823':'#19212c');
  r(c,ankleX+3,-4-lift,8,2,'#707e87');
}
function arm(c,shoulderX,armSwing,behind){
  const elbowX=shoulderX+(behind?-8:6)+armSwing*.60;
  const wristX=elbowX+(behind?-3:7)+armSwing*.42;
  const sleeve=behind?'#705861':'#ca8361';
  limb(c,shoulderX,-64,elbowX,-51,11,sleeve);
  limb(c,elbowX,-51,wristX,-39,9,sleeve);
  r(c,Math.round(wristX-4),-41,9,8,'#dea682');
}
export function drawCharacter(c,x,feet,time,walking,facing,stepPhase=0,blend=walking?1:0,direction='side'){
  const b=Math.max(0,Math.min(1,blend));
  const index=Math.floor((((stepPhase%(Math.PI*2))+(Math.PI*2))%(Math.PI*2))/(Math.PI*2)*8)%8;
  const lead=WALK_POSES[index],trail=WALK_POSES[(index+4)%8];
  const bob=b*(index%4===1||index%4===2?3:0)+(1-b)*Math.sin(time*1.5)*.55;
  const swing=b*Math.round(11*Math.sin(index*Math.PI/4));
  c.save();c.translate(Math.round(x),Math.round(feet-bob));
  // Character points in the travel direction; depth movement gets a distinct
  // front/back view instead of always showing the same side-on pose.
  if(direction==='side')c.scale(facing,1);
  else c.scale(.96,1);
  // Stationary shadow helps ground the sprite instead of floating over tiles.
  radial(c,0,2,37,9,'#0c1320',.54);
  const projected=direction==='side'?1:.73;
  if(direction!=='side')c.scale(projected,1);
  // Far leg and rear arm, then near leg in front of the jacket hem.
  leg(c,7,trail,b,false);
  arm(c,-14,swing,true);
  leg(c,-7,lead,b,true);
  // Shoes stay below the coat; jacket follows a slight weight shift.
  r(c,-21,-73,42,39,'#4c3f4b');
  r(c,-18,-72,36,40,'#bd7959');
  r(c,-18,-72,8,35,'#64505c');
  r(c,-10,-66,24,28,'#d69670');
  r(c,0,-66,2,30,'#85564c');
  r(c,-11,-36,23,5,'#efb983');
  // The front arm swings opposite the leg, with a bent elbow and visible hand.
  arm(c,17,-swing,false);
  r(c,-7,-81,14,11,'#b97f5f');
  const headTilt=b*(index===2?-1:index===6?1:0);
  r(c,-15+headTilt,-109,30,30,'#dfab85');
  r(c,-17+headTilt,-112,34,12,'#282730');
  r(c,-18+headTilt,-103,7,13,'#282730');
  r(c,12+headTilt,-106,5,10,'#282730');
  if(direction!=='back'){
    const blink=(time%5.3>5.15);
    if(blink)r(c,1+headTilt,-95,12,2,'#36313a');
    else{
      r(c,1+headTilt,-97,4,4,'#292d39');
      r(c,10+headTilt,-96,3,3,'#292d39');
    }
    r(c,3+headTilt,-84,8,2,'#9a6555');
  }else{
    r(c,-11,-106,27,20,'#2d2b36');
  }
  // Little clipped-on badge, a recognisable detail even while walking.
  r(c,10,-57,9,12,'#f0dec0');r(c,12,-54,5,5,'#79bba9');
  c.restore();
}
export function drawMarker(c,x,y,time,near=false){const v=Math.sin(time*3)*4;c.save();c.shadowColor='#ffe1a8';c.shadowBlur=near?24:12;const color=near?'#ffe5b1':'#eec692';r(c,x-4,y-16+v,8,8,color);r(c,x-2,y-22+v,4,20,color);r(c,x-10,y-14+v,20,4,color);c.restore()}
