# Serverless Books API for a Library

Implements a Books API for a Library, intended to be run on AWS using serverless.

## Description

- Functions run on AWS Lambda
- Data is stored in AWS DynamoDB
- Uses domain driven design techniques with handlers/utilities/adapters layers

## Assumptions

- Correctly configured serverless cli installation
- AWS account with the required priveledges

## Book model

| Parameter | Type | Notes
| :--- | :---: | :--- |
| uuid | string | |
| name | string | |
| releaseDate | integer | timestamp |
| authorName | string | |

## Project structure

```
.
├── README.md        - Documentation
├── lib
│   ├── adapters     - I/O operations
│   ├── functions    - Functions that get deployed as lambdas to cloud infrastructure
│   ├── schemas      - Used by cloud infrastructure to validate request data
│   └── utils        - Shared utility functions
├── serverless.yml   - Cloud deployment configuration
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
POST | http://localhost:3000/dev/book/add
POST | http://localhost:3000/dev/book/{bookUuid}/delete
GET  | http://localhost:3000/dev/book/{bookUuid}
GET  | http://localhost:3000/dev/books
POST | http://localhost:3000/dev/book/{bookUuid}/update
```

## Deploying

Ensure you have configured serverless with the [correct aws access rights](https://github.com/serverless/serverless/blob/master/docs/providers/aws/guide/credentials.md).

Then run:

```
serverless deploy
```

## Tests

Create a test env config file:

```
echo "export API_BASE_URL=[ADD YOUR BASE URL HERE]" > .env
```

To run both unit and integration tests:

```
npm test
```

Update API_BASE_URL to run the integration tests against different versions of the code (i.e. local / dev / production etc).

You can run individual test sets like so:

```
npm run test:unit
npm run test:integration
```

## Debugging

For interactive debugging in VSCode:

1. Create a VSCode run config in your project root (.vscode/launch.json) - [see sample](https://github.com/mjgs/serverless-books-api/blob/master/launch.json.sample)
2. Set some breakpoints in the code or tests files
3. Click the Run button
4. Select a run configuration from the drop down menu
5. Click the play button next to the drop down menu
6. The debugger will then run the code and stop at the first breakpoint you set

For additional logging set the following environment variable:

```
DEBUG=booksapi:*
```

## Todo

See the [TODO](https://github.com/mjgs/serverless-books-api/blob/master/TODO.md) page.

## Possible improvements

- A way to run both integration tests and lambda code in the debugger at the same time
- Add an authorize function on routes that modify data

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
