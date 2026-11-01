import {roomWidth,BENCH_SLOTS,GALLERY,galleryFrames,checkPhoto,isCompleted} from './rooms.js';
import {projects} from '../data/projects.js';
// Walls and floors are painted wide enough for the widest room.
const PAINT_W=Math.max(...['lobby','workshop','gallery'].map(roomWidth))+60;
const TAU=Math.PI*2;
export const C={ink:'#f3daba',gold:'#edb66e',mint:'#88d7bd',soft:'#a4bac2',dark:'#182334',board:'#285d55'};
export function r(c,x,y,w,h,fill){c.fillStyle=fill;c.fillRect(Math.round(x),Math.round(y),Math.ceil(w),Math.ceil(h));}
export function line(c,x,y,X,Y,stroke,width=2){c.strokeStyle=stroke;c.lineWidth=width;c.beginPath();c.moveTo(x,y);c.lineTo(X,Y);c.stroke()}
export function txt(c,text,x,y,size=14,color='#f7dcc0',align='left',font='mono'){c.textAlign=align;c.fillStyle=color;c.font=`${size}px ${font==='serif'?'Georgia,serif':font==='sans'?'system-ui,sans-serif':'Consolas,"Cascadia Mono",Menlo,"DejaVu Sans Mono",monospace'}`;c.fillText(text,x,y);c.textAlign='left'}
export function box(c,x,y,w,h,fill,stroke='#000',sw=2){r(c,x,y,w,h,fill);if(stroke){c.strokeStyle=stroke;c.lineWidth=sw;c.strokeRect(x,y,w,h)}}
function radial(c,x,y,rx,ry,color,alpha=1){c.save();c.translate(x,y);c.scale(rx,ry);const g=c.createRadialGradient(0,0,0,0,0,1);g.addColorStop(0,color);g.addColorStop(1,'rgba(0,0,0,0)');c.globalAlpha=alpha;c.fillStyle=g;c.fillRect(-1,-1,2,2);c.restore()}
function seeded(i){let x=Math.sin(i*117.713+85.31)*12345.438;return x-Math.floor(x)}
const DISPLAY_ASSETS={};
for(const [key,src] of Object.entries({
  fishiesCheck:'./assets/images/projects/team-fishies-mentor-giant-check.webp',
  // CC0 stock photos from Wikimedia Commons; credits in README.
  stockRp2350:'./assets/images/decor/stock-rp2350-macro.webp',
  stockMemory:'./assets/images/decor/stock-memory-chips.webp'
})){
  const img=new Image(); img.src=src; DISPLAY_ASSETS[key]=img;
}
// Project photos load from each project's displaySrc, so swapping a photo is a data change.
const projectImages={};
function projectImage(p){if(!p.displaySrc)return null;if(!projectImages[p.id]){const img=new Image();img.src=p.displaySrc;projectImages[p.id]=img}return projectImages[p.id]}
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
function wall(c,style){let a,b;if(style==='workshop'){a='#39313d';b='#242c37'}else if(style==='gallery'){a='#42414b';b='#333644'}else{a='#373643';b='#242432'}const g=c.createLinearGradient(0,110,0,540);g.addColorStop(0,a);g.addColorStop(1,b);r(c,0,0,PAINT_W,60,'#1c1c28');r(c,0,58,PAINT_W,2,'#33313f');r(c,0,92,PAINT_W,440,g);r(c,0,60,PAINT_W,34,'#292936');r(c,0,94,PAINT_W,5,'#866e67')}
function floor(c,style){const g=c.createLinearGradient(0,495,0,675);g.addColorStop(0,style==='gallery'?'#5f4f4b':'#4e433f');g.addColorStop(1,style==='gallery'?'#312c34':'#292733');r(c,0,495,PAINT_W,180,g);for(let i=0;i<15;i++){const yy=506+i*12;line(c,0,yy,PAINT_W,yy,'#ffffff09',1)}for(let i=0;i<Math.ceil(PAINT_W/80);i++){const xx=5+i*80;line(c,xx,495,xx,675,'#201c24',2)}}
function rug(c,x,y,w,h){c.save();c.globalAlpha=.95;box(c,x-w/2,y,w,h,'#2f3944','#d1ab6e',4);for(let i=1;i<5;i++)r(c,x-w/2+20*i,y+8,w-40*i,h-16,'rgba(226,195,140,.09)');c.restore()}
function sign(c,x,y,w,h,t1,t2){box(c,x,y,w,h,'#1f2935','#d8b07b',5);txt(c,t1,x+w/2,y+31,18,'#f6dcc2','center');txt(c,t2,x+w/2,y+56,10,'#a8c8ba','center')}
function ceilingLights(c,items,time){for(const [x,y,scale] of items){radial(c,x,y+40,85*scale,55*scale,'#f4bc74',.11);box(c,x-22*scale,y,44*scale,10,'#5e4b48','#a89588',2);line(c,x,y-30,x,y,'#978381',2)}}
function door(c,x,y,label){
  const w=100,h=176,left=x-w/2,top=y-h;
  box(c,left,top,w,h,'#2b2a38','#aa8f75',6);
  r(c,left+12,top+12,w-24,h-46,'#15212d');
  r(c,left+12,top+12,w-24,3,'#2c3b4a');
  r(c,x+24,top+h*.52,5,15,'#d9b17c');
  txt(c,label,x,y-12,13,'#f1d1aa','center');
}
// Shared with main.js so the lobby display can show live discovery progress.
export const studioState={found:0,total:0};
const SEGMENTS={0:'abcdef',1:'bc',2:'abdeg',3:'abcdg',4:'bcfg',5:'acdfg',6:'acdefg',7:'abc',8:'abcdefg',9:'abcdfg',' ':''};
function segDigit(c,x,y,w,h,t,lit){
  const half=h/2,v=half-t*1.5;
  const seg={a:[x+t,y,w-2*t,t],b:[x+w-t,y+t,t,v],c:[x+w-t,y+half+t/2,t,v],d:[x+t,y+h-t,w-2*t,t],e:[x,y+half+t/2,t,v],f:[x,y+t,t,v],g:[x+t,y+half-t/2,w-2*t,t]};
  for(const k of lit){const [sx,sy,sw,sh]=seg[k];c.fillRect(Math.round(sx),Math.round(sy),Math.round(sw),Math.round(sh))}
}
// Draws a row of seven-segment digits: unlit "ghost" segments first, then the
// lit ones with a glow, like a real LED display.
function segRow(c,x,y,w,h,t,gap,text,color,ghost){
  c.fillStyle=ghost;
  [...text].forEach((ch,i)=>segDigit(c,x+i*(w+gap),y,w,h,t,'abcdefg'));
  c.save();c.fillStyle=color;c.shadowColor=color;c.shadowBlur=10;
  [...text].forEach((ch,i)=>segDigit(c,x+i*(w+gap),y,w,h,t,SEGMENTS[ch]??''));
  c.restore();
}
// Lobby wall display styled after the race timer in the Team Fishies photos:
// the visitor's local time on top, live exhibit discovery progress below.
function lobbyDisplay(c,x,y,time){
  const w=330,h=150,red='#ff4b3e',ghost='#2b1513';
  r(c,x+46,y-12,8,14,'#4a4450');r(c,x+w-54,y-12,8,14,'#4a4450');
  radial(c,x+w/2,y+h/2,w*.62,h*.8,'#ff3b30',.06);
  box(c,x,y,w,h,'#0d0e12','#3d3a42',5);
  box(c,x+12,y+12,w-24,h-24,'#08080b','#24222a',2);
  const now=new Date();const hr=now.getHours()%12||12;
  const clock=String(hr).padStart(2,' ')+String(now.getMinutes()).padStart(2,'0');
  const dw=40,dh=64,t=8,gap=12,left=x+40,top=y+30;
  segRow(c,left,top,dw,dh,t,gap,clock.slice(0,2),red,ghost);
  segRow(c,left+2*(dw+gap)+18,top,dw,dh,t,gap,clock.slice(2),red,ghost);
  // Colon blinks once a second unless the visitor prefers reduced motion.
  const colonOn=time===0||now.getSeconds()%2===0;
  c.save();c.fillStyle=colonOn?red:ghost;if(colonOn){c.shadowColor=red;c.shadowBlur=10}
  const cx=left+2*(dw+gap)+1;r(c,cx,top+18,8,8,c.fillStyle);r(c,cx,top+40,8,8,c.fillStyle);c.restore();
  txt(c,now.getHours()<12?'AM':'PM',x+w-30,top+14,11,'#d9a29a','center');
  txt(c,'LOCAL',x+w-30,top+62,8,'#7e7378','center');
  r(c,x+24,y+104,w-48,1,'#2a2830');
  txt(c,'EXHIBITS FOUND',x+26,y+128,11,'#c9b9a8');
  const done=studioState.total&&studioState.found>=studioState.total;
  const pc=done?'#7dffb2':red,pg=done?'#0b1a12':'#190c0b';
  const sw=15,sh=24,st=4,sg=6,sy=y+110,end=x+w-28;
  const totalText=String(studioState.total||0),foundText=String(studioState.found).padStart(totalText.length,' ');
  const totalX=end-totalText.length*(sw+sg)+sg;
  segRow(c,totalX,sy,sw,sh,st,sg,totalText,pc,pg);
  const slashX=totalX-16;
  c.save();c.strokeStyle=pc;c.lineWidth=3;c.shadowColor=pc;c.shadowBlur=8;c.beginPath();c.moveTo(slashX+9,sy);c.lineTo(slashX,sy+sh);c.stroke();c.restore();
  segRow(c,slashX-8-foundText.length*(sw+sg)+sg,sy,sw,sh,st,sg,foundText,pc,pg);
}
function stockPhoto(c,img,x,y,w,h){
  box(c,x,y,w,h,'#131a22','#8d7b6a',2);
  if(img && img.complete && img.naturalWidth)c.drawImage(img,x+2,y+2,w-4,h-4);
}
function plant(c,x,y,s=1){c.save();c.translate(x,y);c.scale(s,s);r(c,-24,-39,48,34,'#835c50');r(c,-18,-5,36,6,'#322b37');for(let i=0;i<7;i++){let ang=(i-3)*.32;const endx=Math.sin(ang)*53,endy=-65-Math.cos(ang)*35;line(c,0,-38,endx,endy,'#568373',5);c.fillStyle=i%2?'#54917b':'#385f59';c.beginPath();c.ellipse(endx,endy,14,28,ang,0,TAU);c.fill()}c.restore()}
function bench(c,x,y,w){box(c,x,y,w,57,'#754f48','#d3a576',5);r(c,x+20,y+8,w-40,11,'#62443d');for(const xx of [x+24,x+w-42])r(c,xx,y+57,15,78,'#47383f');for(let i=0;i<3;i++)r(c,x+88+i*52,y+17,24,24,'#be8a63')}
function pcb(c,x,y,w=90,h=46,col='#225d55'){box(c,x,y,w,h,col,'#c8a76d',3);for(let i=0;i<12;i++){const xx=x+8+seeded(i+35)*(w-18),yy=y+8+seeded(i+57)*(h-14);r(c,xx,yy,6,3,'#caaf69');if(i%3===0)r(c,xx+4,yy+2,3,11,'#9ab2a6')}box(c,x+w*.35,y+h*.26,w*.24,h*.42,'#172933','#c2c6ae',2)}
function scope(c,x,y,time){box(c,x,y,172,117,'#222b31','#889393',7);box(c,x+12,y+13,122,84,'#0c262a','#51736c',3);r(c,x+17,y+18,112,74,'#0d2e32');for(let i=0;i<=6;i++){r(c,x+17+i*18,y+18,1,74,'#82e6c02d')}for(let i=0;i<=4;i++)r(c,x+17,y+18+i*18,112,1,'#82e6c02d');c.save();c.beginPath();c.rect(x+17,y+18,112,74);c.clip();c.beginPath();for(let i=0;i<=180;i++){const t=i/180*TAU;const ph=time*.72;const sx=x+73+52*Math.sin(3*t+ph);const sy=y+54+31*Math.sin(2*t+ph*.49);if(i===0)c.moveTo(sx,sy);else c.lineTo(sx,sy)}c.strokeStyle='#8effcf';c.lineWidth=2.6;c.shadowColor='#73ffc3';c.shadowBlur=9;c.stroke();c.restore();for(const yy of [y+28,y+53,y+78]){r(c,x+145,yy,14,12,'#748486');r(c,x+148,yy+2,8,7,'#33383c')}r(c,x+15,y+103,18,4,'#b2d7bc');txt(c,'X-Y',x+89,y+107,10,'#b1f7de','center')}
function fg(c,x,y){box(c,x,y,139,69,'#42444a','#92938c',5);box(c,x+11,y+12,65,38,'#1b3332','#7d988c',3);txt(c,'1.0kHz',x+19,y+28,9,'#a1eec2');txt(c,'SINE 1:1.5',x+16,y+43,8,'#91c8bc');for(let k=0;k<3;k++){r(c,x+92+k*13,y+24,9,11,'#9d9b90');r(c,x+92+k*13,y+40,9,5,'#333c40')}txt(c,'FG',x+13,y+62,8,'#f0b981')}
function dualStation(c,x,y){
  // Face-on generic dual rework station. The handpieces are docked so only
  // their holders and a little of each tool are visible from the front.
  c.save();c.translate(x,y);
  radial(c,128,118,205,112,'#f0ab74',.085);
  // Duplex wall outlet behind the bench. The station's power cord is plugged
  // into the top receptacle, drops onto the bench, and enters the station side.
  box(c,-64,38,28,44,'#d8d1c2','#8e877b',2);
  for(const oy of [44,62]){r(c,-57,oy+2,2,7,'#3b3833');r(c,-46,oy+2,2,7,'#3b3833');r(c,-51,oy+11,2,3,'#3b3833')}
  r(c,-51,59,2,2,'#8e877b');
  c.strokeStyle='#141c27';c.lineWidth=5;c.lineCap='round';
  c.beginPath();c.moveTo(-50,62);c.bezierCurveTo(-50,128,-24,150,18,149);c.lineTo(66,141);c.stroke();
  c.strokeStyle='#2d3948';c.lineWidth=1.4;
  c.beginPath();c.moveTo(-48,64);c.bezierCurveTo(-48,126,-23,147,18,146);c.lineTo(66,138);c.stroke();
  box(c,-59,42,18,16,'#1b2129','#3e4651',2);
  r(c,-53,57,6,6,'#1b2129');
  // Left hot-air handpiece, mostly hidden in its side dock.
  box(c,-1,92,58,33,'#252b34','#7b8285',4);
  box(c,7,99,23,18,'#111822','#8e9699',2);
  c.save();c.translate(15,95);c.rotate(-0.1);
  box(c,-5,-52,14,46,'#303741','#778286',2);
  for(let j=0;j<4;j++)r(c,-3,-46+j*9,10,3,'#5d646b');
  box(c,1,-67,8,15,'#989d9e','#c9c5b8',2); r(c,3,-76,4,10,'#d7d2c4');
  c.restore();

  // Main station body seen almost straight-on.
  c.fillStyle='#0c8a82';c.strokeStyle='#12353b';c.lineWidth=5;
  c.beginPath();c.moveTo(63,12);c.lineTo(176,12);c.lineTo(196,30);c.lineTo(196,146);c.lineTo(63,146);c.closePath();c.fill();c.stroke();
  r(c,67,15,106,8,'#23a193'); r(c,172,21,18,115,'#19a297');

  // Front control panel.
  box(c,78,24,102,122,'#1f242d','#55595e',6);
  box(c,84,30,90,110,'#262a33','#121720',2);
  txt(c,'DUAL REWORK',129,43,10,'#e3e0d7','center');
  txt(c,'TEMP / °C',129,53,7,'#99a6ad','center');
  box(c,101,58,56,31,'#080b16','#474751',2);
  c.save();c.shadowColor='#ff384a';c.shadowBlur=7; txt(c,'480',129,82,25,'#f13e52','center'); c.restore();
  for(const xx of [101,129,157]){
    c.beginPath();c.arc(xx,101,8,0,TAU);c.fillStyle='#1ab0a4';c.fill();
    c.strokeStyle='#0f6866';c.lineWidth=2;c.stroke();
  }
  txt(c,'UP',101,93,5,'#e4e0cc','center'); txt(c,'DOWN',129,93,5,'#e4e0cc','center'); txt(c,'SET',157,93,5,'#e4e0cc','center');
  c.beginPath();c.arc(129,123,17,0,TAU);c.fillStyle='#151b23';c.fill();c.lineWidth=3;c.strokeStyle='#858b91';c.stroke();
  c.beginPath();c.arc(129,123,8,0,TAU);c.fillStyle='#3a414d';c.fill(); line(c,129,110,135,117,'#d5d9d5',2);
  txt(c,'AIR',94,138,7,'#d6d4cb'); txt(c,'IRON',145,138,7,'#d6d4cb');
  r(c,95,139,10,8,'#10141c'); r(c,148,139,10,8,'#10141c');

  // Visible cables from the front-panel sockets to each docked handpiece.
  c.strokeStyle='#131b26'; c.lineWidth=4.5; c.lineCap='round';
  c.beginPath();
  c.moveTo(100,143); c.bezierCurveTo(83,151,59,150,43,143); c.bezierCurveTo(27,136,21,126,19,116);
  c.stroke();
  c.beginPath();
  c.moveTo(153,143); c.bezierCurveTo(178,150,205,147,226,138); c.bezierCurveTo(234,135,237,128,239,111);
  c.stroke();
  // subtle highlight so the cables read better against the warm bench light
  c.strokeStyle='#2d3948'; c.lineWidth=1.4;
  c.beginPath();
  c.moveTo(100,143); c.bezierCurveTo(84,149,61,148,45,142); c.bezierCurveTo(31,136,25,127,23,118);
  c.stroke();
  c.beginPath();
  c.moveTo(153,143); c.bezierCurveTo(177,148,202,146,222,138); c.bezierCurveTo(230,135,233,127,235,113);
  c.stroke();

  // Right iron stand, mostly front-on; only the handle and tip peek out.
  box(c,204,103,62,35,'#2a3038','#8b8f8f',4);
  box(c,230,95,22,16,'#141b24','#9ca3a3',3);
  c.save();c.translate(239,95);c.rotate(.05);
  box(c,-5,-40,10,29,'#17a094','#1b6967',2);
  box(c,-6,-54,12,15,'#90999d','#c8c5b7',2); r(c,-2,-64,4,11,'#ddd7c9');
  c.restore();

  // Brass wool pot near the iron stand.
  box(c,214,131,38,14,'#6c6f74','#b0b5b1',3);
  for(let j=0;j<6;j++)line(c,220+j*5,134,222+j*4,142,'#c99f59',2);
  c.restore();
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
  c.save();c.translate(x,y);c.scale(.86,1);x=0;y=0;
  box(c,x,y,122,150,'#2d333e','#cfb089',6); box(c,x+10,y+10,102,130,'#202836','#6d655f',3);
  r(c,x+20,y+19,82,5,'#314759'); txt(c,'REWORK NOTE',x+61,y+21,8,'#f0d7ad','center');
  // Mini capacitor sketch inside the frame
  line(c,x+25,y+57,x+38,y+57,'#b7e0cf',2); line(c,x+46,y+57,x+58,y+57,'#b7e0cf',2); line(c,x+66,y+57,x+78,y+57,'#b7e0cf',2); line(c,x+86,y+57,x+99,y+57,'#b7e0cf',2);
  for(const px of [38,58,78]){ line(c,x+px,y+46,x+px,y+68,'#b7e0cf',2); line(c,x+px+5,y+46,x+px+5,y+68,'#b7e0cf',2);} 
  box(c,x+26,y+84,70,25,'#235b50','#aaccaa',2); r(c,x+31,y+89,18,11,'#182935'); r(c,x+57,y+89,10,6,'#b2aea3'); r(c,x+72,y+89,10,6,'#b2aea3');
  txt(c,'MEASURE',x+61,y+121,10,'#f0c58f','center'); txt(c,'REWORK / RETEST',x+61,y+134,8,'#a8d9cc','center');
  c.restore();
}
function architecturePlan(c,x,y){
  c.save(); box(c,x+5,y+7,224,124,'#1e222d','#121923',5); box(c,x,y,224,124,'#263748','#c7ac80',4); for(let gx=12;gx<224;gx+=13)r(c,x+gx,y+3,1,117,'#6d93923b'); for(let gy=9;gy<124;gy+=13)r(c,x+4,y+gy,218,1,'#6d93923b'); r(c,x+12,y+0,43,7,'#e0bb80'); txt(c,'MCU CLUSTER / PLAN',x+112,y+18,11,'#f0d3ac','center');
  const node=(xx,yy,ww,hh,label,fill='#2b6266')=>{ box(c,x+xx,y+yy,ww,hh,fill,'#a8d1c7',2); txt(c,label,x+xx+ww/2,y+yy+hh/2+3,8,'#f3eee2','center'); };
  node(68,26,88,22,'SUPERVISOR','#4a5b69'); line(c,x+112,y+48,x+112,y+59,'#c3dfd4',2); line(c,x+58,y+59,x+166,y+59,'#c3dfd4',2); line(c,x+58,y+59,x+58,y+67,'#c3dfd4',2); line(c,x+166,y+59,x+166,y+67,'#c3dfd4',2); node(18,67,79,21,'MANAGER A'); node(127,67,79,21,'MANAGER B'); for(const mid of [58,166]){ line(c,x+mid,y+88,x+mid,y+99,'#c3dfd4',2); const ox=mid===58?17:126; box(c,x+ox,y+99,82,16,'#425462','#a6bda9',2); for(let k=0;k<4;k++)r(c,x+ox+11+k*18,y+104,8,7,'#f4cc87'); }
  txt(c,'WORKER CARDS ×4 MCU EACH',x+112,y+123,7,'#eac794','center'); c.restore();
}
function laptop(c,x,y){radial(c,x+75,y+50,155,100,'#f2a263',.16);box(c,x,y,148,103,'#20232d','#867b77',6);box(c,x+9,y+8,130,84,'#4a3132','#b27d60',2);r(c,x+15,y+17,118,12,'#784c42');txt(c,'main.c',x+25,y+27,10,'#ffd09a');for(let i=0;i<5;i++)r(c,x+25,y+38+i*10,75-(i%3)*11,3,['#e9a86a','#99c5b8','#d59b78'][i%3]);r(c,x-16,y+103,178,13,'#63616b');r(c,x+40,y+108,65,2,'#b8a3a0')}
function displayFrame(c,x,y,w,h,img,title){ box(c,x,y,w,h,'#272e39','#b99d7b',7); const innerY=y+14, innerH=h-62; const shown=drawImageContain(c,img,x+14,innerY,w-28,innerH,'#151c24'); if(!shown&&!img)txt(c,'PHOTO COMING SOON',x+w/2,innerY+innerH/2+4,11,'#9fb6b0','center'); r(c,x+12,y+h-43,w-24,30,'#302a33'); txt(c,title,x+w/2,y+h-24,12,'#f0d3ad','center'); }
function pedestal(c,x,y,w=200){box(c,x-w/2,y,w,34,'#767078','#bcb0a0',5);box(c,x-w/2+26,y+35,w-52,66,'#343642','#77717a',3);box(c,x-w/2+37,y+102,w-74,9,'#1b2636','#90826d',2)}
// Gallery layout comes from rooms.js: one frame and pedestal per completed project.
function drawGallery(c,time){
  const W=roomWidth('gallery');
  wall(c,'gallery'); floor(c,'gallery');
  const spanL=GALLERY.start, spanR=galleryFrames.length?galleryFrames.at(-1).x+GALLERY.frameW:GALLERY.start+GALLERY.frameW;
  const mid=(spanL+spanR)/2;
  rug(c,mid,570,Math.max(400,spanR-spanL-60),70);
  const lights=[[405,121,.7]];for(let x=900;x<W-200;x+=545)lights.push([x,122,.8]);
  ceilingLights(c,lights,time);
  sign(c,mid-275,94,550,81,'THE FINISHED COLLECTION','SOMETHING HANDMADE, SOMETHING LEARNED');
  r(c,0,185,PAINT_W,5,'#857b7a');r(c,0,480,PAINT_W,4,'#585263');
  for(const f of galleryFrames){
    const p=f.project;
    displayFrame(c,f.x,GALLERY.frameY,GALLERY.frameW,GALLERY.frameH,projectImage(p),p.wallTitle ?? p.title.toUpperCase());
    r(c,f.cx-50,186,100,7,'#9b816b');radial(c,f.cx,285,160,160,'#ffbf79',.10);
    pedestal(c,f.cx,485,246);r(c,f.cx-62,486,124,7,'#d49f68');
  }
  if(checkPhoto){const cx=checkPhoto.x+checkPhoto.w/2;r(c,cx-50,206,100,7,'#9b816b');radial(c,cx,300,140,140,'#ffbf79',.09);displayFrame(c,checkPhoto.x,225,checkPhoto.w,checkPhoto.h,DISPLAY_ASSETS.fishiesCheck,'ROUND 3 · 1ST PLACE')}
  door(c,111,494,'LOBBY'); plant(c,310,543,.8); plant(c,W-60,552,.75);
}
function drawLobby(c,time,camera){ wall(c,'lobby'); floor(c,'lobby'); rug(c,847,559,360,90); skyWindow(c,515,105,420,263,'lobby',time,camera); ceilingLights(c,[[345,110,.65],[1150,122,.8],[1445,105,.6]],time); lobbyDisplay(c,985,190,time); box(c,520,70,405,42,'#292a37','#c6a67f',4); txt(c,"JESSE'S STUDIO",721,98,27,'#f4d7ac','center'); box(c,562,410,198,80,'#363b46','#d2b48a',5); txt(c,'HELLO THERE!',661,440,17,'#efd7b4','center'); txt(c,'PRESS E TO SAY HI',661,463,10,'#b8cbc5','center'); bench(c,1040,467,293); box(c,1117,425,115,40,'#dfc08d','#51404a',4); txt(c,'RESUME',1176,451,19,'#2c3442','center'); r(c,1079,484,218,55,'#382f36'); r(c,1114,502,149,8,'#d6a46f'); box(c,345,452,150,57,'#866762','#d7ae9c',5); box(c,354,461,64,39,'#9b796f','#bfa59a',2); box(c,422,461,64,39,'#947168','#bfa59a',2); box(c,335,494,170,41,'#7c5752','#ddad85',5); box(c,349,499,142,27,'#9d7568','#c9997d',3); line(c,420,500,420,525,'#79564f',2); r(c,327,478,22,57,'#714e4b'); r(c,491,478,22,57,'#714e4b'); r(c,362,534,12,12,'#443740'); r(c,466,534,12,12,'#443740'); box(c,1358,270,208,169,'#222f37','#b39b82',6); stockPhoto(c,DISPLAY_ASSETS.stockRp2350,1372,286,86,64); stockPhoto(c,DISPLAY_ASSETS.stockMemory,1466,286,86,64); txt(c,'THIS WAY',1462,382,12,'#a6c8bb','center'); txt(c,'THE GALLERY  →',1462,410,15,'#dca873','center'); door(c,104,494,'WORKSHOP'); door(c,1640,494,'GALLERY'); plant(c,942,546,.9); plant(c,1289,548,.75); plant(c,270,548,.73); }
function shelves(c,x0,x1){ for(const yy of [218,306]){r(c,x0,yy,x1-x0,10,'#795b4d');r(c,x0,yy+11,x1-x0,4,'#302e38')} const top=Math.floor((x1-x0-30)/60); for(let i=0;i<top;i++){const xx=x0+15+i*60;const color=['#758d87','#5f7977','#956f62','#455965'][i%4];box(c,xx,183+(i%3)*3,44,34,color,'#2d383c',3);r(c,xx+8,201,28,3,'#e8c89b')} const low=Math.floor((x1-x0-30)/126); for(let i=0;i<low;i++){const xx=x0+30+i*126;box(c,xx,265,84,41,i%2?'#3c5e60':'#4e5756','#a18e7e',3);r(c,xx+15,278,54,6,'#aa9b84')} }
// The STM32 LED business card propped on a stand and tethered to the laptop,
// running an animation on its 8×8 matrix as if mid-firmware-flash.
function cardOnStand(c,x,y,time){
  const w=96,h=58;
  radial(c,x+w/2,y+h/2,90,60,'#ffc47a',.08);
  box(c,x-6,y+h,w+12,12,'#3a3f48','#8f9493',2);
  r(c,x+w/2-4,y+h-6,8,8,'#2a2f37');
  box(c,x,y,w,h,'#0b0e13','#3b3a41',2);
  for(const [hx,hy] of [[x+4,y+4],[x+w-6,y+h-6]])r(c,hx,hy,2,2,'#c9a46b');
  txt(c,'Jesse Silva',x+70,y+12,8,'#d8e6e2','center','serif');
  box(c,x+12,y+14,12,12,'#1d2128','#7c8288',1);
  for(let i=0;i<4;i++){r(c,x+8+i*4,y+30,2,2,'#7c8288')}
  c.beginPath();c.arc(x+20,y+45,9,0,Math.PI*2);c.fillStyle='#8d7d74';c.fill();
  c.beginPath();c.arc(x+20,y+45,5,0,Math.PI*2);c.fillStyle='#5f5450';c.fill();
  for(let row=0;row<8;row++)for(let col=0;col<8;col++){
    const wave=Math.round(3.5+3.5*Math.sin(col*.85+time*3.2));
    const on=Math.abs(row-wave)<1;
    r(c,x+48+col*5.4,y+17+row*4.9,3,3,on?'#ffd08a':'#2a2622');
  }
}
function drawWorkshop(c,time,camera){
  const W=roomWidth('workshop');
  wall(c,'workshop'); floor(c,'workshop');
  skyWindow(c,296,108,327,215,'workshop',time,camera);
  ceilingLights(c,[[404,122,.6],[900,115,.95],[1400,118,.8],[1860,118,.8],[2270,118,.8]],time);
  txt(c,'WORK IN PROGRESS // PROTOTYPES & IDEAS',W/2,40,21,'#f1cb9e','center');
  txt(c,'A FEW LITTLE THINGS, AND A LOT OF DEBUGGING',W/2,81,11,'#b5c3bb','center');
  shelves(c,660,2010);
  bench(c,300,486,1750); r(c,347,496,1656,17,'#1b4745'); r(c,347,511,1656,6,'#628980');
  radial(c,1150,460,760,130,'#fac47c',.06);
  scope(c,302,367,time); fg(c,488,415);
  laptop(c,920,359);
  c.strokeStyle='#131b26';c.lineWidth=3;c.lineCap='round';c.beginPath();c.moveTo(1074,468);c.bezierCurveTo(1090,480,1096,470,1104,452);c.stroke();
  cardOnStand(c,1104,416,time);
  dualStation(c,1600,331);
  hotPlate(c,1890,406);
  // Capstone gets its own bench section with a banner and an ESP32 remote prop.
  bench(c,2090,486,360); r(c,2112,496,316,17,'#22385a'); r(c,2112,511,316,6,'#5a7aa8');
  sign(c,2120,136,300,70,'CAPSTONE','SENIOR DESIGN · ACCESSIBLE CAR WASH');
  remoteProp(c,2340,404);
  framedLesson(c,2490,294);
  // Each project's bench spot: its display while WIP, or a note once it moves to the gallery.
  for(const p of projects){
    const s=BENCH_SLOTS[p.id];if(!s)continue;
    if(isCompleted(p)){movedNote(c,s.x+s.w/2,s.y+s.h);continue}
    if(s.art==='plan')architecturePlan(c,s.x,s.y);
    else displayFrame(c,s.x,s.y,s.w,s.h,projectImage(p),s.label);
    const cx=s.x+s.w/2;radial(c,cx,s.y+s.h-8,19,19,'#f5bd6a',.18);r(c,cx-2,s.y+s.h-10,4,4,'#f5bd6a');
  }
  door(c,110,494,'LOBBY'); plant(c,209,558,.75);
}
// Left on a bench spot after its project is finished and hung in the gallery.
function movedNote(c,cx,bottom){
  box(c,cx-74,bottom-50,148,46,'#f0d98a','#b39550',2);
  r(c,cx-14,bottom-55,28,9,'#d9d2c3aa');
  txt(c,'FINISHED!',cx,bottom-31,12,'#3a3226','center');
  txt(c,'NOW IN THE GALLERY →',cx,bottom-15,9,'#5a4a33','center');
}
// Handheld ESP32 remote, a stand-in for the capstone's wireless controller.
function remoteProp(c,x,y){
  radial(c,x+40,y+40,70,50,'#7fb6ff',.07);
  line(c,x+62,y+8,x+70,y-30,'#9aa3ab',3); r(c,x+67,y-34,6,6,'#d9b17c');
  box(c,x,y,80,68,'#2a3140','#8a93a0',3);
  box(c,x+8,y+8,40,22,'#1b4d3e','#79bba9',2);
  r(c,x+14,y+13,16,12,'#c9ced3'); r(c,x+16,y+15,12,8,'#8e979e');
  for(let i=0;i<4;i++)r(c,x+33,y+11+i*4,10,2,'#caaf69');
  c.beginPath();c.arc(x+24,y+48,11,0,TAU);c.fillStyle='#1a1f28';c.fill();c.strokeStyle='#8a93a0';c.lineWidth=2;c.stroke();
  c.beginPath();c.arc(x+24,y+48,5,0,TAU);c.fillStyle='#4a5363';c.fill();
  for(const [bx,by,col] of [[x+58,y+40,'#e65b4f'],[x+66,y+52,'#6ce2c4']]){c.beginPath();c.arc(bx,by,5,0,TAU);c.fillStyle=col;c.fill()}
  r(c,x+56,y+12,16,3,'#6ce2c4');
}
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
// Front (walking toward the camera) and back (walking away) views. These are
// drawn symmetrically instead of squashing the side sprite: legs step in place
// rather than swinging sideways, and the badge, zipper, and face only appear
// from the front.
function drawFrontBack(c,b,index,swing,time,back){
  const lead=WALK_POSES[index],trail=WALK_POSES[(index+4)%8];
  const sway=b*(index<4?1:-1)*(index%4===1||index%4===2?1:0);
  const legColor='#35455e',shoe=back?'#19212c':'#101823';
  for(const [hip,pose] of [[-8,lead],[8,trail]]){
    const lift=Math.round(pose.lift*b*.75);
    r(c,hip-6,-36,12,27-lift,legColor);
    r(c,hip-7,-10-lift,14,8,shoe);
    if(back)r(c,hip-5,-10-lift,10,2,'#4a5561');
    else r(c,hip-5,-4-lift,10,2,'#707e87');
  }
  c.save();c.translate(sway,0);
  // Jacket body
  r(c,-21,-73,42,39,'#4c3f4b');
  r(c,-18,-72,36,40,back?'#b5714f':'#bd7959');
  if(back){
    r(c,-18,-72,36,7,'#a5664a');
    r(c,-1,-65,2,29,'#a5664a');
  }else{
    r(c,-8,-70,16,32,'#d69670');
    r(c,-1,-68,2,32,'#85564c');
    r(c,-12,-72,5,10,'#a5664a');r(c,7,-72,5,10,'#a5664a');
  }
  r(c,-18,-36,36,5,'#efb983');
  // Arms hang at the sides; a forward swing reads as a slightly shorter arm.
  const sleeve=back?'#a86a4e':'#ca8361';
  for(const [side,dir] of [[-1,1],[1,-1]]){
    const len=26+Math.round(swing*dir*.28);
    const ax=side<0?-27:18;
    r(c,ax,-70,9,len,sleeve);
    r(c,ax,-70+len,9,7,'#dea682');
  }
  // Neck and head
  r(c,-7,-81,14,11,back?'#a87253':'#b97f5f');
  r(c,-15,-109,30,30,'#dfab85');
  if(back){
    r(c,-17,-112,34,29,'#282730');
    r(c,-14,-84,28,2,'#2d2b36');
    r(c,-18,-99,3,8,'#d39b77');r(c,15,-99,3,8,'#d39b77');
  }else{
    r(c,-17,-112,34,11,'#282730');
    r(c,-17,-103,5,12,'#282730');r(c,12,-103,5,12,'#282730');
    const blink=(time%5.3>5.15);
    if(blink){r(c,-9,-95,6,2,'#36313a');r(c,3,-95,6,2,'#36313a')}
    else{r(c,-8,-97,4,4,'#292d39');r(c,4,-97,4,4,'#292d39')}
    r(c,-4,-86,8,2,'#9a6555');
    // Badge is clipped to the front of the jacket, so it only shows from the front.
    r(c,6,-61,9,12,'#f0dec0');r(c,8,-58,5,5,'#79bba9');
  }
  c.restore();
}
export function drawCharacter(c,x,feet,time,walking,facing,stepPhase=0,blend=walking?1:0,direction='side'){
  const b=Math.max(0,Math.min(1,blend));
  const index=Math.floor((((stepPhase%(Math.PI*2))+(Math.PI*2))%(Math.PI*2))/(Math.PI*2)*8)%8;
  const lead=WALK_POSES[index],trail=WALK_POSES[(index+4)%8];
  const bob=b*(index%4===1||index%4===2?3:0)+(1-b)*Math.sin(time*1.5)*.55;
  const swing=b*Math.round(11*Math.sin(index*Math.PI/4));
  c.save();c.translate(Math.round(x),Math.round(feet-bob));
  // Stationary shadow helps ground the sprite instead of floating over tiles.
  radial(c,0,2,37,9,'#0c1320',.54);
  if(direction!=='side'){drawFrontBack(c,b,index,swing,time,direction==='back');c.restore();return}
  c.scale(facing,1);
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
  const blink=(time%5.3>5.15);
  if(blink)r(c,1+headTilt,-95,12,2,'#36313a');
  else{
    r(c,1+headTilt,-97,4,4,'#292d39');
    r(c,10+headTilt,-96,3,3,'#292d39');
  }
  r(c,3+headTilt,-84,8,2,'#9a6555');
  // Little clipped-on badge, a recognisable detail even while walking.
  r(c,10,-57,9,12,'#f0dec0');r(c,12,-54,5,5,'#79bba9');
  c.restore();
}
export function drawMarker(c,x,y,time,near=false){const v=Math.sin(time*3)*4;c.save();c.shadowColor='#ffe1a8';c.shadowBlur=near?24:12;const color=near?'#ffe5b1':'#eec692';r(c,x-4,y-16+v,8,8,color);r(c,x-2,y-22+v,4,20,color);r(c,x-10,y-14+v,20,4,color);c.restore()}
