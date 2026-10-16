// Life Skills – Show and Tell weekly prep helper
(function(){
const esc=s=>String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));

const PROVINCES=[
  {name:"Western Cape",capital:"Cape Town",color:"#7e57c2",home:true},
  {name:"Eastern Cape",capital:"Bhisho",color:"#42a5f5"},
  {name:"Northern Cape",capital:"Kimberley",color:"#ffca28"},
  {name:"Free State",capital:"Bloemfontein",color:"#ef5350"},
  {name:"KwaZulu-Natal",capital:"Pietermaritzburg",color:"#66bb6a"},
  {name:"North West",capital:"Mahikeng",color:"#26a69a"},
  {name:"Gauteng",capital:"Johannesburg",color:"#ab47bc"},
  {name:"Mpumalanga",capital:"Mbombela",color:"#ff7043"},
  {name:"Limpopo",capital:"Polokwane",color:"#5c6bc0"}
];

// Braille: dots numbered 1 4 / 2 5 / 3 6 (top to bottom, left then right)
const BRAILLE={
  A:[1],B:[1,2],C:[1,4],D:[1,4,5],E:[1,5],F:[1,2,4],G:[1,2,4,5],H:[1,2,5],I:[2,4],J:[2,4,5],
  K:[1,3],L:[1,2,3],M:[1,3,4],N:[1,3,4,5],O:[1,3,5],P:[1,2,3,4],Q:[1,2,3,4,5],R:[1,2,3,5],
  S:[2,3,4],T:[2,3,4,5],U:[1,3,6],V:[1,2,3,6],W:[2,4,5,6],X:[1,3,4,6],Y:[1,3,4,5,6],Z:[1,3,5,6]
};

function brailleCell(letter, size){
  const s=size||56, pad=8, gap=s*0.28, r=s*0.12;
  const dots=new Set(BRAILLE[letter.toUpperCase()]||[]);
  const pos={1:[0,0],2:[0,1],3:[0,2],4:[1,0],5:[1,1],6:[1,2]};
  let cir='';
  for(let n=1;n<=6;n++){
    const [c,row]=pos[n];
    const cx=pad+r+c*(gap+2*r), cy=pad+r+row*(gap+2*r);
    cir+=`<circle cx="${cx}" cy="${cy}" r="${r}" fill="${dots.has(n)?'#333':'#ddd'}" stroke="#999" stroke-width="1"/>`;
  }
  const w=pad*2+2*r+gap+2*r, h=pad*2+2*r+2*(gap+2*r);
  return `<svg class="ls-braille" viewBox="0 0 ${w} ${h}" width="${w}" height="${h}" aria-label="${esc(letter)}"><title>${esc(letter)}</title>${cir}</svg>`;
}

function provinceMapSvg(){
  // Simplified SA map – Northern Cape largest; rough relative sizes/positions
  return `<svg class="ls-map" viewBox="0 0 340 300" role="img" aria-label="South Africa provinces">
    <polygon points="95,8 210,8 210,55 175,78 95,70" fill="#5c6bc0" stroke="#fff" stroke-width="2"/><text x="150" y="42" text-anchor="middle" fill="#fff" font-size="11" font-weight="700">Limpopo</text>
    <polygon points="210,20 290,28 295,95 230,100 210,55" fill="#ff7043" stroke="#fff" stroke-width="2"/><text x="250" y="62" text-anchor="middle" fill="#fff" font-size="10" font-weight="700">Mpuma-</text><text x="250" y="74" text-anchor="middle" fill="#fff" font-size="10" font-weight="700">langa</text>
    <polygon points="55,70 95,70 175,78 175,120 95,125 55,110" fill="#26a69a" stroke="#fff" stroke-width="2"/><text x="110" y="100" text-anchor="middle" fill="#fff" font-size="10" font-weight="700">North West</text>
    <polygon points="175,78 230,100 225,130 185,128 175,120" fill="#ab47bc" stroke="#fff" stroke-width="2"/><text x="200" y="110" text-anchor="middle" fill="#fff" font-size="9" font-weight="700">Gauteng</text>
    <polygon points="230,100 295,95 310,175 265,190 225,150 225,130" fill="#66bb6a" stroke="#fff" stroke-width="2"/><text x="268" y="140" text-anchor="middle" fill="#fff" font-size="10" font-weight="700">KwaZulu-</text><text x="268" y="152" text-anchor="middle" fill="#fff" font-size="10" font-weight="700">Natal</text>
    <polygon points="95,125 175,120 185,128 225,130 225,150 200,185 120,175" fill="#ef5350" stroke="#fff" stroke-width="2"/><text x="160" y="155" text-anchor="middle" fill="#fff" font-size="11" font-weight="700">Free State</text>
    <polygon points="8,100 55,70 55,110 95,125 120,175 200,185 195,230 130,255 40,240 8,180" fill="#ffca28" stroke="#fff" stroke-width="2"/><text x="95" y="175" text-anchor="middle" fill="#333" font-size="12" font-weight="700">Northern Cape</text>
    <polygon points="200,185 265,190 280,240 220,265 195,230" fill="#42a5f5" stroke="#fff" stroke-width="2"/><text x="235" y="220" text-anchor="middle" fill="#fff" font-size="10" font-weight="700">Eastern</text><text x="235" y="232" text-anchor="middle" fill="#fff" font-size="10" font-weight="700">Cape</text>
    <polygon points="40,240 130,255 195,230 220,265 180,290 70,285" fill="#7e57c2" stroke="#ffeb3b" stroke-width="3"/><text x="130" y="262" text-anchor="middle" fill="#fff" font-size="10" font-weight="700">Western Cape</text><text x="130" y="276" text-anchor="middle" fill="#ffe082" font-size="9">★ George</text>
  </svg>`;
}

