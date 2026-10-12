(function(global){
const CFG=global.HW_CONFIG||{};
const ANON=CFG.SUPABASE_ANON_KEY||'';
const TOKEN_URL=(CFG.SUPABASE_URL||'https://taiwqvydfhlkyjguunrb.supabase.co')+'/functions/v1/speech-token';
const TTS_URL='https://southafricanorth.tts.speech.microsoft.com/cognitiveservices/v1';
const VOICES={en:'en-ZA-LeahNeural',af:'af-ZA-AdriNeural'};
const LANGS={en:'en-ZA',af:'af-ZA'};
const AUDIO_CACHE='keeva-tts-audio-v1';
const TOKEN_MS=9*60*1000;

let lang='en', tokenCache=null, audioEl=null, objectUrl=null, speakGen=0;
const mem=new Map();
const inflight=new Map();
let voiceEn=null, voiceAf=null;

function pickVoice(){
  if(!('speechSynthesis' in global))return;
  const v=speechSynthesis.getVoices();
  voiceEn=v.find(x=>/en[-_]ZA/i.test(x.lang))||v.find(x=>/en[-_]GB/i.test(x.lang))||v.find(x=>/^en/i.test(x.lang))||null;
  voiceAf=v.find(x=>/af[-_]ZA/i.test(x.lang))||v.find(x=>/^af/i.test(x.lang))||null;
}
if('speechSynthesis' in global){pickVoice();speechSynthesis.onvoiceschanged=pickVoice}

function setLang(l){lang=l==='af'?'af':'en'}
function escapeXml(s){return String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&apos;'}[c]))}
function rateKey(slower){return slower?'-25%':'default'}
function cacheUrl(voice,rate,text){return 'https://tts.cache/'+encodeURIComponent(voice)+'/'+encodeURIComponent(rate)+'/'+encodeURIComponent(text)}
function memKey(voice,rate,text){return voice+'\0'+rate+'\0'+text}

function stopAudio(){
  if(audioEl){try{audioEl.pause()}catch(e){} audioEl.removeAttribute('src');try{audioEl.load()}catch(e){} audioEl=null}
  if(objectUrl){try{URL.revokeObjectURL(objectUrl)}catch(e){} objectUrl=null}
}
function stop(){
  speakGen++;
  stopAudio();
  if('speechSynthesis' in global)speechSynthesis.cancel();
}

async function getToken(){
  const now=Date.now();
  if(tokenCache&&tokenCache.token&&now-tokenCache.at<TOKEN_MS)return tokenCache;
  const res=await fetch(TOKEN_URL,{
    method:'POST',
    headers:{Authorization:'Bearer '+ANON,apikey:ANON}
  });
  if(!res.ok)throw new Error('token '+res.status);
  const data=await res.json();
  if(!data||!data.token)throw new Error('token missing');
  tokenCache={token:data.token,region:data.region,at:now};
  return tokenCache;
}

async function getCachedBlob(voice,rate,text){
  const mk=memKey(voice,rate,text);
  if(mem.has(mk))return mem.get(mk);
  if(!('caches' in global))return null;
  try{
    const cache=await caches.open(AUDIO_CACHE);
    const res=await cache.match(cacheUrl(voice,rate,text));
    if(!res)return null;
    const blob=await res.blob();
    mem.set(mk,blob);
    return blob;
  }catch(e){return null}
}

async function putCachedBlob(voice,rate,text,blob){
  const mk=memKey(voice,rate,text);
  mem.set(mk,blob);
  if(!('caches' in global))return;
  try{
    const cache=await caches.open(AUDIO_CACHE);
    await cache.put(cacheUrl(voice,rate,text),new Response(blob,{headers:{'Content-Type':'audio/mpeg'}}));
  }catch(e){}
}

function ssml(text,slower){
  const voice=VOICES[lang]||VOICES.en;
  const xmlLang=LANGS[lang]||LANGS.en;
  const body=slower?`<prosody rate="-25%">${escapeXml(text)}</prosody>`:escapeXml(text);
  return `<speak version="1.0" xmlns="http://www.w3.org/2001/10/synthesis" xml:lang="${xmlLang}"><voice name="${voice}">${body}</voice></speak>`;
}

async function fetchAzureBlob(text,slower){
  const voice=VOICES[lang]||VOICES.en;
  const rate=rateKey(slower);
  const cached=await getCachedBlob(voice,rate,text);
  if(cached)return cached;
  const key=memKey(voice,rate,text);
  if(inflight.has(key))return inflight.get(key);
  const p=(async()=>{
    if(typeof navigator!=='undefined'&&navigator.onLine===false)throw new Error('offline');
    const {token}=await getToken();
    const res=await fetch(TTS_URL,{
      method:'POST',
      headers:{
        Authorization:'Bearer '+token,
        'Content-Type':'application/ssml+xml',
        'X-Microsoft-OutputFormat':'audio-24khz-48kbitrate-mono-mp3'
      },
      body:ssml(text,slower)
    });
    if(!res.ok)throw new Error('tts '+res.status);
    const blob=await res.blob();
    await putCachedBlob(voice,rate,text,blob);
    return blob;
  })();
  inflight.set(key,p);
  try{return await p}finally{inflight.delete(key)}
}

function playBlob(blob){
  stopAudio();
  objectUrl=URL.createObjectURL(blob);
  audioEl=new Audio(objectUrl);
  const url=objectUrl;
  audioEl.onended=()=>{if(objectUrl===url){URL.revokeObjectURL(url);objectUrl=null}};
  return audioEl.play();
}

function fallbackSpeak(text,slower){
  if(!('speechSynthesis' in global))return;
  speechSynthesis.cancel();
  const u=new SpeechSynthesisUtterance(text);
  const voice=lang==='af'?voiceAf:voiceEn;
  if(voice){u.voice=voice;u.lang=voice.lang}
  else u.lang=lang==='af'?'af-ZA':'en-GB';
  u.rate=slower?0.65:0.85;
  speechSynthesis.speak(u);
}

async function speak(text,opts){
  text=String(text||'').trim();
  if(!text)return;
  const slower=!!(opts&&opts.slower);
  stop();
  const gen=speakGen;
  try{
    const blob=await fetchAzureBlob(text,slower);
    if(gen!==speakGen)return;
    await playBlob(blob);
  }catch(e){
    if(gen!==speakGen)return;
    fallbackSpeak(text,slower);
  }
}

function wavBlob(samples, sampleRate){
  const n=samples.length;
  const buf=new ArrayBuffer(44+n*2);
  const v=new DataView(buf);
  const str=(o,s)=>{for(let i=0;i<s.length;i++)v.setUint8(o+i,s.charCodeAt(i))};
  str(0,'RIFF'); v.setUint32(4,36+n*2,true); str(8,'WAVE');
  str(12,'fmt '); v.setUint32(16,16,true); v.setUint16(20,1,true); v.setUint16(22,1,true);
  v.setUint32(24,sampleRate,true); v.setUint32(28,sampleRate*2,true); v.setUint16(32,2,true); v.setUint16(34,16,true);
  str(36,'data'); v.setUint32(40,n*2,true);
  let o=44;
  for(let i=0;i<n;i++,o+=2){
    const x=Math.max(-1,Math.min(1,samples[i]||0));
    v.setInt16(o,x<0?x*0x8000:x*0x7FFF,true);
  }
  return new Blob([buf],{type:'audio/wav'});
}

async function recognize(samples, sampleRate, locale){
  if(typeof navigator!=='undefined'&&navigator.onLine===false)throw new Error('offline');
  const info=await getToken();
  const region=info.region||'southafricanorth';
  const url='https://'+region+'.stt.speech.microsoft.com/speech/recognition/conversation/cognitiveservices/v1?language='+encodeURIComponent(locale||'af-ZA')+'&format=detailed';
  const res=await fetch(url,{
    method:'POST',
    headers:{
      Authorization:'Bearer '+info.token,
      'Content-Type':'audio/wav; codecs=audio/pcm; samplerate='+sampleRate,
      Accept:'application/json'
    },
    body:wavBlob(samples, sampleRate)
  });
  if(!res.ok)throw new Error('stt '+res.status);
  const data=await res.json();
  if(!data||data.RecognitionStatus!=='Success')return '';
  const bits=[data.DisplayText||''];
  (data.NBest||[]).forEach(n=>{if(n.Display)bits.push(n.Display); if(n.Lexical)bits.push(n.Lexical)});
  return bits.join(' ');
}

global.TTS={speak,stop,cancel:stop,setLang,recognize};
})(window);
