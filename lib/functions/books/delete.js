'use strict';

const debug = require('debug')('booksapi:lib:functions:books:delete'); // eslint-disable-line no-unused-vars

const books = require('../../utils/books');

module.exports.delete = async event => {
  const uuid = event.pathParameters.bookUuid;

  debug(`event.pathParameters.bookUuid: ${uuid}`);

  const response = {};

  let result;
  try {
    result = await books.deleteBook(uuid);
    response.statusCode = 200;
    response.body = JSON.stringify(result);
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
