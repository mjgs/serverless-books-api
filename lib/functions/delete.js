'use strict';

const debug = require('debug')('booksapi:lib:functions:delete'); // eslint-disable-line no-unused-vars

const booksUtil = require('../utils');

module.exports.delete = async event => {
  const uuid = event.pathParameters.bookUuid;

  debug(`event.pathParameters.bookUuid: ${uuid}`);

  const response = {};

  let result;
  try {
    result = await booksUtil.deleteBook(uuid);
    response.statusCode = 200;
    response.body = JSON.stringify(result);
  }
  catch (err) {
    response.statusCode = err.status || 500;
    response.body = JSON.stringify({
      status: 500,
      message: 'Internal Server Error'
    });
  }

  if (!result && response.statusCode === 200) {
    response.statusCode = 404;
    response.body = JSON.stringify({
      status: 404,
      message: 'Not found'
    });
  }

  debug(`response: ${JSON.stringify(response)}`);

  return response;
};
