/* eslint-env mocha */
/* eslint-disable no-unused-expressions */
'use strict';

describe('books', () => {
  require('./addBook.test.js');
  require('./deleteBook.test.js');
  require('./getBook.test.js');
  require('./getAllBooks.test.js');
});
