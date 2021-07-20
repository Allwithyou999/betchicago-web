import React, { Component } from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';
import firebase from 'firebase/app';
import 'firebase/auth';

import { THEME_COLORS } from '../../modules/styles';
import media from '../../containers/components/Media';

const Wrapper = styled.div`
`

const LoginModalBackground = styled.div`
  background: rgba(0, 0, 0, 0.95);
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  top: 0;
  z-index: 300;
`

const LoginContainer = styled.div`
  position: fixed;
  left: 0;
  right: 0;
  top: 80px;
  z-index: 301;
  background: #181818;
  padding: 30px 40px;
  max-width: 400px;
  margin: auto;

  ${media.max.mobile} {
    padding: 20px;
    top: 0;
    bottom: 0;
  }
`

const CloseButton = styled.div`
  position: absolute;
  top: 20px;
  right: 20px;
  cursor: pointer;
  color: white;
`

const CircleLogo = styled.div`
  text-align: center;
  margin-top: 30px;

  img {
    width: 70px;

    ${media.max.mobile} {
      width: 140px;
    }
  }
`

const Logo = styled.div`
  text-align: center;
  margin-top: 40px; 

  img {
    width: 200px;
  }

  ${media.max.mobile} {
    display: none;
  }
`

const Form = styled.form`
  margin-top: 50px;
  font-size: 12px;
`

const FormRow = styled.div`
  margin-top: 40px;
`

const Row = styled.div`
  display: flex;
  justify-content: space-between;
`

const ActionRow = styled.div`
  display: flex;
  justify-content: space-between;

  ${media.max.mobile} {
    margin-top: 40px;
    flex-direction: column;
    text-align: center;
  }
`

const Label = styled.div`
  color: white;
`

const ForgotLabel = styled.div`
  color: ${THEME_COLORS.ORANGE};
  font-weight: 100;

  ${media.max.mobile} {
    display: none;
  }
`

const FormInput = styled.input`
  width: 100%;
  background-color: transparent;
  border-width: 0px;
  border-bottom-width: 1px;
  border-bottom-color: #eeeeee;
  color: white;
  font-size: 16px;
  margin-top: 15px;
  padding: 2px;
  outline: none;
`

const FormButton = styled.button`
  font-size: 14px;
  line-height: 28px;
  color: white;
  padding: 11px 50px;
  background: ${THEME_COLORS.ORANGE};
  border: none;
  font-size: 14px;
  font-weight: 100;
`

const TermsText = styled.div`
  color: white;
  margin-top: 40px;
  margin-bottom: 40px;
  line-height: 20px;
  font-weight: 100;
  opacity: 0.9;

  ${media.max.mobile} {
    display: none;
  }
`

const CreateAccountButton = styled.a`
  color: ${THEME_COLORS.ORANGE};
  text-decoration: none;
  line-height: 50px;
  font-size: 14px;
  font-weight: 100;

  ${media.max.mobile} {
    display: none;
  }
`

const ForgotPasswordMobile = styled.div`
  display: none;
  color: white;
  margin-top: 40px;
  text-align: center;

  ${media.max.mobile} {
    display: block;
  }
`

class LoginModal extends Component {
  constructor(props) {
    super(props);

    this.state = {
      email: '',
      password: '',
      error: '',
    };
  }

  handleChange = (key, value) => {
    this.setState({
      [key]: value,
    });
  }

  login = (e) => {
    e.preventDefault();

    const { email, password } = this.state;

    firebase.auth().signInWithEmailAndPassword(email, password).then(() => {
      this.props.onClose(e);
      window.location.href = "/profile";
    }).catch((error) => {
      alert('Login failed - ' + error.code + ': ' + error.message);
    });
  }

  render() {
    const { email, password } = this.state;

    return (
      <Wrapper>
        <LoginModalBackground />
        <LoginContainer>
          <CloseButton onClick={this.props.onClose}>
            X
          </CloseButton>
          <CircleLogo>
            <img src='/images/bc-icon-sq.png' alt='Logo' />
          </CircleLogo>
          <Logo>
            <img src='/images/logo.png' alt='Logo' />
          </Logo>
          <Form>
            <FormRow>
              <Row>
                <Label>EMAIL</Label>
                <ForgotLabel>Forgot Email?</ForgotLabel>
              </Row>
              <FormInput
                type="email"
                name="email"
                value={email}
                onChange={(e) => { this.handleChange('email', e.target.value); }}
              />
            </FormRow>
            <FormRow>
              <Row>
                <Label>PASSWORD</Label>
                <ForgotLabel>Forgot Password?</ForgotLabel>
              </Row>
              <FormInput
                type="password"
                name="password"
                value={password}
                onChange={(e) => { this.handleChange('password', e.target.value); }}
              />
            </FormRow>
            <TermsText>By use of BetChicago.com and/or Mobile App, you attest that you are at least 21 years of age and agree to our <u>Terms</u> and <u>Privacy</u> policies.</TermsText>
            <ActionRow>
              <CreateAccountButton href="/userregistration">Create Account</CreateAccountButton>
              <FormButton onClick={this.login}>Login</FormButton>
            </ActionRow>
            <ForgotPasswordMobile>Forgot Password?</ForgotPasswordMobile>
          </Form>
        </LoginContainer>
      </Wrapper>
    );
  }
}

export default connect()(LoginModal);
