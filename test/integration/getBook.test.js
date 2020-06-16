/* eslint-env mocha */
/* eslint-disable no-unused-expressions */
const debug = require('debug')('booksapi:test:integration:getBook'); // eslint-disable-line no-unused-vars
const axios = require('axios');
const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
const expect = chai.expect;
const chance = new (require('chance'))();
const Joi = require('joi');

chai.use(chaiAsPromised);

const apiRootUrl = process.env.API_BASE_URL;

debug(`apiRootUrl: ${apiRootUrl}`);

const { bookSchema, notFoundSchema } = require('../utils/schemas');

describe('getBook', function() {
  this.timeout(process.env.TEST_TIMEOUT || 10000);

  it('should get a book', async function() {
    const getOptions = {
      method: 'POST',
      url: `${apiRootUrl}/book/add`,
      data: {
        name: chance.sentence(),
        releaseDate: Date.now(),
        authorName: chance.name()
      }
    };

    debug(`getOptions: ${JSON.stringify(getOptions, 0, 2)}`);

    let bookUuid;
    await axios(getOptions)
      .then((res) => {
        bookUuid = res.data.uuid;
      });

    const requestOptions = {
      method: 'GET',
      url: `${apiRootUrl}/book/${bookUuid}`
    };

    debug(`requestOptions: ${JSON.stringify(requestOptions, 0, 2)}`);

    const promise = axios(requestOptions);

    return expect(promise).to.be.eventually.fulfilled
      .then((res) => {
        debug(`res.data: ${JSON.stringify(res.data, 0, 2)}`);
        expect(res.status).to.be.equal(200);
        Joi.assert(res.data, bookSchema);
        Joi.assert(res.data, Joi.object().keys({
          uuid: Joi.string().valid(bookUuid).required(),
          name: Joi.string().required(),
          releaseDate: Joi.number().required(),
          authorName: Joi.string().required()
        }));
      });
  });

  it('should create a 404 error', function() {
    const requestOptions = {
      method: 'GET',
      url: `${apiRootUrl}/book/badbookuuid`
    };

    debug(`requestOptions: ${JSON.stringify(requestOptions, 0, 2)}`);

    const promise = axios(requestOptions);

    return expect(promise).to.be.eventually.rejected
      .then((err) => {
        debug(`err.response.data: ${JSON.stringify(err.response.data, 0, 2)}`);
        expect(err.response.status).to.be.equal(404);
        Joi.assert(err.response.data, notFoundSchema);
      });
  });
});
