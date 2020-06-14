/* eslint-env mocha */
/* eslint-disable no-unused-expressions */
'use strict';

const expect = require('chai').expect;
const proxyquire = require('proxyquire').noCallThru();
const sinon = require('sinon');
const chance = new (require('chance'))();
const { v4: uuidv4 } = require('uuid');

const booksUtilStub = {};
const stubs = {
  '../utils': booksUtilStub
};
const handlerMock = proxyquire('../../../lib/functions/add', stubs);

describe('add', () => {
  it('should create a book', async () => {
    // setup
    const eventMock = {
      body: JSON.stringify({
        name: chance.sentence(),
        releaseDate: Date.now(),
        authorName: chance.name()
      })
    };
    const uuidMock = uuidv4();
    const bookRecordMock = Object.assign(JSON.parse(eventMock.body), { uuid: uuidMock });
    booksUtilStub.addBook = sinon.stub().returns(bookRecordMock);

    // run
    const response = await handlerMock.add(eventMock);

    // test
    expect(response).to.not.be.empty;
    expect(response.statusCode).to.be.equal(201);
    expect(response.body).to.be.equal(JSON.stringify(bookRecordMock));
    expect(booksUtilStub.addBook.calledOnce).to.be.true;
  });

  it('should return a 500 error', async () => {
    // setup
    const eventMock = {
      body: JSON.stringify({})
    };
    booksUtilStub.addBook = sinon.stub().returns(Promise.reject(new Error('oh noes!')));

    // run
    const response = await handlerMock.add(eventMock);

    // test
    expect(response).to.not.be.empty;
    expect(response.statusCode).to.be.equal(500);
    expect(response.body).to.be.equal(JSON.stringify({
      status: 500,
      message: 'Internal Server Error'
    }));
  });
});
