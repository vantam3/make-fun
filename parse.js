// SPDX-License-Identifier: MIT
// Default-only rendering with the Marked 18.1.3 lexer and exact fallback.
import { Lexer, Parser, marked } from './vendor/marked/marked.esm.js';

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
    renderer: null,
    silent: false,
    tokenizer: null,
    walkTokens: null,
  };
  try {
    const tokens = new FastLexer(options).lex(markdown);
    return Parser.parse(tokens, options);
  } catch {
    // The extra inline wrapper can reach the engine's recursion limit sooner.
    // Retry the untouched default pipeline, preserving its result or error.
    return marked.parse(markdown);
  }
}
