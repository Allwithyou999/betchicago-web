import React from 'react';
import styled from 'styled-components';

const Holder = styled.div`
  ${props => props.w100 && `
    width: 100px;
  `}

  img {
    width: 100%;
    height: auto;
  }
`

const ArticleImage = ({src, alt, ...props}) => (
  <Holder w100={props.w100}>
    {src &&
      <img src={src} alt={alt} />
    }
  </Holder>
);

export default ArticleImage;
