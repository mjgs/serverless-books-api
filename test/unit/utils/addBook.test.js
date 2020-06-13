/* eslint-env mocha */
/* eslint-disable no-unused-expressions */
'use strict';

const expect = require('chai').expect;
const proxyquire = require('proxyquire').noCallThru();
const sinon = require('sinon');
const chance = new (require('chance'))();
const { v4: uuidv4 } = require('uuid');

const dbAdapterStub = {};
const stubs = {
  '../adapters/db': dbAdapterStub
};
const addBookUtilMock = proxyquire('../../../lib/utils/addBook', stubs);

describe('addBook', () => {
  it('should return a book object', async () => {
    // setup
    const uuidMock = uuidv4();
    const paramsMock = {
      name: chance.sentence(),
      releaseDate: Date.now(),
      authorName: chance.name()
    };
    const putItemResultMock = {
      putOptions: {
        TableName: '',
        Item: Object.assign(paramsMock, { uuid: uuidMock })
      },
      putResult: {}
    };
    dbAdapterStub.create = sinon.stub().returns(putItemResultMock);

    // run
    const book = await addBookUtilMock(paramsMock);

    // test
    expect(book).to.not.be.empty;
    expect(book.uuid).to.be.equal(uuidMock);
    expect(book.name).to.be.equal(paramsMock.name);
    expect(book.releaseDate).to.be.equal(paramsMock.releaseDate);
    expect(book.authorName).to.be.equal(paramsMock.authorName);
    expect(dbAdapterStub.create.calledOnce).to.be.true;
  });

  it('should throw an error', async () => {
    // setup
    const paramsMock = {
      name: chance.sentence(),
      releaseDate: Date.now(),
      authorName: chance.name()
    };
    dbAdapterStub.create = sinon.stub().throws(new Error('oh noes!'));

    // run
    try {
      await addBookUtilMock(paramsMock);
    }
    catch (err) {
      // test
      expect(err).to.be.a('error');
      expect(err.message).to.be.equal('oh noes!');
    }
  });

  it('should throw a params bad argument error', async () => {
    // setup
    const paramsMock = undefined;

    // run
    try {
      await addBookUtilMock(paramsMock);
    }
    catch (err) {
      // test
      expect(err).to.be.a('error');
      expect(err.message).to.be.equal('Bad argument: params must be an object');
    }
  });
});
