// =============================================================================
// dialogs.js: every pop-up in the site.
//
//   openProject(id)  project dialog, built entirely from js/data/projects.js
//   openInfo(item)   dialogs for non-project exhibits, picked by item.type:
//                    'about', 'resume', 'contact', 'revisions'
//   showList()       the "All projects" list
//
// To add a new non-project exhibit: add an `if(kind==='yourtype')` branch in
// openInfo() below, then add an object with type:'yourtype' in rooms.js.
// =============================================================================
import {artFor} from './project-art.js';
import {projects} from '../data/projects.js';
import {site} from '../data/site.js';
const $=id=>document.getElementById(id);
// Diagram for the "Rework & Lessons" dialog: Jesse's real decoupling mistake
// (top) and the fix (bottom). The small wall version is framedLesson() in
// js/game/art.js; keep the two in sync if the lesson changes.
const REWORK_DIAGRAM = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 420 210" role="img" aria-label="Top: two capacitors in parallel wired in series between VCC and the load, marked as the mistake. Bottom: the fix, with both capacitors connected from VCC to ground beside the load.">
  <rect x="2" y="2" width="416" height="206" rx="10" fill="#252e3b" stroke="#b1a482" stroke-width="2"/>
  <text x="210" y="21" font-family="monospace" font-size="12" text-anchor="middle" fill="#edc691">THE REWORK CORNER / A REAL MISTAKE</text>
  <g font-family="monospace" font-size="10" fill="#edc691"><text x="16" y="65">VCC</text><text x="16" y="146">VCC</text></g>
  <!-- What I built: C1 || C2 in series with the load. DC can't pass a capacitor. -->
  <g fill="none" stroke="#b6e2d1" stroke-width="2.5" stroke-linecap="square">
    <path d="M44 62 H80 M80 44 V80 M80 44 H106 M120 44 H150 M80 80 H106 M120 80 H150 M150 44 V80 M150 62 H200 M258 62 H290 V78 M280 78 H300 M284 83 H296 M288 88 H292"/>
  </g>
  <g fill="none" stroke="#b6e2d1" stroke-width="3.5"><path d="M106 34 V54 M120 34 V54 M106 70 V90 M120 70 V90"/></g>
  <rect x="200" y="50" width="58" height="24" rx="3" fill="#383542" stroke="#99765e"/>
  <text x="229" y="66" text-anchor="middle" font-family="monospace" font-size="10" fill="#f0c58f">LOAD</text>
  <g fill="#edc691" font-family="monospace" font-size="10"><text x="126" y="38">C1</text><text x="126" y="98">C2</text></g>
  <path d="M166 54 L184 70 M184 54 L166 70" stroke="#ff7a6b" stroke-width="3"/>
  <text x="210" y="114" text-anchor="middle" font-family="monospace" font-size="10" fill="#ff9a8c">✗ WHAT I BUILT: CAPS IN SERIES. NO DC REACHES THE LOAD.</text>
  <!-- The fix: the load sits on the VCC rail, and each cap shunts VCC to GND beside it. -->
  <g fill="none" stroke="#b6e2d1" stroke-width="2.5" stroke-linecap="square">
    <path d="M44 142 H200 M258 142 H290 V176 M100 142 V154 M100 162 V176 M150 142 V154 M150 162 V176 M100 176 H290 M195 176 V182 M187 182 H203 M190 186 H200 M193 190 H197"/>
  </g>
  <g fill="none" stroke="#b6e2d1" stroke-width="3.5"><path d="M89 154 H111 M89 162 H111 M139 154 H161 M139 162 H161"/></g>
  <rect x="200" y="130" width="58" height="24" rx="3" fill="#383542" stroke="#99765e"/>
  <text x="229" y="146" text-anchor="middle" font-family="monospace" font-size="10" fill="#f0c58f">LOAD</text>
  <g fill="#edc691" font-family="monospace" font-size="10"><text x="115" y="161">C1</text><text x="165" y="161">C2</text></g>
  <text x="210" y="203" text-anchor="middle" font-family="monospace" font-size="10" fill="#a8d9cc">✓ THE FIX: CAPS FROM VCC TO GND, RIGHT BESIDE THE LOAD.</text>
