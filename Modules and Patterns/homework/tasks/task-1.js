/* Task Description */
/*
* Create a module for a Telerik Academy course
  * The course has a title and presentations
    * Each presentation also has a title
    * There is a homework for each presentation
  * There is a set of students listed for the course
    * Each student has firstname, lastname and an ID
      * IDs must be unique integer numbers which are at least 1
  * Each student can submit a homework for each presentation in the course
  * Create method init
    * Accepts a string - course title
    * Accepts an array of strings - presentation titles
    * Throws if there is an invalid title
      * Titles do not start or end with spaces
      * Titles do not have consecutive spaces
      * Titles have at least one character
    * Throws if there are no presentations
  * Create method addStudent which lists a student for the course
    * Accepts a string in the format 'Firstname Lastname'
    * Throws if any of the names are not valid
      * Names start with an upper case letter
      * All other symbols in the name (if any) are lowercase letters
    * Generates a unique student ID and returns it
  * Create method getAllStudents that returns an array of students in the format:
    * {firstname: 'string', lastname: 'string', id: StudentID}
  * Create method submitHomework
    * Accepts studentID and homeworkID
      * homeworkID 1 is for the first presentation
      * homeworkID 2 is for the second one
      * ...
    * Throws if any of the IDs are invalid
  * Create method pushExamResults
    * Accepts an array of items in the format {StudentID: ..., Score: ...}
      * StudentIDs which are not listed get 0 points
    * Throw if there is an invalid StudentID
    * Throw if same StudentID is given more than once ( he tried to cheat (: )
    * Throw if Score is not a number
  * Create method getTopStudents which returns an array of the top 10 performing students
    * Array must be sorted from best to worst
    * If there are less than 10, return them all
    * The final score that is used to calculate the top performing students is done as follows:
      * 75% of the exam result
      * 25% the submitted homework (count of submitted homeworks / count of all homeworks) for the course
*/

