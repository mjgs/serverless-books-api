const debug = require('debug')('booksapi:lib:adapters:db:create'); // eslint-disable-line no-unused-vars

const AWS = require('aws-sdk');
const uuid = require('uuid');

module.exports = async (tableName, params) => {
  if (typeof tableName !== 'string') return Promise.reject(new Error('Bad argument: tableName must be a string'));
  if (typeof params !== 'object') return Promise.reject(new Error('Bad argument: params must be an object'));

  const createOptions = {
    TableName: tableName,
    Item: Object.assign(params, { uuid: uuid.v4() })
  };

  debug(`createOptions: ${JSON.stringify(createOptions)}`);

  const dynamoDb = new AWS.DynamoDB.DocumentClient();

  try {
    await dynamoDb.put(createOptions).promise();
  }
  catch (err) {
    const msg = 'There was an error while creating a record in DynamoDb';
    console.error(msg, err);
    return Promise.reject(new Error(msg));
  }

  return Promise.resolve(createOptions.Item);
};
