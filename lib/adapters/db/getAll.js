const debug = require('debug')('booksapi:lib:adapters:db:getAll'); // eslint-disable-line no-unused-vars

const AWS = require('aws-sdk');

module.exports = async (tableName) => {
  if (typeof tableName !== 'string') throw new Error('Bad argument: tableName must be a string');

  const dynamoDb = new AWS.DynamoDB.DocumentClient();

  const scanOptions = {
    TableName: tableName
  };

  debug(`scanOptions: ${JSON.stringify(scanOptions)}`);

  let result;
  try {
    result = await dynamoDb.scan(scanOptions).promise();
  }
  catch (err) {
    const msg = 'There was an error while getting all records from DynamoDb';
    console.error(msg, err);
    return Promise.reject(new Error(msg));
  }

  return Promise.resolve(result.Items);
};
