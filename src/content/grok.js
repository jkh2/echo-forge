// EchoForge Content Script for Grok - Phase 0 (stub)

console.log('%c[EchoForge] Grok content script loaded', 'color:#3b82f6');

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'exportConversation') {
    // Placeholder - full implementation in Phase 1
    sendResponse({ 
      success: false, 
      error: 'Grok support is in active development. Full parser coming in Phase 1.' 
    });
    return true;
  }
});
