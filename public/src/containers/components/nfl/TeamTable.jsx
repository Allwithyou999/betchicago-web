import React, { Component } from 'react';
import styled from 'styled-components';
import { THEME_COLORS } from '../../../modules/styles';

const Wrapper = styled.div`
  margin-bottom: 35px;
`

const Table = styled.div`
  
`

const TableRow = styled.div`
  display: flex;
`

const HeaderCell = styled.span`
  font-weight: 700;
  font-size: 15px;
  line-height: 15px;
  color: #666666;
  padding: 8px 5px;
  text-transform: uppercase;
  width: ${props => props.width};
  text-align: ${props => props.align};
  border-bottom: 2px solid rgb(204, 204, 204);

  @media screen and (max-width: 768px) {
    font-size: 12px;
  }
`

const Cell = styled.span`
  display: inline-block;
  font-size: 14px;
  line-height: 18px;
  font-weight: 300;
  padding: 10px 5px;
  white-space: nowrap;
  width: ${props => props.width};
  text-align: ${props => props.align};
  font-weight: ${props => props.weight};
  color: ${props => props.color};
  overflow: hidden;
  text-overflow: ellipsis;
  border-bottom: 1px solid rgb(204, 204, 204);

  ${props => props.active && `
    color: ${THEME_COLORS.BLUE};
    font-weight: 400;
  `}

  @media screen and (max-width: 768px) {
    font-size: 12px;
  }
`

const Footer = styled.div`
  font-size: 14px;
  margin-top: 15px;
  cursor: pointer;
  font-weight: 600;
  text-align: center;
  color: #096CBE;
`

class TeamTable extends Component {
  getCells = (titles, row, rowIndex) => (
    titles.map((title, tindex) => (
      <Cell active={title.active}
            width={title.width}
            align={title.align || 'left'}
            weight={rowIndex === 0 ? 700 : 400}
            color={title.color || '#111111'}
            key={`cell${tindex}`}>
        <span>{row[title.field]}</span>
      </Cell>
    ))
  )

  render() {
    const { titles, list } = this.props;
    return (
      <Wrapper>
        <Table>
          <TableRow>
            {
              titles.map((title, index) => (
                <HeaderCell key={index} align={title.align || 'left'} width={title.width}>{title.text}</HeaderCell>
              ))
            }
          </TableRow>
          {list.map((row, index) => (
            <TableRow key={index}>
              {this.getCells(titles, row, index)}
            </TableRow>
          ))}
        </Table>
        <Footer>
          COMPLETE RANKINGS
        </Footer>
      </Wrapper>
    )
  }
}

export default TeamTable;
