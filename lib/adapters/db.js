const debug = require('debug')('booksapi:lib:adapters:db'); // eslint-disable-line no-unused-vars
const { v4: uuidv4 } = require('uuid');
const AWS = require('aws-sdk');

const putItem = (tableName, params, options) => {
  const dynamoDb = new AWS.DynamoDB.DocumentClient();

  const putOptions = {
    TableName: tableName,
    Item: Object.assign(params, { uuid: uuidv4() }),
    ...options
  };

  debug(`putOptions: ${JSON.stringify(putOptions)}`);

  return new Promise(function(resolve, reject) {
    dynamoDb.put(putOptions, (err, putResponse) => {
      if (err) {
        return reject(err);
      }
  
      debug(`putResponse: ${JSON.stringify(putResponse)}`);

      return resolve(putOptions.Item);
    });
  });
};

module.exports.addBook = (params) => {
  if (typeof params !== 'object') throw new Error('Bad argument: params must be an object');

  return putItem(process.env.BOOKS_TABLE, params, {});
};
