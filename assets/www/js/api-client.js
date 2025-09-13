(function(global){
  const LATENCY_HISTORY_LIMIT = 50;
  const listeners = { latency: [], error: [], request: [], response: [] };
  const latencyHistory = [];

  function emit(type, payload){ (listeners[type]||[]).forEach(fn=>{ try{ fn(payload); }catch(e){} }); }
  function on(type, fn){ if(listeners[type]) listeners[type].push(fn); return ()=>{ const i=listeners[type].indexOf(fn); if(i>-1) listeners[type].splice(i,1); }; }

  function averageLatency(){ if(!latencyHistory.length) return null; return Math.round(latencyHistory.reduce((a,b)=>a+b,0)/latencyHistory.length); }

  async function apiFetch(path, { method='GET', headers={}, body, timeout=8000, retries=2, retryDelayBase=400, retryOn=[408,429,500,502,503,504] }={}){
    const url = path; // path expected absolute or relative
    let attempt = 0;
    let lastErr;
    while(attempt <= retries){
      const start = performance.now();
      const controller = new AbortController();
      const to = setTimeout(()=> controller.abort(), timeout);
      emit('request',{ url, method, attempt });
      try{
        const resp = await fetch(url, { method, headers, body: body && typeof body !== 'string' ? JSON.stringify(body) : body, signal: controller.signal });
        clearTimeout(to);
        const dur = performance.now() - start;
        latencyHistory.push(dur); if(latencyHistory.length>LATENCY_HISTORY_LIMIT) latencyHistory.shift();
        emit('latency',{ url, ms: dur, avg: averageLatency() });
        if(!resp.ok){
          if(retryOn.includes(resp.status) && attempt < retries){
            const delay = retryDelayBase * Math.pow(2, attempt);
            await new Promise(r=>setTimeout(r, delay));
            attempt++; continue;
          }
          const text = await resp.text().catch(()=>"<no body>");
          const error = { type:'http', status:resp.status, body:text, url };
          emit('error', error);
          return { ok:false, status:resp.status, error, data:null, duration:dur };
        }
        let data=null; const ct = resp.headers.get('content-type')||'';
        if(ct.includes('application/json')){ data = await resp.json().catch(()=>null); } else { data = await resp.text(); }
        const result = { ok:true, status:resp.status, data, duration:dur };
        emit('response', result);
        return result;
      }catch(e){
        clearTimeout(to);
        lastErr = e.name === 'AbortError' ? { type:'timeout', url } : { type:'network', error:e, url };
        emit('error', lastErr);
        if(attempt < retries){
          const delay = retryDelayBase * Math.pow(2, attempt);
          await new Promise(r=>setTimeout(r, delay));
          attempt++; continue;
        }
        return { ok:false, status:null, error:lastErr, data:null, duration:null };
      }
    }
    return { ok:false, status:null, error:lastErr, data:null, duration:null };
  }

  global.QMSApiClient = { fetch: apiFetch, on, averageLatency };
})(window);
