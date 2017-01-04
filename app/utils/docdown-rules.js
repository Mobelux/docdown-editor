/* global ace */
ace.define(
  'ace/mode/docdown_hightlight_rules',
  ['require', 'exports', 'module', 'ace/mode/markdown_highlight_rules', 'ace/lib/oop', 'ace/lib/lang'],
  (acequire, exports) => {
    const oop = acequire('ace/lib/oop');
    const lang = acequire('ace/lib/lang');
    const MarkdownHighlightRules = acequire('ace/mode/markdown_highlight_rules').MarkdownHighlightRules;

    function escaped(ch) {
      return `(?:[^${lang.escapeRegExp(ch)}\\\\]|\\\\.)*`;
    }

    const DocdownHighlightRules = () => {
      MarkdownHighlightRules.call(this);
      // regexp must not have capturing parentheses
      // regexps are ordered -> the first match is used

      this.$rules.code.unshift({ token: 'code', regex: /^`{3}(.|\n|\r)+`{3}/m });

      this.addRules({
        includes: [
          { token: 'includes', regex: /^\+{3}.+$/m }
        ],
        noteblock: [
          { token: 'noteblock', regex: /^!{3}(.|\n|\r)+!{3}/m }
        ],
        sequenceblock: [
          { token: 'sequenceblock', regex: /^\|{3}(.|\n|\r)+\|{3}/m }
        ]
      });

      this.normalizeRules();
    };
    oop.inherits(DocdownHighlightRules, MarkdownHighlightRules);

    exports.DocdownHighlightRules = DocdownHighlightRules;
  }
);
