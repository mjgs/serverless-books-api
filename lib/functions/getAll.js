'use strict';

const debug = require('debug')('booksapi:lib:functions:getAll'); // eslint-disable-line no-unused-vars

const booksUtil = require('../utils');

module.exports.getAll = async event => {
  const response = {};

  let result;
  try {
    result = await booksUtil.getAllBooks();
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

  debug(`response: ${JSON.stringify(response)}`);

  return response;
};
