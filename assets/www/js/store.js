(function(global){
  const state = {
    queue: [],
    lastUpdated: null,
    network: { online: navigator.onLine, avgLatency: null },
    eta: null,
    versionHash: null
  };
  const subs = {};
  function notify(key){ (subs[key]||[]).forEach(fn=>{ try{ fn(state[key], state); }catch(e){} }); }
  function set(key, value){ if(state[key] === value) return; state[key] = value; notify(key); }
  function update(partial){ Object.keys(partial).forEach(k=>{ state[k] = partial[k]; notify(k); }); }
  function subscribe(key, fn){ subs[key] = subs[key]||[]; subs[key].push(fn); return ()=>{ const i=subs[key].indexOf(fn); if(i>-1) subs[key].splice(i,1); }; }
  function get(){ return JSON.parse(JSON.stringify(state)); }
  window.addEventListener('online', ()=>{ state.network.online = true; notify('network'); });
  window.addEventListener('offline', ()=>{ state.network.online = false; notify('network'); });
  global.QMSStore = { set, update, subscribe, get };
})(window);
