import React, { Component } from 'react';
import styled from 'styled-components';
import { connect } from 'react-redux';
import firebase from 'firebase/app';
import 'firebase/auth';

import outsideElement from './HOC/outsideElement';
import LoginModal from './LoginModal';

import {
  ToggleIcon,
  UserIcon,
  ArrowDownIcon,
  SearchIcon,
  StarIcon,
  BookmarkIcon,
} from './Icons';
import media from './Media';
import { loadArticlesBySection } from '../../apis/article';
import { setUser } from '../../apis/user';
import { THEME_COLORS } from '../../modules/styles';
import HoverNav from './HoverNav';
import Avatar from './Avatar';
import desktopLogoIMG from '../../assets/imgs/header-logo-v2.png';
import mobileLogoIMG from '../../assets/imgs/mobile-logo-v2.png';

const SHOW_SUB_NAV = false;

const Nav = styled.nav`
  position: relative;
  box-shadow: rgba(0, 0, 0, 0.3) 0px 2px 5px 0px;
`

const NavTop = styled.div`
  background: #000;
  width: 100%;
  height: 40px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  padding: 15px 20px 5px 20px;

  ${media.tablet} {
    padding: 0px;
    height: 130px;
  }
  ${media.max.mobile} {
    flex-direction: row;
    height: 70px;
    padding: 0 20px;
  }
`

const UserMenu = styled.div`
  a {
    display: flex;

    > div:first-child {
      margin-right: 5px;
    }
  }

  ${media.tablet} {
    padding-right: 10px;
  }

  ${media.desktop} {
    display: none;
  }
  display: none;
`

const MainMobileNav = styled.div`
  padding: 20px 0 25px;
  background: #222222;
  position: fixed;
  top: 70px;
  bottom: 0;
  left: 0;
  right: 100%;
  z-index: 201;
  box-shadow: 0 3px 6px 0px rgba(0, 0, 0, 0.29);
  transition: all ease 0.3s;
  overflow-y: scroll;
  font-family: 'Roboto', sans-serif;

  .mob-nav-section {
    .mob-nav-title {
      color: #555;
      font-size: 14px;
      padding-left: 20px;
      text-transform: uppercase;
    }
  }

  ${props => props.showNav && `
    right: 0;
    overflow-y: scroll;
  `}
`

const SubNav = styled.div`
  background: #3A4554;
  box-shadow: 0 0px 6px 0px rgba(0, 0, 0, 0.16);
  padding: 17px 0;
  position: absolute;
  top: 0;
  left: 100%;
  right: 0;
  z-index: 202;
  transition: all ease 0.3s;
  overflow: hidden;
  min-height: 380px;

  ${props => props.showNav && "left: 150px;"}
`

const SubNavItem = styled.div`
  a {
    display: block;
    text-decoration: none;
    font-size: 19px;
    font-weight: 400;
    color: white;
    padding: 15px 20px;
    white-space: nowrap;
    cursor: pointer;

    &:hover {
      color: #4DA4F4;
    }
  }
`

const MainMobileNavItem = styled.div`
  font-weight: 400;
  font-size: 19px;
  line-height: 23px;
  color: white;
  display: flex;
  align-items: center;
  white-space: nowrap;
  cursor: pointer;

  ${props => props.small && `
    font-size: 16px;
  `}

  > div {
    display: flex;

    > span {
      margin-right: 10px;
    }

    &.reversed {
      > div {
        transform: rotate(180deg);
      }
    }
  }

  > span {
    padding: 10px 20px;
  }

  > a {
    color: white;
    text-decoration: none;
    display: block;
    padding: 15px 20px;
    width: 100%;
  }

  &:hover {
    color: #4DA4F4;
  }

  ${props => props.active && `
    color: #4DA4F4;
  `}
`

const DropDown = styled.div`
  ${props => props.active && `
    .dropdown-menu {
      left: 150px;
    }
  `}
`

const ToggleMenu = styled.div`
  cursor: pointer;

  ${media.tablet} {
    display: none;
  }
`

