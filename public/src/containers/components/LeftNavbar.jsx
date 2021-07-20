import React from 'react';
import { withRouter } from 'react-router'
import styled from 'styled-components';
import { connect } from 'react-redux';

import { ArrowRightIcon } from './Icons';
import media from './Media';
import Avatar from './Avatar';

const Nav = styled.nav`
  position: relative;
  width: 280px;
  min-height: 700px;
  background-color: #F2F2F2;
  padding: 40px 0;

  ${media.tablet} {
    height: auto;
  }

  ${media.max.mobile} {
    width: 100%;
    padding: 15px 0;
  }
`

const ProfileInfo = styled.div`
  text-align: center;
  margin-bottom: 40px;
`

const AvatarContainer = styled.div`
  margin: auto;
`

const FullName = styled.div`
  font-weight: 700;
  margin-top: 20px;
  font-size: 18px;
`

const Email = styled.div`
  font-style: italic;
  margin-top: 5px;
`

const NavItem = styled.div`
  padding: 15px 20px;
  border-top: 1px solid #CCCCCC;
  border-bottom: 1px solid #CCCCCC;
  display: flex;
  justify-content: space-between;
  cursor: pointer;
`

const NavItemDescription = styled.div`
  color: #7F91A2;
  font-size: 13px;
  margin-top: 5px;
  font-weight: 100;
`

/* const CloseAccount = styled.div`
  margin: 100px 0;

  ${media.max.mobile} {
    margin: 20px 0;
  }
` */

const menuItems = [{
  name: 'My Profile',
  description: 'Name, email and profile data',
  tab: 'PROFILE',
}, {
  name: 'Saved Stories',
  description: 'All your saved stories in one feed',
  tab: 'SAVEDSTORIES',
}, {
  name: 'Favorites',
  description: 'Manage favorite teams, players',
  tab: 'FAVORITES',
}, {
  name: 'Notifications',
  description: 'Add, modify notification settings',
  tab: 'NOTIFICATIONS',
}];

class LeftNavbar extends React.Component {
  render() {
    const { user } = this.props.user;
    let name = '';

    if (!user) {
      return null;
    }

    if (user.firstName) {
      name += (user.firstName + ' ');
    }

    if (user.lastName) {
      name += user.lastName;
    }

    return (
      <Nav>
        <ProfileInfo>
          <AvatarContainer>
            {user.uid && <Avatar size={100} round={true} />}
          </AvatarContainer>
          {name && <FullName>{name}</FullName>}
          <Email>{user.email || ''}</Email>
        </ProfileInfo>
        {menuItems.map((item, index) => (
          <NavItem style={{ borderTopWidth: (index === 0 ? 1 : 0) }} key={item.name} onClick={() => { this.props.onChange(item.tab); }}>
            <div>
              <div>{item.name}</div>
              <NavItemDescription>{item.description}</NavItemDescription>
            </div>
            <ArrowRightIcon color="#A0A0A0" width={8} />
          </NavItem>
        ))}
        {/* <CloseAccount>
          <NavItem>
            <div>
              <div>Close Account</div>
              <NavItemDescription>Delete Your BC Account & Saves</NavItemDescription>
            </div>
            <ArrowRightIcon color="#A0A0A0" width={8} />
          </NavItem>
        </CloseAccount> */}
      </Nav>
    );
  }
}

const mapStateToProps = state => ({
  user: state.user,
});

export default connect(mapStateToProps)(withRouter(LeftNavbar));
