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
const handlerMock = proxyquire('../../../lib/functions/update', stubs);

describe('update', function() {
  it('should update a book', async function() {
    // setup
    const uuidMock = uuidv4();
    const eventMock = {
      body: JSON.stringify({}),
      pathParameters: {
        bookUuid: uuidMock
      }
    };
    const updatedBookMock = {
      uuid: uuidMock,
      name: chance.sentence(),
      releaseDate: Date.now(),
      authorName: chance.name()
    };
    const updateResultMock = Promise.resolve(updatedBookMock);
    booksStub.updateBook = sinon.stub().returns(updateResultMock);

    // run
    const response = await handlerMock.update(eventMock);

    // test
    expect(response).to.not.be.empty;
    expect(response.statusCode).to.be.equal(200);
    expect(response.body).to.be.eql(JSON.stringify(updatedBookMock));
    expect(booksStub.updateBook.calledOnce).to.be.true;
  });

  it('should return a 404 error', async function() {
    // setup
    const uuidMock = uuidv4();
    const eventMock = {
      body: JSON.stringify({}),
      pathParameters: {
        bookUuid: uuidMock
      }
    };
    const updateResultMock = Promise.resolve(undefined);
    booksStub.updateBook = sinon.stub().returns(updateResultMock);

    // run
    const response = await handlerMock.update(eventMock);

    // test
    expect(response).to.not.be.empty;
    expect(response.statusCode).to.be.equal(404);
    expect(response.body).to.be.eql(JSON.stringify({
      status: 404,
      message: 'Not found'
    }));
    expect(booksStub.updateBook.calledOnce).to.be.true;
  });

  it('should throw a 500 error', async function() {
    // setup
    const uuidMock = uuidv4();
    const eventMock = {
      body: JSON.stringify({}),
      pathParameters: {
        bookUuid: uuidMock
      }
    };
    const updateResultMock = Promise.reject(new Error('oh noes!'));
    booksStub.updateBook = sinon.stub().returns(updateResultMock);

    // run
    const response = await handlerMock.update(eventMock);

    // test
    expect(response).to.not.be.empty;
    expect(response.statusCode).to.be.equal(500);
    expect(response.body).to.be.eql(JSON.stringify({
      status: 500,
      message: 'Internal Server Error'
    }));
    expect(booksStub.updateBook.calledOnce).to.be.true;
  });
});
