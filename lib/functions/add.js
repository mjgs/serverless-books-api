'use strict';

const debug = require('debug')('booksapi:lib:functions:add'); // eslint-disable-line no-unused-vars

const booksUtil = require('../utils');

module.exports.add = async event => {
  const data = JSON.parse(event.body);

  debug(`event.body: ${JSON.stringify(data)}`);

  const params = {
    name: data.name,
    releaseDate: data.releaseDate,
    authorName: data.authorName
  };

  const response = {};

  let result;
  try {
    result = await booksUtil.addBook(params);
    response.statusCode = 201;
    response.body = JSON.stringify(result);
  }
  catch (err) {
    response.statusCode = 500;
    response.body = JSON.stringify({
      status: 500,
      message: 'Internal Server Error'
    });
  }

  debug(`response: ${JSON.stringify(response)}`);

  return response;
};
