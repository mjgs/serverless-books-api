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

describe('get', () => {
  it('should get a book', async () => {
    // setup
    const uuidMock = uuidv4();
    const nameMock = chance.sentence();
    const releaseDateMock = Date.now();
    const authorNameMock = chance.name();
    const eventMock = {
      pathParameters: {
        bookUuid: uuidMock
      }
    };
    const getBookReturn = {
      uuid: uuidMock,
      name: nameMock,
      releaseDate: releaseDateMock,
      authorName: authorNameMock
    };
    booksStub.getBook = sinon.stub().returns(getBookReturn);

    // run
    const response = await handlerMock.get(eventMock);

    // test
    expect(response).to.not.be.empty;
    expect(response.statusCode).to.be.equal(200);
    expect(response.body).to.be.eql(JSON.stringify(getBookReturn));
    expect(booksStub.getBook.calledOnce).to.be.true;
  });

  it('should return a 404 error', async () => {
    // setup
    const uuidMock = uuidv4();
    const eventMock = {
      pathParameters: {
        bookUuid: uuidMock
      }
    };
    const getBookReturn = undefined;
    booksStub.getBook = sinon.stub().returns(getBookReturn);

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

  it('should return a 500 error', async () => {
    // setup
    const uuidMock = uuidv4();
    const eventMock = {
      pathParameters: {
        bookUuid: uuidMock
      }
    };
    booksStub.getBook = sinon.stub().returns(Promise.reject(new Error('oh noes!')));

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
