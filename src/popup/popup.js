// EchoForge Popup Script - Phase 1 (Real Export)

function updateStatus(message, type = 'info') {
  const statusEl = document.getElementById('status');
  if (!statusEl) return;
  
  statusEl.className = `mb-4 px-3 py-2 rounded-lg text-sm flex items-center gap-2 ${
    type === 'success' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
    type === 'error' ? 'bg-red-500/10 text-red-400 border border-red-500/20' :
    'bg-zinc-800 text-zinc-400 border border-zinc-700'
  }`;
  statusEl.innerHTML = `<span class="font-medium">${message}</span>`;
  statusEl.classList.remove('hidden');
  
  setTimeout(() => {
    if (statusEl) statusEl.classList.add('hidden');
  }, 5000);
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

    const exportBtn = document.getElementById('export-btn');
    const supported = ['claude.ai', 'grok.x.ai', 'grok.com'].some(domain => tab.url.includes(domain));
    exportBtn.disabled = !supported;

    if (!supported) {
      updateStatus('This site is not yet supported in Phase 1', 'error');
    }
  });
}

// Simple Markdown generator (inline for Phase 1)
function generateMarkdown(data) {
  const { title, platform, exportedAt, messageCount, messages, url } = data;
  
  let md = `---
  title: "${title || 'Untitled Conversation'}"
  platform: "${platform}"
  exported_at: "${exportedAt}"
  message_count: ${messageCount}
  source_url: "${url}"
  ---

  # ${title || 'Untitled Conversation'}

  *Exported from ${platform} on ${new Date(exportedAt).toLocaleString()}*

  `;

  messages.forEach((msg, i) => {
    const roleLabel = msg.role === 'user' ? '**You**' : '**Assistant**';
    md += `\n\n${roleLabel}:\n\n${msg.content}\n`;
    
    if (i < messages.length - 1) {
      md += '\n---\n';
    }
  });

  return md.trim();
}

async function triggerExport() {
  const exportBtn = document.getElementById('export-btn');
  const originalHTML = exportBtn.innerHTML;
  
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
    
    if (!tab || !tab.id) throw new Error('No active tab found');

    // Request data from content script
    const response = await chrome.tabs.sendMessage(tab.id, { 
      action: 'exportConversation' 
    });

    if (!response || !response.success) {
      throw new Error(response?.error || 'Failed to extract conversation');
    }

    const data = response.data;

    // Generate Markdown
    const markdown = generateMarkdown(data);
    const filenameBase = (data.title || 'conversation').replace(/[^a-z0-9]/gi, '_').toLowerCase();

    // Download Markdown
    const blob = new Blob([markdown], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    
    await chrome.downloads.download({
      url: url,
      filename: `${filenameBase}.md`,
      saveAs: false
    });

    // Also offer JSON (optional second download)
    const jsonBlob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const jsonUrl = URL.createObjectURL(jsonBlob);
    
    await chrome.downloads.download({
      url: jsonUrl,
      filename: `${filenameBase}.json`,
      saveAs: false
    });

    updateStatus(`Exported ${data.messageCount} messages successfully!`, 'success');

  } catch (err) {
    console.error('EchoForge export error:', err);
    updateStatus(`Export failed: ${err.message}`, 'error');
  } finally {
    exportBtn.disabled = false;
    exportBtn.innerHTML = originalHTML;
  }
}

function init() {
  detectCurrentSite();

  const exportBtn = document.getElementById('export-btn');
  exportBtn.addEventListener('click', triggerExport);

  // Placeholder buttons
  document.getElementById('copy-md-btn').addEventListener('click', () => {
    updateStatus('Copy to clipboard coming soon in Phase 2', 'info');
  });

  document.getElementById('settings-btn').addEventListener('click', () => {
    chrome.runtime.openOptionsPage();
  });

  console.log('%c[EchoForge] Popup initialized (Phase 1)', 'color:#64748b');
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
