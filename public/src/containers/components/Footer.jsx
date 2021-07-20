import React from 'react';
import styled from 'styled-components';


import { InstagramIcon, FacebookIcon, TwitterIcon } from './Icons';
import media from './Media';

import { THEME_COLORS } from '../../modules/styles';


const Wrapper = styled.div`
  margin-bottom: constant(safe-area-inset-bottom);
  margin-bottom: env(safe-area-inset-bottom);
`

const Logo = styled.div`
  width: 165px;
  margin-left: 23px;

  img {
    width: 100%;
    height: auto;
  }

  ${media.tablet} {
    width: 215px;
  }
`

const FTop = styled.div`
  background: ${THEME_COLORS.BLACK};
  padding: 40px 10px 50px;
`

const FCenter = styled.div`
  background: #181818;
  padding: 35px 20px;
`

const FBottom = styled.div`
  background: ${THEME_COLORS.BLACK};
  padding: 60px 10px 25px;
`

const Content = styled.div`
  max-width: 1008px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
`

const Title = styled.div`
  font-weight: 400;
  font-family: AvenirNext, sans-serif;
  color: white;
  text-align: center;
  font-size: 25px;

  span {
    font-weight: 600;
  }

  b {
    font-weight: 700;
  }
`;

const TitleH2 = styled.h2`
  font-weight: 400;
  font-family: AvenirNext, sans-serif;
  color: white;
  text-align: center;
  font-size: 25px;
  margin-bottom: 15px;
`;

const Subtitle = styled.h6`
  font-family: AvenirNext, sans-serif;
  opacity: 0.6;
  color: white;
  margin-bottom: 20px;
  max-width: 1008px;
  text-align: center;
  margin-left: auto;
  margin-right: auto;
  line-height: 22px;
`

const Form = styled.form`
  display: flex;
  align-items: center;
  justify-content: center;
`

const FormInput = styled.input`
  font-size: 17px;
  line-height: 28px;
  padding: 11px 14px;
  background: white;
  border: none;
  max-width: 360px;
  margin-right: 5px;
  width: 100%;
`;

const FormButton = styled.button`
  font-size: 17px;
  line-height: 28px;
  color: white;
  font-weight: 700;
  padding: 11px 32px;
  background: ${THEME_COLORS.ORANGE};
  border: none;
`

const MenuTitle = styled.div`
  font-size: 13px;
  line-height: 15px;
  color: ${THEME_COLORS.ORANGE};
  margin-right: 20px;
  font-weight: 700;
  width: 100%;
  margin-bottom: 40px;

  ${media.tabletLg} {
    width: auto;
  }
`

const Menu = styled.div`
  display: flex;
  flex-direction: column;
  width: 50%;
  margin-bottom: 30px;

  &:nth-child(even) {
    padding-right: 10px;
  }

  ${media.tabletLg} {
    width: auto;
    margin-bottom: 0;
    &:nth-child(even) {
      padding-right: 0;
    }
  }
`

const MenuItem = styled.a`
  font-weight: 300;
  font-size: 15px;
  line-height: 18px;
  margin-bottom: 10px;
  color: white;
  text-decoration: none;

  &:hover {
    text-decoration: underline;
  }

`

const LogoArea = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 40px;
  margin-top: 20px;

  ${media.max.mobile} {
    flex-direction: column-reverse;
  }
`

const Social = styled.div`
  display: flex;

  ${media.max.mobile} {
    margin-top: 20px;
  }

  > * {
    margin-right: 17px;

    ${media.max.mobile} {
      margin-left: 10px;
      margin-right: 10px;
    }
  }
`

const Tips = styled.a`
  text-align: center;
  font-size: 13px;
  line-height: 21px;
  font-weight: 300;
  color: white;
  margin-bottom: 5px;
  text-decoration: none;
  display: block;

  b {
    font-weight: 700;
    font-size: 15px;
    display: block;
  }
`

const Comments = styled.a`
  text-align: center;
  line-height: 21px;
  margin-bottom: 35px;
  color: ${THEME_COLORS.ORANGE};
  display: block;
  font-weight: 700;
  font-size: 15px;