const TOPICS={
  2:{
    thu:"15 Oct", lang:"en",
    title:"Our 9 provinces",
    emoji:"🗺️",
    pick:null,
    facts:[
      "South Africa has nine provinces.",
      "Each province has its own capital city.",
      "Keeva lives in George, in the Western Cape.",
      "The capital of the Western Cape is Cape Town.",
      "The Northern Cape is the biggest province.",
      "Gauteng is the smallest province.",
      "Gauteng has big cities like Johannesburg and Pretoria.",
      "On Thursday, tell your class which province you live in!"
    ],
    art(){return provinceMapSvg()+`<ul class="ls-prov">${PROVINCES.map(p=>`<li style="border-left:8px solid ${p.color}"><b>${esc(p.name)}</b> – capital: ${esc(p.capital)}${p.home?' <span class="ls-home">★ I live here (George)</span>':''}</li>`).join('')}</ul>`},
    checklist:["A map of South Africa (draw or print)","A sticker or star on Western Cape / George","Optional: a photo of George or the Garden Route","My talk plan ready on cue cards"],
    planHint:{open:"Hello! Today I will tell you about…", facts:["Fact 1 about provinces…","Fact 2…","Fact 3…"], fav:"My favourite part is…", close:"Thank you for listening!"}
  },
  3:{
    thu:"22 Oct", lang:"af",
    title:"Nasionale simbole (Wys en Vertel)",
    emoji:"🌿",
    pick:null,
    facts:[
      "Die protea is Suid-Afrika se nasionale blom.",
      "Die springbok is ons nasionale dier.",
      "Die bloukraanvoël is ons nasionale voël.",
      "Die geelhoutboom is ons nasionale boom.",
      "Die galjoen is ons nasionale vis.",
      "Hierdie simbole maak ons trots op ons land.",
      "Op Donderdag wys en vertel ek een simbool vir die klas."
    ],
    art(){return `<div class="ls-syms">
      <div class="ls-sym"><svg viewBox="0 0 80 80" width="72" height="72"><ellipse cx="40" cy="48" rx="18" ry="14" fill="#c62828"/><ellipse cx="40" cy="40" rx="14" ry="18" fill="#e53935"/><ellipse cx="40" cy="32" rx="10" ry="14" fill="#ef5350"/><circle cx="40" cy="42" r="6" fill="#ffeb3b"/><path d="M40 55 L40 72" stroke="#2e7d32" stroke-width="3"/></svg><b>Protea</b><small>blom</small></div>
      <div class="ls-sym"><svg viewBox="0 0 80 80" width="72" height="72" aria-hidden="true"><ellipse cx="42" cy="48" rx="22" ry="12" fill="#c4a35a"/><ellipse cx="58" cy="36" rx="10" ry="8" fill="#c4a35a"/><path d="M62 30 L70 14 L66 30 Z" fill="#a8843a"/><path d="M54 30 L48 12 L52 30 Z" fill="#a8843a"/><circle cx="62" cy="34" r="1.6" fill="#333"/><path d="M28 52 L18 68" stroke="#8d6e3a" stroke-width="3" stroke-linecap="round"/><path d="M38 55 L34 70" stroke="#8d6e3a" stroke-width="3" stroke-linecap="round"/><path d="M48 55 L52 70" stroke="#8d6e3a" stroke-width="3" stroke-linecap="round"/><path d="M56 52 L66 66" stroke="#8d6e3a" stroke-width="3" stroke-linecap="round"/><path d="M22 44 Q32 38 40 42" fill="none" stroke="#a8843a" stroke-width="3"/></svg><b>Springbok</b><small>dier</small></div>
      <div class="ls-sym"><div class="ls-emoji">🐦</div><b>Bloukraanvoël</b><small>voël</small></div>
      <div class="ls-sym"><svg viewBox="0 0 80 80" width="72" height="72"><rect x="36" y="30" width="8" height="40" fill="#5d4037"/><ellipse cx="40" cy="28" rx="22" ry="16" fill="#2e7d32"/><ellipse cx="28" cy="36" rx="12" ry="8" fill="#43a047"/><ellipse cx="52" cy="36" rx="12" ry="8" fill="#43a047"/></svg><b>Geelhout</b><small>boom</small></div>
      <div class="ls-sym"><div class="ls-emoji">🐟</div><b>Galjoen</b><small>vis</small></div>
    </div>`},
    checklist:["’n Prentjie of tekening van jou simbool","Of iets wat jy gemaak het (klei,karton)","Jou praatjie-plan op kaartjies","Wys en Vertel is op Donderdag"],
    planHint:{open:"Goeie more! Vandag wys ek…", facts:["Feit 1…","Feit 2…","Feit 3…"], fav:"My gunsteling deel is…", close:"Baie dankie dat julle geluister het!"}
  },
  4:{
    thu:"29 Oct", lang:"en",
    title:"One way we send a message",
    emoji:"📨",
    pick:{
      key:"message",
      label:"Pick how you will talk about sending a message:",
      options:[
        {id:"letter", label:"Letter ✉️", emoji:"✉️",
          facts:[
            "A letter is a message written on paper.",
            "You put the letter in an envelope.",
            "A stamp goes on the front of the envelope.",
            "The post office helps deliver letters.",
            "Letters can travel far across South Africa.",
            "Writing a letter shows someone you care.",
            "You can draw a picture inside your letter too."
          ],
          checklist:["A stamped envelope to show","A short letter you wrote","Optional: stickers or a drawing inside","My talk plan ready"]
        },
        {id:"sms", label:"SMS 📱", emoji:"📱",
          facts:[
            "An SMS is a short text message on a phone.",
            "SMS means Short Message Service.",
            "You type words with your thumbs or fingers.",
            "The message travels through the phone network.",
            "An SMS can arrive in just a few seconds.",
            "People use SMS to say hello quickly.",
            "Keep messages kind and clear."
          ],
          checklist:["A drawing of a phone with a message","Optional: print a pretend SMS bubble","My talk plan ready","Ask a grown-up before showing a real phone"]
        },
        {id:"email", label:"Email 💻", emoji:"💻",
          facts:[
            "Email means electronic mail.",
            "You type an email on a computer, tablet or phone.",
            "Email travels on the internet.",
            "An email address has an @ sign in it.",
            "You can send photos with an email.",
            "Email can go around the world in seconds.",
            "Always ask a grown-up before sending email."
          ],
          checklist:["A drawing of an inbox or @ sign","Optional: a printed pretend email","My talk plan ready","Grown-up help if you show a real screen"]
        },
        {id:"news", label:"The news 📰", emoji:"📰",
          facts:[
            "The news tells us what is happening in the world.",
            "We can watch the news on television.",
            "We can hear the news on the radio.",
            "Newspapers print the news on paper.",
            "News apps and websites share news online too.",
            "Reporters find out the facts first.",
            "News helps people learn and stay informed."
          ],
          checklist:["A newspaper cutting or news drawing","Optional: a pretend microphone","My talk plan ready","Choose a kid-friendly news example"]
        }
      ]
    },
    facts:null,
    art(opt){return `<div class="ls-hero-emoji">${opt?opt.emoji:'📨'}</div>`},
    checklist:null,
    planHint:{open:"Hello! Today I will talk about how we send a message by…", facts:["Fact 1…","Fact 2…","Fact 3…"], fav:"My favourite part is…", close:"Thank you for listening!"}
  },
  5:{
    thu:"5 Nov", lang:"af",
    title:"Gebaretaal en braille",
    emoji:"🤟",
    pick:null,
    facts:[
      "Dowe mense praat met gebaretaal.",
      "Hulle gebruik hande, gesig en lyf om te praat.",
      "Elke gebaar kan ’n woord of idee beteken.",
      "Blinde mense lees met braille.",
      "Braille is klein kolletjies wat jy met jou vingers voel.",
      "Die kolletjies maak letters van die alfabet.",
      "Keeva se naam in braille is K, E, E, V, A.",
      "Gebaretaal en braille help mense om te kommunikeer."
    ],
    art(){
      const name="KEEVA";
      return `<div class="ls-braille-wrap"><p class="center"><b>Keeva in braille</b></p>
        <div class="ls-braille-row">${[...name].map(ch=>`<div class="ls-braille-letter">${brailleCell(ch)}<span>${esc(ch)}</span></div>`).join('')}</div>
        <p class="center ls-muted">Voel die swart kolletjies – dit is die letter!</p>
        <div class="ls-emoji-row"><span>🤟</span><span>✋</span><span>👀</span><span>👆</span></div>
      </div>`;
    },
    checklist:["’n Braille-kaartjie met KEEVA (maak gate met ’n potlood)","Of ’n prentjie van gebaretaal-hande","Jou praatjie-plan","Wys en Vertel op Donderdag"],
    planHint:{open:"Goeie more! Vandag praat ek oor…", facts:["Feit 1…","Feit 2…","Feit 3…"], fav:"My gunsteling deel is…", close:"Baie dankie!"}
  },
  6:{
    thu:"12 Nov", lang:"en",
    title:"A nocturnal animal",
    emoji:"🌙",
    pick:{
      key:"animal",
      label:"Pick your nocturnal animal:",
      options:[
        {id:"owl", label:"Owl 🦉", emoji:"🦉",
          facts:[
            "An owl is a bird that hunts at night.",
            "Big eyes help an owl see in the dark.",
            "Sharp ears hear tiny sounds, like a mouse.",
            "Soft feathers let an owl fly almost silently.",
            "Owls eat mice, insects and small animals.",
            "Animals that are active at night are nocturnal.",
            "Sight and hearing are an owl’s best night senses."
          ],
          checklist:["A drawing or craft owl","Optional: big paper eyes","My talk plan","Say which senses help at night"]
        },
        {id:"bat", label:"Bat 🦇", emoji:"🦇",
          facts:[
            "Bats fly at night.",
            "Many bats use echolocation to find their way.",
            "They make high sounds and listen for echoes.",
            "The echoes tell them where things are.",
            "Bats have excellent hearing.",
            "Some bats eat insects; some eat fruit.",
            "Hearing is a bat’s most important night sense."
          ],
          checklist:["A bat drawing or craft","Optional: show ‘ping’ echo with hands","My talk plan","Explain echolocation simply"]
        },
        {id:"bushbaby", label:"Bush baby 👀", emoji:"👀",
          facts:[
            "Bush babies live in Africa.",
            "They wake up when it gets dark.",
            "Huge eyes help them see at night.",
            "Big ears help them hear soft sounds.",
            "They jump quickly from tree to tree.",
            "They eat insects, fruit and tree gum.",
            "Sight and hearing help bush babies at night."
          ],
          checklist:["A bush baby drawing (big eyes!)","Optional: soft toy if you have one","My talk plan","Name the night senses"]
        },
        {id:"aardvark", label:"Aardvark 🐜", emoji:"🐜",
          facts:[
            "An aardvark comes out at night to feed.",
            "Its long nose smells ants and termites.",
            "Strong claws dig into insect nests.",
            "A long sticky tongue catches the insects.",
            "Its ears can hear sounds underground.",
            "Aardvark means ‘earth pig’ in Afrikaans.",
            "Smell and hearing help an aardvark at night."
          ],
          checklist:["An aardvark drawing (long nose!)","Optional: toy ants or paper insects","My talk plan","Say smell and hearing help at night"]
        }
      ]
    },
    facts:null,
    art(opt){return `<div class="ls-hero-emoji">${opt?opt.emoji:'🌙'}</div>`},
    checklist:null,
    planHint:{open:"Hello! My nocturnal animal is…", facts:["It uses this sense…","Another fact…","Another fact…"], fav:"My favourite part is…", close:"Thank you for listening!"}
  }
};

