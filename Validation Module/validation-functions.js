var validations = (function() {

// ****************** Error Constructor *************************

	function ValidationError(message) {
		this.message = message;

		Object.defineProperty(this, 'name', {
			get: function() {
				return 'ValidationError';
			}
		});
	}

	ValidationError.prototype.toString = function() {
		return this.name + ': ' + this.message;
	};

// ===============================================================	

// ****************** General Validations ************************

	function isUndefined(value, testedItemName) {
		testedItemName = testedItemName || 'Value';

		if (value === undefined) {
			throw new ValidationError(testedItemName + ' received undefined value');
		}

		return this;
	}

	// This check doesn't parse a string to number 
	// Be careful parse the string if needed , before doing this check
	function isNaN(value, testedItemName) {
		testedItemName = testedItemName || 'Value';

		isUndefined(value, testedItemName);
		if (typeof(value) !== 'number' || isNaN(value)) {
			throw new ValidationError(testedItemName + ' is not a number');
		}

		return this;
	}

	function isString(value, testedItemName) {
		testedItemName = testedItemName || 'Value';

		isUndefined(value, testedItemName);
		if (typeof(value) !== 'string') {
			throw new ValidationError(testedItemName + ' is not a String');
		}

		return this;
	}

	function isNotEmptyString(value, testedItemName) {
		testedItemName = testedItemName || 'Value';

		isString(value, testedItemName);
		if (value === '') {
			throw new ValidationError(testedItemName + ' received an empty string');
		}

		return this;
	}

	function isObject(value, testedItemName) {
		testedItemName = testedItemName || 'Value';

		isUndefined(value, testedItemName);
		if (typeof(value) !== 'object') {
			throw new ValidationError(testedItemName + ' is not an Object');
		}

		return this;
	}

	function isCollection(value, testedItemName) {
		testedItemName = testedItemName || 'Value';

		isUndefined(value, testedItemName);

		if (!value.length) {
			throw new ValidationError(testedItemName + 
				' is not a collection, no length property');
		}

		if(typeof(value) === 'string') {
			throw new ValidationError(testedItemName + 
				' is not a collection, it\'s a string');
		}

		if (value[0] === undefined) {
			throw new ValidationError(testedItemName + 
				' is an empty collection, or not an indexed collection');
		}

		return this;
	}

// ===============================================================

// ****************** String Validations *************************

	function isValidString(value, 
					testedItemName, 
					minLength, 
					maxLength, 
					regExUnwantedCharacters) {

		// Edit defaultValues or use the optionalParams
		var defaultValues = {
			minLen: 3,
			len: 25,
			regEx: /[^\w\-]/
		};

		testedItemName = testedItemName || 'Value';

		isNotEmptyString(value, testedItemName);

		minLength = minLength || defaultValues.minLen;
		maxLength = maxLength || defaultValues.len;
		regExUnwantedCharacters = regExUnwantedCharacters || defaultValues.regEx;

		if (value.length < minLength || value.length > maxLength) {
			throw new ValidationError(testedItemName + 
				' received a string with incorrect length: ' + value.length);
		}

		if (regExUnwantedCharacters.test(value)) {
			throw new ValidationError(testedItemName + 
				' received a string with unsupported characters');
		}

		return this;
	}

// ===============================================================

// ****************** Number Validations *************************
	// !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
	// !!! These validations do not parse a string to number. !!!
	// !!! Be careful parse the string first if needed. !!!!!!!!!!
	// !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!

	function isPositiveNumber(value, testedItemName) {
		testedItemName = testedItemName || 'Value';

		if (value <= 0) {
			throw new ValidationError(testedItemName + ' is negative');
		} 

		return this;
	}

	function isInteger(value, testedItemName) {
		testedItemName = testedItemName || 'Value';

		if ((value | 0) !== value) {
			throw new ValidationError(testedItemName + ' is Not an Integer (not a whole number)');
		}

		return this;
	}
// ===============================================================


// ****************** Custom Validations *************************

	function validateId(value, testedItemName) {
		testedItemName = testedItemName || 'Value';

		if (typeof(value) === 'object') {
			validateId(value.id, testedItemName);
		} else {
			isPositiveNumber(value, testedItemName);
			isInteger(value, testedItemName);
		}

		return this;
	}

	function validatePageAndSize(page, itemsPerPage, collection, testedItemName) {
		testedItemName = testedItemName || 'Value';

		// If you specifically need an array, check with Array.isArray(collection)
		isCollection(collection, (testedItemName + ' collection'));

		if (page < 0) {
			throw new ValidationError(testedItemName + ' page value can\'t be less than zero');
		}

		isInteger(page, (testedItemName + ' page value'));
		
		isPositiveNumber(itemsPerPage, (testedItemName + ' itemsPerPage value'));
		isInteger(itemsPerPage, (testedItemName + ' itemsPerPage value'));

		if ((page * itemsPerPage) > collection.length) {
			throw new ValidationError(testedItemName + 
				' page value is outside the bounds of the collection');
		}

		return this;
	}

// ===============================================================

// ****************** Validations Module *************************
	validations = {
		isUndefined: isNotUndefined,
		isNaN: isNaN,
		isPositive: isPositiveNumber,
		isInteger: isInteger,
		isValidString: isValidString,
		isObject: isObject,
		validateId: validateId,
		validatePageAndSize: validatePageAndSize
	};

	// Usage:
		// All methods take: 'value' - the value to be validated
		// 'testedItemName' - optional message, to be used with
		// the Error constructor.

	// Specific:
		// arguments in [] are optional (not an array)	 

		// .isValidString(value, [message, minLength, maxLength, regExUnwantedChars])

		// .validatePageAndSize(page, itemsPerPage, collection, [message])
		

// ===============================================================	

	return validations;
}());