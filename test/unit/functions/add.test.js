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
  it('should create a book', async function() {
    // setup
    const paramsMock = {
      name: chance.sentence(),
      releaseDate: Date.now(),
      authorName: chance.name()
    };
    const eventMock = {
      body: JSON.stringify(paramsMock)
    };
    const uuidMock = uuidv4();
    const addedBookMock = Object.assign(paramsMock, { uuid: uuidMock });
    const addResultMock = Promise.resolve(addedBookMock);
    booksUtilStub.addBook = sinon.stub().returns(addResultMock);

    // run
    const response = await handlerMock.add(eventMock);

    // test
    expect(response).to.not.be.empty;
    expect(response.statusCode).to.be.equal(201);
    expect(response.body).to.be.equal(JSON.stringify(addedBookMock));
    expect(booksUtilStub.addBook.calledOnce).to.be.true;
  });

  it('should return a 500 error', async function() {
    // setup
    const eventMock = {
      body: JSON.stringify({})
    };
    const addResultMock = Promise.reject(new Error('oh noes!'));
    booksUtilStub.addBook = sinon.stub().returns(addResultMock);

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
