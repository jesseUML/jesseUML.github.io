import {WORLD_W} from './rooms.js';
const TAU=Math.PI*2;
export const C={ink:'#f3daba',gold:'#edb66e',mint:'#88d7bd',soft:'#a4bac2',dark:'#182334',board:'#285d55'};
export function r(c,x,y,w,h,fill){c.fillStyle=fill;c.fillRect(Math.round(x),Math.round(y),Math.ceil(w),Math.ceil(h));}
export function line(c,x,y,X,Y,stroke,width=2){c.strokeStyle=stroke;c.lineWidth=width;c.beginPath();c.moveTo(x,y);c.lineTo(X,Y);c.stroke()}
export function txt(c,text,x,y,size=14,color='#f7dcc0',align='left',font='mono'){c.textAlign=align;c.fillStyle=color;c.font=`${size}px ${font==='serif'?'Georgia,serif':font==='sans'?'system-ui,sans-serif':'Courier New,monospace'}`;c.fillText(text,x,y);c.textAlign='left'}
export function box(c,x,y,w,h,fill,stroke='#000',sw=2){r(c,x,y,w,h,fill);if(stroke){c.strokeStyle=stroke;c.lineWidth=sw;c.strokeRect(x,y,w,h)}}
function radial(c,x,y,rx,ry,color,alpha=1){c.save();c.translate(x,y);c.scale(rx,ry);const g=c.createRadialGradient(0,0,0,0,0,1);g.addColorStop(0,color);g.addColorStop(1,'rgba(0,0,0,0)');c.globalAlpha=alpha;c.fillStyle=g;c.fillRect(-1,-1,2,2);c.restore()}
function seeded(i){let x=Math.sin(i*117.713+85.31)*12345.438;return x-Math.floor(x)}
const DISPLAY_ASSETS={};
for(const [key,src] of Object.entries({
  stm32Front:'./assets/images/projects/stm32-rev1-front.webp',
  nfcFront:'./assets/images/projects/nfc-kicad-front.webp',
  fishies3d:'./assets/images/projects/team-fishies-3d.webp'
})){
  const img=new Image(); img.src=src; DISPLAY_ASSETS[key]=img;
}
function drawImageContain(c,img,x,y,w,h,bg='#131a22'){
  box(c,x,y,w,h,bg,'#5c5e63',2);
  if(!(img && img.complete && img.naturalWidth)) return false;
  const ir=img.naturalWidth/img.naturalHeight, br=w/h;
  let dw,dh,dx,dy;
  if(ir>br){dw=w; dh=w/ir; dx=x; dy=y+(h-dh)/2;}
  else {dh=h; dw=h*ir; dx=x+(w-dw)/2; dy=y;}
  c.drawImage(img,dx,dy,dw,dh);
  return true;
}
export function skyWindow(c,x,y,w,h,room,time,camera){
  box(c,x-13,y-13,w+26,h+26,'#201c2a','#493c40',7);
  c.save();c.beginPath();c.rect(x,y,w,h);c.clip();
  const grad=c.createLinearGradient(0,y,0,y+h);grad.addColorStop(0,'#11182e');grad.addColorStop(.5,'#273454');grad.addColorStop(1,'#996e6b');r(c,x,y,w,h,grad);
  radial(c,x+w*.58,y+h*.81,w*.55,h*.75,'#ce7e75',.16);
  for(let j=0;j<8;j++){const xx=Math.round(x+10+seeded(j+6)*(w-20));const yy=Math.round(y+10+seeded(j+83)*h*.32);r(c,xx,yy,1,1,'rgba(234,230,226,.24)')}
  const base=y+h;
  for(let depth=0;depth<2;depth++){
    const hmult=depth===0?.45:.68; const col=depth===0?'#313850':'#1b293d'; const offset=Math.round(-camera*(depth===0?.045:.11)); const first=Math.floor(-offset/42)-1; const count=Math.ceil(w/42)+4;
    for(let i=first;i<first+count;i++){
      const bx=Math.round(x+i*42+offset); const bw=Math.round(30+seeded(i+depth*59)*18); const bh=Math.round(35+seeded(i+depth*17+7)*h*hmult); r(c,bx,base-bh,bw,bh,col);
      const rows=Math.floor((bh-16)/13), cols=Math.floor((bw-10)/9);
      for(let row=0;row<rows;row++)for(let column=0;column<cols;column++){ const lit=seeded((depth+1)*9999+(i+3)*527+row*71+column*17); if(lit>.69){ const wx=bx+5+column*9, wy=base-bh+10+row*13; r(c,wx,wy,3,4,depth===0?'#736d78':'#aa8979'); } }
    }
  }
  r(c,x+w*.50,y,5,h,'#332d35');r(c,x,y+h*.57,w,6,'#332d35');r(c,x+8,y+7,w-16,2,'#a08b8f44');c.restore(); box(c,x-14,y+h,w+28,13,'#59434c','#201a2b',3);
}
function wall(c,style){let a,b;if(style==='workshop'){a='#39313d';b='#242c37'}else if(style==='gallery'){a='#42414b';b='#333644'}else{a='#373643';b='#242432'}const g=c.createLinearGradient(0,110,0,540);g.addColorStop(0,a);g.addColorStop(1,b);r(c,0,92,WORLD_W,440,g);r(c,0,60,WORLD_W,34,'#292936');r(c,0,94,WORLD_W,5,'#866e67')}
function floor(c,style){const g=c.createLinearGradient(0,495,0,675);g.addColorStop(0,style==='gallery'?'#5f4f4b':'#4e433f');g.addColorStop(1,style==='gallery'?'#312c34':'#292733');r(c,0,495,WORLD_W,180,g);for(let i=0;i<15;i++){const yy=506+i*12;line(c,0,yy,WORLD_W,yy,'#ffffff09',1)}for(let i=0;i<22;i++){const xx=5+i*80;line(c,xx,495,xx,675,'#201c24',2)}}
function rug(c,x,y,w,h){c.save();c.globalAlpha=.95;box(c,x-w/2,y,w,h,'#2f3944','#d1ab6e',4);for(let i=1;i<5;i++)r(c,x-w/2+20*i,y+8,w-40*i,h-16,'rgba(226,195,140,.09)');c.restore()}
function sign(c,x,y,w,h,t1,t2){box(c,x,y,w,h,'#1f2935','#d8b07b',5);txt(c,t1,x+w/2,y+31,18,'#f6dcc2','center');txt(c,t2,x+w/2,y+56,10,'#a8c8ba','center')}
function ceilingLights(c,items,time){for(const [x,y,scale] of items){radial(c,x,y+40,85*scale,55*scale,'#f4bc74',.11);box(c,x-22*scale,y,44*scale,10,'#5e4b48','#a89588',2);line(c,x,y-30,x,y,'#978381',2)}}
function door(c,x,y,label,target){box(c,x-39,y-122,78,122,'#2b2a38','#aa8f75',5);r(c,x-27,y-111,54,86,'#15212d');txt(c,label,x,y-5,11,'#f1d1aa','center')}
function plant(c,x,y,s=1){c.save();c.translate(x,y);c.scale(s,s);r(c,-24,-39,48,34,'#835c50');r(c,-18,-5,36,6,'#322b37');for(let i=0;i<7;i++){let ang=(i-3)*.32;const endx=Math.sin(ang)*53,endy=-65-Math.cos(ang)*35;line(c,0,-38,endx,endy,'#568373',5);c.fillStyle=i%2?'#54917b':'#385f59';c.beginPath();c.ellipse(endx,endy,14,28,ang,0,TAU);c.fill()}c.restore()}
function bench(c,x,y,w){box(c,x,y,w,57,'#754f48','#d3a576',5);r(c,x+20,y+8,w-40,11,'#62443d');for(const xx of [x+24,x+w-42])r(c,xx,y+57,15,78,'#47383f');for(let i=0;i<3;i++)r(c,x+88+i*52,y+17,24,24,'#be8a63')}
function pcb(c,x,y,w=90,h=46,col='#225d55'){box(c,x,y,w,h,col,'#c8a76d',3);for(let i=0;i<12;i++){const xx=x+8+seeded(i+35)*(w-18),yy=y+8+seeded(i+57)*(h-14);r(c,xx,yy,6,3,'#caaf69');if(i%3===0)r(c,xx+4,yy+2,3,11,'#9ab2a6')}box(c,x+w*.35,y+h*.26,w*.24,h*.42,'#172933','#c2c6ae',2)}
function scope(c,x,y,time){box(c,x,y,172,117,'#222b31','#889393',7);box(c,x+12,y+13,122,84,'#0c262a','#51736c',3);r(c,x+17,y+18,112,74,'#0d2e32');for(let i=0;i<=6;i++){r(c,x+17+i*18,y+18,1,74,'#82e6c02d')}for(let i=0;i<=4;i++)r(c,x+17,y+18+i*18,112,1,'#82e6c02d');c.save();c.beginPath();c.rect(x+17,y+18,112,74);c.clip();c.beginPath();for(let i=0;i<=180;i++){const t=i/180*TAU;const ph=time*.72;const sx=x+73+52*Math.sin(3*t+ph);const sy=y+54+31*Math.sin(2*t+ph*.49);if(i===0)c.moveTo(sx,sy);else c.lineTo(sx,sy)}c.strokeStyle='#8effcf';c.lineWidth=2.6;c.shadowColor='#73ffc3';c.shadowBlur=9;c.stroke();c.restore();for(const yy of [y+28,y+53,y+78]){r(c,x+145,yy,14,12,'#748486');r(c,x+148,yy+2,8,7,'#33383c')}r(c,x+15,y+103,18,4,'#b2d7bc');txt(c,'X-Y',x+89,y+107,10,'#b1f7de','center')}
function fg(c,x,y){box(c,x,y,139,69,'#42444a','#92938c',5);box(c,x+11,y+12,65,38,'#1b3332','#7d988c',3);txt(c,'1.0kHz',x+19,y+28,9,'#a1eec2');txt(c,'SINE 1:1.5',x+16,y+43,8,'#91c8bc');for(let k=0;k<3;k++){r(c,x+92+k*13,y+24,9,11,'#9d9b90');r(c,x+92+k*13,y+40,9,5,'#333c40')}txt(c,'FG',x+13,y+62,8,'#f0b981')}
function dualStation(c,x,y){
  radial(c,x+130,y+70,190,100,'#edb27b',.06);
  box(c,x,y,188,102,'#333a43','#b7b2a6',6);
  r(c,x+4,y+5,180,9,'#52565a');
  box(c,x+10,y+17,72,45,'#142c32','#809d94',3); box(c,x+106,y+17,72,45,'#152e32','#819f98',3);
  txt(c,'IRON',x+18,y+28,9,'#b6dbc4'); txt(c,'AIR',x+114,y+28,9,'#a9d8d0');
  txt(c,'350',x+16,y+51,22,'#fac48d'); txt(c,'300',x+112,y+51,22,'#a8ecdd'); txt(c,'°C',x+62,y+51,10,'#ecb17c'); txt(c,'°C',x+158,y+51,10,'#9cceca');
  r(c,x+92,y+17,2,78,'#92928a');
  for(const k of [0,1]){const xx=x+23+k*96;r(c,xx,y+70,13,8,'#948b83');r(c,xx+22,y+70,13,8,'#645d5a');r(c,xx+46,y+70,8,9,k===0?'#f8bf79':'#83d5c6');c.beginPath();c.arc(xx+30,y+89,5,0,TAU);c.fillStyle='#161b24';c.fill();c.strokeStyle='#bd9f78';c.lineWidth=2;c.stroke();}
  txt(c,'DUAL REWORK • SOLDER / HOT AIR',x+94,y+100,9,'#ddcfb8','center');
}
function ironDock(c,x,y){
  box(c,x,y,122,34,'#262d36','#97948d',4);
  box(c,x+8,y+6,25,21,'#765639','#c7a371',2);
  for(let k=0;k<5;k++)line(c,x+12+k*4,y+10,x+8+k*5,y+24,'#e0bf74',2);
  r(c,x+42,y+8,45,12,'#c8b193'); r(c,x+83,y+8,18,12,'#4b4e53'); r(c,x+100,y+12,22,4,'#abb0a5');
  for(let k=0;k<4;k++)line(c,x+46+k*12,y+23,x+50+k*12,y+31,'#9ea4a6',3);
}
function hotAirDock(c,x,y){
  box(c,x,y,124,34,'#2b3139','#97948d',4); r(c,x+10,y+10,20,14,'#1f2831');
  box(c,x+33,y+7,38,18,'#d4c7b5','#7a7b7a',2); r(c,x+68,y+8,19,16,'#59585d'); r(c,x+86,y+12,28,6,'#acabaa');
  line(c,x+22,y+24,x+15,y+33,'#161d27',4); line(c,x+22,y+24,x+8,y+32,'#161d27',4);
}
function hotPlate(c,x,y){
  radial(c,x+76,y+38,150,85,'#ef9b65',.12);
  box(c,x+4,y+26,144,52,'#3a4048','#9fa5a0',5); box(c,x+16,y+4,120,28,'#d7d3cb','#eee1c5',4);
  r(c,x+24,y+11,104,15,'#9ea29d'); for(let j=0;j<4;j++)r(c,x+33+j*23,y+15,11,7,'#7b8380');
  box(c,x+49,y-6,54,19,'#2a594f','#d6b67c',2); r(c,x+57,y-1,13,8,'#152a33'); r(c,x+75,y-1,16,8,'#152a33');
  box(c,x+15,y+42,64,20,'#172e36','#81a19a',2); txt(c,'165°C',x+20,y+56,12,'#fdc58d');
  for(let k=0;k<3;k++)r(c,x+92+k*12,y+46,8,9,'#aab1aa'); txt(c,'HOTPLATE',x+119,y+41,7,'#e8c48e','center');
}
function framedLesson(c,x,y){
  box(c,x,y,122,150,'#2d333e','#cfb089',6); box(c,x+10,y+10,102,130,'#202836','#6d655f',3);
  r(c,x+20,y+19,82,5,'#314759'); txt(c,'REWORK NOTE',x+61,y+21,8,'#f0d7ad','center');
  // Mini capacitor sketch inside the frame
  line(c,x+25,y+57,x+38,y+57,'#b7e0cf',2); line(c,x+46,y+57,x+58,y+57,'#b7e0cf',2); line(c,x+66,y+57,x+78,y+57,'#b7e0cf',2); line(c,x+86,y+57,x+99,y+57,'#b7e0cf',2);
  for(const px of [38,58,78]){ line(c,x+px,y+46,x+px,y+68,'#b7e0cf',2); line(c,x+px+5,y+46,x+px+5,y+68,'#b7e0cf',2);} 
  box(c,x+26,y+84,70,25,'#235b50','#aaccaa',2); r(c,x+31,y+89,18,11,'#182935'); r(c,x+57,y+89,10,6,'#b2aea3'); r(c,x+72,y+89,10,6,'#b2aea3');
  txt(c,'MEASURE',x+61,y+121,10,'#f0c58f','center'); txt(c,'REWORK / RETEST',x+61,y+134,8,'#a8d9cc','center');
}
function architecturePlan(c,x,y){
  c.save(); box(c,x+5,y+7,224,124,'#1e222d','#121923',5); box(c,x,y,224,124,'#263748','#c7ac80',4); for(let gx=12;gx<224;gx+=13)r(c,x+gx,y+3,1,117,'#6d93923b'); for(let gy=9;gy<124;gy+=13)r(c,x+4,y+gy,218,1,'#6d93923b'); r(c,x+12,y+0,43,7,'#e0bb80'); txt(c,'MCU CLUSTER / PLAN',x+112,y+18,11,'#f0d3ac','center');
  const node=(xx,yy,ww,hh,label,fill='#2b6266')=>{ box(c,x+xx,y+yy,ww,hh,fill,'#a8d1c7',2); txt(c,label,x+xx+ww/2,y+yy+hh/2+3,8,'#f3eee2','center'); };
  node(68,26,88,22,'SUPERVISOR','#4a5b69'); line(c,x+112,y+48,x+112,y+59,'#c3dfd4',2); line(c,x+58,y+59,x+166,y+59,'#c3dfd4',2); line(c,x+58,y+59,x+58,y+67,'#c3dfd4',2); line(c,x+166,y+59,x+166,y+67,'#c3dfd4',2); node(18,67,79,21,'MANAGER A'); node(127,67,79,21,'MANAGER B'); for(const mid of [58,166]){ line(c,x+mid,y+88,x+mid,y+99,'#c3dfd4',2); const ox=mid===58?17:126; box(c,x+ox,y+99,82,16,'#425462','#a6bda9',2); for(let k=0;k<4;k++)r(c,x+ox+11+k*18,y+104,8,7,'#f4cc87'); }
  txt(c,'WORKER CARDS ×4 MCU EACH',x+112,y+123,7,'#eac794','center'); c.restore();
}
function laptop(c,x,y){radial(c,x+75,y+50,155,100,'#f2a263',.16);box(c,x,y,148,103,'#20232d','#867b77',6);box(c,x+9,y+8,130,84,'#4a3132','#b27d60',2);r(c,x+15,y+17,118,12,'#784c42');txt(c,'main.c',x+25,y+27,10,'#ffd09a');for(let i=0;i<5;i++)r(c,x+25,y+38+i*10,75-(i%3)*11,3,['#e9a86a','#99c5b8','#d59b78'][i%3]);r(c,x-16,y+103,178,13,'#63616b');r(c,x+40,y+108,65,2,'#b8a3a0')}
function displayFrame(c,x,y,w,h,img,title){ box(c,x,y,w,h,'#272e39','#b99d7b',7); const innerY=y+14, innerH=h-62; drawImageContain(c,img,x+14,innerY,w-28,innerH,'#151c24'); r(c,x+12,y+h-43,w-24,30,'#302a33'); txt(c,title,x+w/2,y+h-24,12,'#f0d3ad','center'); }
function pedestal(c,x,y,w=200){box(c,x-w/2,y,w,34,'#767078','#bcb0a0',5);box(c,x-w/2+26,y+35,w-52,66,'#343642','#77717a',3);box(c,x-w/2+37,y+102,w-74,9,'#1b2636','#90826d',2)}
function drawGallery(c,time){ wall(c,'gallery'); floor(c,'gallery'); rug(c,720,570,450,70); ceilingLights(c,[[405,121,.7],[900,122,.8],[1445,120,.7]],time); sign(c,588,94,550,81,'THE FINISHED COLLECTION','SOMETHING HANDMADE, SOMETHING LEARNED'); r(c,0,185,WORLD_W,5,'#857b7a');r(c,0,480,WORLD_W,4,'#585263'); displayFrame(c,496,215,305,239,DISPLAY_ASSETS.stm32Front,'STM32 BUSINESS CARD'); displayFrame(c,1012,215,305,239,DISPLAY_ASSETS.fishies3d,'TEAM FISHIES'); for(const xx of [645,1160]){r(c,xx-50,186,100,7,'#9b816b');radial(c,xx,285,160,160,'#ffbf79',.10)} pedestal(c,647,485,245);pedestal(c,1164,485,248);r(c,580,486,137,7,'#d49f68');r(c,1104,486,117,7,'#d49f68'); line(c,1415,454,1690,454,'#907d74',2); door(c,111,450,'LOBBY','lobby'); plant(c,310,543,.8); plant(c,1690,552,.75); }
function drawLobby(c,time,camera){ wall(c,'lobby'); floor(c,'lobby'); rug(c,847,559,360,90); skyWindow(c,515,105,420,263,'lobby',time,camera); ceilingLights(c,[[345,110,.65],[1105,122,.8],[1445,105,.6]],time); box(c,520,70,405,42,'#292a37','#c6a67f',4); txt(c,"JESSE'S STUDIO",721,98,27,'#f4d7ac','center'); sign(c,990,197,251,108,'ABOUT THE BUILDER','AN ENGINEER, STILL LEARNING'); box(c,562,410,198,80,'#363b46','#d2b48a',5); txt(c,'HELLO THERE!',661,440,17,'#efd7b4','center'); txt(c,'PRESS E TO SAY HI',661,463,10,'#b8cbc5','center'); bench(c,1040,467,293); box(c,1117,425,115,40,'#dfc08d','#51404a',4); txt(c,'RESUME',1176,451,19,'#2c3442','center'); r(c,1079,484,218,55,'#382f36'); r(c,1114,502,149,8,'#d6a46f'); box(c,335,455,170,80,'#7c625d','#ddad85',6); box(c,350,475,137,46,'#97776b','#bfa59a',4); r(c,366,523,10,20,'#443740'); r(c,477,523,10,20,'#443740'); box(c,1358,270,208,169,'#222f37','#b39b82',6); txt(c,'THIS WAY',1462,301,15,'#e7d1b1','center'); txt(c,'THE GALLERY  →',1462,337,14,'#dca873','center'); txt(c,'FRAMED BUILDS',1462,359,11,'#a6c8bb','center'); pcb(c,1418,376,88,42); door(c,104,450,'WORKSHOP','workshop'); door(c,1640,450,'GALLERY','gallery'); plant(c,942,546,.9); plant(c,1289,548,.75); plant(c,270,548,.73); txt(c,'01 // ABOUT',991,188,11,'#f4cf93'); }
function shelves(c){ for(const yy of [218,306]){r(c,530,yy,935,10,'#795b4d');r(c,530,yy+11,935,4,'#302e38')} for(let i=0;i<15;i++){const xx=545+i*58;const color=['#758d87','#5f7977','#956f62','#455965'][i%4];box(c,xx,183+(i%3)*3,44,34,color,'#2d383c',3);r(c,xx+8,201,28,3,'#e8c89b')} for(let i=0;i<7;i++){const xx=554+i*113;box(c,xx,265,84,41,i%2?'#3c5e60':'#4e5756','#a18e7e',3);r(c,xx+15,278,54,6,'#aa9b84')} }
function drawWorkshop(c,time,camera){ wall(c,'workshop'); floor(c,'workshop'); skyWindow(c,296,108,327,215,'workshop',time,camera); ceilingLights(c,[[404,122,.6],[879,115,.95],[1360,118,.8]],time); txt(c,'WORK IN PROGRESS // PROTOTYPES & IDEAS',807,81,21,'#f1cb9e'); txt(c,'A FEW LITTLE THINGS, AND A LOT OF DEBUGGING',807,106,11,'#b5c3bb'); shelves(c); bench(c,300,486,1300); r(c,347,496,1170,17,'#1b4745'); r(c,347,511,1170,6,'#628980'); scope(c,302,367,time); fg(c,480,415); displayFrame(c,570,346,160,126,DISPLAY_ASSETS.nfcFront,'NFC CARD'); laptop(c,760,359); architecturePlan(c,937,352); dualStation(c,1175,371); ironDock(c,1365,393); hotAirDock(c,1365,435); hotPlate(c,1490,406); framedLesson(c,1567,294); pcb(c,760,451,112,44,'#20574d'); r(c,1061,521,18,17,'#9da2a5'); radial(c,922,460,450,130,'#fac47c',.06); for(const [x,y,col] of [[644,462,'#f5bd6a'],[1035,471,'#6ce2c4'],[1430,477,'#e6ac5e']]){radial(c,x,y,19,19,col,.18);r(c,x-2,y-2,4,4,col)} door(c,110,450,'LOBBY','lobby'); plant(c,209,558,.75); }
export function drawRoom(c,room,time,camera){ if(room==='gallery') drawGallery(c,time); else if(room==='workshop') drawWorkshop(c,time,camera); else drawLobby(c,time,camera); }
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
