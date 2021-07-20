import styled from 'styled-components';

export default styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 15px;
  background: white;
  border-top: 1px solid #ccc;
  border-bottom: 1px solid #ccc;
  div {
    display: flex;
    justify-content: space-between;
    align-items: center;
    min-height: 35px;
    span {
      text-align: center;
      min-width: 60px;
    }
  }
  .TwoTeamStackupTable-heading {
    border-bottom: 1px solid #ccc;
    padding-bottom: 10px;
    margin-bottom: 10px;
  }
`;
