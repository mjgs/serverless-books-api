/* eslint-env mocha */
/* eslint-disable no-unused-expressions */
'use strict';

const expect = require('chai').expect;
const proxyquire = require('proxyquire').noCallThru();
const sinon = require('sinon');
const chance = new (require('chance'))();
const { v4: uuidv4 } = require('uuid');

const dbAdapterStub = {};
const stubs = {
  '../adapters/db': dbAdapterStub
};
const deleteBookUtilMock = proxyquire('../../../lib/utils/deleteBook', stubs);

describe('deleteBook', () => {
  it('should return a book object', async () => {
    // setup
    const uuidMock = uuidv4();
    const deletedItemMock = {
      uuid: uuidMock,
      name: chance.sentence(),
      releaseDate: Date.now(),
      authorName: chance.name()
    };
    const deleteReturnMock = {
      deleteOptions: {},
      deleteResult: {
        Attributes: deletedItemMock
      }
    };
    dbAdapterStub.delete = sinon.stub().returns(deleteReturnMock);

    // run
    const book = await deleteBookUtilMock(uuidMock);

    // test
    expect(book).to.be.a('object');
    expect(book.uuid).to.be.equal(uuidMock);
    expect(book.name).to.be.equal(deletedItemMock.name);
    expect(book.releaseDate).to.be.equal(deletedItemMock.releaseDate);
    expect(book.authorName).to.be.equal(deletedItemMock.authorName);
    expect(dbAdapterStub.delete.calledOnce).to.be.true;
  });

  it('should throw an error', async () => {
    // setup
    const uuidMock = uuidv4();
    dbAdapterStub.delete = sinon.stub().throws(new Error('oh noes!'));

    // run
    try {
      await deleteBookUtilMock(uuidMock);
    }
    catch (err) {
      // test
      expect(err).to.be.a('error');
      expect(err.message).to.be.equal('oh noes!');
    }
  });

  it('should throw a uuid bad argument error', async () => {
    // setup
    const uuidMock = undefined;

    // run
    try {
      await deleteBookUtilMock(uuidMock);
    }
    catch (err) {
      // test
      expect(err).to.be.a('error');
      expect(err.message).to.be.equal('Bad argument: uuid must be a string');
    }
  });
});
