function Person(fname , lname , age) {
	this.fname = fname;
	this.lname = lname;
	this.age = age;
}

Object.defineProperty(Person.prototype , 'fname' , {
	get: function() {
		return this._fname;
	} ,
	set: function(value) {
		this._fname = value;
		return this;
	} ,
	enumerable: true
});

Object.defineProperty(Person.prototype , 'fullName', {
	get: function() {
		return this._fname + ' ' + this.lname;
	},
});

var pich1 = new Person('Juan' , 'Carlos' , 15),
	prop;

console.log(pich1.fullName);

function Student(fname , lname , age , grade) {
	Person.call(this, fname, lname, age);
	this.grade = grade;
}

Student.prototype = Person.prototype; // No fullName without this

var stud1 = new Student('Dragan' , 'Mitkov' , 15 , 5.50);
console.log(stud1);
console.log(stud1.fullName);