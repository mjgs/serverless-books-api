const debug = require('debug')('booksapi:lib:adapters:db:deleteItem'); // eslint-disable-line no-unused-vars

const AWS = require('aws-sdk');

module.exports = async (tableName, uuid, options) => {
  if (typeof tableName !== 'string') throw new Error('Bad argument: tableName must be a string');
  if (typeof uuid !== 'string') throw new Error('Bad argument: uuid must be a string');
  if (typeof options !== 'object') throw new Error('Bad argument: options must be an object');

  const dynamoDb = new AWS.DynamoDB.DocumentClient();

  const deleteOptions = {
    TableName: tableName,
    Key: {
      uuid: uuid,
    },
    ...options
  };

  debug(`deleteOptions: ${JSON.stringify(deleteOptions)}`);

  const deleteResult = await dynamoDb.delete(deleteOptions).promise();

  return {
    deleteOptions,
    deleteResult
  };
};
