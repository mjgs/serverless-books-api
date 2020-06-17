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
const getBookUtilMock = proxyquire('../../../lib/utils/getBook', stubs);

describe('getBook', function() {
  it('should get a book', async function() {
    // setup
    const getBookMock = {
      uuid: uuidv4(),
      name: chance.sentence(),
      releaseDate: Date.now(),
      authorName: chance.name()
    };
    const getResultMock = Promise.resolve(getBookMock);
    dbAdapterStub.get = sinon.stub().returns(getResultMock);

    // run
    const promise = getBookUtilMock(getBookMock.uuid);

    // test
    return expect(promise).to.eventually.be.fulfilled
      .then((value) => {
        expect(value).to.be.eql(getBookMock);
        expect(dbAdapterStub.get.calledOnce).to.be.true;
      });
  });

  it('should return a 500 error', async function() {
    // setup
    const uuidMock = uuidv4();
    const getResultMock = Promise.reject(new Error('oh noes!'));
    dbAdapterStub.get = sinon.stub().returns(getResultMock);
    const consoleErrorStub = sinon.stub(console, 'error');

    // run
    const promise = getBookUtilMock(uuidMock);

    // test
    return expect(promise).to.eventually.be.rejected
      .then((err) => {
        expect(err).to.be.a('error');
        expect(err.message).to.be.equal(`Error running utils.getBook with uuid: ${uuidMock}`);
        expect(dbAdapterStub.get.calledOnce).to.be.true;
        expect(consoleErrorStub.calledOnce).to.be.true;
        consoleErrorStub.restore();
      });
  });

  it('should return a uuid bad argument error', async function() {
    // setup
    const uuidMock = undefined;

    // run
    const promise = getBookUtilMock(uuidMock);

    // test
    return expect(promise).to.eventually.be.rejected
      .then((err) => {
        expect(err).to.be.a('error');
        expect(err.message).to.be.equal('Bad argument: uuid must be a string');
      });
  });
});
