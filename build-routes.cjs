const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const target=process.argv[2];
const context=vm.createContext({localStorage:{getItem:()=>null,setItem:()=>{}},crypto:{},console});
for(const name of ['physics-data.js','papers-data.js','grammar-data.js','compiled-articles.js','navigation.js','app.js']){
  vm.runInContext(fs.readFileSync(path.join(target,name),'utf8').replace(/initializeNavigation\(\);\s*$/,''),context);
}
const routes=vm.runInContext(`SECTIONS.flatMap(s=>{const list=sectionEntries(s.id);return ['/'+s.id,...list.flatMap((a,i)=>{const base='/'+s.id+'/'+routeNumber(i+1);return [base,...questionEntries(a).map((q,j)=>base+'/'+routeNumber(q.number||j+1))]})]})`,context);
const index=fs.readFileSync(path.join(target,'index.html'),'utf8');
for(const route of routes){const dir=path.join(target,route);fs.mkdirSync(dir,{recursive:true});fs.writeFileSync(path.join(dir,'index.html'),index)}
console.log(`Created ${routes.length} direct archive, article and question routes`);
