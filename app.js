(function(){
const H=window.HW, $=s=>document.querySelector(s), app=$('#app');
const LS={get:(k,d)=>{try{return JSON.parse(localStorage.getItem('kh_'+k))??d}catch(e){return d}},set:(k,v)=>localStorage.setItem('kh_'+k,JSON.stringify(v))};
const MAXW=10, esc=s=>String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
function weekOf(d){const s=new Date(H.week1Start+'T00:00:00');return Math.floor((d-s)/(7*864e5))+1}
function weekDates(w){const s=new Date(H.week1Start+'T00:00:00');s.setDate(s.getDate()+(w-1)*7+(w==1?1:0));const e=new Date(H.week1Start+'T00:00:00');e.setDate(e.getDate()+(w-1)*7+4);const sm=s.toLocaleString('en-GB',{month:'short'}),em=e.toLocaleString('en-GB',{month:'short'});return sm===em?s.getDate()+'–'+e.getDate()+' '+em:s.getDate()+' '+sm+'–'+e.getDate()+' '+em}
const todayStr=()=>{const d=new Date();return d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0')};
const currentWeek=Math.min(MAXW,Math.max(1,weekOf(new Date())));
let week=currentWeek;
const savedWeek=LS.get('selected_week',null), savedWeekDay=LS.get('selected_week_day',null);
if(savedWeek!=null && savedWeekDay===todayStr() && +savedWeek>=currentWeek && +savedWeek<=MAXW)week=+savedWeek;
const sel=$('#weekSel');
for(let w=1;w<=MAXW;w++){const o=document.createElement('option');o.value=w;o.textContent='Week '+w+' · '+weekDates(w);sel.appendChild(o)}
sel.value=week; sel.onchange=()=>{week=+sel.value;LS.set('selected_week',week);LS.set('selected_week_day',todayStr());route()};
$('#homeBtn').onclick=()=>go('home');
let lang='en';
function setAppLang(l){lang=l==='af'?'af':'en';if(window.TTS)TTS.setLang(lang)}
function say(t,opts){if(window.TTS)TTS.speak(t,opts)}
function stopSpeech(){if(window.TTS)TTS.stop()}
const L={
  en:{
    praise:['Super!','Well done!','Fantastic!','You got it!','Brilliant!'],
    sentence:w=>'Can you spell '+w+'?',
    spellTitle:w=>'🔤 Spelling – Week '+w,
    lastTest:(s,t)=>'Last test: ⭐ '+s+'/'+t,
    spellTest:'🎧 Spelling test',
    lcwc:'👀 Look, cover, write, check',
    none:t=>'No '+t+' for Week '+week+' yet. Pick another week at the top.',
    wordOf:(i,n)=>'🎧 Word '+i+' of '+n,
    hearWord:'🔊 Hear word',
    sentenceBtn:'💬 Sentence',
    check:'✔️ Check',
    nearly:'Nearly! Listen again and have another go 💪',
    spelled:'It is spelled',
    goodTry:'Good try!',
    practise:'Let\'s practise:',
    allCorrect:'All correct first time! 🎉',
    back:'Back',
    lcwcTitle:(i,n)=>'👀 Look, cover, write, check ('+i+'/'+n+')',
    look:'1. <b>Look</b> at the word and say it.',
    hearIt:'🔊 Hear it',
    cover:'🙈 Cover',
    write:'2. <b>Write</b> it:',
    checkStep:'3. ✔️ Check',
    tryAgain:'Check the letters and try again! 💪',
    dictTitle:w=>'✏️ Dictation – Week '+w,
    dictHint:'Listen, then type the sentence.',
    play:'🔊 Play',
    slower:'🐢 Slower',
    typeHere:'Type here...',
    perfect:'🌟 Perfect!',
    goodTryLook:'Good try! Look at the coloured bits.',
    correct:'Correct:',
    yours:'Yours:',
    legend:'<span class="ok">green = right</span> <span class="bad">red = check this</span> <span class="miss">yellow = missing</span>',
    nothing:'(nothing typed)'
  },
  af:{
    praise:['Mooi so!','Baie goed!','Fantasties!','Jy het dit!','Bravo!'],
    sentence:w=>'Kan jy '+w+' spel?',
    spellTitle:w=>'🔤 Spelwoorde – Week '+w,
    lastTest:(s,t)=>'Laaste toets: ⭐ '+s+'/'+t,
    spellTest:'🎧 Spellingtoets',
    lcwc:'👀 Kyk, bedek, skryf, kontroleer',
    none:t=>'Nog geen '+t+' vir Week '+week+' nie. Kies ’n ander week bo.',
    wordOf:(i,n)=>'🎧 Woord '+i+' van '+n,
    hearWord:'🔊 Luister',
    sentenceBtn:'💬 Sin',
    check:'✔️ Kontroleer',
    nearly:'Amper! Luister weer en probeer weer 💪',
    spelled:'Dit word so gespel',
    goodTry:'Goed probeer!',
    practise:'Kom ons oefen:',
    allCorrect:'Alles reg die eerste keer! 🎉',
    back:'Terug',
    lcwcTitle:(i,n)=>'👀 Kyk, bedek, skryf, kontroleer ('+i+'/'+n+')',
    look:'1. <b>Kyk</b> na die woord en sê dit.',
    hearIt:'🔊 Luister',
    cover:'🙈 Bedek',
    write:'2. <b>Skryf</b> dit:',
    checkStep:'3. ✔️ Kontroleer',
    tryAgain:'Kyk na die letters en probeer weer! 💪',
    dictTitle:w=>'✏️ Diktee – Week '+w,
    dictHint:'Luister, dan tik die sin.',
    play:'🔊 Speel',
    slower:'🐢 Stadiger',
    typeHere:'Tik hier...',
    perfect:'🌟 Mooi so!',
    goodTryLook:'Goed probeer! Kyk na die gekleurde stukke.',
    correct:'Reg:',
    yours:'Joune:',
    legend:'<span class="ok">groen = reg</span> <span class="bad">rooi = kyk hier</span> <span class="miss">geel = ontbreek</span>',
    nothing:'(niks getik nie)'
  }
};
const T=()=>L[lang]||L.en;
const rnd=a=>a[Math.floor(Math.random()*a.length)];
const apostrophe=s=>String(s).replace(/[\u2018\u2019\u02BC]/g,"'");
const wordsFrom=(map,w)=>(map[w]||'').split(' ').filter(Boolean);
const enWords=w=>wordsFrom(H.spelling,w);
const afWords=w=>wordsFrom(H.afrikaans.spelling,w);
const sentence=w=>(H.sentences[w]||T().sentence(w));
function go(v){location.hash=v} window.addEventListener('hashchange',route);
let timerId=null, navGen=0, pendingTimeouts=[], leaveHook=null;
function cancelDeferred(){
  navGen++;
  pendingTimeouts.forEach(clearTimeout);
  pendingTimeouts=[];
}
function later(fn,ms){
  const gen=navGen;
  const id=setTimeout(()=>{
    pendingTimeouts=pendingTimeouts.filter(x=>x!==id);
    if(gen!==navGen)return;
    fn();
  },ms);
  pendingTimeouts.push(id);
  return id;
}
function onLeave(fn){leaveHook=fn}
let recog=null, listenAlive=false, micStream=null, micCtx=null, micNode=null;
function stopListen(){
  listenAlive=false;
  const r=recog; recog=null;
  if(r){r.onend=r.onresult=r.onerror=r.onstart=null; try{r.stop()}catch(e){}}
  if(micNode){try{micNode.disconnect()}catch(e){} micNode=null}
  if(micCtx){try{micCtx.close()}catch(e){} micCtx=null}
  if(micStream){micStream.getTracks().forEach(t=>{try{t.stop()}catch(e){}}); micStream=null}
}
function downsample(input, inRate, outRate){
  if(inRate===outRate)return input;
  const ratio=inRate/outRate, len=Math.floor(input.length/ratio), out=new Float32Array(len);
  for(let i=0;i<len;i++){
    const a=Math.floor(i*ratio), b=Math.min(input.length, Math.floor((i+1)*ratio));
    let s=0; for(let j=a;j<b;j++)s+=input[j];
    out[i]=s/Math.max(1,b-a);
  }
  return out;
}
function startAzureListen(getWord, onHit, onDenied, onStatus){
  stopListen();
  const AC=window.AudioContext||window.webkitAudioContext;
  if(!AC||!navigator.mediaDevices||!navigator.mediaDevices.getUserMedia||!window.TTS||!TTS.recognize)return Promise.resolve(false);
  const ctx=new AC();
  micCtx=ctx;
  const resumed=ctx.resume();
  listenAlive=true;
  return navigator.mediaDevices.getUserMedia({audio:{channelCount:1,echoCancellation:true,noiseSuppression:true}}).then(async stream=>{
    await resumed;
    if(!listenAlive){stream.getTracks().forEach(t=>t.stop()); return false}
    micStream=stream;
    const source=ctx.createMediaStreamSource(stream);
    const proc=ctx.createScriptProcessor(2048,1,1);
    micNode=proc;
    const mute=ctx.createGain(); mute.gain.value=0;
    const inRate=ctx.sampleRate, outRate=16000;
    const minSamples=Math.floor(outRate*0.18), maxSamples=Math.floor(outRate*2.2), silenceNeed=Math.floor(outRate*0.4);
    let chunks=[], voiced=false, silence=0, busy=false;
    async function flush(){
      if(busy||!chunks.length)return;
      const total=chunks.reduce((n,c)=>n+c.length,0);
      if(total<minSamples){chunks=[]; voiced=false; silence=0; return}
      const pcm=new Float32Array(total);
      let o=0; chunks.forEach(c=>{pcm.set(c,o); o+=c.length});
      chunks=[]; voiced=false; silence=0;
      const heardFor=getWord();
      busy=true;
      let failed=false;
      if(onStatus)onStatus('checking');
      try{
        const text=await TTS.recognize(pcm, outRate, 'af-ZA');
        if(listenAlive&&getWord()===heardFor&&sameWord(heardFor, text))onHit();
      }catch(e){
        failed=true;
        if(onStatus)onStatus('error');
      }
      busy=false;
      if(listenAlive&&onStatus&&!failed)onStatus('listening');
    }
    proc.onaudioprocess=ev=>{
      if(!listenAlive||busy)return;
      const down=downsample(ev.inputBuffer.getChannelData(0), inRate, outRate);
      let sum=0; for(let i=0;i<down.length;i++)sum+=down[i]*down[i];
      const rms=Math.sqrt(sum/Math.max(1,down.length));
      if(rms>0.015){voiced=true; silence=0; chunks.push(down)}
      else if(voiced){
        silence+=down.length; chunks.push(down);
        const spoken=chunks.reduce((n,c)=>n+c.length,0);
        if(silence>=silenceNeed||spoken>=maxSamples)flush();
      }
    };
    source.connect(proc); proc.connect(mute); mute.connect(ctx.destination);
    if(onStatus)onStatus('listening');
    return true;
  }).catch(()=>{listenAlive=false; if(onDenied)onDenied(); return false});
}
const HOMOPHONES=[
  ['to','two','too','2'],['for','four','fore'],['right','write'],['where','wear'],
  ['their','there','theyre'],['one','won'],['eight','ate'],['by','bye','buy'],
  ['which','witch'],['would','wood'],['no','know'],['here','hear'],['our','hour'],
  ['son','sun'],['aunt','ant'],['be','bee'],['so','sew']
];
const DIGIT_WORD={'0':'zero','1':'one','2':'two','4':'four','8':'eight','11':'eleven','12':'twelve','13':'thirteen','17':'seventeen','20':'twenty','40':'forty','70':'seventy','80':'eighty','100':'hundred','1000':'thousand','1000000':'million'};
function spokenTokens(s){
  return String(s).toLowerCase().split(/[^a-z0-9]+/).filter(Boolean).map(w=>DIGIT_WORD[w]||w);
}
function sameWord(target, heard){
  const a=spokenTokens(target)[0];
  if(!a)return false;
  const group=HOMOPHONES.find(g=>g.includes(a))||[a];
  return spokenTokens(heard).some(w=>group.includes(w));
}
function startListen(getWord, onHit, onDenied){
  stopListen();
  const Ctor=window.SpeechRecognition||window.webkitSpeechRecognition;
  if(!Ctor)return false;
  const r=new Ctor();
  recog=r; listenAlive=true;
  r.lang=lang==='af'?'af-ZA':'en-ZA';
  r.continuous=true; r.interimResults=true; r.maxAlternatives=3;
  let arm=false;
  r.onstart=()=>{arm=true};
  r.onresult=ev=>{
    if(!arm||!listenAlive)return;
    const word=getWord();
    for(let k=ev.resultIndex;k<ev.results.length;k++){
      const alts=ev.results[k];
      for(let j=0;j<alts.length;j++){
        if(!sameWord(word, alts[j].transcript))continue;
        arm=false;
        try{r.stop()}catch(e){}
        onHit();
        return;
      }
    }
  };
  r.onerror=ev=>{
    if(ev.error==='not-allowed'||ev.error==='service-not-allowed'||ev.error==='language-not-supported'){
      listenAlive=false; onDenied();
    }
  };
  r.onend=()=>{if(listenAlive&&recog===r){try{r.start()}catch(e){}}};
  try{r.start();return true}catch(e){listenAlive=false;recog=null;return false}
}
function speedRound(cfg){
  const words=cfg.words;
  let i=0, got=0, t=60, alive=true, lock=false;
  const useAzure=lang==='af';
  const canHear=useAzure?!!(navigator.mediaDevices&&navigator.mediaDevices.getUserMedia):!!(window.SpeechRecognition||window.webkitSpeechRecognition);
  const word=()=>words[i%words.length];
  function setMic(state){
    const el=$('#mic'); if(!el)return;
    el.textContent=state==='checking'?(cfg.checking||cfg.listening):state==='error'?(cfg.error||cfg.blocked):state==='blocked'?cfg.blocked:cfg.listening;
  }
  function draw(){
    app.innerHTML=`<div class="timer" id="tm">⏱ ${t}</div><div class="card"><div class="big">${esc(word())}</div></div>
      <p class="center mic" id="mic">${canHear?cfg.listening:cfg.unavailable}</p>
      <div class="center"><button class="btn g" id="y" style="width:45%">${cfg.yes}</button><button class="btn grey" id="n" style="width:45%">${cfg.no}</button></div>
      <p class="center">${cfg.count} ${got}</p>`;
    $('#y').onclick=()=>advance(true);
    $('#n').onclick=()=>advance(false);
  }
  function advance(correct){
    if(!alive||lock)return;
    lock=true;
    if(correct)got++;
    i++;
    draw();
    lock=false;
  }
  function finish(){
    if(!alive)return;
    alive=false;
    clearInterval(timerId);
    stopListen();
    cfg.finish(got);
  }
  draw();
  if(useAzure){
    startAzureListen(word,()=>advance(true),()=>setMic('blocked'),setMic);
  }else if(canHear){
    const ok=startListen(word,()=>advance(true),()=>setMic('blocked'));
    if(!ok)setMic('blocked');
  }
  timerId=setInterval(()=>{t--;const e=$('#tm');if(e)e.textContent='⏱ '+t;if(t<=0)finish()},1000);
}
function route(){
  cancelDeferred();
  clearInterval(timerId); timerId=null;
  if(leaveHook){const h=leaveHook; leaveHook=null; try{h()}catch(e){}}
  stopSpeech(); stopListen();
  const v=(location.hash||'#home').slice(1);(views[v]||views.home)();window.scrollTo(0,0);
}
const none=t=>`<div class="card center"><p>${T().none(t)}</p></div>`;
const backEnglish=()=>`<p><button class="btn grey" id="bk">${T().back}</button></p>`;
const views={
home(){
  setAppLang('en');
  const plan=H.plan[week]||[], cols={};H.subjects.forEach(s=>cols[s.name]=s.color);cols.English='#ff6b9d';
  const ticks=LS.get('plan_w'+week,{});
  app.innerHTML=`<h2>Hi Keeva! 🌈</h2><p>Week ${week} · ${weekDates(week)}</p>
  <div class="tiles">${H.subjects.map(s=>`<button class="tile${s.soon?' soon':''}" style="background:${s.color}" data-id="${s.id}" ${s.soon?'disabled':''}><span class="e">${s.emoji}</span>${s.name}${s.soon?'<small>coming soon</small>':''}</button>`).join('')}</div>
  <div class="card"><h3>📋 This week</h3>${plan.length?plan.map((t,i)=>`<label class="task${ticks[i]?' done':''}"><input type="checkbox" data-i="${i}" ${ticks[i]?'checked':''}><span><b class="tag" style="background:${cols[t.subj]||'#888'}">${t.subj}</b>${esc(t.text)}</span></label>`).join(''):'<p>No plan added for this week yet.</p>'}</div>`;
  app.querySelectorAll('.tile:not([disabled])').forEach(b=>b.onclick=()=>go(b.dataset.id));
  app.querySelectorAll('.task input').forEach(c=>c.onchange=()=>{
    ticks[c.dataset.i]=c.checked; LS.set('plan_w'+week,ticks);
    c.parentNode.classList.toggle('done',c.checked);
  });
},
english(){
  setAppLang('en');
  app.innerHTML=`<h2>📖 English – Week ${week}</h2>
  <div class="tiles">
    <button class="tile" style="background:#ff6b9d" id="sp"><span class="e">🔤</span>Spelling</button>
    <button class="tile" style="background:#ffb300" id="sr"><span class="e">⚡</span>Speed Read</button>
    <button class="tile" style="background:#4caf50" id="di"><span class="e">✏️</span>Dictation</button>
  </div>`;
  $('#sp').onclick=()=>go('spelling');
  $('#sr').onclick=()=>go('tricky');
  $('#di').onclick=()=>go('dictation');
},
spelling(){
  setAppLang('en');
  const ws=enWords(week);
  if(!ws.length){app.innerHTML=none('spelling words')+backEnglish(); $('#bk').onclick=()=>go('english'); return}
  const best=LS.get('spell_w'+week,null);
  app.innerHTML=`<h2>${T().spellTitle(week)}</h2><div class="card center"><p>${ws.join(' · ')}</p>${best?`<p>${T().lastTest(best.score,best.total)}</p>`:''}
  <button class="btn p" id="t">${T().spellTest}</button><button class="btn o" id="l">${T().lcwc}</button>
  ${backEnglish()}</div>`;
  $('#t').onclick=()=>spellTest(ws,'spell_w'+week,()=>views.spelling());
  $('#l').onclick=()=>lcwc(ws,0,()=>views.spelling());
  $('#bk').onclick=()=>go('english');
},
tricky(){
  setAppLang('en');
  const all=H.tricky.split(' '), log=LS.get('tricky',{}), days=['Mon','Tue','Wed','Thu'];
  const today=['Sun','Mon','Tue','Wed','Thu','Fri','Sat'][new Date().getDay()];
  app.innerHTML=`<h2>⚡ Tricky words speed read</h2><div class="card center"><p>Read each word out loud. The app scores it when it hears the word. A grown-up can still tap <b>Got it</b> or <b>Skip</b>.</p>
  <p>Save for day: <select id="day">${days.map(d=>`<option ${d==today?'selected':''}>${d}</option>`).join('')}</select></p>
  <button class="btn p" id="go">▶️ Start</button>
  ${backEnglish()}</div>
  <div class="card"><h3>My scores</h3><table><tr><th>Week</th>${days.map(d=>`<th>${d}</th>`).join('')}</tr>
  ${Array.from({length:MAXW},(_,i)=>i+1).map(w=>`<tr${w==week?' style="background:#fff3c4"':''}><td>${w}</td>${days.map(d=>`<td>${(log[w]||{})[d]??''}</td>`).join('')}</tr>`).join('')}</table></div>`;
  $('#bk').onclick=()=>go('english');
  $('#go').onclick=()=>{
    const day=$('#day').value;
    speedRound({
      words:all, yes:'✅ Got it', no:'⏭ Skip', count:'Read:',
      listening:'🎤 Listening…',
      blocked:'🎤 Microphone is blocked. Use the buttons.',
      unavailable:'🎤 Voice listening is not available in this browser. Use the buttons.',
      finish(got){
        log[week]=log[week]||{};log[week][day]=got;LS.set('tricky',log);
        app.innerHTML=`<div class="card center"><div class="big">🎉 ${got}</div><p>words read in one minute!<br>Saved for Week ${week}, ${day}.</p><button class="btn p" id="b">OK</button></div>`;
        $('#b').onclick=()=>views.tricky();
      }
    });
  };
},
dictation(){
  setAppLang('en');
  showDictation(H.dictation[week],'dictation','dict_w'+week,()=>go('english'));
},
afrikaans(){
  setAppLang('af');
  app.innerHTML=`<h2>🇿🇦 Afrikaans – Week ${week}</h2>
  <div class="tiles">
    <button class="tile" style="background:#9c27b0" id="sp"><span class="e">🔤</span>Spelwoorde</button>
    <button class="tile" style="background:#7e57c2" id="si"><span class="e">⚡</span>Een minuut uitdaging!</button>
    <button class="tile" style="background:#ab47bc" id="di"><span class="e">✏️</span>Diktee</button>
  </div>`;
  $('#sp').onclick=()=>go('afSpelling');
  $('#si').onclick=()=>go('afSigwoorde');
  $('#di').onclick=()=>go('afDictation');
},
afSigwoorde(){
  setAppLang('af');
  const all=H.afrikaans.sigwoorde.split(' '), log=LS.get('af_tricky',{}), days=['Maandag','Dinsdag','Woensdag','Donderdag'];
  const today=['Sondag','Maandag','Dinsdag','Woensdag','Donderdag','Vrydag','Saterdag'][new Date().getDay()];
  const weeks=[2,3,4,5,6,7,8];
  app.innerHTML=`<h2>⚡ Een minuut uitdaging!</h2><div class="card center"><p>Lees elke woord hardop. Die app tel dit as hy die woord hoor. ’n Grootmens kan steeds <b>Reg</b> of <b>Oorslaan</b> druk.</p>
  <p>Stoor vir dag: <select id="day">${days.map(d=>`<option ${d==today?'selected':''}>${d}</option>`).join('')}</select></p>
  <button class="btn p" id="go">▶️ Begin</button>
  <p><button class="btn grey" id="bk">${T().back}</button></p></div>
  <div class="card"><h3>My tellings</h3><table><tr><th>Week</th>${days.map(d=>`<th>${d}</th>`).join('')}</tr>
  ${weeks.map(w=>`<tr${w==week?' style="background:#fff3c4"':''}><td>${w}</td>${days.map(d=>`<td>${(log[w]||{})[d]??''}</td>`).join('')}</tr>`).join('')}</table></div>`;
  $('#bk').onclick=()=>go('afrikaans');
  $('#go').onclick=()=>{
    const day=$('#day').value;
    speedRound({
      words:all, yes:'✅ Reg', no:'⏭ Oorslaan', count:'Gelees:',
      listening:'🎤 Luister…',
      checking:'🎤 Besig…',
      error:'🎤 Kon nie die woord hoor nie. Gebruik die knoppies.',
      blocked:'🎤 Mikrofoon is geblokkeer. Gebruik die knoppies.',
      unavailable:'🎤 Die mikrofoon is nie beskikbaar nie. Gebruik die knoppies.',
      finish(got){
        log[week]=log[week]||{};log[week][day]=got;LS.set('af_tricky',log);
        app.innerHTML=`<div class="card center"><div class="big">🎉 ${got}</div><p>woorde in een minuut gelees!<br>Gestoor vir Week ${week}, ${day}.</p><button class="btn p" id="b">OK</button></div>`;
        $('#b').onclick=()=>views.afSigwoorde();
      }
    });
  };
},
afSpelling(){
  setAppLang('af');
  const ws=afWords(week);if(!ws.length){app.innerHTML=none('spelwoorde');return}
  const best=LS.get('af_spell_w'+week,null);
  app.innerHTML=`<h2>${T().spellTitle(week)}</h2><div class="card center"><p>${ws.join(' · ')}</p>${best?`<p>${T().lastTest(best.score,best.total)}</p>`:''}
  <button class="btn p" id="t">${T().spellTest}</button><button class="btn o" id="l">${T().lcwc}</button>
  <p><button class="btn grey" id="b">${T().back}</button></p></div>`;
  $('#t').onclick=()=>spellTest(ws,'af_spell_w'+week,()=>views.afSpelling());
  $('#l').onclick=()=>lcwc(ws,0,()=>views.afSpelling());
  $('#b').onclick=()=>go('afrikaans');
},
afDictation(){
  setAppLang('af');
  showDictation(H.afrikaans.dictation[week],'diktee','af_dict_w'+week,()=>go('afrikaans'));
},
maths(){
  setAppLang('en');
  const wd=window.MathsHW.weekData(week);
  if(!wd){app.innerHTML=`<h2>🔢 Maths – Week ${week}</h2><div class="card center"><p>No maths plan for this week yet. Pick Weeks 1–6.</p></div>`;return}
  const prog=LS.get('maths_w'+week,{});
  app.innerHTML=`<h2>🔢 Maths – Week ${week}</h2>
  <p class="center">${esc(wd.title)} · ${esc(wd.dates)}</p>
  <div class="m-acts">${wd.activities.map(a=>{
    const p=prog[a.id]; const star=p?` <small class="m-score">⭐ ${p.score}/${p.total}</small>`:'';
    return `<button class="m-act" data-id="${a.id}"><span class="m-act-t">${esc(a.title)}${star}</span><span class="m-act-b">${esc(a.blurb||'')}</span></button>`;
  }).join('')}</div>`;
  app.querySelectorAll('.m-act').forEach(b=>b.onclick=()=>{
    const act=wd.activities.find(x=>x.id===b.dataset.id);
    if(act)mathsPractice(act,()=>views.maths());
  });
}
};
window.LifeSkillsHW.install(views,{
  app,$,LS,say,stopSpeech,go,
  getWeek:()=>week,
  setLang:setAppLang,
  setTimer:id=>{clearInterval(timerId);timerId=id},
  onLeave
});
function mathsPractice(act, backFn){
  const praise=['Super!','Well done!','Fantastic!','You got it!','Brilliant!','Clever!'];
  const qs=window.MathsHW.buildQuestions(act);
  let i=0, score=0, tries=0;
  const storeKey='maths_w'+week;
  const leave=()=>{cancelDeferred(); backFn()};
  const draw=()=>{
    const q=qs[i];
    // text for number names; multiple choice only when the question requires it; otherwise the device keyboard
    const money=/^[Rr]\d|\d+c$/.test(String(q.answer).trim())||String(q.answer).indexOf(',')>=0;
    const mode=q.input==='text'?'text':q.input==='mc'?'mc':'num';
    app.innerHTML=`<h2>${esc(act.title)}</h2>
      <p class="center m-prog">Question ${i+1} of ${qs.length}</p>
      <div class="card center">
        <p class="m-q">${q.prompt}</p>
        ${q.html||''}
        ${mode==='mc'?`<div class="m-mc" id="mc">${(q.choices||[]).map(c=>`<button class="btn o m-choice" data-v="${esc(c)}">${esc(c)}</button>`).join('')}</div>`
          :`<input class="ans" id="a" inputmode="${mode==='text'||money?'text':'decimal'}" enterkeyhint="done" autocomplete="off" autocapitalize="off" autocorrect="off" spellcheck="false" placeholder="${mode==='text'?'Type the words…':money?'Type the amount…':'Type the number…'}">
            ${money?`<p class="m-hint">Use R and c, e.g. R2,50 or 40c</p>`:''}`}
        ${mode!=='mc'?`<button class="btn p" id="c">✔️ Check</button>`:''}
        <div class="fb" id="f"></div>
        <p><button class="btn grey" id="bk">Back</button></p>
      </div>`;
    $('#bk').onclick=leave;
    if(mode==='mc'){
      app.querySelectorAll('.m-choice').forEach(b=>b.onclick=()=>{
        app.querySelectorAll('.m-choice').forEach(x=>x.disabled=true);
        check(b.dataset.v, b);
      });
    } else {
      const a=$('#a'); a.focus();
      a.onkeydown=e=>{if(e.key==='Enter')check(a.value)};
      $('#c').onclick=()=>check(a.value);
    }
    function ok(v){
      if(q.check)return q.check(v);
      return String(v).trim().toLowerCase()===String(q.answer).trim().toLowerCase();
    }
    function check(v, btn){
      v=String(v||'').trim();
      if(!v){$('#f').textContent='Have a go!';return}
      if(ok(v)){
        if(!tries)score++;
        $('#f').textContent='🌟 '+rnd(praise);
        if(btn)btn.classList.add('m-ok');
        next();
      } else if(!tries){
        tries=1;
        $('#f').textContent='Nearly! Have another go 💪';
        if(mode!=='mc'){$('#a').value='';$('#a').focus()}
        if(mode==='mc'){app.querySelectorAll('.m-choice').forEach(x=>x.disabled=false); if(btn)btn.classList.add('m-bad')}
      } else {
        const show=q.reveal||q.answer;
        $('#f').innerHTML='Good try! The answer is <b>'+esc(show)+'</b>';
        if(btn)btn.classList.add('m-bad');
        next(2200);
      }
    }
    function next(ms){
      const c=$('#c'); if(c)c.disabled=true;
      app.querySelectorAll('.m-choice').forEach(x=>x.disabled=true);
      later(()=>{i++;tries=0;i<qs.length?draw():done()}, ms||1100);
    }
  };
  const done=()=>{
    const prog=LS.get(storeKey,{});
    prog[act.id]={score,total:qs.length,date:new Date().toISOString()};
    LS.set(storeKey,prog);
    app.innerHTML=`<div class="card center"><div class="big">${score>=qs.length-1?'🏆':'⭐'} ${score}/${qs.length}</div>
      <p>${score===qs.length?'All correct – amazing! 🎉':score>=qs.length-2?'Nearly full marks – super work!':'Good practice – try again for a higher score!'}</p>
      <button class="btn p" id="again">🔄 Try again</button>
      <button class="btn grey" id="b">Back</button></div>`;
    $('#again').onclick=()=>mathsPractice(act, backFn);
    $('#b').onclick=leave;
  };
  draw();
}
function showDictation(s,noneLabel,storeKey,backFn){
  if(!s){app.innerHTML=none(noneLabel)+(backFn?`<p class="center"><button class="btn grey" id="b">${T().back}</button></p>`:''); if(backFn)$('#b').onclick=backFn; return}
  const t=T();
  app.innerHTML=`<h2>${t.dictTitle(week)}</h2><div class="card center"><p>${t.dictHint}</p>
  <button class="btn g" id="p">${t.play}</button><button class="btn o" id="s">${t.slower}</button>
  <textarea class="ans" id="a" autocapitalize="off" autocorrect="off" spellcheck="false" placeholder="${t.typeHere}"></textarea>
  <button class="btn p" id="c">${t.check}</button><div id="r"></div>
  ${backFn?`<p><button class="btn grey" id="b">${t.back}</button></p>`:''}</div>`;
  $('#p').onclick=()=>say(s);$('#s').onclick=()=>say(s,{slower:true});
  if(backFn)$('#b').onclick=backFn;
  $('#c').onclick=()=>{const typed=$('#a').value.trim(),res=diff(s,typed);$('#r').innerHTML=`<p class="fb">${res.perfect?t.perfect+' '+rnd(t.praise):t.goodTryLook}</p>
   <p><b>${t.correct}</b></p><p style="font-size:24px">${esc(s)}</p><p><b>${t.yours}</b></p><div class="diff">${res.html}</div>
   <p style="font-size:14px">${t.legend}</p>`;
   LS.set(storeKey,{typed,perfect:res.perfect})};
}
function diff(target,typed){
  const Tgt=target.split(/\s+/),Y=typed.split(/\s+/).filter(Boolean),n=Tgt.length,m=Y.length;
  const norm=x=>apostrophe(x); const dp=Array.from({length:n+1},()=>Array(m+1).fill(0));
  for(let i=n-1;i>=0;i--)for(let j=m-1;j>=0;j--)dp[i][j]=Math.max(dp[i+1][j+1]+(sim(Tgt[i],Y[j])?1:0),dp[i+1][j],dp[i][j+1]);
  function sim(a,b){const s=x=>apostrophe(x).toLowerCase().replace(/[^a-z']/g,'');return s(a)===s(b)||(s(a)[0]===s(b)[0]&&Math.abs(a.length-b.length)<=2)}
  let i=0,j=0,out=[],perfect=apostrophe(typed)===apostrophe(target);
  while(i<n||j<m){
    if(i<n&&j<m&&sim(Tgt[i],Y[j])&&dp[i][j]===dp[i+1][j+1]+1){out.push(`<span class="${norm(Tgt[i])===norm(Y[j])?'ok':'bad'}">${esc(Y[j])}</span>`);i++;j++}
    else if(j<m&&(i>=n||dp[i][j+1]>=dp[i+1][j])){out.push(`<span class="bad">${esc(Y[j])}</span>`);j++}
    else{out.push(`<span class="miss">${esc(Tgt[i])}</span>`);i++}
  }
  return{html:out.join(' ')||`<span class="miss">${T().nothing}</span>`,perfect};
}
function spellTest(ws,storeKey,backFn){
  const list=[...ws].sort(()=>Math.random()-.5);let i=0,score=0,tries=0,wrong=[];
  const t=()=>T();
  const leave=()=>{cancelDeferred(); backFn()};
  const draw=()=>{const w=list[i];app.innerHTML=`<h2>${t().wordOf(i+1,list.length)}</h2><div class="card center">
    <button class="btn g" id="p">${t().hearWord}</button><button class="btn o" id="s">${t().sentenceBtn}</button>
    <p><input class="ans" id="a" autocomplete="off" autocapitalize="off" autocorrect="off" spellcheck="false"></p>
    <button class="btn p" id="c">${t().check}</button><div class="fb" id="f"></div></div>`;
    const play=()=>say(w);$('#p').onclick=play;$('#s').onclick=()=>say(sentence(w));
    later(play,300);const a=$('#a');a.focus();a.onkeydown=e=>{if(e.key==='Enter')check()};$('#c').onclick=check;
    function check(){const v=a.value.trim();if(!v)return;
      if(v.toLowerCase()===w.toLowerCase()){if(!tries)score++;$('#f').textContent='🌟 '+rnd(t().praise);next()}
      else if(!tries){tries=1;$('#f').textContent=t().nearly;a.value='';play()}
      else{wrong.push(w);$('#f').innerHTML=t().spelled+' <b>'+esc(w)+'</b>. '+t().goodTry;next(2200)}}
    function next(ms){$('#c').disabled=true;later(()=>{i++;tries=0;i<list.length?draw():done()},ms||1200)}};
  const done=()=>{LS.set(storeKey,{score,total:list.length,wrong,date:new Date().toISOString()});
    app.innerHTML=`<div class="card center"><div class="big">${score>=list.length-1?'🏆':'⭐'} ${score}/${list.length}</div>
    ${wrong.length?`<p>${t().practise} <b>${wrong.map(esc).join(', ')}</b></p>`:`<p>${t().allCorrect}</p>`}
    <button class="btn p" id="b">${t().back}</button></div>`;$('#b').onclick=leave};
  draw();
}
function lcwc(ws,i,backFn){
  const w=ws[i], t=T();
  app.innerHTML=`<h2>${t.lcwcTitle(i+1,ws.length)}</h2><div class="card center">
   <p>${t.look}</p><div class="big" id="w">${esc(w)}</div>
   <button class="btn g" id="p">${t.hearIt}</button><button class="btn o" id="cv">${t.cover}</button>
   <div id="wr" style="display:none"><p>${t.write}</p><input class="ans" id="a" autocomplete="off" autocapitalize="off" autocorrect="off" spellcheck="false"><button class="btn p" id="c">${t.checkStep}</button></div>
   <div class="fb" id="f"></div><button class="btn grey" id="pr">⬅️</button><button class="btn grey" id="nx">➡️</button>
   ${backFn?`<p><button class="btn grey" id="bk">${t.back}</button></p>`:''}</div>`;
  $('#p').onclick=()=>say(w);
  $('#cv').onclick=()=>{$('#w').classList.add('cover');$('#cv').style.display='none';$('#wr').style.display='';$('#a').focus()};
  $('#c').onclick=()=>{$('#w').classList.remove('cover');const ok=$('#a').value.trim().toLowerCase()===w.toLowerCase();
    $('#f').innerHTML=ok?'🌟 '+rnd(t.praise):t.tryAgain;if(!ok){$('#cv').style.display='';$('#wr').style.display='none';$('#a').value=''}};
  $('#pr').onclick=()=>lcwc(ws,(i-1+ws.length)%ws.length,backFn);$('#nx').onclick=()=>lcwc(ws,(i+1)%ws.length,backFn);
  if(backFn)$('#bk').onclick=backFn;
}
route();
})();
