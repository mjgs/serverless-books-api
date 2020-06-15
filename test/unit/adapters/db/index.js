/* eslint-env mocha */
/* eslint-disable no-unused-expressions */

describe('db', () => {
  require('./create.test.js');
  require('./delete.test.js');
  require('./get.test.js');
  require('./scan.test.js');
});
