(function(global){
  const api = global.QMSApiClient;
  const store = global.QMSStore;
  const THROUGHPUT_WINDOW = 10 * 60 * 1000; // 10 minutes
  let history = []; // { ts, size }

  function recordSize(size){
    const now = Date.now();
    history.push({ ts: now, size });
    // trim
    history = history.filter(h => now - h.ts <= THROUGHPUT_WINDOW);
  }

  function computeThroughput(){
    if(history.length < 2) return null;
    const first = history[0];
    const last = history[history.length -1];
    const delta = first.size - last.size; // items served (?) assume decreasing
    const elapsedMin = (last.ts - first.ts)/60000;
    if(elapsedMin <= 0) return null;
    return delta / elapsedMin; // items per minute
  }

  function computeETA(){
    const state = store.get();
    const queue = state.queue || [];
    if(!queue.length) return null;
    const throughput = computeThroughput();
    if(!throughput || throughput <= 0) return null;
    // naive: position of first item (0) => 0; assume user cares about last item (?) use queue length
    const minutes = queue.length / throughput;
    return Math.round(minutes);
  }

  function renderBadge(){
    let el = document.getElementById('qms-metrics-badge');
    if(!el){
      el = document.createElement('div');
      el.id = 'qms-metrics-badge';
      el.style.position='fixed'; el.style.top='6px'; el.style.left='6px'; el.style.padding='4px 8px';
      el.style.background='var(--color-accent)'; el.style.color='var(--color-text-invert)'; el.style.fontSize='11px';
      el.style.borderRadius='6px'; el.style.zIndex='9999'; el.style.opacity='0.85';
      document.body.appendChild(el);
    }
    const avg = api.averageLatency();
    const eta = computeETA();
    el.textContent = `lat: ${avg?avg+'ms':'-'} | ETA: ${eta?eta+'m':'?'}`;
  }

  // Subscribe
  store.subscribe('queue', q => { recordSize(q.length); store.set('eta', computeETA()); renderBadge(); });
  api.on('latency', renderBadge);

  // Initial
  renderBadge();
})(window);
