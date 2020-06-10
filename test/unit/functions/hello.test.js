/* eslint-env mocha */
/* eslint-disable no-unused-expressions */
'use strict';

const expect = require('chai').expect;

const handler = require('../../../lib/functions/hello');

describe('hello', () => {
  describe('hello', () => {
    it('should return a response', async () => {
      const response = await handler.hello({});
      expect(response).to.not.be.empty;
      expect(response.statusCode).to.be.equal(200);
      expect(response.body).to.be.equal('"hello from serverless"');
    });
  });
});
