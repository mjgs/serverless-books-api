/* eslint-env mocha */
/* eslint-disable no-unused-expressions */
'use strict';

const expect = require('chai').expect;
const proxyquire = require('proxyquire').noCallThru();
const sinon = require('sinon');
const chance = new (require('chance'))();
const uuid = require('uuid');

const dbStub = sinon.stub();
const stubs = {
  '../../adapters/db': dbStub
};
const handlerMock = proxyquire('../../../lib/functions/books/add', stubs);

describe('books', () => {
  describe('add', () => {
    it('should return a response', async () => {
      // setup
      const eventMock = {
        body: JSON.stringify({})
      };
      const uuidMock = uuid.v4();
      const nameMock = chance.sentence();
      const releaseDateMock = Date.now();
      const authorNameMock = chance.name();
      dbStub.addBook = sinon.stub().returns({
        uuid: uuidMock,
        name: nameMock,
        releaseDate: releaseDateMock,
        authorName: authorNameMock
      });

      // run
      const response = await handlerMock.add(eventMock);

      // test
      expect(response).to.not.be.empty;
      expect(response.statusCode).to.be.equal(201);
      expect(response.body).to.be.a('string');
      expect(dbStub.addBook.calledOnce).to.be.true;
    });

    it('should throw an error', async () => {
      // setup
      const eventMock = {
        body: JSON.stringify({})
      };
      dbStub.addBook = sinon.stub().throws(new Error('oh noes!'));

      // run
      const response = await handlerMock.add(eventMock);
      
      // test
      expect(response).to.not.be.empty;
      expect(response.statusCode).to.be.equal(500);
      expect(JSON.parse(response.body).message).to.be.equal('oh noes!');
    });
  });
});
