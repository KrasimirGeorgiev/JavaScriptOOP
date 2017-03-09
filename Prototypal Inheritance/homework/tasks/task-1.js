/* Task Description */
/*
* Create an object domElement, that has the following properties and methods:
  * use prototypal inheritance, without function constructors
  * method init() that gets the domElement type
    * i.e. `Object.create(domElement).init('div')`
  * property type that is the type of the domElement
    * a valid type is any non-empty string that contains only Latin letters and digits
  * property innerHTML of type string
    * gets the domElement, parsed as valid HTML
      * <type attr1="value1" attr2="value2" ...> .. content / children's.innerHTML .. </type>
  * property content of type string
    * sets the content of the element
    * works only if there are no children
  * property attributes
    * each attribute has name and value
    * a valid attribute has a non-empty string for a name that contains only Latin letters and digits or dashes (-)
  * property children
    * each child is a domElement or a string
  * property parent
    * parent is a domElement
  * method appendChild(domElement / string)
    * appends to the end of children list
  * method addAttribute(name, value)
    * throw Error if type is not valid
  * method removeAttribute(attribute)
    * throw Error if attribute does not exist in the domElement
*/


/* Example

var meta = Object.create(domElement)
	.init('meta')
	.addAttribute('charset', 'utf-8');

var head = Object.create(domElement)
	.init('head')
	.appendChild(meta)

var div = Object.create(domElement)
	.init('div')
	.addAttribute('style', 'font-size: 42px');

div.content = 'Hello, world!';

var body = Object.create(domElement)
	.init('body')
	.appendChild(div)
	.addAttribute('id', 'cuki')
	.addAttribute('bgcolor', '#012345');

var root = Object.create(domElement)
	.init('html')
	.appendChild(head)
	.appendChild(body);

console.log(root.innerHTML);
Outputs:
<html><head><meta charset="utf-8"></meta></head><body bgcolor="#012345" id="cuki"><div style="font-size: 42px">Hello, world!</div></body></html>
*/


function solve() {

	var domElement = (function () {

		function getChildrenInnerHTML(element) {

			if (!element.children) {
				return '';
			}

			var children = element.children,
				i,
				len,
				childHTML = '',
				childrenHTML = '';

			for (i = 0, len = children.length; i < len; i += 1) {

				if (children[i].innerHTML) {

					// if child is an object
					childHTML = children[i].innerHTML;

				} else {

					// if child is a string
					childHTML = children[i];
				}

				childrenHTML += childHTML;
			}

			return childrenHTML;
		}

		function parseAttributes(attributes) {

			var orderedNames = [],
				attr,
				i,
				len,
				parsed = '';

			orderedNames = orderAttributes(attributes);

			for(i = 0, len = orderedNames.length; i < len; i += 1) {

				parsed += orderedNames[i]
				 	+ '=' + '"' + attributes[orderedNames[i]] + '" ';
			}

			return parsed;
		}

		function orderAttributes(attributes) {

			var attr,
				keys = [];

			for (attr in attributes) {
				if (attributes.hasOwnProperty(attr)) {
					keys.push(attr);
				}
			}

			return keys.sort();
		}

		var domElement = {

			init: function(type) {

				if (!type || (typeof(type) !== 'string') || (/[^\w]/.test(type) )) {

					//type is empty || type isn't a string || test returns true if type contains characters other than /\w/
					throw new Error('Invalid domElement name: use only Latin characters and/or digits. No empty strings!');
				}

				this.type = type;
				this.attributes = {};
				this.children = [];
				this.parent;

				return this;
			},

			appendChild: function(child) {

				child.parent = this;
				this.children.push(child);

				return this;
			},

			addAttribute: function(name, value) {

				if (!name || (typeof(name) !== 'string') || (/[^\w-]/.test(name) )) {

					//name is empty || name isn't a string || test returns true if name contains characters other than /\w/
					throw new Error('Invalid attribute name: use only Latin characters and/or digits and dashes. No empty strings! ')
				}
				if (!value) {

					//if no value do something
					value = '';
				}

				this.attributes[name] = value;

				return this;
			},

			removeAttribute: function(name) {

				if (name in this.attributes) {

					delete this.attributes[name];

				} else {

					throw new Error('No such attribute!');
				}

				return this;
			},

      		get innerHTML() {

				var content,
					tagOpen,
					attributes,
					childrenHTML,
					tagClose;

				attributes = parseAttributes(this.attributes);

				if (this.children.length > 0) {

					childrenHTML = getChildrenInnerHTML(this);

				} else {

					childrenHTML = '';
				}

				content = this.content || childrenHTML;
				tagOpen = '<' + (this.type + ' ' + attributes).trim() + '>';
				tagClose = '</' + this.type + '>';

				return tagOpen + content + tagClose;
      		},

			set content(val) {

				if (this.children.length > 0) {

					// if current element has children it's content is empty no metter what;
					this._content = '';

				} else {

					this._content = val;
				}
			},
			get content() {

				return this._content || '';
			}
		};

		return domElement;
	} ());

	return domElement;
}

module.exports = solve;

// var domElement = solve();
//
// var meta = Object.create(domElement)
// 	.init('meta')
// 	.addAttribute('charset', 'utf-8');
//
// var head = Object.create(domElement)
// 	.init('head')
// 	.appendChild(meta)
//
// var div = Object.create(domElement)
// 	.init('div')
// 	.addAttribute('style', 'font-size: 42px');
//
// div.content = 'Hello, world!';
//
// var body = Object.create(domElement)
// 	.init('body')
// 	.appendChild(div)
// 	.addAttribute('id', 'myid')
// 	.addAttribute('bgcolor', '#012345');
//
// var root = Object.create(domElement)
// 	.init('html')
// 	.appendChild(head)
// 	.appendChild(body);
//
// console.log(root.innerHTML);
