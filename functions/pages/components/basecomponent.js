const React = require('react');
const PropTypes = require('prop-types');
const R = React.createElement;

module.exports = class BaseComponent extends React.Component {
  constructor(props) {
    super(props);
  }
  getAuthors(article) {
    let authors = [];
    if (article.fields.author) {
      for (let c = 0, l = article.fields.author.length; c < l; c++) {
        let author = article.fields.author[c].fields;
        if (! author)
          continue;
        author['id'] = article.fields.author[c].sys.id;
        authors.push(author);
      }
    }
    return authors;
  }
  path(obj, is, value) {
    try {
      if (!obj)
        return '';
      if (typeof is === 'string')
        return this.path(obj, is.split('.'), value);
      else if (is.length === 1 && value !== undefined)
        return obj[is[0]] = value;
      else if (is.length === 0)
        return obj;
      else if (! obj[is[0]])
        return '';
      else {
        return this.path(obj[is[0]], is.slice(1), value);
      }
    } catch (e) {
      console.log('path() err', e);
      return '';
    }
  }
}
