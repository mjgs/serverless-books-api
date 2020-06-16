const debug = require('debug')('booksapi:lib:adapters:db:updateItem'); // eslint-disable-line no-unused-vars

const AWS = require('aws-sdk');

module.exports = async (tableName, uuid, params) => {
  if (typeof tableName !== 'string') throw new Error('Bad argument: tableName must be a string');
  if (typeof uuid !== 'string') throw new Error('Bad argument: uuid must be a string');
  if (typeof params !== 'object') throw new Error('Bad argument: params must be an object');

  const dynamoDb = new AWS.DynamoDB.DocumentClient();

  const updateOptions = {
    TableName: tableName,
    Key: { uuid: uuid, },
    ExpressionAttributeNames: { '#u': 'uuid' },
    ExpressionAttributeValues: {},
    UpdateExpression: '',
    ConditionExpression: 'attribute_exists(#u)',
    ReturnValues: 'ALL_NEW'
  };

  let updateExpression = 'SET ';

  if (params.name) {
    updateExpression += '#bookName = :bn, ';
    updateOptions.ExpressionAttributeNames['#bookName'] = 'name';
    updateOptions.ExpressionAttributeValues[':bn'] = params.name;
  }

  if (params.releaseDate) {
    updateExpression += '#releaseDate = :rd, ';
    updateOptions.ExpressionAttributeNames['#releaseDate'] = 'releaseDate';
    updateOptions.ExpressionAttributeValues[':rd'] = params.releaseDate;
  }

  if (params.authorName) {
    updateExpression += '#authorName = :an, ';
    updateOptions.ExpressionAttributeNames['#authorName'] = 'authorName';
    updateOptions.ExpressionAttributeValues[':an'] = params.authorName;
  }

  updateOptions.UpdateExpression = updateExpression.replace(/, $/g, '');

  debug(`updateOptions: ${JSON.stringify(updateOptions)}`);

  let result;
  try {
    result = await dynamoDb.update(updateOptions).promise();
  }
  catch (err) {
    if (err.code === 'ConditionalCheckFailedException') {
      return Promise.resolve(undefined); // not found
    }
    const msg = 'There was an error while updating record in DynamoDb';
    console.error(msg, err);
    return Promise.reject(new Error(msg));
  }

  return Promise.resolve(result.Attributes);
};
