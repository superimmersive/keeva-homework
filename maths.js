// Maths hub: question generators + interactive practice runner
(function(){
const H=window.HW;
const M=H.maths;
const ri=(a,b)=>a+Math.floor(Math.random()*(b-a+1));
const pick=a=>a[Math.floor(Math.random()*a.length)];
const shuffle=a=>{const x=[...a];for(let i=x.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[x[i],x[j]]=[x[j],x[i]]}return x};
const esc=s=>String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));

const ones=['zero','one','two','three','four','five','six','seven','eight','nine','ten','eleven','twelve','thirteen','fourteen','fifteen','sixteen','seventeen','eighteen','nineteen'];
const tens=['','','twenty','thirty','forty','fifty','sixty','seventy','eighty','ninety'];
function numberName(n){
  n=Math.abs(+n)|0;
  if(n<20)return ones[n];
  if(n<100)return tens[Math.floor(n/10)]+(n%10?'-'+ones[n%10]:'');
  if(n<1000){
    const h=Math.floor(n/100), r=n%100;
    return ones[h]+' hundred'+(r?' and '+numberName(r):'');
  }
  return String(n);
}
function normName(s){
  return String(s).toLowerCase().replace(/[\u2018\u2019']/g,'').replace(/[^a-z\s-]/g,' ')
    .replace(/\band\b/g,' ').replace(/-/g,' ').replace(/\s+/g,' ').trim();
}
function namesMatch(typed, correct){
  const a=normName(typed), b=normName(correct);
  if(a===b)return true;
  // allow missing "and"
  return a.replace(/\s/g,'')===b.replace(/\s/g,'');
}

function fmtMoney(cents){
  cents=Math.round(cents);
  if(cents%100===0)return 'R'+(cents/100);
  if(cents<100)return cents+'c';
  const rands=Math.floor(cents/100), c=String(cents%100).padStart(2,'0');
  return 'R'+rands+','+c;
}
function parseMoney(s){
  s=String(s).trim().toLowerCase().replace(/\s+/g,'');
  if(!s)return null;
  if(/^\d+c$/.test(s))return parseInt(s,10);
  let m=s.match(/^r?(\d+)[,.](\d{1,2})$/);
  if(m){
    const whole=+m[1], frac=m[2].length===1?+m[2]*10:+m[2];
    return whole*100+frac;
  }
  m=s.match(/^r(\d+)$/);
  if(m)return +m[1]*100;
  if(/^\d+$/.test(s))return parseInt(s,10);
  return null;
}
function moneyEqual(typed, cents){
  const p=parseMoney(typed);
  if(p===cents)return true;
  const t=String(typed).trim().toLowerCase().replace(/\s+/g,'');
  if(cents%100===0 && (t===String(cents/100) || t==='r'+(cents/100)))return true;
  if(cents<100 && (t===String(cents) || t===cents+'c'))return true;
  if(fmtMoney(cents).toLowerCase().replace(/\s/g,'')===t)return true;
  // allow 1.60 / 1,60 for R1,60
  if(cents>=100){
    const dec=(cents/100).toFixed(2);
    if(t===dec || t===dec.replace('.',','))return true;
  }
  return false;
}

function moneyPic(item, big){
  if(item.kind==='note'){
    return `<div class="m-note${big?' big':''}" style="background:${item.color}"><span>${esc(item.label)}</span></div>`;
  }
  return `<div class="m-coin${big?' big':''}" style="background:${item.color}"><span>${esc(item.label)}</span></div>`;
}

function countersHtml(n, cls){
  n=Math.min(n,40);
  return `<div class="m-counters ${cls||''}">${Array.from({length:n},()=>'<span class="dot"></span>').join('')}</div>`;
}

function wedgePath(cx,cy,r,a0,a1){
  const to=(a)=>({x:cx+r*Math.cos(a*Math.PI/180),y:cy+r*Math.sin(a*Math.PI/180)});
  const p0=to(a0), p1=to(a1), large=a1-a0>180?1:0;
  return `M ${cx} ${cy} L ${p0.x} ${p0.y} A ${r} ${r} 0 ${large} 1 ${p1.x} ${p1.y} Z`;
}
function fracShapeHtml(parts, shaded, shape){
  shape=shape||(parts>=5?pick(['bar','circle']):pick(['circle','rect','bar']));
  if(shape==='circle'){
    const slices=Array.from({length:parts},(_,i)=>{
      const a0=-90+(i/parts)*360, a1=-90+((i+1)/parts)*360;
      return `<path d="${wedgePath(100,100,96,a0,a1)}" class="${i<shaded?'on':''}"/>`;
    }).join('');
    return `<svg class="m-frac-svg" viewBox="0 0 200 200" aria-hidden="true">${slices}
      <circle cx="100" cy="100" r="96" fill="none" stroke="#333" stroke-width="4"/></svg>`;
  }
  const cells=Array.from({length:parts},(_,i)=>`<div class="cell${i<shaded?' on':''}"></div>`).join('');
  if(shape==='bar')return `<div class="m-frac bar parts-${parts}">${cells}</div>`;
  return `<div class="m-frac rect parts-${parts}">${cells}</div>`;
}

function fracWord(n,d){
  const words={1:'one',2:'two',3:'three',4:'four',5:'five'};
  const dens={2:'half',3:'third',4:'quarter',5:'fifth'};
  if(n===1)return dens[d]==='half'?'one half':('one '+dens[d]);
  return words[n]+' '+dens[d]+(dens[d]==='half'?'':'s');
}

function mcOpts(correct, distractors){
  const set=new Set([String(correct),...distractors.map(String)]);
  const opts=shuffle([...set]).slice(0,4);
  if(!opts.includes(String(correct)))opts[0]=String(correct);
  return shuffle(opts);
}

// --- question generators (each returns {prompt, html, answer, check?, input, choices?}) ---
function qTables(tables){
  const t=pick(tables), a=ri(1,12), ans=t*a;
  const wrong=shuffle([ans+t, Math.max(0,ans-t), a*pick(tables.filter(x=>x!==t)), ans+1, ans-1].filter(x=>x!==ans&&x>=0));
  return {prompt:`${t} × ${a} = ?`, answer:String(ans), input:'pad', choices:mcOpts(ans, wrong)};
}

function qSequence(steps, min, max){
  const step=pick(steps);
  const forward=Math.random()<0.55;
  const len=ri(5,7);
  let start;
  if(forward){
    const maxStart=max-(len-1)*step;
    if(maxStart<min){start=min} else start=min+Math.floor(ri(0, Math.floor((maxStart-min)/step)))*step;
  } else {
    const minStart=min+(len-1)*step;
    if(minStart>max){start=max} else start=minStart+Math.floor(ri(0, Math.floor((max-minStart)/step)))*step;
  }
  const seq=[];
  for(let i=0;i<len;i++)seq.push(forward? start+i*step : start-i*step);
  const blank=ri(1,len-2);
  const ans=seq[blank];
  const show=seq.map((n,i)=>i===blank?'<span class="m-blank">?</span>':`<span class="m-num">${n}</span>`).join('<span class="m-arrow">→</span>');
  const dir=forward?'forwards':'backwards';
  let visual='';
  if(ans<=30 && step<=5)visual=countersHtml(Math.min(ans,24));
  const wrong=shuffle([ans+step, Math.max(min,ans-step), ans+1, ans-1, ans+step*2].filter(x=>x!==ans&&x>=min&&x<=max));
  return {
    prompt:`Count ${dir} in ${step}s. What number is missing?`,
    html:`<div class="m-seq">${show}</div>${visual}`,
    answer:String(ans), input:'pad', choices:mcOpts(ans, wrong)
  };
}

function qNames(examples){
  const pool=[...(examples||[]), ...Array.from({length:12},()=>ri(100,200))];
  const n=pick(pool);
  const ans=numberName(n);
  const hintPool=[113,125,134,148,156,167,179,182,191].filter(x=>x!==n);
  const hintN=pick(hintPool.length?hintPool:[n===113?125:113]);
  return {
    prompt:`Write the number name for <b>${n}</b>.`,
    html:`<p class="m-hint">e.g. ${numberName(hintN)}</p>`,
    answer:ans, input:'text',
    check:(typed)=>namesMatch(typed, ans),
    reveal:ans
  };
}

function qBreakup(examples){
  const pool=[...(examples||[]), ri(100,299), ri(110,280), ri(120,250)];
  const n=pick(pool);
  const h=Math.floor(n/100)*100, t=Math.floor((n%100)/10)*10, o=n%10;
  const ans=`${h} + ${t} + ${o}`;
  // ask for the expanded form via multiple choice, or fill tens
  const mode=Math.random()<0.5?'expand':'part';
  if(mode==='expand'){
    const sumParts=s=>s.split('+').map(x=>parseInt(x.trim(),10)||0).reduce((a,b)=>a+b,0);
    const candidates=[
      `${h} + ${t+10} + ${o}`,
      `${h} + ${Math.max(0,t-10)} + ${o}`,
      `${h} + ${t} + ${(o+1)%10}`,
      `${Math.max(0,h-100)} + ${t} + ${o}`,
      `${h+100} + ${t} + ${o}`,
      `${h} + ${t+10} + ${Math.max(0,o-1)}`
    ];
    const wrong=candidates.filter(x=>x!==ans && sumParts(x)!==n);
    return {
      prompt:`Break up <b>${n}</b>.`,
      html:`<div class="m-place"><span class="h">${h}</span><span class="t">${t}</span><span class="o">${o}</span></div>
        <p class="m-hint">${n} = □ + □ + □</p>`,
      answer:ans, input:'mc', choices:mcOpts(ans, wrong)
    };
  }
  const which=pick(['hundreds','tens','ones']);
  const part=which==='hundreds'?h:which==='tens'?t:o;
  const wrong=shuffle([h,t,o, part+10, Math.max(0,part-10), n].filter(x=>x!==part));
  return {
    prompt:`In <b>${n}</b>, what is the ${which} value?`,
    html:`<p class="m-hint">${n} = ${h} + ${t} + ${o}</p>`,
    answer:String(part), input:'pad', choices:mcOpts(part, wrong)
  };
}

function qRound(){
  let n=ri(11,98);
  if(n%10===0)n+=ri(1,4);
  const ans=Math.round(n/10)*10;
  // tie at .5 goes up with Math.round for positive
  const wrong=shuffle([ans+10, Math.max(0,ans-10), n, Math.floor(n/10)*10].filter(x=>x!==ans));
  return {
    prompt:`Round <b>${n}</b> to the nearest 10.`,
    html:`<div class="m-numberline"><span>${Math.floor(n/10)*10}</span><span class="mark" style="left:${(n%10)*10}%"></span><span>${Math.floor(n/10)*10+10}</span></div>`,
    answer:String(ans), input:'pad', choices:mcOpts(ans, wrong)
  };
}

function qAddSteps(){
  const a=ri(21,68);
  const tens=ri(1,4)*10, ones=ri(1,9);
  const b=tens+ones;
  const mid=a+tens, ans=a+b;
  const stage=pick(['mid','final']);
  if(stage==='mid'){
    return {
      prompt:`Add in steps: <b>${a} + ${b}</b>`,
      html:`<div class="m-steps"><div>${a} + ${b} = ${a} + <b>${tens}</b> + ${ones}</div>
        <div>First: ${a} + ${tens} = ?</div></div>`,
      answer:String(mid), input:'pad', choices:mcOpts(mid, [mid+ones, a+ones, ans, mid-10])
    };
  }
  return {
    prompt:`Add in steps: <b>${a} + ${b}</b>`,
    html:`<div class="m-steps"><div>${a} + ${b} = ${a} + ${tens} + ${ones}</div>
      <div>${a} + ${tens} = ${mid}</div>
      <div>${mid} + ${ones} = ?</div></div>`,
    answer:String(ans), input:'pad', choices:mcOpts(ans, [mid, a+ones, ans+10, ans-1])
  };
}

function qSubSteps(){
  const pairs=[[87,56],[65,37],[74,48],[93,65],[82,47],[76,39],[58,29],[91,54]];
  let [a,b]=pick(pairs);
  // sometimes generate
  if(Math.random()<0.5){a=ri(50,99); b=ri(21,a-10); if(b%10===0)b-=3}
  const tens=Math.floor(b/10)*10, ones=b%10;
  const mid=a-tens, ans=a-b;
  const stage=pick(['mid','final']);
  if(stage==='mid'){
    return {
      prompt:`Subtract in steps: <b>${a} − ${b}</b>`,
      html:`<div class="m-steps"><div>${a} − ${b} = ${a} − <b>${tens}</b> − ${ones}</div>
        <div>First: ${a} − ${tens} = ?</div></div>`,
      answer:String(mid), input:'pad', choices:mcOpts(mid, [ans, a-ones, mid+10, mid-ones])
    };
  }
  return {
    prompt:`Subtract in steps: <b>${a} − ${b}</b>`,
    html:`<div class="m-steps"><div>${a} − ${b} = ${a} − ${tens} − ${ones}</div>
      <div>${a} − ${tens} = ${mid}</div>
      <div>${mid} − ${ones} = ?</div></div>`,
    answer:String(ans), input:'pad', choices:mcOpts(ans, [mid, a-ones, ans+10, Math.abs(ans-2)])
  };
}

function allMoney(){return [...M.money.notes, ...M.money.coins]}

function qMoneyId(){
  const item=pick(allMoney());
  const others=shuffle(allMoney().filter(x=>x.id!==item.id)).slice(0,3).map(x=>x.label);
  return {
    prompt:`What is this worth?`,
    html:`<div class="m-money-wrap">${moneyPic(item,true)}</div>`,
    answer:item.label, input:'mc', choices:mcOpts(item.label, others)
  };
}

function qMoneyAdd(){
  const coins=M.money.coins;
  const mode=pick(['coins','mixed']);
  if(mode==='coins'){
    const n=ri(2,3);
    const picks=Array.from({length:n},()=>pick(coins.filter(c=>c.cents<=50)));
    const total=picks.reduce((s,c)=>s+c.cents,0);
    const pics=picks.map(c=>moneyPic(c)).join('');
    const expr=picks.map(c=>c.label).join(' + ');
    return {
      prompt:`Add the money.`,
      html:`<div class="m-money-wrap">${pics}</div><p class="m-hint">${esc(expr)}</p>`,
      answer:fmtMoney(total), input:'pad',
      check:(typed)=>moneyEqual(typed, total),
      reveal:fmtMoney(total),
      choices:mcOpts(fmtMoney(total), [fmtMoney(total+10), fmtMoney(Math.max(10,total-10)), fmtMoney(total+20)])
    };
  }
  // note + coins or two amounts
  const note=pick(M.money.notes.filter(n=>n.cents<=5000));
  const coin=pick(coins);
  const total=note.cents+coin.cents;
  return {
    prompt:`Add the money.`,
    html:`<div class="m-money-wrap">${moneyPic(note)}${moneyPic(coin)}</div>
      <p class="m-hint">${esc(note.label)} + ${esc(coin.label)}</p>`,
    answer:fmtMoney(total), input:'pad',
    check:(typed)=>moneyEqual(typed, total),
    reveal:fmtMoney(total),
    choices:mcOpts(fmtMoney(total), [fmtMoney(total+100), fmtMoney(total-coin.cents), fmtMoney(note.cents+100)])
  };
}

function qChange(){
  const samples=[
    {have:200, cost:40},
    {have:200, cost:75},
    {have:500, cost:150},
    {have:1000, cost:350},
    {have:3000, cost:950},
    {have:2000, cost:1250},
    {have:5000, cost:2750},
    {have:100, cost:30},
    {have:200, cost:100}
  ];
  const s=pick(samples);
  const ans=s.have-s.cost;
  return {
    prompt:`You pay with <b>${fmtMoney(s.have)}</b>. The item costs <b>${fmtMoney(s.cost)}</b>. How much change?`,
    html:`<div class="m-steps"><div>${fmtMoney(s.have)} − ${fmtMoney(s.cost)} = ?</div></div>`,
    answer:fmtMoney(ans), input:'pad',
    check:(typed)=>moneyEqual(typed, ans),
    reveal:fmtMoney(ans),
    choices:mcOpts(fmtMoney(ans), [fmtMoney(ans+50), fmtMoney(Math.max(0,ans-50)), fmtMoney(s.cost)])
  };
}

function qFracShade(){
  const d=pick([2,3,4,5]);
  const n=ri(1,d-1);
  const label=`${n}/${d}`;
  const wrong=shuffle([
    `${d-n}/${d}`, `${n}/${d+1||5}`, `1/${d}`, `${Math.min(d,n+1)}/${d}`, `${n}/2`
  ].filter(x=>x!==label));
  return {
    prompt:`What fraction is shaded?`,
    html:fracShapeHtml(d,n),
    answer:label, input:'mc', choices:mcOpts(label, wrong)
  };
}

function qFracSet(){
  const d=pick([2,3,4,5]);
  const sets={2:[8,10,12,14,16],3:[9,12,15,18],4:[8,12,16,20],5:[10,15,20]};
  const total=pick(sets[d]);
  const ans=total/d;
  const emoji=pick(['🍊','🍎','⭐','🔵','🍪']);
  return {
    prompt:`What is <b>${fracWord(1,d)}</b> of <b>${total}</b>?`,
    html:`${countersHtml(total,'set')}<p class="m-hint">${emoji.repeat(Math.min(total,12))}${total>12?' …':''}</p>`,
    answer:String(ans), input:'pad', choices:mcOpts(ans, [ans+1, Math.max(1,ans-1), total-ans, d])
  };
}

function qSharing(){
  const baskets=pick([3,4,5]);
  const each=ri(3,8);
  const rem=ri(1,baskets-1);
  const total=each*baskets+rem;
  const item=pick(['apples','oranges','sweets','stickers','marbles']);
  return {
    prompt:`<b>${total}</b> ${item} shared into <b>${baskets}</b> baskets. How many are left over?`,
    html:`<div class="m-steps"><div>${total} ÷ ${baskets} = ${each} each, with ? left</div></div>
      ${countersHtml(Math.min(total,30),'set')}`,
    answer:String(rem), input:'pad',
    choices:mcOpts(rem, [0, each, baskets-rem, rem===1?2:1].filter(x=>x!==rem))
  };
}

function makeOne(type, act){
  switch(type){
    case 'tables': return qTables(act.tables||[2,3,4,5]);
    case 'sequence': return qSequence(act.steps||[1,2,5,10], act.min??0, act.max??200);
    case 'names': return qNames(act.examples);
    case 'breakup': return qBreakup(act.examples);
    case 'round': return qRound();
    case 'addsteps': return qAddSteps();
    case 'substeps': return qSubSteps();
    case 'moneyid': return qMoneyId();
    case 'moneyadd': return qMoneyAdd();
    case 'change': return qChange();
    case 'fracshade': return qFracShade();
    case 'fracset': return qFracSet();
    case 'sharing': return qSharing();
    default: return qTables([2,3,4,5]);
  }
}

function buildQuestions(act){
  const n=act.n||8;
  const qs=[];
  if(act.type==='quiz'){
    const mix=act.mix||['tables'];
    for(let i=0;i<n;i++){
      const t=mix[i%mix.length];
      qs.push(makeOne(t, act));
    }
    return shuffle(qs);
  }
  for(let i=0;i<n;i++)qs.push(makeOne(act.type, act));
  return qs;
}

window.MathsHW={
  weekData(w){return (M.weeks||{})[w]||null},
  buildQuestions,
  numberName,
  fmtMoney
};
})();
