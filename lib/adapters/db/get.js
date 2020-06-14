const debug = require('debug')('booksapi:lib:adapters:db:get'); // eslint-disable-line no-unused-vars

const AWS = require('aws-sdk');

module.exports = async (tableName, uuid) => {
  if (typeof tableName !== 'string') throw new Error('Bad argument: tableName must be a string');
  if (typeof uuid !== 'string') throw new Error('Bad argument: uuid must be a string');

  const getOptions = {
    TableName: tableName,
    Key: {
      uuid: uuid
    }
  };

  debug(`getOptions: ${JSON.stringify(getOptions)}`);

  const dynamoDb = new AWS.DynamoDB.DocumentClient();
  
  let result;
  try {
    result = await dynamoDb.get(getOptions).promise();
  }
  catch (err) {
    const msg = 'There was an error while getting a record from DynamoDb';
    console.error(msg, err);
    return Promise.reject(new Error(msg));
  }

  return Promise.resolve(result.Item);
};
