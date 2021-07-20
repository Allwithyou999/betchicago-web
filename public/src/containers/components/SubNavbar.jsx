import React, { Component } from 'react';
import { withRouter } from 'react-router'
import styled from 'styled-components';

import outsideElement from './HOC/outsideElement';
import { ArrowDownIcon } from './Icons';
import media from './Media';
import { THEME_COLORS } from '../../modules/styles';

const Nav = styled.nav`
  position: relative;
  box-shadow: 0 2px 5px 0 rgba(0, 0, 0, 0.3);
  height: 50px;
  background: #EAEAEB;

  ${media.tablet} {
    height: auto;
  }
`

const NavInner = styled.div`
  display: flex;
  width: 1314px;
  margin: auto;
`

const SportInfo = styled.div`
  background: #EAEAEB;
  text-align: center;
  padding: 12px 45px 11px;
  position: relative;
  z-index: 152;

  > span {
    display: inline-block;
    font-weight: 700;
    font-size: 19px;
    line-height: 23px;
    color: ${THEME_COLORS.BLACK};
    text-transform: uppercase;
  }
`

const Link = styled.a`

`

const Dropdown = styled.div`
  flex: 1 0 1px;
  position: relative;
  height: 100%;

  ${media.tablet} {
    display: none;
  }
`

const DropdownButton = styled.div`
  position: relative;
  z-index: 120;
  background: white;
`

const LinkItem = styled.div`
  font-weight: 300;
  font-size: 17px;
  line-height: 20px;
  color: ${THEME_COLORS.BLACK};

  a {
    text-decoration: none;
    color: ${THEME_COLORS.BLACK};
  }
`

const DownIcon = styled.div`
`

const DropdownMenu = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  background: white;
  box-shadow: 0 0 6px 0 rgba(0, 0, 0, 0.16);
  z-index: 111;
  height: 0px;
  overflow: hidden;
  transition: height ease 0.5s;

  ${props => props.showMenu && `
    height: ${props.height}px;
    z-index: 131;
  `}
`

const BlackBar = styled.div`
  background: ${THEME_COLORS.BLACK};
  height: 4px;
`

const MenuItem = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 13px 23px 13px 16px;
`

const DesktopNav = styled.div`
  flex: 1 0 1px;
  display: flex;
  align-items: center;
  background: #EAEAEB;
  display: none;
  flex-flow: row wrap;

  ${media.tablet} {
    display: flex;
    padding: 10px 0;
  }
`

const DesktopNavItem = styled.div`
  padding: 0 10px;

  ${media.desktop} {
    padding: 0 18px;
  }

  &:hover {
    a {
      color: #4DA4F4;
    }
  }

  a {
    font-size: 13px;
    line-height: 30px;
    color: #666666;
    text-transform: uppercase;
    text-decoration: none;
    white-space: nowrap;
  }
`

class SubNavbar extends Component {
  state = {
    showMenu: false
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.outside) {
      this.setState({
        showMenu: false
      })
    }
  }

  showDropdown = (flag) => {
    this.setState({ showMenu: flag });
  }

  render() {
    let navList = [];
    let sport = '';

    if (window.initApp) {
      navList = [...window.cApplicationLocal.mainMenus, ...window.cApplicationLocal.moreMenus];
    }
    const submenu = navList.filter((navitem) => this.props.location.pathname.indexOf(navitem.href) !== -1);
    let menuItems = [];
    if (submenu.length) {
      menuItems = submenu[0].submenu;
      sport = submenu[0].text;
    }
    
    let active = menuItems.filter(item => item.href.replace('NCAAMB', '') === this.props.location.pathname);
    active = active.length ? active[0] : menuItems[0];

    return (
      <Nav className={"section-header-gray-bar"}>
        <NavInner>
          <SportInfo><span>{sport}</span></SportInfo>
          <DesktopNav>
            {
              menuItems.map((item, index) => (
                <DesktopNavItem key={index}>
                  <Link href={item.href.replace('NCAAMB', '')}>{item.text}</Link>
                </DesktopNavItem>
              ))
            }
          </DesktopNav>
          {!!active &&
            <Dropdown>
              <DropdownButton onClick={() => this.showDropdown(true)}>
                <MenuItem>
                  <LinkItem>{active.text}</LinkItem>
                  <DownIcon><ArrowDownIcon color={`${THEME_COLORS.BLACK}`} /></DownIcon>
                </MenuItem>
              </DropdownButton>
              <DropdownMenu height={menuItems.length * 46 + 4} showMenu={this.state.showMenu} onClick={() => this.showDropdown(false)} >
                {
                  menuItems.map((item, index) => (
                    <MenuItem key={index}>
                      <LinkItem><Link href={item.href.replace('NCAAMB', '')}>{item.text}</Link></LinkItem>
                      {index === 0 && <DownIcon><ArrowDownIcon color={`${THEME_COLORS.BLACK}`} /></DownIcon>}
                    </MenuItem>
                  ))
                }
                <BlackBar />
              </DropdownMenu>
            </Dropdown>
          }
        </NavInner>
      </Nav>
    );
  }
}

export default withRouter(outsideElement(SubNavbar));
