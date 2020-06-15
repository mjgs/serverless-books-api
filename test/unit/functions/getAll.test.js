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
  it('should get all books', async () => {
    // setup
    const eventMock = {};
    const getAllBooksMock = [
      {
        uuid: uuidv4(),
        name: chance.sentence(),
        releaseDate: Date.now(),
        authorName: chance.name()
      },
      {
        uuid: uuidv4(),
        name: chance.sentence(),
        releaseDate: Date.now(),
        authorName: chance.name()
      }
    ];
    const getAllResult = Promise.resolve(getAllBooksMock);
    booksStub.getAllBooks = sinon.stub().returns(getAllResult);

    // run
    const response = await handlerMock.getAll(eventMock);

    // test
    expect(response).to.not.be.empty;
    expect(response.statusCode).to.be.equal(200);
    expect(response.body).to.be.eql(JSON.stringify(getAllBooksMock));
    expect(booksStub.getAllBooks.calledOnce).to.be.true;
  });

  it('should return a 500 error', async () => {
    // setup
    const eventMock = {};
    const getAllResult = Promise.reject(new Error('oh noes!'));
    booksStub.getAllBooks = sinon.stub().returns(getAllResult);

    // run
    const response = await handlerMock.getAll(eventMock);
    
    // test
    expect(response).to.not.be.empty;
    expect(response.statusCode).to.be.equal(500);
    expect(response.body).to.be.equal(JSON.stringify({
      status: 500,
      message: 'Internal Server Error'
    }));
  });
});
