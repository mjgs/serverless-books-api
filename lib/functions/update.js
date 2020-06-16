'use strict';

const debug = require('debug')('booksapi:lib:functions:update'); // eslint-disable-line no-unused-vars

const booksUtil = require('../utils');

module.exports.update = async event => {
  const uuid = event.pathParameters.bookUuid;

  debug(`event.pathParameters.bookUuid: ${uuid}`);

  const data = JSON.parse(event.body) || {};

  debug(`event.body: ${JSON.stringify(data)}`);

  const params = {
    name: data.name,
    releaseDate: data.releaseDate,
    authorName: data.authorName
  };

  const response = {};

  let result;
  try {
    result = await booksUtil.updateBook(uuid, params);
    response.statusCode = 200;
    response.body = JSON.stringify(result);
  }
  catch (err) {
    response.statusCode = 500;
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