const DesktopNavHolder = styled.div`
  flex: 1 0 1px;
  display: none;
  justify-content: center;
  align-items: center;

  ${media.tablet} {
    display: flex;
  }
`

const DesktopNavHolderWrapper = styled.div`
  width: 100%;
  height: 40px;
  background: #222;

  ${media.max.mobile} {
    display: none;
  }
`

const DesktopNav = styled.div`
  height: 40px;
  border-right: 1px solid #666666;
  padding: 0 10px 0 20px;
  display: flex;
  align-items: center;
  white-space: nowrap;
`

const DesktopNavItem = styled.div`
  text-decoration: none;
  font-size: 14px;
  line-height: 40px;
  color: white;
  font-weight: 400;
  display: flex;
  white-space: nowrap;
  font-family: 'Roboto', sans-serif;
  cursor: pointer;

  > span {
    margin-right: 5px;
  }

  &.nav-active:hover {
    background: #F4F4F4;
    position: relative;
    border-top: 2px solid #194F99;
    a {
      color: #4E4E4E;
    }
    div {
      display: flex !important;
    }
  }

  a {
    color: white;
    text-decoration: none;
    padding: 0 10px;

    ${media.desktop} {
      padding: 0 20px;
    }

    ${props => props.dropdown && `
      width: 100%;
      padding: 10px 40px !important;
    `}
  }

  ${props => props.dropdown && `
    font-size: 14px !important;
    font-weight: 400 !important;
    line-height: 30px !important;
  `}

  ${props => props.background && `
    line-height: 60px;
    background: #3A4554;
    padding: 0 20px;
  `}

  ${props => props.small && `
    font-weight: normal;
    color: #808080;
    font-size: 15px !important;
    line-height: 60px;
    padding: 0 15px;

    a {
      color: #808080;
    }
  `}
`

const DesktopNavDropdownHolder = styled.div`
  position: relative;
`

const DesktopNavDropdown = styled.div`
  position: absolute;
  top: 30px;
  left: 0;
  background: #222222;
  z-index: 1021;
  min-width: 180px;
  height: ${props => props.height}px;
  transition: all 0.3s ease;
  overflow: hidden;

  ${props => !props.active && `
    height: 0;
    padding: 0 20px;
  `}
  div:hover {
    background: #F4F4F4;
    a {
      color: #4E4E4E;
    }
  }
`

const DesktopUserNav = styled.div`
  display: none;
  padding: 0 20px 0 10px;

  ${media.desktop} {
    display: flex;
  }
`

const MoreButton = styled.span`
  font-size: 40px;
  margin-top: -20px;
  padding: 0 10px;

  ${media.desktop} {
    padding: 0 20px;
  }
`

const DesktopNavTop = styled.div`
  display: flex;
  justify-content: space-between;
  height: 90px;
  align-items: center;
  width: 1100px;
  font-family: 'Roboto', sans-serif;

  div.searchWrapper {
    height: 36px;
    width: 350px;
    position: relative;
    margin-left: -15px;
    div.searchIcon {
      position: absolute;
      top: 6px;
      left: 10px;
      cursor: pointer;
    }
    .searchBar {
      background: #222222;
      width: 350px;
      height: 36px;
      padding-left: 45px;
      border: none;
      color: white;
    }
    ${media.max.mobile} {
      display: none;
    }
  }

  div.userWrapper {
    width: 350px;
    display: flex;
    justify-content: flex-end;
    color: #5F5F5F;

    & > div {
      margin-left: 20px;
      cursor: pointer;

      a {
        text-decoration: none;
        color: #5F5F5F;
      }
    }

    ${media.max.mobile} {
      display: none;
    }
  }

  div.title {
    .desktop-logo {
      display: block;
      ${media.max.mobile} {
        display: none;
      }
    }
    .mobile-logo {
      display: none;
      ${media.max.mobile} {
        display: block;
      }
    }
    ${media.max.mobile} {
      position: absolute;
      left: 53%;
      top: 22px;
      transform: translate(-50%);
    }
  }
  ${media.max.mobile} {
    width: auto;
  }
`

