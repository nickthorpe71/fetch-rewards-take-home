/* eslint-disable no-console */
require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const helmet = require('helmet');
const { NODE_ENV } = require('./config');

const jsonBodyParser = express.json();
const app = express();

const morganOption = (NODE_ENV === 'production')
  ? 'tiny'
  : 'common';

app.use(morgan(morganOption));
app.use(helmet());
app.use(cors());

app.get('/email', jsonBodyParser, (req, res) => {
  if (!req.body.emails || typeof req.body.emails[0] !== 'string') {
    return res
      .status(400)
      .send({ error: 'Body must include key "emails" whose corrisponding value is an array of strings' });
  }

  const { emails } = req.body;
  const formattedEmails = [];
  let count = 0;

  for (let i = 0; i < emails.length; i++) {
    // split string @ sign
    const lastAt = emails[i].lastIndexOf('@');
    let first = emails[i].slice(0, lastAt);
    const last = emails[i].slice(lastAt, emails[i].length);

    // only for gmail
    if (last.includes('gmail')) {
      // remove all periods before @ sign
      first = first.split('.').join('');
      // remove anythign between + and @
      if (first.includes('+')) {
        let plus = first.indexOf('+');
        first = first.slice(0, plus);
      }

      // rejoin first string to second sting
      formattedEmails.push(first + last);
    } else {
      formattedEmails.push(emails[i]);
    }
  }

  //CHeck jamies texts for more guidance

  // remove duplicates
  // regex to validate formatted emails

  // TODO: could also make a react app to show front end skills and deploy this to heroku
  // The UI for React could be a simple 1 page that allows them to enter in a emails one by one, compiling a list, and then send that list. They would then receive a response of the number of valid emails. 

  for (let i = 0; i < emails.length; i++) {
    if (validateEmail(emails[i]))
      count++;
  }

  return res
    .status(200)
    .send({ count });
});

const validateEmail = (email) => {
  const re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(email);
};

// eslint-disable-next-line no-unused-vars
app.use(function errorHandler(error, req, res, next) {
  let response;
  if (NODE_ENV === 'production') {
    response = { error: { message: 'server error' } };
  } else {
    console.error(error);
    response = { message: error.message, error };
  }
  res.status(500).json(response);
});

module.exports = app;