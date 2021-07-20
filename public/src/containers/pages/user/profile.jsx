import React, { Component } from 'react';
import styled from 'styled-components';
import firebase from 'firebase/app';
import 'firebase/auth';
import { connect } from 'react-redux';
import DatePicker from "react-datepicker";

import { MainContent } from '../../../containers/components/Layout';
import media from '../../../containers/components/Media';
import LeftNavbar from '../../../containers/components/LeftNavbar';
import Avatar from '../../../containers/components/Avatar';

import { loadArticles, removeArticle } from '../../../apis/article';
import { updateUser, removeFavoriteTeam, removeFavoritePlayer } from '../../../apis/user';

import { MAX_WIDTH } from '../../../modules/styles';
import Favorites from './Favorites';
import SavedStories from './SavedStories';
import Notifications from './Notifications';

const Wrapper = styled.div`
  display: flex;

  ${media.tablet} {
    h1 {
      font-weight: 300;
    }
  }

  ${media.max.mobile} {
    flex-direction: column;
  }
`;

const Page = styled.div`
  max-width: ${MAX_WIDTH + 40}px;
  margin: auto;
  display: flex;
  flex-flow: row wrap;
`

const ProfileContainer = styled.div`
  display: flex;
`

const LeftContainer = styled.div`
  flex: 1;
  line-height: 20px;
`

const Header = styled.h1`
  font-size: 18px;
  font-weight: 700 !important;
  margin-bottom: 20px;
`

const FileInput = styled.input`
  display: none;
`;

const ProfileInitialsCircle = styled.div`
  margin-left: 50px;
  margin-top: 60px;
  text-align: center;
  width: 180px;
`;

const RightWrapper = styled.div`
  flex: 1;
  margin-left: 20px;
  padding: 30px 20px;

  ${media.max.mobile} {
    margin-left: 0;
  }
`

const Section = styled.div`
  margin: 30px 0;
  font-size: 14px;
`

const Row = styled.div`
  display: flex;
  margin-top: 15px;
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
  width: 150px;
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

const FormUploadButton = styled.div`
  font-size: 14px;
  line-height: 20px;
  color: #F15A24;
  background: white;
  font-weight: 500;
  margin-top: 25px;
  border: 2px solid #F15A24;
  border-radius: 10px;
  cursor: pointer;
  max-width: 100px;
  padding: 5px 20px;
  margin-left: auto;
  margin-right: auto;
`

const RemoveButton = styled.div`
  cursor: pointer;
  margin-top: 15px;
  text-decoration: underline;
`

const ErrorMessage = styled.div`
  color: #F15A24;
  font-weight: 500;
  margin-top: 30px;
`

const SuccessMessage = styled.div`
  color: #0AAA5A;
  font-weight: 500;
  margin-top: 30px;
`

const Link = styled.a`
  color: #F15A24;
  text-decoration: underline;
