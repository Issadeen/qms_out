(function(global){
  const SNAPSHOT_KEY = 'qms-queue-snapshot';
  const QUEUE_ENDPOINT = '/api/queue'; // Placeholder: adjust if you know the real path
  const store = global.QMSStore;
  const api = global.QMSApiClient;

  function loadSnapshot(){
    try{ const raw = localStorage.getItem(SNAPSHOT_KEY); if(!raw) return null; return JSON.parse(raw); }catch(e){ return null; }
  }
  function saveSnapshot(queue){ try{ localStorage.setItem(SNAPSHOT_KEY, JSON.stringify({ at: Date.now(), queue })); }catch(e){} }

  async function refresh(){
    const res = await api.fetch(QUEUE_ENDPOINT, { timeout:6000, retries:1 });
    if(res.ok && Array.isArray(res.data)){
      store.update({ queue: res.data, lastUpdated: Date.now() });
      saveSnapshot(res.data);
    } else {
      // Keep existing data; rely on snapshot if none
      if(!store.get().queue.length){
        const snap = loadSnapshot();
        if(snap){ store.update({ queue: snap.queue, lastUpdated: snap.at }); }
      }
    }
  }

  function optimisticAdd(item){
    const current = store.get().queue.slice();
    const ts = Date.now();
    const optimisticItem = Object.assign({ __optimistic:true, id: item.id || 'opt-'+ts }, item);
    current.push(optimisticItem);
    store.update({ queue: current, lastUpdated: ts });
    saveSnapshot(current);
    api.fetch(QUEUE_ENDPOINT, { method:'POST', body:optimisticItem, retries:0 }).then(res => {
      if(!res.ok){ rollback(optimisticItem.id); }
    });
  }

  function rollback(id){
    const filtered = store.get().queue.filter(q => q.id !== id);
    store.update({ queue: filtered, lastUpdated: Date.now() });
    saveSnapshot(filtered);
  }

  function optimisticRemove(id){
    const current = store.get().queue.slice();
    const idx = current.findIndex(q => q.id === id);
    if(idx === -1) return;
    const removed = current.splice(idx,1)[0];
    store.update({ queue: current, lastUpdated: Date.now() });
    saveSnapshot(current);
    api.fetch(`${QUEUE_ENDPOINT}/${encodeURIComponent(id)}`, { method:'DELETE', retries:0 }).then(res => {
      if(!res.ok){ // revert
        current.splice(idx,0,removed); store.update({ queue: current, lastUpdated: Date.now() }); saveSnapshot(current);
      }
    });
  }

  // Periodic refresh when online and visible
  let intervalId;
  function startAutoRefresh(){
    if(intervalId) return;
    intervalId = setInterval(()=>{
      if(document.visibilityState === 'visible' && navigator.onLine){ refresh(); }
    }, 15000);
  }

  document.addEventListener('visibilitychange', ()=>{
    if(document.visibilityState === 'visible'){ refresh(); }
  });

  // Init: load snapshot instantly for perceived speed
  const snap = loadSnapshot();
  if(snap){ store.update({ queue: snap.queue, lastUpdated: snap.at }); }
  refresh();
  startAutoRefresh();

  global.QMSQueueModel = { refresh, optimisticAdd, optimisticRemove };
  // Console helpers
  global.qmsAdd = (data={}) => optimisticAdd(data);
  global.qmsRemove = (id) => optimisticRemove(id);
  if(!global.__QMS_QUEUE_BANNER){
    global.__QMS_QUEUE_BANNER = true;
    setTimeout(()=>{
      try {
        console.log('%cQMS Optimistic Queue Ready','background:#222;color:#0f0;padding:4px 8px;border-radius:4px');
        console.log('Use qmsAdd({ id:"temp123", ...fields }) to add optimistic item.');
        console.log('Use qmsRemove("id") to remove. Items with __optimistic flag render dashed cards until server confirms.');
      } catch(e){}
    },1000);
  }
})(window);
