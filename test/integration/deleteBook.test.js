/* eslint-env mocha */
/* eslint-disable no-unused-expressions */
const debug = require('debug')('booksapi:test:integration:deleteBook'); // eslint-disable-line no-unused-vars
const axios = require('axios');
const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
const expect = chai.expect;
const chance = new (require('chance'))();
const Joi = require('joi');

chai.use(chaiAsPromised);

const apiRootUrl = process.env.API_BASE_URL;

debug(`apiRootUrl: ${apiRootUrl}`);

const { notFoundSchema } = require('../utils/schemas');

describe('deleteBook', function() {
  this.timeout(process.env.TEST_TIMEOUT || 10000);

  it('should delete a book', async function() {
    const addOptions = {
      method: 'POST',
      url: `${apiRootUrl}/book/add`,
      data: {
        name: chance.sentence(),
        releaseDate: Date.now(),
        authorName: chance.name()
      }
    };

    debug(`addOptions: ${JSON.stringify(addOptions, 0, 2)}`);

    let bookUuid;
    await axios(addOptions)
      .then((res) => {
        bookUuid = res.data.uuid;
      });

    const requestOptions = {
      method: 'POST',
      url: `${apiRootUrl}/book/${bookUuid}/delete`
    };

    debug(`requestOptions: ${JSON.stringify(requestOptions, 0, 2)}`);

    const promise = axios(requestOptions);

    return expect(promise).to.be.eventually.fulfilled
      .then((res) => {
        debug(`res.data: ${JSON.stringify(res.data, 0, 2)}`);
        expect(res.status).to.be.equal(200);
        Joi.assert(res.data, Joi.object().keys({
          uuid: Joi.string().valid(bookUuid).required(),
          name: Joi.string().valid(addOptions.data.name).required(),
          releaseDate: Joi.string().valid(addOptions.data.releaseDate).required(),
          authorName: Joi.string().valid(addOptions.data.authorName).required()
        }));
      });
  });

  it('should create a 404 error', function() {
    const requestOptions = {
      method: 'POST',
      url: `${apiRootUrl}/book/badbookuuid/delete`
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
