const physicsMathCache=new Map();
function renderPhysicsMath(tex,displayMode=false){
  const key=(displayMode?'display:':'inline:')+tex;
  if(physicsMathCache.has(key))return physicsMathCache.get(key);
  let html;
  try{
    if(typeof katex==='undefined')throw new Error('Formula renderer unavailable');
    html=katex.renderToString(tex,{displayMode,throwOnError:true,strict:'error',trust:false,output:'htmlAndMathml'});
  }catch(error){
    console.error('Formula rendering failed',tex,error);
    html=`<code class="math-error" role="alert" aria-label="${t("公式渲染失败")}">${esc(tex)}</code>`;
  }
  const output=`<span class="${displayMode?'exam-math':'math-inline'}">${html}</span>`;
  physicsMathCache.set(key,output);
  return output;
}
function formatPhysicsText(text){
  let cursor=0,output='';
  for(const match of String(text).matchAll(/\$([^$]+)\$/g)){
    output+=esc(text.slice(cursor,match.index));
    output+=renderPhysicsMath(match[1]);
    cursor=match.index+match[0].length;
  }
  return output+esc(String(text).slice(cursor));
}
function renderPhysicsBlocks(blocks,paper){
  return blocks.map(block=>{
    if(block.type==='paragraph')return `<p>${formatPhysicsText(block.text)}</p>`;
    if(block.type==='math')return renderPhysicsMath(block.tex,true);
    if(block.type==='figure'){
      const asset=PHYSICS_IMAGES[block.id];
      return `<figure class="exam-figure figure-${esc(block.id)}"><a href="${esc(paper.directory)}${esc(asset.file)}" target="_blank" rel="noopener" aria-label="${t("放大图 {n}",esc(block.id))}"><img src="${esc(paper.directory)}${esc(asset.file)}" width="${asset.width}" height="${asset.height}" alt="${esc(block.alt)}" loading="lazy" decoding="async"></a></figure>`;
    }
    if(block.type==='question')return `<div class="exam-question" data-exam-question>${block.label?`<span class="exam-question-label">${esc(block.label)}</span>`:''}<div class="exam-question-body">${renderPhysicsBlocks(block.blocks,paper)}</div></div>`;
    if(block.type==='table')return `<div class="exam-table-wrap"><table class="exam-table"><thead><tr>${block.headers.map(value=>`<th scope="col">${esc(value)}</th>`).join('')}</tr></thead><tbody>${block.rows.map(row=>`<tr>${row.map((value,i)=>i===0?`<th scope="row">${formatPhysicsText(value)}</th>`:`<td>${formatPhysicsText(value)}</td>`).join('')}</tr>`).join('')}</tbody></table></div>`;
    return '';
  }).join('');
}
function renderPhysicsLibrary(){
  return `<div class="library-screen">${siteHeader('physics')}${breadcrumbs([{title:t("物理题目")}])}<main class="site-main"><div class="page-heading"><h1>${t("物理题目")}</h1><span>Physics</span></div><div class="minimal-list">${PHYSICS_PAPERS.map((paper,i)=>`<button class="minimal-list-item" data-open-paper="${esc(paper.id)}"><span class="list-index">${String(i+1).padStart(2,'0')}</span><span class="list-title">${esc(paper.title)}</span></button>`).join('')}</div></main></div>`;
}
function renderPhysicsExam(paper){
  return `<div class="reader-screen">${siteHeader('physics')}${breadcrumbs([{title:t("物理题目"),category:'physics'},{title:paper.title}])}<main class="reader-document exam-document"><header class="exam-header"><p class="article-kind">${esc(paper.source)}</p><h1>${esc(paper.subtitle)}</h1></header><nav class="exam-navigation" aria-label="${t("试题导航")}">${paper.problems.map(problem=>`<button data-jump-question="${problem.number}">${t("第 {n} 题",problem.number)}</button>`).join('')}</nav><div class="exam-copy">${paper.problems.map(problem=>`<article class="exam-problem" id="physics-question-${problem.number}"><header class="exam-problem-heading"><h2>${t("第 {n} 题",problem.number)}</h2><span>${esc(problem.topic)}</span></header>${renderPhysicsBlocks(problem.introduction,paper)}${problem.sections.map(section=>`<section class="exam-part"><h3>${esc(section.label)}</h3>${renderPhysicsBlocks(section.blocks,paper)}<details class="exam-answers"><summary><span>${t("参考答案")}</span><svg class="answer-toggle" viewBox="0 0 20 20" width="20" height="20" aria-hidden="true" focusable="false"><path d="M4 10H16"/><path class="toggle-vertical" d="M10 4V16"/></svg></summary><div class="exam-answer-content">${renderPhysicsBlocks(section.answers,paper)}</div></details></section>`).join('')}</article>`).join('')}</div></main></div>`;
}
function bindPhysics(){
  document.querySelectorAll('[data-open-paper]').forEach(el=>el.onclick=()=>{
    activeId=el.dataset.openPaper;currentSection='physics';render();
  });
  document.querySelectorAll('[data-jump-question]').forEach(el=>el.onclick=()=>{
    document.getElementById(`physics-question-${el.dataset.jumpQuestion}`)?.scrollIntoView({behavior:'instant',block:'start'});
  });
}
