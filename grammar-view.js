function renderGrammarErrors(a){
  const completed=a.questions.every(q=>checkedFor(a,q));
  const selectedCorrect=a.questions.filter(q=>checkedFor(a,q)?.correct&&checkedFor(a,q)?.selected).length;
  const wrong=a.questions.filter(q=>checkedFor(a,q)&&!checkedFor(a,q).correct).length;
  const passage=a.passage.split(/\n\s*\n/).map(paragraph=>{
    let html='',cursor=0;
    for(const match of paragraph.matchAll(/\[\[error-(\d+)\]\]/g)){
      html+=formatArticleText(paragraph.slice(cursor,match.index));
      const q=a.questions.find(q=>q.number===Number(match[1]));
      const checked=checkedFor(a,q),selected=!!selectedFor(a,q);
      const state=checked?(!checked.correct?'is-wrong':selected?'is-correct':''):selected?'is-selected':'';
      html+=`<span class="grammar-error-option ${state}" role="checkbox" tabindex="${completed?'-1':'0'}" aria-checked="${selected}" aria-disabled="${completed}" aria-label="第 ${q.number} 项：${esc(q.prompt)}${checked?checked.correct?'，判断正确':'，判断错误':''}" data-error-qid="${q.id}"><span class="grammar-error-number" aria-hidden="true">${q.number}</span>${formatArticleText(q.prompt)}</span>`;
      cursor=match.index+match[0].length;
    }
    return `<p>${html+formatArticleText(paragraph.slice(cursor))}</p>`;
  }).join('');
  return `<div class="reader-screen">${siteHeader('reader')}${breadcrumbs([{title:'英语题目',category:'english'},{title:a.title}])}<main class="reader-document"><div class="reader-toolbar"><span class="article-kind">语法错误辨析 / 多选</span></div><article class="reader-article"><h1 lang="en">${esc(a.title)}</h1><p class="grammar-instruction">选择有语法错误的标记部分。</p><div class="reader-rule" aria-hidden="true"></div><div class="reader-copy grammar-error-copy" lang="en">${passage}</div>${renderArticleSource(a)}</article><section class="check-zone" aria-label="作答与核对">${completed?`<div class="grammar-result" role="status"><p>${wrong?'已核对':'全部正确'} / ${selectedCorrect} 项选对</p><p>正确答案：${a.questions.filter(q=>q.answer).map(q=>q.number).join(' / ')}</p></div><button class="reset-link" data-action="reset">重新作答</button>`:`<button class="check-all-button" data-action="check">核对答案</button>`}</section></main></div>`;
}
function toggleGrammarError(qid){
  const a=articles.find(a=>a.id===activeId),q=a?.questions.find(q=>q.id===qid);
  if(!q||checkedFor(a,q))return;
  const selected=!selectedFor(a,q);selections[`${a.id}:${q.id}`]=selected;
  const el=document.querySelector(`[data-error-qid="${qid}"]`);
  if(el){el.classList.toggle('is-selected',selected);el.setAttribute('aria-checked',String(selected))}
}
function bindGrammarErrors(){
  document.querySelectorAll('[data-error-qid]').forEach(el=>{
    el.onclick=()=>toggleGrammarError(el.dataset.errorQid);
    el.onkeydown=event=>{if((event.key===' '||event.key==='Enter')&&!event.repeat){event.preventDefault();toggleGrammarError(el.dataset.errorQid)}};
  });
}
function checkGrammarErrors(a){
  a.questions.forEach(q=>{const selected=!!selectedFor(a,q);answers[`${a.id}:${q.id}`]={selected,correct:selected===q.answer}});
  persist();render(false);
}
