const { v4: uuidv4 } = require('uuid');
const AWS = require('aws-sdk');

module.exports.add = function add(tableName, params) {
  if (typeof tableName !== 'string') throw new Error('Bad argument: tableName must be a string');
  if (typeof params !== 'object') throw new Error('Bad argument: params must be an object');

  const dynamoDb = new AWS.DynamoDB.DocumentClient();

  const putOptions = {
    TableName: tableName,
    Item: Object.assign(params, { uuid: uuidv4() })
  };

  return new Promise(function(resolve, reject) {
    dynamoDb.put(putOptions, (err) => {
      if (err) {
        return reject(err);
      }
  
      return resolve(putOptions.Item);
    });
  });
};
