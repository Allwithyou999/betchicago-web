import React, { Component } from 'react';
import styled from 'styled-components';
import { THEME_COLORS } from '../../../modules/styles';

const Wrapper = styled.div`
  margin-bottom: 35px;
`

const Table = styled.div`
  
`

const Flex = styled.div`
  display: flex;
`

const TableRow = styled.div`
  display: flex;
  flex: 1;

  ${props => props.single && `
    background: #F5F5F8 !important;
    margin-bottom: 0;
  `}
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

  img {
    max-height: 160px;
  }

  @media screen and (max-width: 768px) {
    font-size: 12px;
    
    img {
      max-width: 100%;
    }
  }
`

const Footer = styled.div`
  margin-top: 15px;
  text-align: center;
`

const FooterLink = styled.a`
  font-weight: 600;
  text-decoration: none;
  color: #096CBE;
  font-size: 14px;
`

class PlayerTable extends Component {
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
    const { titles, list, single, link } = this.props;
    return (
      <Wrapper>
        <Table single={single}>
          <Flex>
            <HeaderCell align={titles[0].align || 'left'} width={titles[0].width}>{titles[0].text}</HeaderCell>
            <TableRow>
              {
                titles.slice(1, titles.length).map((title, index) => (
                  <HeaderCell key={index} align={title.align || 'left'} width={title.width}>{title.text}</HeaderCell>
                ))
              }
            </TableRow>
          </Flex>
          <Flex>
            <Cell width={titles[0].width}>
              {list[0].image ? <img
                className="team-img"
                alt=""
                src={list[0].image}
              /> : 'Image'}
            </Cell>
            <div style={{flex: 1}}>
              {list.map((row, index) => (
                <TableRow key={index}>
                  {this.getCells(titles.slice(1, titles.length), row, index)}
                </TableRow>
              ))}
            </div>
          </Flex>
        </Table>
        <Footer>
          <FooterLink href={link}>COMPLETE LIST</FooterLink>
        </Footer>
      </Wrapper>
    )
  }
}

export default PlayerTable;
