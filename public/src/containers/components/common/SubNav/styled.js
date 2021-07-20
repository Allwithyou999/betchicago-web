import styled from 'styled-components';
import { media } from '../styles';

export default styled.div`
  .container {
    display: flex;
    position: relative;
    box-shadow: rgba(0, 0, 0, 0.3) 0px 2px 5px 0px;
    height: auto;
    background: rgb(234, 234, 235);

    .title {
      text-align: center;
      position: relative;
      z-index: 152;
      background: rgb(234, 234, 235);
      padding: 12px 45px 11px;
      display: flex;
      align-items: center;

      > span {
        display: inline-block;
        font-weight: 700;
        font-size: 19px;
        line-height: 23px;
        color: rgb(17, 17, 17);
        text-transform: uppercase;
      }
    }

    .nav-container {
      display: flex;
      padding: 10px 0px;
      align-items: center;
      flex: 1 0 1px;
      background: rgb(234, 234, 235);
      flex-flow: row wrap;
      ${media.mobile} {
        padding: 0px;
      }

      .items-container {
        display: flex;
        align-items: center;
        flex-flow: row wrap;
        ${media.mobile} {
          display: none;
          position: absolute;
          flex-direction: column;
          align-items: flex-start;
          width: 100%;
          top: 0px;
          z-index: 131;
          background: white;
          overflow: hidden;
          transition: height 0.5s ease 0s;
          box-shadow: rgba(0, 0, 0, 0.16) 0px 0px 6px 0px;
          ${props =>
            props.showMobileMenu &&
            `
						display: flex;
					`}
        }
        .nav-item {
          padding: 0px 18px;
          ${media.mobile} {
            height: 50px;
            display: flex;
            align-items: center;
            width: 100%;
          }
          > a {
            font-size: 13px;
            line-height: 30px;
            color: rgb(102, 102, 102);
            text-transform: uppercase;
            white-space: nowrap;
            text-decoration: none;
            width: 100%;
          }
          :hover {
            > a {
              color: rgb(77, 164, 244);
            }
          }
        }
      }

      .mobile-dropdown {
        background: white;
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 13px 23px 13px 16px;
        width: 100%;
        ${media.tablet} {
          display: none;
        }
        > .mobile-dropdown-button {
          font-weight: 300;
          font-size: 17px;
          line-height: 20px;
          color: rgb(17, 17, 17);
          text-transform: uppercase;
        }
      }
    }
  }
`;
