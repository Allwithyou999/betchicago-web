import styled from 'styled-components';

export default styled.div`
  display: flex;
  flex-direction: column;
  overflow-x: auto;
  margin-bottom: 15px;
  border-top: 1px solid #ccc;
  border-bottom: 1px solid #ccc;
  padding: 25px 15px;
  margin-top: 25px;
  background: white;
  > div {
    display: flex;
    padding: 8px 0px;
    border-bottom: 1px solid #ccc;
    min-width: 600px;
    span:first-child {
      width: 35px;
    }
    span:nth-child(2) {
      flex: 1;
      text-align: left;
    }
    span {
      min-width: 60px;
      text-align: center;
    }
  }
  > div:last-child {
    margin-top: 10px;
    border-bottom: none;
  }
  .LastGameTable-heading {
    font-weight: bold;
  }
  .LastGameTable-big-heading {
    padding-bottom: 15px;
    display: flex;
    align-items: center;
    border-bottom: none;
    .team-img {
      width: 40px;
      height: 40px;
    }
    span {
      margin-left: 15px;
      font-weight: bold;
      font-size: 20px;
    }
  }
`;
