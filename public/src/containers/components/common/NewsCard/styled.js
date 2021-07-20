import styled from 'styled-components';

export default styled.div`
  margin-bottom: 15px;
  border-top: 1px solid #ccc;
  border-bottom: 1px solid #ccc;
  padding: 25px 15px;
  margin-top: 25px;
  background: white;
  display: flex;
  img {
    width: 30%;
    maxwidth: 500px;
  }
  > div {
    display: flex;
    flex-direction: column;
    margin-left: 10px;
    .title {
      font-size: 18px;
      font-weight: bold;
      margin: 10px 0px;
    }
    .description {
      font-size: 16px;
      margin: 10px 0px;
    }
  }
`;
