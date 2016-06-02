const MarkdownIt = require('markdown-it');
const hljs = require('highlight.js');
const fm = require('front-matter');

module.exports = function markdown(source) {
  this.cacheable();

  const md = new MarkdownIt({
    html: true,
    linkify: true,
    highlight: (str, lang) => {
      if (lang && hljs.getLanguage(lang)) {
        try {
          return hljs.highlight(lang, str).value;
        } catch (err) { console.error(err.stack); }
      }

      try {
        return hljs.highlightAuto(str).value;
      } catch (err) { console.error(err.stack); }

      return '';
    },
  });

  const frontmatter = fm(source);
  frontmatter.attributes.html = md.render(frontmatter.body);

  return `module.exports = ${JSON.stringify(frontmatter.attributes)};`;
};
