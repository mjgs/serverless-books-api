const debug = require('debug')('booksapi:lib:adapters:db'); // eslint-disable-line no-unused-vars

const AWS = require('aws-sdk');
const { v4: uuidv4 } = require('uuid');

module.exports.putItem = async (tableName, params, options) => {
  if (typeof tableName !== 'string') throw new Error('Bad argument: tableName must be a string');
  if (typeof params !== 'object') throw new Error('Bad argument: params must be an object');
  if (typeof options !== 'object') throw new Error('Bad argument: options must be an object');

  const dynamoDb = new AWS.DynamoDB.DocumentClient();

  const putOptions = {
    TableName: tableName,
    Item: Object.assign(params, { uuid: uuidv4() }),
    ...options
  };

  debug(`putOptions: ${JSON.stringify(putOptions)}`);

  const putResult = await dynamoDb.put(putOptions).promise();

  return {
    putOptions,
    putResult
  };
};
