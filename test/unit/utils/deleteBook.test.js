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
const deleteBookUtilMock = proxyquire('../../../lib/utils/deleteBook', stubs);

describe('deleteBook', function() {
  it('should delete a book', async function() {
    // setup
    const uuidMock = uuidv4();
    const deletedBookMock = {
      uuid: uuidMock,
      name: chance.sentence(),
      releaseDate: Date.now(),
      authorName: chance.name()
    };
    const deleteResultMock = Promise.resolve(deletedBookMock);
    dbAdapterStub.delete = sinon.stub().returns(deleteResultMock);

    // run
    const promise = deleteBookUtilMock(uuidMock);

    // test
    return expect(promise).to.eventually.be.fulfilled
      .then((value) => {
        expect(value).to.be.eql(deletedBookMock);
        expect(dbAdapterStub.delete.calledOnce).to.be.true;
      });
  });

  it('should return an error', async function() {
    // setup
    const uuidMock = uuidv4();
    const deleteResultMock = Promise.reject(new Error('oh noes!'));
    dbAdapterStub.delete = sinon.stub().returns(deleteResultMock);
    const consoleErrorStub = sinon.stub(console, 'error');

    // run
    const promise = deleteBookUtilMock(uuidMock);

    // test
    return expect(promise).to.eventually.be.rejected
      .then((err) => {
        expect(err).to.be.a('error');
        expect(err.message).to.be.equal(`Error running utils.deleteBook with uuid: ${uuidMock}`);
        expect(dbAdapterStub.delete.calledOnce).to.be.true;
        expect(consoleErrorStub.calledOnce).to.be.true;
        consoleErrorStub.restore();
      });
  });

  it('should return a uuid bad argument error', async function() {
    // setup
    const uuidMock = undefined;

    // run
    const promise = deleteBookUtilMock(uuidMock);

    // test
    return expect(promise).to.eventually.be.rejected
      .then((err) => {
        expect(err).to.be.a('error');
        expect(err.message).to.be.equal('Bad argument: uuid must be a string');
      });
  });
});
