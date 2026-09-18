const fs=require('fs');
const X=process.argv[2];
const dec=(s)=>s.replace(/&lt;/g,'<').replace(/&gt;/g,'>').replace(/&quot;/g,'"').replace(/&apos;/g,"'").replace(/&#(\d+);/g,(_,d)=>String.fromCharCode(+d)).replace(/&amp;/g,'&');
let shared=[];
try{
  const ss=fs.readFileSync(X+'/xl/sharedStrings.xml','utf8');
  shared=[...ss.matchAll(/<si>([\s\S]*?)<\/si>/g)].map(m=>[...m[1].matchAll(/<t[^>]*>([\s\S]*?)<\/t>/g)].map(t=>dec(t[1])).join(''));
}catch(e){}
const colNum=(ref)=>{const c=ref.match(/^[A-Z]+/)[0];let n=0;for(const ch of c)n=n*26+(ch.charCodeAt(0)-64);return n-1;};
function sheet(file){
  const xml=fs.readFileSync(X+'/xl/worksheets/'+file,'utf8');
  const rows=[];
  for(const rm of xml.matchAll(/<row([^>]*)>([\s\S]*?)<\/row>/g)){
    const rn=+(rm[1].match(/r="(\d+)"/)||[0,0])[1];
    const cells=[];
    for(const cm of rm[2].matchAll(/<c\b([^>]*?)(\/>|>([\s\S]*?)<\/c>)/g)){
      const attr=cm[1];
      const body=cm[2]==='/>'?'':cm[3];
      const ref=(attr.match(/\br="([A-Z]+\d+)"/)||[])[1];
      if(!ref) continue;
      const t=(attr.match(/\bt="([^"]+)"/)||[])[1];
      let v=null;
      const isM=body.match(/<is>([\s\S]*?)<\/is>/);
      if(isM) v=[...isM[1].matchAll(/<t[^>]*>([\s\S]*?)<\/t>/g)].map(x=>dec(x[1])).join('');
      else{const vm=body.match(/<v>([\s\S]*?)<\/v>/); if(vm) v=vm[1];}
      if(v===null) continue;
      v = (t==='s') ? (shared[+v]??'') : dec(String(v));
      cells[colNum(ref)]=v;
    }
    if(cells.length) rows.push({r:rn,c:Array.from(cells,x=>x===undefined?'':x)});
  }
  return rows;
}
const out={};
for(const [name,file] of JSON.parse(process.argv[3])) out[name]=sheet(file);
fs.writeFileSync(process.argv[4], JSON.stringify(out,null,1));
for(const [name,rows] of Object.entries(out)) console.log(name,'rows:',rows.length);
