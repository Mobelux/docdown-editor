import Immutable from 'immutable';
import Prism from 'prismjs';

import PrismOptions from './PrismOptions';

var KEY_SEPARATOR = '-';

export default class PrismDecorator {
  constructor(options) {
    this.options = PrismOptions(options || {});
    this.highlighted = {};
  }

  getDecorations(block) {
    const getSyntax = this.options.get('getSyntax');
    const blockKey = block.getKey();
    const blockText = block.getText();
    let offset = 0;
    let decorations = Array(blockText.length).fill(null);

    this.highlighted[blockKey] = {};

    var syntax = getSyntax(block) || this.options.get('defaultSyntax');

    // Parse text using Prism
    var grammar = Prism.languages[syntax];
    const tokens = Prism.tokenize(blockText, grammar);

    tokens.forEach((token) => {
      if (typeof token === 'string') {
        offset += token.length;
      } else {
        const tokenId = `tok${offset}`;
        const resultId = `${blockKey}-${tokenId}`;

        this.highlighted[blockKey][tokenId] = token;

        occupySlice(decorations, offset, offset + token.length, resultId);
        offset += token.length;
      }
    });

    return Immutable.List(decorations);
  }

  getComponentForKey(key) {
    return this.options.render;
  }

  getPropsForKey(key) {
    const [blockKey, tokId] = key.split('-');
    const token = this.highlighted[blockKey][tokId];

    return {
      type: token.type,
      alias: token.alias || ''
    };
  }
}

function occupySlice(targetArr, start, end, componentKey) {
    for (var ii = start; ii < end; ii++) {
        targetArr[ii] = componentKey;
    }
}
