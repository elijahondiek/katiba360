/**
 * Process content to handle key terms and other formatting
 * @param content The raw content string
 * @returns Processed HTML content
 */
export function processContent(content: string): string {
  if (!content) return '';
  
  // Replace key terms with span elements
  // Format: [term:definition]
  const keyTermRegex = /\[([^\]]+):([^\]]+)\]/g;
  const processedContent = content.replace(
    keyTermRegex,
    (match, term, definition) => {
      return `<span class="key-term" data-definition="${definition}">${term}</span>`;
    }
  );
  
  // Add paragraph tags if needed
  let finalContent = processedContent;
  if (!finalContent.includes('<p>')) {
    finalContent = `<p>${finalContent}</p>`;
  }
  
  return finalContent;
}
