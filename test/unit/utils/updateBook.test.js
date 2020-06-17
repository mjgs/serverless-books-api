/* eslint-env mocha */
/* eslint-disable no-unused-expressions */
'use strict';

const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
const expect = require('chai').expect;
const proxyquire = require('proxyquire').noCallThru();
const sinon = require('sinon');
const chance = new (require('chance'))();
const { v4: uuidv4 } = require('uuid');

chai.use(chaiAsPromised);

const dbAdapterStub = {};
const stubs = {
  '../adapters/db': dbAdapterStub
};
const updateBookUtilMock = proxyquire('../../../lib/utils/updateBook', stubs);

describe('updateBook', () => {
  it('should return a book object', async function() {
    // setup
    const uuidMock = uuidv4();
    const paramsMock = {
      uuid: uuidMock,
      name: chance.sentence(),
      releaseDate: Date.now(),
      authorName: chance.name()
    };
    const updatedBookMock = Object.assign({}, paramsMock);
    const updateResultMock = Promise.resolve(updatedBookMock);
    dbAdapterStub.update = sinon.stub().returns(updateResultMock);

    // run
    const promise = updateBookUtilMock(uuidMock, paramsMock);

    // test
    return expect(promise).to.be.eventually.fulfilled
      .then((value) => {
        expect(value).to.be.eql(updatedBookMock);
        expect(dbAdapterStub.update.calledOnce).to.be.true;
      });
  });

  it('should throw an error', async () => {
    // setup
    const uuidMock = uuidv4();
    const paramsMock = {
      uuid: uuidMock,
      name: chance.sentence(),
      releaseDate: Date.now(),
      authorName: chance.name()
    };
    const updateResultMock = Promise.reject(new Error('oh noes!'));
    dbAdapterStub.update = sinon.stub().returns(updateResultMock);
    const consoleErrorStub = sinon.stub(console, 'error');

    // run
    const promise = updateBookUtilMock(uuidMock, paramsMock);

    // test
    return expect(promise).to.be.eventually.rejected
      .then((err) => {
        expect(err).to.be.a('error');
        expect(err.message).to.be.equal(`Error running utils.updateBook with uuid: ${uuidMock} and params: ${JSON.stringify(paramsMock)}`);
        expect(dbAdapterStub.update.calledOnce).to.be.true;
        expect(consoleErrorStub.calledOnce).to.be.true;
        consoleErrorStub.restore();
      });
  });

  it('should throw a uuid bad argument error', async () => {
    // setup
    const uuidMock = undefined;
    const paramsMock = {};

    // run
    const promise = updateBookUtilMock(uuidMock, paramsMock);

    // test
    return expect(promise).to.be.eventually.rejected
      .then((err) => {
        expect(err).to.be.a('error');
        expect(err.message).to.be.equal('Bad argument: uuid must be a string');
      });
  });

  it('should throw a params bad argument error', async () => {
    // setup
    const uuidMock = uuidv4();
    const paramsMock = undefined;

    // run
    const promise = updateBookUtilMock(uuidMock, paramsMock);

    // test
    return expect(promise).to.be.eventually.rejected
      .then((err) => {
        expect(err).to.be.a('error');
        expect(err.message).to.be.equal('Bad argument: params must be an object');
      });
  });
});
