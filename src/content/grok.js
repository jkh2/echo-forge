// EchoForge Content Script for Grok - Real Support

console.log('%c[EchoForge] Grok content script loaded', 'color:#3b82f6');

function findConversationContainer() {
  // Grok's current DOM structure (as of mid-2026)
  const selectors = [
    'main[role="main"]',
    '[data-testid="chat-messages"]',
    '.chat-messages',
    'div[role="log"]',
    'main'
  ];

  for (const selector of selectors) {
    const el = document.querySelector(selector);
    if (el && (el.querySelector('[data-message-author]') || el.querySelector('.message'))) {
      return el;
    }
  }

  // Fallback: look for message-like elements
  const messages = document.querySelectorAll('[data-message-author], .message, [class*="Message"]');
  if (messages.length > 0) {
    return messages[0].closest('main') || messages[0].parentElement?.parentElement || document.body;
  }

  return null;
}

function extractMessages(container) {
  const messages = [];
  
  // Grok often uses data-message-author or similar
  const messageElements = container.querySelectorAll(
    '[data-message-author], .message, [class*="Message"], [class*="message"]'
  );

  messageElements.forEach((el, index) => {
    let role = 'assistant';
    
    // Determine role
    const authorAttr = el.getAttribute('data-message-author');
    if (authorAttr) {
      role = authorAttr.toLowerCase().includes('user') ? 'user' : 'assistant';
    } else if (el.className.toLowerCase().includes('user')) {
      role = 'user';
    } else if (el.querySelector('[class*="user"], [data-role="user"]')) {
      role = 'user';
    }

    // Get content
    let contentEl = el.querySelector('.prose, [class*="prose"], .message-content, .markdown') || el;
    let content = contentEl.innerText?.trim() || el.innerText?.trim() || '';

    // Clean content
    content = content.replace(/\n{3,}/g, '\n\n').trim();

    if (content.length > 10) {
      messages.push({
        role,
        content,
        index,
        timestamp: new Date().toISOString()
      });
    }
  });

  return messages;
}

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'exportConversation') {
    console.log('[EchoForge] Export request received for Grok');

    try {
      const container = findConversationContainer();

      if (!container) {
        sendResponse({
          success: false,
          error: 'Could not find Grok conversation container. Try scrolling down or refreshing.'
        });
        return true;
      }

      const messages = extractMessages(container);

      if (messages.length === 0) {
        sendResponse({
          success: false,
          error: 'No messages found in this Grok conversation.'
        });
        return true;
      }

      const exportData = {
        platform: 'grok',
        url: window.location.href,
        title: document.title.replace(' | Grok', '').trim(),
        exportedAt: new Date().toISOString(),
        messageCount: messages.length,
        messages: messages
      };

      console.log(`[EchoForge] Extracted ${messages.length} messages from Grok`);

      sendResponse({
        success: true,
        data: exportData
      });

    } catch (err) {
      console.error('[EchoForge] Grok extraction error:', err);
      sendResponse({
        success: false,
        error: err.message || 'Unknown error extracting Grok conversation'
      });
    }

    return true;
  }
});
