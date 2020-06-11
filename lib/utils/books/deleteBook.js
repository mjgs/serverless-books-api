const debug = require('debug')('booksapi:lib:utils:deleteBook'); // eslint-disable-line no-unused-vars

const db = require('../../adapters/db');

module.exports = async (uuid) => {
  if (typeof uuid !== 'string') throw new Error('Bad argument: uuid must be a string');

  const tableName = process.env.BOOKS_TABLE;
  const dbQueryOptions = {
    ReturnValues: 'ALL_OLD'
  };

  const result = await db.deleteItem(tableName, uuid, dbQueryOptions);

  return result.deleteResult.Attributes;
};
