import styled from 'styled-components';

export default styled.ul`
  font-size: 13px;
  line-height: 15px;
  font-weight: 600;
  list-style: none;
  padding-left: 0;
  margin: 0;

  li {
    position: relative;
    padding-left: 15px;

    a {
      color: #666;
      text-decoration: none;
    }

    &:before {
      content: '';
      position: absolute;
      width: 3px;
      height: 3px;
      border-radius: 50%;
      display: block;
      background: #666;
      left: 2px;
      top: 5px;
    }

    + li {
      margin-top: 15px;
    }
  }
`;
