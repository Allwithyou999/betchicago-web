import React from 'react';
import styled from 'styled-components';

import PlayerTable from '../players/PlayerTable';

const Wrapper = styled.div`

`

const Title = styled.div`
  display: flex;
  align-items: center;
  font-size: 19px;
  line-height: 29px;
  margin-bottom: 10px;
  padding: 5px;

  span {
    margin-left: 5px;
  }

  ${props => props.right && `
    flex-direction: row-reverse;

    span {
      margin-left: 0;
      margin-right: 5px;
    }
  `}
`

function ScoreTable(props) {
  const { logo, title, tableTitle, score, color, right } = props;

  return (
    <Wrapper>
      {!!title &&
        <Title right={right}>
         {logo && (
           <img src={logo} alt="teamlogo" width="40" height="40" />           
         )}
          <span>{title}</span>
        </Title>
      }
      <PlayerTable titles={tableTitle} list={score.score} footer={score.total} headerColor={color} tableSmall />
    </Wrapper>
  )
}

export default ScoreTable;
