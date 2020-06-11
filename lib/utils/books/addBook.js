const debug = require('debug')('booksapi:lib:utils:addBook'); // eslint-disable-line no-unused-vars

const db = require('../../adapters/db');

module.exports = async (params) => {
  if (typeof params !== 'object') throw new Error('Bad argument: params must be an object');

  const tableName = process.env.BOOKS_TABLE;
  const dbQueryOptions = {};

  const result = await db.putItem(tableName, params, dbQueryOptions);

  return result.putOptions.Item;
};
