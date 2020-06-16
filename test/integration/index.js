/* eslint-env mocha */
/* eslint-disable no-unused-expressions */
'use strict';

describe('integration', () => {
  require('./createBook.test.js');
  require('./deleteBook.test.js');
  require('./getBook.test.js');
  require('./getAllBooks.test.js');
  require('./updateBook.test.js');
});
