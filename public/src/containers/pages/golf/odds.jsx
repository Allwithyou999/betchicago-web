import React, { Component } from 'react';
import styled from 'styled-components';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import PlayerTable from '../../../containers/components/players/PlayerTable';
import Page, { MainContent, SidebarRight, TabletOnly, MobileOnly } from '../../../containers/components/Layout';
import SidebarWidget from '../../../containers/components/SidebarWidget';
import ContentPromo from '../../../containers/components/ContentPromo';
import TrendingStories from '../../../containers/components/TrendingStories';
import Dropdown from '../../../containers/components/Dropdown';
import Loading from '../../../containers/components/Loading';

import { THEME_COLORS } from '../../../modules/styles';
import { ODDS_TITLE, ODDS_DESKTOP_TITLE } from '../../../modules/constants/golf';
import { STATUS } from '../../../modules/constants/common';

import { loadOdds } from '../../../apis/golf';

const Wrapper = styled.div``;

const Title = styled.h1`
  margin-bottom: 5px;
`;

// const Subtitle = styled.h6`
//   font-weight: 700;
//   margin-bottom: 3px;
//   ${props => props.normal && `font-weight: 400;`};
// `;

// const OddTypeList = styled.div`
//   display: flex;
//   justify-content: center;
//   padding: 25px 0 15px;
// `;

// const OddType = styled.div`
//   font-size: 11px;
//   line-height: 13px;
//   color: #666666;

//   &:before {
//     width: 16px;
//     height: 16px;
//     content: '';
//     display: inline-block;
//     margin-right: 4px;
//     vertical-align: middle;
//     margin-top: -2px;
//     background-color: ${props => props.color};
//   }

//   + div {
//     margin-left: 10px;
//   }
// `;

const OddItems = styled.div`
  display: flex;
`;

const OddItem = styled.div`
  padding: 4px;
  border-radius: 5px;
  background-color: ${props => props.color};
  font-size: 13px;
  line-height: 15px;
  color: white;
  font-weight: 400;
  text-align: center;
  width: 53px;

  + div {
    margin-left: 10px;
  }
`;

const TableTitle = styled.div`
  font-size: 13px;
  line-height: 15px;
  font-weight: bold;
  color: ${THEME_COLORS.BRAND};
  margin: 28px 0 10px;
`;

class Odds extends Component {
  constructor(props) {
    super(props);

    this.state = {
      activeTour: 0
    };
  }

  componentDidMount() {
    this.props.loadOdds();
  }

  getOddsCell = (colors, values) => (
    <OddItems>
      {values.map((value, index) => (
        <OddItem color={colors[index]} key={`odds-${index}`}>
          {value}/1
        </OddItem>
      ))}
    </OddItems>
  );

  onChange = index => {
    this.setState({ activeTour: index });
  };

  render() {
    // const oddColors = [
    //   `${THEME_COLORS.GREY}`,
    //   `${THEME_COLORS.ORANGE}`,
    //   `${THEME_COLORS.BLUE}`
    // ];

    const { odds, loading } = this.props;
    const { activeTour } = this.state;

    const tourList = [];
    const oddList = [];

    if (loading === STATUS.SUCCESS) {
      odds.forEach((odd, index) => tourList.push({
        text: odd.name,
        value: index
      }))

      if (odds[activeTour] && odds[activeTour].competitors) {
        odds[activeTour].competitors.forEach(comp => {
          oddList.push({
            name: comp.name,
            odds: comp.books[0].odds,
            westgage: comp.books[0].odds
          });
        })
      }
    }

    let trending = [];
    if (window.cApplicationLocal) {
      trending = window.cApplicationLocal.trending;
    }

    return (
      <div>
        <Page>
          <MainContent hasRight>
            <Wrapper>
              <Title>{window.cApplicationLocal.pageHeadline || 'Odds to Win'}</Title>
              <TabletOnly>
                {loading === STATUS.SUCCESS ? (
                  <div>
                    <TableTitle>SELECT TOURNAMENT</TableTitle>
                    {!!tourList.length && (
                      <Dropdown
                        items={tourList}
                        activeItem={tourList[activeTour]}
                        onChange={this.onChange}
                      />
                    )}
                    <PlayerTable titles={ODDS_DESKTOP_TITLE} list={oddList} />
                  </div>
                ) : (
                  <Loading />
                )}
              </TabletOnly>
              <MobileOnly>
                {/* <Subtitle>Players Championship</Subtitle>
                <Subtitle normal>May 10-13, 2018</Subtitle>
                <OddTypeList>
                  {oddColors.map((odd, index) => (
                    <OddType color={odd} key={`oddtype-${index}`}>
                      Provider #{index + 1}
                    </OddType>
                  ))}
                </OddTypeList> */}
                <TableTitle>SELECT TOURNAMENT</TableTitle>
                {loading === STATUS.SUCCESS ? (
                  <div>
                    {!!tourList.length && (
                      <Dropdown
                        items={tourList}
                        activeItem={tourList[this.state.activeTour]}
                        onChange={this.onChange}
                      />
                    )}
                    <PlayerTable titles={ODDS_TITLE} list={oddList} />
                  </div>
                ) : (
                  <Loading />
                )}
              </MobileOnly>
            </Wrapper>
          </MainContent>
          <SidebarRight>
            <SidebarWidget title="TRENDING STORIES">
              <TrendingStories stories={trending} />
            </SidebarWidget>
            <SidebarWidget>
              <ContentPromo />
            </SidebarWidget>
          </SidebarRight>
        </Page>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  odds: state.golf.odds,
  loading: state.golf.loading.odds,
});

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      loadOdds
    },
    dispatch
  );

export default connect(mapStateToProps, mapDispatchToProps)(Odds);
