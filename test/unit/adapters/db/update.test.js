/* eslint-env mocha */
/* eslint-disable no-unused-expressions */
'use strict';

const expect = require('chai').expect;
const proxyquire = require('proxyquire').noCallThru();
const sinon = require('sinon');
const chance = new (require('chance'))();
const { v4: uuidv4 } = require('uuid');

const awsSdkStub = {};
const stubs = {
  'aws-sdk': awsSdkStub
};
const updateDbAdapterMock = proxyquire('../../../../lib/adapters/db/update', stubs);

describe('update', function() {
  it('should update a book', async function() {
    // setup
    const tableNameMock = chance.word();
    const paramsMock = {
      uuid: uuidv4(),
      name: chance.sentence(),
      releaseDate: Date.now(),
      authorName: chance.name()
    };
    const updatedBookMock = Object.assign({}, paramsMock);
    const updateResultMock = Promise.resolve({
      Attributes: updatedBookMock
    });
    const promiseStub = sinon.stub().returns(updateResultMock);
    const updateStub = sinon.stub().returns({
      promise: promiseStub
    });
    awsSdkStub.DynamoDB = {
      DocumentClient: function() {
        return {
          update: updateStub
        };
      }
    };

    // run
    const promise = updateDbAdapterMock(tableNameMock, paramsMock.uuid, paramsMock);
    
    // test
    return expect(promise).to.be.eventually.fulfilled
      .then((value) => {
        expect(value).to.be.eql(updatedBookMock);
        expect(updateStub.calledOnce).to.be.true;
        expect(promiseStub.calledOnce).to.be.true;
      });
  });

  it('should handle the case where book is not found in the database', async function() {
    // setup
    const tableNameMock = chance.word();
    const paramsMock = {
      uuid: uuidv4()
    };
    const notFoundInDb = { code: 'ConditionalCheckFailedException' };
    const updateResultMock = Promise.reject(notFoundInDb);
    const promiseStub = sinon.stub().returns(updateResultMock);
    const updateStub = sinon.stub().returns({
      promise: promiseStub
    });
    awsSdkStub.DynamoDB = {
      DocumentClient: function() {
        return {
          update: updateStub
        };
      }
    };

    // run
    const promise = updateDbAdapterMock(tableNameMock, paramsMock.uuid, paramsMock);
    
    // test
    return expect(promise).to.be.eventually.fulfilled
      .then((value) => {
        expect(value).to.be.equal(undefined);
        expect(updateStub.calledOnce).to.be.true;
        expect(promiseStub.calledOnce).to.be.true;
      });
  });

  it('should return an error', async function() {
    // setup
    const tableNameMock = chance.word();
    const paramsMock = {
      uuid: uuidv4(),
      name: chance.sentence(),
      releaseDate: Date.now(),
      authorName: chance.name()
    };
    const updateResultMock = Promise.reject(new Error('oh noes!'));
    const promiseStub = sinon.stub().returns(updateResultMock);
    const updateStub = sinon.stub().returns({
      promise: promiseStub
    });
    awsSdkStub.DynamoDB = {
      DocumentClient: function() {
        return {
          update: updateStub
        };
      }
    };
    const consoleErrorStub = sinon.stub(console, 'error');

    // run
    const promise = updateDbAdapterMock(tableNameMock, paramsMock.uuid, paramsMock);
    
    // test
    return expect(promise).to.be.eventually.rejected
      .then((err) => {
        expect(err).to.be.a('error');
        expect(err.message).to.be.equal('There was an error while updating record in DynamoDb');
        expect(updateStub.calledOnce).to.be.true;
        expect(promiseStub.calledOnce).to.be.true;
        expect(consoleErrorStub.calledOnce).to.be.true;
        consoleErrorStub.restore();
      });
  });

  it('should return a tableName bad argument error', async function() {
    // setup
    const tableNameMock = undefined;
    const uuidMock = uuidv4();
    const paramsMock = {};

    // run
    const promise = updateDbAdapterMock(tableNameMock, uuidMock, paramsMock);

    // test
    return expect(promise).to.be.eventually.rejected
      .then((err) => {
        expect(err).to.be.a('error');
        expect(err.message).to.be.equal('Bad argument: tableName must be a string');
      });
  });

  it('should return a uuid bad argument error', async function() {
    // setup
    const tableNameMock = chance.word();
    const uuidMock = undefined;
    const paramsMock = {};

    // run
    const promise = updateDbAdapterMock(tableNameMock, uuidMock, paramsMock);

    // test
    return expect(promise).to.be.eventually.rejected
      .then((err) => {
        expect(err).to.be.a('error');
        expect(err.message).to.be.equal('Bad argument: uuid must be a string');
      });
  });

  it('should return a params bad argument error', async function() {
    // setup
    const tableNameMock = chance.word();
    const uuidMock = uuidv4();
    const paramsMock = undefined;

    // run
    const promise = updateDbAdapterMock(tableNameMock, uuidMock, paramsMock);

    // test
    return expect(promise).to.be.eventually.rejected
      .then((err) => {
        expect(err).to.be.a('error');
        expect(err.message).to.be.equal('Bad argument: params must be an object');
      });
  });
});
