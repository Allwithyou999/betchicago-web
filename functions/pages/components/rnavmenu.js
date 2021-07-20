const React = require('react');
const R = React.createElement;

module.exports = class NavMenu extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    let prefix = this.props.parentProps.rootUrl;
    let menuItems = [];

    let menus = this.props.menus;
    if (menus)
      menuItems = menus.map((menu) =>
        R('li', {
            key: prefix + menu.sectionSlug
          },
          R('a', {
            href: prefix + menu.sectionSlug
          }, `${menu.name}`),
          R('span', {}, `${menu.id}`),
          R('p', {}, `${menu.pageTitle}`),
          R(SectionsBand, {
            menu,
            parentProps: this.props.parentProps
          })
        )
      );

    if (this.props.submenu)
      menuItems.push(R('li', {},
        R('a', {
          className: 'more-menus-anchor'
        }, '...'),
        R('br'),
        this.props.submenu));

    return R('ul', {
        className: this.props.className
      },
      menuItems);
  }
};

class SectionsBand extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    let sections = [];
    let prefix = this.props.parentProps.rootUrl + this.props.menu.sectionSlug + '/';
    if (this.props.menu.sectionComponents)
      sections = this.props.menu.sectionComponents.map((s) =>
        R('li', {
            key: prefix + s.component
          },
          R('a', {
            href: prefix + s.component
          }, `${s.componentName}`)
        )
      );

    sections.push(R('span', {
      key: 'clear',
      style: {
        clear: 'both'
      }
    }));

    return R('ul', {
        className: 'sections-header-band'
      },
      sections
    );
  }
}
