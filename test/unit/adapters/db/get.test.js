/* eslint-env mocha */
/* eslint-disable no-unused-expressions */
'use strict';

const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
const expect = chai.expect;
const proxyquire = require('proxyquire').noCallThru();
const sinon = require('sinon');
const chance = new (require('chance'))();
const { v4: uuidv4 } = require('uuid');

chai.use(chaiAsPromised);

const awsSdkStub = {};
const consoleStub = {
  error: sinon.stub()
};
const stubs = {
  'aws-sdk': awsSdkStub,
  console: consoleStub
};
const getDbAdapterMock = proxyquire('../../../../lib/adapters/db/get', stubs);

describe('get', () => {
  it('should get a book', async () => {
    // setup
    const tableNameMock = chance.word();
    const uuidMock = uuidv4();
    const bookMock = {
      uuid: uuidMock,
      name: chance.sentence(),
      releaseDate: Date.now(),
      authorName: chance.name()
    };
    const getResultMock = Promise.resolve({
      Table: tableNameMock,
      Item: bookMock
    });
    const promiseStub = sinon.stub().returns(getResultMock);
    const getStub = sinon.stub().returns({
      promise: promiseStub
    });
    awsSdkStub.DynamoDB = {
      DocumentClient: function() {
        return {
          get: getStub
        };
      }
    };

    // run
    const promise = getDbAdapterMock(tableNameMock, uuidMock);

    // test
    return expect(promise).to.be.fulfilled
      .then((value) => {
        expect(value).to.be.eql(bookMock);
        expect(getStub.calledOnce).to.be.true;
        expect(promiseStub.calledOnce).to.be.true;
      });
  });

  it('should return an error', async () => {
    // setup
    const tableNameMock = chance.word();
    const uuidMock = uuidv4();
    const getResultMock = Promise.reject(new Error('oh noes!'));
    const promiseStub = sinon.stub().returns(getResultMock);
    const getStub = sinon.stub().returns({
      promise: promiseStub
    });
    awsSdkStub.DynamoDB = {
      DocumentClient: function() {
        return {
          get: getStub
        };
      }
    };
    const consoleErrorStub = sinon.stub(console, 'error');

    // run
    const promise = getDbAdapterMock(tableNameMock, uuidMock);

    // test
    return expect(promise).to.be.rejected
      .then((err) => {
        expect(err).to.be.a('error');
        expect(err.message).to.be.equal('There was an error while getting a record from DynamoDb');
        expect(getStub.calledOnce).to.be.true;
        expect(consoleErrorStub.calledOnce).to.be.true;
        consoleErrorStub.restore();
      });
  });

  it('should return a tableName bad argument error', async () => {
    // setup
    const tableNameMock = undefined;
    const uuidMock = '';

    // run
    const promise = getDbAdapterMock(tableNameMock, uuidMock);

    // test
    return expect(promise).to.be.rejected
      .then((err) => {
        expect(err).to.be.a('error');
        expect(err.message).to.be.equal('Bad argument: tableName must be a string');
      });
  });

  it('should return a uuid bad argument error', async () => {
    // setup
    const tableNameMock = chance.word();
    const uuidMock = undefined;

    // run
    const promise = getDbAdapterMock(tableNameMock, uuidMock);

    // test
    return expect(promise).to.be.rejected
      .then((err) => {
        expect(err).to.be.a('error');
        expect(err.message).to.be.equal('Bad argument: uuid must be a string');
      });
  });
});
