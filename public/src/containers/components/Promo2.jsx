import React from 'react';
import styled from 'styled-components';

import { CloseIcon } from './Icons';

import { THEME_COLORS } from '../../modules/styles';

const Wrapper = styled.div`
  display: flex;
  padding: 17px 20px 12px 10px;
  justify-content: space-between;
  background: ${THEME_COLORS.BRAND};
  color: white;

  ${props => props.white && `
    color: ${THEME_COLORS.BLACK};
    background: transparent;
    display: block;
    padding: 0;
  `}
`

const Button = styled.div`
  display: inline-block;
  cursor: pointer;
  height: 100%;
`

const H4 = styled.h4`
  line-height: 20px;
  font-weight: 400;
  ${props => props.emphasis && 'font-weight: 600;'}
`

const H6 = styled.h6`
  margin: 6px 0 9px;
  opacity: 0.8;
`

const VertText = styled.div`
  font-size: 11px;
  line-height: 13px;
  font-weight: 400;
  text-transform: uppercase;
  writing-mode: vertical-lr;
  transform: rotate(180deg);
  text-align: center;
  padding-left: 20px;
`

const Content = styled.div`
  flex: 1 0 1px;
`

function Promo2(props) {
  const { white, data } = props;

  return (
    <Wrapper white={white}>
      {!white &&
        <VertText>NEXT PAIRING</VertText>
      }
      <Content>
        <H4 emphasis>{data.title}</H4>
        <H6>{data.date}</H6>
        <H4>{data.players}</H4>
      </Content>
      {!white &&
        <Button><CloseIcon color="white" /></Button>
      }
    </Wrapper>
  );
}

export default Promo2;
