const C='keeva-hw-v16',F=['./','index.html','app.js','maths.js','lifeskills.js','data.js','style.css','manifest.json','icon.svg','config.js','tts.js'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(C).then(c=>c.addAll(F)));self.skipWaiting()});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!==C).map(x=>caches.delete(x)))));self.clients.claim()});
self.addEventListener('fetch',e=>{
  const u=e.request.url;
  if(e.request.method!=='GET')return;
  if(/supabase\.co|tts\.speech\.microsoft\.com|cognitiveservices/i.test(u))return;
  e.respondWith(fetch(e.request).then(res=>{
    if(res.ok){const copy=res.clone();caches.open(C).then(c=>c.put(e.request,copy)).catch(()=>{})}
    return res;
  }).catch(()=>caches.match(e.request,{ignoreSearch:true})));
});
