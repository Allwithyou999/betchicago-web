import React from 'react';
import styled from 'styled-components';

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  position: relative;
`

const Mark = styled.div`
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  background: white;
  padding: 4px 10px 0;
  font-size: 15px;
  line-height: 18px;
  font-weight: 700;
`

const TeamBack = styled.div`
  background: ${props => props.color} url(${props => props.img}) no-repeat center right;
  background-size: auto 100%;
  width: 50%;
  height: 85px;
  padding: 5px 50px;
  text-align: right;
  display: flex;
  justify-content: flex-end;
  align-items: center;

  ${props => props.left && `
    background-position: center left;
    text-align: left;
    justify-content: flex-start;
  `}

  @media (max-width: 1275px) {
    background-position: left center;

    ${props => props.left && `
      background-position: right center;
    `}
  }

  @media (max-width: 767px) {
    height: 50px;
  }
`

const Detail = styled.div`
  display: inline-flex;
  align-items: center;

  @media (max-width: 767px) {
    display: none;
  }
`

const Score = styled.span`
  display: inline-block;
  vertical-align: top;
  color: white;
  font-size: 11px;
  line-height: 13px;
  font-weight: 600;
  margin: 6px 7px 0;
`

const Team = styled.div`
  font-size: 19px;
  line-height: 23px;
  color: white;
  font-weight: 700;
  margin-right: 9px;

  ${props => props.right && `
    margin-left: 9px;
    margin-right: 0;
  `}

  b {
    font-size: 29px;
    line-height: 35px
  }
`

const CurrScore = styled.div`
  font-size: 17px;
  line-height: 20px;
  font-weight: 600;
  color: white;
  margin-left: 34px;

  ${props => props.right && `
    margin-right: 34px;
    margin-left: 0;
  `}

  b {
    font-size: 29px;
    line-height: 35px;
  }
`


function TeamHeader(props) {
  const { coverage, odd } = props;
  let game = coverage.summary.game;

  let homeOdd = '--',
      awayOdd = '--';

  if (odd) {
    let markets = odd.markets;
    let id = '17084';

    markets[0].books.forEach(book => {
      if (book.id.indexOf(id) !== -1) {
        book.outcomes.forEach(outcome => {
          if (outcome.type === 'home') {
            homeOdd = outcome.odds;
          } else {
            awayOdd = outcome.odds;
          }
        })
      }
    })
  }

  return (
    <div>
      {!!game &&
        <Wrapper>
          <Mark>AT</Mark>
            {coverage.away_back && (
              <TeamBack color={coverage.away_color} img={coverage.away_back}>
                <Detail>
                  <Team><div><Score>({game.away.win}-{game.away.loss})</Score> {game.away.market.toUpperCase()}</div><b>{game.away.name.toUpperCase()}</b></Team>
                  <img src={coverage.away_logo} width="60" height="60" alt="away" />
                  <CurrScore>
                    {game.status !== 'scheduled' &&
                      <b>{game.away.runs}</b>
                    }
                    <div>{awayOdd}</div>
                  </CurrScore>
                </Detail>
              </TeamBack>
            )}
            {coverage.home_back && (
              <TeamBack color={coverage.home_color} img={coverage.home_back} left>
                <Detail>
                  <CurrScore right>
                    {game.status !== 'scheduled' &&
                      <b>{game.home.runs}</b>
                    }
                    <div>{homeOdd}</div>
                  </CurrScore>
                  <img src={coverage.home_logo} width="60" height="60" alt="home" />
                  <Team right><div>{game.home.market.toUpperCase()} <Score>({game.home.win}-{game.home.loss})</Score></div><b>{game.home.name.toUpperCase()}</b></Team>
                </Detail>
              </TeamBack>
            )}
        </Wrapper>
      }
    </div>
  )
}

export default TeamHeader;
