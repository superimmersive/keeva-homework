(function(global){
  // Native shells (Capacitor) package the site inside the app. A service worker
  // would pin an old copy across updates, so it is only used on GitHub Pages.
  // TTS audio still uses the Cache API directly (see tts.js), which does not need a worker.
  function isShell(){
    try{
      var cap=global.Capacitor;
      if(cap&&typeof cap.isNativePlatform==='function'&&cap.isNativePlatform())return true;
    }catch(e){}
    try{ if(global.androidBridge) return true; }catch(e){}
    try{
      var proto=global.location&&global.location.protocol;
      if(proto==='capacitor:'||proto==='ionic:')return true;
    }catch(e){}
    return false;
  }
  function dropServiceWorkers(){
    if(!('serviceWorker' in navigator))return;
    navigator.serviceWorker.getRegistrations().then(function(rs){
      rs.forEach(function(r){ r.unregister(); });
    }).catch(function(){});
  }
  function styleBars(){
    try{
      var cap=global.Capacitor;
      var bars=cap&&cap.Plugins&&cap.Plugins.SystemBars;
      if(bars&&typeof bars.setStyle==='function'){
        // Capacitor 8: LIGHT means dark status-bar icons, which stay readable on the pink header.
        bars.setStyle({style:'LIGHT'}).catch(function(){});
      }
    }catch(e){}
  }
  function boot(){
    if(!isShell())return;
    document.documentElement.classList.add('native-app');
    try{
      var plat=global.Capacitor&&global.Capacitor.getPlatform&&global.Capacitor.getPlatform();
      if(plat)document.documentElement.classList.add('native-'+plat);
    }catch(e){}
    dropServiceWorkers();
    styleBars();
  }
  global.KeevaNative={isShell:isShell,boot:boot};
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot);
  else boot();
  global.addEventListener('load',boot);
})(window);
