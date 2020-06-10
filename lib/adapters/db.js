const { v4: uuidv4 } = require('uuid');
const AWS = require('aws-sdk');

module.exports.add = function add(params) {
  const dynamoDb = new AWS.DynamoDB.DocumentClient();

  const putOptions = {
    TableName: process.env.DYNAMODB_TABLE,
    Item: {
      uuid: uuidv4(),
      name: params.name,
      releaseDate: params.releaseDate,
      authorName: params.authorName
    },
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
