// EchoForge Background Service Worker - Phase 0

chrome.runtime.onInstalled.addListener(() => {
  console.log('%c[EchoForge] Extension installed/updated', 'color:#3b82f6');
});

// Listen for messages from popup or content scripts
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'exportConversation') {
    console.log('[EchoForge] Received export request', message);
    
    // In Phase 0 we just acknowledge. Real export logic will live in content script
    // or be coordinated here in later phases.
    sendResponse({ success: true, message: 'Export request received by background' });
    return true; // Keep channel open for async if needed later
  }

  if (message.action === 'log') {
    console.log('[EchoForge Content]', message.data);
  }
});
