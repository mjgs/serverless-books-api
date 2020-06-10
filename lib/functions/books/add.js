'use strict';

const db = require('../../adapters/db.js');

module.exports.add = async event => {
  const data = JSON.parse(event.body);
  const params = {
    uuid: data.uuid,
    name: data.name,
    releaseDate: data.releaseDate,
    authorName: data.authorName
  };

  let bookRecord;
  try {
    bookRecord = await db.add(params);
  }
  catch (err) {
    return {
      statusCode: 500,
      message: err.message
    };
  }

  return {
    statusCode: 201,
    book: bookRecord
  };
};
