(function(global){
  const store = global.QMSStore;
  const api = global.QMSApiClient;
  let tapCount = 0; let tapTimer;

  function ensurePanel(){
    let panel = document.getElementById('qms-diagnostics');
    if(panel) return panel;
    panel = document.createElement('div');
    panel.id = 'qms-diagnostics';
    panel.style.position='fixed'; panel.style.top='50%'; panel.style.left='50%'; panel.style.transform='translate(-50%, -50%)';
    panel.style.background='var(--color-bg-alt)'; panel.style.color='var(--color-text)'; panel.style.padding='16px';
    panel.style.minWidth='260px'; panel.style.maxWidth='320px'; panel.style.border='1px solid var(--color-border)'; panel.style.borderRadius='12px'; panel.style.boxShadow='0 6px 24px rgba(0,0,0,0.25)';
    panel.style.zIndex='100000'; panel.style.fontSize='12px'; panel.style.display='none';
    panel.innerHTML='<div style="font-weight:bold;margin-bottom:6px;">Diagnostics</div><div id="qms-diag-body"></div><button id="qms-diag-close" style="margin-top:10px;width:100%;background:var(--color-accent);color:var(--color-text-invert);border:none;padding:6px 8px;border-radius:6px;cursor:pointer;">Close</button>';
    document.body.appendChild(panel);
    panel.querySelector('#qms-diag-close').addEventListener('click', ()=> panel.style.display='none');
    return panel;
  }

  function openPanel(){ const p=ensurePanel(); updateBody(); p.style.display='block'; }

  function updateBody(){
    const body = document.getElementById('qms-diag-body'); if(!body) return;
    const st = store.get();
    const avg = api.averageLatency();
    const snapshot = localStorage.getItem('qms-queue-snapshot');
    body.innerHTML = `
      <div><b>Online:</b> ${navigator.onLine}</div>
      <div><b>Queue Size:</b> ${st.queue.length}</div>
      <div><b>Last Updated:</b> ${st.lastUpdated? new Date(st.lastUpdated).toLocaleTimeString(): '-'}</div>
      <div><b>Avg Latency:</b> ${avg?avg+'ms':'-'}</div>
      <div><b>ETA:</b> ${st.eta? st.eta+'m':'?'}</div>
      <div><b>Snapshot Age:</b> ${snapshot? (()=>{ try{ const o=JSON.parse(snapshot); return Math.round((Date.now()-o.at)/1000)+'s'; }catch(e){ return '-'; } })(): '-'}</div>
      <div><b>Version Hash:</b> ${st.versionHash || '-'}</div>
    `;
  }

  // Trigger: 5 taps on metrics badge
  document.addEventListener('click', (e)=>{
    const target = e.target;
    if(target && target.id === 'qms-metrics-badge'){
      tapCount++; clearTimeout(tapTimer);
      tapTimer = setTimeout(()=>{ tapCount=0; }, 1200);
      if(tapCount >= 5){ tapCount=0; openPanel(); }
    }
  });

  // Update diagnostics live
  store.subscribe('queue', updateBody);
  store.subscribe('eta', updateBody);
  store.subscribe('network', updateBody);
  api.on('latency', updateBody);

})(window);
