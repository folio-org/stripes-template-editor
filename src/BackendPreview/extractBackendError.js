const EXCERPT_WINDOW = 45;

/**
 * Parses the preview endpoint's error body into { message, excerpt }.
 * Handlebars responses carry a source line plus a caret line, mustache only
 * the message; without a caret line the excerpt stays null. Sample responses
 * are in the test fixtures.
 */
const extractBackendError = async (err) => {
  const fallback = { message: err.message, excerpt: null };

  try {
    const body = await err.response?.text();

    if (!body) return fallback;

    let text;

    try {
      const json = JSON.parse(body);

      text = json.errors?.[0]?.message || json.message || body;
    } catch {
      text = body;
    }

    const lines = text.split(/\r?\n/);
    const message = lines[0].trim() || err.message;

    // From the end: a stray caret can sit in the quoted source above the real
    // one. Plain loop, findLastIndex is ES2023.
    let caretIndex = -1;

    for (let i = lines.length - 1; i > 0; i--) {
      if (/^\s*\^+\s*$/.test(lines[i])) {
        caretIndex = i;
        break;
      }
    }

    if (caretIndex < 1) return { message, excerpt: null };

    // Tabs would shift the caret against the rendered source.
    const sourceLine = lines[caretIndex - 1].replace(/\t/g, ' ');
    const caretCol = Math.min(lines[caretIndex].indexOf('^'), sourceLine.length);
    const start = Math.max(0, caretCol - EXCERPT_WINDOW);
    const end = Math.min(sourceLine.length, caretCol + EXCERPT_WINDOW);
    const prefix = start > 0 ? '…' : '';
    const suffix = end < sourceLine.length ? '…' : '';
    const excerptLine = prefix + sourceLine.slice(start, end) + suffix;
    const caretLine = ' '.repeat(prefix.length + (caretCol - start)) + '^';

    return { message, excerpt: `${excerptLine}\n${caretLine}` };
  } catch {
    return fallback;
  }
};

export default extractBackendError;
