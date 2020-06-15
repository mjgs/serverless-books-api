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

describe('deleteBook', () => {
  it('should delete a book', async () => {
    // setup
    const uuidMock = uuidv4();
    const deletedResultMock = {
      uuid: uuidMock,
      name: chance.sentence(),
      releaseDate: Date.now(),
      authorName: chance.name()
    };
    dbAdapterStub.delete = sinon.stub().returns(Promise.resolve(deletedResultMock));

    // run
    const promise = deleteBookUtilMock(uuidMock);

    // test
    return expect(promise).to.eventually.be.fulfilled
      .then((value) => {
        expect(value).to.be.eql(deletedResultMock);
        expect(dbAdapterStub.delete.calledOnce).to.be.true;
      });
  });

  it('should return an error', async () => {
    // setup
    const uuidMock = uuidv4();
    dbAdapterStub.delete = sinon.stub().returns(Promise.reject(new Error('oh noes!')));
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

  it('should return a uuid bad argument error', async () => {
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
