/* eslint-env mocha */
/* eslint-disable no-unused-expressions */
'use strict';

const expect = require('chai').expect;
const proxyquire = require('proxyquire').noCallThru();
const sinon = require('sinon');
const chance = new (require('chance'))();
const { v4: uuidv4 } = require('uuid');

const awsSdkStub = {};
// const uuidStub = {};
const stubs = {
  'aws-sdk': awsSdkStub,
  // uuid: uuidStub
};
const scanDbAdapterMock = proxyquire('../../../../lib/adapters/db/scan', stubs);

describe('scan', () => {
  it('should return a list of book objects', async () => {
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
    const getAllReturnMock = [ bookMock1, bookMock2 ];
    const promiseStub = sinon.stub().returns(getAllReturnMock);
    const getAllStub = sinon.stub().returns({
      promise: promiseStub
    });
    awsSdkStub.DynamoDB = {
      DocumentClient: function() {
        return {
          getAll: getAllStub
        };
      }
    };
    const queryOptionsMock = {};

    // run
    const getItemResult = await scanDbAdapterMock(tableNameMock, queryOptionsMock);

    // test
    expect(getItemResult).to.not.be.empty;
    expect(getItemResult.getAllOptions).to.be.an('object');
    expect(getItemResult.getAllResult).to.be.an('object');
    expect(getItemResult.getAllEesult).to.be.eql(getAllReturnMock);
    expect(getItemResult.getAllOptions.TableName).to.be.equal(tableNameMock);
    expect(getAllStub.calledOnce).to.be.true;
    expect(promiseStub.calledOnce).to.be.true;
  });

  it('should throw an error', async () => {
    // setup
    const tableNameMock = chance.word();
    const getAllStub = sinon.stub().returns({
      promise: () => Promise.reject(new Error('oh noes!'))
    });
    awsSdkStub.DynamoDB = {
      DocumentClient: function() {
        return {
          getAll: getAllStub
        };
      }
    };
    const queryOptionsMock = {};

    // run
    try {
      await scanDbAdapterMock(tableNameMock, queryOptionsMock);
    }
    catch (err) {
      // test
      expect(err).to.be.a('error');
      expect(err.message).to.be.equal('oh noes!');
    }
  });

  it('should throw a tableName bad argument error', async () => {
    // setup
    const tableNameMock = undefined;
    const queryOptionsMock = {};

    // run
    try {
      await scanDbAdapterMock(tableNameMock, queryOptionsMock);
    }
    catch (err) {
      // test
      expect(err).to.be.a('error');
      expect(err.message).to.be.equal('Bad argument: tableName must be a string');
    }
  });

  it('should throw a options bad argument error', async () => {
    // setup
    const tableNameMock = chance.word();
    const queryOptionsMock = undefined;

    // run
    try {
      await scanDbAdapterMock(tableNameMock, queryOptionsMock);
    }
    catch (err) {
      // test
      expect(err).to.be.a('error');
      expect(err.message).to.be.equal('Bad argument: options must be an object');
    }
  });
});
