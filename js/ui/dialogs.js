import {artFor} from './project-art.js';
import {projects} from '../data/projects.js';
import {site} from '../data/site.js';
const $=id=>document.getElementById(id);
const bodyText=(paragraphs)=>{const frag=document.createDocumentFragment();for(const s of paragraphs){const p=document.createElement('p');p.textContent=s;frag.append(p)}return frag};
export function initDialogs(onProjectOpen){
  const dialog=$('info-dialog'),list=$('list-dialog'),help=$('help-dialog');
  for(const [id,dlg] of [['close-dialog',dialog],['close-list',list],['close-help',help],['help-ok',help]])$(id).addEventListener('click',()=>dlg.close());
  for(const dlg of [dialog,list,help])dlg.addEventListener('click',e=>{if(e.target===dlg)dlg.close()});
  const fields={title:$('modal-title'),summary:$('modal-summary'),eyebrow:$('modal-eyebrow'),content:$('modal-content'),tags:$('modal-tags'),art:$('modal-art'),links:$('modal-links')};
  function initialize({title,summary,eyebrow,paragraphs=[],tags=[],art='',links=[]}){
    fields.title.textContent=title;fields.summary.textContent=summary;fields.eyebrow.textContent=eyebrow;
    fields.content.replaceChildren(bodyText(paragraphs));fields.tags.replaceChildren();fields.links.replaceChildren();fields.art.innerHTML=art;
    for(const t of tags){const span=document.createElement('span');span.textContent=t;fields.tags.append(span)}
    for(const l of links){if(!l.url)continue;const a=document.createElement('a');a.href=l.url;a.textContent=l.name;a.target='_blank';a.rel='noopener noreferrer';fields.links.append(a)}
    if(list.open)list.close();dialog.showModal();
  }
  function openProject(id){const p=projects.find(x=>x.id===id);if(!p)return;
    initialize({title:p.title,summary:p.summary,eyebrow:p.code,paragraphs:[p.description,`What I learned: ${p.lessons}`],tags:p.tags,art:artFor(p),links:[{name:'VIEW SOURCE ↗',url:p.github}]});onProjectOpen(p);
  }
  function openInfo(item){
    if(item.type==='project')return openProject(item.projectId);
    const kind=item.type;
    if(kind==='about')initialize({title:'Hello, I’m Jesse.',eyebrow:'THE PERSON BEHIND THE BOARDS',summary:'Computer Engineering student at UMass Lowell with a love for building things that you can actually hold.',paragraphs:['I work at the intersection of electronics, embedded firmware, and hands-on prototyping. When I’m not in class, I’m probably trying to squeeze another microcontroller, sensor, or LED onto a tiny PCB.','I enjoy the full process — ideas, design reviews, routing, assembly, failures, testing, and making the next revision better. This studio is a digital shelf for the things I’ve built.'],tags:['UMASS LOWELL','COMPUTER ENGINEERING','PCB DESIGN','EMBEDDED SYSTEMS'],links:[{name:'GITHUB ↗',url:site.github},{name:'LINKEDIN ↗',url:site.linkedin}]});
    if(kind==='resume')initialize({title:'The résumé.',eyebrow:'A QUICK LOOK / PDF',summary:site.resume?'View the latest copy of my résumé.':'I’ll add my PDF here soon. Until then, the projects and experience around the studio tell the story.',paragraphs:['Experience includes a quality engineering co-op in semiconductor equipment manufacturing and hands-on academic and personal hardware projects.'],tags:['WORK EXPERIENCE','SKILLS','PROJECTS'],links:[{name:'OPEN RESUME PDF ↗',url:site.resume}]});
    if(kind==='experience')initialize({title:'From classroom to cleanroom.',eyebrow:'EXPERIENCE / ENGINEERING',summary:'Designing hardware is one part of engineering. Testing, quality, communication, and follow-through matter too.',paragraphs:['At Applied Materials / NEXX, my Quality Engineering co-op included inspection, repeatability and reproducibility work, qualification support, and shipment verification.','I also build through student engineering teams and personal electronics projects. The lessons go both ways: DFM influences design, and design understanding makes for better investigation and testing.'],tags:['QUALITY ENGINEERING','TEST & VALIDATION','PCB DESIGN','TEAMWORK']});
    if(kind==='revisions')initialize({title:'The wall of revisions.',eyebrow:'PROCESS / MISTAKES WELCOME',summary:'Some of the best engineering lessons are hidden in the boards that didn’t work.',paragraphs:['Bad clearance, parts that behaved differently than expected, unexpected shorts, and layouts that needed another pass — each one added to the next design.','Eventually I want to mount photographs of the actual boards here, including my business-card revisions and the stories behind the rework.'],tags:['DESIGN ITERATION','DEBUGGING','DFM','LESSONS LEARNED']});
    if(kind==='scope')initialize({title:'A little signal art.',eyebrow:'WORKBENCH / XY MODE',summary:'Two simulated sine-wave generators feed an oscilloscope in X–Y mode to produce a dancing Lissajous pattern.',paragraphs:['The display is generated in JavaScript. Its motion comes from a changing phase relationship, just like a physical oscilloscope can show when one signal drives its X input and another drives Y.','It is a small decorative simulation rather than a model of a specific instrument. The function-generator display and rework equipment are part of the interactive studio art.'],tags:['LISSAJOUS','OSCILLOSCOPE','FUNCTION GENERATOR','JAVASCRIPT']});
  }
  const listBody=$('all-projects-list');
  function showList(){listBody.replaceChildren();for(const p of projects){const b=document.createElement('button');b.type='button';const small=document.createElement('small');small.textContent=p.status==='completed'?'GALLERY / FINISHED':'WORKSHOP / IN PROGRESS';const strong=document.createElement('strong');strong.textContent=p.title;const span=document.createElement('span');span.textContent=p.summary;b.append(small,strong,span);b.addEventListener('click',()=>openProject(p.id));listBody.append(b)}list.showModal()}
  $('project-index').addEventListener('click',showList);$('browse-all').addEventListener('click',showList);$('help').addEventListener('click',()=>help.showModal());
  $('resume-link').addEventListener('click',()=>{if(site.resume){window.open(site.resume,'_blank','noopener,noreferrer')}else openInfo({type:'resume'})});
  return {openInfo,openProject,showList};
}
