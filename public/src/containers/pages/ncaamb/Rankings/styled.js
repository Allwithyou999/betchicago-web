import styled from 'styled-components';
import { media } from '../../../components/common/styles';

export default styled.div`
  margin-top: 20px;
  ${media.mobile} {
    margin-top: 0px;
  }
  .rankings-header {
    display: flex;
    justify-content: space-between;
    .title {
      display: flex;
      justify-content: center;
      align-items: center;
      margin-left: 20px;
      font-size: 25px;
      line-height: 28px;
      font-weight: 300;
      ${media.mobile} {
        display: none;
      }
    }
    .updated-date {
      display: flex;
      justify-content: center;
      align-items: center;
      margin-right: 20px;
      font-size: 18px;
      color: #959595;
      line-height: 28px;
      font-weight: 300;
      ${media.mobile} {
        display: none;
      }
    }
  }

  .select-container {
    align-items: center;
    display: flex;
    max-width: 500px;
    width: 100%;
    ${media.mobile} {
      flex-direction: column;
      align-items: flex-start;
    }
    > label {
      margin-left: 20px;
      ${media.mobile} {
        margin-top: 20px;
      }
    }
  }

  .conference-select {
    width: calc(100% - 40px);
    margin: 0 20px;
    ${media.mobile} {
      margin: 20px;
    }
  }
`;
