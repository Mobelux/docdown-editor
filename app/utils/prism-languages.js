import Prism from 'prismjs';
import 'prismjs/components/prism-markdown';
import 'prismjs/components/prism-json';
import 'prismjs/components/prism-css';
import 'prismjs/components/prism-javascript';
import 'prismjs/components/prism-clike';
import 'prismjs/components/prism-java';
import 'prismjs/components/prism-c';
import 'prismjs/components/prism-cpp';
import 'prismjs/components/prism-swift';
import 'prismjs/components/prism-objectivec';

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
