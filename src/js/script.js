{
  'use strict';

  class BooksList {
    constructor() {
      const thisBooksList = this;
      
      thisBooksList.initProperties();
      thisBooksList.renderData();
      thisBooksList.getElements();
      thisBooksList.initActions();
    }
    
    initProperties() {
      const thisBooksList = this;

      thisBooksList.favoriteBooks = [];
      thisBooksList.filters = [];

      thisBooksList.dsBooks = dataSource.books;

      thisBooksList.select = {
        templateBook: '#template-book',
        booksList: '.books-list',
        bookImage: 'book__image',
        filters: '.filters',
        filter: 'filter',
        ratingFill: '.book__rating__fill'
      };
  
      thisBooksList.classNames = {
        favorite: 'favorite',
        hidden: 'hidden'
      };
  
      thisBooksList.templates = {
        book: Handlebars.compile(document.querySelector(thisBooksList.select.templateBook).innerHTML)
      };
    }

    renderData() {
      const thisBooksList = this;

      const booksList = document.querySelector(thisBooksList.select.booksList);

      for (const book of thisBooksList.dsBooks) {
        book.ratingWidth = book.rating * 10;
        book.ratingBgc = thisBooksList.getFillBackgroundStyle(book.rating);
        const generatedHTML = thisBooksList.templates.book(book);
        const element = utils.createDOMFromHTML(generatedHTML);
        booksList.appendChild(element);
      }
    }

    getFillBackgroundStyle(rating) {
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
    }

    getElements() {
      const thisBooksList = this;

      thisBooksList.dom = {};
      thisBooksList.dom.booksList = document.querySelector(thisBooksList.select.booksList);
      thisBooksList.dom.filtersElm = document.querySelector(thisBooksList.select.filters);
    }

    initActions() {
      const thisBooksList = this;

      thisBooksList.dom.booksList.addEventListener('dblclick', function(event) {
        event.preventDefault();
        thisBooksList.setFavoritesListener(event);
      });

      thisBooksList.dom.filtersElm.addEventListener('click', function(event) {
        thisBooksList.setFiltersListener(event);
      });
    }

    setFavoritesListener(event) {
      const thisBooksList = this;

      // href element with data-id attribute is parent of parent of clicked image
      const element = event.target.parentElement.parentElement;
        
      if (element.classList.contains(thisBooksList.select.bookImage)) {
        const bookId = element.getAttribute('data-id');

        if (thisBooksList.favoriteBooks.includes(bookId)) {
          element.classList.remove(thisBooksList.classNames.favorite);
          thisBooksList.favoriteBooks.splice(thisBooksList.favoriteBooks.indexOf(bookId), 1);
        } else {
          element.classList.add(thisBooksList.classNames.favorite);
          thisBooksList.favoriteBooks.push(bookId);
        }
      }
    }

    setFiltersListener(event) {
      const thisBooksList = this;

      // add listener to filter checkboxes only
      if (event.target.tagName == 'INPUT' && event.target.type == 'checkbox' && event.target.name == thisBooksList.select.filter) {
        if (event.target.checked) {
          thisBooksList.filters.push(event.target.value);
        } else {
          thisBooksList.filters.splice(thisBooksList.filters.indexOf(event.target.value), 1);
        }
      }
      thisBooksList.filterBooks();
    }

    filterBooks() {
      const thisBooksList = this;

      for (const book of thisBooksList.dsBooks) {
        let visibility = true;
        for (const detail in book['details']) {
          // hiding book if any of details doesn't match with filter
          if (thisBooksList.filters.includes(detail) && !book['details'][detail]) {
            visibility = false;
            break;
          }
        }
        thisBooksList.setBookVisibility(book, visibility);
      }
    }

    setBookVisibility(book, visible) {
      const thisBooksList = this;

      const bookElm = document.querySelector('[data-id="' + book.id + '"]');
      if (visible) {
        bookElm.classList.remove(thisBooksList.classNames.hidden);
      } else {
        bookElm.classList.add(thisBooksList.classNames.hidden);
      }
    }
  }

  new BooksList();
}