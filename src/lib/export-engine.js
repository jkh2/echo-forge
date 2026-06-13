// EchoForge Export Engine - Phase 1

/**
 * Generates clean Markdown with YAML frontmatter from export data
 */
export function generateMarkdown(data) {
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
    
    // Add separator between messages (except last)
    if (i < messages.length - 1) {
      md += '\n---\n';
    }
  });

  return md.trim();
}

/**
 * Generates structured JSON export
 */
export function generateJSON(data) {
  return JSON.stringify(data, null, 2);
}

/**
 * Triggers a file download in the browser
 */
export function downloadFile(content, filename, mimeType = 'text/plain') {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
