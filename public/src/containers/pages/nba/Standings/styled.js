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

export { Wrapper };
