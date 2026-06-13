// EchoForge Content Script for Claude.ai - Phase 1 (Core Export)

console.log('%c[EchoForge] Claude content script loaded (Phase 1)', 'color:#10b981');

function findConversationContainer() {
  // More robust selectors for Claude (updated for current UI)
  const selectors = [
    'main[role="main"]',
    '[data-testid="conversation"]',
    '.chat-container',
    'div[role="region"]',
    'main'
  ];

  for (const selector of selectors) {
    const el = document.querySelector(selector);
    if (el && el.querySelector('[data-message-author-role]')) {
      return el;
    }
  }
  
  // Fallback: find by message elements
  const messages = document.querySelectorAll('[data-message-author-role]');
  if (messages.length > 0) {
    return messages[0].closest('main') || messages[0].parentElement?.parentElement || document.body;
  }
  
  return null;
}

function extractMessages(container) {
  const messages = [];
  const messageElements = container.querySelectorAll('[data-message-author-role]');
  
  messageElements.forEach((el, index) => {
    const roleAttr = el.getAttribute('data-message-author-role');
    const role = (roleAttr === 'user' || roleAttr === 'human') ? 'user' : 'assistant';
    
    // Get the main content area (Claude often has nested divs)
    let contentEl = el.querySelector('.prose, [class*="prose"], .message-content') || el;
    let content = contentEl.innerText?.trim() || el.innerText?.trim() || '';
    
    // Clean up common artifacts
    content = content
      .replace(/\n{3,}/g, '\n\n')           // Collapse excessive newlines
      .replace(/^\s+|\s+$/g, '');           // Trim
    
    if (content.length > 10) {
      messages.push({
        role,
        content,
        index,
        timestamp: new Date().toISOString() // Placeholder; can improve later
      });
    }
  });
  
  return messages;
}

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'exportConversation') {
    console.log('[EchoForge] Export request received in content script (Phase 1)');

    try {
      const container = findConversationContainer();
      
      if (!container) {
        sendResponse({ 
          success: false, 
          error: 'Could not find conversation container. Try scrolling or refreshing the page.' 
        });
        return true;
      }

      const messages = extractMessages(container);
      
      if (messages.length === 0) {
        sendResponse({ 
          success: false, 
          error: 'No messages found. Make sure the conversation is fully loaded.' 
        });
        return true;
      }

      // Build clean export data
      const exportData = {
        platform: 'claude',
        url: window.location.href,
        title: document.title.replace(' | Claude', '').trim(),
        exportedAt: new Date().toISOString(),
        messageCount: messages.length,
        messages: messages
      };

      console.log(`[EchoForge] Extracted ${messages.length} messages from Claude`);
      
      sendResponse({ 
        success: true, 
        data: exportData 
      });

    } catch (err) {
      console.error('[EchoForge] Extraction error:', err);
      sendResponse({ 
        success: false, 
        error: err.message || 'Unknown error during extraction' 
      });
    }

    return true; // Keep message channel open
  }
});
