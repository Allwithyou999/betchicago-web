import styled from 'styled-components';
import { media } from '../styles';

export default styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  margin: 10px;
  > div {
    width: 100%;
    justify-content: center;
    display: flex;
    align-items: center;
    flex-direction: column;
  }

  .teams-table {
    width: 100%;
    > div {
      &:nth-child(even) {
        background-color: #f2f2f2;
      }
    }
  }

  .teams-header {
    border-top: 1px solid rgb(218, 218, 226);
    border-bottom: 1px solid rgb(218, 218, 226);
    > div {
      font-weight: 500 !important;
      font-size: 11px !important;
    }
  }

  .teams {
    display: flex;
    width: 100%;
    cursor: pointer;
    > div {
      display: inline-block;
      font-size: 13px;
      line-height: 18px;
      font-weight: 300;
      padding: 10px 5px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      flex: 2;
    }
    .name {
      flex: 8;
      display: flex;
      align-items: center;
    }
    .team-img {
      width: 40px;
      height: 40px;
      margin-right: 10px;
    }
  }
  .no-items {
    text-align: center;
    margin-top: 80px;
  }
`;

export const TeamClose = styled.button`
  position: absolute;
  top: 10px;
  left: 10px;
  z-index: 99999 ${media.mobile} {
    top: 10px;
  }
`;
