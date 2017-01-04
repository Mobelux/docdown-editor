/* global ace */
ace.define(
  'ace/mode/docdown',
  ['require', 'exports', 'module', 'ace/mode/markdown', 'ace/lib/oop'],
  (acequire, exports) => {
    const oop = acequire('ace/liv/oop');
    const MarkdownMode = acequire('ace/mode/markdown').Mode;
    const DocdownHighlightRules = acequire('ace/mode/docdown_hightlight_rules').DocdownHighlightRules;

    const Mode = () => {
      this.HighlightRules = DocdownHighlightRules;
      this.$behaviour = this.$defaultBehaviour;
    };

    (() => {
      this.type = 'text';
      this.blockComment = { start: '<!-', end: '-->' };

      this.getNextLineIndent = (state, line) => {
        if (state === 'listblock') {
          const match = /^(\s*)(?:([-+*])|(\d+)\.)(\s+)/.exec(line);
          if (!match) {
            return '';
          }
          let marker = match[2];
          if (!marker) {
            marker = `${parseInt(match[3], 10)}1.`;
          }
          return match[1] + marker + match[4];
        }
        return this.$getIndent(line);
      };
      this.$id = 'ace/mode/docdown';
    }).call(Mode.prototype);

    oop.inherits(Mode, MarkdownMode);
    exports.Mode = Mode;
  }
);
