// EchoForge Popup Script - Phase 0

const tailwindScript = document.createElement('script');
tailwindScript.src = 'https://cdn.tailwindcss.com';
document.head.appendChild(tailwindScript);

tailwindScript.onload = () => {
  // Tailwind already included via CDN in HTML, this is just in case
};

function updateStatus(message, type = 'info') {
  const statusEl = document.getElementById('status');
  statusEl.className = `mb-4 px-3 py-2 rounded-lg text-sm flex items-center gap-2 ${
    type === 'success' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
    type === 'error' ? 'bg-red-500/10 text-red-400 border border-red-500/20' :
    'bg-zinc-800 text-zinc-400 border border-zinc-700'
  }`;
  statusEl.innerHTML = `
    <span class="font-medium">${message}</span>
  `;
  statusEl.classList.remove('hidden');
  setTimeout(() => {
    if (statusEl) statusEl.classList.add('hidden');
  }, 4000);
}

function detectCurrentSite() {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    const tab = tabs[0];
    const siteEl = document.getElementById('current-site');
    
    if (!tab || !tab.url) {
      siteEl.textContent = 'No active tab';
      siteEl.className = 'text-sm font-mono text-red-400';
      return;
    }

    let siteName = 'Unknown site';
    if (tab.url.includes('claude.ai')) siteName = 'Claude';
    else if (tab.url.includes('grok.x.ai') || tab.url.includes('grok.com')) siteName = 'Grok';
    else if (tab.url.includes('chatgpt.com')) siteName = 'ChatGPT';
    else if (tab.url.includes('gemini.google.com')) siteName = 'Gemini';
    else if (tab.url.includes('perplexity.ai')) siteName = 'Perplexity';
    else if (tab.url.includes('deepseek.com')) siteName = 'DeepSeek';

    siteEl.textContent = siteName;
    siteEl.className = 'text-sm font-mono text-emerald-400';

    // Enable/disable export button based on supported site
    const exportBtn = document.getElementById('export-btn');
    const supported = ['claude.ai', 'grok.x.ai', 'grok.com', 'chatgpt.com'].some(domain => tab.url.includes(domain));
    exportBtn.disabled = !supported;

    if (!supported) {
      updateStatus('This site is not yet supported', 'error');
    }
  });
}

async function triggerExport() {
  const exportBtn = document.getElementById('export-btn');
  const originalText = exportBtn.innerHTML;
  
  exportBtn.disabled = true;
  exportBtn.innerHTML = `
    <svg class="animate-spin w-5 h-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
      <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
      <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
    </svg>
    <span>Exporting...</span>
  `;

  try {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    
    if (!tab || !tab.id) throw new Error('No active tab');

    // Send message to content script
    const response = await chrome.tabs.sendMessage(tab.id, { 
      action: 'exportConversation',
      format: 'markdown' // default for Phase 0
    });

    if (response && response.success) {
      updateStatus('Export started! Check downloads.', 'success');
    } else {
      throw new Error(response?.error || 'Export failed');
    }
  } catch (err) {
    console.error('EchoForge export error:', err);
    updateStatus(`Export failed: ${err.message}`, 'error');
  } finally {
    exportBtn.disabled = false;
    exportBtn.innerHTML = originalText;
  }
}

function init() {
  // Detect current site
  detectCurrentSite();

  // Export button
  document.getElementById('export-btn').addEventListener('click', triggerExport);

  // Copy MD button (placeholder for Phase 0)
  document.getElementById('copy-md-btn').addEventListener('click', () => {
    updateStatus('Copy to clipboard coming in Phase 1', 'info');
  });

  // Settings button
  document.getElementById('settings-btn').addEventListener('click', () => {
    chrome.runtime.openOptionsPage();
  });

  // Keyboard shortcut hint
  console.log('%c[EchoForge] Popup initialized', 'color:#64748b');
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
