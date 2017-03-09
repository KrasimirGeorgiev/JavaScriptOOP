/* Task Description */
/* 
	*	Create a module for working with books
		*	The module must provide the following functionalities:
			*	Add a new book to category
				*	Each book has unique title, author and ISBN
				*	It must return the newly created book with assigned ID
				*	If the category is missing, it must be automatically created
			*	List all books
				*	Books are sorted by ID
				*	This can be done by author, by category or all
			*	List all categories
				*	Categories are sorted by ID
		*	Each book/catagory has a unique identifier (ID) that is a number greater than or equal to 1
			*	When adding a book/category, the ID is generated automatically
		*	Add validation everywhere, where possible
			*	Book title and category name must be between 2 and 100 characters, including letters, digits and special characters ('!', ',', '.', etc)
			*	Author is any non-empty string
			*	Unique params are Book title and Book ISBN
			*	Book ISBN is an unique code that contains either 10 or 13 digits
*	If something is not valid - throw Error
*/
function solve() {
	var library = (function () {
		var books = [],
			categories = [];
	
		function addBook(book) {

			bookIsValid(book); 
			
			book.ID = books.length + 1;
			books.push(book);

			addCategory(book.category);

			return book;
		}

		function bookIsValid(book){
			var isbn = book.isbn.toString();

			switch(true){
				case (book.title.length > 100 || book.title.length < 2): throw new Error('Unexpected title length');
				case (book.category.length > 100 || book.category.length < 2): throw new Error('Unexpected category length');
				case (!book.author.length): throw new Error('Author name is empty string');
				case (isbn.length !== 10 && isbn.length !== 13): throw new Error('ISBN must be 10 or 13 digits');
				default: break;
			}

			books.forEach(function(some) {
	 			if (some.title === book.title) {
	 				throw new Error('Book title is not unique');
	 			} else if (some.isbn === book.isbn) {
	 				throw new Error('Book isbn is not unique');
	 			}
			});

			return true;
		}

		function addCategory(category) {
			if (categories.indexOf(category) !== -1) {
				return category;
			}
			categories.push(category);
			return category;
		}

		function listCategories() {
			return categories;
		}

		function listBooks(options) {

			var sortBooks,
				sortOption = '',
				groupBy = '';

			if (!options) {

				return books;

			} else {
				sortBooks = function(current , next) {
					if (current[sortOption] > next[sortOption]) {
						return 1;
					} else if (current[sortOption] < next[sortOption]) {
						return -1;
					} else {
						return 0;
					}	
				};
			}

			if (options.author) {
				sortOption = 'author';
				groupBy = options.author;
			} else if (options.category) {
				sortOption = 'category';
				groupBy = options.category;
			}

			switch(sortOption) {
				default:
					return books;
				case 'author': 
					if (!groupBy) {
						return books.sort(sortBooks);
					}
					return books.filter(function(current) {
						return current.author === groupBy;
					});
					
				case 'category':
					if (!groupBy) {
						return books.sort(sortBooks);
					}
					return books.filter(function(current) {
						return current.category === groupBy;
					});
			}
		}

		return {
			books: {
				list: listBooks,
				add: addBook
			},
			categories: {
				list: listCategories,
				add: addCategory
			}
		};

	} ());

	return library;
}

module.exports = solve;
