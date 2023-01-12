{
  'use strict';

  const favoriteBooks = [];
  const filters = [];

  const select = {
    templateBook: '#template-book',
    booksList: '.books-list',
    bookImage: 'book__image',
    filters: '.filters',
    filter: 'filter',
    ratingFill: '.book__rating__fill'
  };

  const classNames = {
    favorite: 'favorite',
    hidden: 'hidden'
  };

  const templates = {
    book: Handlebars.compile(document.querySelector(select.templateBook).innerHTML)
  };

  const getFillBackgroundStyle = function(rating) {
    let color1, color2;

    if (rating > 9) {
      color1 = color2 = '#ff0084';
    } else if (rating > 8) {
      color1 = color2 = '#299a0b';
    } else if (rating > 6) {
      color1 = color2 = '#b4df5b';
    } else {
      color1 = '#fefcea';
      color2 = '#f1da36';
    }

    return 'linear-gradient(to bottom, ' + color1 + ' 0%, ' + color2 + ' 100%)';
  };

  const renderData = function() {
    const booksList = document.querySelector(select.booksList);

    for (const book of dataSource.books) {
      book.ratingWidth = book.rating * 10;
      book.ratingBgc = getFillBackgroundStyle(book.rating);
      const generatedHTML = templates.book(book);
      const element = utils.createDOMFromHTML(generatedHTML);
      booksList.appendChild(element);
      
      console.log(element);
    }
  };

  const filterBooks = function() {
    for (const book of dataSource.books) {
      let visibility = true;
      for (const detail in book['details']) {
        // hidding book if any of book details doesn't match with filter
        if (filters.includes(detail) && !book['details'][detail]) {
          visibility = false;
          break;
        }
      }

      const bookElm = document.querySelector('[data-id="' + book.id + '"]');
      if (visibility) {
        bookElm.classList.remove(classNames.hidden);
      } else {
        bookElm.classList.add(classNames.hidden);
      }
    }
  };

  const initActions = function() {
    const booksList = document.querySelector(select.booksList);

    booksList.addEventListener('dblclick', function(event) {
      event.preventDefault();

      // href element with data-id attribute is parent of parent of clicked image
      const element = event.target.parentElement.parentElement;
      
      if (element.classList.contains(select.bookImage)) {
        const bookId = element.getAttribute('data-id');

        if (favoriteBooks.includes(bookId)) {
          element.classList.remove(classNames.favorite);
          favoriteBooks.splice(favoriteBooks.indexOf(bookId), 1);
        } else {
          element.classList.add(classNames.favorite);
          favoriteBooks.push(bookId);
        }
      }
    });

    const filtersElm = document.querySelector(select.filters);
    
    filtersElm.addEventListener('click', function(event) {
      // add listener to filter checkboxes only
      if (event.target.tagName == 'INPUT' && event.target.type == 'checkbox' && event.target.name == select.filter) {
        if (event.target.checked) {
          filters.push(event.target.value);
        } else {
          filters.splice(filters.indexOf(event.target.value), 1);
        }
      }
      filterBooks();
    });
  };
  

  renderData();
  initActions();
}