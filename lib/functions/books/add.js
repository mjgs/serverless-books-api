'use strict';

const debug = require('debug')('booksapi:lib:functions:books:add'); // eslint-disable-line no-unused-vars

const db = require('../../adapters/db.js');

module.exports.add = async event => {
  const data = JSON.parse(event.body);
  const params = {
    name: data.name,
    releaseDate: data.releaseDate,
    authorName: data.authorName
  };

  debug(`params: ${JSON.stringify(params)}`);

  let bookRecord;
  try {
    bookRecord = await db.add(process.env.BOOKS_TABLE, params);
  }
  catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({
        status: 500,
        message: err.message
      })
    };
  }

  debug(`bookRecord: ${JSON.stringify(bookRecord)}`);

  return {
    statusCode: 201,
    body: JSON.stringify(bookRecord)
  };
};
