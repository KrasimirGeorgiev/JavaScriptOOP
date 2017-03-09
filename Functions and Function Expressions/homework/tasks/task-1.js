/* Task Description */
/* 
	Write a function that sums an array of numbers:
		numbers must be always of type Number
		returns `null` if the array is empty
		throws Error if the parameter is not passed (undefined)
		throws if any of the elements is not convertible to Number	
*/

function sum(numbers) {
	
	var i,
		len,
		result = 0;

	if (!numbers) {

		throw 'Error no Params';

	} else if (!Array.isArray(numbers)) {

		throw 'Error input is not an array';

	} else if(numbers.length == 0) {

		return null;
	}

	for (i = 0, len = numbers.length; i < len; i += 1) {
		if (isNaN(numbers[i])) {
			throw 'error index at array[' + i + '] is NaN' ;
		}
		result += +numbers[i];
	}

	return result;
}

module.exports = sum;
