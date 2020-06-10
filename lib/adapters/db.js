const debug = require('debug')('booksapi:lib:adapters:db'); // eslint-disable-line no-unused-vars
const { v4: uuidv4 } = require('uuid');
const AWS = require('aws-sdk');

const putItem = async (tableName, params, options) => {
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

module.exports.addBook = async (params) => {
  if (typeof params !== 'object') throw new Error('Bad argument: params must be an object');

  const result = await putItem(process.env.BOOKS_TABLE, params, {});
  return result.putOptions.Item;
};
