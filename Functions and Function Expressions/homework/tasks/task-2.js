/* Task description */
/*
	Write a function that finds all the prime numbers in a range
		1) it should return the prime numbers in an array
		2) it must throw an Error if any on the range params is not convertible to `Number`
		3) it must throw an Error if any of the range params is missing
*/

function findPrimes(start , end) {

	var isPrime = true,
		j,
		i,
		factor,
		result = [];

	start = +start;
	end = +end;
	if (isNaN(start) || isNaN(end)) {
		throw 'Error a parameter is NaN';
	}

	factor = Math.sqrt(end) | 0;

	for(i = start; i <= end; i += 1){

		isPrime = true;

		if (!i || Math.abs(i) === 1) {
			continue;
		}
		if (Math.abs(i) === 2) {
			result.push(i);
			continue;
		} else if (!(i % 2)) {
			continue;
		}
		for (j = 3; j < factor; j += 2) {
			if (Math.abs(i) === j) {
				continue;
			}
			if (!(i % j)) {
				isPrime = false;
				break;
			}
		}

		if (isPrime) {
			result.push(i);
		}
	}

	return result;
}

module.exports = findPrimes;
//console.log(findPrimes(-77 , 100));
