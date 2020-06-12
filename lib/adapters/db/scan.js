const debug = require('debug')('booksapi:lib:adapters:db:scan'); // eslint-disable-line no-unused-vars

const AWS = require('aws-sdk');

module.exports = async (tableName, options) => {
  if (typeof tableName !== 'string') throw new Error('Bad argument: tableName must be a string');
  if (typeof options !== 'object') throw new Error('Bad argument: options must be an object');

  const dynamoDb = new AWS.DynamoDB.DocumentClient();

  const scanOptions = {
    TableName: tableName,
    ...options
  };

  debug(`scanOptions: ${JSON.stringify(scanOptions)}`);

  const scanResult = await dynamoDb.scan(scanOptions).promise();

  return {
    scanOptions,
    scanResult
  };
};
