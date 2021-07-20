import React from 'react';
import styled from 'styled-components';

import { LoadingIcon } from './Icons';

const Wrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`

const Promo = ({ data }) => (
  <Wrapper>
    <LoadingIcon />
  </Wrapper>
);

export default Promo;
