import React, { Component } from 'react';
import styled from 'styled-components';

import { db } from '../../../apis/firebase';
import Page, { MainContent } from '../../../containers/components/Layout';

const Wrapper = styled.div``;

const Title = styled.h1`
`;

const SubTitle = styled.h2`
  font-size: 14px;
  line-height: 15px;
  font-weight: bold;
  color: rgb(240, 90, 36);
  margin: 10px 0px;
  margin-top: 20px;
`;

const ContactLabel = styled.label`
  font-weight: bold;
  color: rgb(50, 50, 50);
  font-size: 12px;
  margin-left: .5em;
`;

const ContactInput = styled.input`
  width: 25em;
  margin-left: .5em;
  padding: 5px 10px;
  font-size: 12pt;
  margin-bottom: 10px;
`;

const ContactTextArea = styled.textarea`
  width: 25em;
  clear: both;
  margin-left: .5em;
  padding: 5px 10px;
  font-size: 12pt;
  margin-bottom: 10px;
`;

const FlowBlock = styled.div`
  float: left;
  margin-right: 1em;
`;

const SubmitButton = styled.button`
  float: right;
  padding: 5px 10px;
`;

const StaffTable = styled.table`
  width: 575px;
  font-family: Roboto;
  font-size: 12px;
  td {
    padding: 10px 0px;
  }
  td:nth-child(1) {
    width: 150px;
    font-weight: bold;
    color: rgb(50, 50, 50);
  }
  td:nth-child(2) {
    text-align: left;
    color: rgb(50, 50, 50);
  }
  td:nth-child(3) {
    text-align: right;
    font-size: 11px;
    padding-right: 5px;
  }
  td {
    border-bottom: solid 1px rgb(240, 240, 240)
  }
`;

class ContactPage extends Component {
  constructor(props) {
    super(props);
    this.submitComment = this.submitComment.bind(this);
    this.loading = true;

    this.operationsStaff = [];
    this.editorialStaff = [];
    this.marketingStaff = [];
  }
  submitComment(e) {
    let name = window.document.getElementById('contactinputname').value;
    let email = window.document.getElementById('contactinputemail').value;
    let content = window.document.getElementById('contactinputcontent').value;

    if (!name || !email || !content) {
      alert('Please fill in all fields');
      return;
    }

    window.document.getElementById('contactinputname').value = '';
    window.document.getElementById('contactinputemail').value = '';
    window.document.getElementById('contactinputcontent').value = '';

    //post record to firebase
    fetch(`https://us-central1-bet-chicago.cloudfunctions.net/api/user/comment?name=${encodeURIComponent(name)}&email=${encodeURIComponent(email)}&content=${encodeURIComponent(content)}`, {
      //fetch(`http://localhost:5001/bet-chicago/us-central1/api/user/comment?name=${encodeURIComponent(name)}&email=${encodeURIComponent(email)}&content=${encodeURIComponent(content)}`, {
            headers: {},
          method: 'POST',
          dataType: 'json'
        })
      .then(response => {
        alert('Message sent');
      })
      .catch(e => console.log(e));

    e.preventDefault();
  }
  componentDidMount() {
    Promise.all([
      db()
        .ref(`customPages/contact`)
        .once('value')
        .then(result => result.val())
    ]).then(results => {
      this.contactInfo = results[0].staff;
      this.contactInfo.sort((a, b) => {
        if (a.order > b.order) return 1;
        if (a.order < b.order) return -1;
        return 0;
      });

      this.operationsStaff = [];
      this.editorialStaff = [];
      this.marketingStaff = [];

      for (let i in this.contactInfo) {
        let data = this.contactInfo[i];
        if (data.group === 'operations')
          this.operationsStaff.push(data);
        else if (data.group === 'editorial')
          this.editorialStaff.push(data);
        else if (data.group === 'marketing')
          this.marketingStaff.push(data);
      }

      this.loading = false;
      this.forceUpdate();
    });

  }

  render() {
    return (
      <div>
        <Page>
          <MainContent hasRight>
            <Wrapper>
              <Title>Contact Us</Title>
              <FlowBlock>
                <SubTitle>OPERATIONS</SubTitle>
                <StaffTable>
                  {this.operationsStaff.map((staff, index) => (
                    <tr><td>{staff.name}</td><td>{staff.title}</td><td><a href={"mailto:" + staff.email}>{staff.email}</a></td></tr>
                  ))}
                </StaffTable>
                <SubTitle>EDITORIAL</SubTitle>
                <StaffTable>
                  {this.editorialStaff.map((staff, index) => (
                    <tr><td>{staff.name}</td><td>{staff.title}</td><td><a href={"mailto:" + staff.email}>{staff.email}</a></td></tr>
                  ))}
                </StaffTable>
                <SubTitle>MARKETING</SubTitle>
                <StaffTable>
                  {this.marketingStaff.map((staff, index) => (
                    <tr><td>{staff.name}</td><td>{staff.title}</td><td><a href={"mailto:" + staff.email}>{staff.email}</a></td></tr>
                  ))}
                </StaffTable>
              </FlowBlock>
              <FlowBlock>
                <SubTitle>General Inquiries</SubTitle>
                <ContactLabel>Name</ContactLabel>
                <br />
                <ContactInput type="text" id="contactinputname"></ContactInput>
                <br />
                <ContactLabel>Email</ContactLabel>
                <br />
                <ContactInput type="text" id="contactinputemail"></ContactInput>
                <br />
                <ContactLabel>Question or Comment</ContactLabel>
                <br />
                <ContactTextArea rows="4" cols="4" id="contactinputcontent"></ContactTextArea>
                <br />
                <SubmitButton onClick={this.submitComment}>Submit</SubmitButton>
              </FlowBlock>
            </Wrapper>
          </MainContent>
        </Page>
      </div>
    );
  }
}

export default ContactPage;
