/* global ace */
ace.define('ace/theme/livio', ['require', 'exports', 'module', 'ace/lib/dom'], (acequire, exports) => {
  exports.isDark = true;
  exports.cssClass = 'ace_livio';
  exports.cssText = `
  .ace_livio .ace_gutter {}

  .ace_livio {
    font-family: 'LivioMono', monospace;
    font-size: 15px;
    font-weight: 400;
    line-height: 30px;
    letter-spacing: 0.25px;
  }

  .ace_livio .ace_cursor {}

  .ace_livio .ace_marker-layer .ace_selection {}

  .ace_livio.ace_multiselect .ace_selection.ace_start {}

  .ace_livio .ace_marker-layer .ace_step {}

  .ace_livio .ace_marker-layer .ace_bracket {}

  .ace_livio .ace_marker-layer .ace_active-line {}

  .ace_livio .ace_gutter-active-line {}

  .ace_livio .ace_marker-layer .ace_selected-word {}

  .ace_livio .ace_fold {}

  .ace_livio .ace_keyword {}

  .ace_livio .ace_keyword.ace_other.ace_unit {}

  .ace_livio .ace_constant.ace_language {}

  .ace_livio .ace_constant.ace_numeric {}

  .ace_livio .ace_constant.ace_character {}

  .ace_livio .ace_constant.ace_character.ace_escape {}

  .ace_livio .ace_support.ace_function {
    color: #FDA165;
  }

  .ace_livio .ace_support.ace_constant {}

  .ace_livio .ace_support.ace_class {}

  .ace_livio .ace_support.ace_type {}

  .ace_livio .ace_storage.ace_type {}

  .ace_livio .ace_invalid {}

  .ace_livio .ace_invalid.ace_deprecated {}

  .ace_livio .ace_string {}

  .ace_livio .ace_string.ace_regexp {}

  .ace_livio .ace_comment {}

  .ace_livio .ace_variable {}

  .ace_livio .ace_variable.ace_language {}

  .ace_livio .ace_variable.ace_parameter {}

  .ace_livio .ace_meta.ace_tag {}

  .ace_livio .ace_entity.ace_other.ace_attribute-name {}

  .ace_livio .ace_entity.ace_name.ace_function {
    color: #FDA165;
  }

  .ace_livio .ace_entity.ace_name.ace_tag {}

  .ace_livio .ace_heading {
    color: #478CCB;
  }

  .ace_livio .ace_include {
    color: #e37f96;
  }
`;

  const dom = acequire('../lib/dom');
  dom.importCssString(exports.cssText, exports.cssClass);
});
