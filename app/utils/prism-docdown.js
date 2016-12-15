import Prism from 'prismjs';
import 'prismjs/components/prism-markdown';

Prism.languages.docdown = Prism.languages.extend('markdown', {});

Prism.languages.insertBefore('docdown', 'prolog', {
  code: [
    ...Prism.languages.markdown.code,
    {
      // Code between ``` blocks
      pattern: /^`{3}(.|\n|\r)+`{3}/m
    }
  ],
  includes: {
    pattern: /^\+{3}.+$/m
  },
  noteblock: {
    pattern: /^!{3}(.|\n|\r)+!{3}/m
  },
  sequenceblock: {
    pattern: /^\|{3}(.|\n|\r)+\|{3}/m
  }
});
