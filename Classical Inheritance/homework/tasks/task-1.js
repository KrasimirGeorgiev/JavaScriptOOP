/* Task Description */
/* 
	Create a function constructor for Person. Each Person must have:
	*	properties `firstname`, `lastname` and `age`
		*	firstname and lastname must always be strings between 3 and 20 characters, containing only Latin letters
		*	age must always be a number in the range 0 150
			*	the setter of age can receive a convertible-to-number value
		*	if any of the above is not met, throw Error 		
	*	property `fullname`
		*	the getter returns a string in the format 'FIRST_NAME LAST_NAME'
		*	the setter receives a string is the format 'FIRST_NAME LAST_NAME'
			*	it must parse it and set `firstname` and `lastname`
	*	method `introduce()` that returns a string in the format 'Hello! My name is FULL_NAME and I am AGE-years-old'
	*	all methods and properties must be attached to the prototype of the Person
	*	all methods and property setters must return this, if they are not supposed to return other value
		*	enables method-chaining
*/
function solve() {
	var Person = (function () {
		function Person(fname , lname , age) {
			this.firstname = fname;
			this.lastname = lname;
			this.age = age;
		}

		function validateName(str) {
			var reInvalidChars = /[^A-Za-z]/;

			if (typeof(str) !== 'string') {
				throw new Error('The name must be a string');
			}
			if (str.length < 3 || str.length > 20) {
				throw new Error('Invalid name length');
			}
			if (reInvalidChars.test(str)) {
				throw new Error('Only Latin letters allowed');
			}

			return true;
		}

		function validateAge(num) {
			num = +num;
			
			if (isNaN(num)) {
				throw new Error('Age must be a number');
			}
			if (num <= 0 || num > 150) {
				throw new Error('Age must be between 1 and 150');
			}

			return num;
		}

		Object.defineProperties(Person.prototype , {
			'firstname': {
				get: function() {
					return this._firstname;
				},
				set: function(val) {
					validateName(val);
					this._firstname = val;
					return this;
				}
			},
			'lastname': {
				get: function() {
					return this._lastname;
				},
				set: function(val) {
					validateName(val);
					this._lastname = val;
					return this;
				}
			},
			'age': {
				get: function() {
					return this._age;
				},
				set: function(val) {
					val = validateAge(val);
					this._age = val;
					return this;
				}
			},
			'fullname': {
				get: function() {
					return this._firstname + ' ' + this._lastname;
				},
				set: function(val) {
					val = val.toString();
					this.firstname = val.replace(/(\w+)\s(\w+)/ , '$1');
					this.lastname = val.replace(/(\w+)\s(\w+)/ , '$2');
					return this;
				}
			}
		});

		Person.prototype.introduce = function() {
			return 'Hello! My name is ' + this.fullname + ' and I am ' + this.age + '-years-old';
		};

		return Person;
	} ());

	return Person;
}

module.exports = solve;