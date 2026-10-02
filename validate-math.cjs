const fs=require('node:fs');
const katex=require('./vendor--katex--katex.min.js');
const articles=JSON.parse(fs.readFileSync(process.argv[2],'utf8'));
let count=0;
for(const a of articles){
  const texts=[a.passage,...a.questions.flatMap(q=>[q.passage||q.prompt||'',...(q.options||[])]),...(a.problems||[]).flatMap(p=>[p.introduction,...p.parts.flatMap(s=>[s.text,s.answer||''])])];
  for(const text of texts)for(const m of text.matchAll(/(?<!\\)(\$\$?)([\s\S]*?)\1/g)){
    try{katex.renderToString(m[2],{displayMode:m[1]==='$$',throwOnError:true,strict:'error',trust:false});count++;}
    catch(e){console.error(`${a.id}: LaTeX 编译失败：${m[2]}\n${e.message}`);process.exit(1);}
  }
}
console.log(`LaTeX 检查通过：${count} 个公式`);
