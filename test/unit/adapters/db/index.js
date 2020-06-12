/* eslint-env mocha */
/* eslint-disable no-unused-expressions */

describe('db', () => {
  require('./putItem.test.js');
  require('./deleteItem.test.js');
  require('./getItem.test.js');
  require('./scan.test.js');
});
