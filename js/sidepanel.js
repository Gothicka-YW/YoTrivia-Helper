import {CATEGORIES,DEFAULTS,load,save,uid,newSession} from './state.js';
const $=s=>document.querySelector(s), $$=s=>Array.from(document.querySelectorAll(s));
let state={settings:DEFAULTS,roster:[],session:null};

function setTab(name){$$('.view').forEach(v=>v.style.display=v.id===name?'':'none');}
function renderRoster(){const box=$('#roster');box.innerHTML='';state.roster.forEach(p=>{const d=document.createElement('div');d.className='list-item';d.innerHTML=`<span>${p.name} <span class="badge">${p.score||0}</span></span><span><button data-id="${p.id}" class="rm">Remove</button></span>`;box.appendChild(d);});}
function updateHUD(){const s=$('#status');s.textContent=state.session?'active':'idle';$('#progress').textContent=state.session?`${state.session.asked.length}/${state.session.qPer}`:'0/0';$('#catNow').textContent=state.session?.current?.category||'—';$('#qText').textContent=state.session?.current?.text||'No question loaded';$('#aWrap').style.display='none';$('#aText').textContent=state.session?.current?.answer||'—';}
function ensureSession(){if(!state.session){state.session=newSession($('#category').value,parseInt($('#qPer').value||'25',10));}}
function mapColor(c){const m=state.settings.colorMap;const k={y:'yellow',b:'blue',o:'orange',r:'red',p:'purple',g:'green'}[c];return m[k]||'General Knowledge';}
function nextQ(forceCat){ensureSession();if(state.session.asked.length>=state.session.qPer){alert('Session complete');return;}const cat=forceCat||(state.session.category==='random'?CATEGORIES[Math.floor(Math.random()*CATEGORIES.length)]:state.session.category);const q={id:uid('q'),category:cat,text:`[placeholder from ${cat}]`,answer:'[answer]'};state.session.current=q;state.session.asked.push({id:q.id,category:cat,t:Date.now()});state.session.locked=false;updateHUD();persist();}
function award(){const inp=$('#winner');const name=inp.value.trim();if(!name||!state.session?.current)return;let p=state.roster.find(x=>x.name.toLowerCase()===name.toLowerCase());if(!p){p={id:uid('p'),name,score:0};state.roster.push(p);} if(state.settings.lockOnAward&&state.session.locked)return; p.score=(p.score||0)+1;state.session.locked=!!state.settings.lockOnAward;inp.value='';renderRoster();persist();}
async function persist(){await save({settings:state.settings,roster:state.roster,session:state.session});}
async function init(){Object.assign(state, await load()); // Setup tab
CATEGORIES.forEach(c=>$('#category').insertAdjacentHTML('beforeend',`<option value="${c}">${c}</option>`));
['mapYellow','mapBlue','mapOrange','mapRed','mapPurple','mapGreen'].forEach(id=>{const sel=$('#'+id); CATEGORIES.forEach(c=> sel.insertAdjacentHTML('beforeend',`<option value="${c}">${c}</option>`)); });
const m=state.settings.colorMap;$('#mapYellow').value=m.yellow;$('#mapBlue').value=m.blue;$('#mapOrange').value=m.orange;$('#mapRed').value=m.red;$('#mapPurple').value=m.purple;$('#mapGreen').value=m.green;
$('#qPer').value=state.settings.qPer||25; renderRoster(); updateHUD();
// events
$('#tabs').addEventListener('click',e=>{const t=e.target.closest('button[data-tab]'); if(t) setTab(t.dataset.tab);});
$('#addPlayer').addEventListener('keydown',e=>{if(e.key==='Enter'){const v=e.target.value.trim(); if(!v) return; state.roster.push({id:uid('p'),name:v,score:0}); e.target.value=''; renderRoster(); persist();}});
$('#roster').addEventListener('click',e=>{if(e.target.classList.contains('rm')){state.roster=state.roster.filter(p=>p.id!==e.target.dataset.id); renderRoster(); persist();}});
$('#start').addEventListener('click',()=>{state.session=newSession($('#category').value,parseInt($('#qPer').value||'25',10)); updateHUD(); persist();});
$('#next').addEventListener('click',()=> nextQ());
$('#reveal').addEventListener('click',()=> $('#aWrap').style.display='');
$('#copyQ').addEventListener('click',()=> navigator.clipboard.writeText('Trivia Q: '+($('#qText').textContent||'')));
$('#copyA').addEventListener('click',()=> navigator.clipboard.writeText('Answer: '+($('#aText').textContent||'')));
$('#award').addEventListener('click',award);
$('#winner').addEventListener('keydown',e=>{if(e.key==='Enter') award();});
// color buttons
$$('.color').forEach(b=> b.addEventListener('click',()=> nextQ(mapColor(b.dataset.k))));
// save settings
$('#save').addEventListener('click',()=>{state.settings.qPer=parseInt($('#qPer').value||'25',10);state.settings.colorMap={yellow:$('#mapYellow').value,blue:$('#mapBlue').value,orange:$('#mapOrange').value,red:$('#mapRed').value,purple:$('#mapPurple').value,green:$('#mapGreen').value}; persist(); $('#saved').textContent='Saved'; setTimeout(()=>$('#saved').textContent='',1200);});
setTab('setup');}
init();