// SPDX-License-Identifier: MIT
// Default-only rendering with the Marked 18.1.3 lexer and exact fallback.
import { Lexer, Parser, Renderer, marked } from './vendor/marked/marked.esm.js';

// Render ordinary text without the regular-expression callback and lookup
// used by the general renderer. Entity recognition remains Marked's grammar.
const unsafe = /[<>"']|&(?!(#\d{1,7}|#[Xx][a-fA-F0-9]{1,6}|\w+);)/g;
const encoded = /[&<>"']/g;
function escapeHTML(text, encode = false) {
  const pattern = encode ? encoded : unsafe;
  pattern.lastIndex = 0;
  let match = pattern.exec(text);
  if (match === null) return text;
  let output = '';
  let start = 0;
  do {
    const at = match.index;
    output += text.slice(start, at);
    switch (text.charCodeAt(at)) {
      case 38: output += '&amp;'; break;
      case 60: output += '&lt;'; break;
      case 62: output += '&gt;'; break;
      case 34: output += '&quot;'; break;
      case 39: output += '&#39;'; break;
    }
    start = at + 1;
    match = pattern.exec(text);
  } while (match !== null);
  return output + text.slice(start);
}

class DefaultRenderer extends Renderer {
  text(token) {
    if (token.tokens) return this.parser.parseInline(token.tokens);
    return token.escaped ? token.text : escapeHTML(token.text);
  }

  codespan(token) {
    return '<code>' + escapeHTML(token.text, true) + '</code>';
  }

  code(token) {
    const language = (token.lang || '').match(/^\S*/)?.[0];
    let body = token.text;
    if (body) {
      if (body.endsWith('\n')) body = body.slice(0, -1);
      body += '\n';
    }
    const opening = language
      ? '<pre><code class="language-' + escapeHTML(language) + '">'
      : '<pre><code>';
    return opening + (token.escaped ? body : escapeHTML(body, true)) + '</code></pre>\n';
  }
}

export function parse(markdown) {
  // Preserve Marked's validation and its error suffix for non-string calls.
  if (typeof markdown !== 'string') return marked.parse(markdown);
  const options = {
    async: false,
    breaks: false,
    extensions: null,
    gfm: true,
    hooks: null,
    pedantic: false,
    renderer: new DefaultRenderer(),
    silent: false,
    tokenizer: null,
    walkTokens: null,
  };
  try {
    const tokens = Lexer.lex(markdown, options);
    return Parser.parse(tokens, options);
  } catch (error) {
    error.message += '\nPlease report this to https://github.com/markedjs/marked.';
    throw error;
  }
}
