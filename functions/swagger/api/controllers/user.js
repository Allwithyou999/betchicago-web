const firebaseAdmin = require('firebase-admin');
const nodemailer = require('nodemailer');
const functions = require('firebase-functions');
const fetch = require('node-fetch');
const gmail = functions.config().gmail;
const AppConfig = require('../../../services/appconfig.js');
const appDBConfig = new AppConfig();

class CCHelper {
  async init() {
    return appDBConfig.getConfig(true)
      .then(config => {
        this.appConfig = appDBConfig.appConfig;
        this.privateConfig = appDBConfig.privateConfig;

        this.token = this.privateConfig.constantContactToken;
        this.apikey = this.privateConfig.constantContactAPIKey;
        return config;
      });
  }
  async fetchContactForEmail(email, listid) {
    let raw = await fetch(`https://api.constantcontact.com/v2/contacts?email=${encodeURIComponent(email)}&api_key=${this.apikey}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Authorization': 'Bearer ' + this.token
      },
      body: undefined
    });

    let r = await raw.json();


    if (r.results.length < 1) {
      return {
        contactExists: false,
        contactActive: false,
        contact: null,
        contactId: null
      };
    }
    let contact = r.results[0];

    if (contact.status === 'OPTOUT')
      return {
        contactExists: true,
        contactActive: false,
        contact: contact,
        contactId: contact.id
      };
    /*
            "lists": [{
        "id": "1240070104",
        "status": "ACTIVE"
    }, {
        "id": "1853060894",
        "status": "ACTIVE"
    }],
    */
    return {
      contactExists: true,
      contactActive: true,
      contact,
      contactId: contact.id
    };
  }
  async createContactForEmail(email, listid) {
    let createContact = {
      "lists": [{
        id: listid,
        status: "ACTIVE"
      }],
      "email_addresses": [{
        "email_address": email
      }]
    };

    let raw = await fetch(`https://api.constantcontact.com/v2/contacts?action_by=ACTION_BY_VISITOR&api_key=${this.apikey}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + this.token
        },
        body: JSON.stringify(createContact)
      });

    let r = await raw.json();
    return r;
  }
}

class BetChicagoUserOperations {
  static async addEmailForNewsLetter(email, remove, listid) {
    let helper = new CCHelper();
    await helper.init();
    let defaultlistid = helper.privateConfig.constantContactListID.toString();

    if (!listid)
      listid = defaultlistid;

    let contactInfo = await helper.fetchContactForEmail(email, listid);
//console.log(contactInfo);
    if (!contactInfo.contactExists) {
      let newResult = await helper.createContactForEmail(email, listid);
      return newResult;
    }
    if (!contactInfo.contactActive) {
      return 'Contact Found and NOT Active';
    }

    if (contactInfo.contactActive) {
      return 'Contact Found and Active ';
    }
  }
  static async ccapi(req, res) {
    let email = req.query.email;
    let listid = req.query.listid;
    let remove = req.query.remove;

    let r = await BetChicagoUserOperations.addEmailForNewsLetter(email, remove, listid);

    return res.status(200).send(r);
  }
  static submitNewsletterEmail(req, res) {
    if (!req.query.email)
      return res.status(200).send('{ empty email }');

    let email = req.query.email.replace(/[[\]{}()*+?.\\^$|]/g, '');
    return firebaseAdmin.database().ref(`/userNewsletter/emails`).update({
        [email]: {
          when: new Date().toISOString(),
          fullEmail: req.query.email
        }
      })
      .then(r1 => {
        return BetChicagoUserOperations.addEmailForNewsLetter(req.query.email);
      })
      .then(results => res.status(200).send('{ "success": true }'))
      .catch(e => {
        res.status(500).send(e);
        console.log(e);
      });
  }
  static submitUserComment(req, res) {
    let name = req.query.name;
    let email = req.query.email;
    let content = req.query.content;
    let refPath = `/userComments/contactPage`;
    if (!name)
      name = '';
    if (!email)
      email = '';
    if (!content)
      content = '';

    let emailDetails = {};
    if (gmail)
      emailDetails = gmail;

    const gmailEmail = emailDetails.email;
    const gmailPassword = emailDetails.password;
    const mailTransport = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: gmailEmail,
        pass: gmailPassword,
      },
    });

    let id = firebaseAdmin.database().ref().child(refPath).push().key;

    return firebaseAdmin.database().ref(refPath).update({
        [id]: {
          when: new Date().toISOString(),
          name,
          email,
          content
        }
      })
      .then(results => res.status(200).send('{ "success": true }'))
      /*
      .then(() => {
        const mailOptions = {
          from: 'noreply@betchicago.com',
          to: 'editorial@betchicago.com'
        };

        // Building Email message.
        mailOptions.subject = 'user message from ' + name;
        mailOptions.text = 'Message from ' + name +
          '\nemail:' + email + '\n\n' + content;

        return mailOptions;
      })
      .then(opt => mailTransport.sendMail(opt))
      */
      .catch(e => {
        res.status(500).send(e);
        console.log(e);
      });
  }
  static registerUser(req, res) {
    let name = req.query.name;
    let email = req.query.email;
    let content = req.query.dob;
  }
}

module.exports = BetChicagoUserOperations;
