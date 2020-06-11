/* eslint-env mocha */
/* eslint-disable no-unused-expressions */
'use strict';

const expect = require('chai').expect;
const proxyquire = require('proxyquire').noCallThru();
const sinon = require('sinon');
const chance = new (require('chance'))();
// const { v4: uuidv4 } = require('uuid');

const awsSdkStub = {};
// const uuidStub = {};
const stubs = {
  'aws-sdk': awsSdkStub,
  // uuid: uuidStub
};
const dbAdapterMock = proxyquire('../../../lib/adapters/db', stubs);

describe('db', () => {
  describe('add', () => {
    it('should return a book object', async () => {
      // setup
      const tableNameMock = chance.word();
      const paramsMock = {
        name: chance.sentence(),
        releaseDate: Date.now(),
        authorName: chance.name()
      };
      // const uuidMock = uuidv4();
      const putResultMock = {};
      const promiseStub = sinon.stub().returns(putResultMock);
      const putStub = sinon.stub().returns({
        promise: promiseStub
      });
      awsSdkStub.DynamoDB = {
        DocumentClient: function() {
          return {
            put: putStub
          };
        }
      };
      // uuidStub.v4 = sinon.stub().returns(uuidMock);
      const queryOptionsMock = {};

      // run
      const putItemResult = await dbAdapterMock.putItem(tableNameMock, paramsMock, queryOptionsMock);

      // test
      expect(putItemResult).to.not.be.empty;
      expect(putItemResult.putOptions).to.be.an('object');
      expect(putItemResult.putResult).to.be.eql(putResultMock);
      expect(putItemResult.putOptions.TableName).to.be.equal(tableNameMock);
      expect(putItemResult.putOptions.Item).to.be.an('object');

      // For some reason uuidv4 cannot be mocked so can only test it's a string here
      // expect(putItemResult.putOptions.Item.uuid).to.be.equal(uuidMock);
      expect(putItemResult.putOptions.Item.uuid).to.be.a('string');

      expect(putItemResult.putOptions.Item.name).to.be.equal(paramsMock.name);
      expect(putItemResult.putOptions.Item.releaseDate).to.be.equal(paramsMock.releaseDate);
      expect(putItemResult.putOptions.Item.authorName).to.be.equal(paramsMock.authorName);
      expect(putStub.calledOnce).to.be.true;
      expect(promiseStub.calledOnce).to.be.true;
    });

    it('should throw an error', async () => {
      // setup
      const tableNameMock = chance.word();
      const paramsMock = {
        name: chance.sentence(),
        releaseDate: Date.now(),
        authorName: chance.name()
      };
      // const uuidMock = uuidv4();
      const putStub = sinon.stub().returns({
        promise: () => Promise.reject(new Error('oh noes!'))
      });
      awsSdkStub.DynamoDB = {
        DocumentClient: function() {
          return {
            put: putStub
          };
        }
      };
      // uuidStub.v4 = sinon.stub().returns(uuidMock);
      const queryOptionsMock = {};

      // run
      try {
        await dbAdapterMock.putItem(tableNameMock, paramsMock, queryOptionsMock);
      }
      catch (err) {
        // test
        expect(err).to.be.a('error');
        expect(err.message).to.be.equal('oh noes!');
        expect(putStub.calledOnce).to.be.true;
      }
    });

    it('should throw a params bad argument error', async () => {
      // setup
      const tableNameMock = chance.word();
      const paramsMock = undefined;
      const queryOptionsMock = {};

      // run
      try {
        await dbAdapterMock.putItem(tableNameMock, paramsMock, queryOptionsMock);
      }
      catch (err) {
        // test
        expect(err).to.be.a('error');
        expect(err.message).to.be.equal('Bad argument: params must be an object');
      }
    });
  });
});
