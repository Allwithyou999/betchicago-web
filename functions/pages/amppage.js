const React = require('react');
const PropTypes = require('prop-types');
const NavMenu = require('./components/rnavmenu');
const R = React.createElement;

module.exports = class AMPPage extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    return [
      R('div', null)
    ];
  }
}
