import styled from 'styled-components';
import { media } from '../styles';

export default styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  margin: 10px;

  .rankings-table {
    width: 100%;
    .rankings-row {
      &:nth-child(even) {
        background-color: #f2f2f2;
      }
      margin: 10px 0;
      padding: 10px;
      display: flex;
      .rank-num {
        width: 30px;
        font-size: 20px;
        padding-top: 10px;
      }
      .rank-data {
        display: flex;
        flex-direction: column;
        .rank-name {
          font-size: 20px;
          margin-bottom: 5px;
          display: flex;
          align-items: center;
          > span {
            color: #959595;
            font-size: 17px;
            font-weight: 300;
            margin-left: 5px;
          }
          > img {
            width: 40px;
            height: 40px;
            margin-right: 10px;
          }
        }
        .next-game {
          span:nth-child(2) {
            color: #0064c6;
          }
          span:nth-child(5) {
            color: #353535;
          }
          span:nth-child(3) {
            ${media.mobile} {
              display: none;
            }
          }
          .item-break {
            display: none;
            ${media.mobile} {
              display: block;
              height: 5px;
            }
          }
        }
      }
    }
  }

  .no-items {
    text-align: center;
    margin-top: 80px;
  }
`;
