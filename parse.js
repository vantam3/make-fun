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

// A deliberately narrow alphabet makes this independent of link and delimiter
// state. Excluding dots, colons and at-signs rules out GFM URL/email matches;
// excluding ampersands also rules out numeric-reference decoding.
const inlineSyntax = /[\\<!\[`*_~&\n.:@]/;
// The expensive email lookaheads cannot match a string without an at-sign.
// Keep all other GFM boundaries, including the partial HTTP prefix boundary.
const noEmailText = /^(?:[^a-zA-Z0-9](?=(?:mailto|xmpp):)|(`+|~+|[^`~])(?:(?=[`~])|(?= {2,}\n)|[\s\S]*?(?:(?=[\\<!\[`*~_]|\b_|[hH][tT][tT][pP][sS]?|[fF][tT][pP]:\/\/|(?<![^\s*_~(])www\.|$)|[^ ](?= {2,}\n)|[^a-zA-Z0-9](?=(?:mailto|xmpp):))))/;
class FastLexer extends Lexer {
  constructor(options) {
    super(options);
    this.fullInline = this.tokenizer.rules.inline;
    this.noEmailInline = { ...this.fullInline, text: noEmailText };
  }

  inlineTokens(source, tokens = []) {
    if (!source || inlineSyntax.test(source)) {
      const rules = this.tokenizer.rules;
      const saved = rules.inline;
      rules.inline = source.includes('@') ? this.fullInline : this.noEmailInline;
      try {
        return super.inlineTokens(source, tokens);
      } finally {
        rules.inline = saved;
      }
    }
    const previous = tokens[tokens.length - 1];
    if (previous?.type === 'text') {
      previous.raw += source;
      previous.text += source;
    } else {
      tokens.push({
        type: 'text',
        raw: source,
        text: source,
        escaped: this.state.inRawBlock,
      });
    }
    return tokens;
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
    const tokens = new FastLexer(options).lex(markdown);
    return Parser.parse(tokens, options);
  } catch (error) {
    error.message += '\nPlease report this to https://github.com/markedjs/marked.';
    throw error;
  }
}