const ProfilePicture = styled.a`
  display: flex;
  line-height: 32px;
  color: #ffffff;
  font-size: 12px;
  padding-top: 15px;
  text-decoration: none;

  & > span {
    margin-left: 10px;
  }
`

const ProfileStar = styled.a`
  line-height: 32px;
  font-size: 12px;
  color: #ffffff;
  padding-top: 15px;
  text-decoration: none;
  margin-left: 10px;

  svg {
    vertical-align: top;
    margin-right: -8px;
  }
`

const ProfileBookmark = styled.a`
  line-height: 32px;
  font-size: 12px;
  color: #ffffff;
  padding-top: 15px;
  text-decoration: none;
  margin-left: 10px;

  svg {
    margin-top: 6px;
    margin-right: 3px;
    vertical-align: top;
  }
`

class Navbar extends Component {
  constructor(props) {
    super(props);

    this.state = {
      showLoginModal: false,
    };

    this.toggleLoginBlock = this.toggleLoginBlock.bind(this);
  }

  state = {
    showMainMobileNav: false,
    activeMenu: -1,
    showMoreNav: false,
    showMoreDesktopNav: false,
    showSearch: false
  }

  componentDidMount() {
    const menus = window.cApplicationLocal.mainMenus;
    const { dispatch } = this.props;

    menus.forEach(item => {
      if (item.submenu.length > 0 && SHOW_SUB_NAV) {
        this.props.dispatch(loadArticlesBySection(item.id, 2));
      }
    });

    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        firebase
          .database()
          .ref(`userProfileWrite/${user.uid}`)
          .on('value', (res) => {
            const userDetail = res.val();
            const storage = firebase.storage();
            const ref = storage.ref(`userimages/${user.uid}`);

            ref.getDownloadURL().then((url) => {
              dispatch(setUser({
                email: user.email,
                uid: user.uid,
                profileImage: url,
                ...userDetail,
              }));
            }).catch(() => {
              dispatch(setUser({
                email: user.email,
                uid: user.uid,
                ...userDetail,
              }));
            });
          });
      } else {
        dispatch(setUser(null));
      }
    });
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.outside) {
      this.setState({
        showMainMobileNav: false,
        activeMenu: -1,
        showMoreNav: false,
        showMoreDesktopNav: false
      })
    }
  }

  showMoreDesktopNav = () => {
    this.setState({ showMoreDesktopNav: !this.state.showMoreDesktopNav });
  }

  toggleSearch = () => {
    let { showSearch } = this.state;
    showSearch = !showSearch;

    this.setState({ showSearch });
  }

  toggleNav = () => {
    let { showMainMobileNav } = this.state;
    showMainMobileNav = !showMainMobileNav;

    this.setState({ showMainMobileNav });
  }

  showSubNav = (index) => {
    const { activeMenu } = this.state;
    if (activeMenu === index) {
      this.setState({ activeMenu: -1 });
    } else {
      this.setState({ activeMenu: index });
    }
  }

  toggleMoreMenu = () => {
    this.setState({
      showMoreNav: !this.state.showMoreNav,
      activeMenu: -1
    });
  }

  generateNavGroup = (navList, prev = 0) => (
    navList && navList.map((nav, index) => (
      <DropDown active={this.state.activeMenu === index + prev} key={index + prev}>
        <MainMobileNavItem className={nav.submenu.length && SHOW_SUB_NAV ? 'dropdown-toggle' : ''} key={index + prev} onClick={() => this.showSubNav(index + prev)} active={this.state.activeMenu === index + prev}>
          {nav.submenu.length && SHOW_SUB_NAV ? (
            <span>{nav.text}</span>
          ) : (
              <a href={nav.href} target={nav.target ? nav.target : '_self'}>{nav.text}</a>
            )
          }
        </MainMobileNavItem>
        {!!nav.submenu.length && SHOW_SUB_NAV &&
          <SubNav className="dropdown-menu">
            {nav.submenu.map((menu, idx) => (
              <SubNavItem key={idx}><a href={menu.href.replace('NCAAMB', '')}>{menu.text}</a></SubNavItem>
            ))}
          </SubNav>
        }
      </DropDown>
    ))
  )

  toggleLoginBlock(e) {
    this.setState({
      showLoginModal: !this.state.showLoginModal,
    });

    e.preventDefault();
  }

  logout() {
    firebase.auth().signOut();
    window.location.href = "/";
  }

  render() {
    const { showMainMobileNav } = this.state;
    const { user, loading } = this.props.user;
    let navList = [];
    let moreNavList = [];
    let mobileNavList = [];
    let mobileInteractiveList = [];
    let mobileLegalList = [];
    let favorites = 0;
    let bookmark = 0;

    if (user) {
      if (user.favoriteTeams) {
        favorites += Object.keys(user.favoriteTeams).length;
      }

      if (user.favoritePlayers) {
        favorites += Object.keys(user.favoritePlayers).length;
      }

      if (user.savedArticles) {
        bookmark += Object.keys(user.savedArticles).length;
      }
    }

    if (window.initApp) {
      window.initApp();
      navList = window.cApplicationLocal.mainMenus;
      moreNavList = window.cApplicationLocal.moreMenus;
      mobileNavList = navList.slice(0);
      mobileInteractiveList = window.cApplicationLocal.interactiveList;
      mobileLegalList = window.cApplicationLocal.legalList;
    }

    if (this.state.showLoginModal) {
      return <LoginModal onClose={this.toggleLoginBlock} />
    }

    return (
      <Nav className={ 'navigation-react-header-wrapper'}>
        <NavTop>
          <ToggleMenu onClick={this.toggleNav}>
            <ToggleIcon color="#fff" />
          </ToggleMenu>
          <DesktopNavTop>
            <div className="searchWrapper">
              {this.state.showSearch && <div className="searchIcon" onClick={() => this.toggleSearch()}><SearchIcon/></div>}
              {this.state.showSearch && <input className="searchBar" placeholder="Search Writers, Teams or Players" autoFocus={true}/>}
            </div>
            <a href="/">
              <div className="title">
                <img src={desktopLogoIMG} className="desktop-logo" alt="Desktop Logo" />
                <img src={mobileLogoIMG} className="mobile-logo" alt="Mobile Logo" />
              </div>
            </a>
            <div className="userWrapper">
              {!user && !loading && loading && <div><a href="/userregistration">Register</a></div>}
              {!user && !loading && loading && <div onClick={this.toggleLoginBlock}>Login</div>}
              {/* <div><a href="/join">Why Join?</a></div>*/ }
              {user && <ProfilePicture href="/profile">
                <div>
                  <Avatar size={30} round={true} />
                </div>
                <span>{user.firstName || user.email}</span>
              </ProfilePicture>}
              {user && !user && <ProfileStar href="/profile?section=FAVORITES"><StarIcon color={THEME_COLORS.ORANGE} /> {favorites}</ProfileStar>}
              {user && !user && <ProfileBookmark href="/profile?section=SAVEDSTORIES"><BookmarkIcon size={18} color={THEME_COLORS.BLUE} /> {bookmark}</ProfileBookmark>}
            </div>
          </DesktopNavTop>
          <DesktopNavHolderWrapper>
            <DesktopNavHolder>
              <DesktopNav>
                {
                  navList.map((nav, index) => (
                    <DesktopNavItem key={index} className="nav-active">
                      <a href={nav.submenu.length > 0 && SHOW_SUB_NAV ? nav.submenu[0].href : nav.href}>{nav.text}</a>
                      {nav.submenu.length > 0 && SHOW_SUB_NAV && <HoverNav menu={nav.submenu} articles={this.props.article.articlesBySection[nav.id] || []} />}
                    </DesktopNavItem>
                  ))
                }
                <DesktopNavDropdownHolder>
                  <DesktopNavItem onClick={this.showMoreDesktopNav}><MoreButton>...</MoreButton></DesktopNavItem>
                  <DesktopNavDropdown height={moreNavList.length * 50} active={this.state.showMoreDesktopNav}>
                    {
                      moreNavList.map((nav, index) => (
                        <DesktopNavItem dropdown key={index}><a dropdown href={nav.href}>{nav.text}</a></DesktopNavItem>
                      ))
                    }
                  </DesktopNavDropdown>
                </DesktopNavDropdownHolder>
              </DesktopNav>
              <DesktopUserNav>
                <DesktopNavItem><a href={'/sports-betting-app'}>DOWNLOAD THE APP</a></DesktopNavItem>
                <DesktopNavItem><a href={'/illinois-sports-betting/'}>ABOUT US</a></DesktopNavItem>
                {user && !user && <DesktopNavItem onClick={this.logout}><a>LOGOUT</a></DesktopNavItem>}
              </DesktopUserNav>
            </DesktopNavHolder>
          </DesktopNavHolderWrapper>
          <UserMenu>
            <a href="https://betchicago.chalkline.com/" class="contest-mobile-link-nav" target="_parent">
              <UserIcon color="#fff" />
              <ArrowDownIcon color="#fff" />
            </a>
          </UserMenu>
        </NavTop>
        <MainMobileNav showNav={showMainMobileNav}>
          <div className="mob-nav-section">
            <p className="mob-nav-title">sports / leagues</p>
            {this.generateNavGroup(mobileNavList)}
            {this.generateNavGroup(moreNavList, navList.length)}
            <DropDown>
              <MainMobileNavItem>
                <a href={'/contact/'}>CONTACT BC</a>
              </MainMobileNavItem>
            </DropDown>
          </div>
          <div className="mob-nav-section">
            <p className="mob-nav-title">interactive</p>
            {this.generateNavGroup(mobileInteractiveList)}
            {!user && !loading && loading && <DropDown>
              <MainMobileNavItem small onClick={this.toggleLoginBlock}>
                <a>LOGIN</a>
              </MainMobileNavItem>
            </DropDown>}
            {!user && !loading && loading && <DropDown>
              <MainMobileNavItem small>
                <a href={'/userregistration'}>REGISTER</a>
              </MainMobileNavItem>
            </DropDown>}
            {user && !user && <DropDown>
              <MainMobileNavItem small>
                <a href={'/profile'}>PROFILE</a>
              </MainMobileNavItem>
            </DropDown>}
            {user && !user && <DropDown>
              <MainMobileNavItem small>
                <a href={'/profile?section=FAVORITES'}>FAVORITES</a>
              </MainMobileNavItem>
            </DropDown>}
            {user && !user && <DropDown>
              <MainMobileNavItem small>
                <a href={'/profile?section=SAVEDSTORIES'}>SAVED STORIES</a>
              </MainMobileNavItem>
            </DropDown>}
            {user && !user && <DropDown>
              <MainMobileNavItem small>
                <a onClick={this.logout}>LOGOUT</a>
              </MainMobileNavItem>
            </DropDown>}
          </div>
          <div className="mob-nav-section">
            <p className="mob-nav-title">legal stuff</p>
            {this.generateNavGroup(mobileLegalList)}
            <DropDown>
              <MainMobileNavItem small>
                <a href={'/privacy'}>PRIVACY POLICY</a>
              </MainMobileNavItem>
            </DropDown>
            <DropDown>
              <MainMobileNavItem small>
                <a href={'/terms'}>TERMS OF USE</a>
              </MainMobileNavItem>
            </DropDown>
            <DropDown>
              <MainMobileNavItem small>
                <a href={'/copyright'}>COPYRIGHT</a>
              </MainMobileNavItem>
            </DropDown>
          </div>
        </MainMobileNav>
      </Nav>
    );
  }
}

const mapStateToProps = state => ({
  article: state.article,
  user: state.user,
});

export default connect(mapStateToProps)(outsideElement(Navbar));
