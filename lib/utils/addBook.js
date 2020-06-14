const debug = require('debug')('booksapi:lib:utils:addBook'); // eslint-disable-line no-unused-vars

const db = require('../adapters/db');

module.exports = async (params) => {
  if (typeof params !== 'object') throw new Error('Bad argument: params must be an object');

  const tableName = process.env.BOOKS_TABLE;

  debug(`tableName: ${tableName}`);

  let result;
  try {
    result = await db.create(tableName, params);
  }
  catch (err) {
    const msg = `Error running utils.addBook with params: ${JSON.stringify(params)}`;
    console.error(msg, err);
    return Promise.reject(new Error(msg));
  }

  return Promise.resolve(result);
};
