/* eslint-env mocha */
/* eslint-disable no-unused-expressions */
'use strict';

const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
const expect = chai.expect;
const proxyquire = require('proxyquire').noCallThru();
const sinon = require('sinon');
const chance = new (require('chance'))();
const { v4: uuidv4 } = require('uuid');

chai.use(chaiAsPromised);

const dbAdapterStub = {};
const stubs = {
  '../adapters/db': dbAdapterStub
};
const getAllBooksUtilMock = proxyquire('../../../lib/utils/getAllBooks', stubs);

describe('getAllBooks', () => {
  it('should get all books', async () => {
    // setup
    const bookListMock = [
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
    const getAllResultMock = Promise.resolve(bookListMock);
    dbAdapterStub.getAll = sinon.stub().returns(getAllResultMock);

    // run
    const promise = getAllBooksUtilMock();

    // test
    return expect(promise).to.eventually.be.fulfilled
      .then((value) => {
        expect(value).to.be.eql(bookListMock);
        expect(dbAdapterStub.getAll.calledOnce).to.be.true;
      });
  });

  it('should return an error', async () => {
    // setup
    const getAllResultMock = Promise.reject(new Error('oh noes!'));
    dbAdapterStub.getAll = sinon.stub().returns(getAllResultMock);
    const consoleErrorStub = sinon.stub(console, 'error');

    // run
    const promise = getAllBooksUtilMock();

    // test
    return expect(promise).to.eventually.be.rejected
      .then((err) => {
        expect(err).to.be.a('error');
        expect(err.message).to.be.equal('Error running utils.getAllBooks');
        expect(dbAdapterStub.getAll.calledOnce).to.be.true;
        expect(consoleErrorStub.calledOnce).to.be.true;
        consoleErrorStub.restore();
      });
  });
});
