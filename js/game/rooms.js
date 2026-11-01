// =============================================================================
// rooms.js: the layout of the studio. Decides what goes where.
//
//   ROOM_INFO        names shown in the title bar for each room
//   BENCH_SLOTS      where each WIP project sits on the workshop bench
//   galleryFrames    computed: one gallery frame per completed project
//   roomWidth(room)  how wide each room is (the gallery grows with projects)
//   roomObjects      everything the visitor can walk up to and inspect
//
// How a room looks lives in js/game/art.js; what blocks walking lives in
// js/game/collision.js. Project content lives in js/data/projects.js.
// =============================================================================
import {projects} from '../data/projects.js';

export const ROOM_INFO={
  lobby:{name:'THE LOBBY',number:'01',subtitle:'A WARM WELCOME',spawn:850,sky:'#101f38'},
  workshop:{name:'THE WORKSHOP',number:'02',subtitle:'WORKS IN PROGRESS',spawn:390,sky:'#172038'},
  gallery:{name:'THE GALLERY',number:'03',subtitle:'THE FINISHED COLLECTION',spawn:400,sky:'#182035'}
};
export const WORLD_W=1750;
export const WALK_MIN=518, WALK_MAX=646;

// ---------------------------------------------------------------------------
// Where projects appear is decided by `status` in js/data/projects.js:
//   status: 'wip'        -> on its workbench spot in the workshop
//   status: 'completed'  -> framed on a pedestal in the gallery
// Flip the status and the project moves rooms. The gallery widens to fit.
// ---------------------------------------------------------------------------
export const isCompleted=p=>p.status==='completed';

// Workbench spots for works in progress. A new WIP project needs a spot here,
// keyed by its project id.
//   x, y, w, h  the display's box on the bench (world pixels; the bench top is ~484,
//               so y + h should land near 472 to sit on it)
//   art 'photo' framed displaySrc photo on the bench; label is its caption
//   art 'plan'  the MCU cluster architecture blueprint
//   markerY / labelY  height of the sparkle and the name label above it
// Free bench space: the main bench runs x 300–2050 and is fairly full; the
// capstone bench runs 2090–2450. To add a spot, widen ROOM_W.workshop below and
// move props in drawWorkshop() (js/game/art.js) to make room.
export const BENCH_SLOTS={
  'nfc-card':{x:690,y:346,w:160,h:126,art:'photo',label:'NFC CARD',markerY:338,labelY:288},
  'mcu-cluster':{x:1290,y:352,w:224,h:124,art:'plan',markerY:340,labelY:294},
  'capstone-controller':{x:2120,y:300,w:200,h:172,art:'photo',label:'CAPSTONE',markerY:290,labelY:244}
};

// Gallery: completed projects hang left to right in projects.js order.
export const GALLERY={start:496,step:516,frameW:305,frameH:239,frameY:215};
export const galleryFrames=projects.filter(isCompleted).map((p,i)=>({project:p,x:GALLERY.start+i*GALLERY.step,cx:GALLERY.start+i*GALLERY.step+152}));
const framesEnd=galleryFrames.length?galleryFrames.at(-1).x+GALLERY.frameW:GALLERY.start;
// The Team Fishies giant-check photo hangs after the last frame once that project is in the gallery.
export const checkPhoto=galleryFrames.some(f=>f.project.id==='team-fishies')?{x:framesEnd+75,w:246,h:214}:null;
const galleryEnd=checkPhoto?checkPhoto.x+checkPhoto.w:framesEnd;

const ROOM_W={workshop:2650,gallery:Math.max(WORLD_W,galleryEnd+112)};
export const roomWidth=room=>ROOM_W[room] ?? WORLD_W;

const wipObjects=projects.filter(p=>!isCompleted(p)&&BENCH_SLOTS[p.id]).map(p=>{
  const s=BENCH_SLOTS[p.id];
  return {id:p.id,type:'project',x:s.x+s.w/2,y:452,projectId:p.id,label:p.title.toUpperCase().replace(/ V\d.*$/,''),hint:'WORK IN PROGRESS',markerY:s.markerY,labelY:s.labelY};
});
const galleryObjects=galleryFrames.map((f,i)=>({id:f.project.id,type:'project',x:f.cx,y:360,projectId:f.project.id,label:f.project.wallTitle ?? f.project.title.toUpperCase(),hint:`FINISHED / EXHIBIT ${String(i+1).padStart(2,'0')}`,markerY:206,labelY:460}));
if(checkPhoto)galleryObjects.push({id:'smta-photo',type:'project',x:checkPhoto.x+checkPhoto.w/2,y:370,projectId:'team-fishies',label:'THE GIANT CHECK',hint:'ROUND 3 / FIRST PLACE',markerY:216,labelY:460});

// Interactive things in each room. The engine shows a sparkle over each one
// and reacts when the visitor walks up and presses E, or clicks it.
//   id        unique within the room
//   type      'door'     -> walks to `target` room
//             'project'  -> opens the project dialog for `projectId`
//             'about' | 'resume' | 'revisions' -> opens that dialog (js/ui/dialogs.js)
//   x         horizontal centre in world pixels (interaction range is ±113px)
//   y         kept for reference; interaction only uses x
//   label     name shown above it when you're near
//   hint      short description; not displayed yet, but handy as a note
//   markerY / labelY  optional sparkle and label heights (defaults in engine.js)
export const roomObjects={
  lobby:[
    {id:'lobby-to-workshop',type:'door',x:104,y:440,target:'workshop',label:'ENTER WORKSHOP',hint:'TO THE WORKBENCH'},
    {id:'about',type:'about',x:661,y:339,label:'ABOUT THE BUILDER',hint:'GET TO KNOW JESSE',markerY:400,labelY:322},
    {id:'resume',type:'resume',x:1175,y:450,label:'RESUME',hint:'THE SHORT VERSION'},
    {id:'lobby-to-gallery',type:'door',x:1640,y:440,target:'gallery',label:'ENTER GALLERY',hint:'THE FINISHED COLLECTION'},
  ],
  workshop:[
    {id:'workshop-to-lobby',type:'door',x:110,y:440,target:'lobby',label:'RETURN TO LOBBY',hint:'BACK TO THE LOBBY'},
    ...wipObjects,
    {id:'revisions',type:'revisions',x:2542,y:350,label:'REWORK & LESSONS',hint:'FRAMED NOTE / DEBUG STORY',markerY:280,labelY:236},
  ],
  gallery:[
    {id:'gallery-to-lobby',type:'door',x:110,y:440,target:'lobby',label:'RETURN TO LOBBY',hint:'BACK TO THE LOBBY'},
    ...galleryObjects,
  ]
};
