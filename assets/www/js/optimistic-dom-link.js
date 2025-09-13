(function(){
  const CARD_SELECTOR = 'ion-card.qcard';
  function extractIdFromHeader(card){
    const header = card.querySelector('ion-card-header');
    if(!header) return null;
    const m = header.textContent.match(/Queue\s*No\.\s*(\d+)/i);
    return m ? m[1] : null;
  }
  function annotate(){
    document.querySelectorAll(CARD_SELECTOR).forEach(card => {
      if(card.dataset.queueId) return;
      const id = extractIdFromHeader(card);
      if(id){ card.dataset.queueId = id; }
    });
  }

  function ensureOptimisticPlaceholders(){
    if(!window.store) return; // store.js not ready yet
    const state = window.store.get();
    if(!state || !Array.isArray(state.queue)) return;
    const optimisticItems = state.queue.filter(it => it.__optimistic);
    const container = document.querySelector('ion-content .scroll-content, ion-content, .content');
    if(!container) return;
    optimisticItems.forEach(item => {
      const id = item.id;
      if(!id) return;
      const existingReal = document.querySelector(`ion-card.qcard[data-queue-id="${CSS.escape(id)}"]:not(.optimistic-pending)`);
      if(existingReal){
        const ph = document.querySelector(`ion-card.qcard.optimistic-pending[data-queue-id="${CSS.escape(id)}"]`);
        if(ph) ph.remove();
        return;
      }
      let placeholder = document.querySelector(`ion-card.qcard.optimistic-pending[data-queue-id="${CSS.escape(id)}"]`);
      if(!placeholder){
        placeholder = document.createElement('ion-card');
        placeholder.className = 'qcard optimistic-pending';
        placeholder.dataset.queueId = id;
        placeholder.innerHTML = `
          <ion-card-header>Pending Queue (temp)</ion-card-header>
          <ion-card-content>
            <div class="optimistic-meta">Submitting…</div>
            <div class="optimistic-spinner"></div>
          </ion-card-content>
        `;
        container.prepend(placeholder);
      }
    });
    document.querySelectorAll('ion-card.qcard.optimistic-pending').forEach(ph => {
      const id = ph.dataset.queueId;
      if(!optimisticItems.find(it => it.id === id)) ph.remove();
    });
  }

  function tick(){
    annotate();
    ensureOptimisticPlaceholders();
  }
  setInterval(tick, 1500);
})();
