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
const handlerMock = proxyquire('../../../lib/functions/delete', stubs);

describe('delete', () => {
  it('should delete a book', async () => {
    // setup
    const uuidMock = uuidv4();
    const eventMock = {
      pathParameters: {
        bookUuid: uuidMock
      }
    };
    const deleteBookReturn = {
      uuid: uuidv4(),
      name: chance.sentence(),
      releaseDate: Date.now(),
      authorName: chance.name()
    };
    booksStub.deleteBook = sinon.stub().returns(deleteBookReturn);

    // run
    const response = await handlerMock.delete(eventMock);

    // test
    expect(response).to.not.be.empty;
    expect(response.statusCode).to.be.equal(200);
    expect(response.body).to.be.eql(JSON.stringify(deleteBookReturn));
    expect(booksStub.deleteBook.calledOnce).to.be.true;
  });

  it('should return a 404 error', async () => {
    // setup
    const uuidMock = uuidv4();
    const eventMock = {
      pathParameters: {
        bookUuid: uuidMock
      }
    };
    const deleteBookReturn = undefined;
    booksStub.deleteBook = sinon.stub().returns(deleteBookReturn);

    // run
    const response = await handlerMock.delete(eventMock);

    // test
    expect(response).to.not.be.empty;
    expect(response.statusCode).to.be.equal(404);
    expect(response.body).to.be.eql(JSON.stringify({
      status: 404,
      message: 'Not found'
    }));
    expect(booksStub.deleteBook.calledOnce).to.be.true;
  });

  it('should throw a 500 error', async () => {
    // setup
    const uuidMock = uuidv4();
    const eventMock = {
      pathParameters: {
        bookUuid: uuidMock
      }
    };
    booksStub.deleteBook = sinon.stub().throws(new Error('oh noes!'));

    // run
    const response = await handlerMock.delete(eventMock);

    // test
    expect(response).to.not.be.empty;
    expect(response.statusCode).to.be.equal(500);
    expect(response.body).to.be.equal(JSON.stringify({
      status: 500,
      message: 'Internal Server Error'
    }));
  });
});
