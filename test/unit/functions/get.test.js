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
const handlerMock = proxyquire('../../../lib/functions/get', stubs);

describe('get', function() {
  it('should get a book', async function() {
    // setup
    const uuidMock = uuidv4();
    const eventMock = {
      pathParameters: {
        bookUuid: uuidMock
      }
    };
    const getBookMock = {
      uuid: uuidMock,
      name: chance.sentence(),
      releaseDate: Date.now(),
      authorName: chance.name()
    };
    const getResultMock = Promise.resolve(Object.assign({}, getBookMock));
    booksStub.getBook = sinon.stub().returns(getResultMock);

    // run
    const response = await handlerMock.get(eventMock);

    // test
    expect(response).to.not.be.empty;
    expect(response.statusCode).to.be.equal(200);
    expect(response.body).to.be.eql(JSON.stringify(getBookMock));
    expect(booksStub.getBook.calledOnce).to.be.true;
  });

  it('should return a 404 error', async function() {
    // setup
    const uuidMock = uuidv4();
    const eventMock = {
      pathParameters: {
        bookUuid: uuidMock
      }
    };
    const getResultMock = Promise.resolve(undefined);
    booksStub.getBook = sinon.stub().returns(getResultMock);

    // run
    const response = await handlerMock.get(eventMock);

    // test
    expect(response).to.not.be.empty;
    expect(response.statusCode).to.be.equal(404);
    expect(response.body).to.be.equal(JSON.stringify({
      status: 404,
      message: 'Not found'
    }));
  });

  it('should return a 500 error', async function() {
    // setup
    const uuidMock = uuidv4();
    const eventMock = {
      pathParameters: {
        bookUuid: uuidMock
      }
    };
    const getResultMock = Promise.reject(new Error('oh noes!'));
    booksStub.getBook = sinon.stub().returns(getResultMock);

    // run
    const response = await handlerMock.get(eventMock);

    // test
    expect(response).to.not.be.empty;
    expect(response.statusCode).to.be.equal(500);
    expect(response.body).to.be.equal(JSON.stringify({
      status: 500,
      message: 'Internal Server Error'
    }));
  });
});
