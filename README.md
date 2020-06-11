# Serverless Books API for a Library

Implements a Books API for a Library, intended to be run on AWS using serverless.

## Description

- Functions run on AWS Lambda
- Data is stored in AWS DynamoDB
- Includes a very simple token based authorization for operations that modify data

## Assumptions

- Authorization is only required for routes that modify data
- Correctly configured serverless cli installation
- AWS account with the required priveledges

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

## Development

To run the functions locally:

```
npm install
npm start
```

The list of the available endpoints will be printed to the console:

```
GET  | http://localhost:3000/dev/hello
POST | http://localhost:3000/dev/book/add
```

## Deploying

Ensure you have configured serverless with the [correct aws access rights](https://github.com/serverless/serverless/blob/master/docs/providers/aws/guide/credentials.md). Then run:

```
serverless deploy
```

## Tests

To run both unit and integration tests:

```
serverless deploy
npm test
```

## Debugging

For interactive debugging in VSCode, add the following to .vscode/launch.json:

```
{
  // Use IntelliSense to learn about possible attributes.
  // Hover to view descriptions of existing attributes.
  // For more information, visit: https://go.microsoft.com/fwlink/?linkid=830387
  "version": "0.2.0",
  "configurations": [
    {
      "type": "node",
      "request": "launch",
      "name": "npm run debug:start",
      "runtimeExecutable": "npm",
      "runtimeArgs": [
        "run-script",
        "debug:start"
      ],
      "port": 9229,
      "outputCapture": "std"
    },
    {
      "type": "node",
      "request": "launch",
      "name": "npm run debug:test:unit",
      "runtimeExecutable": "npm",
      "runtimeArgs": [
        "run-script",
        "debug:test:unit"
      ],
      "port": 9229,
      "outputCapture": "std"
    },
    {
      "type": "node",
      "request": "launch",
      "name": "npm run debug:test:integration",
      "runtimeExecutable": "npm",
      "runtimeArgs": [
        "run-script",
        "debug:test:integration"
      ],
      "port": 9229,
      "outputCapture": "std"
    }
  ]
}
```

Set some breakpoints in your code (handlers or tests files), then

1. Click the Run button
2. Select the run configuration from the drop down menu (debug:start or debug:test:unit or debug:test:integration)
3. Click the play button next to the drop down menu
4. The debugger should then run the code and stop at your first breakpoint

## Todo

See the [TODO](https://github.com/mjgs/serverless-books-api/blob/master/TODO.md) page.

## Credits

I found the following resources helpfull while building this repo:

- [AWS SDK for JavaScript](https://docs.aws.amazon.com/AWSJavaScriptSDK/latest)
- [Serverless Framework Documentation](https://www.serverless.com/framework/docs/)
- [Full Stack Developmnt on AWS using Serverless](https://www.youtube.com/playlist?list=PLIIjEI2fYC-BZliSOIhWUqiiwadhCvewg)
- [Testing Node serverless applications — AWS Lambda functions](https://blog.logrocket.com/testing-node-serverless-applications-aws-lambda-functions)
- [Debugging lambda functions locally in vscode with actual break-points](https://medium.com/@OneMuppet_/debugging-lambada-functions-locally-in-vscode-with-actual-break-points-deee6235f590)
- [DynamoDB Guide](https://www.dynamodbguide.com/what-is-dynamo-db)
- [Serverless Offline](https://github.com/dherault/serverless-offline)
- [AWS mocks for Javascript/Node.js aws-sdk](https://github.com/dwyl/aws-sdk-mock)
- [JSON Schema Validation: A Vocabulary for Structural Validation of JSON](http://json-schema.org/draft/2019-09/json-schema-validation.html)
