/* eslint-env mocha */
/* eslint-disable no-unused-expressions */
const debug = require('debug')('booksapi:test:integration:getAllBooks'); // eslint-disable-line no-unused-vars
const axios = require('axios');
const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
const expect = chai.expect;
const chance = new (require('chance'))();
const Joi = require('joi');

chai.use(chaiAsPromised);

const apiRootUrl = process.env.API_BASE_URL;

debug(`apiRootUrl: ${apiRootUrl}`);

const { bookSchema } = require('../utils/schemas');

describe('getAllBooks', function() {
  this.timeout(process.env.TEST_TIMEOUT || 10000);

  it('should get all books', async function() {
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

    await axios(addOptions);

    const requestOptions = {
      method: 'GET',
      url: `${apiRootUrl}/books`
    };

    debug(`requestOptions: ${JSON.stringify(requestOptions, 0, 2)}`);

    const promise = axios(requestOptions);

    return expect(promise).to.be.eventually.fulfilled
      .then((res) => {
        debug(`res.data: ${JSON.stringify(res.data, 0, 2)}`);
        expect(res.status).to.be.equal(200);
        Joi.assert(res.data, Joi.array().items(bookSchema));
      });
  });
});
