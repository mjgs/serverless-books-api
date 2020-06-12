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
  '../../adapters/db': dbAdapterStub
};
const getBookUtilMock = proxyquire('../../../../lib/utils/books/getBook', stubs);

describe('getBook', () => {
  it('should return a book object', async () => {
    // setup
    const uuidMock = uuidv4();
    const getItemMock = {
      uuid: uuidMock,
      name: chance.sentence(),
      releaseDate: Date.now(),
      authorName: chance.name()
    };
    const getReturnMock = {
      getOptions: {},
      getResult: {
        Item: getItemMock
      }
    };
    dbAdapterStub.getItem = sinon.stub().returns(getReturnMock);

    // run
    const book = await getBookUtilMock(uuidMock);

    // test
    expect(book).to.be.a('object');
    expect(book.uuid).to.be.equal(uuidMock);
    expect(book.name).to.be.equal(getItemMock.name);
    expect(book.releaseDate).to.be.equal(getItemMock.releaseDate);
    expect(book.authorName).to.be.equal(getItemMock.authorName);
    expect(dbAdapterStub.getItem.calledOnce).to.be.true;
  });

  it('should throw a 404 error', async () => {
    // setup
    const uuidMock = uuidv4();
    const getReturnMock = {
      getOptions: {},
      getResult: {
        Item: {}
      }
    };
    dbAdapterStub.getItem = sinon.stub().returns(getReturnMock);

    // run
    try {
      await getBookUtilMock(uuidMock);
    }
    catch (err) {
      // test
      expect(err).to.be.a('error');
      expect(err.message).to.be.equal('Not found');
      expect(err.status).to.be.equal(404);
    }
  });

  it('should throw an error', async () => {
    // setup
    const uuidMock = uuidv4();
    dbAdapterStub.getItem = sinon.stub().throws(new Error('oh noes!'));

    // run
    try {
      await getBookUtilMock(uuidMock);
    }
    catch (err) {
      // test
      expect(err).to.be.a('error');
      expect(err.message).to.be.equal('oh noes!');
    }
  });

  it('should throw a uuid bad argument error', async () => {
    // setup
    const uuidMock = undefined;

    // run
    try {
      await getBookUtilMock(uuidMock);
    }
    catch (err) {
      // test
      expect(err).to.be.a('error');
      expect(err.message).to.be.equal('Bad argument: uuid must be a string');
    }
  });
});
