import React from 'react';
import styled from 'styled-components';

import media from '../Media';

const Wrapper = styled.div`
  margin-bottom: 20px;
`

const Table = styled.div`
`

const TableRow = styled.div`
  display: flex;
  ${props => props.header && `
    border-top: 1px solid #DADAE2;
    border-bottom: 1px solid #DADAE2;
  `}
`

const HeaderCell = styled.span`
  font-weight: 400;
  font-size: 11px;
  line-height: 13px;
  padding: 8px 5px;
  text-transform: uppercase;
  width: 100%;

  ${props => props.headerColor && `
    color: white;
    background: ${props.headerColor};
  `};
`

const SubTitle = styled.span`
  display: inline-block;
  width: ${props => props.width}%;
  background: #F2F2F2;
  font-size: 9px;
  line-height: 11px;
  padding: 8px;
  text-align: center;
  text-transform: uppercase;
`

const Cell = styled.span`
  display: inline-block;
  width: ${props => props.width}%;
  font-size: 21px;
  line-height: 28px;
  font-weight: 600;
  padding: 8px;
  text-align: center;  

  ${media.max.mobile} {
    font-size: 18px;
  }
`

function LineTable(props) {
  
  const { title, subtitle, records, headerColor } = props;

  return (
    <Wrapper>
      <Table>
        <TableRow header>
          <HeaderCell headerColor={headerColor}>{title}</HeaderCell>
        </TableRow>
        <TableRow>
          {subtitle.map((sub, index) => (
            <SubTitle key={`sub-${index}`} width={100 / subtitle.length}>{sub}</SubTitle>
          ))}
        </TableRow>
        <TableRow>
          {records.map((record, index) => (
            <Cell key={`record-${index}`} width={100 / subtitle.length}>{record}</Cell>
          ))}
        </TableRow>
      </Table>
    </Wrapper>
  )
}

export default LineTable;
