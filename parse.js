// SPDX-License-Identifier: MIT
// Default-only entry point. The attributed marked fork remains the grammar authority.
import { marked, Lexer } from './vendor/marked/marked.esm.js';

const tokenizeInline = Lexer.prototype.inlineTokens;
// Exclude every inline delimiter, entity, line break, and possible URL/email trigger.
// This deliberately admits less than marked's text grammar, making the fallback safe.
const needsInlineGrammar = /[\\`*_[\]<>!~&\n\r:@.]/;
Lexer.prototype.inlineTokens = function (source, tokens = []) {
  if (source && !needsInlineGrammar.test(source)) {
    this.tokenizer.lexer = this;
    const previous = tokens.at(-1);
    if (previous?.type === 'text') {
      previous.raw += source;
      previous.text += source;
    } else {
      tokens.push({ type: 'text', raw: source, text: source, escaped: this.state.inRawBlock });
    }
    return tokens;
  }
  return tokenizeInline.call(this, source, tokens);
};

export function parse(markdown) {
  return marked.parse(markdown);
}
