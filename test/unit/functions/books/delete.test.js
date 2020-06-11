/* eslint-env mocha */
/* eslint-disable no-unused-expressions */
'use strict';

const expect = require('chai').expect;
const proxyquire = require('proxyquire').noCallThru();
const sinon = require('sinon');
const { v4: uuidv4 } = require('uuid');

const booksStub = {};
const stubs = {
  '../../utils/books': booksStub
};
const handlerMock = proxyquire('../../../../lib/functions/books/delete', stubs);

describe('delete', () => {
  it('should return a response', async () => {
    // setup
    const mockBookUuid = uuidv4();
    const eventMock = {
      body: '',
      pathParameters: {
        bookUuid: mockBookUuid
      }
    };
    booksStub.deleteBook = sinon.stub().returns({});

    // run
    const response = await handlerMock.delete(eventMock);

    // test
    expect(response).to.not.be.empty;
    expect(response.statusCode).to.be.equal(200);
    expect(response.body).to.be.a('string');
    expect(booksStub.deleteBook.calledOnce).to.be.true;
  });

  it('should throw an error', async () => {
    // setup
    const mockBookUuid = uuidv4();
    const eventMock = {
      body: '',
      pathParameters: {
        bookUuid: mockBookUuid
      }
    };
    booksStub.deleteBook = sinon.stub().throws(new Error('oh noes!'));

    // run
    const response = await handlerMock.delete(eventMock);

    // test
    expect(response).to.not.be.empty;
    expect(response.statusCode).to.be.equal(500);
    expect(JSON.parse(response.body).message).to.be.equal('oh noes!');
  });
});