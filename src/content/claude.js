// EchoForge Content Script for Claude.ai - Phase 0

console.log('%c[EchoForge] Claude content script loaded', 'color:#10b981');

function findConversationContainer() {
  // Common selectors for Claude chat (these may need updating as UI changes)
  const selectors = [
    '[data-testid="conversation"]', 
    '.conversation-container',
    'main[role="main"]', 
    '.chat-container',
    '[class*="chat"]'
  ];

  for (const selector of selectors) {
    const el = document.querySelector(selector);
    if (el) return el;
  }
  
  // Fallback: try to find the main chat area by looking for message bubbles
  const messages = document.querySelectorAll('[data-message-author-role], .message, [class*="Message"]');
  if (messages.length > 0) {
    return messages[0].closest('main') || messages[0].parentElement;
  }
  
  return null;
}

function extractBasicMessages(container) {
  // Very basic extraction for Phase 0 - will be greatly improved in Phase 1
  const messages = [];
  
  // Try common message selectors
  const messageElements = container.querySelectorAll(
    '[data-message-author-role], .message, [class*="Message"], [class*="message"]'
  );

  messageElements.forEach((el, index) => {
    const role = el.getAttribute('data-message-author-role') || 
                 (el.textContent.toLowerCase().includes('human') ? 'user' : 'assistant');
    
    const content = el.innerText?.trim() || el.textContent?.trim() || '';
    
    if (content.length > 5) {
      messages.push({
        role: role.includes('user') || role.includes('human') ? 'user' : 'assistant',
        content: content.substring(0, 2000), // truncate for Phase 0 safety
        index
      });
    }
  });

  return messages;
}

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'exportConversation') {
    console.log('[EchoForge] Export request received in content script');

    try {
      const container = findConversationContainer();
      
      if (!container) {
        sendResponse({ 
          success: false, 
          error: 'Could not find conversation container. The page may still be loading or the UI has changed.' 
        });
        return true;
      }

      const messages = extractBasicMessages(container);
      
      if (messages.length === 0) {
        sendResponse({ 
          success: false, 
          error: 'No messages found. Try scrolling or waiting for the chat to fully load.' 
        });
        return true;
      }

      // Phase 0: Just return basic data. Real export/download happens in later phases.
      const exportData = {
        platform: 'claude',
        url: window.location.href,
        title: document.title,
        exportedAt: new Date().toISOString(),
        messageCount: messages.length,
        messages: messages
      };

      console.log('[EchoForge] Extracted basic conversation data', exportData);

      // For Phase 0 we simulate success and log the data
      chrome.runtime.sendMessage({ action: 'log', data: exportData });

      sendResponse({ 
        success: true, 
        data: exportData,
        message: `Phase 0 stub: Found ${messages.length} messages. Full export engine coming in Phase 1.` 
      });

    } catch (err) {
      console.error('[EchoForge] Extraction error:', err);
      sendResponse({ success: false, error: err.message });
    }

    return true; // Keep message channel open
  }
});