function topic(week){return TOPICS[week]||null}

function install(views, ctx){
  const {app,$,LS,say,stopSpeech,go,getWeek,setLang,setTimer,onLeave}=ctx;

  function pickKey(week, topicObj){
    return 'ls_pick_w'+week+'_'+(topicObj.pick?topicObj.pick.key:'x');
  }
  function getPick(week, topicObj){
    if(!topicObj.pick)return null;
    const id=LS.get(pickKey(week, topicObj), null);
    return topicObj.pick.options.find(o=>o.id===id)||null;
  }
  function setPick(week, topicObj, id){
    LS.set(pickKey(week, topicObj), id);
  }
  function resolved(week){
    const t=topic(week);
    if(!t)return null;
    const opt=getPick(week,t);
    const facts=t.pick?(opt?opt.facts:null):t.facts;
    const checklist=t.pick?(opt?opt.checklist:null):t.checklist;
    return {t, opt, facts, checklist};
  }
  function talkKey(week){return 'ls_talk_w'+week}
  function checkKey(week){return 'ls_check_w'+week}

  function noneWeek(){
    const week=getWeek();
    setLang('en');
    app.innerHTML=`<h2>🌍 Life Skills</h2><div class="card center"><p>Show and Tell prep is ready for Weeks 2–6. Pick one of those weeks at the top.</p>
      <p>Show and Tell is on <b>Thursdays</b>.</p></div>`;
  }

  function pickChooser(week, t, backHash){
    setLang(t.lang);
    app.innerHTML=`<h2>🌍 ${esc(t.title)}</h2>
      <div class="card center"><p>${esc(t.pick.label)}</p>
      <div class="ls-picks">${t.pick.options.map(o=>`<button class="btn o ls-pick" data-id="${esc(o.id)}">${esc(o.label)}</button>`).join('')}</div>
      <p><button class="btn grey" id="bk">Back</button></p></div>`;
    app.querySelectorAll('.ls-pick').forEach(b=>b.onclick=()=>{setPick(week,t,b.dataset.id);go(backHash||'lifeskills')});
    $('#bk').onclick=()=>go('lifeskills');
  }

  views.lifeskills=function(){
    const week=getWeek();
    const t=topic(week);
    if(!t){noneWeek();return}
    setLang(t.lang);
    const opt=getPick(week,t);
    const af=t.lang==='af';
    const subtitle=af?`Wys en Vertel · Donderdag ${t.thu}`:`Show and Tell · Thursday ${t.thu}`;
    const pickLine=t.pick?(opt?`<p class="center">You chose: <b>${esc(opt.label)}</b> <button class="btn grey" id="ch" style="min-height:40px;font-size:16px;padding:6px 12px">Change</button></p>`
      :`<p class="center ls-warn">${esc(t.pick.label)}</p>`):'';
    app.innerHTML=`<h2>🌍 Life Skills – Week ${week}</h2>
      <p class="center">${esc(t.emoji)} <b>${esc(t.title)}</b><br><small>${subtitle}</small></p>
      ${pickLine}
      <div class="tiles">
        <button class="tile" style="background:#ff7043" id="f"><span class="e">📖</span>${af?'Feite':'Facts'}</button>
        <button class="tile" style="background:#ff8a65" id="p"><span class="e">📝</span>${af?'Beplan my praatjie':'Plan my talk'}</button>
        <button class="tile" style="background:#ffab91" id="r"><span class="e">🎤</span>${af?'Oefen':'Practice'}</button>
        <button class="tile" style="background:#ffccbc;color:#bf360c" id="c"><span class="e">✅</span>${af?'Bring of maak':'Bring or make'}</button>
      </div>`;
    const gate=hash=>{
      if(t.pick && !opt){pickChooser(week,t,hash);return}
      go(hash);
    };
    $('#f').onclick=()=>gate('lsFacts');
    $('#p').onclick=()=>gate('lsPlan');
    $('#r').onclick=()=>gate('lsPractice');
    $('#c').onclick=()=>gate('lsChecklist');
    const ch=$('#ch'); if(ch)ch.onclick=()=>pickChooser(week,t,'lifeskills');
    if(t.pick && !opt){
      // still allow opening pick from hub buttons via gate
    }
  };

  views.lsFacts=function(){
    const week=getWeek();
    const r=resolved(week);
    if(!r){noneWeek();return}
    if(r.t.pick && !r.opt){pickChooser(week,r.t,'lsFacts');return}
    setLang(r.t.lang);
    const af=r.t.lang==='af';
    const facts=r.facts||[];
    const readText=facts.join(' ');
    app.innerHTML=`<h2>📖 ${esc(r.t.title)}</h2>
      <div class="card center">${r.t.art(r.opt)}</div>
      <div class="card ls-facts">${facts.map(s=>`<p class="ls-fact">${esc(s)}</p>`).join('')}</div>
      <div class="center">
        <button class="btn g" id="read">${af?'🔊 Lees hardop':'🔊 Read aloud'}</button>
        <button class="btn grey" id="stop">${af?'⏹ Stop':'⏹ Stop'}</button>
        <p><button class="btn grey" id="bk">${af?'Terug':'Back'}</button></p>
      </div>`;
    $('#read').onclick=()=>say(readText);
    $('#stop').onclick=()=>{if(stopSpeech)stopSpeech();else if(window.TTS)TTS.stop()};
    $('#bk').onclick=()=>go('lifeskills');
  };

  views.lsPlan=function(){
    const week=getWeek();
    const r=resolved(week);
    if(!r){noneWeek();return}
    if(r.t.pick && !r.opt){pickChooser(week,r.t,'lsPlan');return}
    setLang(r.t.lang);
    const af=r.t.lang==='af';
    const hint=r.t.planHint;
    const saved=LS.get(talkKey(week),{open:'',f1:'',f2:'',f3:'',fav:'',close:''});
    const showCards=()=>{
      const d=LS.get(talkKey(week),saved);
      const cards=[
        {label:af?'Opening':'Opening', text:d.open},
        {label:af?'Feit 1':'Fact 1', text:d.f1},
        {label:af?'Feit 2':'Fact 2', text:d.f2},
        {label:af?'Feit 3':'Fact 3', text:d.f3},
        {label:af?'My gunsteling deel':'My favourite part', text:d.fav},
        {label:af?'Afsluiting':'Closing', text:d.close}
      ].filter(c=>c.text && c.text.trim());
      if(!cards.length){
        app.innerHTML=`<div class="card center"><p>${af?'Tik eers jou praatjie, dan sien jy die kaartjies.':'Fill in your talk first, then see cue cards.'}</p>
          <button class="btn p" id="bk">${af?'Terug':'Back'}</button></div>`;
        $('#bk').onclick=()=>views.lsPlan();
        return;
      }
      let i=0;
      const draw=()=>{
        const c=cards[i];
        app.innerHTML=`<h2>${af?'🃏 Praatjie-kaartjies':'🃏 Cue cards'}</h2>
          <p class="center">${i+1} / ${cards.length}</p>
          <div class="card ls-cue"><div class="ls-cue-label">${esc(c.label)}</div><div class="ls-cue-text">${esc(c.text)}</div></div>
          <div class="center">
            <button class="btn grey" id="pr">⬅️</button>
            <button class="btn g" id="say">${af?'🔊 Lees':'🔊 Read'}</button>
            <button class="btn grey" id="nx">➡️</button>
            <p><button class="btn grey" id="bk">${af?'Terug na plan':'Back to plan'}</button></p>
          </div>`;
        $('#pr').onclick=()=>{i=(i-1+cards.length)%cards.length;draw()};
        $('#nx').onclick=()=>{i=(i+1)%cards.length;draw()};
        $('#say').onclick=()=>say(c.text);
        $('#bk').onclick=()=>views.lsPlan();
      };
      draw();
    };

    app.innerHTML=`<h2>📝 ${af?'Beplan my praatjie':'Plan my talk'}</h2>
      <div class="card ls-plan">
        <label>${af?'Opening':'Opening'}<textarea class="ans" id="open" placeholder="${esc(hint.open)}">${esc(saved.open)}</textarea></label>
        <label>${af?'Feit 1':'Fact 1'}<textarea class="ans" id="f1" placeholder="${esc(hint.facts[0])}">${esc(saved.f1)}</textarea></label>
        <label>${af?'Feit 2':'Fact 2'}<textarea class="ans" id="f2" placeholder="${esc(hint.facts[1])}">${esc(saved.f2)}</textarea></label>
        <label>${af?'Feit 3 (opsioneel)':'Fact 3 (optional)'}<textarea class="ans" id="f3" placeholder="${esc(hint.facts[2]||'')}">${esc(saved.f3)}</textarea></label>
        <label>${af?'My gunsteling deel':'My favourite part'}<textarea class="ans" id="fav" placeholder="${esc(hint.fav)}">${esc(saved.fav)}</textarea></label>
        <label>${af?'Afsluiting':'Closing'}<textarea class="ans" id="close" placeholder="${esc(hint.close)}">${esc(saved.close)}</textarea></label>
      </div>
      <div class="center">
        <button class="btn p" id="save">${af?'💾 Stoor':'💾 Save'}</button>
        <button class="btn o" id="cards">${af?'🃏 Wys kaartjies':'🃏 Show cue cards'}</button>
        <p id="msg" class="fb"></p>
        <p><button class="btn grey" id="bk">${af?'Terug':'Back'}</button></p>
      </div>`;
    const gather=()=>({open:$('#open').value,f1:$('#f1').value,f2:$('#f2').value,f3:$('#f3').value,fav:$('#fav').value,close:$('#close').value});
    $('#save').onclick=()=>{LS.set(talkKey(week),gather());$('#msg').textContent=af?'Gestoor op hierdie toestel!':'Saved on this device!'};
    $('#cards').onclick=()=>{LS.set(talkKey(week),gather());showCards()};
    $('#bk').onclick=()=>go('lifeskills');
  };

  views.lsPractice=function(){
    const week=getWeek();
    const r=resolved(week);
    if(!r){noneWeek();return}
    if(r.t.pick && !r.opt){pickChooser(week,r.t,'lsPractice');return}
    setLang(r.t.lang);
    const af=r.t.lang==='af';
    let mediaRecorder=null, chunks=[], blobUrl=null, recording=false, recStream=null, tLeft=60, running=false, left=false;

    const cleanup=()=>{
      if(left)return;
      left=true;
      running=false;
      if(setTimer)setTimer(null);
      if(blobUrl){URL.revokeObjectURL(blobUrl);blobUrl=null}
      if(mediaRecorder && mediaRecorder.state!=='inactive'){try{mediaRecorder.stop()}catch(e){}}
      mediaRecorder=null; chunks=[]; recording=false;
      if(recStream){recStream.getTracks().forEach(tr=>{try{tr.stop()}catch(e){}}); recStream=null}
    };
    if(onLeave)onLeave(cleanup);

    app.innerHTML=`<h2>🎤 ${af?'Oefen jou praatjie':'Practice your talk'}</h2>
      <div class="card center">
        <p>${af?'Oefen vir een minuut. Jy kan ook jouself opneem – dit bly op hierdie toestel (niks word opgelaai nie).':'Practice for one minute. You can also record yourself – it stays on this device (nothing is uploaded).'}</p>
        <div class="timer" id="tm">⏱ 1:00</div>
        <button class="btn p" id="timer">${af?'▶️ Begin timer':'▶️ Start timer'}</button>
        <hr class="ls-hr">
        <button class="btn o" id="rec">${af?'⏺️ Neem op':'⏺️ Record'}</button>
        <button class="btn g" id="play" disabled>${af?'▶️ Speel terug':'▶️ Play back'}</button>
        <p id="recStatus" class="ls-muted"></p>
        <audio id="audio" controls playsinline webkit-playsinline class="ls-audio" style="display:none"></audio>
        <p><button class="btn grey" id="bk">${af?'Terug':'Back'}</button></p>
      </div>`;

    $('#timer').onclick=()=>{
      if(running)return;
      running=true; tLeft=60;
      $('#timer').disabled=true;
      const tick=()=>{
        const m=Math.floor(tLeft/60), s=tLeft%60;
        const el=$('#tm'); if(el)el.textContent='⏱ '+m+':'+String(s).padStart(2,'0');
        if(tLeft<=0){
          setTimer(null);
          running=false;
          if($('#timer'))$('#timer').disabled=false;
          if(el)el.textContent=af?'⏱ Klaar!':'⏱ Time!';
          return;
        }
        tLeft--;
      };
      tick();
      setTimer(setInterval(tick,1000));
    };

    const status=$('#recStatus');
    const playBtn=$('#play');
    const audio=$('#audio');

    $('#rec').onclick=async()=>{
      if(recording && mediaRecorder){
        mediaRecorder.stop();
        return;
      }
      if(!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia){
        status.textContent=af?'Jou toestel kan nie opneem nie. Oefen net met die timer.':'Recording is not supported on this device. Use the timer to practise.';
        return;
      }
      if(typeof MediaRecorder==='undefined'){
        status.textContent=af?'Opneem word nie ondersteun nie.':'Recording is not supported here.';
        return;
      }
      try{
        const stream=await navigator.mediaDevices.getUserMedia({audio:true});
        if(left){stream.getTracks().forEach(tr=>{try{tr.stop()}catch(e){}}); return}
        recStream=stream;
        chunks=[];
        if(blobUrl){URL.revokeObjectURL(blobUrl);blobUrl=null}
        audio.style.display='none'; audio.removeAttribute('src');
        playBtn.disabled=true;
        const mimeTypes=['audio/webm;codecs=opus','audio/webm','audio/mp4','audio/aac'];
        const mime=(typeof MediaRecorder.isTypeSupported==='function'&&mimeTypes.find(t=>MediaRecorder.isTypeSupported(t)))||'';
        mediaRecorder=mime?new MediaRecorder(stream,{mimeType:mime}):new MediaRecorder(stream);
        const mimeType=mediaRecorder.mimeType||'audio/webm';
        mediaRecorder.ondataavailable=e=>{if(e.data && e.data.size)chunks.push(e.data)};
        mediaRecorder.onstop=()=>{
          recording=false;
          if(recStream===stream){
            stream.getTracks().forEach(tr=>{try{tr.stop()}catch(e){}});
            recStream=null;
          }
          if(left)return;
          const recBtn=$('#rec'); if(recBtn)recBtn.textContent=af?'⏺️ Neem op':'⏺️ Record';
          if(!chunks.length){if(status)status.textContent=af?'Geen klank opgeneem nie.':'Nothing was recorded.';return}
          const blob=new Blob(chunks,{type:mimeType});
          blobUrl=URL.createObjectURL(blob);
          if(audio){audio.src=blobUrl; audio.style.display='block'}
          if(playBtn)playBtn.disabled=false;
          if(status)status.textContent=af?'Gestoor op hierdie toestel. Speel jouself terug!':'Saved on this device. Play yourself back!';
        };
        mediaRecorder.start();
        recording=true;
        $('#rec').textContent=af?'⏹️ Stop opname':'⏹️ Stop recording';
        status.textContent=af?'Neem op… praat nou!':'Recording… say your talk!';
      }catch(err){
        recording=false;
        const denied=err && (err.name==='NotAllowedError'||err.name==='PermissionDeniedError');
        status.textContent=denied
          ?(af?'Mikrofoon geblokkeer. Jy kan steeds die timer gebruik om te oefen.':'Microphone permission denied. You can still practise with the timer.')
          :(af?'Kon nie die mikrofoon oopmaak nie. Gebruik die timer om te oefen.':'Could not open the microphone. Use the timer to practise.');
      }
    };

    playBtn.onclick=()=>{
      if(!blobUrl)return;
      audio.style.display='block';
      audio.play().catch(()=>{status.textContent=af?'Kon nie speel nie.':'Could not play back.'});
    };

    $('#bk').onclick=()=>go('lifeskills');
  };

  views.lsChecklist=function(){
    const week=getWeek();
    const r=resolved(week);
    if(!r){noneWeek();return}
    if(r.t.pick && !r.opt){pickChooser(week,r.t,'lsChecklist');return}
    setLang(r.t.lang);
    const af=r.t.lang==='af';
    const items=r.checklist||[];
    const done=LS.get(checkKey(week),{});
    app.innerHTML=`<h2>✅ ${af?'Bring of maak':'Bring or make'}</h2>
      <div class="card">
        <p>${af?'Merk af wat jy gaan bring of maak vir Donderdag.':'Tick what you will bring or make for Thursday.'}</p>
        ${items.map((text,i)=>`<label class="task${done[i]?' done':''}"><input type="checkbox" data-i="${i}" ${done[i]?'checked':''}><span>${esc(text)}</span></label>`).join('')}
      </div>
      <div class="center"><button class="btn grey" id="bk">${af?'Terug':'Back'}</button></div>`;
    app.querySelectorAll('.task input').forEach(c=>c.onchange=()=>{
      done[c.dataset.i]=c.checked; LS.set(checkKey(week),done);
      c.parentNode.classList.toggle('done',c.checked);
    });
    $('#bk').onclick=()=>go('lifeskills');
  };
}

window.LifeSkillsHW={topic,install,TOPICS};
})();
