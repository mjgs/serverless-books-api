const debug = require('debug')('booksapi:lib:utils:deleteBook'); // eslint-disable-line no-unused-vars

const db = require('../adapters/db');

module.exports = async (uuid) => {
  if (typeof uuid !== 'string') throw new Error('Bad argument: uuid must be a string');

  const tableName = process.env.BOOKS_TABLE;

  debug(`tableName: ${tableName}`);

  let result;
  try {
    result = await db.delete(tableName, uuid);
  }
  catch (err) {
    const msg = `Error running utils.deleteBook with uuid: ${uuid}`;
    console.error(msg, err);
    return Promise.reject(new Error(msg));
  }

  return Promise.resolve(result);
};
