import React, { Component } from 'react';
import styled from 'styled-components';
import { db } from '../../../apis/firebase';

import ContentPromo from '../../../containers/components/ContentPromo';
import Page, { MainContent, SidebarRight } from '../../../containers/components/Layout';
import SidebarWidget from '../../../containers/components/SidebarWidget';
import media from '../../../containers/components/Media';

const Wrapper = styled.div`

  ${media.tablet} {
    h1 {
      font-weight: 300;
    }
  }
`
const OddsTable = styled.table`
  tr {
    bottom-margin: 20px;
  }
`;

class OddsSheetViewer extends Component {
  constructor(props) {
    super(props);

    this.oddsSheet = {};

  }

  componentDidMount() {
    if (window.cApplicationLocal) {
      let queryKey = 'NFL';
      if (window.cApplicationLocal.componentSlugData)
        queryKey = window.cApplicationLocal.componentSlugData.queryKey;

      db().ref(`sportRadarStore/odds/sheets/${queryKey}`).once('value')
        .then(oddsSheet => {
          this.oddsSheet = oddsSheet.val();
          return this.forceUpdate();
        })
        .catch(e => {
          console.log('failed to load odds ', e);
        });
    }
  }

  filterOdds = (event) => {
    let wh2way = {};
    let whspread = {};
    let whtotal = {};
    let wg2way = {};
    let wgspread = {};
    let wgtotal = {};

    if (event.markets) {
      for (let c = 0, l = event.markets.length; c < l; c++) {
        let mk = event.markets[c];
        if (mk.name === '2way') {
          for (let oddCtr = 0; oddCtr < mk.books.length; oddCtr++) {
            let b = mk.books[oddCtr];
            if (b.id === 'sr:book:17084')
              wg2way = b;
            if (b.id === 'sr:book:17100')
              wh2way = b;
          }
        }
        if (mk.name === 'spread') {
          for (let oddCtr = 0; oddCtr < mk.books.length; oddCtr++) {
            let b = mk.books[oddCtr];
            if (b.id === 'sr:book:17084')
              whspread = b;
            if (b.id === 'sr:book:17100')
              wgspread = b;
          }
        }
        if (mk.name === 'total') {
          for (let oddCtr = 0; oddCtr < mk.books.length; oddCtr++) {
            let b = mk.books[oddCtr];
            if (b.id === 'sr:book:17084')
              whtotal = b;
            if (b.id === 'sr:book:17100')
              wgtotal = b;
          }
        }
      }
    }
    let oddsF = {
      wh2way,
      whspread,
      whtotal,
      wg2way,
      wgspread,
      wgtotal
    };

    for (let item in oddsF) {
      let oddItem = oddsF[item];

      if (!oddItem.outcomes)
        continue;
      if (oddItem.outcomes[0].type === 'home') {
        oddItem.home = oddItem.outcomes[0];
        oddItem.away = oddItem.outcomes[1];
      } else {
        oddItem.home = oddItem.outcomes[1];
        oddItem.away = oddItem.outcomes[0];
      }

    }

    return oddsF;
  }

  render() {
    let oddsList = [];
    for (let i in this.oddsSheet) {
      let event = this.oddsSheet[i];
      let c1 = event.competitors[0];
      let c2 = event.competitors[1];

      if (c1.qualifier === 'home'){
        event.homeTeam = c1;
        event.awayTeam = c2;
      } else {
        event.homeTeam = c2;
        event.awayTeam = c1;
      }

      event.showDate = '';
      if (event.scheduled) {
        event.showDate = event.scheduled.substr(0,10) + ' ' + event.scheduled.substr(11, 5);
      }

      event.oddsFiltered = this.filterOdds(event);
      oddsList.push(event);
    }

    console.log(oddsList);

    return (
      <div>
        <Page>
          <MainContent hasRight>
            <Wrapper>
              <h1>Odds</h1>
              <OddsTable>
              <tr><th></th><th>Team</th><th>Westgate</th><th></th><th></th><th> &nbsp;  &nbsp;  &nbsp;  &nbsp; </th><th>William Hill</th><th></th><th></th></tr>
              {oddsList.map((odd, index) => (
                <tr>
                  <td>
                    {odd.showDate}
                  </td>
                  <td>
                    {odd.awayTeam.name}
                    <br />
                    at
                    <br />
                    {odd.homeTeam.name}
                  </td>
                  <td>
                    { odd.oddsFiltered.wgspread.away && (
                      <div>
                        {odd.oddsFiltered.wgspread.away.spread} {odd.oddsFiltered.wgspread.away.odds}
                        <br />
                        <br />
                        {odd.oddsFiltered.wgspread.home.spread} {odd.oddsFiltered.wgspread.home.odds}
                      </div>
                    )}
                  </td>
                  <td>
                    { odd.oddsFiltered.wgtotal.away && (
                      <div>
                        T {odd.oddsFiltered.wgtotal.away.total} {odd.oddsFiltered.wgtotal.away.odds}
                        <br />
                        <br />
                        T {odd.oddsFiltered.wgtotal.home.total} {odd.oddsFiltered.wgtotal.home.odds}
                      </div>
                    )}
                  </td>
                  <td>
                    { odd.oddsFiltered.wg2way.away && (
                      <div>
                        To Win{odd.oddsFiltered.wg2way.away.odds}
                        <br />
                        <br />
                        To Win {odd.oddsFiltered.wg2way.home.odds}
                      </div>
                    )}
                  </td>
                  <td></td>
                  <td>
                    { odd.oddsFiltered.whspread.away && (
                      <div>
                        {odd.oddsFiltered.whspread.away.spread} {odd.oddsFiltered.whspread.away.odds}
                      <br />
                      <br />
                      {odd.oddsFiltered.whspread.home.spread} {odd.oddsFiltered.whspread.home.odds}
                      </div>
                    )}
                  </td>
                  <td>
                  { odd.oddsFiltered.whtotal.away && (
                    <div>
                      T {odd.oddsFiltered.whtotal.away.total} {odd.oddsFiltered.whtotal.away.odds}
                      <br />
                      <br />
                      T {odd.oddsFiltered.whtotal.home.total} {odd.oddsFiltered.whtotal.home.odds}
                      </div>
                    )}
                  </td>
                  <td>
                  { odd.oddsFiltered.wh2way.away && (
                    <div>
                      To Win{odd.oddsFiltered.wh2way.away.odds}
                      <br />
                      <br />
                      To Win {odd.oddsFiltered.wh2way.home.odds}
                      </div>
                    )}
                  </td>
                </tr>
              ))}
              </OddsTable>
            </Wrapper>
          </MainContent>
          <SidebarRight>
            <SidebarWidget title="ODDS & BETTING HEADLINES">
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

export default OddsSheetViewer;
