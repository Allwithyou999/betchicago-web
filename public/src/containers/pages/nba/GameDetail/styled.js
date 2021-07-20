import styled from 'styled-components';
import { media } from '../../../components/common/styles';

export default styled.div`
  display: flex;
  background: #fafafa;
  max-width: 1318px;
  margin: auto;
  z-index: 999;

  ${media.mobile} {
    top: -50px;
  }
  .team-img {
    width: 60px;
    height: 60px;
  }
  > div {
    width: 100%;
    > div {
      padding: 15px;
    }
    .scheduleDetail-Header {
      display: flex;
      justify-content: center;
      height: 150px;
      align-items: center;
      .team-img {
        width: 60px;
        height: 60px;
      }
      > span {
        padding: 0 50px;
        font-size: 20px;
      }
      > div {
        display: flex;
        align-items: center;
        .schDetail-team {
          display: flex;
          align-items: center;
          justify-content: center;
          flex-direction: column;
          ${media.mobile} {
            flex-direction: row;
            span {
              margin-left: 10px;
            }
          }
        }
        .schDetail-point {
          font-size: 35px;
          padding: 0 50px;
          ${media.mobile} {
            padding: 0px;
          }
        }
        &.schDetail-header-away {
          flex-direction: row-reverse;
          ${media.mobile} {
            flex-direction: row;
          }
        }
        ${media.mobile} {
          justify-content: space-between;
          margin-bottom: 15px;
        }
      }
      ${media.mobile} {
        flex-direction: column;
        align-items: initial;
        padding-top: 45px;
        padding-bottom: 0px;
        > span {
          display: none;
        }
      }
    }

    .scheduleDetail-venue {
      display: flex;
      justify-content: space-between;
    }

    .scheduleDetail-score {
      background: white;
      margin-bottom: 20px;
      border-bottom: 1px solid #ccc;
      border-top: 1px solid #ccc;
      span:first-child {
        font-weight: bold;
      }
      .scheduleDetail-score-heading {
        padding: 8px 0;
        font-size: 22px;
      }
      .scheduleDetail-score-row {
        display: flex;
        padding: 8px 0;
        border-bottom: 1px solid #ccc;
        span {
          width: 50px;
          text-align: center;
        }
        span:first-child {
          flex: 1;
          text-align: left;
          font-size: 20px;
        }
        span:last-child {
          font-weight: bold;
        }
      }
      div:nth-child(2) {
        span {
          font-weight: bold !important;
        }
        span:first-child {
          font-size: 16px !important;
        }
      }
      .scheduleDetail-score-leader {
        padding-top: 10px;
        color: #aaa;
        font-size: 14px;
      }
    }

    .scheduleDetail-team-stats {
      background: white;
      margin-bottom: 20px;
      border-bottom: 1px solid #ccc;
      border-top: 1px solid #ccc;
      div {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 8px 0px;
        border-bottom: 1px solid #ccc;
        span {
          font-weight: bold;
          .gray {
            font-weight: normal;
            color: #aaa;
          }
        }
        span:nth-child(2) {
          font-weight: normal;
        }
      }
      .scheduleDetail-team-stats-heading {
        span:nth-child(2) {
          font-weight: bold;
        }
      }
    }
    .scheduleDetail-player-stats {
      padding: 0px;
    }
  }
`;
