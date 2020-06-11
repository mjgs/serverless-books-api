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
const getItemDbAdapterMock = proxyquire('../../../../lib/adapters/db/getItem', stubs);

describe('getItem', () => {
  it('should return a book object', async () => {
    // setup
    const tableNameMock = chance.word();
    const uuidMock = uuidv4();
    const getResultMock = {
      uuid: uuidMock,
      name: chance.sentence(),
      releaseDate: Date.now(),
      authorName: chance.name()
    };
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
    const queryOptionsMock = {};

    // run
    const getItemResult = await getItemDbAdapterMock(tableNameMock, uuidMock, queryOptionsMock);

    // test
    expect(getItemResult).to.not.be.empty;
    expect(getItemResult.getOptions).to.be.an('object');
    expect(getItemResult.getResult).to.be.an('object');
    expect(getItemResult.getResult).to.be.eql(getResultMock);
    expect(getItemResult.getOptions.TableName).to.be.equal(tableNameMock);
    expect(getItemResult.getOptions.Key).to.be.an('object');
    expect(getItemResult.getOptions.Key.uuid).to.be.equal(uuidMock);
    expect(getStub.calledOnce).to.be.true;
    expect(promiseStub.calledOnce).to.be.true;
  });

  it('should throw an error', async () => {
    // setup
    const tableNameMock = chance.word();
    const uuidMock = uuidv4();
    const getStub = sinon.stub().returns({
      promise: () => Promise.reject(new Error('oh noes!'))
    });
    awsSdkStub.DynamoDB = {
      DocumentClient: function() {
        return {
          get: getStub
        };
      }
    };
    const queryOptionsMock = {};

    // run
    try {
      await getItemDbAdapterMock(tableNameMock, uuidMock, queryOptionsMock);
    }
    catch (err) {
      // test
      expect(err).to.be.a('error');
      expect(err.message).to.be.equal('oh noes!');
      expect(getStub.calledOnce).to.be.true;
    }
  });

  it('should throw a tableName bad argument error', async () => {
    // setup
    const tableNameMock = undefined;
    const uuidMock = '';
    const queryOptionsMock = {};

    // run
    try {
      await getItemDbAdapterMock(tableNameMock, uuidMock, queryOptionsMock);
    }
    catch (err) {
      // test
      expect(err).to.be.a('error');
      expect(err.message).to.be.equal('Bad argument: tableName must be a string');
    }
  });

  it('should throw a uuid bad argument error', async () => {
    // setup
    const tableNameMock = chance.word();
    const uuidMock = undefined;
    const queryOptionsMock = {};

    // run
    try {
      await getItemDbAdapterMock(tableNameMock, uuidMock, queryOptionsMock);
    }
    catch (err) {
      // test
      expect(err).to.be.a('error');
      expect(err.message).to.be.equal('Bad argument: uuid must be a string');
    }
  });

  it('should throw a options bad argument error', async () => {
    // setup
    const tableNameMock = chance.word();
    const uuidMock = '';
    const queryOptionsMock = undefined;

    // run
    try {
      await getItemDbAdapterMock(tableNameMock, uuidMock, queryOptionsMock);
    }
    catch (err) {
      // test
      expect(err).to.be.a('error');
      expect(err.message).to.be.equal('Bad argument: options must be an object');
    }
  });
});
