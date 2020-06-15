const debug = require('debug')('booksapi:lib:utils:updateBook'); // eslint-disable-line no-unused-vars

const db = require('../adapters/db');

module.exports = async (uuid, params) => {
  if (typeof uuid !== 'string') throw new Error('Bad argument: uuid must be a string');
  if (typeof params !== 'object') throw new Error('Bad argument: params must be an object');

  const tableName = process.env.BOOKS_TABLE;

  debug(`tableName: ${tableName}`);

  let result;
  try {
    result = await db.update(tableName, uuid, params);
  }
  catch (err) {
    const msg = `Error running utils.updateBook with uuid: ${uuid} and params: ${JSON.stringify(params)}`;
    console.error(msg, err);
    return Promise.reject(new Error(msg));
  }

  return Promise.resolve(result);
};
