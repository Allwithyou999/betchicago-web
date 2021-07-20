import React from 'react';
import { Link, withRouter } from 'react-router-dom';
import Wrapper from './styled';

class SubNav extends React.Component {
  state = {
    activeItem: 'home',
    navItems: this.props.navItems,
    showMobileMenu: false
  };

  setActive = activeItem => () => {
    this.setState({
      activeItem,
      showMobileMenu: false
    });
  };

  showMobileMenu = () => {
    this.setState({
      showMobileMenu: true
    });
  };

  componentDidMount() {
    this.state.navItems.forEach(item => {
      if (this.props.location.pathname.indexOf(item) !== -1) {
        this.setState({
          activeItem: item
        });
      }
    });
  }

  render() {
    const path = this.props.match.path;
    const { title } = this.props;
    const { activeItem, navItems, showMobileMenu } = this.state;
    return (
      <Wrapper showMobileMenu={showMobileMenu}>
        <nav className="container">
          <div className="title">
            <span>{title}</span>
          </div>
          <div className="nav-container">
            <div className="mobile-dropdown" onClick={this.showMobileMenu}>
              <div className="mobile-dropdown-button">{activeItem}</div>
              <div>
                <svg fill="#111111" viewBox="4019 -1200 9.4 6.1" width="10">
                  <path
                    fill="#111111"
                    d="M6.7,8.1,2,3.4,3.4,2,6.7,5.3,10,2l1.4,1.4Z"
                    transform="translate(4017 -1202)"
                  />
                </svg>
              </div>
            </div>
            <div className="items-container">
              {navItems.map(item => {
                return (
                  <div
                    className="nav-item"
                    onClick={this.setActive(item)}
                    key={item}>
                    <Link to={`${path}${item}`}>{item}</Link>
                  </div>
                );
              })}
            </div>
          </div>
        </nav>
      </Wrapper>
    );
  }
}

export default withRouter(SubNav);
