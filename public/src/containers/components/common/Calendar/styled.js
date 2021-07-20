import styled from 'styled-components';
import { media, THEME_COLORS } from '../styles';

export default styled.div`
  display: inline-flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 10px;
  margin: 0px -20px 20px;
  background: ${THEME_COLORS.BLUE};

  ${media.tablet} {
    max-width: 460px;
    padding: 0;
    background: transparent;
    margin: 10px 10px 0px 0px;
  }
  ${media.mobile} {
    width: 100%;
  }

  ${media.desktop} {
    margin: 10px 10px 0px 0px;
  }
  .icon-holder {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 28px;
    height: 28px;
    background: ${THEME_COLORS.BLUE};
    border-radius: 50%;
    font-size: 0;
    margin: 0 7px;
    cursor: pointer;
  }

  .day-items {
    display: inline-flex;
    justify-content: space-around;
    align-items: center;
    max-width: 335px;
    width: 100%;
    cursor: pointer;
  }
`;
