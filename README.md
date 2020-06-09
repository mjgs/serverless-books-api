# Serverless Books API for a Library

Implements a Books API for a Library, intended to be run on AWS using serverless.

## Description

- Functions run on AWS Lambda
- Data is stored in AWS DynamoDB
- Includes a very simple token based authorization for operations that modify data

## Assumptions

## Project structure

```
.
├── README.md        - Documentation
├── lib
│   ├── adapters     - I/O operations
│   ├── functions    - Functions that get deployed as lambdas to cloud infrastructure
│   ├── schemas      - Used by cloud infrastructure to validate request data
│   └── utils        - Shared utility functions
├── serverless.yml   - Cloud dployment configuration
└── test             - Tests
```

## Tests

```
mocha test
```

## Debugging

## Credits

I found the following resources helpfull while building this repo:

- [Serverless Framework Documentation](https://www.serverless.com/framework/docs/)
- [Full Stack Developmnt on AWS using Serverless](https://www.youtube.com/playlist?list=PLIIjEI2fYC-BZliSOIhWUqiiwadhCvewg)
- [Testing Node serverless applications — AWS Lambda functions](https://blog.logrocket.com/testing-node-serverless-applications-aws-lambda-functions)
- [Debugging lambda functions locally in vscode with actual break-points](https://medium.com/@OneMuppet_/debugging-lambada-functions-locally-in-vscode-with-actual-break-points-deee6235f590)
- [DynamoDB Guide](https://www.dynamodbguide.com/what-is-dynamo-db)
- [Serverless Offline](https://github.com/dherault/serverless-offline)
- [AWS mocks for Javascript/Node.js aws-sdk](https://github.com/dwyl/aws-sdk-mock)
- [JSON Schema Validation: A Vocabulary for Structural Validation of JSON](http://json-schema.org/draft/2019-09/json-schema-validation.html)
