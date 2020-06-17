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
const stubs = {
  'aws-sdk': awsSdkStub,
};
const getAllDbAdapterMock = proxyquire('../../../../lib/adapters/db/getAll', stubs);

describe('getAll', function() {
  it('should get all books', async function() {
    // setup
    const tableNameMock = chance.word();
    const bookMock1 = {
      uuid: uuidv4(),
      name: chance.sentence(),
      releaseDate: Date.now(),
      authorName: chance.name()
    };
    const bookMock2 = {
      uuid: uuidv4(),
      name: chance.sentence(),
      releaseDate: Date.now(),
      authorName: chance.name()
    };
    const bookListMock = [ bookMock1, bookMock2 ];
    const getAllResultsMock = Promise.resolve({
      Items: bookListMock
    });
    const promiseStub = sinon.stub().returns(getAllResultsMock);
    const scanStub = sinon.stub().returns({
      promise: promiseStub
    });
    awsSdkStub.DynamoDB = {
      DocumentClient: function() {
        return {
          scan: scanStub
        };
      }
    };

    // run
    const promise = getAllDbAdapterMock(tableNameMock);

    // test
    return expect(promise).to.be.eventually.fulfilled
      .then((value) => {
        expect(value).to.be.eql(bookListMock);
        expect(scanStub.calledOnce).to.be.true;
        expect(promiseStub.calledOnce).to.be.true;
      });
  });

  it('should return an error', async function() {
    // setup
    const tableNameMock = chance.word();
    const getAllResultMock = Promise.reject(new Error('oh noes!'));
    const promiseStub = sinon.stub().returns(getAllResultMock);
    const scanStub = sinon.stub().returns({
      promise: promiseStub
    });
    awsSdkStub.DynamoDB = {
      DocumentClient: function() {
        return {
          scan: scanStub
        };
      }
    };
    const consoleErrorStub = sinon.stub(console, 'error');

    // run
    const promise = getAllDbAdapterMock(tableNameMock);

    // test
    return expect(promise).to.be.eventually.rejected
      .then((err) => {
        expect(err).to.be.a('error');
        expect(err.message).to.be.equal('There was an error while getting all records from DynamoDb');
        expect(consoleErrorStub.calledOnce).to.be.true;
        consoleErrorStub.restore();
      });
  });

  it('should return a tableName bad argument error', async function() {
    // setup
    const tableNameMock = undefined;

    // run
    const promise = getAllDbAdapterMock(tableNameMock);

    // test
    return expect(promise).to.be.eventually.rejected
      .then((err) => {
        expect(err).to.be.a('error');
        expect(err.message).to.be.equal('Bad argument: tableName must be a string');
      });
  });
});
