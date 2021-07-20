import React, { Component } from 'react';
import styled from 'styled-components';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import ContentPromo from '../../../containers/components/ContentPromo';
import Page, { MainContent, SidebarRight } from '../../../containers/components/Layout';
import SidebarWidget from '../../../containers/components/SidebarWidget';
import TrendingStories from '../../../containers/components/TrendingStories';
import Loading from '../../../containers/components/Loading';
import ScoreItem from '../../../containers/components/baseball/ScoreItem';
import CalendarDay from '../../../containers/components/baseball/CalendarDay';
import media from '../../../containers/components/Media';

import { loadScoreboardData, loadTeamSlugs, loadOdds } from '../../../apis/mlb';
import { getTrendingStories } from '../../../modules/local-service';
import { formatDateFull } from '../../../modules/utilities/formatter';

import { MobileOnly } from '../../components/Layout';
import { STATUS } from '../../../modules/constants/common';

const Wrapper = styled.div`

  ${media.tablet} {
    h1 {
      font-weight: 300;
    }
  }

  ${media.desktop} {
    padding-right: 30px;
  }
`;

const TitleHolder = styled.div`
  display: flex;
  justify-content: space-between;
  flex-direction: column-reverse;
  padding-top: 20px;

  ${media.tablet} {
    flex-direction: column;
  }

  ${media.desktop} {
    flex-direction: row;
  }
`

const Scores = styled.div`
  margin-top: 50px;
`

const Producer = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 10px;
`

const ProducerDetail = styled.div`
  margin-left: 10px;

  div {
    font-size: 12px;
    line-height: 14px;
    font-weight: 400;
    margin-bottom: 3px;

    b {
      font-weight: 700;
      margin-right: 3px;
    }
  }
`

const ScoreHolder = styled.div`
  display: flex;
  justify-content: space-between;
  flex-direction: column;

  ${media.desktop} {
    flex-direction: row;
  }
`

const ScoreSingle = styled.div`
  display: flex;
  justify-content: flex-start;
`

const Liner = styled.div`
  width: 20px;
  flex-shrink: 0;
`

class Scoreboards extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isFinal: false,
      showTourList: false,
      date: new Date(),
    }
  }

  componentDidMount() {
    this.props.loadScoreboardData(formatDateFull(new Date(this.state.date)));
    this.props.loadOdds(new Date(this.state.date));
    this.props.loadTeamSlugs();
  }

  onChangeDate = date => {
    this.setState({ date });
    setTimeout(() => {
      this.props.loadScoreboardData(formatDateFull(new Date(this.state.date)));
      this.props.loadOdds(new Date(this.state.date));
    });
  }

  buildProducer = (producer, index) => (
    <Producer key={`producer-${index}`}>
      <img src={producer.img} alt="producer" />
      <ProducerDetail>
        <div><b>{producer.name}</b>{producer.pos}</div>
        <div>{producer.detail}</div>
      </ProducerDetail>
    </Producer>
  )

  buildScoreItems = () => {
    const { slugs, odds } = this.props;
    let { scoreboard } = this.props;

    const items = [];

    if (!scoreboard || !scoreboard.league.games) return [];

    scoreboard.league.games
      .sort((a, b) => new Date(a.game.scheduled).getTime() - new Date(b.game.scheduled).getTime())
      .forEach((item) => {
        let game = item.game;

        Object.keys(slugs.slug).forEach(slug => {
          if (slugs.slug[slug].id === game.away_team) {
            game.away_logo = slugs.images.logo_60 + slug + '.png?alt=media';
            game.away_color = slugs.slug[slug]['bg-color'];
          } else if (slugs.slug[slug].id === game.home_team) {
            game.home_logo = slugs.images.logo_60 + slug + '.png?alt=media';
            game.home_color = slugs.slug[slug]['bg-color'];
          }
        });

        if (odds) {
          odds
            .filter(odd => new Date(odd.scheduled).getDate() === new Date(this.state.date).getDate())
            .forEach(odd => {
              let match = true;
              odd.competitors.forEach(c => {
                if (
                  (c.qualifier === 'home' && c.abbreviation !== game.home.abbr) ||
                  (c.qualifier === 'away' && c.abbreviation !== game.away.abbr)
                ) {
                  match = false;
                }
              })
              if (match) {
                game.odd = odd;
              }
            });
        }

        items.push(<ScoreItem game={game} noMargin />);
      })

    const result = [];
    for (let i = 0; i < items.length; i += 2) {
      if (i + 1 < items.length) {
        result.push(
          <ScoreHolder key={`score-${i}`}>
            {items[i]}
            <Liner />
            {items[i + 1]}
          </ScoreHolder>
        )
      } else {
        result.push(<ScoreSingle key={`single${i}`}>{items[i]}</ScoreSingle>);
      }
    }

    return result;

  }

  render() {

    const { loading, loadingSlugs } = this.props;

    const stories = getTrendingStories();
    // const producers = [
    //   {
    //     img: dodgersImage,
    //     name: 'Matt Kemp',
    //     pos: 'LF',
    //     detail: '3-4, R, HR(6), 3 RBI'
    //   },
    //   {
    //     img: bluejaysImage,
    //     name: 'Nicholas Costellanos',
    //     pos: 'RF',
    //     detail: '3-4, 2 R, RBI'
    //   }
    // ];

    return (
      <div>
        <div>
          <Page>
            <MainContent hasRight>
              <Wrapper>
                <TitleHolder>
                  <MobileOnly>
                    <h6>Latest Scores and Money Lines</h6>
                  </MobileOnly>
                  <h1>{window.cApplicationLocal.pageHeadline || 'MLB Scoreboard'}</h1>
                  <CalendarDay onChangeDate={this.onChangeDate} />
                </TitleHolder>
                {(loading === STATUS.REQUEST || loadingSlugs === STATUS.REQUEST) ? (
                  <Loading />
                ) : (
                  <Scores>
                    {this.buildScoreItems()}
                  </Scores>
                )}

              </Wrapper>
            </MainContent>
            <SidebarRight>
              {/* <SidebarWidget title="TOP PRODUCERS">
                {
                  producers.map((producer, index) => this.buildProducer(producer, index))
                }
              </SidebarWidget> */}
              <SidebarWidget title="TRENDING STORIES">
                <TrendingStories stories={stories} />
              </SidebarWidget>
              <SidebarWidget>
                <ContentPromo />
              </SidebarWidget>
            </SidebarRight>
          </Page>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  scoreboard: state.mlb.scoreboard,
  slugs: state.mlb.slugs,
  odds: state.mlb.odds,
  loading: state.mlb.loading.scoreboard,
  loadingSlugs: state.mlb.loading.slugs,
  loadingOdds: state.mlb.loading.odds,
});

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      loadScoreboardData,
      loadTeamSlugs,
      loadOdds,
    },
    dispatch
  );

export default connect(mapStateToProps, mapDispatchToProps)(Scoreboards);
