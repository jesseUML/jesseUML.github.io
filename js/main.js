import {StudioGame} from './game/engine.js';
import {projects} from './data/projects.js';
import {initDialogs} from './ui/dialogs.js';
const $=id=>document.getElementById(id);
const storageKey='jesse-studio-v2-seen';let visited=new Set();try{const val=JSON.parse(localStorage.getItem(storageKey)||'[]');if(Array.isArray(val))visited=new Set(val.filter(x=>projects.some(p=>p.id===x)))}catch{}
const showProgress=()=>{$('discovery-label').textContent=`${visited.size} / ${projects.length} EXHIBITS DISCOVERED`};showProgress();
const dialog=initDialogs(p=>{visited.add(p.id);try{localStorage.setItem(storageKey,JSON.stringify([...visited]))}catch{}showProgress()});
const game=new StudioGame({canvas:$('game'),inspect:dialog.openInfo,discover:showProgress,notify:msg=>{$('scene-caption').textContent=msg}});
for(const b of document.querySelectorAll('[data-room]'))b.addEventListener('click',()=>{game.toRoom(b.dataset.room);$('game-container').focus({preventScroll:true});$('game-container').scrollIntoView({behavior:'smooth',block:'center'})});
const audio=$('lofi-audio'),music=$('audio-toggle');audio.volume=.27;
music.addEventListener('click',async()=>{if(audio.paused){try{await audio.play();music.setAttribute('aria-pressed','true');music.innerHTML='<span aria-hidden="true">♫</span> LOFI: ON'}catch{music.textContent='AUDIO UNAVAILABLE'}}else{audio.pause();music.setAttribute('aria-pressed','false');music.innerHTML='<span aria-hidden="true">♫</span> LOFI: OFF'}});
$('year').textContent=new Date().getFullYear();
