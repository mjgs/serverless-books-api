'use strict';

const debug = require('debug')('booksapi:lib:functions:books:get'); // eslint-disable-line no-unused-vars

const booksUtil = require('../../utils/books');

module.exports.get = async event => {
  const uuid = event.pathParameters.bookUuid;

  debug(`event.pathParameters.bookUuid: ${uuid}`);

  const response = {};

  let result;
  try {
    result = await booksUtil.getBook(uuid);
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
