import {artFor} from './project-art.js';
import {projects} from '../data/projects.js';
import {site} from '../data/site.js';
const $=id=>document.getElementById(id);
const REWORK_DIAGRAM = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 420 180" role="img" aria-label="Three capacitor symbols connected in series, above a PCB marked for rework">
  <rect x="2" y="2" width="416" height="176" rx="10" fill="#252e3b" stroke="#b1a482" stroke-width="2"/>
  <text x="210" y="23" font-family="monospace" font-size="13" text-anchor="middle" fill="#edc691">THE REWORK CORNER / CIRCUIT STUDIES</text>
  <g fill="none" stroke="#b6e2d1" stroke-width="3" stroke-linecap="square">
    <path d="M30 66 H64 M72 66 H138 M146 66 H212 M220 66 H298 M306 66 H387"/>
    <path d="M64 48 V84 M72 48 V84 M138 48 V84 M146 48 V84 M212 48 V84 M220 48 V84"/>
  </g>
  <g fill="#edc691" font-size="12" font-family="monospace" text-anchor="middle"><text x="68" y="39">C1</text><text x="142" y="39">C2</text><text x="216" y="39">C3</text></g>
  <rect x="65" y="104" width="118" height="45" rx="5" fill="#235b50" stroke="#aaccaa" stroke-width="2"/>
  <rect x="74" y="112" width="27" height="17" fill="#182935"/><rect x="112" y="112" width="12" height="9" fill="#b2aea3"/><rect x="135" y="112" width="12" height="9" fill="#b2aea3"/><rect x="158" y="112" width="12" height="9" fill="#b2aea3"/>
  <rect x="195" y="109" width="164" height="34" rx="3" fill="#383542" stroke="#99765e"/>
  <text x="278" y="124" text-anchor="middle" font-family="monospace" font-size="11" fill="#f0c58f">INSPECT • ISOLATE</text>
  <text x="278" y="138" text-anchor="middle" font-family="monospace" font-size="10" fill="#a8d9cc">REWORK / RETEST</text>
  <text x="210" y="167" text-anchor="middle" font-family="monospace" font-size="9" fill="#b2aeae">SCHEMATIC MOTIF — NOT THE CARD'S ACTUAL NETLIST</text>
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
    if(kind==='revisions')initialize({title:'Lessons from the rework frame.',eyebrow:'BESIDE THE WORKBENCH / FRAMED NOTE',summary:'Not every PCB goes straight to the gallery. Some become a framed lesson beside the bench until the next repair or revision.',paragraphs:['A shorted capacitor on a reset line, footprint and clearance problems, and component changes are all opportunities to isolate the fault and test a repair before writing off a board.','The capacitor sketch is a visual reminder to measure, isolate, rework, and retest — not a wiring diagram of the original business card. The successful Rev 1 card and NFC KiCad designs are available in their own exhibits.'],tags:['FAULT ISOLATION','SOLDER REWORK','PCB REVISION','LESSONS LEARNED'],art:REWORK_DIAGRAM});
  }
  const listBody=$('all-projects-list');
  function showList(){listBody.replaceChildren();for(const p of projects){const b=document.createElement('button');b.type='button';const small=document.createElement('small');small.textContent=p.status==='completed'?'GALLERY / FINISHED':'WORKSHOP / IN PROGRESS';const strong=document.createElement('strong');strong.textContent=p.title;const span=document.createElement('span');span.textContent=p.summary;b.append(small,strong,span);b.addEventListener('click',()=>openProject(p.id));listBody.append(b)}list.showModal()}
  $('project-index').addEventListener('click',showList);$('hero-projects').addEventListener('click',showList);$('browse-all').addEventListener('click',showList);$('help').addEventListener('click',()=>help.showModal());
  $('resume-link').addEventListener('click',openResume);
  return {openInfo,openProject,showList};
}
