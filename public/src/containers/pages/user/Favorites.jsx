import React from 'react';
import styled from 'styled-components';

import { TrashIcon } from '../../components/Icons';
import { THEME_COLORS } from '../../../modules/styles';

const Header = styled.h1`
  font-size: 18px;
  font-weight: 700 !important;
  margin-bottom: 20px;
`

const FavoritesDescription = styled.div`
  font-size: 14px;
  line-height: 18px;
  margin-bottom: 20px;
`

/* const ViewFavoritesFeed = styled.div`
  color: #F15A24;
  text-decoration: underline;
  font-size: 14px;
  margin-bottom: 30px;
` */

const Row = styled.div`
  display: flex;
  margin-bottom: 10px;
`

const LeftColumn = styled.div`
  margin-right: 100px;
`

const SubHeader = styled.h2`
  font-size: 16px;
  margin-bottom: 10px;
`

const FavoriteItem = styled.div`
  margin-left: 10px;
  flex: 1;
  font-size: 14px;
  line-height: 20px;
`

const NoContentPlaceholder = styled.div`
  color: #F15A24;
`

const Favorites = (props) => {
  return (
    <div>
      <Header>Manage My Favorites</Header>
      <FavoritesDescription>Favorites allow you to see all stories related to your favorite teams and players in one feed. Click on the Favorites icon in the upper right corner to view your feed anytime.</FavoritesDescription>
      <FavoritesDescription>Below are the teams you have added to your favorites. To remove a favorite, click the delete icon.</FavoritesDescription>
      {/* <ViewFavoritesFeed>View Favorites Feed</ViewFavoritesFeed>*/ }
      <Row>
        <LeftColumn>
          <SubHeader>Teams</SubHeader>
          {Object.keys(props.teams || {}).map(key => (<Row key={key}>
            <div onClick={() => { props.onRemove('FAVORITE_TEAM', key, `/favoriteTeams/${key}`); }}>
              <TrashIcon color={THEME_COLORS.ORANGE} />
            </div>
            <FavoriteItem>{props.teams[key]['name']}</FavoriteItem>
          </Row>))}
          {Object.keys(props.teams || {}).length === 0 && <NoContentPlaceholder>No favorite team selected</NoContentPlaceholder>}
        </LeftColumn>
        <div>
          <SubHeader>Players</SubHeader>
          {Object.keys(props.players || {}).map(key => (<Row key={key}>
            <div onClick={() => { props.onRemove('FAVORITE_PLAYER', key, `/favoritePlayers/${key}`); }}>
              <TrashIcon color={THEME_COLORS.ORANGE} />
            </div>
            <FavoriteItem>{props.players[key]['name']}</FavoriteItem>
          </Row>))}
          {Object.keys(props.players || {}).length === 0 && <NoContentPlaceholder>No favorite player selected</NoContentPlaceholder>}
        </div>
      </Row>
    </div>
  );
}

export default Favorites;
