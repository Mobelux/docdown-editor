import Remarkable from 'remarkable';
import { include, links, media, noteBlocks, sequence } from 'remarkable-docdown';
import hljs from './highlight';

function svgPath(name) {
  return `./svgs/${name}.svg`;
}

function staticPath(path) {
  return `https://smartdevicelink.com/static/${path}`;
}

const md = new Remarkable('full', {
  html: true,        // Enable HTML tags in source
  breaks: true,        // Convert '\n' in paragraphs into <br>
  linkTarget: '_blank',
  langPrefix: 'language-',  // CSS language prefix for fenced blocks
  // Highlighter function. Should return escaped HTML,
  // or '' if the source string is not changed
  highlight: (str, lang) => {
    hljs.configure({ classPrefix: '' });
    if (lang && hljs.getLanguage(lang)) {
      try {
        return hljs.highlight(lang, str).value;
      } catch (err) {
        console.log(err.message);
      }
    }

    try {
      return hljs.highlightAuto(str).value;
    } catch (err) {
      console.log(err.message);
    }

    return ''; // use external default escaping
  },
  media_url: 'https://smartdevicelink.com/media/',
  links: {
    link_map: {
      'to/nowhere': 'home/localhost'
    }
  },
  sequence: {
    prefix: `
      <div class="visual-link-wrapper">
        <a href="{{{ image_url }}}" target="_blank" class="visual-link">
          <div class="visual-link__body">
            <div class="t-h6 visual-link__title">{{ title }}</div>
            <p>`,
    postfix: `
          \n</p>
        </div>
        <div class="visual-link__link flex justify-center items-center">
          <span class="fc-theme">View Diagram</span>
          <span class="icon"><img src="${svgPath('icon-visual')}" /></span>
        </div>
      </a>
    </div>\n
    <img class="visual-print-image" src="{{{ image_url }}}">
  `
  },
  note_blocks: {
    prefix: `
      <div class="{{ tag }}">
        <div class="icon">
          {{{ svg }}}
        </div>
        <h5>{{ title }}</h5>`,
    postfix: '\n</div>',
    tags: {
      must: {
        svg: `<img src="${svgPath('icon-must')}" />`,
        title: 'Must'
      },
      note: {
        svg: `<img src="${svgPath('icon-note')}" />`,
        title: 'Note'
      },
      may: {
        svg: `<img src="${svgPath('icon-may')}" />`,
        title: 'May'
      }
    }
  },
  include: {
    root_dir: __dirname,
    current_dir: __dirname,
    asset_dir_name: 'assets',
    extension_map: { jason: 'json' }
  }
});
md
  .use(noteBlocks)
  .use(sequence)
  .use(include)
  .use(links)
  .use(media);

export default md;