`

class UserProfile extends Component {
  constructor(props) {
    super(props);

    const params = new URLSearchParams(props.location.search); 
    const section = params.get('section');
    const user = props.user.user;

    this.state = {
      active: (section || 'PROFILE'),
      firstName: ((user && user.firstName) || ''),
      lastName: ((user && user.lastName) || ''),
      dob: (user && user.dob) ? new Date(user.dob) : (new Date()),
      email: ((user && user.email) || ''),
      oldPassword: '',
      password: '',
      cpassword: '',
      errorMessage: '',
      successMessage: '',
    };
  }

  componentWillReceiveProps(nextProps) {
    const { user } = nextProps.user;

    if (!this.props.user.user && user) {
      this.setState({
        firstName: ((user && user.firstName) || ''),
        lastName: ((user && user.lastName) || ''),
        dob: (user && user.dob) ? new Date(user.dob) : (new Date()),
        email: ((user && user.email) || ''),
      });
      this.props.dispatch(loadArticles(Object.keys(user.savedArticles || {}).join(',')));
    }
  }

  uploadFileButtonClick = () => {
    this.profile_upload_file_input = document.getElementById('profile_upload_file_input');
    this.profile_upload_file_input.click();
  }

  fileInputChange = (evt) => {
    const { user } = this.props.user;

    this.putFile(evt.target.files[0], `userimages/${user.uid}`).then(() => {});
  }

  async putFile(file, fileName) {
    let storageRef = firebase.storage().ref();
    let ref = storageRef.child(fileName);
    ref.put(file).then(() => {
      ref.getDownloadURL().then((url) => {
        this.props.dispatch(updateUser({
          profileImage: url,
        }));
      });
    });
  }

  handleRemovePhoto = () => {
    const { dispatch } = this.props;
    const { user } = this.props.user;
    const ref = firebase.storage().ref().child(`userimages/${user.uid}`);

    ref.delete().then(() => {
      dispatch(updateUser({
        profileImage: null,
      }));
    }).catch(() => {});
  }

  handleChange = (active) => {
    this.setState({
      active,
    });
  }

  handleRemove = (type, id, path) => {
    const { dispatch } = this.props;

    firebase
      .database()
      .ref(`userProfileWrite/${this.props.user.user.uid}${path}`)
      .remove().then(() => {
        switch (type) {
          case 'ARTICLE':
            dispatch(removeArticle(id));
            break;
          case 'FAVORITE_TEAM':
            dispatch(removeFavoriteTeam(id));
            break;
          case 'FAVORITE_PLAYER':
            dispatch(removeFavoritePlayer(id));
            break;
          default:
        }
      });
  }

  handleUpdate = (key, value) => {
    this.setState({
      [key]: value,
    });
  }

  handleSave = () => {
    const { user } = this.props.user;
    const { firstName, lastName, email, dob, oldPassword, cpassword, password } = this.state;
    const loggedUser = firebase.auth().currentUser;
    let errorMessage = '';
    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/; // eslint-disable-line no-useless-escape

    this.setState({
      errorMessage: '',
      successMessage: '',
    });

    if (!firstName) {
      errorMessage = 'Please input First Name!';
    } else if (!lastName) {
      errorMessage = 'Please input Last Name!';
    } else if (!email) {
      errorMessage = 'Please input Email Address!';
    } else if (!re.test(String(email).toLowerCase())) {
      errorMessage = 'Please input valid Email Address!';
    } else if (password && !oldPassword) {
      errorMessage = 'Please input Old Password!';
    } else if (password && password !== cpassword) {
      errorMessage = 'Password does not match!';
    }

    if (errorMessage) {
      this.setState({
        errorMessage,
      });
    } else {

      firebase
        .database()
        .ref(`userProfileWrite/${user.uid}`)
        .update({
          firstName,
          lastName,
          dob: [dob.getFullYear(), (dob.getMonth() + 1), dob.getDate()].join('-'),
        });

      if (password) {
        const credentials = firebase.auth.EmailAuthProvider.credential(email, oldPassword);

        loggedUser.reauthenticateAndRetrieveDataWithCredential(credentials).then((res) => {
          loggedUser.updatePassword(password).then((res) => {
            this.setState({
              successMessage: 'Successfully updated!',
            });
          }).catch((error) => {
            this.setState({
              errorMessage: error.message,
            });
          });
        }).catch((error) => {
          this.setState({
            errorMessage: 'Old password is not correct!',
          });
        });
      }

      if (email !== user.email) {
        const credentials = firebase.auth.EmailAuthProvider.credential(user.email, oldPassword);

        loggedUser.reauthenticateAndRetrieveDataWithCredential(credentials).then((res) => {
          loggedUser.updateEmail(email).then((res) => {
            if (!password) {
              this.setState({
                successMessage: 'Successfully updated!',
              });
            }
            this.props.dispatch(updateUser({
              email,
            }));
          }).catch((error) => {
            this.setState({
              errorMessage: error.message,
            });
          });
        }).catch((error) => {
          this.setState({
            errorMessage: 'Old password is not correct!',
          });
        });
      }

      if (email === user.email && !password) {
        this.setState({
          successMessage: 'Successfully updated!',
        });
      }
    }
  }

  render() {
    const { user } = this.props.user;
    const { article } = this.props;
    const {
      active,
      firstName,
      lastName,
      dob,
      email,
      password,
      cpassword,
      oldPassword,
      errorMessage,
      successMessage,
    } = this.state;

    if (!user) {
      return null;
    }

    return (
      <div>
        <div>
          <Page>
            <MainContent hasRight>
              <Wrapper>
                <LeftNavbar onChange={this.handleChange} />
                <RightWrapper>
                  {active === 'PROFILE' && <div>
                    <Header>My Profile</Header>
                    <ProfileContainer>
                      <LeftContainer>
                        <Row>
                          <div>
                            Keeping your profile up-to-date ensures you receive the latest information on account services, terms updates, and other important notifications. This information is not public and we do not sell your information to third parties. To learn more about our privacy policies, please <Link href="/privacy">click here</Link>.
                          </div>
                        </Row>
                        <Section>
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
                              <LabelContainer><label>EMAIL ADDRESS</label></LabelContainer>
                              <div>
                                <TextInput type="text" value={email} onChange={(e) => { this.handleUpdate('email', e.target.value); }} />
                              </div>
                            </Column>
                            <Column>
                              <LabelContainer><label>DATE OF BIRTH</label></LabelContainer>
                              <div>
                                <DatePicker
                                  selected={dob}
                                  onChange={(v) => { this.handleUpdate('dob', v); }}
                                />
                              </div>
                            </Column>
                          </Row>
                        </Section>
                        <Section>To update your password, please enter the new password below and confirm.</Section>
                        <Row>
                          <Column>
                            <LabelContainer><label>OLD PASSWORD</label></LabelContainer>
                            <div>
                              <TextInput type="password" value={oldPassword} onChange={(e) => { this.handleUpdate('oldPassword', e.target.value); }} />
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
                      </LeftContainer>
                      <ProfileInitialsCircle>
                        <label for="profile_upload_file_input">
                          <Avatar size={130} round={true} />
                          <FormUploadButton>UPDATE IMAGE</FormUploadButton>
                        </label>
                        <FileInput type="file" id="profile_upload_file_input" onChange={this.fileInputChange}></FileInput>
                        <RemoveButton onClick={this.handleRemovePhoto}>remove</RemoveButton>
                      </ProfileInitialsCircle>
                    </ProfileContainer>
                    {errorMessage && <ErrorMessage>{errorMessage}</ErrorMessage>}
                    {successMessage && <SuccessMessage>{successMessage}</SuccessMessage>}
                    <FormButton onClick={this.handleSave}>Update Profile</FormButton>
                  </div>}
                  {active === 'SAVEDSTORIES' && <SavedStories onRemove={this.handleRemove} data={article.articles || []} />}
                  {active === 'FAVORITES' && <Favorites onRemove={this.handleRemove} players={user.favoritePlayers} teams={user.favoriteTeams} />}
                  {active === 'NOTIFICATIONS' && <Notifications />}
                </RightWrapper>
              </Wrapper>
            </MainContent>
          </Page>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  article: state.article,
  user: state.user,
});

export default connect(mapStateToProps)(UserProfile);