function solve() {

	//********** Module Public Functions **********
	function init(courseTitle, presentationTopics) {
		var self = this;

		self.title = courseTitle;
		self.presentations = [];
		self.students = [];
		self.examMaxScore = 0;
		self.topTen = [];
		self._nextPresentationID = 0;
		self._nextStudentID = 0;

		if (!Array.isArray(presentationTopics)) {
			throw {
				name: 'Incorrect presentation input',
				message: 'Presentations must be an array of titles'
			};
		} else if (presentationTopics.length < 1) {
			throw {
				name: 'Incorrect presentation input',
				message: 'Presentations array is empty'
			};
		}

		presentationTopics.forEach(function(topic) {
			addPresentation.call(self, topic);
		});

		return self;
	}

	function addPresentation(title) {
		var presentation,
			id = ++this._nextPresentationID;

		checkTitle(title);

		//Choose Pressentation module or Pressentation constructor
		presentation = new Pressentation(id, title);
		// presentation = Object.create(definePresentation).init(id, title);

		this.presentations.push(presentation);

		return this;
	}

	function addStudent(name) { // format "Fname Lname"
		var student,
			fname = checkName(name, 1),
			lname = checkName(name, 2),
			nextStudentId = ++this._nextStudentID;

		//Choose Student module or Student constructor
		student = new Student(nextStudentId, fname, lname);
		//student = Object.create(defineStudent).init(nextStudentId, fname, lname);

		this.students.push(student);

		return nextStudentId;
	}

	function getAllStudents() {
		return this.students.slice();
	}

	function submitHomework(studentID, presentationIndex) {

		var reference, //link to course > presentations > presentationID > array of IDs
			alreadySubmited = false;

		checkValidIdFormat(studentID);
		checkValidIdFormat(presentationIndex);
		checkIdInDatabase(studentID, this.students);
		checkIdInDatabase(presentationIndex, this.presentations);

		reference = this
			.presentations[presentationIndex - 1]
			.idsWhoSubmitedHomeWork;

		alreadySubmited = reference.some(function(someID) {
			return someID === studentID;
		});

		if (!alreadySubmited) {
			reference.push(studentID);
			this.students[studentID - 1].homeworkScore += 10;
		}
		else {
			throw {
				name: 'Homework Already Submitted',
				message: 'Student ID: ' + studentID + ' already exists in "' +
					this.presentations[presentationIndex - 1].title +
					'" list of submitted homeworks'
			};
		}

		return this;
	}

	function pushExamResults(results) {
		var i,
			len,
			studentID,
			score;

		if(!Array.isArray(results))
		{
			throw {
				name: "Incorect Exam Results Input",
				message: "Expected results to be submitted as an array"
			};
		}

		for (i = 0, len = results.length; i < len; i += 1) {
			studentID = results[i].StudentID;
			checkValidIdFormat(studentID);
			score = results[i].score;

			updateStudentScores(this.students[studentID - 1], score);

			if (score > this.examMaxScore) {
				this.examMaxScore = score;
			}
		}

		this.examResults = results;

		return this;
	}

	function getTopStudents() {
		if (!this.topTen.length) {
			this.topTen = pickTenPromisingJedis(this.students);
		}

		return this.topTen.slice();
	}

	function removeFromDatabase(id, db) {
		// Removing id from database doesn't reduce _nextStudentID
		// or _nextPresentationID as it is used to generate unique IDs
		var i,
			len;

		if (!db) {
			throw {
				name: 'Invalid Database Entry',
				message: 'You must specify a database (no empty strings)'
			};
		}

		checkValidIdFormat(id);

		db = db.toLowerCase();

		if (db === 'students') {
			db = this.students;
		} else if (db === 'presentations') {
			db = this.presentations;
		} else {
			throw {
				name: 'Invalid Database Entry',
				message: 'Incorrect database entry: "' + db +
					'" only "students" and "presentations" are valid options'
			};
		}

		for (i = 0, len = db.length; i < len; i += 1) {
			if (db[i].id == id) {
				db.splice(i, 1);

				return this;
			}
		}

		throw {
			name: 'No such ID in databse',
			message: 'I can\'t find this ID: ' + id + ' in the course database'
		};
	}
	//*********************************************

	//************* Helper Functions **************
	function checkTitle(title) {
			if (!title) {
				throw {
					name: 'Title Error',
					message: 'Title must be atleast one character'
				};
			}
			if (title[0] === ' ' ||
				title[title.length - 1] == ' ') {
				 	throw {
						name: 'Title Error',
						message: 'Title can\'t start or end with a space'
					};
			}
			if (/\s\s/.test(title)) {
				throw {
					name: 'Title Error',
					message: 'Title can\'t contain consecutive spaces!'
				};
			}

		return true;
	}

	function checkName(fullName, match) {
		var re = /^([A-Z][a-z]*)\s+([A-Z][a-z]*)$/,
			name = '';

		name = fullName.replace(re, ('$' + match));

		if(!name || (name === fullName)) {
			throw {
				name: 'Invalid student Name: "' + fullName + '"',
		 		message: 'The student name show be of latin letters in the format ' +
					'"Firstname Lastname"'
				};
		}

		return name;
	}

	function checkValidIdFormat(id) {
		if (!id || 				//Zero or undefined
			isNaN(id) || 		//NaN
			(id | 0) !== id || 	// Not an integer
			id < 0) { 			//Negative
				throw {
					name: 'Incorrect ID format: "' + id + '"',
					message: 'The ID should be of an integer value greater than one'
				};
		}

		return true;
	}

	function checkIdInDatabase(id, database) {
		id = +id;
		var idExists = database.some(function(some) {
			return (some.id === id);
		});

		if (!idExists) {
			throw {
				name: 'No such ID in databse',
				message: 'I can\'t find this ID: ' + id + ' in the course database'
			};
		}

		return idExists;
	}

	function updateStudentScores(student, score) {
		if (isNaN(score)) {
			throw {
				name: 'Score is NaN: "' + score + '"',
				message: 'Invalid exam Score, must be a number!'
			};
		}
		if (student.submittedExam) {
			throw {
				name: 'Ivalid Exam Results',
				message: 'Repeating student ID: ' + student.ID + ' in Exam results'
			};
		}

		student.submittedExam = true;
		student.examScore = score;

		return true;
	}

	function pickTenPromisingJedis(students) {
		var sliceEnd = 9;

		if (students.length < 10) {
			sliceEnd = students.length;
		}

		students = students.sort(function(a, b) {
			return b.finalScore - a.finalScore;
		});

		return students.slice(0, sliceEnd);
	}
	//*********************************************

	//********** Student from Constructor *********
	function Student(id, fname, lname) {
		this.id = id;
		this.firstname = fname;
		this.lastname = lname;
		this.submittedExam = false;
		this.examScore = 0;
		this.homeworkScore = 0;
	}

	Object.defineProperty(Student.prototype, 'finalScore', {
		get: function() {
			return (this.examScore * 0.75) +
				(this.homeworkScore * 0.25);
		},
	});
	//*********************************************

	//****** Pressentation from Constructor *******
	function Pressentation(id, title) {
		this.id = id;
		this.title = title;
		this.idsWhoSubmitedHomeWork = [];
	}
	//*********************************************

	//******** Pressentation from Module **********
	var definePresentation = {
		init: function(id, title) {
			this.id = id;
			this.title = title;
			this.idsWhoSubmitedHomeWork = [];

			return this;
		}
	};
	//*********************************************

	//************ Student from Module ************
	var defineStudent = {
		init: function(id, fname, lname) {
			this.id = id;
			this.firstname = fname;
			this.lastname = lname;
			this.submittedExam = false;
			this.examScore = 0;
			this.homeworkScore = 0;

			return this;
		},
		get finalScore() {
			return (this.examScore * 0.75) +
				(this.homeworkScore * 0.25);
		}
	};
	//*********************************************

	//*********************************************
	//************ Main Course Module *************
	//*********************************************
	var Course = {

		init: init,

		addPresentation: addPresentation,

		removePresentation: removeFromDatabase,

		addStudent: addStudent,

		removeStudent: removeFromDatabase,

		getAllStudents: getAllStudents,

		submitHomework: submitHomework,

		pushExamResults: pushExamResults,

		getTopStudents: getTopStudents,

		set title(val) {
			checkTitle(val);
			this._title = val;
		},

		get title() {
			return this._title;
		}
	};
	//*********************************************
	//*********************************************
	return Course;
}

