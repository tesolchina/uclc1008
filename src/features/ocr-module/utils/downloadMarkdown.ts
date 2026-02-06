/**
 * Generate markdown content with metadata header
 */
export function generateMarkdownContent(text: string, title?: string): string {
  const now = new Date();
  const dateStr = now.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
  const timeStr = now.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
  });

  const header = title ? `# ${title}` : '# OCR Extracted Text';

  return `${header}

> Extracted on: ${dateStr} at ${timeStr}

---

${text}
`;
}

/**
 * Generate a safe filename from title or default
 */
function generateFilename(title?: string): string {
  const timestamp = new Date().toISOString().slice(0, 10);
  
  if (title) {
    // Sanitize title for filename
    const sanitized = title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .slice(0, 50);
    return `${sanitized}-${timestamp}.md`;
  }
  
  return `ocr-extract-${timestamp}.md`;
}

/**
 * Download text content as a markdown file
 */
export function downloadMarkdown(text: string, title?: string): void {
  const content = generateMarkdownContent(text, title);
  const filename = generateFilename(title);
  
  const blob = new Blob([content], { type: 'text/markdown;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  
  URL.revokeObjectURL(url);
}

/**
 * Copy text to clipboard
 */
export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (error) {
    console.error('Failed to copy to clipboard:', error);
    return false;
  }
}
