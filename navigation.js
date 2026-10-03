// Public paths follow the visible archive order. Answers remain keyed by article id.
let restoringRoute=false;
function sectionEntries(section){
  const builtins=section==='physics'?PHYSICS_PAPERS:section==='papers'?RESEARCH_PAPERS:[];
  const source=[...seedArticles,GRAMMAR_ERROR_ARTICLE,...compiledArticles];
  return [...builtins,...source.filter(a=>(a.section||'english')===section)];
}
const routeNumber=n=>String(n).padStart(2,'0');
function articlePath(section=currentSection,id=activeId){
  if(section==='categories')return '/';
  const index=sectionEntries(section).findIndex(a=>a.id===id);
  return '/'+section+(index<0?'':'/'+routeNumber(index+1));
}
function questionEntries(a){return a.problems||a.questions||[]}
function syncNavigation(){
  if(restoringRoute)return;
  const path=articlePath();
  if(location.pathname.replace(/\/$/,'')!==path.replace(/\/$/,'')){
    history.replaceState({...history.state,scrollY:window.scrollY},'');
    history.pushState({oblivionis:true},'',path);
  }
}
function questionElement(number){
  return document.getElementById('exam-question-'+number)||document.getElementById('physics-question-'+number)||document.querySelector('[data-route-question="'+number+'"]');
}
function jumpToQuestion(number,replace=false){
  const target=questionElement(number);
  if(!target)return;
  history[replace?'replaceState':'pushState']({oblivionis:true},'',articlePath()+'/'+routeNumber(number));
  target.scrollIntoView({behavior:'instant',block:'start'});
}
function restoreNavigation(){
  const segments=location.pathname.split('/').filter(Boolean);
  currentSection=SECTIONS.some(s=>s.id===segments[0])?segments[0]:'categories';
  const entry=sectionEntries(currentSection)[Number(segments[1])-1];
  activeId=entry?.id||'';
  restoringRoute=true;render();restoringRoute=false;
  const number=Number(segments[2]);
  const legacy=location.hash.match(/^#(?:exam|physics)-question-(\d+)$/);
  if(number)questionElement(number)?.scrollIntoView({behavior:'instant',block:'start'});
  else if(legacy&&activeId)jumpToQuestion(Number(legacy[1]),true);
  else if(history.state?.scrollY)window.scrollTo({top:history.state.scrollY,behavior:'instant'});
}
function bindNavigation(){
  document.querySelectorAll('.exam-navigation a,[data-jump-question]').forEach(el=>{
    const n=Number(el.dataset.jumpQuestion||el.getAttribute('href')?.match(/question-(\d+)/)?.[1]);
    if(!n)return;
    if(el.tagName==='A')el.href=articlePath()+'/'+routeNumber(n);
    el.onclick=event=>{if(event.metaKey||event.ctrlKey||event.shiftKey||event.altKey)return;event.preventDefault();jumpToQuestion(n)};
  });
}
function backInArchive(){
  // Native history retains reading position and question navigation.
  if(history.state?.oblivionis){history.back();return}
  if(location.pathname==='/'||currentSection==='categories')return;
  if(location.pathname.split('/').filter(Boolean).length>2){history.pushState({oblivionis:true},'',articlePath());restoreNavigation();return}
  if(activeId)activeId='';else currentSection='categories';render();
}
function isBackSwipe(start,end){
  const dx=end.x-start.x,dy=Math.abs(end.y-start.y);
  return dx>=90&&dx>dy*2.5&&end.time-start.time<800;
}
function initializeNavigation(){
  restoreNavigation();
  window.addEventListener('popstate',restoreNavigation);
  let start=null;
  document.addEventListener('touchstart',event=>{
    start=null;
    if(event.touches.length!==1||event.target.closest('input,textarea,select,[contenteditable],.math-inline,.exam-math,.exam-table-wrap'))return;
    let el=event.target;
    while(el&&el!==document.body){if(el.scrollWidth>el.clientWidth+2&&['auto','scroll'].includes(getComputedStyle(el).overflowX))return;el=el.parentElement}
    const p=event.touches[0];start={x:p.clientX,y:p.clientY,time:performance.now(),path:location.pathname};
  },{passive:true});
  document.addEventListener('touchmove',event=>{if(event.touches.length!==1)start=null},{passive:true});
  document.addEventListener('touchcancel',()=>{start=null},{passive:true});
  document.addEventListener('touchend',event=>{
    if(!start)return;
    const origin=start;start=null;
    if(origin.path!==location.pathname)return;
    const p=event.changedTouches[0];
    if(p&&isBackSwipe(origin,{x:p.clientX,y:p.clientY,time:performance.now()}))backInArchive();
  },{passive:true});
}
