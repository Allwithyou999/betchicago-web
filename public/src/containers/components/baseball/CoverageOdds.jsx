import React from 'react';
import styled from 'styled-components';

import media from '../../../containers/components/Media';
import { TabletOnly, MobileOnly } from '../Layout';
import { formatDateFull, formatAMPM, getTimezone } from '../../../modules/utilities/formatter';

const Wrapper = styled.div`

`

const Disclaimer = styled.h6`
  font-size: 11px;
  line-height: 13px;
  font-weight: 400;
  text-align: center;
  margin-bottom: 40px;
`

const Tables = styled.div`
  display: flex;
  align-items: flex-start;
  margin-bottom: 20px;
`

const Table = styled.div`
  width: ${props => props.width || '25%'};

  ${props => props.center && `
    text-align: center;
  `}

  ${media.max.mobile} {
    width: 100%;
  }
`

const Title = styled.div`
  font-size: 11px;
  line-height: 15px;
  padding: 8px 14px 7px;
  border-bottom: 1px solid #C8C8C8;
  background-color: ${props => props.color};
  color: white;

  ${props => props.center && `
    text-align: center;
  `}

  ${props => props.big && `
    font-size: 13px;
    line-height: 15px;
    font-weight: bold;
  `}

`

const Row = styled.div`
  display: flex;
`

const Cell = styled.div`
  border-left: 1px solid #C8C8C8;
  border-bottom: 1px solid #C8C8C8;
  font-size: 13px;
  line-height: 15px;
  padding: 10px 0;

  ${props => props.left && `
    padding-left: 14px;
  `}

  ${props => props.last && `
    border-right: 1px solid #C8C8C8;
  `}

  ${props => props.emphasis && `
    font-size: 9px;
    line-height: 11px;
    background: #F2F2F2;
    padding: 6px 14px 7px;
  `}

  ${props => props.empty && `
    border-left: none;
    border-bottom: none;
  `}

  ${props => props.first && `
    border-left: none;
  `}

  width: ${props => props.width || '50%'};

  ${media.max.mobile} {
    text-align: center !important;
    border: none !important;

    ${props => props.emphasis && `
      color: #909090;
    `}

    ${props => props.mobileRight && `
      text-align: right !important;
    `}

    &:first-child {
      text-align: left !important;
      padding-left: 10px;
    }

    &:last-child {
      text-align: right !important;
      padding-right: 10px;
    }
  }
`

const NotAvailable = styled.div`
  text-align: center;
  font-size: 29px;
  line-height: 35px;
  font-weight: bold;
  margin-bottom: 15px;
  padding: 100px 10px;
`

