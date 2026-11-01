import {ROOM_INFO,roomObjects,roomWidth,WALK_MIN,WALK_MAX} from './rooms.js';
import {drawRoom,drawCharacter,drawMarker,txt,box,r} from './art.js';
import {moveWithCollision} from './collision.js';
const W=1200,H=675;
export class StudioGame{
  constructor({canvas,notify,inspect,discover}){
    this.canvas=canvas;this.c=canvas.getContext('2d',{alpha:false});this.notify=notify;this.inspect=inspect;this.discover=discover;
    this.room='lobby';this.x=800;this.y=624;this.camera=250;this.facing=1;this.walking=false;this.stepPhase=0;this.walkBlend=0;this.walkDirection='side';this.keys=new Set();this.pointerX=-1;this.pointerY=-1;
    this.nearest=null;this.paused=false;this.reduced=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    this.last=0;this.time=0;this.bind();this.changeUi();requestAnimationFrame(t=>this.frame(t));
  }
  objects(){return roomObjects[this.room]}
  nearestObject(){let best=null,dist=Infinity;for(const item of this.objects()){const d=Math.abs(this.x-item.x);if(d<dist){dist=d;best=item}}return dist<113?best:null}
  bind(){const codes={KeyA:'left',ArrowLeft:'left',KeyD:'right',ArrowRight:'right',KeyW:'up',ArrowUp:'up',KeyS:'down',ArrowDown:'down'};
    window.addEventListener('keydown',e=>{
      if(document.querySelector('dialog[open]'))return;
      if(e.target instanceof HTMLElement && ['INPUT','TEXTAREA','BUTTON','A','SELECT'].includes(e.target.tagName))return;
      if(codes[e.code]){e.preventDefault();this.keys.add(codes[e.code]);}
      if(['KeyE','Enter','Space'].includes(e.code)&&!e.repeat){e.preventDefault();this.interactNearest()}
    });
    window.addEventListener('keyup',e=>{if(codes[e.code])this.keys.delete(codes[e.code])});
    window.addEventListener('blur',()=>this.keys.clear());
    this.canvas.addEventListener('pointermove',e=>{const rect=this.canvas.getBoundingClientRect();this.pointerX=(e.clientX-rect.left)*W/rect.width+this.camera;this.pointerY=(e.clientY-rect.top)*H/rect.height});
    this.canvas.addEventListener('pointerleave',()=>{this.pointerX=-1;this.pointerY=-1;this.canvas.style.cursor='default'});
    this.canvas.addEventListener('click',e=>{const item=this.pointed();if(item)this.activate(item);else this.canvas.parentElement.focus()});
    for(const button of document.querySelectorAll('[data-move]')){
      const dir=button.dataset.move;
      button.addEventListener('pointerdown',e=>{e.preventDefault();this.keys.add(dir);try{button.setPointerCapture(e.pointerId)}catch{}});
      for(const event of ['pointerup','pointercancel','lostpointercapture'])button.addEventListener(event,()=>this.keys.delete(dir));
    }
    document.getElementById('touch-interact').addEventListener('click',()=>this.interactNearest());
    document.addEventListener('visibilitychange',()=>{this.paused=document.hidden;this.last=0});
  }
  pointHit(item){const dx=Math.abs(this.pointerX-item.x),dy=this.pointerY;const radius=item.type==='project'?185:item.type==='door'?115:135;return dx<radius && dy>195 && dy<545}
  pointed(){if(this.pointerX<0)return null;const objects=this.objects().filter(item=>this.pointHit(item));if(!objects.length)return null;return objects.sort((a,b)=>Math.abs(this.pointerX-a.x)-Math.abs(this.pointerX-b.x))[0]}
  interactNearest(){if(document.querySelector('dialog[open]'))return;const obj=this.nearestObject();if(obj)this.activate(obj)}
  activate(item){if(item.type==='door')this.toRoom(item.target,item.id);else this.inspect(item)}
  toRoom(room,source){if(!ROOM_INFO[room])return;this.room=room;this.x=source?.includes('to-lobby')?(source.startsWith('gallery')?250:240):room==='gallery'?300:room==='workshop'?310:800;
    this.y=624;this.camera=Math.max(0,Math.min(roomWidth(this.room)-W,this.x-W*.5));this.pointerX=-1;this.nearest=null;this.changeUi();this.notify(`WELCOME TO ${ROOM_INFO[room].name}`);}
  changeUi(){const ri=ROOM_INFO[this.room];document.getElementById('room-label').textContent=`${ri.number} / ${ri.name}`;document.getElementById('room-subtitle').textContent=ri.subtitle;for(const button of document.querySelectorAll('.room-tabs [data-room]'))button.classList.toggle('active',button.dataset.room===this.room)}
  tick(dt){if(this.paused)return;const dx=(Number(this.keys.has('right'))-Number(this.keys.has('left')));const dy=(Number(this.keys.has('down'))-Number(this.keys.has('up')));
    const speed=this.reduced?190:210;const length=Math.hypot(dx,dy)||1;
    const wantedX=Math.max(44,Math.min(roomWidth(this.room)-44,this.x+dx/length*speed*dt));
    const wantedY=Math.max(WALK_MIN,Math.min(WALK_MAX,this.y+dy/length*speed*.52*dt));
    const moved=moveWithCollision(this.room,this.x,this.y,wantedX-this.x,wantedY-this.y);
    const travelled=Math.hypot(moved.x-this.x,(moved.y-this.y)*1.65);
    this.walking=travelled>.05;
    if(this.walking){
      // One full 8-frame gait covers about 144 canvas pixels. Tying the
      // animation to distance creates stance/plant frames and removes sliding.
      this.stepPhase=(this.stepPhase+travelled*Math.PI*2/144)%(Math.PI*2);
      this.walkBlend=Math.min(1,this.walkBlend+dt*9);
      this.walkDirection=Math.abs(dx)>=Math.abs(dy)?'side':(dy>0?'front':'back');
    }else this.walkBlend=Math.max(0,this.walkBlend-dt*7);
    this.x=moved.x;this.y=moved.y;if(dx&&this.walking)this.facing=dx;
    const target=Math.max(0,Math.min(roomWidth(this.room)-W,this.x-W*.5));this.camera+=(target-this.camera)*Math.min(1,dt*7);this.nearest=this.nearestObject();
    const hint=document.getElementById('interact-hint');hint.hidden=!this.nearest; if(this.nearest)hint.innerHTML=`PRESS <kbd>E</kbd> — ${this.nearest.label}`;
    const over=this.pointed();this.canvas.style.cursor=over?'pointer':'default';
  }
  frame(ms){const dt=this.last?Math.min(.05,(ms-this.last)/1000):0;this.last=ms;this.time=ms*.001;this.tick(dt);
    const c=this.c;c.setTransform(1,0,0,1,0,0);c.clearRect(0,0,W,H);
    const markerFor=obj=>obj.markerY ?? (obj.type==='door'?298:obj.type==='project'?(this.room==='workshop'?385:247):obj.type==='resume'?412:obj.type==='revisions'?355:300);
    const labelFor=obj=>obj.labelY ?? (obj.type==='project'?(this.room==='workshop'?358:186):obj.type==='door'?240:obj.type==='resume'?363:obj.type==='revisions'?310:258);
    c.save();c.translate(-Math.round(this.camera),0);drawRoom(c,this.room,this.reduced?0:this.time,this.camera);
    for(const obj of this.objects()){
      const x=obj.x;if(x<this.camera-130||x>this.camera+W+130)continue;
      const near=Math.abs(this.x-x)<112;const selected=(this.pointed()===obj);
      drawMarker(c,x,markerFor(obj),this.reduced?0:this.time,near||selected);
      if(near||selected){
        const yy=labelFor(obj);
        c.save();c.font='bold 13px monospace';let ww=Math.max(162,c.measureText(obj.label).width+28);const lx=Math.max(0,Math.min(roomWidth(this.room)-ww,x-ww/2));box(c,lx,yy,ww,31,'#222b39e9','#eec58c',2);txt(c,obj.label,lx+ww/2,yy+20,13,'#ffe1b7','center');c.restore();
      }
    }
    drawCharacter(c,this.x,this.y,this.reduced?0:this.time,this.walking,this.facing,this.stepPhase,this.reduced?Math.min(.22,this.walkBlend):this.walkBlend,this.walkDirection);
    c.restore();
    requestAnimationFrame(t=>this.frame(t));
  }
}