</svg>`;

const bodyText=(paragraphs)=>{const frag=document.createDocumentFragment();for(const s of paragraphs){const p=document.createElement('p');p.textContent=s;frag.append(p)}return frag};
export function initDialogs(onProjectOpen){
  const dialog=$('info-dialog'),list=$('list-dialog'),help=$('help-dialog'),resumeDialog=$('resume-dialog');
  for(const [id,dlg] of [['close-dialog',dialog],['close-list',list],['close-help',help],['help-ok',help]])$(id).addEventListener('click',()=>dlg.close());
  for(const dlg of [dialog,list,help])dlg.addEventListener('click',e=>{if(e.target===dlg)dlg.close()});
  // Keep the résumé inside the studio, with download/new-tab fallbacks.
  const openResume=()=>{
    if(!site.resume){return openInfo({type:'resume-unavailable'});}
    if(dialog.open)dialog.close();
    if(list.open)list.close();
    if(help.open)help.close();
    if(!resumeDialog.open)resumeDialog.showModal();
  };
  $('close-resume').addEventListener('click',()=>resumeDialog.close());
  resumeDialog.addEventListener('click',e=>{if(e.target===resumeDialog)resumeDialog.close()});
  $('resume-pdf').data=`${site.resume}#view=FitH`;
  $('resume-download').href=site.resume;
  $('resume-external').href=site.resume;

  const fields={title:$('modal-title'),summary:$('modal-summary'),eyebrow:$('modal-eyebrow'),content:$('modal-content'),tags:$('modal-tags'),art:$('modal-art'),photos:$('modal-photos'),links:$('modal-links')};
  function initialize({title,summary,eyebrow,paragraphs=[],tags=[],art='',photos=[],links=[]}){
    fields.title.textContent=title;fields.summary.textContent=summary;fields.eyebrow.textContent=eyebrow;
    fields.content.replaceChildren(bodyText(paragraphs));fields.tags.replaceChildren();fields.links.replaceChildren();fields.art.innerHTML=art;
    fields.photos.replaceChildren();fields.photos.hidden=!photos.length;
    for (const photo of photos){
      const link=document.createElement('a');link.href=photo.src;link.target='_blank';link.rel='noopener noreferrer';link.className='modal-photo';
      const image=document.createElement('img');image.src=photo.src;image.alt=photo.caption;image.loading='lazy';image.decoding='async';
      const caption=document.createElement('span');caption.textContent=photo.caption;link.append(image,caption);image.addEventListener('error',()=>{link.remove();if(!fields.photos.children.length)fields.photos.hidden=true},{once:true});fields.photos.append(link);
    }
    for(const t of tags){const span=document.createElement('span');span.textContent=t;fields.tags.append(span)}
    for(const l of links){if(!l.url)continue;const a=document.createElement('a');a.href=l.url;a.textContent=l.name;if(/^https?:/.test(l.url)){a.target='_blank';a.rel='noopener noreferrer'}fields.links.append(a)}
    if(list.open)list.close();dialog.showModal();
  }
  function openProject(id){const p=projects.find(x=>x.id===id);if(!p)return;
    initialize({title:p.title,summary:p.summary,eyebrow:p.code,paragraphs:[p.description,`What I learned: ${p.lessons}`],tags:p.tags,art:p.displaySrc?`<img class="modal-hero" src="${p.displaySrc}" alt="${p.title} preview">`:artFor(p),photos:p.photos || [],links:[{name:'VIEW SOURCE ↗',url:p.github}]});onProjectOpen(p);
  }
  function openInfo(item){
    if(item.type==='project')return openProject(item.projectId);
    const kind=item.type;
    if(kind==='about')initialize({title:'Hello, I’m Jesse.',eyebrow:'THE PERSON BEHIND THE BOARDS',summary:'Computer Engineering student at UMass Lowell with a love for building things that you can actually hold.',paragraphs:['I work at the intersection of electronics, embedded firmware, and hands-on prototyping. When I’m not in class, I’m probably trying to squeeze another microcontroller, sensor, or LED onto a tiny PCB.','I enjoy the full process — ideas, design reviews, routing, assembly, failures, testing, and making the next revision better. This studio is a digital shelf for the things I’ve built.'],tags:['UMASS LOWELL','COMPUTER ENGINEERING','PCB DESIGN','EMBEDDED SYSTEMS'],links:[{name:'EMAIL ↗',url:site.email?`mailto:${site.email}`:''},{name:'GITHUB ↗',url:site.github},{name:'LINKEDIN ↗',url:site.linkedin}]});
    if(kind==='resume')return openResume();
    if(kind==='contact')initialize({title:'Say hello.',eyebrow:'THE STUDIO / CONTACT',summary:'Questions about a project, an internship, or a board you are stuck on? I am happy to talk hardware.',paragraphs:['Email is the fastest way to reach me. You can also find my code on GitHub and my experience on LinkedIn.'],tags:['EMBEDDED','PCB DESIGN','VALIDATION','TROUBLESHOOTING'],links:[{name:'EMAIL ↗',url:site.email?`mailto:${site.email}`:''},{name:'LINKEDIN ↗',url:site.linkedin},{name:'GITHUB ↗',url:site.github}]});
    if(kind==='resume-unavailable')initialize({title:'The résumé.',eyebrow:'A QUICK LOOK / PDF',summary:'The résumé PDF is unavailable.',paragraphs:['Please check the link again later.'],tags:['RESUME']});
    if(kind==='revisions')initialize({title:'Lessons from the rework frame.',eyebrow:'BESIDE THE WORKBENCH / FRAMED NOTE',summary:'Not every PCB goes straight to the gallery. Some become a framed lesson beside the bench until the next repair or revision.',paragraphs:['A shorted capacitor on a reset line, footprint and clearance problems, and component changes are all opportunities to isolate the fault and test a repair before writing off a board.','The diagram is a real mistake from one of my early business cards. I put two decoupling capacitors in parallel, then wired that pair in series between the supply and the load. A capacitor blocks DC, so the chip never got steady power. Decoupling caps belong from VCC to ground, right beside the part they protect, where they smooth out noise without sitting in the current path.','It is an easy error to make in a schematic and an obvious one once you measure the rail. That is the habit the frame is about: measure, isolate, rework, and retest.'],tags:['DECOUPLING','FAULT ISOLATION','SOLDER REWORK','LESSONS LEARNED'],art:REWORK_DIAGRAM});
  }
  const listBody=$('all-projects-list');
  function showList(){listBody.replaceChildren();for(const p of projects){const b=document.createElement('button');b.type='button';const small=document.createElement('small');small.textContent=p.status==='completed'?'GALLERY / FINISHED':'WORKSHOP / IN PROGRESS';const strong=document.createElement('strong');strong.textContent=p.title;const span=document.createElement('span');span.textContent=p.summary;b.append(small,strong,span);b.addEventListener('click',()=>openProject(p.id));listBody.append(b)}list.showModal()}
  $('project-index').addEventListener('click',showList);$('hero-projects').addEventListener('click',showList);$('browse-all').addEventListener('click',showList);$('help').addEventListener('click',()=>help.showModal());
  $('resume-link').addEventListener('click',openResume);
  return {openInfo,openProject,showList};
}
