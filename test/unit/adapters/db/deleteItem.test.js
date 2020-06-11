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
const deleteItemDbAdapterMock = proxyquire('../../../../lib/adapters/db/deleteItem', stubs);

describe('deleteItem', () => {
  it('should return a book object', async () => {
    // setup
    const tableNameMock = chance.word();
    const uuidMock = uuidv4();
    const deleteResultMock = {
      uuid: uuidMock,
      name: chance.sentence(),
      releaseDate: Date.now(),
      authorName: chance.name()
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
    const queryOptionsMock = {
      ReturnValue: 'ALL_OLD'
    };

    // run
    const deleteItemResult = await deleteItemDbAdapterMock(tableNameMock, uuidMock, queryOptionsMock);

    // test
    expect(deleteItemResult).to.not.be.empty;
    expect(deleteItemResult.deleteOptions).to.be.an('object');
    expect(deleteItemResult.deleteResult).to.be.an('object');
    expect(deleteItemResult.deleteResult).to.be.eql(deleteResultMock);
    expect(deleteItemResult.deleteOptions.TableName).to.be.equal(tableNameMock);
    expect(deleteItemResult.deleteOptions.Key).to.be.an('object');
    expect(deleteItemResult.deleteOptions.Key.uuid).to.be.equal(uuidMock);
    expect(deleteItemResult.deleteOptions.ReturnValue).to.be.equal('ALL_OLD');
    expect(deleteStub.calledOnce).to.be.true;
    expect(promiseStub.calledOnce).to.be.true;
  });

  it('should throw an error', async () => {
    // setup
    const tableNameMock = chance.word();
    const uuidMock = uuidv4();
    const deleteStub = sinon.stub().returns({
      promise: () => Promise.reject(new Error('oh noes!'))
    });
    awsSdkStub.DynamoDB = {
      DocumentClient: function() {
        return {
          delete: deleteStub
        };
      }
    };
    const queryOptionsMock = {};

    // run
    try {
      await deleteItemDbAdapterMock(tableNameMock, uuidMock, queryOptionsMock);
    }
    catch (err) {
      // test
      expect(err).to.be.a('error');
      expect(err.message).to.be.equal('oh noes!');
      expect(deleteStub.calledOnce).to.be.true;
    }
  });

  it('should throw a tableName bad argument error', async () => {
    // setup
    const tableNameMock = undefined;
    const uuidMock = '';
    const queryOptionsMock = {};

    // run
    try {
      await deleteItemDbAdapterMock(tableNameMock, uuidMock, queryOptionsMock);
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
      await deleteItemDbAdapterMock(tableNameMock, uuidMock, queryOptionsMock);
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
      await deleteItemDbAdapterMock(tableNameMock, uuidMock, queryOptionsMock);
    }
    catch (err) {
      // test
      expect(err).to.be.a('error');
      expect(err.message).to.be.equal('Bad argument: options must be an object');
    }
  });
});
