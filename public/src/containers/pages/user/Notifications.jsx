import React from 'react';
import styled from 'styled-components';

const Header = styled.h1`
  font-size: 18px;
  font-weight: 700 !important;
  margin-bottom: 20px;
`

const NotificationText = styled.div`
  font-size: 14px;
  line-height: 18px;
  margin-bottom: 20px;
`

const NotificationListLink = styled.a`
  color: #F15A24;
  text-decoration: underline;
  font-size: 14px;
`

const Notifications = () => (
  <div>
    <Header>Notifications</Header>
    <NotificationText>Notification settings are only available in the BetChicago App.</NotificationText>
    <NotificationText>The BetChicago App delivers, not only the best sports and betting content, but also amazing game coverage, in-depth stats and notifications including scoring updates, new article posts, favorites activity and more.</NotificationText>
    <NotificationText>For a full list of features, <NotificationListLink href="/sports-betting-app">click here.</NotificationListLink></NotificationText>
    <NotificationText>
      <NotificationListLink href="https://itunes.apple.com/us/app/betchicago/id1404462108?mt=8">iTunes</NotificationListLink> | <NotificationListLink href="https://play.google.com/store/apps/details?id=com.betchicago.app&hl=en_US">Google Play</NotificationListLink>
    </NotificationText>
  </div>
);

export default Notifications;
