import styled from 'styled-components';
import { media } from '../../../components/common/styles';

const Wrapper = styled.div`
  ${media.tablet} {
    h1 {
      font-weight: 300;
    }
  }

  ${media.desktop} {
    padding-right: 30px;
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
`;

export { TitleHolder, Wrapper };
