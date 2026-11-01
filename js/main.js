// =============================================================================
// main.js: wires the page together. Loaded by index.html.
//
//   Title screen    LED name, splash lines (SPLASHES), and the menu buttons
//   Discovery       which exhibits a visitor has opened this visit (not saved),
//                   with a toast for each new one and the lobby counter
//   Studio          starts the game (engine.js) and the room buttons
//   Lofi            the music toggles in the top bar and the menu
//   Featured cards  built from projects that have a `featured` entry
//
// Any element with data-room="workshop" (etc.) jumps to that room, and any
// element with data-open="about" | "resume" | "contact" opens that dialog.
// =============================================================================
import {StudioGame} from './game/engine.js';
import {projects} from './data/projects.js';
import {initDialogs} from './ui/dialogs.js';
import {initLedTitle} from './ui/led-title.js';
import {studioState} from './game/art.js';
const $=id=>document.getElementById(id);

// Title screen
initLedTitle($('led-title'));
const SPLASHES=['Just keep switching!','Won round 3 outright!','Now with 64 LEDs!','Measure. Rework. Retest.','Ask me about decoupling caps!','Built after hours!','Shake to change profiles!','Smells faintly of flux!','Rev 2 is always better!'];
const splash=$('splash');let splashIndex=Math.floor(Math.random()*SPLASHES.length);
const showSplash=()=>{splash.textContent=SPLASHES[splashIndex];splash.classList.remove('pop');void splash.offsetWidth;splash.classList.add('pop')};
splash.addEventListener('click',()=>{splashIndex=(splashIndex+1)%SPLASHES.length;showSplash()});showSplash();

// Discovery progress, with an achievement-style toast for each new exhibit.
// Kept in memory only, so every visit starts at 0 and the tour is fresh again.
const visited=new Set();
// Older versions saved progress in localStorage; clear it for returning visitors.
try{localStorage.removeItem('jesse-studio-v2-seen')}catch{}
const showProgress=()=>{$('discovery-label').textContent=`${visited.size} / ${projects.length} EXHIBITS DISCOVERED`;studioState.found=visited.size;studioState.total=projects.length};showProgress();
const toast=$('toast');let toastTimer=0;
// The toast uses the popover top layer when available, so it shows above the
// project dialog that triggered it. Older browsers fall back to a plain class.
const canPopover=typeof toast.showPopover==='function';
const openToast=()=>{if(canPopover){try{toast.hidePopover()}catch{}toast.showPopover()}else toast.classList.add('fallback-open')};
const closeToast=()=>{if(canPopover){try{toast.hidePopover()}catch{}}else toast.classList.remove('fallback-open')};
function notifyToast(title,body){$('toast-title').textContent=title;$('toast-body').textContent=body;openToast();toast.classList.remove('show');void toast.offsetWidth;toast.classList.add('show');clearTimeout(toastTimer);toastTimer=setTimeout(closeToast,4200)}
const dialog=initDialogs(p=>{if(visited.has(p.id))return;visited.add(p.id);showProgress();
  if(visited.size===projects.length)notifyToast('FULL TOUR COMPLETE',`All ${projects.length} exhibits found. Thanks for visiting!`);
  else notifyToast('EXHIBIT DISCOVERED',`${p.title} · ${visited.size} / ${projects.length}`)});

// Studio
const game=new StudioGame({canvas:$('game'),inspect:dialog.openInfo,discover:showProgress,notify:msg=>{$('scene-caption').textContent=msg}});
const focusStudio=()=>{$('game-container').focus({preventScroll:true});$('game-container').scrollIntoView({behavior:'smooth',block:'center'})};
for(const b of document.querySelectorAll('[data-room]'))b.addEventListener('click',()=>{game.toRoom(b.dataset.room);focusStudio()});
$('menu-enter').addEventListener('click',e=>{e.preventDefault();focusStudio()});
for(const b of document.querySelectorAll('[data-open]'))b.addEventListener('click',()=>dialog.openInfo({type:b.dataset.open}));

// Lofi: every [data-audio-toggle] button controls the same track
const audio=$('lofi-audio');audio.volume=.27;const toggles=[...document.querySelectorAll('[data-audio-toggle]')];
const syncAudio=(label)=>{for(const t of toggles){t.setAttribute('aria-pressed',String(!audio.paused));const l=t.querySelector('[data-audio-label]');if(l)l.textContent=label||(audio.paused?'LOFI: OFF':'LOFI: ON')}};
for(const t of toggles)t.addEventListener('click',async()=>{if(audio.paused){try{await audio.play();syncAudio()}catch{syncAudio('AUDIO UNAVAILABLE')}}else{audio.pause();syncAudio()}});

// Featured projects for visitors who skip the walkable studio
const grid=$('featured-grid');
for(const p of projects.filter(x=>x.featured)){
  const card=document.createElement('button');card.type='button';card.className='feature-card';
  const img=document.createElement('img');img.src=p.featured.cover;img.alt='';img.loading='lazy';img.decoding='async';if(p.featured.coverPosition)img.style.objectPosition=p.featured.coverPosition;
  const body=document.createElement('span');body.className='feature-body';
  const status=document.createElement('small');status.textContent=p.status==='completed'?'FINISHED · GALLERY':'IN PROGRESS · WORKSHOP';
  const title=document.createElement('strong');title.textContent=p.title;
  const hook=document.createElement('span');hook.className='feature-hook';hook.textContent=p.featured.highlight;
  const tags=document.createElement('span');tags.className='feature-tags';for(const t of p.tags.slice(0,3)){const s=document.createElement('span');s.textContent=t;tags.append(s)}
  body.append(status,title,hook,tags);card.append(img,body);card.addEventListener('click',()=>dialog.openProject(p.id));grid.append(card);
}
$('year').textContent=new Date().getFullYear();
