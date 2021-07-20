import React from 'react';
import styled from 'styled-components';

import Page, { MainContent } from '../../../containers/components/Layout';

const Wrapper = styled.div``;

const Title = styled.h1`
`;

const MustBe21ToRegister = () => (
  <div>
    <Page>
      <MainContent hasRight>
        <Wrapper>
          <Title>Must be 21 years of age to register</Title>
        </Wrapper>
      </MainContent>
    </Page>
  </div>
);

export default MustBe21ToRegister;
