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
const getAllBooksUtilMock = proxyquire('../../../../lib/utils/books/getAllBooks', stubs);

describe('getAllBooks', () => {
  it('should return a list of book objects', async () => {
    // setup
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
    const scanReturnMock = {
      scanOptions: {},
      scanResult: {
        Items: bookListMock
      }
    };
    dbAdapterStub.getAll = sinon.stub().returns(scanReturnMock);

    // run
    const books = await getAllBooksUtilMock();

    // test
    expect(books).to.be.an('array');
    expect(books.length).to.be.equal(2);
    expect(books).to.be.eql(bookListMock);
    expect(dbAdapterStub.getAll.calledOnce).to.be.true;
  });

  it('should throw an error', async () => {
    // setup
    dbAdapterStub.getAll = sinon.stub().throws(new Error('oh noes!'));

    // run
    try {
      await getAllBooksUtilMock();
    }
    catch (err) {
      // test
      expect(err).to.be.a('error');
      expect(err.message).to.be.equal('oh noes!');
    }
  });
});
