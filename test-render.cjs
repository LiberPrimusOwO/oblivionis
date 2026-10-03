const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
const {execFileSync}=require('node:child_process');
const path=require('node:path');
const root=__dirname;
const data=JSON.parse(execFileSync('python3',['-c',`import json
from compiler import parse_article
samples={
'article':'正文。\\n\\n$E=mc^2$',
'cloze':'He {{1}} here.\\n:::answers\\n1: is',
'choice':'Original passage.\\n:::question 1 / B\\nQuestion?\\nA: One\\nB: Two',
'errors':':::question 22 / B\\n[[A|He]] [[B|are]] here.',
'multiple':'[[1|He is]] here. [[2|She are]] there.\\n:::answers\\n2'}
print(json.dumps([parse_article('---\\nid: sample-'+k+'\\ntitle: Sample\\ntype: '+k+'\\nsection: '+('papers' if k=='article' else 'english')+'\\n---\\n'+v) for k,v in samples.items()]))`],{cwd:root,encoding:'utf8'}));
if(fs.existsSync(path.join(root,'tokyo-2026-math.article')))data.push(JSON.parse(execFileSync('python3',['-c',`import json
from pathlib import Path
from compiler import parse_article
print(json.dumps(parse_article(Path('tokyo-2026-math.article').read_text())))`],{cwd:root,encoding:'utf8'})));
const storage=new Map();
storage.set('oblivionis_articles_v4',JSON.stringify([{...data[0],revision:'old'},{id:'removed-source',questions:[]}]));
storage.set('oblivionis_answers_v4',JSON.stringify({'sample-article:q1':{correct:true}}));
storage.set('oblivionis_compiled_ids_v1',JSON.stringify(['sample-article','removed-source']));
const context=vm.createContext({COMPILED_ARTICLES:data,console,crypto:{},katex:require('./vendor--katex--katex.min.js'),
  localStorage:{getItem:k=>storage.get(k),setItem:(k,v)=>storage.set(k,v)},
  window:{},document:{},RESEARCH_PAPERS:[],PHYSICS_PAPERS:[]});
for(const name of ['physics-view.js','grammar-data.js','grammar-view.js','app.js']){
  let code=fs.readFileSync(path.join(root,name),'utf8');
  if(name==='app.js')code=code.replace(/initializeNavigation\(\);\s*$/,'');
  vm.runInContext(code,context,{filename:name});
}
vm.runInContext(`
if(articles.some(a=>a.id==='removed-source'))throw Error('Deleted source survived');
if(answers['sample-article:q1'])throw Error('Changed source kept stale answers');
`,context);
for(const a of data){
  context.targetId=a.id;
  const html=vm.runInContext('renderReader(articles.find(a=>a.id===targetId))',context);
  assert(!html.includes('undefined'),a.id);
  if(a.type==='exam'){
    assert.equal(a.problems.length,6);
    assert.equal((html.match(/<details class="exam-answers">/g)||[]).length,11);
    assert.equal(a.problems[0].parts[1].answer,null);
    assert.equal(a.problems[5].parts[1].answer,null);
    assert(!html.includes('math-error'));assert(html.includes('katex'));
    assert(!html.includes('t01-21a.pdf'));assert(html.includes('data-category="math"'));
  }
  if(a.type==='article'){assert(html.includes('katex'));assert(!html.includes('data-action="check"'));assert(html.includes('data-category="papers"'));}
  if(a.type==='error-selection'){
    assert(html.includes('role="checkbox"'));
    vm.runInContext(`const multi=articles.find(a=>a.id===targetId);multi.questions.forEach(q=>answers[multi.id+':'+q.id]={selected:q.answer,correct:true});`,context);
    const checked=vm.runInContext('renderReader(articles.find(a=>a.id===targetId))',context);
    assert(checked.includes('正确答案：2'));assert(!checked.includes('1 / 8 / 11'));
  }else if(a.questions.length){
    vm.runInContext(`articles.find(a=>a.id===targetId).questions.forEach(q=>answers[targetId+':'+q.id]={selected:q.answer,correct:true});`,context);
    assert(vm.runInContext('renderReader(articles.find(a=>a.id===targetId))',context).includes('答对'));
  }
}
assert(vm.runInContext("renderEnglishLibrary().includes('正文。')",context)===false);
console.log('网站接入检查通过：英语题型、试卷、证明题隐藏答案、公式、更新与删除同步');
if(fs.existsSync(path.join(root,'_site/navigation.js')))execFileSync('node',[path.join(root,'test-navigation.cjs'),path.join(root,'_site')],{stdio:'inherit'});
