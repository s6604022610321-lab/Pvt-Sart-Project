// ฟังก์ชันร่วม: PRNG (seeded), config, CSV, อัลกอริทึมสุ่ม
const PE={
 rng(seed){let a=seed>>>0;return()=>{a=(a+0x6D2B79F5)>>>0;let t=a;t=Math.imul(t^t>>>15,t|1);t^=t+Math.imul(t^t>>>7,t|61);return((t^t>>>14)>>>0)/4294967296}},
 cfg(){const P=new URLSearchParams(location.search),g=(k,d)=>P.get(k)||d;
  return{id:g('id','ID_7421'),session:g('session','3 (Day 1)'),seed:+g('seed',Math.floor(Math.random()*1e6)),
  trials:+g('trials',60),kss:+g('kss',4),isiMin:+g('isimin',2000),isiMax:+g('isimax',10000),
  sartTrials:+g('sart_trials',225),probes:+g('probes',5),probeGap:+g('probegap',20)}},
 isi(rng,min,max){return min+rng()*(max-min)},                       // Uniform(min,max)
 sartSeq(rng,n=225,maxRun=15,target=3){          // สร้างลำดับโดยตรง (ไม่ใช้ rejection sampling -> เร็วและไม่ค้าง)
  const per=Math.max(1,Math.round(n/9)),m=n-per,cap=Math.max(maxRun,Math.ceil(m/per)),base=Math.floor(m/per),g=Array(per).fill(base);
  for(let i=0;i<m-base*per;i++)g[i]++;                       // g = จำนวนตัวเลขอื่นระหว่าง No-Go แต่ละตัว (แบบวงกลม)
  for(let s=0;s<per*80;s++){const i=Math.floor(rng()*per),j=Math.floor(rng()*per);if(i!==j&&g[i]>0&&g[j]<cap){g[i]--;g[j]++}}  // สุ่มช่องว่าง โดยแต่ละช่อง <= maxRun
  const other=[1,2,3,4,5,6,7,8,9].filter(d=>d!==target),o=Array.from({length:m},(_,t)=>other[t%8]);
  for(let i=o.length-1;i>0;i--){const j=Math.floor(rng()*(i+1));[o[i],o[j]]=[o[j],o[i]]}
  const a=[];let p=0;g.forEach(c=>{a.push(target);for(let i=0;i<c;i++)a.push(o[p++])});
  const k=Math.floor(rng()*n);return a.slice(k).concat(a.slice(0,k))},   // หมุนตำแหน่งสุ่ม -> No-Go ไม่เอนเอียงที่ต้น/ท้ายลำดับ
 probePos(rng,n,k,gap){gap=Math.min(gap,Math.max(1,Math.floor((n-20)/k)));for(;;){const s=new Set();while(s.size<k)s.add(10+Math.floor(rng()*(n-20)));
  const a=[...s].sort((x,y)=>x-y);if(a.every((v,i)=>i===0||v-a[i-1]>=gap))return a}},
 csv(rows){if(!rows.length)return'';const h=Object.keys(rows[0]);
  return h.join(',')+'\n'+rows.map(r=>h.map(k=>JSON.stringify(r[k]??'')).join(',')).join('\n')},
 download(name,rows){const b=new Blob(['\ufeff'+PE.csv(rows)],{type:'text/csv'}),a=document.createElement('a');
  a.href=URL.createObjectURL(b);a.download=name;a.click()},
 mmss(ms){const s=Math.floor(ms/1000);return String(Math.floor(s/60)).padStart(2,'0')+':'+String(s%60).padStart(2,'0')}
};

PE.digit=e=>{const m=/^(?:Digit|Numpad)([0-9])$/.exec(e.code);return m?+m[1]:-1};
PE.toast=msg=>{let t=document.getElementById('toast');if(!t){t=document.createElement('div');t.id='toast';t.className='toast';document.body.appendChild(t)}
 t.textContent=msg;t.classList.add('show');clearTimeout(PE._tt);PE._tt=setTimeout(()=>t.classList.remove('show'),1800)};

PE.result=(title,rows,files,again)=>{const m=document.createElement('div');m.className='modal';m.style.cssText='display:flex;position:fixed';
 m.innerHTML='<div class="box res"><h2></h2><table></table><div class="acts"></div></div>';m.querySelector('h2').textContent=title;
 const tb=m.querySelector('table');rows.forEach(([k,v])=>{const r=tb.insertRow();r.insertCell().textContent=k;r.insertCell().textContent=v});
 const a=m.querySelector('.acts'),mk=(t,f)=>{const b=document.createElement('button');b.className='btn';b.textContent=t;b.onclick=f;a.appendChild(b)};
 mk('⬇ ดาวน์โหลด CSV',()=>files.forEach(f=>PE.download(f.name,f.rows)));mk('เล่นอีกครั้ง',again||(()=>location.reload()));mk('กลับเมนู',()=>location.href='index.html');
 document.body.appendChild(m)};
PE.median=a=>{const s=[...a].sort((x,y)=>x-y),n=s.length;return n?(n%2?s[(n-1)/2]:(s[n/2-1]+s[n/2])/2):NaN};
PE.f1=v=>isFinite(v)?v.toFixed(1)+' ms':'-';
