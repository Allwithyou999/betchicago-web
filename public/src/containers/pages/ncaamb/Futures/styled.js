import styled from 'styled-components';
import { media } from '../../../components/common/styles';

export default styled.div`
  margin-top: 20px;
  ${media.mobile} {
    margin-top: 0px;
  }
  .futures-header {
    display: flex;
    justify-content: space-between;
    flex-direction: column;
    .title {
      display: flex;
      align-items: center;
      margin-left: 20px;
      font-size: 25px;
      line-height: 28px;
      font-weight: 300;
      ${media.mobile} {
        display: none;
      }
    }
    .subtitle {
      display: flex;
      align-items: center;
      margin-left: 20px;
      font-size: 15px;
      line-height: 28px;
      font-weight: 300;
      color: #999;
    }
  }

  .Future-Teams {
    display: flex;
    flex-direction: column;
    padding: 15px;
    margin-top: 15px;
    div {
      display: flex;
      justify-content: space-between;
    }
    div:last-child {
      border-bottom: 1px solid #ccc;
      width: 100%;
      height: 1px;
      margin-top: 10px;
    }
    .Future-Team-Heading {
      font-weight: bold;
      border-bottom: 1px solid #ccc;
      padding: 10px 0;
    }
    .Future-Team-Row {
      padding: 5px 10px;
      span {
        display: flex;
        align-items: center;
      }
      .team-img {
        width: 40px;
        height: 40px;
        margin-right: 10px;
      }
    }
    .Future-Team-Row:nth-child(odd) {
      background: #eee;
    }
  }
  .loadingWrapper {
    justify-content: center;
    display: flex;
  }
  .Future-Footer {
    padding: 15px;
    color: #999;
  }
`;
