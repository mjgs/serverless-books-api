'use strict';

const debug = require('debug')('booksapi:lib:functions:books:add'); // eslint-disable-line no-unused-vars

const db = require('../../adapters/db.js');

module.exports.add = async event => {
  const data = JSON.parse(event.body);

  debug(`event.body: ${JSON.stringify(data)}`);

  const params = {
    name: data.name,
    releaseDate: data.releaseDate,
    authorName: data.authorName
  };

  const response = {};

  let bookRecord;
  try {
    bookRecord = await db.addBook(params);
    response.statusCode = 201;
    response.body = JSON.stringify(bookRecord);
  }
  catch (err) {
    response.statusCode = err.status || 500;
    response.body = JSON.stringify({
      status: err.status || 500,
      message: err.message || 'Internal Server Error'
    });
  }

  debug(`response: ${JSON.stringify(response)}`);

  return response;
};
