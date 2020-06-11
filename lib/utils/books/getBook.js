const debug = require('debug')('booksapi:lib:utils:getBook'); // eslint-disable-line no-unused-vars

const db = require('../../adapters/db');

module.exports = async (uuid) => {
  if (typeof uuid !== 'string') throw new Error('Bad argument: uuid must be a string');

  const tableName = process.env.BOOKS_TABLE;
  const dbQueryOptions = {};

  const result = await db.getItem(tableName, uuid, dbQueryOptions);
  return (result.getResult.Item) ? result.getResult.Item : {};
};
