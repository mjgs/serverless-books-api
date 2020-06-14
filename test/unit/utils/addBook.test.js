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
const uuidStub = {};
const stubs = {
  '../adapters/db': dbAdapterStub,
  uuid: uuidStub
};
const addBookUtilMock = proxyquire('../../../lib/utils/addBook', stubs);

describe('addBook', () => {
  it('should add a book', async () => {
    // setup
    const uuidMock = uuidv4();
    const paramsMock = {
      name: chance.sentence(),
      releaseDate: Date.now(),
      authorName: chance.name()
    };
    const createResultMock = Object.assign(paramsMock, { uuid: uuidMock });
    dbAdapterStub.create = sinon.stub().returns(createResultMock);

    // run
    const result = addBookUtilMock(paramsMock);

    // test
    return expect(result).to.eventually.be.fulfilled
      .then((value) => {
        expect(value).to.be.eql(createResultMock);
        expect(dbAdapterStub.create.calledOnce).to.be.true;
      });
  });

  it('should return an error', async () => {
    // setup
    const uuidMock = uuidv4();
    const paramsMock = {
      name: chance.sentence(),
      releaseDate: Date.now(),
      authorName: chance.name()
    };
    dbAdapterStub.create = sinon.stub().throws(new Error('oh noes!'));
    uuidStub.v4 = sinon.stub().returns(uuidMock);
    const consoleErrorStub = sinon.stub(console, 'error');

    // run
    const result = addBookUtilMock(paramsMock);

    // test
    return expect(result).to.eventually.be.rejected
      .then((err) => {
        expect(err).to.be.a('error');
        expect(err.message).to.be.equal(`Error running utils.addBook with params: ${JSON.stringify(paramsMock)}`);
        expect(consoleErrorStub.calledOnce).to.be.true;
        consoleErrorStub.restore();
      });
  });

  it('should return a params bad argument error', async () => {
    // setup
    const paramsMock = undefined;

    // run
    const result = addBookUtilMock(paramsMock);

    // test
    return expect(result).to.eventually.be.rejected
      .then((err) => {
        expect(err).to.be.a('error');
        expect(err.message).to.be.equal('Bad argument: params must be an object');
      });
  });
});