module.exports = solve;

// var validTitles = [
// 	'Modules and Patterns',
// 	'Ofcourse, this is a valid title!',
// 	'No errors hIr.',
// 	'Moar taitles',
// 	'Businessmen arrested for harassment of rockers',
// 	'Miners handed cabbages to the delight of children',
// 	'Dealer stole Moskvitch',
// 	'Shepherds huddle',
// 	'Retired Officers rally',
// 	'Moulds detonate tunnel',
// 	'sailors furious',
// ], validNames = [
// 	'Pesho',
// 	'Notaname',
// 	'Johny',
// 	'Marulq',
// 	'Keremidena',
// 	'Samomidena',
// 	'Medlar',
// 	'Yglomer',
// 	'Elegant',
// 	'Analogical',
// 	'Bolsheviks',
// 	'Reddish',
// 	'Arbitrage',
// 	'Toyed',
// 	'Willfully',
// 	'Transcribing',
// ];
//
// function getValidTitle() {
// 	return validTitles[(Math.random() * validTitles.length) | 0];
// }
// function getValidName() {
// 	return validNames[(Math.random() * validNames.length) | 0];
// }
//
// var Course = solve();
//
// var jsoop = Object.create(Course)
// 	.init(getValidTitle(), [getValidTitle()]);
//
// var firstname, lastname, listed = [];
// for(var i=0; i<100; ++i) {
// 	firstname = getValidName();
// 	lastname = getValidName();
// 	listed.push({
// 		firstname: firstname,
// 		lastname: lastname,
// 		id: jsoop.addStudent(firstname + ' ' + lastname)
// 	});
// }
// var arr = [];
// for(var i = 0; i < 100; i += 1) {
// 	arr[i] = {
// 		StudentID: i + 1,
// 		Score: (Math.random() * 100) | 0
// 	};
// }
// jsoop.pushExamResults(arr);
