// EchoForge Content Script for Claude.ai - Phase 2 (Solid Artifact Support)

console.log('%c[EchoForge] Claude content script loaded (Phase 2)', 'color:#10b981');

function findConversationContainer() {
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
    
    let contentEl = el.querySelector('.prose, [class*="prose"], .message-content') || el;
    let content = contentEl.innerText?.trim() || el.innerText?.trim() || '';
    
    content = content.replace(/\n{3,}/g, '\n\n').replace(/^\s+|\s+$/g, '');
    
    // === Phase 2: Extract Artifacts ===
    const artifacts = [];
    
    // Look for artifact containers (Claude's current structure)
    const artifactContainers = el.querySelectorAll(
      '[class*="Artifact"], [data-testid*="artifact"], [class*="artifact"], .artifact'
    );
    
    artifactContainers.forEach((artEl, artIdx) => {
      // Try to get a meaningful title
      let title = artEl.querySelector('h3, [class*="title"], [class*="header"], [class*="name"]')?.innerText?.trim();
      if (!title) {
        title = `Artifact ${artIdx + 1}`;
      }
      
      // Determine type if available
      const type = artEl.getAttribute('data-artifact-type') 
                || artEl.getAttribute('data-type') 
                || 'code';
      
      // Extract the main content (code is most common and valuable)
      let artifactContent = '';
      
      // Priority: code blocks, then textareas, then general text
      const codeEl = artEl.querySelector('pre code, code, textarea, .cm-content, [class*="CodeMirror"]');
      if (codeEl) {
        artifactContent = codeEl.innerText?.trim() || codeEl.value?.trim() || '';
      } else {
        artifactContent = artEl.innerText?.trim() || '';
      }
      
      // Also try to capture any Mermaid or diagram data if present
      const mermaidEl = artEl.querySelector('[class*="mermaid"], script[type="text/mermaid"]');
      if (mermaidEl) {
        artifactContent = mermaidEl.innerText?.trim() || artifactContent;
      }
      
      if (artifactContent.length > 8) {
        artifacts.push({
          title: title.substring(0, 120),
          type: type.toLowerCase(),
          content: artifactContent.substring(0, 12000) // generous cap
        });
      }
    });
    
    if (content.length > 8 || artifacts.length > 0) {
      messages.push({
        role,
        content,
        artifacts,
        index,
        timestamp: new Date().toISOString()
      });
    }
  });
  
  return messages;
}

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'exportConversation') {
    console.log('[EchoForge] Export request received (Phase 2)');

    try {
      const container = findConversationContainer();
      
      if (!container) {
        sendResponse({ success: false, error: 'Could not find conversation container.' });
        return true;
      }

      const messages = extractMessages(container);
      
      if (messages.length === 0) {
        sendResponse({ success: false, error: 'No messages found.' });
        return true;
      }

      const exportData = {
        platform: 'claude',
        url: window.location.href,
        title: document.title.replace(' | Claude', '').trim(),
        exportedAt: new Date().toISOString(),
        messageCount: messages.length,
        messages: messages
      };

      const totalArtifacts = messages.reduce((sum, m) => sum + (m.artifacts?.length || 0), 0);
      console.log(`[EchoForge] Extracted ${messages.length} messages + ${totalArtifacts} artifacts`);

      sendResponse({ success: true, data: exportData });

    } catch (err) {
      console.error('[EchoForge] Extraction error:', err);
      sendResponse({ success: false, error: err.message });
    }

    return true;
  }
});
