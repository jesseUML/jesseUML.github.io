// Handmade decorative SVG diagrams. These are illustrations, not real PCB artwork.
// A project's dialog uses one of these only when it has no displaySrc photo;
// its `art` field picks which (see `makers` at the bottom of this file).
const frame = inner => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 360 170" role="img" aria-label="Stylized electronic hardware illustration"><defs><linearGradient id="board" x1="0" x2="1" y1="0" y2="1"><stop stop-color="#2e6d67"/><stop offset="1" stop-color="#153c43"/></linearGradient><filter id="soft"><feGaussianBlur stdDeviation="4"/></filter></defs><ellipse cx="180" cy="144" rx="128" ry="12" fill="#050c18" opacity=".3" filter="url(#soft)"/>${inner}</svg>`;
const rect = (x,y,w,h,fill,rx=3,stroke='#ccbb87',sw=1) => `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${rx}" fill="${fill}" stroke="${stroke}" stroke-width="${sw}"/>`;
const pad = (x,y) => `<rect x="${x}" y="${y}" width="5" height="5" rx="1" fill="#d9ae70"/>`;
function ledCard(){let leds='';for(let y=0;y<8;y++)for(let x=0;x<8;x++){const on=(x===y||x===7-y||((x+y)%7===0));leds+=`<rect x="${101+x*19}" y="${18+y*15}" width="10" height="9" rx="1" fill="${on?'#f5d08a':'#5e7d71'}" opacity="${on?1:.47}"/>`;}return frame(`${rect(76,8,212,145,'url(#board)',8,'#9ec4a7',3)}${rect(88,19,186,120,'none',4,'#7ca99a',1)}${leds}${rect(153,145,58,8,'#192d33',1,'#b6a36c',1)}<circle cx="88" cy="20" r="3" fill="#d1c197"/><circle cx="275" cy="140" r="3" fill="#d1c197"/>`)}
function robot(){return frame(`<ellipse cx="88" cy="122" rx="23" ry="27" fill="#141821" stroke="#74878b" stroke-width="9"/><ellipse cx="273" cy="122" rx="23" ry="27" fill="#141821" stroke="#74878b" stroke-width="9"/>${rect(97,33,166,92,'#d9ac63',12,'#f4d399',4)}${rect(116,47,127,67,'#274d52',4,'#e0c38e',2)}${rect(123,55,114,44,'#192b37',4,'#c5a56e',1)}<path d="M133 83 H151 V66 H166 V84 H196 V70 H226" stroke="#8fcfc2" fill="none" stroke-width="5"/><circle cx="125" cy="41" r="5" fill="#f9ebc0"/><circle cx="235" cy="41" r="5" fill="#f9ebc0"/><path d="M134 33 V16 M226 33 V16" stroke="#cbad70" stroke-width="4"/><circle cx="134" cy="15" r="6" fill="#f3d7a3"/><circle cx="226" cy="15" r="6" fill="#f3d7a3"/>`)}
function nfc(){let coil='';for(let i=0;i<5;i++){coil+=`<rect x="${57+i*6}" y="${26+i*5}" width="${245-i*12}" height="${113-i*10}" rx="12" fill="none" stroke="${i%2?'#bda970':'#cfbb7f'}" stroke-width="2"/>`;}return frame(`${rect(51,19,260,127,'url(#board)',8,'#adbc94',3)}${coil}${rect(142,68,61,35,'#1c2834',2,'#b4ba9b',2)}${rect(227,58,27,25,'#1c2834',2,'#b4ba9b',1)}<circle cx="71" cy="34" r="3" fill="#ead6a2"/><circle cx="294" cy="131" r="3" fill="#ead6a2"/>`)}
function cluster(){
  const node=(x,y,w,h,label,color='#315d64')=>
    `${rect(x,y,w,h,color,4,'#a4cfbd',1.6)}<text x="${x+w/2}" y="${y+h/2+4}" text-anchor="middle" font-size="11" fill="#f7ead0" font-family="monospace">${label}</text>`;
  const bus='<path d="M180 52 V66 H91 V75 M180 66 H269 V75 M91 102 V114 M269 102 V114" fill="none" stroke="#eacb8f" stroke-width="2.3"/>';
  let workers='';
  for(const [x,label] of [[39,'CARD 0'],[217,'CARD 1']]){
    workers+=`${rect(x,115,105,37,'#3a5262',3,'#b4c6b2',1.3)}<text x="${x+53}" y="127" text-anchor="middle" font-size="9" fill="#d5ecdf" font-family="monospace">${label}</text>`;
    for(let k=0;k<4;k++)workers+=`${rect(x+8+k*24,135,16,11,'#b1bdb0',2,'#ddc38d',1)}`;
  }
  return frame(`<text x="180" y="12" fill="#e9cfa4" font-size="11" text-anchor="middle" font-family="monospace">SUPERVISOR / MANAGER / WORKER</text>${node(123,22,114,30,'SUPERVISOR','#4d5c68')}${bus}${node(45,75,92,27,'MANAGER 0')}${node(223,75,92,27,'MANAGER 1')}${workers}`);
}
function controller(){return frame(`${rect(53,20,260,129,'#315761',8,'#a8bcac',3)}${rect(73,45,96,68,'#1b303e',4,'#9aab9b',2)}${rect(190,40,76,47,'#162b38',3,'#d3bd8f',2)}${rect(198,49,56,30,'#233746',2,'#739aa1',1)}${rect(185,104,103,23,'#1a313a',4,'#cbbe92',2)}<circle cx="291" cy="36" r="5" fill="#d0b47d"/><path d="M80 133 H174 V120 H185 M170 55 H190" stroke="#e4b07a" stroke-width="2" fill="none"/><path d="M267 69 H288 V98" stroke="#8ecabc" stroke-width="2" fill="none"/>`)}
const makers={'led-card':ledCard,robot,nfc,cluster,controller};
export function artFor(project){return (makers[project.art]||ledCard)();}
