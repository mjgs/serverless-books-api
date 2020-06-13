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
  it('should return a response', async () => {
    // setup
    const nameMock = chance.sentence();
    const releaseDateMock = Date.now();
    const authorNameMock = chance.name();
    const eventMock = {
      body: JSON.stringify({
        name: nameMock,
        releaseDate: releaseDateMock,
        authorName: authorNameMock
      })
    };
    const uuidMock = uuidv4();
    const bookRecordMock = {
      uuid: uuidMock,
      name: nameMock,
      releaseDate: releaseDateMock,
      authorName: authorNameMock
    };
    booksUtilStub.addBook = sinon.stub().returns(bookRecordMock);

    // run
    const response = await handlerMock.add(eventMock);

    // test
    expect(response).to.not.be.empty;
    expect(response.statusCode).to.be.equal(201);
    expect(response.body).to.be.equal(JSON.stringify(bookRecordMock));
    expect(booksUtilStub.addBook.calledOnce).to.be.true;
  });

  it('should throw an error', async () => {
    // setup
    const eventMock = {
      body: JSON.stringify({})
    };
    booksUtilStub.addBook = sinon.stub().throws(new Error('oh noes!'));

    // run
    const response = await handlerMock.add(eventMock);

    // test
    expect(response).to.not.be.empty;
    expect(response.statusCode).to.be.equal(500);
    expect(JSON.parse(response.body).message).to.be.equal('oh noes!');
  });
});
