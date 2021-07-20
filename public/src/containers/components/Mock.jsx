import React, { Component } from 'react';
import styled from 'styled-components';

const Wrapper = styled.div`

`



class PlayerCard extends Component {
  
  render() {
    const { titles, list, single, loading = 1 } = this.props;

    return (
      <Wrapper>
        
      </Wrapper>
    )
  }
}

export default PlayerTable;
