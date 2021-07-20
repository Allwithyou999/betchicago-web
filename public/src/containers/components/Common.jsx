import { THEME_COLORS } from '../../modules/styles';
import styled from 'styled-components';

export const TableTitle = styled.div`
  font-size: 13px;
  line-height: 15px;
  font-weight: bold;
  color: ${THEME_COLORS.BRAND};
  margin: 5px 0 10px;
  margin-top: 28px;

  ${props => props.noTop && `
    margin-top: 0;
  `}
`;

export const BoardLink = styled.div`
  margin-top: 15px;
  display: flex;
  justify-content: center;
  align-items: center;
  ${props => props.left && `
    justify-content: flex-start;
  `}

  a {
    font-weight: normal;
    font-size: 15px;
    line-height: 18px;
    color: ${THEME_COLORS.BLUE};
    margin-right: 10px;
    text-decoration: none;
    outline: none;

    ${props => props.small && `
      font-size: 11px;
      line-height: 13px;
      font-weight: 600;
      margin-top: 2px;
      margin-right: 5px;
    `};
  }
`;
