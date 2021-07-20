import React from 'react';
import styled from 'styled-components';

import { UserSolidIcon } from './Icons';

const Holder = styled.div`
  width: 48px;
  height: 48px;
  border-radius: 50%;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #909090;

  img {
    width: 100%;
    height: auto;
  }
`

const AuthorImage = ({src, ...props}) => (
  <Holder>
    {src &&
      <img src={src} alt="Author" />
    }
    {!src &&
      <UserSolidIcon color="white" />
    }
  </Holder>
);

export default AuthorImage;