const generateTable = (odd, info, index) => {
  let homeId, awayId;
  odd.competitors.forEach((c, i) => {
    if (c.qualifier === 'home') awayId = i;
    if (c.qualifier === 'away') homeId = i;
  })

  let id = info.id;

  let moneyO = ['-', '-'];
  let moneyL = ['-', '-'];
  let spreadO = ['-', '-'];
  let spreadL = ['-', '-'];
  let spreadLI = ['-', '-'];
  let totalO = ['-', '-'];
  let totalL = ['-', '-'];
  let totalOI = ['-', '-'];
  let totalLI = ['-', '-'];
  let totalLL = ['-', '-'];

  let markets = odd.markets;

  !!markets[0] && markets[0].books.forEach(book => {
    if (book.id.indexOf(id) !== -1) {
      moneyL[0] = book.outcomes[homeId].odds;
      moneyL[1] = book.outcomes[awayId].odds;
      moneyO[0] = book.outcomes[homeId].opening_odds;
      moneyO[1] = book.outcomes[awayId].opening_odds;
    }
  })

  !!markets[2] && markets[2].books.forEach(book => {
    if (book.id.indexOf(id) !== -1) {
      spreadL[0] = book.outcomes[homeId].odds;
      spreadL[1] = book.outcomes[awayId].odds;
      spreadLI[0] = book.outcomes[homeId].spread;
      spreadLI[1] = book.outcomes[awayId].spread;
      spreadO[0] = book.outcomes[homeId].opening_odds;
      spreadO[1] = book.outcomes[awayId].opening_odds;
    }
  })
  !!markets[1] && markets[1].books.forEach(book => {
    if (book.id.indexOf(id) !== -1) {
      totalL[0] = book.outcomes[homeId].odds;
      totalL[1] = book.outcomes[awayId].odds;
      totalLI[0] = book.outcomes[homeId].total;
      totalLI[1] = book.outcomes[awayId].total;
      totalLL[0] = book.outcomes[homeId].type.substr(0, 1).toUpperCase();
      totalLL[1] = book.outcomes[awayId].type.substr(0, 1).toUpperCase();
      totalO[0] = book.outcomes[homeId].opening_odds;
      totalO[1] = book.outcomes[awayId].opening_odds;
      totalOI[0] = book.outcomes[homeId].opening_total;
      totalOI[1] = book.outcomes[awayId].opening_total;
    }
  })

  let timezone = getTimezone();

  return (
    <div key={`odd${index}`}>
      <TabletOnly>
        <Tables>
          <Table width="30%" first>
            <Title big color={info.color}>{info.title}</Title>
            <Row>
              <Cell width="60%" emphasis>LAST UPDATE</Cell>
              <Cell width="40%" emphasis last>TEAM</Cell>
            </Row>
            <Row>
              <Cell width="60%" left>{formatDateFull(new Date(odd.scheduled)).substr(5)} @ {formatAMPM(new Date(odd.scheduled)).toUpperCase()} {timezone}</Cell>
              <Cell width="40%" left last>{odd.competitors[homeId].abbreviation}</Cell>
            </Row>
            <Row>
              <Cell width="60%" empty></Cell>
              <Cell width="40%" left last>{odd.competitors[awayId].abbreviation}</Cell>
            </Row>
          </Table>
          <Table center width="20%">
            <Title first color={info.color}>MONEYLINE</Title>
            <Row>
              <Cell first width="45%" emphasis>OPEN</Cell>
              <Cell width="55%" emphasis last>LATEST</Cell>
            </Row>
            <Row>
              <Cell first width="45%">{moneyO[0]}</Cell>
              <Cell width="55%" last>{moneyL[0]}</Cell>
            </Row>
            <Row>
              <Cell first width="45%">{moneyO[1]}</Cell>
              <Cell width="55%" last>{moneyL[1]}</Cell>
            </Row>
          </Table>
          <Table center width="20%">
            <Title first color={info.color}>RUN LINE</Title>
            <Row>
              <Cell first width="45%" emphasis>OPEN</Cell>
              <Cell width="55%" emphasis last>LATEST</Cell>
            </Row>
            <Row>
              <Cell first width="45%">{spreadO[0]}</Cell>
              <Cell width="55%" last>{spreadL[0]}</Cell>
            </Row>
            <Row>
              <Cell first width="45%">{spreadO[1]}</Cell>
              <Cell width="55%" last>{spreadL[1]}</Cell>
            </Row>
          </Table>
          <Table center width="20%">
            <Title first color={info.color}>TOTAL</Title>
            <Row>
              <Cell first width="50%" emphasis>OPEN</Cell>
              <Cell width="50%" emphasis last>LATEST</Cell>
            </Row>
            <Row>
              <Cell first width="20%">{totalOI[0]}</Cell>
              <Cell width="30%">{totalO[0]}</Cell>
              <Cell width="50%" last>{totalLI[0]} / {totalLL[0]} {totalL[0]}</Cell>
            </Row>
            <Row>
              <Cell first width="20%">{totalOI[1]}</Cell>
              <Cell width="30%">{totalO[1]}</Cell>
              <Cell width="50%" last>{totalLI[1]} / {totalLL[1]} {totalL[1]}</Cell>
            </Row>
          </Table>
          <Table center width="10%">
            <Title first color={info.color}>FAVORITE</Title>
            <Row>
              <Cell width="100%" emphasis last>LATEST</Cell>
            </Row>
            <Row>
              <Cell width="100%" last>{totalLI[0]} / {totalLL[1]} {totalL[1]}</Cell>
            </Row>
            <Row>
              <Cell width="100%" last>{totalLI[1]} / {totalLL[0]} {totalL[0]}</Cell>
            </Row>
          </Table>
        </Tables>
      </TabletOnly>
      <MobileOnly>
        <Table>
          <Title big color={info.color}>{info.title}</Title>
          <Row>
            <Cell width="20%" emphasis>TEAM</Cell>
            <Cell width="25%" emphasis>MONEYLINE</Cell>
            <Cell width="25%" emphasis>RUN LINE</Cell>
            <Cell width="30%" emphasis>OVER/UNDER</Cell>
          </Row>
          <Row>
            <Cell width="20%">{odd.competitors[homeId].abbreviation}</Cell>
            <Cell width="25%">{moneyL[0]}</Cell>
            <Cell width="10%">{spreadLI[0]}</Cell>
            <Cell width="15%">{spreadL[0]}</Cell>
            <Cell width="10%" mobileRight>{totalLI[0]}</Cell>
            <Cell width="20%">{totalL[0]} {totalLL[0]}</Cell>
          </Row>
          <Row>
            <Cell width="20%">{odd.competitors[awayId].abbreviation}</Cell>
            <Cell width="25%">{moneyL[1]}</Cell>
            <Cell width="10%">{spreadLI[1]}</Cell>
            <Cell width="15%">{spreadL[1]}</Cell>
            <Cell width="10%" mobileRight>{totalLI[1]}</Cell>
            <Cell width="20%">{totalL[1]} {totalLL[1]}</Cell>
          </Row>
        </Table>
      </MobileOnly>
    </div>
  )
}

function CoverageOdds(props) {
  const { odd } = props;

  const list = [
    {
      title: 'WESTGATE',
      color: '#C29824',
      id: '17084'
    },
    {
      title: 'CG TECHNOLOGY',
      color: '#E8212A',
      id: '17089'
    },
    {
      title: 'WILLIAM HILL',
      color: '#032C4C',
      id: '17100'
    },
    {
      title: 'WYNN',
      color: '#65553E',
      id: '17101'
    },
    {
      title: 'PINNACLE',
      color: '#FC561F',
      id: '92'
    }
  ]

  if (!odd) {
    return (
      <Wrapper>
        <NotAvailable>No Odds Data</NotAvailable>
      </Wrapper>
    )
  }

  return (
    <Wrapper>
      <Disclaimer>Disclaimer: Odds information is provided for information purposes only. Contact your preferred licensed sport book for available odds and payout information.  </Disclaimer>
      {
        list.map((item, index) => generateTable(odd, item, index))
      }
    </Wrapper>
  )
}

export default CoverageOdds;
