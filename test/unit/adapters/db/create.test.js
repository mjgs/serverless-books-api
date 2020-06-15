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
const uuidStub = {};
const stubs = {
  'aws-sdk': awsSdkStub,
  uuid: uuidStub
};
const createDbAdapterMock = proxyquire('../../../../lib/adapters/db/create', stubs);

describe('create', () => {
  it('should create a book', async () => {
    // setup
    const tableNameMock = chance.word();
    const paramsMock = {
      name: chance.sentence(),
      releaseDate: Date.now(),
      authorName: chance.name()
    };
    const uuidMock = uuidv4();
    const createdBookMock = {
      uuid: uuidMock,
      ...paramsMock
    };
    const createResultMock = Promise.resolve(createdBookMock);
    const promiseStub = sinon.stub().returns(createResultMock);
    const createStub = sinon.stub().returns({
      promise: promiseStub
    });
    awsSdkStub.DynamoDB = {
      DocumentClient: function() {
        return {
          put: createStub
        };
      }
    };
    uuidStub.v4 = sinon.stub().returns(uuidMock);

    // run
    const promise = createDbAdapterMock(tableNameMock, paramsMock);

    // test
    return expect(promise).to.eventually.be.fulfilled
      .then((value) => {
        expect(value).to.be.eql(createdBookMock);
        expect(createStub.calledOnce).to.be.true;
        expect(promiseStub.calledOnce).to.be.true;
      });
  });

  it('should return an error', async () => {
    // setup
    const tableNameMock = chance.word();
    const paramsMock = {
      name: chance.sentence(),
      releaseDate: Date.now(),
      authorName: chance.name()
    };
    const uuidMock = uuidv4();
    const createResultMock = Promise.reject(new Error('oh noes!'));
    const promiseStub = sinon.stub().returns(createResultMock);
    const createStub = sinon.stub().returns({
      promise: promiseStub
    });
    awsSdkStub.DynamoDB = {
      DocumentClient: function() {
        return {
          put: createStub
        };
      }
    };
    uuidStub.v4 = sinon.stub().returns(uuidMock);
    const consoleErrorStub = sinon.stub(console, 'error');

    // run
    const promise = createDbAdapterMock(tableNameMock, paramsMock);

    // test
    return expect(promise).to.eventually.be.rejected
      .then((err) => {
        expect(err).to.be.a('error');
        expect(err.message).to.be.equal('There was an error while creating a record in DynamoDb');
        expect(createStub.calledOnce).to.be.true;
        expect(consoleErrorStub.calledOnce).to.be.true;
        consoleErrorStub.restore();
      });
  });

  it('should return a tableName bad argument error', async () => {
    // setup
    const tableNameMock = undefined;
    const paramsMock = {};

    // run
    const promise = createDbAdapterMock(tableNameMock, paramsMock);

    // test
    return expect(promise).to.eventually.be.rejected
      .then((err) => {
        expect(err).to.be.a('error');
        expect(err.message).to.be.equal('Bad argument: tableName must be a string');
      });
  });

  it('should return a params bad argument error', async () => {
    // setup
    const tableNameMock = chance.word();
    const paramsMock = undefined;

    // run
    const promise = createDbAdapterMock(tableNameMock, paramsMock);

    // test
    return expect(promise).to.eventually.be.rejected
      .then((err) => {
        expect(err).to.be.a('error');
        expect(err.message).to.be.equal('Bad argument: params must be an object');
      });
  });
});