`

const Copyright = styled.div`
  text-align: center;
  font-size: 13px;
  font-weight: 300;
  text-align: center;
  color: white;

  a {
    color: inherit;
  }
`

function Footer(props) {
  let group1 = [];
  let group2 = [];
  let group3 = [];
  let group4 = [];
  if (window.initApp) {
    window.initApp();
    group1 = window.cApplicationLocal.anchorPages.slice(0, 7);
    group2 = window.cApplicationLocal.anchorPages.slice(7, 14);
    group3 = window.cApplicationLocal.anchorPages.slice(14, 21);
    group4 = window.cApplicationLocal.anchorPages.slice(21, 28);
  }
  function signUpNewsLetter(e) {
    let newEmail = document.getElementById('signUpNewsLetterEmail').value;

    if (!newEmail) {
      alert('Must enter an email');
      return;
    }

    //post record to firebase
    fetch(`https://us-central1-bet-chicago.cloudfunctions.net/api/user/newsletter?email=${encodeURIComponent(newEmail)}`, {
          headers: {},
          method: 'POST',
          dataType: 'json'
        })
        .then(response => console.log(newEmail, response))
        .catch(e => console.log(newEmail, e));

    alert(newEmail + ' has been added!');
    e.preventDefault();
    return false;
  }

  return (
    <Wrapper>
      <FTop>
        <Title>Chicago’s Hometown Sports Betting Experts</Title>
        <Subtitle>join our newsletter to get the latest sports betting news and contest notifications</Subtitle>
        <Form onSubmit={signUpNewsLetter}>
          <FormInput id="signUpNewsLetterEmail" type="email" name="email" placeholder="enter your email address" />
          <FormButton onClick={signUpNewsLetter} type="button">SIGNUP</FormButton>
        </Form>
      </FTop>
      <FCenter>
        <Content>
          <MenuTitle>HOT TOPICS</MenuTitle>
          <Menu>
            {group1.map((item, index) => (
              <MenuItem href={item.href} key={`footer1-${index}`}>{item.text}</MenuItem>
            ))}
          </Menu>
          <Menu>
            {group2.map((item, index) => (
              <MenuItem href={item.href} key={`footer2-${index}`}>{item.text}</MenuItem>
            ))}
          </Menu>
          <Menu>
            {group3.map((item, index) => (
              <MenuItem href={item.href} key={`footer3-${index}`}>{item.text}</MenuItem>
            ))}
          </Menu>
          <Menu>
            {group4.map((item, index) => (
              <MenuItem href={item.href} key={`footer4-${index}`}>{item.text}</MenuItem>
            ))}
          </Menu>
        </Content>
      </FCenter>
      <FBottom>
        <TitleH2>Illinois Sports Betting</TitleH2>
        <Subtitle>BetChicago is Chicago’s Hometown Sports Betting Experts. BetChicago provides sports news, sports betting insights, sports betting odds, sports betting lines, and sports betting predictions.</Subtitle>
        <LogoArea>
          <Social>
            <a href="https://www.facebook.com/betchicago" target="_blank" rel="noopener noreferrer">
              <FacebookIcon big />
            </a>
            <a href="https://www.instagram.com/betchicago/" target="_blank" rel="noopener noreferrer">
              <InstagramIcon big />
            </a>
            <a href="https://twitter.com/betchicago1" target="_blank" rel="noopener noreferrer">
              <TwitterIcon big />
            </a>
          </Social>
          <Logo>
            <img src='/images/logo.png' alt="logo" />
          </Logo>
        </LogoArea>
        <Tips href="mailto:editorial@betchicago.com" target="_parent">tips to:<b>editorial@betchicago.com</b></Tips>
        <Comments href="/contact" target="_parent">Contact Us</Comments>
        <Copyright>© <a href="/copyright">Copyright 2019</a>. USA Sports Gaming. All Rights Reserved. By using this site you agree to be bound by our <a href="/terms">Terms of Service</a> and <a href="/privacy">Privacy Policy</a>.</Copyright>
      </FBottom>
    </Wrapper>
  )
}

export default Footer
