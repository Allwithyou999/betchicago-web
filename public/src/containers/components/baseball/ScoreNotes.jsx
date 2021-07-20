import React from 'react';
import styled from 'styled-components';

import { THEME_COLORS } from '../../../modules/styles';

const Wrapper = styled.div`
  font-size: 11px;
  line-height: 20px;
  padding: 20px 5px;

  b {
    font-weight: 700;
  }
`

const Title = styled.div`
  display: inline-block;
  line-height: 13px;
  font-weight: 600;
  border-bottom: 1px solid ${THEME_COLORS.BLUE};
  margin-bottom: 16px;
`

function ScoreNotes(props) {
  const { title } = props;
  return (
    <Wrapper>
      <Title>{title.toUpperCase()}</Title>
      <div><b>2B:</b> Longoria 2 (16)</div>
      <div><b>3B:</b> Hernandez (2)</div>
      <div><b>HR:</b> Hernandez (6)</div>
      <div><b>TB:</b> Longoria 5; Hernandez 5; Tomlinson 2; Sandoval; McCutchen; Posey; Belt</div>
      <div><b>RBI:</b> Longoria 3 (27); Sandoval (14); Hernandez (9)</div>
      <div><b>SB:</b> Tomlinson (3)</div>
    </Wrapper>
  )
}

export default ScoreNotes;
