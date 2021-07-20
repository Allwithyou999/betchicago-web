import React, { Component } from 'react';
import styled from 'styled-components';

import Loading from '../Loading';

import { THEME_COLORS } from '../../../modules/styles';

const Wrapper = styled.div`

`

const Table = styled.div`
  > div {
    &:nth-child(odd) {
      background-color: #F2F2F2;
    }

    &:first-child {
      background-color: white;
    }
  }
  ${props => props.single && `
    margin-bottom: 10px;
  `}
`

const TableRow = styled.div`
  display: flex;
  ${props => props.header && `
    border-top: 1px solid #DADAE2;
    border-bottom: 1px solid #DADAE2;
    margin-bottom: 4px;
  `}
  ${props => props.single && `
    background: #F5F5F8 !important;
    margin-bottom: 0;
  `}
  ${props => props.footer && `
    margin-top: 1px;
    border-top: 1px solid #707070;
    background: transparent !important;

    > span {
      font-weight: 700 !important;
    }
  `}
`

const HeaderCell = styled.span`
  font-weight: 400;
  font-size: 11px;
  line-height: 13px;
  color: #666666;
  padding: 8px 5px;
  text-transform: uppercase;
  width: ${props => props.width};
  text-align: ${props => props.align};

  ${props => props.headerColor && `
    color: white;
    background: ${props.headerColor};
  `};
`

const Cell = styled.span`
  display: inline-block;
  font-size: 15px;
  line-height: 18px;
  font-weight: 300;
  padding: 10px 5px;
  white-space: nowrap;
  width: ${props => props.width};
  text-align: ${props => props.align};
  font-weight: ${props => props.weight};
  overflow: hidden;
  text-overflow: ellipsis;

  ${props => props.active && `
    color: ${THEME_COLORS.BLUE};
    font-weight: 400;
  `}

  ${props => props.tableSmall && `
    font-size: 13px;
    line-height: 15px;
  `}

  ${props => props.withIcon && `
    padding: 2px 5px;
  `}

  a {
    color: ${THEME_COLORS.BLUE};
    font-weight: 400;
    text-decoration: none;
  }
`

class PlayerTable extends Component {

  getCells = (titles, row, tableSmall ) => (
    titles.map((title, tindex) => (
      <Cell active={title.active}
            width={title.width}
            tableSmall={tableSmall}
            withIcon={title.withIcon}
            align={title.align || 'left'}
            weight={title.weight || '300'}
            key={`cell${tindex}`}>
        {title.link ? (
            <a href={row[title.link]}>{row[title.field]}</a>
          ) : (
            <span>{row[title.field]}</span>
          )
        }
      </Cell>
    ))
  )

  render() {
    const { titles, list, single, loading = 1, tableSmall, footer, headerColor } = this.props;
    return (
      <Wrapper>
        <Table single={single}>
          <TableRow header single={single}>
            {
              titles.map((title, index) => (
                <HeaderCell key={index} align={title.align || 'left'} width={title.width} headerColor={headerColor}>{title.text}</HeaderCell>
              ))
            }
          </TableRow>
          {loading === 0 &&
            <Loading />
          }
          {loading === 1 &&
            list.map((row, index) => (
              <TableRow key={index}>
                {this.getCells(titles, row, tableSmall)}
              </TableRow>
            ))
          }
          {!!footer &&
            <TableRow key={'footer'} footer>
              {this.getCells(titles, footer, tableSmall)}
            </TableRow>
          }
        </Table>
      </Wrapper>
    )
  }
}

export default PlayerTable;
