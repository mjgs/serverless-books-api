/* eslint-env mocha */
/* eslint-disable no-unused-expressions */
'use strict';

const expect = require('chai').expect;
const proxyquire = require('proxyquire').noCallThru();
const sinon = require('sinon');
const chance = new (require('chance'))();

const awsSdkStub = {};
const stubs = {
  'aws-sdk': awsSdkStub
};
const dbMock = proxyquire('../../../lib/adapters/db', stubs);

describe('db', () => {
  describe('add', () => {
    it('should return a book object', async () => {
      // setup
      const paramsMock = {
        name: chance.sentence(),
        releaseDate: Date.now(),
        authorName: chance.name()
      };
      const promiseStub = sinon.stub().returns({});
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

      // run
      const book = await dbMock.addBook(paramsMock);

      // test
      expect(book).to.not.be.empty;
      expect(book.uuid).to.be.a('string');
      expect(book.name).to.be.equal(paramsMock.name);
      expect(book.releaseDate).to.be.equal(paramsMock.releaseDate);
      expect(book.authorName).to.be.equal(paramsMock.authorName);
      expect(putStub.calledOnce).to.be.true;
      expect(promiseStub.calledOnce).to.be.true;
    });

    it('should throw an error', async () => {
      // setup
      const paramsMock = {
        name: chance.sentence(),
        releaseDate: Date.now(),
        authorName: chance.name()
      };
      const putStub = sinon.stub().throws(new Error('oh noes!'));
      awsSdkStub.DynamoDB = {
        DocumentClient: function() {
          return {
            put: putStub
          };
        }
      };

      // run
      try {
        await dbMock.addBook(paramsMock);
      }
      catch (err) {
        // test
        expect(err).to.be.a('error');
        expect(err.message).to.be.equal('oh noes!');
        expect(putStub.calledOnce).to.be.true;
      }
    });
  });
});
