import React from 'react';
import styled from 'styled-components';

const Wrapper = styled.div`
  display: flex;
  align-items: center;

  > :first-child {
    text-align: right;
    width: 30%;
  }

  > :nth-child(2) {
    width: calc(20% - 21px);
  }

  > :nth-child(3) {
    padding: 10px;
  }

  > * {
    text-align: center;
    font-size: 11px;
    line-height: 20px;
  }

  > :last-child {
    text-align: left;
    padding-left: 6px;
  }
`

const Date = styled.span`
  text-transform: uppercase;
`

function ScheduleItem(props) {
  return (
    <div>
      <Wrapper>
        <Date>{props.date}</Date>
        <span>{props.isHome ? 'vs' : '@'}</span>
        <span>
        {props.logo && (        
          <img src={props.logo} width="20" height="20" alt={props.market} />
        )}
        </span>
        <span>{props.market}</span>
      </Wrapper>
    </div>
  )
}

export default ScheduleItem;
