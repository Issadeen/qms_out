(function(global){
  const store = global.QMSStore;
  let previousIds = new Set();
  function onQueueChange(queue){
    const newIds = new Set(queue.map(i=>i.id));
    queue.forEach(item => {
      if(previousIds.has(item.id)) return;
      // Attempt to locate an element with data-id
      const el = document.querySelector(`[data-queue-id="${item.id}"]`);
      if(el){
        el.classList.add('diff-flash');
        setTimeout(()=> el.classList.remove('diff-flash'), 1400);
      }
    });
    previousIds = newIds;
    const live = document.getElementById('qms-live-region');
    if(live){ live.textContent = `Queue updated. ${queue.length} items.`; }
  }
  store.subscribe('queue', onQueueChange);
})(window);
