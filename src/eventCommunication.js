// Event communication with parent window
function setupEventCommunication() {
  function notifyParent(eventType) {
    if (window.parent && window.parent.postMessage) {
      window.parent.postMessage({ type: eventType }, '*');
    }
  }

  document.addEventListener('keydown', () => {
    notifyParent('keypress');
  });

  let lastClickTime = 0;
  const clickDelay = 300; // ms
  
  document.addEventListener('click', (e) => {
    const now = Date.now();
    // Only send the event if it's not part of a double-click sequence
    if (now - lastClickTime > clickDelay) {
      notifyParent('mouseclick');
    }
    lastClickTime = now;
  }, true);

  document.addEventListener('dblclick', (e) => {

    lastClickTime = Date.now();
    notifyParent('mouseclick');
  }, true);
}

document.addEventListener('DOMContentLoaded', setupEventCommunication); 