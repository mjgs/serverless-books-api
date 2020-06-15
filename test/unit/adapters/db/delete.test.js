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
  'aws-sdk': awsSdkStub
};
const deleteDbAdapterMock = proxyquire('../../../../lib/adapters/db/delete', stubs);

describe('delete', () => {
  it('should delete a book', async () => {
    // setup
    const tableNameMock = chance.word();
    const uuidMock = uuidv4();
    const bookMock = {
      uuid: uuidMock,
      name: chance.sentence(),
      releaseDate: Date.now(),
      authorName: chance.name()
    };
    const deleteResultMock = {
      Attributes: bookMock
    };
    const promiseStub = sinon.stub().returns(deleteResultMock);
    const deleteStub = sinon.stub().returns({
      promise: promiseStub
    });
    awsSdkStub.DynamoDB = {
      DocumentClient: function() {
        return {
          delete: deleteStub
        };
      }
    };

    // run
    const promise = deleteDbAdapterMock(tableNameMock, uuidMock);

    // test
    return expect(promise).to.be.eventually.fulfilled
      .then((value) => {
        expect(value).to.be.eql(bookMock);
        expect(deleteStub.calledOnce).to.be.true;
        expect(promiseStub.calledOnce).to.be.true;
      });
  });

  it('should return an error', async () => {
    // setup
    const tableNameMock = chance.word();
    const uuidMock = uuidv4();
    const promiseStub = sinon.stub().returns(Promise.reject(new Error('oh noes!')));
    const deleteStub = sinon.stub().returns({
      promise: promiseStub
    });
    awsSdkStub.DynamoDB = {
      DocumentClient: function() {
        return {
          delete: deleteStub
        };
      }
    };
    const consoleErrorStub = sinon.stub(console, 'error');

    // run
    const promise = deleteDbAdapterMock(tableNameMock, uuidMock);

    // test
    return expect(promise).to.be.eventually.rejected
      .then((err) => {
        expect(err).to.be.a('error');
        expect(err.message).to.be.equal('There was an error while deleting a record in DynamoDb');
        expect(deleteStub.calledOnce).to.be.true;
        expect(promiseStub.calledOnce).to.be.true;
        expect(consoleErrorStub.calledOnce).to.be.true;
        consoleErrorStub.restore();
      });
  });

  it('should return a tableName bad argument error', async () => {
    // setup
    const tableNameMock = undefined;
    const uuidMock = '';

    // run
    const promise = deleteDbAdapterMock(tableNameMock, uuidMock);

    // test
    return expect(promise).to.be.eventually.rejected
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
    const promise = deleteDbAdapterMock(tableNameMock, uuidMock);

    // test
    return expect(promise).to.be.eventually.rejected
      .then((err) => {
        expect(err).to.be.a('error');
        expect(err.message).to.be.equal('Bad argument: uuid must be a string');
      });
  });
});
