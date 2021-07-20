import React, { Component } from 'react';
import styled from 'styled-components';
import { ArrowDownIcon } from './Icons';
import outsideElement from './HOC/outsideElement';

const Wrapper = styled.div`
  margin-bottom: 25px;
  max-width: 500px;
  position: relative;
`

const DropSelected = styled.div`
  border: 1px solid #DADAE2;
  padding: 16px 14px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
`

const Text = styled.div`
  color: #909090;
  font-size: 14px;
  line-height: 16px;
  font-family: 'Arial', sans-serif;

`

const DropdownList = styled.div`
  position: absolute;
  z-index: 1;
  left: 0;
  width: 100%;
  top: calc(100% + 10px);
  border: 1px solid #DADAE2;
  background: white;
  height: ${props => props.height}px;
  transition: height 0.3s ease;
  overflow-y: auto;

  ${props => !props.open && `
    height: 0;
    border: none;
  `}

`

const DropdownInner = styled.div`
  padding: 15px 0;
`

const Item = styled.div`
  padding: 11px 15px;
  cursor: pointer;

  &:hover {
    background: #fafafa;
  }
`

class Dropdown extends Component {
  constructor(props) {
    super(props);

    this.state = {
      open: false,
    }
  }
  
  componentWillReceiveProps(nextProps) {
    if(nextProps.outside) {
      this.setState({ open: false });
    }
  }

  openDropdown = () => {
    this.setState({ open: !this.state.open });
  }

  itemChanged = (index) => {
    this.setState({ open: false });
    this.props.onChange(index);
  }

  render() {
    const { activeItem = {}, items = [], style } = this.props;

    return (
      <Wrapper style={style}>
        <DropSelected onClick={this.openDropdown}>
          <Text>{activeItem.text}</Text>
          <ArrowDownIcon color="#909090" />
        </DropSelected>
        <DropdownList height={Math.min(items.length * 40 + 30, 300)} open={this.state.open}>
          <DropdownInner>
            {
              items.map((item, index) => (
                <Item onClick={() => this.itemChanged(index)} key={index}><Text>{item.text}</Text></Item>
              ))
            }
          </DropdownInner>
        </DropdownList>
      </Wrapper>
    );
  }
}

export default outsideElement(Dropdown);
