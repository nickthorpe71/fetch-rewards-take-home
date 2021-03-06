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
    // split string at last @
    // this must be done first to be able to check for 'gmail' substring after the @
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
    }
    // rejoin first string to second sting
    let formattedEmail = first + last;

    // check for duplicates and validate with regex
    if (!formattedEmails.includes(formattedEmail) && validateEmail(formattedEmail)) {
      formattedEmails.push(formattedEmail);
      count++;
    }
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