/* eslint-env mocha */
/* eslint-disable no-unused-expressions */
'use strict';

const expect = require('chai').expect;

const handler = require('../../../lib/functions/books/add');

describe('Books API', () => {
  describe('add', () => {
    it('should return a response', async () => {
      const response = await handler.add({});
      expect(response).to.not.be.empty;
    });
  });
});
