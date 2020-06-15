const debug = require('debug')('booksapi:lib:adapters:db:delete'); // eslint-disable-line no-unused-vars

const AWS = require('aws-sdk');

module.exports = async (tableName, uuid) => {
  if (typeof tableName !== 'string') throw new Error('Bad argument: tableName must be a string');
  if (typeof uuid !== 'string') throw new Error('Bad argument: uuid must be a string');

  const dynamoDb = new AWS.DynamoDB.DocumentClient();

  const deleteOptions = {
    TableName: tableName,
    Key: {
      uuid: uuid,
    },
    ReturnValues: 'ALL_OLD'
  };

  debug(`deleteOptions: ${JSON.stringify(deleteOptions)}`);

  let result;
  try {
    result = await dynamoDb.delete(deleteOptions).promise();
  }
  catch (err) {
    const msg = 'There was an error while deleting a record in DynamoDb';
    console.error(msg, err);
    return Promise.reject(new Error(msg));
  }

  return Promise.resolve(result.Attributes);
};
