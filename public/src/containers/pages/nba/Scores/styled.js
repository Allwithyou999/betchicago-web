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
