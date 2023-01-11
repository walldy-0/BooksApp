{
  'use strict';

  const select = {
    templateBook: '#template-book',
    booksContainer: '.books-list'
  };

  const templates = {
    book: Handlebars.compile(document.querySelector(select.templateBook).innerHTML)
  };

  const readData = function() {
    const booksContainer = document.querySelector(select.booksContainer);

    for (const book of dataSource.books) {
      const generatedHTML = templates.book(book);
      const element = utils.createDOMFromHTML(generatedHTML);
      booksContainer.appendChild(element);
    }
  };

  readData();
}