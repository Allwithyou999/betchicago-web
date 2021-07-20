import styled from 'styled-components';
import { media } from '../../styles';

export default styled.div`
  display: flex;
  flex-direction: column;
  position: absolute;
  top: 0px;
  background: #fafafa;
  width: 100%;
  z-index: 999;
  ${media.mobile} {
    top: 0px;
  }
  .team-img {
    width: 60px;
    height: 60px;
  }
  .teamTable-heading {
    width: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    padding-top: 15px;
  }
  .teamTable-nav {
    width: 100%;
    margin-top: 10px;
    display: flex;
    padding: 10px 0;
    justify-content: center;
    span {
      margin: 0 15px;
      padding: 10px 0;
      cursor: pointer;
    }
    span.active {
      border-bottom: 4px solid #f05a24;
    }
  }
`;
