/* eslint-env mocha */
/* eslint-disable no-unused-expressions */
'use strict';

const expect = require('chai').expect;
const proxyquire = require('proxyquire').noCallThru();
const sinon = require('sinon');
const chance = new (require('chance'))();
const { v4: uuidv4 } = require('uuid');

const booksStub = {};
const stubs = {
  '../utils': booksStub
};
const handlerMock = proxyquire('../../../lib/functions/getAll', stubs);

describe('getAll', () => {
  it('should return a response', async () => {
    // setup
    const eventMock = {};
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
    const getAllBooksReturn = [ bookMock1, bookMock2 ];
    booksStub.getAllBooks = sinon.stub().returns(getAllBooksReturn);

    // run
    const response = await handlerMock.getAll(eventMock);

    // test
    expect(response).to.not.be.empty;
    expect(response.statusCode).to.be.equal(200);
    expect(response.body).to.be.eql(JSON.stringify(getAllBooksReturn));
    expect(booksStub.getAllBooks.calledOnce).to.be.true;
  });

  it('should throw an error', async () => {
    // setup
    const uuidMock = uuidv4();
    const eventMock = {
      body: '',
      pathParameters: {
        bookUuid: uuidMock
      }
    };
    booksStub.getBook = sinon.stub().throws(new Error('oh noes!'));

    // run
    try {
      await handlerMock.getAll(eventMock);
    }
    catch (err) {
      // test
      expect(err).to.not.be.empty;
      expect(err.message).to.be.equal('oh noes!');
    }
  });
});
