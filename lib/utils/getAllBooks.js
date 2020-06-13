const debug = require('debug')('booksapi:lib:utils:getAllBooks'); // eslint-disable-line no-unused-vars

const db = require('../adapters/db');

module.exports = async () => {
  const tableName = process.env.BOOKS_TABLE;
  const dbQueryOptions = {};

  const result = await db.getAll(tableName, dbQueryOptions);

  return result.scanResult.Items;
};
