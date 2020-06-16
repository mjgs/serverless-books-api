/* eslint-env mocha */
/* eslint-disable no-unused-expressions */
const debug = require('debug')('booksapi:test:integration:createBook'); // eslint-disable-line no-unused-vars
const axios = require('axios');
const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
const expect = chai.expect;
const chance = new (require('chance'))();
const Joi = require('joi');

chai.use(chaiAsPromised);

const apiRootUrl = process.env.API_BASE_URL;

debug(`apiRootUrl: ${apiRootUrl}`);

const { invalidRequestBodySchema } = require('../utils/schemas');

describe('creaateBook', function() {
  this.timeout(process.env.TEST_TIMEOUT || 10000);

  it('should create a book', function() {
    const requestOptions = {
      method: 'POST',
      url: `${apiRootUrl}/book/add`,
      data: {
        name: chance.sentence(),
        releaseDate: Date.now(),
        authorName: chance.name()
      }
    };

    debug(`requestOptions: ${JSON.stringify(requestOptions, 0, 2)}`);

    const promise = axios(requestOptions);

    return expect(promise).to.be.eventually.fulfilled
      .then((res) => {
        debug(`res.headers: ${JSON.stringify(res.headers, 0, 2)}`);
        debug(`res.data: ${JSON.stringify(res.data, 0, 2)}`);

        expect(res.status).to.be.equal(201);
        Joi.assert(res.data, Joi.object().keys({
          uuid: Joi.string().required(),
          name: Joi.string().valid(requestOptions.data.name).required(),
          releaseDate: Joi.string().valid(requestOptions.data.releaseDate).required(),
          authorName: Joi.string().valid(requestOptions.data.authorName).required()
        }));
      });
  });

  it('should create a 400 error - no post body', function() {
    const requestOptions = {
      method: 'POST',
      url: `${apiRootUrl}/book/add`,
      headers: { 'content-type': 'application/json' }
    };

    debug(`requestOptions: ${JSON.stringify(requestOptions, 0, 2)}`);

    const promise = axios(requestOptions);

    return expect(promise).to.be.eventually.rejected
      .then((err) => {
        debug(`err.response.data: ${JSON.stringify(err.response.data, 0, 2)}`);
        expect(err.response.status).to.be.equal(400);
        Joi.assert(err.response.data, invalidRequestBodySchema);
      });
  });

  it('should create a 400 error - empty post body', function() {
    const requestOptions = {
      method: 'POST',
      url: `${apiRootUrl}/book/add`,
      body: {},
      headers: { 'content-type': 'application/json' }
    };

    debug(`requestOptions: ${JSON.stringify(requestOptions, 0, 2)}`);

    const promise = axios(requestOptions);

    return expect(promise).to.be.eventually.rejected
      .then((err) => {
        debug(`err.response.data: ${JSON.stringify(err.response.data, 0, 2)}`);
        expect(err.response.status).to.be.equal(400);
        Joi.assert(err.response.data, invalidRequestBodySchema);
      });
  });

  it('should create a 400 error - null post body', function() {
    const requestOptions = {
      method: 'POST',
      url: `${apiRootUrl}/book/add`,
      body: null,
      headers: { 'content-type': 'application/json' }
    };

    debug(`requestOptions: ${JSON.stringify(requestOptions, 0, 2)}`);

    const promise = axios(requestOptions);

    return expect(promise).to.be.eventually.rejected
      .then((err) => {
        debug(`err.response.data: ${JSON.stringify(err.response.data, 0, 2)}`);
        expect(err.response.status).to.be.equal(400);
        Joi.assert(err.response.data, invalidRequestBodySchema);
      });
  });

  it('should create a 400 error - missing name', function() {
    const requestOptions = {
      method: 'POST',
      url: `${apiRootUrl}/book/add`,
      body: {
        releaseDate: Date.now(),
        authorName: chance.name()
      },
      headers: { 'content-type': 'application/json' }
    };

    debug(`requestOptions: ${JSON.stringify(requestOptions, 0, 2)}`);

    const promise = axios(requestOptions);

    return expect(promise).to.be.eventually.rejected
      .then((err) => {
        debug(`err.response.data: ${JSON.stringify(err.response.data, 0, 2)}`);
        expect(err.response.status).to.be.equal(400);
        Joi.assert(err.response.data, invalidRequestBodySchema);
      });
  });

  it('should create a 400 error - missing releaseDate', function() {
    const requestOptions = {
      method: 'POST',
      url: `${apiRootUrl}/book/add`,
      body: {
        name: chance.sentence(),
        authorName: chance.name()
      },
      headers: { 'content-type': 'application/json' }
    };

    debug(`requestOptions: ${JSON.stringify(requestOptions, 0, 2)}`);

    const promise = axios(requestOptions);

    return expect(promise).to.be.eventually.rejected
      .then((err) => {
        debug(`err.response.data: ${JSON.stringify(err.response.data, 0, 2)}`);
        expect(err.response.status).to.be.equal(400);
        Joi.assert(err.response.data, invalidRequestBodySchema);
      });
  });

  it('should create a 400 error - missing authorName', function() {
    const requestOptions = {
      method: 'POST',
      url: `${apiRootUrl}/book/add`,
      body: {
        name: chance.sentence(),
        releaseDate: Date.now()
      },
      headers: { 'content-type': 'application/json' }
    };

    debug(`requestOptions: ${JSON.stringify(requestOptions, 0, 2)}`);

    const promise = axios(requestOptions);

    return expect(promise).to.be.eventually.rejected
      .then((err) => {
        debug(`err.response.data: ${JSON.stringify(err.response.data, 0, 2)}`);
        expect(err.response.status).to.be.equal(400);
        Joi.assert(err.response.data, invalidRequestBodySchema);
      });
  });
});
