const hljs = require('highlight.js/lib/highlight');

hljs.registerLanguage('xml', require('highlight.js/lib/languages/xml'));
hljs.registerLanguage('bash', require('highlight.js/lib/languages/bash'));
hljs.registerLanguage('css', require('highlight.js/lib/languages/css'));
hljs.registerLanguage('markdown', require('highlight.js/lib/languages/markdown'));
hljs.registerLanguage('dart', require('highlight.js/lib/languages/dart'));
hljs.registerLanguage('ruby', require('highlight.js/lib/languages/ruby'));
hljs.registerLanguage('go', require('highlight.js/lib/languages/go'));
hljs.registerLanguage('java', require('highlight.js/lib/languages/java'));
hljs.registerLanguage('javascript', require('highlight.js/lib/languages/javascript'));
hljs.registerLanguage('json', require('highlight.js/lib/languages/json'));
hljs.registerLanguage('objectivec', require('highlight.js/lib/languages/objectivec'));
hljs.registerLanguage('python', require('highlight.js/lib/languages/python'));
hljs.registerLanguage('scala', require('highlight.js/lib/languages/scala'));
hljs.registerLanguage('scss', require('highlight.js/lib/languages/scss'));
hljs.registerLanguage('swift', require('highlight.js/lib/languages/swift'));

module.exports = hljs;
