import styled from 'styled-components';
import { media } from '../../../components/common/styles';

export default styled.div`
  margin-top: 20px;
  position: relative;
  ${media.mobile} {
    margin-top: 0px;
  }
  .schedule-header {
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
  }
  .schedule-time-heading {
    display: flex;
    justify-content: space-between;
    padding: 20px 20px 0px;
  }

  .no-items {
    text-align: center;
    margin-top: 80px;
  }
`;
