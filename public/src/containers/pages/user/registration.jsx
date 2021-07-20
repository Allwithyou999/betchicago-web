import React, { Component } from 'react';
import styled from 'styled-components';
import firebase from 'firebase/app';
import 'firebase/auth';
import DatePicker from "react-datepicker";

import Page, { MainContent } from '../../../containers/components/Layout';
import media from '../../../containers/components/Media';

const Wrapper = styled.div`
  padding-top: 15px;
  display: inline-block;
  max-width: 768px;
  text-align: left;

  ${media.tablet} {
    h1 {
      font-weight: 300;
    }
  }
`;

const Header = styled.h1`
  font-size: 18px;
  font-weight: 700 !important;
  margin-bottom: 20px;
`

const Row = styled.div`
  display: flex;
  margin-top: 25px;
  font-size: 14px;
`

const Column = styled.div`
  width: 90%;
  margin-right: 10%;

  input {
    width: 100%;
    height: 30px;
    padding: 0 2px;
  }
`

const LabelContainer = styled.div`
  width: 180px;
  line-height: 22px;
`

const TextInput = styled.input`
  height: 18px;
`

const FormButton = styled.button`
  font-size: 14px;
  line-height: 20px;
  color: white;
  padding: 15px 30px;
  background: #F15A24;
  border: none;
  font-weight: 100;
  margin-top: 30px;
`

const ErrorMessage = styled.div`
  color: #F15A24;
  font-weight: 500;
  margin-top: 30px;
`

class UserRegistration extends Component {
  constructor(props) {
    super(props);

    this.state = {
      firstName: '',
      lastName: '',
      dob: new Date(),
      email: '',
      cemail: '',
      password: '',
      cpassword: '',
      errorMessage: '',
    };
  }

  createUserStep1() {
    let diff = new Date() - new Date(this.state.dob);
    let age = diff / (365*24*3600*1000);
    if (age < 21.0) {
      window.location.href = '/mustbe21toregister';
      return;
    }
  }

  handleUpdate = (key, value) => {
    this.setState({
      [key]: value,
    });
  }

  handleRegister = () => {
    const {
      firstName,
      lastName,
      email,
      cemail,
      dob,
      cpassword,
      password,
    } = this.state;

    let errorMessage = '';
    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/; // eslint-disable-line no-useless-escape

    this.setState({
      errorMessage: '',
    });

    if (!firstName) {
      errorMessage = 'Please input First Name!';
    } else if (!lastName) {
      errorMessage = 'Please input Last Name!';
    } else if (!email) {
      errorMessage = 'Please input Email Address!';
    } else if (!re.test(String(email).toLowerCase())) {
      errorMessage = 'Please input valid Email Address!';
    } else if (email !== cemail) {
      errorMessage = 'Email does not match!';
    } else if (!password) {
      errorMessage = 'Please input Password!';
    } else if (password !== cpassword) {
      errorMessage = 'Password does not match!';
    }

    if (errorMessage) {
      this.setState({
        errorMessage,
      });
      return;
    }

    firebase.auth().createUserWithEmailAndPassword(email, password)
    .then(r => {
      let uid = r.user.uid;
      let refPath = "userProfileWrite";
      const today = new Date();

      firebase.database().ref(refPath).update({[uid]: {
        dob: [dob.getFullYear(), (dob.getMonth() + 1), dob.getDate()].join('-'),
        firstName,
        lastName,
        emailUpdates: {
          bcNewsletter: true,
          contestUpdates: true,
          eventUpdates: true,
          morningScoreboard: true,
        },
        favoritePlayers: {},
        favoriteTeams: {},
        isActive: true,
        notifications: {
          apStories: false,
          bcStories: false,
          breakingNews: false,
          contestUpdates: false,
          gameUpdates: false,
          injuryUpdates: false,
          oddsChange: false,
          oddsPost: false,
          pushNotifications: false,
        },
        saveArticles: {},
        signupDate: [today.getFullYear(), (today.getMonth() + 1), today.getDate()].join('-'),
        userAgent: (navigator && navigator.userAgent),
      }}).then((res) => {
        console.log(res);
      });
    })
    .catch(e => {
      this.setState({
        errorMessage: e.message,
      });
    });
  }

  render() {
    const {
      firstName,
      lastName,
      dob,
      email,
      cemail,
      password,
      cpassword,
      errorMessage,
    } = this.state;

    return (
      <div>
        <div>
          <Page>
            <MainContent align="center">
              <Wrapper>
                <Header>Account Registration</Header>
                <Row>
                  Creating your BetChicago.com account allows you to save stories to your account, 
                  receive notifications on your favorite teams and players, plus get access to great sports and sports betting information 
                  from around the country.
                </Row>
                <Row>
                  <Column>
                    <LabelContainer><label>FIRST NAME</label></LabelContainer>
                    <div>
                      <TextInput type="text" value={firstName} onChange={(e) => { this.handleUpdate('firstName', e.target.value); }} />
                    </div>
                  </Column>
                  <Column>
                    <LabelContainer><label>LAST NAME</label></LabelContainer>
                    <div>
                      <TextInput type="text" value={lastName} onChange={(e) => { this.handleUpdate('lastName', e.target.value); }} />
                    </div>
                  </Column>
                </Row>
                <Row>
                  <Column>
                    <LabelContainer><label>DATE OF BIRTH</label></LabelContainer>
                    <div>
                      <DatePicker
                        selected={dob}
                        onChange={(v) => { this.handleUpdate('dob', v); }}
                      />
                    </div>
                  </Column>
                  <Column>&nbsp;</Column>
                </Row>
                <Row>
                  <Column>
                    <LabelContainer><label>EMAIL ADDRESS</label></LabelContainer>
                    <div>
                      <TextInput type="text" value={email} onChange={(e) => { this.handleUpdate('email', e.target.value); }} />
                    </div>
                  </Column>
                  <Column>
                    <LabelContainer><label>CONFIRM EMAIL ADDRESS</label></LabelContainer>
                    <div>
                      <TextInput type="text" value={cemail} onChange={(e) => { this.handleUpdate('cemail', e.target.value); }} />
                    </div>
                  </Column>
                </Row>
                <Row>
                  <Column>
                    <LabelContainer><label>PASSWORD</label></LabelContainer>
                    <div>
                      <TextInput type="password" value={password} onChange={(e) => { this.handleUpdate('password', e.target.value); }} />
                    </div>
                  </Column>
                  <Column>
                    <LabelContainer><label>CONFIRM PASSWORD</label></LabelContainer>
                    <div>
                      <TextInput type="password" value={cpassword} onChange={(e) => { this.handleUpdate('cpassword', e.target.value); }} />
                    </div>
                  </Column>
                </Row>
                {errorMessage && <ErrorMessage>{errorMessage}</ErrorMessage>}
                <FormButton onClick={this.handleRegister}>Register</FormButton>
              </Wrapper>
            </MainContent>
          </Page>
        </div>
      </div>
    );
  }
}

export default UserRegistration;
