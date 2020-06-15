const debug = require('debug')('booksapi:lib:utils:getAllBooks'); // eslint-disable-line no-unused-vars

const db = require('../adapters/db');

module.exports = async () => {
  const tableName = process.env.BOOKS_TABLE;

  debug(`tableName: ${tableName}`);

  let result;
  try {
    result = await db.getAll(tableName);
  }
  catch (err) {
    const msg = 'Error running utils.getAllBooks';
    console.error(msg, err);
    return Promise.reject(new Error(msg));
  }

  return Promise.resolve(result);
};
