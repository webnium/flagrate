/*jshint laxcomma: true */
/*jslint browser:true, vars:true, plusplus:true, nomen:true, continue:true, white:true */
/*global HTMLElement, Event */
/*!
 * Flagrate
 *
 * Copyright (c) 2013 Webnium and Flagrate Contributors
 * Licensed under the MIT-License.
 *
 * https://flagrate.org/
 * https://github.com/webnium/flagrate
**/
(function () {
	
	"use strict";
	
	// flagrate global scope
	if (window.flagrate !== void 0) {
		throw new Error('[conflict] flagrate is already defined.');
	}
	
	var flagrate = window.flagrate = {};
	
	flagrate.className = 'flagrate';
	
	var identity = flagrate.identity = function (a) {
		return a;
	};
	
	// extend object
	var extendObject = flagrate.extendObject = function (b, a) {
		/*jslint forin:true */
		var k;
		for (k in a) { b[k] = a[k]; }
		return b;
	};
	
	// empty function
	var emptyFunction = flagrate.emptyFunction = function () {};
	
	// is element
	var isElement;
	if (typeof window.HTMLElement === 'object') {
		isElement = function (a) {
			return a instanceof window.HTMLElement;
		};
	} else {
		isElement = function (a) {
			return a && typeof a === "object" && a !== null && a.nodeType === 1 && typeof a.nodeName === "string";
		};
	}
	
	// jsonpointer
	// ref: node-jsonpointer https://github.com/janl/node-jsonpointer
	// ref: http://tools.ietf.org/html/draft-ietf-appsawg-json-pointer-08
	var jsonPointer = flagrate.jsonPointer = {
		untilde: function (str) {
			return str.replace(/~[01]/g, function (m) {
				switch (m) {
				case "~0":
					return "~";
				case "~1":
					return "/";
				}
				throw new Error("Invalid tilde escape: " + m);
			});
		},
		traverse: function (obj, pointer, value, isSet) {
			var part = jsonPointer.untilde(pointer.shift());
			
			if (pointer.length !== 0) {// keep traversin!
				if (isSet && typeof obj[part] !== 'object') {
					obj[part] = {};
				}
				return jsonPointer.traverse(obj[part], pointer, value, isSet);
			}
			// we're done
			if (value === void 0) {
				// just reading
				return obj[part];
			}
			// set new value, and return
			if (value === null) {
				delete obj[part];
			} else {
				obj[part] = value;
			}
			return value;
		},
		validate_input: function (obj, pointer) {
			if (typeof obj !== "object") {
				throw new Error("Invalid input object.");
			}
			
			if (pointer === "") {
				return [];
			}
			
			if (!pointer) {
				throw new Error("Invalid JSON pointer.");
			}
			
			pointer = pointer.split("/");
			var first = pointer.shift();
			if (first !== "") {
				throw new Error("Invalid JSON pointer.");
			}
			
			return pointer;
		},
		get: function (obj, pointer) {
			pointer = jsonPointer.validate_input(obj, pointer);
			if (pointer.length === 0) {
				return obj;
			}
			return jsonPointer.traverse(obj, pointer);
		},
		set: function (obj, pointer, value) {
			if (pointer === '' && typeof value === 'object') {
				flagrate.extendObject(obj, value);
				return value;
			} else {
				pointer = jsonPointer.validate_input(obj, pointer);
				if (pointer.length === 0) {
					throw new Error("Invalid JSON pointer for set.");
				}
				return jsonPointer.traverse(obj, pointer, value, true);
			}
		}
	};
	
	/*?
	 *  class flagrate.Element
	 *  
	 *  The flagrate.Element object provides a variety of powerful DOM methods for interacting
	 *   with DOM elements.
	 *  
	 *  #### Example
	 *  
	 *      var preview = flagrate.createElement().insertTo(x);
	 *      preview.on('updated', function (e) {
	 *        console.log('fired custom event', e);
	 *      });
	 *      
	 *      var input = flagrate.createTextInput().insertTo(x);
	 *      input.on('change', function () {
	 *        preview.updateText(input.value);
	 *        preview.fire('updated');
	 *      });
	 *  
	 *  #### Inheritance
	 *  
	 *  * [HTMLElement](https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement) (MDN)
	**/
	
	/*?
	 *  flagrate.createElement([tagName = "div", attribute])
	 *  new flagrate.Element([tagName = "div", attribute])
	 *  - tagName (String) - The name of the HTML element to create.
	 *  - attribute (Object) - An optional group of attribute/value pairs to set on the element.
	 *  
	 *  Creates an HTML element with `tagName` as the tag name, optionally with the given attributes.
	 *  
	 *  #### Example
	 *  
	 *      // The old way:
	 *      var a = document.createElement('a');
	 *      a.setAttribute('class', 'foo');
	 *      a.setAttribute('href', '/foo.html');
	 *      a.appendChild(document.createTextNode("Next page"));
	 *      x.appendChild(a);
	 *      
	 *      // The new way:
	 *      var a = flagrate.createElement('a', { 'class': 'foo', href: '/foo.html' }).insert("Next page").insertTo(x);
	**/
	var Element = flagrate.Element = function (tagName, attr) {
		
		tagName = tagName || 'div';
		attr    = attr    || null;
		
		tagName = tagName.toLowerCase();
		
		var node;
		
		if (Element.cache[tagName]) {
			node = Element.cache[tagName].cloneNode(false);
		} else if ((attr !== null && attr.hasOwnProperty('type')) || tagName === 'select') {
			node = document.createElement(tagName);
		} else {
			node = document.createElement(tagName);
			Element.cache[tagName] = node.cloneNode(false);
		}
		
		extendObject(node, this);
		
		return attr === null ? node : Element.writeAttribute(node, attr);
	};
	
	flagrate.createElement = function (a, b) {
		return new Element(a, b);
	};
	
	Element.cache = {};
	
	Element.prototype = {
		isFlagrated: true,
		
		/*?
		 *  flagrate.Element#visible() -> Boolean
		 *
		 *  please refer to flagrate.Element.visible
		**/
		visible: function () {
			return Element.visible(this);
		},
		
		/*?
		 *  flagrate.Element#exists() -> Boolean
		 *
		 *  please refer to flagrate.Element.exists
		**/
		exists: function () {
			return Element.exists(this);
		},
		
		/*?
		 *  flagrate.Element#toggle() -> flagrate.Element
		 *
		 *  please refer to flagrate.Element.toggle
		**/
		toggle: function () {
			return Element.toggle(this);
		},
		
		/*?
		 *  flagrate.Element#hide() -> flagrate.Element
		 *
		 *  please refer to flagrate.Element.hide
		**/
		hide: function () {
			return Element.hide(this);
		},
		
		/*?
		 *  flagrate.Element#show() -> flagrate.Element
		 *
		 *  please refer to flagrate.Element.show
		**/
		show: function () {
			return Element.show(this);
		},
		
		/*?
		 *  flagrate.Element#remove() -> flagrate.Element
		 *
		 *  please refer to flagrate.Element.remove
		**/
		remove: function () {
			return Element.remove(this);
		},
		
		/*?
		 *  flagrate.Element#update([newContent]) -> flagrate.Element
		 *
		 *  please refer to flagrate.Element.update
		**/
		update: function (content) {
			return Element.update(this, content);
		},
		
		/*?
		 *  flagrate.Element#updateText([newContent]) -> flagrate.Element
		 *
		 *  please refer to flagrate.Element.updateText
		**/
		updateText: function (text) {
			return Element.updateText(this, text);
		},
		
		/*?
		 *  flagrate.Element#insert(content) -> flagrate.Element
		 *
		 *  please refer to flagrate.Element.insert
		**/
		insert: function (content) {
			return Element.insert(this, content);
		},
		
		/*?
		 *  flagrate.Element#insertText(content) -> flagrate.Element
		 *
		 *  please refer to flagrate.Element.insertText
		**/
		insertText: function (text) {
			return Element.insertText(this, text);
		},
		
		/*?
		 *  flagrate.Element#insertTo(element[, position = "bottom"]) -> flagrate.Element
		 *
		 *  please refer to flagrate.Element.insertTo
		**/
		insertTo: function (element, pos) {
			return Element.insertTo(this, element, pos);
		},
		
		/*?
		 *  flagrate.Element#readAttribute(attributeName) -> flagrate.Element
		 *
		 *  please refer to flagrate.Element.readAttribute
		**/
		readAttribute: function (name) {
			return Element.readAttribute(this, name);
		},
		
		/*?
		 *  flagrate.Element#writeAttribute(attribute[, value = true]) -> flagrate.Element
		 *
		 *  please refer to flagrate.Element.writeAttribute
		**/
		writeAttribute: function (name, value) {
			return Element.writeAttribute(this, name, value);
		},
		
		/*?
		 *  flagrate.Element#getDimensions() -> Object
		 *
		 *  please refer to flagrate.Element.getDimensions
		**/
		getDimensions: function () {
			return Element.getDimensions(this);
		},
		
		/*?
		 *  flagrate.Element#getHeight() -> Number
		 *
		 *  please refer to flagrate.Element.getHeight
		**/
		getHeight: function () {
			return Element.getHeight(this);
		},
		
		/*?
		 *  flagrate.Element#getWidth() -> Number
		 *
		 *  please refer to flagrate.Element.getWidth
		**/
		getWidth: function () {
			return Element.getWidth(this);
		},
		
		/*?
		 *  flagrate.Element#cumulativeOffset() -> Object
		 *
		 *  please refer to flagrate.Element.cumulativeOffset
		**/
		cumulativeOffset: function () {
			return Element.cumulativeOffset(this);
		},
		
		/*?
		 *  flagrate.Element#cumulativeScrollOffset() -> Object
		 *
		 *  please refer to flagrate.Element.cumulativeScrollOffset
		**/
		cumulativeScrollOffset: function () {
			return Element.cumulativeScrollOffset(this);
		},
		
		/*?
		 *  flagrate.Element#hasClassName(className) -> Boolean
		 *
		 *  please refer to flagrate.Element.hasClassName
		**/
		hasClassName: function (className) {
			return Element.hasClassName(this, className);
		},
		
		/*?
		 *  flagrate.Element#addClassName(className) -> flagrate.Element
		 *
		 *  please refer to flagrate.Element.addClassName
		**/
		addClassName: function (className) {
			return Element.addClassName(this, className);
		},
		
		/*?
		 *  flagrate.Element#removeClassName(className) -> flagrate.Element
		 *
		 *  please refer to flagrate.Element.removeClassName
		**/
		removeClassName: function (className) {
			return Element.removeClassName(this, className);
		},
		
		/*?
		 *  flagrate.Element#toggleClassName(className) -> flagrate.Element
		 *
		 *  please refer to flagrate.Element.toggleClassName
		**/
		toggleClassName: function (className) {
			return Element.toggleClassName(this, className);
		},
		
		/*?
		 *  flagrate.Element#getStyle(propertyName) -> String | Number | null
		 *
		 *  please refer to flagrate.Element.getStyle
		**/
		getStyle: function (propertyName) {
			return Element.getStyle(this, propertyName);
		},
		
		/*?
		 *  flagrate.Element#setStyle(style) -> flagrate.Element
		 *
		 *  please refer to flagrate.Element.setStyle
		**/
		setStyle: function (style) {
			return Element.setStyle(this, style);
		},
		
		/*?
		 *  flagrate.Element#on(eventName, listener[, useCapture = false]) -> flagrate.Element
		 *
		 *  please refer to flagrate.Element.on
		**/
		on: function (name, listener, useCapture) {
			return Element.on(this, name, listener, useCapture);
		},
		
		/*?
		 *  flagrate.Element#off(eventName, listener[, useCapture = false]) -> flagrate.Element
		 *
		 *  please refer to flagrate.Element.off
		**/
		off: function (name, listener, useCapture) {
			return Element.off(this, name, listener, useCapture);
		},
		
		/*?
		 *  flagrate.Element#fire(eventName[, property]) -> flagrate.Element
		 *
		 *  please refer to flagrate.Element.fire
		**/
		fire: function (name, property) {
			return Element.fire(this, name, property);
		}
	};
	
	/*?
	 *  flagrate.Element#emit(eventName[, property]) -> flagrate.Element
	 *  Alias of: flagrate.Element#fire
	**/
	Element.prototype.emit = Element.prototype.fire;
	
	/*?
	 *  flagrate.Element.visible(element) -> Boolean
	 *  - element (Element) - instance of Element.
	 *  
	 *  Tells whether `element` is visible
	 *  
	 *  This method is similar to http://api.prototypejs.org/dom/Element/visible/
	**/
	Element.visible = function (element) {
		
		return element.style.display !== 'none';
	};
	
	/*?
	 *  flagrate.Element.exists(element) -> Boolean
	 *  - element (Element) - instance of Element.
	 *  
	 *  Tells whether `element` is exists on document.
	**/
	Element.exists = function (element) {
		
		if (element.parentNode) {
			while ((element = element.parentNode) !== null) {
				if (element === document) {
					return true;
				}
			}
		}
		
		return false;
	};
	
	/*?
	 *  flagrate.Element.toggle(element) -> Element
	 *  - element (Element) - instance of Element.
	 *  
	 *  Toggles the visibility of `element`. Returns `element`.
	 *  
	 *  This method is similar to http://api.prototypejs.org/dom/Element/toggle/
	**/
	Element.toggle = function (element) {
		
		return Element[Element.visible(element) ? 'hide' : 'show'](element);
	};
	
	/*?
	 *  flagrate.Element.hide(element) -> Element
	 *  - element (Element) - instance of Element.
	 *  
	 *  Sets `display: none` on `element`. Returns `element`.
	 *  
	 *  This method is similar to http://api.prototypejs.org/dom/Element/hide/
	**/
	Element.hide = function (element) {
		
		element.style.display = 'none';
		return element;
	};
	
	/*?
	 *  flagrate.Element.show(element) -> Element
	 *  - element (Element) - instance of Element.
	 *  
	 *  Removes `display: none` on `element`. Returns `element`.
	 *  
	 *  This method is similar to http://api.prototypejs.org/dom/Element/show/
	**/
	Element.show = function (element) {
		
		element.style.display = '';
		return element;
	};
	
	/*?
	 *  flagrate.Element.remove(element) -> Element
	 *  - element (Element) - instance of Element.
	 *  
	 *  Completely removes `element` from the document and returns it.
	 *  
	 *  This method is similar to http://api.prototypejs.org/dom/Element/remove/
	**/
	Element.remove = function (element) {
		
		if (element.parentNode) { element.parentNode.removeChild(element); }
		return element;
	};
	
	/*?
	 *  flagrate.Element.update(element[, newContent]) -> Element
	 *  - element (Element) - instance of Element.
	 *  - newContent (String|Number|Element) - new content.
	 *  
	 *  Replaces _the content_ of `element` with the `newContent` argument and
	 *  returns `element`.
	 *  
	 *  This method is similar to http://api.prototypejs.org/dom/Element/update/
	**/
	Element.update = function (element, content) {
		
		var i = element.childNodes.length;
		while (i--) { flagrate.Element.remove(element.childNodes[i]); }
		
		if (!content) {
			return element;
		}
		
		if (isElement(content) === true) {
			element.appendChild(content);
			return element;
		}
		
		if (typeof content !== 'string') {
			content = content.toString(10);
		}
		
		element.innerHTML = content;
		
		return element;
	};
	
	/*?
	 *  flagrate.Element.updateText(element[, newContent]) -> Element
	 *  - element (Element) - instance of Element.
	 *  - newContent (String|Number) - new text content.
	**/
	Element.updateText = function (element, content) {
		
		var i = element.childNodes.length;
		while (i--) { flagrate.Element.remove(element.childNodes[i]); }
		
		if (!content) {
			return element;
		}
		
		if (isElement(content) === true && (content.toString !== void 0)) {
			return Element.updateText(element, content.toString());
		}
		
		if (typeof content !== 'string') {
			content = content.toString(10);
		}
		
		element.appendChild(document.createTextNode(content));
		
		return element;
	};
	
	/*?
	 *  flagrate.Element.insert(element, content) -> Element
	 *  - element (Element) - instance of Element.
	 *  - content (String|Element|Object) - The content to insert
	 *  
	 *  Inserts content `above`, `below`, at the `top`, and/or at the `bottom` of
	 *  the given element, depending on the option(s) given.
	 *  
	 *  This method is similar to http://api.prototypejs.org/dom/Element/insert/
	**/
	Element.insert = function (element, insertion) {
		
		if (typeof insertion === 'string' || typeof insertion === 'number' || isElement(insertion) === true) {
			insertion = { bottom: insertion };
		}
		
		var position, content, insert, div;
		for (position in insertion) {
			if (insertion.hasOwnProperty(position)) {
				content  = insertion[position];
				position = position.toLowerCase();
				insert   = Element._insertionTranslation[position];
				
				if (isElement(content) === true) {
					insert(element, content);
					continue;
				}
				
				if (typeof content !== 'string') { content = content.toString(10); }
				
				div = new Element();
				div.innerHTML = content;
				if (position === 'top' || position === 'after') { div.childNodes.reverse(); }
				while (div.childNodes.length !== 0) {
					insert(element, div.childNodes[0]);
				}
			}
		}
		
		return element;
	};
	
	/*?
	 *  flagrate.Element.insertText(element, content) -> Element
	 *  - element (Element) - instance of Element.
	 *  - content (String|Number|Object) - The content to insert
	 *  
	 *  Inserts content `above`, `below`, at the `top`, and/or at the `bottom` of
	 *  the given element, depending on the option(s) given.
	**/
	Element.insertText = function (element, insertion) {
		
		if (typeof insertion === 'string' || typeof insertion === 'number') {
			insertion = { bottom: insertion };
		}
		
		var position, content, insert;
		for (position in insertion) {
			if (insertion.hasOwnProperty(position)) {
				content  = insertion[position];
				position = position.toLowerCase();
				insert   = Element._insertionTranslation[position];
				
				if (typeof content !== 'string') { content = content.toString(10); }
				
				insert(element, document.createTextNode(content));
			}
		}
		
		return element;
	};
	
	/*?
	 *  flagrate.Element.insertTo(element, to[, position = "bottom"]) -> Element
	 *  - element (Element) - insert this.
	 *  - to (Element) - insert to this element.
	 *  - position (String) - `before` or `top` or `bottom` or `after`.
	**/
	Element.insertTo = function (element, to, pos) {
		
		var insertion = {};
		
		if (pos) {
			insertion[pos] = element;
		} else {
			insertion.bottom = element;
		}
		
		Element.insert(to, insertion);
		
		return element;
	};
	
	/*?
	 *  flagrate.Element.wrap(element, wrapper[, attribute]) -> Element
	 *  - element (Element) - 
	 *  - wrapper (Element|String) - An element to wrap `element` inside, or else a string representing the tag name of an element to be created.
	 *  - attribute (Object) - A set of attributes to apply to the wrapper element. Refer to the flagrate.Element constructor for usage.
	 *  
	 *  Wraps an element inside another, then returns the wrapper.
	 *  
	 *  This method is similar to http://api.prototypejs.org/dom/Element/wrap/
	**/
	Element.wrap = function (element, wrapper, attr) {
		
		if (isElement(wrapper) === true) {
			if (attr) { Element.writeAttribute(wrapper, attr); }
		} else if (typeof wrapper === 'string') {
			wrapper = new Element(wrapper, attr);
		} else {
			wrapper = new Element('div', wrapper);
		}
		
		if (element.parentNode) { element.parentNode.replaceChild(wrapper, element); }
		
		wrapper.appendChild(element);
		
		return wrapper;
	};
	
	/*?
	 *  flagrate.Element.readAttribute(element, attributeName) -> String | null
	 *  - element (Element) - instance of Element.
	 *  - attributeName (String) - attribute name.
	 *  
	 *  Returns the value of `element`'s `attribute` or `null` if `attribute` has
	 *  not been specified.
	 *  
	 *  This method is similar to http://api.prototypejs.org/dom/Element/readAttribute/
	**/
	Element.readAttribute = function (element, name) {
		
		// ref: https://github.com/sstephenson/prototype/blob/1fb9728/src/dom/dom.js#L1856
		
		return element.getAttribute(name);
	};
	
	/*?
	 *  flagrate.Element.writeAttribute(element, attribute[, value = true]) -> Element
	 *  - element (Element) - instance of Element.
	 *  - attribute (String|Object) - attribute name or name/value pairs object.
	 *  - value (Boolean|String) - value of attribute.
	 *  
	 *  Adds, specifies or removes attributes passed as either a hash or a name/value pair.
	 *  
	 *  This method is similar to http://api.prototypejs.org/dom/Element/writeAttribute/
	**/
	Element.writeAttribute = function (element, name, value) {
		
		var attr = {};
		
		if (typeof name === 'object') {
			attr = name;
		} else {
			attr[name] = (value === void 0) ? true : value;
		}
		
		var k;
		for (k in attr) {
			if (attr.hasOwnProperty(k)) {
				value = attr[k];
				if (value === false || value === null) {
					element.removeAttribute(k);
				} else if (value === true) {
					element.setAttribute(k, k);
				} else if (value !== void 0) {
					element.setAttribute(k, value);
				}
			}
		}
		
		return element;
	};
	
	/*?
	 *  flagrate.Element.getDimensions(element) -> Object
	 *  - element (Element) - instance of Element.
	 *  
	 *  Finds the computed width and height of `element` and returns them as
	 *  key/value pairs of an object.
	 *  
	 *  This method is similar to http://api.prototypejs.org/dom/Element/getDimensions/
	**/
	Element.getDimensions = function (element) {
		
		var display = Element.getStyle(element, 'display');
		
		if (display && display !== 'none') {
			return { width: element.offsetWidth, height: element.offsetHeight };
		}
		
		var before = {
			visibility: element.style.visibility,
			position  : element.style.position,
			display   : element.style.display
		};
		
		var after = {
			visibility: 'hidden',
			display   : 'block'
		};
		
		// Switching `fixed` to `absolute` causes issues in Safari.
		if (before.position !== 'fixed') { after.position = 'absolute'; }
		
		Element.setStyle(element, after);
		
		var dimensions = {
			width:  element.offsetWidth,
			height: element.offsetHeight
		};
		
		Element.setStyle(element, before);
		
		return dimensions;
	};
	
	/*?
	 *  flagrate.Element.getHeight(element) -> Number
	 *  - element (Element) - instance of Element.
	 *  
	 *  This method is similar to http://api.prototypejs.org/dom/Element/getHeight/
	**/
	Element.getHeight = function (element) {
		
		return Element.getDimensions(element).height;
	};
	
	/*?
	 *  flagrate.Element.getWidth(element) -> Number
	 *  - element (Element) - instance of Element.
	 *  
	 *  This method is similar to http://api.prototypejs.org/dom/Element/getWidth/
	**/
	Element.getWidth = function (element) {
		
		return Element.getDimensions(element).width;
	};
	
	/*?
	 *  flagrate.Element.cumulativeOffset(element) -> Object
	 *  - element (Element) - instance of Element.
	 *  
	 *  This method is similar to http://api.prototypejs.org/dom/Element/cumulativeOffset/
	**/
	Element.cumulativeOffset = function (element) {
		
		var t = 0, l = 0;
		if (element.parentNode) {
			do {
				t      += element.offsetTop  || 0;
				l      += element.offsetLeft || 0;
				element = element.offsetParent;
			} while (element);
		}
		
		var offset = {
			top : t,
			left: l
		};
		
		return offset;
	};
	
	/*?
	 *  flagrate.Element.cumulativeScrollOffset(element) -> Object
	 *  - element (Element) - instance of Element.
	 *  
	 *  This method is similar to http://api.prototypejs.org/dom/Element/cumulativeScrollOffset/
	**/
	Element.cumulativeScrollOffset = function (element) {
		
		var t = 0, l = 0;
		do {
			t += element.scrollTop  || 0;
			l += element.scrollLeft || 0;
			// for Chrome
			if (element.parentNode === document.body && document.documentElement.scrollTop !== 0) {
				element = document.documentElement;
			} else {
				element = element.parentNode;
			}
		} while (element);
		
		var offset = {
			top : t,
			left: l
		};
		
		return offset;
	};
	
	/*?
	 *  flagrate.Element.hasClassName(element, className) -> Boolean
	 *  - element (Element) - instance of Element.
	 *  - className (String) - 
	 *  
	 *  This method is similar to http://api.prototypejs.org/dom/Element/hasClassName/
	**/
	Element.hasClassName = function (element, className) {
		
		return (element.className.length > 0 && (element.className === className || new RegExp('(^|\\s)' + className + '(\\s|$)').test(element.className)));
	};
	
	/*?
	 *  flagrate.Element.addClassName(element, className) -> Boolean
	 *  - element (Element) - instance of Element.
	 *  - className (String) - The class name to add.
	 *  
	 *  This method is similar to http://api.prototypejs.org/dom/Element/addClassName/
	**/
	Element.addClassName = function (element, className) {
		
		if (!Element.hasClassName(element, className)) {
			element.className += (element.className ? ' ' : '') + className;
		}
		
		return element;
	};
	
	/*?
	 *  flagrate.Element.removeClassName(element, className) -> Boolean
	 *  - element (Element) - instance of Element.
	 *  - className (String) -
	 *  
	 *  This method is similar to http://api.prototypejs.org/dom/Element/removeClassName/
	**/
	Element.removeClassName = function (element, className) {
		
		element.className = element.className.replace(
			new RegExp('(^|\\s+)' + className + '(\\s+|$)'), ' '
		).trim();
		
		return element;
	};
	
	/*?
	 *  flagrate.Element.toggleClassName(element, className) -> Boolean
	 *  - element (Element) - instance of Element.
	 *  - className (String) -
	 *  
	 *  This method is similar to http://api.prototypejs.org/dom/Element/toggleClassName/
	**/
	Element.toggleClassName = function (element, className) {
		
		return Element[Element.hasClassName(element, className) ? 'removeClassName' : 'addClassName'](element, className);
	};
	
	/*?
	 *  flagrate.Element.getStyle(element, propertyName) -> String | Number | null
	 *  - element (Element) - instance of Element.
	 *  - propertyName (String) - The property name of style to be retrieved.
	 *  
	 *  This method is similar to http://api.prototypejs.org/dom/Element/getStyle/
	**/
	Element.getStyle = function (element, style) {
		
		style = style === 'float' ? 'cssFloat' : style.replace(/-+([a-z])?/g, function (m, s) { return s ? s.toUpperCase() : ''; });
		
		var value = element.style[style];
		if (!value || value === 'auto') {
			var css = document.defaultView.getComputedStyle(element, null);
			value = css && (css[style] !== void 0) && css[style] !== "" ? css[style] : null;
		}
		
		if (style === 'opacity') { return value ? parseFloat(value) : 1.0; }
		
		return value === 'auto' ? null : value;
	};
	
	/*?
	 *  flagrate.Element.setStyle(element, style) -> Element
	 *  - element (Element) - instance of Element.
	 *  - style (Object) -
	 *  
	 *  This method is similar to http://api.prototypejs.org/dom/Element/setStyle/
	**/
	Element.setStyle = function (element, style) {
		
		var p;
		for (p in style) {
			if (style.hasOwnProperty(p)) {
				element.style[(p === 'float' || p === 'cssFloat') ? ((element.style.styleFloat === void 0) ? 'cssFloat' : 'styleFloat') : p] = style[p];
			}
		}
		
		return element;
	};
	
	/*?
	 *  flagrate.Element.on(element, eventName, listener[, useCapture = false]) -> Element
	 *  - element (Element) - instance of Element.
	 *  - eventName (String) - name of event.
	 *  - listener (Function) - The function to call when the event occurs.
	 *  - useCapture (Boolean) -
	 *  
	 *  Registers an event handler on a DOM element.
	**/
	Element.on = function (element, name, listener, useCapture) {
		
		element.addEventListener(name, listener, useCapture || false);
		
		return element;
	};
	
	/*?
	 *  flagrate.Element.off(element, eventName, listener[, useCapture = false]) -> Element
	 *  - element (Element) - instance of Element.
	 *  - eventName (String) - name of event.
	 *  - listener (Function) - The function to call when the event occurs.
	 *  - useCapture (Boolean) -
	 *  
	 *  Registers an event handler on a DOM element.
	**/
	Element.off = function (element, name, listener, useCapture) {
		
		element.removeEventListener(name, listener, useCapture || false);
		
		return element;
	};
	
	/*?
	 *  flagrate.Element.fire(element, eventName[, property]) -> Element
	 *  - element (Element) - instance of Element.
	 *  - eventName (String) - name of event.
	 *  - property (Object) -
	 *  
	 *  Fires a custom event.
	**/
	Element.fire = function (element, name, property) {
		
		var event = document.createEvent('HTMLEvents');
		event.initEvent(name, true, true);
		if (property) { extendObject(event, property); }
		element.dispatchEvent(event);
		
		return element;
	};
	
	/*?
	 *  flagrate.Element.emit(element, eventName[, property]) -> Element
	 *  Alias of: flagrate.Element.fire
	**/
	Element.emit = Element.fire;
	
	/*?
	 *  flagrate.Element.extend(element) -> flagrate.Element
	 *  - element (Element) - instance of Element.
	 *  
	 *  Extends the given `element` instance.
	 *  
	 *  **Caution**: This method will add flagrate.Element instance methods to given element instance.
	**/
	Element.extend = function (element) {
		
		if (element.isFlagrated) { return element; }
		
		extendObject(element, Element.prototype);
		
		return element;
	};
	
	// from https://github.com/sstephenson/prototype/blob/1fb9728/src/dom/dom.js#L3021-L3041
	Element._insertionTranslation = {
		before: function (element, node) {
			element.parentNode.insertBefore(node, element);
		},
		top: function (element, node) {
			element.insertBefore(node, element.firstChild);
		},
		bottom: function (element, node) {
			element.appendChild(node);
		},
		after: function (element, node) {
			element.parentNode.insertBefore(node, element.nextSibling);
		}
	};
	
	/*?
	 *  class flagrate.Button
	 *  
	 *  #### Example
	 *  
	 *      var button = flagrate.createButton({
	 *        label   : 'foo',
	 *        icon    : 'icon.png',
	 *        onSelect: function () {
	 *          alert('hey');
	 *        }
	 *      }).insertTo(x);
	 *  
	 *  #### Structure
	 *  
	 *      <button class="flagrate flagrate-button flagrate-icon" style="background-image: url(icon.png);">foo</button>
	 *
	 *  #### Event
	 *
	 *  * `select`:
	 *  
	 *  #### Inheritances
	 *  
	 *  * flagrate.Element
	 *  * [HTMLButtonElement](https://developer.mozilla.org/en-US/docs/Web/API/HTMLButtonElement) (MDN)
	**/
	
	/*?
	 *  flagrate.createButton(option)
	 *  new flagrate.Button(option)
	 *  - option (Object) - options.
	 *  
	 *  Button.
	 *  
	 *  #### option
	 *  
	 *  * `id`                       (String): `id` attribute of `button` element.
	 *  * `className`                (String):
	 *  * `attribute`                (Object):
	 *  * `style`                    (Object): (using flagrate.Element.setStyle)
	 *  * `color`                    (String): (using flagrate.Button#setColor)
	 *  * `label`                    (String; default `""`):
	 *  * `icon`                     (String):
	 *  * `isFocused`                (Boolean; default `false`):
	 *  * `isDisabled`               (Boolean; default `false`):
	 *  * `isRemovableByUser`        (Boolean; default `false`):
	 *  * `onSelect`                 (Function):
	 *  * `onRemove`                 (Function):
	**/
	var Button = flagrate.Button = function (opt) {
		
		opt = opt || {};
		
		opt.label             = opt.label             || '';
		opt.isRemovableByUser = opt.isRemovableByUser || false;
		
		this.onSelect = opt.onSelect || emptyFunction;
		this.onRemove = opt.onRemove || emptyFunction;
		
		var attr = opt.attribute || {};
		
		if (opt.id)        { attr.id = opt.id; }
		if (opt.isFocused) { attr.autofocus = true; }
		
		if (!attr.type)    { attr.type = 'button'; }
		
		//create
		var that = new Element('button', attr);
		extendObject(that, this);
		
		that._label = new Element('span').updateText(opt.label).insertTo(that);
		
		that.addClassName(flagrate.className + ' ' + flagrate.className + '-button');
		if (opt.className) { that.addClassName(opt.className); }
		
		that.on('click', that._onSelectHandler.bind(that), true);
		
		if (opt.isRemovableByUser) {
			that.addClassName(flagrate.className + '-button-removable');
			
			that._removeButton = new Element('button', {
				type   : 'button',
				'class': flagrate.className + '-button-remove'
			}).insertTo(that);
			that._removeButton.on('click', that._onRemoveHandler.bind(that), true);
		}
		
		if (opt.style) { that.setStyle(opt.style); }
		if (opt.color) { that.setColor(opt.color); }
		if (opt.icon)  { that.setIcon(opt.icon); }
		
		if (opt.isDisabled) { that.disable(); }
		
		return that;
	};
	
	flagrate.createButton = function (a) {
		return new Button(a);
	};
	
	Button.prototype = {
		/*?
		 *  flagrate.Button#select() -> flagrate.Button
		**/
		select: function () {
			return this._onSelectHandler(null);
		}
		,
		/*?
		 *  flagrate.Button#disable() -> flagrate.Button
		**/
		disable: function () {
			
			this.addClassName(flagrate.className + '-disabled');
			this.writeAttribute('disabled', true);
			
			return this;
		}
		,
		/*?
		 *  flagrate.Button#enable() -> flagrate.Button
		**/
		enable: function () {
			
			this.removeClassName(flagrate.className + '-disabled');
			this.writeAttribute('disabled', false);
			
			return this;
		}
		,
		/*?
		 *  flagrate.Button#isEnabled() -> Boolean
		**/
		isEnabled: function () {
			return !this.hasClassName(flagrate.className + '-disabled');
		}
		,
		/*?
		 *  flagrate.Button#setLabel(text) -> flagrate.Button
		 *  - text (String) - label string.
		**/
		setLabel: function (text) {
			
			this._label.updateText(text);
			
			return this;
		}
		,
		/*?
		 *  flagrate.Button#setColor(color) -> flagrate.Button
		 *  - color (String) - please see below.
		**/
		setColor: function (color) {
			
			if (color.charAt(0) === '@') {
				this.style.backgroundColor = '';
				this.addClassName(flagrate.className + '-button-color-' + color.slice(1));
			} else {
				this.style.backgroundColor = color;
			}
			
			return this;
		}
		,
		/*?
		 *  flagrate.Button#setIcon([url]) -> flagrate.Button
		 *  - url (String) - URL of icon image.
		**/
		setIcon: function (url) {
			
			if (url) {
				return this.addClassName(flagrate.className + '-icon').setStyle({
					backgroundImage: 'url(' + url + ')'
				});
			} else {
				return this.removeClassName(flagrate.className + '-icon').setStyle({
					backgroundImage: 'none'
				});
			}
		}
		,
		_onSelectHandler: function (e) {
			
			if (this.isEnabled() === false) { return; }
			
			//for Firefox
			if (this._removeButton && e && e.layerX) {
				var bw = this.getWidth();
				var bh = this.getHeight();
				var bp = this._removeButton.getStyle('margin-right') === null ? 0 : parseInt(this._removeButton.getStyle('margin-right').replace('px', ''), 10);
				var rw = this._removeButton.getWidth();
				var rh = this._removeButton.getHeight();
				var lx = e.layerX;
				var ly = e.layerY;
				
				if (
					lx > bw - bp - rw &&
					lx < bw - bp &&
					ly > bh - ((bh - rh) / 2) - rh &&
					ly < bh - ((bh - rh) / 2)
				) {
					this._onRemoveHandler(e);
					
					return this;
				}
			}
			
			e.targetButton = this;
			
			this.onSelect(e, this);
			this.fire('select', { targetButton: this });
		}
		,
		_onRemoveHandler: function (e) {
			
			if (this.isEnabled() && this.remove()) { this.onRemove(e); }
		}
	};
	
	/*?
	 *  class flagrate.Buttons
	 *  
	 *  #### Example
	 *  
	 *      var button = flagrate.createButtons({
	 *        items: [
	 *          { label: 'Left' },
	 *          { label: 'Middle' },
	 *          { label: 'Right' }
	 *        ]
	 *      }).insertTo(x);
	 *  
	 *  #### Structure
	 *  
	 *  <div class="example-container">
	 *    <div class="flagrate flagrate-buttons">
	 *      <button class="flagrate flagrate-button">Left</button><button class="flagrate flagrate-button">Middle</button><button class="flagrate flagrate-button">Right</button>
	 *    </div>
	 *  </div>
	 *  
	 *      <div class="flagrate flagrate-buttons">
	 *        <button class="flagrate flagrate-button">Left</button>
	 *        <button class="flagrate flagrate-button">Middle</button>
	 *        <button class="flagrate flagrate-button">Right</button>
	 *      </div>
	 *  
	 *  #### Inheritances
	 *  
	 *  * flagrate.Element
	 *  * [HTMLDivElement](https://developer.mozilla.org/en-US/docs/Web/API/HTMLDivElement) (MDN)
	**/
	
	/*?
	 *  flagrate.createButtons(option)
	 *  new flagrate.Buttons(option)
	 *  - option (Object) - options.
	 *  
	 *  Button group.
	 *  
	 *  #### option
	 *  
	 *  * `id`                       (String): `id` attribute of container element.
	 *  * `className`                (String):
	 *  * `attribute`                (Object):
	 *  * `items`                    (Array): of item
	 *  * `onSelect`                 (Function):
	 *  
	 *  #### item
	 *  
	 *  * `key`                      (String):
	 *  * `label`                    (String; default `""`):
	 *  * `icon`                     (String):
	 *  * `color`                    (String):
	 *  * `isDisabled`               (Boolean; default `false`):
	 *  * `onSelect`                 (Function):
	**/
	var Buttons = flagrate.Buttons = function (opt) {
		
		opt = opt || {};
		
		opt.items = opt.items || [];
		
		this.onSelect = opt.onSelect || emptyFunction;
		
		var attr = opt.attribute || {};
		
		attr.id       = opt.id;
		attr['class'] = opt.className;
		
		//create
		var that = new Element('div', attr);
		extendObject(that, this);
		
		that.addClassName(flagrate.className + ' ' + flagrate.className + '-buttons');
		
		var i, l;
		for (i = 0, l = opt.items.length; i < l; i++) {
			that.push(opt.items[i]);
		}
		
		that.on('click', function (e) {
			
			e.stopPropagation();
			e.preventDefault();
		});
		
		return that;
	};
	
	flagrate.createButtons = function (a) {
		return new Buttons(a);
	};
	
	Buttons.prototype = {
		/*?
		 *  flagrate.Buttons#push(item) -> flagrate.Buttons
		**/
		push: function (a) {
			
			var button = new Button(
				{
					icon      : a.icon,
					label     : a.label,
					isDisabled: a.isDisabled,
					color     : a.color,
					onSelect  : function (e) {
						
						if (a.onSelect) { a.onSelect(e); }
						this.onSelect(e);
					}.bind(this)
				}
			).insertTo(this);
			
			if (a.key) { button._key = a.key; }
			
			return this;
		}
		,
		/*?
		 *  flagrate.Buttons#getButtonByKey(key) -> flagrate.Button | null
		**/
		getButtonByKey: function (key) {
			
			var result = null;
			
			var elements = this.childNodes;
			var i, l;
			for (i = 0, l = elements.length; i < l; i++) {
				if (!elements[i]._key) { continue; }
				
				if (elements[i]._key === key) {
					result = elements[i];
					break;
				}
			}
			
			return result;
		}
		,
		/*?
		 *  flagrate.Buttons#getButtons() -> Array
		**/
		getButtons: function () {
			return this.childNodes || [];
		}
	};
	
	/*?
	 *  class flagrate.Menu
	 *  
	 *  #### Example
	 *
	 *      var menu = flagrate.createMenu({
	 *        items: [
	 *          {
	 *            label: 'foo'
	 *          },
	 *          {
	 *            label: 'bar',
	 *            icon : 'icon.png'
	 *          },
	 *          '--',
	 *          {
	 *            label: 'disabled button',
	 *            isDisabled: true
	 *          }
	 *        ]
	 *      }).insertTo(x);
	 *  
	 *  #### Structure
	 *  
	 *  <div class="example-container">
	 *    <div class="flagrate flagrate-menu">
	 *      <button class="flagrate flagrate-button">foo</button>
	 *      <button class="flagrate flagrate-button flagrate-icon" style="background-image: url(icon.png);">bar</button>
	 *      <hr>
	 *      <button class="flagrate flagrate-button flagrate-disabled" disabled="disabled">disabled button</button>
	 *    </div>
	 *  </div>
	 *  
	 *      <div class="flagrate flagrate-menu">
	 *        <button class="flagrate flagrate-button">foo</button>
	 *        <button class="flagrate flagrate-button flagrate-icon" style="background-image: url(icon.png);">bar</button>
	 *        <hr>
	 *        <button class="flagrate flagrate-button flagrate-disabled" disabled="disabled">disabled button</button>
	 *      </div>
	 *  
	 *  `button` elements are created with flagrate.Button
	 *  
	 *  #### Inheritances
	 *  
	 *  * flagrate.Element
	 *  * [HTMLDivElement](https://developer.mozilla.org/en-US/docs/Web/API/HTMLDivElement) (MDN)
	**/
	
	/*?
	 *  flagrate.createMenu(option)
	 *  new flagrate.Menu(option)
	 *  - option (Object) - options.
	 *  
	 *  Menu.
	 *  
	 *  #### option
	 *  
	 *  * `id`                       (String): `id` attribute of container element.
	 *  * `className`                (String):
	 *  * `attribute`                (Object):
	 *  * `items`                    (Array): of item
	 *  * `onSelect`                 (Function):
	 *  
	 *  #### item
	 *  
	 *  * `key`                      (String):
	 *  * `label`                    (String; default `""`):
	 *  * `icon`                     (String):
	 *  * `isDisabled`               (Boolean; default `false`):
	 *  * `onSelect`                 (Function):
	**/
	var Menu = flagrate.Menu = function (opt) {
		
		opt = opt || {};
		
		opt.items = opt.items    || [];
		
		this.onSelect = opt.onSelect || emptyFunction;
		
		var attr = opt.attribute || {};
		
		if (opt.id) { attr.id = opt.id; }
		
		//create
		var that = new Element('div', attr);
		extendObject(that, this);
		
		that.addClassName(flagrate.className + ' ' + flagrate.className + '-menu');
		if (opt.className) { that.addClassName(opt.className); }
		
		var i, l;
		for (i = 0, l = opt.items.length; i < l; i++) {
			that.push(opt.items[i]);
		}
		
		that.on('click', function (e) {
			
			e.stopPropagation();
			e.preventDefault();
		});
		
		that.on('mouseup', function (e) {
			
			e.stopPropagation();
		});
		
		return that;
	};
	
	flagrate.createMenu = function (a) {
		return new Menu(a);
	};
	
	Menu.prototype = {
		/*?
		 *  flagrate.Menu#push(item) -> flagrate.Menu
		**/
		push: function (a) {
			
			/*if (a instanceof Array) {
				//todo
			} else */if (typeof a === 'string') {
				new Element('hr').insertTo(this);
			} else {
				var button = new Button(
					{
						icon      : a.icon,
						label     : a.label,
						isDisabled: a.isDisabled,
						onSelect  : function (e) {
							
							if (a.onSelect) { a.onSelect(e); }
							this.onSelect(e);
						}.bind(this)
					}
				).insertTo(this);
				
				if (a.key) { button._key = a.key; }
			}
			
			return this;
		}
		,
		/*?
		 *  flagrate.Menu#getButtonByKey(key) -> flagrate.Button | null
		**/
		getButtonByKey: Buttons.prototype.getButtonByKey
		,
		/*?
		 *  flagrate.Menu#getButtons() -> Array
		**/
		getButtons: Buttons.prototype.getButtons
	};
	
	/*?
	 *  class flagrate.Pulldown
	 *  
	 *  #### Example
	 *
	 *      var menu = flagrate.createPulldown({
	 *        label: 'foo',
	 *        items: [
	 *          {
	 *            label: 'bar'
	 *          }
	 *        ]
	 *      }).insertTo(x);
	 *  
	 *  #### Structure
	 *  
	 *      <button class="flagrate flagrate-button flagrate-pulldown">
	 *        "foo"
	 *        <span class="flagrate-pulldown-triangle"></span>
	 *      </button>
	 *      <div class="flagrate-pulldown-menu flagrate flagrate-menu">
	 *        <button class="flagrate flagrate-button">bar</button>
	 *      </div>
	 *  
	 *  menu `div` are created with flagrate.Menu
	 *  
	 *  #### Inheritances
	 *  
	 *  * flagrate.Button
	 *  * [HTMLButtonElement](https://developer.mozilla.org/en-US/docs/Web/API/HTMLButtonElement) (MDN)
	**/
	
	/*?
	 *  flagrate.createPulldown(option)
	 *  new flagrate.Pulldown(option)
	 *  - option (Object) - options.
	 *  
	 *  Pulldown.
	 *  
	 *  #### option
	 *  
	 *  * `id`                       (String): `id` attribute of `button` element.
	 *  * `className`                (String):
	 *  * `attribute`                (Object):
	 *  * `style`                    (Object): (using flagrate.Element.setStyle)
	 *  * `items`                    (Array): of item (see: flagrate.Menu)
	 *  * `isDisabled`               (Boolean; default `false`):
	 *  * `onSelect`                 (Function):
	**/
	var Pulldown = flagrate.Pulldown = function (opt) {
		
		opt = opt || {};
		
		opt.label = opt.label || '';
		opt.items = opt.items || null;
		
		opt.onSelect = opt.onSelect || emptyFunction;
		
		var attr = opt.attribute || {};
		
		if (opt.id) { attr.id = opt.id; }
		
		//create
		var that = new Button({
			attribute: attr,
			label    : opt.label,
			icon     : opt.icon
		});
		extendObject(that, this);
		
		that.addClassName(flagrate.className + '-pulldown');
		if (opt.className) { that.addClassName(opt.className); }
		
		that.onSelect = function (e) {
			
			if (that._menu) {
				that._menu.remove();
				delete that._menu;
				return;
			}
			
			var menu = that._menu = new Menu(
				{
					className: flagrate.className + '-pulldown-menu',
					items    : opt.items,
					onSelect : function () {
						
						opt.onSelect();
						menu.remove();
						delete that._menu;
					}
				}
			);
			
			menu.style.top  = that.offsetTop + that.getHeight() + 'px';
			menu.style.left = that.offsetLeft + 'px';
			
			that.insert({ after: menu });
			
			// To prevent overflow.
			var menuHeight    = menu.getHeight();
			var menuMargin    = parseInt(menu.getStyle('margin-top').replace('px', ''), 10);
			var cummOffsetTop = that.cumulativeOffset().top;
			var	upsideSpace   = - window.pageYOffset + cummOffsetTop;
			var downsideSpace = window.pageYOffset + window.innerHeight - cummOffsetTop - that.getHeight();
			if (menuHeight + menuMargin > downsideSpace) {
				if (upsideSpace > downsideSpace) {
					if (upsideSpace < menuHeight + menuMargin) {
						menuHeight = (upsideSpace - menuMargin - menuMargin);
						menu.style.maxHeight = menuHeight + 'px';
					}
					menu.style.top = (that.offsetTop - menuHeight - (menuMargin * 2)) + 'px';
				} else {
					menuHeight = (downsideSpace - menuMargin - menuMargin);
					menu.style.maxHeight = menuHeight + 'px';
				}
			}
			
			var removeMenu = function (e) {
				
				document.body.removeEventListener('click', removeMenu);
				that.parentNode.removeEventListener('click', removeMenu);
				that.off('click', removeMenu);
				
				menu.style.opacity = '0';
				setTimeout(function (){ menu.remove(); }.bind(this), 500);
				
				delete that._menu;
			};
			
			setTimeout(function () {
				document.body.addEventListener('click', removeMenu);
				that.parentNode.addEventListener('click', removeMenu);
				that.on('click', removeMenu);
			}, 0);
		};
		
		new Element('span', { 'class': flagrate.className + '-pulldown-triangle' }).insertTo(that);
		
		if (opt.style) { that.setStyle(opt.style); }
		if (opt.color) { that.setColor(opt.color); }
		
		if (opt.isDisabled) { that.disable(); }
		
		return that;
	};
	
	flagrate.createPulldown = function (a) {
		return new Pulldown(a);
	};
	
	/*?
	 *  class flagrate.ContextMenu
	**/
	
	/*?
	 *  flagrate.createContextMenu(option)
	 *  new flagrate.ContextMenu(option)
	 *  - option (Object) - options.
	 *  
	 *  ContextMenu.
	 *  
	 *  #### option
	 *  
	 *  * `target`                   (Element):
	 *  * `items`                    (Array): of item (see: flagrate.Menu)
	**/
	var ContextMenu = flagrate.ContextMenu = function (opt) {
		
		opt = opt || {};
		
		this.target = opt.target || null;
		this.items  = opt.items  || null;
		
		this.isShowing = false;
		
		/*?
		 *  flagrate.ContextMenu#open() -> flagrate.ContextMenu
		**/
		this.open = function (e) {
			
			e = e || window.event || {};
			
			if (e.preventDefault) {
				e.preventDefault();
			}
			
			if (this.isShowing) { this.close(); }
			
			this.isShowing = true;
			
			this._menu = new Menu({
				className: flagrate.className + '-context-menu',
				items    : this.items,
				onSelect : this.close.bind(this)
			});
			
			var x = e.clientX || 0;
			var y = e.clientY || 0;
			
			this._menu.style.opacity = 0;
			
			this._menu.insertTo(document.body);
			
			if (x + this._menu.getWidth() > window.innerWidth) {
				x = x - this._menu.getWidth();
			}
			
			if (y + this._menu.getHeight() > window.innerHeight) {
				y = y - this._menu.getHeight();
			}
			
			this._menu.style.top     = y + 'px';
			this._menu.style.left    = x + 'px';
			this._menu.style.opacity = 1;
			
			document.body.addEventListener('click', this.close);
			document.body.addEventListener('mouseup', this.close);
			document.body.addEventListener('mousewheel', this.close);
			
			return this;
		}.bind(this);
		
		/*?
		 *  flagrate.ContextMenu#close() -> flagrate.ContextMenu
		**/
		this.close = function () {
			
			document.body.removeEventListener('click', this.close);
			document.body.removeEventListener('mouseup', this.close);
			document.body.removeEventListener('mousewheel', this.close);
			
			this.isShowing = false;
			
			var menu = this._menu;
			setTimeout(function () {
				if (menu && menu.remove) { menu.remove(); }
			}, 0);
			
			delete this._menu;
			
			return this;
		}.bind(this);
		
		if (this.target !== null) {
			this.target.addEventListener('contextmenu', this.open);
		}
		
		return this;
	};
	
	flagrate.createContextMenu = function (a) {
		return new ContextMenu(a);
	};
	
	ContextMenu.prototype = {
		/*?
		 *  flagrate.ContextMenu#visible() -> Boolean
		**/
		visible: function () {
			return this.isShowing;
		}
		,
		/*?
		 *  flagrate.ContextMenu#remove() -> flagrate.ContextMenu
		**/
		remove: function () {
			if (this._menu) { this.close(); }
			
			if (this.target !== null) {
				this.target.removeEventListener('contextmenu', this.open);
			}
		}
	};
	
	/*?
	 *  class flagrate.Toolbar
	**/
	
	/*?
	 *  flagrate.createToolbar(option)
	 *  new flagrate.Toolbar(option)
	 *  - option (Object) - options.
	 *  
	 *  Toolbar.
	 *  
	 *  #### option
	 *  
	 *  * `id`                       (String): `id` attribute of container element.
	 *  * `className`                (String):
	 *  * `attribute`                (Object):
	 *  * `style`                    (Object): (using flagrate.Element.setStyle)
	 *  * `items`                    (Array): of item or String to create border, Element to insert any element.
	 *  
	 *  #### item
	 *  
	 *  * `key`                      (String):
	 *  * `element`                  (Element):
	**/
	var Toolbar = flagrate.Toolbar = function (opt) {
		
		opt = opt || {};
		
		opt.items = opt.items || [];
		
		var attr = opt.attribute || {};
		
		attr.id       = opt.id;
		attr['class'] = opt.className;
		
		//create
		var that = new Element('div', attr);
		extendObject(that, this);
		
		that.addClassName(flagrate.className + ' ' + flagrate.className + '-toolbar');
		
		var i, l;
		for (i = 0, l = opt.items.length; i < l; i++) {
			that.push(opt.items[i]);
		}
		
		if (opt.style) { that.setStyle(opt.style); }
		
		return that;
	};
	
	flagrate.createToolbar = function (a) {
		return new Toolbar(a);
	};
	
	Toolbar.prototype = {
		/*?
		 *  flagrate.Toolbar#push(item) -> flagrate.Toolbar
		**/
		push: function (a) {
			
			if (typeof a === 'string') {
				new Element('hr').insertTo(this);
			} else if (a instanceof HTMLElement) {
				this.insert(a);
			} else {
				if (a.element) {
					if (a.key) { a.element._key = a.key; }
					this.insert(a.element);
				}
			}
			
			return this;
		}
		,
		/*?
		 *  flagrate.Toolbar#getElementByKey(key) -> Element | null
		**/
		getElementByKey: function (key) {
			
			var result = null;
			
			var elements = this.childNodes;
			var i, l;
			for (i = 0, l = elements.length; i < l; i++) {
				if (!elements[i]._key) { continue; }
				
				if (elements[i]._key === key) {
					result = elements[i];
					break;
				}
			}
			
			return result;
		}
	};
	
	/*?
	 *  class flagrate.TextInput
	 *
	 *  #### Inheritance
	 *  
	 *  * [HTMLInputElement](https://developer.mozilla.org/en-US/docs/Web/API/HTMLInputElement) (MDN)
	**/
	
	/*?
	 *  flagrate.createTextInput(option)
	 *  new flagrate.TextInput(option)
	 *  - option (Object) - options.
	 *  
	 *  TextInput.
	 *  
	 *  #### option
	 *  
	 *  * `id`                       (String): `id` attribute of `input` element.
	 *  * `className`                (String):
	 *  * `attribute`                (Object):
	 *  * `style`                    (Object): (using flagrate.Element.setStyle)
	 *  * `value`                    (String):
	 *  * `placeholder`              (String):
	 *  * `icon`                     (String):
	 *  * `regexp`                   (RegExp):
	 *  * `isDisabled`               (Boolean; default `false`):
	**/
	var TextInput = flagrate.TextInput = function (opt) {
		
		opt = opt || {};
		
		this.regexp = opt.regexp || null;
		
		var attr = opt.attribute || {};
		
		attr.id          = opt.id          || null;
		attr['class']    = opt.className   || null;
		attr.value       = opt.value       || null;
		attr.placeholder = opt.placeholder || null;
		
		//create
		var that = new Element('input', attr);
		extendObject(that, this);
		
		that.addClassName(flagrate.className + ' ' + flagrate.className + '-textinput');
		
		if (opt.icon) {
			that.addClassName(flagrate.className + '-icon');
			that.setStyle({
				backgroundImage: 'url(' + opt.icon + ')'
			});
		}
		
		if (opt.style) { that.setStyle(opt.style); }
		
		if (opt.isDisabled) { that.disable(); }
		
		return that;
	};
	
	flagrate.createTextInput = function (a) {
		return new TextInput(a);
	};
	
	TextInput.prototype = {
		/*?
		 *  flagrate.TextInput#disable() -> flagrate.TextInput
		**/
		disable: function () {
			
			this.addClassName(flagrate.className + '-disabled');
			this.writeAttribute('disabled', true);
			
			return this;
		}
		,
		/*?
		 *  flagrate.TextInput#enable() -> flagrate.TextInput
		**/
		enable: function () {
			
			this.removeClassName(flagrate.className + '-disabled');
			this.writeAttribute('disabled', false);
			
			return this;
		}
		,
		/*?
		 *  flagrate.TextInput#isEnabled() -> Boolean
		**/
		isEnabled: function () {
			return !this.hasClassName(flagrate.className + '-disabled');
		}
		,
		/*?
		 *  flagrate.TextInput#getValue() -> String
		**/
		getValue: function () {
			return this.value;
		}
		,
		/*?
		 *  flagrate.TextInput#setValue(value) -> flagrate.TextInput
		**/
		setValue: function (value) {
			
			this.value = value;
			
			return this;
		}
		,
		/*?
		 *  flagrate.TextInput#isValid() -> Boolean
		**/
		isValid: function () {
			return this.regexp.test(this.getValue());
		}
	};
	
	/*?
	 *  class flagrate.Tokenizer
	 *
	 *  #### Event
	 *
	 *  * `change`: when the tokens/values is changed.
	**/
	
	/*?
	 *  flagrate.createTokenizer(option)
	 *  new flagrate.Tokenizer(option)
	 *  - option (Object) - options.
	 *  
	 *  Tokenizer.
	 *  
	 *  #### option
	 *  
	 *  * `id`                       (String): `id` attribute of container element.
	 *  * `className`                (String):
	 *  * `attribute`                (Object):
	 *  * `style`                    (Object): (using flagrate.Element.setStyle)
	 *  * `placeholder`              (String):
	 *  * `icon`                     (String):
	 *  * `values`                   (Array; default `[]`):
	 *  * `max`                      (Number; default `-1`):
	 *  * `tokenize`                 (Function; default `flagrate.identity`):
	 *  * `isDisabled`               (Boolean; default `false`):
	 *  * `onChange`                 (Function):
	**/
	var Tokenizer = flagrate.Tokenizer = function (opt) {
		
		opt = opt || {};
		
		opt.placeholder = opt.placeholder || null;
		
		this.values   = opt.values   || [];
		this.max      = opt.max      || -1;
		this.tokenize = opt.tokenize || identity;
		this.onChange = opt.onChange || emptyFunction;
		
		var attr = opt.attribute || {};
		
		attr.id       = opt.id         || null;
		attr['class'] = opt.className  || null;
		
		//create
		var that = new Element('div', attr);
		extendObject(that, this);
		
		that.addClassName(flagrate.className + ' ' + flagrate.className + '-tokenizer');
		
		if (opt.icon) {
			that.addClassName(flagrate.className + '-icon');
			that.setStyle({
				backgroundImage: 'url(' + opt.icon + ')'
			});
		}
		
		that._tokens = new Element('span').insertTo(that);
		that._input  = new TextInput({ placeholder: opt.placeholder }).insertTo(that);
		
		if (that.values.length !== 0) {
			that._updateTokens();
		}
		
		that.on('click', that._onClickHandler.bind(that));
		
		that._input.on('keydown',  that._onKeydownHandler.bind(that));
		that._input.on('focus',    that._onFocusHandler.bind(that));
		that._input.on('blur',     that._onBlurHandler.bind(that));
		
		if (opt.style) { that.setStyle(opt.style); }
		
		if (opt.isDisabled) { that.disable(); }
		
		return that;
	};
	
	flagrate.createTokenizer = function (a) {
		return new Tokenizer(a);
	};
	
	Tokenizer.prototype = {
		/*?
		 *  flagrate.Tokenizer#disable() -> flagrate.Tokenizer
		**/
		disable: function () {
			
			this.addClassName(flagrate.className + '-disabled');
			this._input.disable();
			
			return this._updateTokens();
		}
		,
		/*?
		 *  flagrate.Tokenizer#enable() -> flagrate.Tokenizer
		**/
		enable: function () {
			
			this.removeClassName(flagrate.className + '-disabled');
			this._input.enable();
			
			return this._updateTokens();
		}
		,
		/*?
		 *  flagrate.Tokenizer#isEnabled() -> Boolean
		**/
		isEnabled: function () {
			return !this.hasClassName(flagrate.className + '-disabled');
		}
		,
		/*?
		 *  flagrate.Tokenizer#getValues() -> Array
		**/
		getValues: function () {
			return this.values;
		}
		,
		/*?
		 *  flagrate.Tokenizer#setValues(values) -> flagrate.Tokenizer
		**/
		setValues: function (values) {
			
			this.values = values;
			
			return this._updateTokens();
		}
		,
		/*?
		 *  flagrate.Tokenizer#removeValues() -> flagrate.Tokenizer
		**/
		removeValues: function () {
			
			this.values = [];
			
			return this._updateTokens();
		}
		,
		/*?
		 *  flagrate.Tokenizer#removeValue(value) -> flagrate.Tokenizer
		**/
		removeValue: function (value) {
			
			this.values.splice(this.values.indexOf(value), 1);
			
			return this._updateTokens();
		}
		,
		_updateTokens: function () {
			
			this._tokens.update();
			
			var i, l;
			for (i = 0, l = this.values.length; i < l; i++) {
				var value = this.values[i];
				
				var label = '';
				
				if (typeof value === 'string') {
					label = value;
				} else {
					label = value.label;
				}
				
				new Button(
					{
						isDisabled       : (this.isEnabled() === false),
						isRemovableByUser: (this.isEnabled()),
						onRemove         : this._createTokenButtonOnRemoveHandler(this, value),
						label            : label
					}
				).insertTo(this._tokens);
			}
			
			var vw = this.getWidth();
			var bw = this.getStyle('border-width') === null ? 2 : parseInt(this.getStyle('border-width').replace('px', ''), 10);
			var pl = this.getStyle('padding-left') === null ? 4 : parseInt(this.getStyle('padding-left').replace('px', ''), 10);
			var pr = this.getStyle('padding-right') === null ? 4 : parseInt(this.getStyle('padding-right').replace('px', ''), 10);
			var tw = this._tokens.getWidth();
			var tm = this._tokens.getStyle('margin-left') === null ? 2 : parseInt(this._tokens.getStyle('margin-left').replace('px', ''), 10);
			var im = this._input.getStyle('margin-left') === null ? 2 : parseInt(this._input.getStyle('margin-left').replace('px', ''), 10);
			var ip = this._input.getStyle('padding-left') === null ? 2 : parseInt(this._input.getStyle('padding-left').replace('px', ''), 10);
			var aw = vw - pl - pr - tw - tm - im - ip - (bw * 2) - 2;
			
			if (aw > 30) {
				this._input.style.width = aw + 'px';
			} else if (aw < -5) {
				this._input.style.width = '';
			} else {
				this._input.style.width = '100%';
			}
			
			this.fire('change');
			
			return this;
		}
		,
		_createTokenButtonOnRemoveHandler: function (that, value) {
			return function () { that.removeValue(value); };
		}
		,
		_tokenize: function (e) {
			
			this._candidates = [];
			
			var str = this._input.value;
			
			var result = this.tokenize(str, this._tokenized.bind(this));
			
			if (result !== void 0) { this._tokenized(result); }
			
			this._lastTokenizedValue = this._input.value;
			
			return this;
		}
		,
		_tokenized: function (candidates) {
			
			if (candidates instanceof Array === false) { candidates = [candidates]; }
			
			this._candidates = [];
			
			var menu = new Menu(
				{
					onSelect: function () {
						menu.remove();
					}
				}
			);
			
			menu.style.left = this._input.offsetLeft + 'px';
			
			var i, l;
			for (i = 0, l = candidates.length; i < l; i++) {
				var candidate = candidates[i];
				
				var a;
				
				if (typeof candidate === 'string') {
					if (candidate === '') { continue; }
					a = { label: candidate };
				} else {
					a = candidate;
				}
				
				if (a.onSelect) { a._onSelect = a.onSelect; }
				
				a.onSelect = this._createMenuOnSelectHandler(this, candidate, a);
				
				this._candidates.push(candidate);
				menu.push(a);
			}
			
			if (this._menu) { this._menu.remove(); }
			
			if (this._candidates.length !== 0) {
				this.insert({ top: menu });
				this._menu = menu;
			}
			
			return this;
		}
		,
		_createMenuOnSelectHandler: function (that, candidate, menuItem) {
			
			return function (e) {
				
				if (that.max < 0 || that.max > that.values.length) {
					that.values.push(candidate);
				}
				that._updateTokens();
				that.onChange();
				
				if (menuItem._onSelect) { menuItem._onSelect(e); }
			};
		}
		,
		_onClickHandler: function (e) {
			this._input.focus();
		}
		,
		_onKeydownHandler: function (e) {
			
			// ENTER:13
			if (e.keyCode === 13 && this._lastTokenizedValue !== this._input.value) {
				e.stopPropagation();
				e.preventDefault();
				
				this._lastTokenizedValue = this._input.value;
				
				this._tokenize();
				
				return;
			}
			
			if (this._candidates && this._candidates.length !== 0) {
				if (
					// ENTER:13
					(e.keyCode === 13) ||
					// right:39
					(e.keyCode === 39)
				) {
					e.stopPropagation();
					e.preventDefault();
					
					this._input.value = '';
					if (this.max < 0 || this.max > this.values.length) {
						this.values.push(this._candidates[0]);
					}
					this._updateTokens();
					this.onChange();
					
					if (this._menu) { this._menu.remove(); }
				}
			}
			
			//if (!this._candidates || this._candidates.length === 0) {
			//	
			//}
			
			if (this._input.value === '' && this.values.length !== 0) {
				if (
					// BS:8
					(e.keyCode === 8)
				) {
					e.stopPropagation();
					e.preventDefault();
					
					this._input.value = this.values.pop();
					this._updateTokens();
					this.onChange();
					
					if (this._menu) { this._menu.remove(); }
				}
			}
			
			setTimeout(function () {
			
				if (this.max > -1 && this.max <= this.values.length && this._input.value !== '') {
					e.stopPropagation();
					
					this._input.value = '';
					
					return;
				}
				
				this._tokenize();
			}.bind(this), 0);
		}
		,
		_onFocusHandler: function (e) {
			
			this._updateTokens();
			
			this._tokenize();
		}
		,
		_onBlurHandler: function (e) {
			
			this._input.value = '';
			
			if (this._menu) {
				this._menu.style.opacity = '0';
				setTimeout(function (){ this._menu.remove(); }.bind(this), 500);
			}
		}
	};
	
	/*?
	 *  class flagrate.TextArea
	**/
	
	/*?
	 *  flagrate.createTextArea(option)
	 *  new flagrate.TextArea(option)
	 *  - option (Object) - options.
	 *  
	 *  TextArea.
	 *  
	 *  #### option
	 *  
	 *  * `id`                       (String): `id` attribute of `textarea` element.
	 *  * `className`                (String):
	 *  * `attribute`                (Object):
	 *  * `style`                    (Object): (using flagrate.Element.setStyle)
	 *  * `value`                    (String):
	 *  * `placeholder`              (String):
	 *  * `icon`                     (String):
	 *  * `regexp`                   (RegExp):
	 *  * `isDisabled`               (Boolean; default `false`):
	**/
	var TextArea = flagrate.TextArea = function (opt) {
		
		opt = opt || {};
		
		this.regexp = opt.regexp || null;
		
		var attr = opt.attribute || {};
		
		attr.id          = opt.id          || null;
		attr['class']    = opt.className   || null;
		attr.placeholder = opt.placeholder || null;
		
		//create
		var that = new Element('textarea', attr);
		extendObject(that, this);
		
		that.addClassName(flagrate.className + ' ' + flagrate.className + '-textarea');
		
		if (opt.icon) {
			that.addClassName(flagrate.className + '-icon');
			that.setStyle({
				backgroundImage: 'url(' + opt.icon + ')'
			});
		}
		
		if (opt.value) { that.setValue(opt.value); }
		if (opt.style) { that.setStyle(opt.style); }
		
		if (opt.isDisabled) { that.disable(); }
		
		return that;
	};
	
	flagrate.createTextArea = function (a) {
		return new TextArea(a);
	};
	
	TextArea.prototype = {
		/*?
		 *  flagrate.TextArea#disable() -> flagrate.TextArea
		**/
		disable: function () {
			
			this.addClassName(flagrate.className + '-disabled');
			this.writeAttribute('disabled', true);
			
			return this;
		}
		,
		/*?
		 *  flagrate.TextArea#enable() -> flagrate.TextArea
		**/
		enable: function () {
			
			this.removeClassName(flagrate.className + '-disabled');
			this.writeAttribute('disabled', false);
			
			return this;
		}
		,
		/*?
		 *  flagrate.TextArea#isEnabled() -> Boolean
		**/
		isEnabled: function () {
			return !this.hasClassName(flagrate.className + '-disabled');
		}
		,
		/*?
		 *  flagrate.TextArea#getValue() -> String
		**/
		getValue: function () {
			return this.value || '';
		}
		,
		/*?
		 *  flagrate.TextArea#setValue(value) -> flagrate.TextArea
		**/
		setValue: function (value) {
			
			this.value = value;
			
			return this;
		}
		,
		/*?
		 *  flagrate.TextArea#isValid() -> Boolean
		**/
		isValid: function () {
			return this.regexp.test(this.getValue());
		}
	};
	
	/*?
	 *  class flagrate.Select
	 *
	 *  #### Event
	 *
	 *  * `change`:
	**/
	
	/*?
	 *  flagrate.createSelect(option)
	 *  new flagrate.Select(option)
	 *  - option (Object) - options.
	 *  
	 *  Select.
	 *  
	 *  #### option
	 *  
	 *  * `id`                       (String): `id` attribute of container element.
	 *  * `className`                (String):
	 *  * `attribute`                (Object):
	 *  * `style`                    (Object): (using flagrate.Element.setStyle)
	 *  * `items`                    (Array):
	 *  * `listView`                 (Boolean; default `false`):
	 *  * `multiple`                 (Boolean; default `false`):
	 *  * `max`                      (Number; default `-1`):
	 *  * `selectedIndex`            (Number):
	 *  * `selectedIndexes`          (Array): array of Number.
	 *  * `isDisabled`               (Boolean; default `false`):
	 *  * `onChange`                 (Function):
	**/
	var Select = flagrate.Select = function (opt) {
		
		opt = opt || {};
		
		this.items    = opt.items    || [];
		this.listView = opt.listView || false;
		this.multiple = opt.multiple || false;
		this.max      = opt.max      || -1;
		this.onChange = opt.onChange || emptyFunction;
		
		/*?
		 *  flagrate.Select#selectedIndexes -> Array
		 *  readonly property.
		 *
		 *  flagrate.Select#selectedIndex -> Number
		 *  readonly property.
		**/
		if (this.multiple) {
			this.selectedIndexes = opt.selectedIndexes || [];
		} else {
			this.selectedIndex = typeof opt.selectedIndex === 'undefined' ? -1 : opt.selectedIndex;
		}
		
		var attr = opt.attribute || {};
		
		if (opt.id) { attr.id = opt.id; }
		
		/*?
		 *  flagrate.Select#isPulldown -> Boolean
		 *  readonly property.
		**/
		this.isPulldown = (!this.listView && !this.multiple);
		
		//create
		var that = new Element('div', attr);
		
		var createOnSelectHandler = function (i) {
			
			return function () {
				that.select(i);
			};
		};
		
		var createOnDeselectHandler = function (i) {
			
			return function () {
				that.deselect(i);
			};
		};
		
		// normalize items
		var i, l;
		for (i = 0, l = this.items.length; i < l; i++) {
			if (typeof this.items[i] !== 'object') {
				this.items[i] = {
					label: typeof this.items[i] === 'string' ? this.items[i] : this.items[i].toString(10),
					value: this.items[i]
				};
			}
		}
		
		if (this.isPulldown) {
			that._pulldown = new Pulldown({
				label    : '-',
				items    : (function () {
					
					var items = [{
						label   : '-',
						onSelect: createOnSelectHandler(-1)
					}];
					
					var i, l;
					for (i = 0, l = this.items.length; i < l; i++) {
						items.push({
							label   : this.items[i].label,
							icon    : this.items[i].icon,
							onSelect: createOnSelectHandler(i)
						});
					}
					
					return items;
				}.bind(this))()
			}).insertTo(that);
		} else {
			that._grid = new flagrate.Grid({
				headless   : true,
				multiSelect: this.multiple,
				cols: [
					{
						key  : 'label'
					}
				],
				rows: (function () {
					
					var rows = [];
					
					var i, l;
					for (i = 0, l = this.items.length; i < l; i++) {
						rows.push({
							cell: {
								label: {
									text: this.items[i].label,
									icon: this.items[i].icon
								}
							},
							onSelect: createOnSelectHandler(i),
							onDeselect: createOnDeselectHandler(i)
						});
					}
					
					return rows;
				}.bind(this))()
			}).insertTo(that);
		}
		extendObject(that, this);
		
		that.addClassName(flagrate.className + ' ' + flagrate.className + '-select');
		if (!that.isPulldown) { that.addClassName(flagrate.className + '-select-list-view'); }
		if (opt.className) { that.addClassName(opt.className); }
		
		if (opt.style) { that.setStyle(opt.style); }
		
		if (opt.isDisabled) { that.disable(); }
		
		if (that.multiple) {
			that.selectedIndexes.forEach(function (index) {
				that.select(index);
			});
		} else {
			if (that.selectedIndex > -1) {
				that.select(that.selectedIndex);
			}
		}
		
		return that;
	};
	
	flagrate.createSelect = function (a) {
		return new Select(a);
	};
	
	Select.prototype = {
		/*?
		 *  flagrate.Select#select(item) -> flagrate.Select
		 *  - item (Number) - Index number of item.
		**/
		select: function (index) {
			
			if (this.items.length <= index) { return this; }
			
			if (this.multiple) {
				if (this.max > -1 && this.selectedIndexes.length >= this.max) {
					if (this._grid.rows[index].isSelected === true) {
						this._grid.deselect(index);
					}
					return this;
				}
				if (this.selectedIndexes.indexOf(index) !== -1) {
					return this;
				}
				this.selectedIndexes.push(index);
			} else {
				this.selectedIndex = index;
			}
			
			if (this.isPulldown) {
				if (index === -1) {
					this._pulldown.setLabel('-');
					this._pulldown.setIcon(null);
				} else {
					this._pulldown.setLabel(this.items[index].label);
					this._pulldown.setIcon(this.items[index].icon);
				}
				
				this.fire('change');
			} else {
				if (!this._grid.rows[index].isSelected) {
					this._grid.select(index);
				}
			}
			
			return this;
		}
		,
		/*?
		 *  flagrate.Select#deselect([item]) -> flagrate.Select
		 *  - item (Number) - Index number of item.
		**/
		deselect: function (index) {
			
			if (this.items.length <= index) { return this; }
			
			if (this.multiple) {
				var selectedIndex = this.selectedIndexes.indexOf(index);
				if (selectedIndex !== -1) {
					this.selectedIndexes.splice(this.selectedIndexes.indexOf(index), 1);
				}
			} else {
				this.selectedIndex = -1;
			}
			
			if (this.isPulldown) {
				this._pulldown.setLabel('-');
				this._pulldown.setIcon(null);
				
				this.fire('change');
			} else {
				if (this._grid.rows[index].isSelected === true) {
					this._grid.deselect(index);
				}
			}
			
			return this;
		}
		,
		/*?
		 *  flagrate.Select#selectAll() -> flagrate.Select
		**/
		selectAll: function () {
			
			if (this.multiple) {
				this._grid.selectAll();
				this.selectedIndexes = [];
				
				var i, l;
				for (i = 0, l = this.items.length; i < l; i++) {
					this.selectedIndexes.push(i);
				}
			}
			
			return this;
		}
		,
		/*?
		 *  flagrate.Select#deselectAll() -> flagrate.Select
		**/
		deselectAll: function () {
			
			if (this.multiple) {
				this._grid.deselectAll();
				this.selectedIndexes = [];
			} else {
				this.deselect();
			}
			
			return this;
		}
		,
		/*?
		 *  flagrate.Select#disable() -> flagrate.Select
		**/
		disable: function () {
			
			this.addClassName(flagrate.className + '-disabled');
			
			if (this.isPulldown) {
				this._pulldown.disable();
			} else {
				this._grid.disable();
			}
			
			return this;
		}
		,
		/*?
		 *  flagrate.Select#enable() -> flagrate.Select
		**/
		enable: function () {
			
			this.removeClassName(flagrate.className + '-disabled');
			
			if (this.isPulldown) {
				this._pulldown.enable();
			} else {
				this._grid.enable();
			}
			
			return this;
		}
		,
		/*?
		 *  flagrate.Select#isEnabled() -> Boolean
		**/
		isEnabled: function () {
			return !this.hasClassName(flagrate.className + '-disabled');
		}
		,
		/*?
		 *  flagrate.Select#getValue() -> any
		**/
		getValue: function () {
			
			if (this.selectedIndex > -1) {
				return this.items[this.selectedIndex].value;
			} else {
				return void 0;
			}
		}
		,
		/*?
		 *  flagrate.Select#getValues() -> Array
		**/
		getValues: function () {
			
			var i, l, result = [];
			
			for (i = 0, l = this.selectedIndexes.length; i < l; i++) {
				result.push(this.items[this.selectedIndexes[i]].value);
			}
			
			return result;
		}
	};
	
	/*?
	 *  class flagrate.ComboBox
	**/
	
	/*?
	 *  flagrate.createComboBox(option)
	 *  new flagrate.ComboBox(option)
	 *  - option (Object) - options.
	 *  
	 *  Select.
	 *  
	 *  #### option
	 *  
	 *  * `id`                       (String): `id` attribute of container element.
	 *  * `className`                (String):
	 *  * `attribute`                (Object):
	 *  * `style`                    (Object): (using flagrate.Element.setStyle)
	 *  * `value`                    (String): default value.
	 *  * `items`                    (Array): of String values.
	 *  * `placeholder`              (String):
	 *  * `icon`                     (String):
	 *  * `regexp`                   (RegExp):
	 *  * `isDisabled`               (Boolean; default `false`):
	**/
	var ComboBox = flagrate.ComboBox = function (opt) {
		
		opt = opt || {};
		
		this.items  = opt.items  || [];
		this.regexp = opt.regexp || null;
		
		var attr = opt.attribute || {};
		
		if (opt.id) { attr.id = opt.id; }
		
		//create
		var that = new Element('div', attr);
		
		that._textinput = new TextInput({
			value      : opt.value,
			placeholder: opt.placeholder,
			icon       : opt.icon
		}).insertTo(that);
		
		var createOnSelectHandler = function (value) {
			
			return function () {
				that.setValue(value);
				that._textinput.focus();
				that.fire('change');
			};
		};
		
		that._button = new Button({
			onSelect: function () {
				
				if (that._menu) {
					that._menu.remove();
					delete that._menu;
					return;
				}
				
				var items = [];
				var i, l;
				for (i = 0, l = that.items.length; i < l; i++) {
					items.push({
						label   : that.items[i],
						onSelect: createOnSelectHandler(that.items[i])
					});
				}
				
				var menu = that._menu = new Menu(
					{
						className: flagrate.className + '-combobox-menu',
						items    : items,
						onSelect : function () {
							
							menu.remove();
							delete that._menu;
						}
					}
				).insertTo(that);
				
				// To prevent overflow.
				var menuHeight    = menu.getHeight();
				var menuMargin    = parseInt(menu.getStyle('margin-top').replace('px', ''), 10);
				var cummOffsetTop = that.cumulativeOffset().top;
				var upsideSpace   = - window.pageYOffset + cummOffsetTop;
				var downsideSpace = window.pageYOffset + window.innerHeight - cummOffsetTop - that.getHeight();
				if (menuHeight + menuMargin > downsideSpace) {
					if (upsideSpace > downsideSpace) {
						if (upsideSpace < menuHeight + menuMargin) {
							menuHeight = (upsideSpace - menuMargin - menuMargin);
							menu.style.maxHeight = menuHeight + 'px';
						}
						menu.addClassName(flagrate.className + '-combobox-menu-upper');
					} else {
						menuHeight = (downsideSpace - menuMargin - menuMargin);
						menu.style.maxHeight = menuHeight + 'px';
					}
				}
				
				var removeMenu = function (e) {
					
					document.body.removeEventListener('click', removeMenu);
					that.parentNode.removeEventListener('click', removeMenu);
					that.off('click', removeMenu);
					
					menu.style.opacity = '0';
					setTimeout(function (){ menu.remove(); }.bind(this), 500);
					
					delete that._menu;
				};
				
				setTimeout(function () {
					document.body.addEventListener('click', removeMenu);
					that.parentNode.addEventListener('click', removeMenu);
					that.on('click', removeMenu);
				}, 0);
			}
		}).insertTo(that);
		
		extendObject(that, this);
		
		that.addClassName(flagrate.className + ' ' + flagrate.className + '-combobox');
		if (opt.className) { that.addClassName(opt.className); }
		
		if (opt.style) { that.setStyle(opt.style); }
		
		if (opt.isDisabled) { that.disable(); }
		
		return that;
	};
	
	flagrate.createComboBox = function (a) {
		return new ComboBox(a);
	};
	
	ComboBox.prototype = {
		/*?
		 *  flagrate.ComboBox#disable() -> flagrate.ComboBox
		**/
		disable: function () {
			
			this.addClassName(flagrate.className + '-disabled');
			
			this._textinput.disable();
			this._button.disable();
			
			return this;
		}
		,
		/*?
		 *  flagrate.ComboBox#enable() -> flagrate.ComboBox
		**/
		enable: function () {
			
			this.removeClassName(flagrate.className + '-disabled');
			
			this._textinput.enable();
			this._button.enable();
			
			return this;
		}
		,
		/*?
		 *  flagrate.ComboBox#isEnabled() -> Boolean
		**/
		isEnabled: function () {
			return !this.hasClassName(flagrate.className + '-disabled');
		}
		,
		/*?
		 *  flagrate.ComboBox#getValue() -> String
		**/
		getValue: function () {
			return this._textinput.value;
		}
		,
		/*?
		 *  flagrate.ComboBox#setValue(value) -> flagrate.ComboBox
		**/
		setValue: function (value) {
			
			this._textinput.value = value;
			
			return this;
		}
		,
		/*?
		 *  flagrate.ComboBox#isValid() -> Boolean
		**/
		isValid: function (value) {
			return this.regexp.test(this.getValue());
		}
	};
	
	/*?
	 *  class flagrate.Checkbox
	**/
	
	/*?
	 *  flagrate.createCheckbox(option)
	 *  new flagrate.Checkbox(option)
	 *  - option (Object) - options.
	**/
	var Checkbox = flagrate.Checkbox = function (opt) {
		
		var id = 'flagrate-checkbox-' + (++Checkbox.idCounter).toString(10);
		
		opt = opt || {};
		
		this.onChange  = opt.onChange  || null;
		this.onCheck   = opt.onCheck   || null;
		this.onUncheck = opt.onUncheck || null;
		
		var attr = opt.attribute || {};
		
		attr.id       = opt.id         || null;
		attr['class'] = opt.className  || null;
		
		//create
		var that = new Element('label', attr).updateText(opt.label);
		that.writeAttribute('for', id);
		extendObject(that, this);
		
		that.addClassName(flagrate.className + ' ' + flagrate.className + '-checkbox');
		
		if (opt.icon) {
			that.addClassName(flagrate.className + '-icon');
			that.setStyle({
				backgroundImage: 'url(' + opt.icon + ')'
			});
		}
		
		that._input = new Element('input', { id: id, type: 'checkbox' });
		that.insert({ top: new Element() });
		that.insert({ top: that._input });
		
		that._input.on('change', function (e) {
			
			e.targetCheckbox = that;
			
			if (that.isChecked()) {
				if (that.onCheck) { that.onCheck(e); }
			} else {
				if (that.onUncheck) { that.onUncheck(e); }
			}
			
			if (that.onChange) { that.onChange(e); }
		});
		
		if (opt.isChecked)  { that.check(); }
		if (opt.isDisabled) { that.disable(); }
		
		return that;
	};
	
	flagrate.createCheckbox = function (a) {
		return new Checkbox(a);
	};
	
	Checkbox.idCounter = 0;
	
	Checkbox.prototype = {
		/*?
		 *  flagrate.Checkbox#disable() -> flagrate.Checkbox
		**/
		disable: function () {
			
			this.addClassName(flagrate.className + '-disabled');
			this._input.writeAttribute('disabled', true);
			
			return this;
		}
		,
		/*?
		 *  flagrate.Checkbox#enable() -> flagrate.Checkbox
		**/
		enable: function () {
			
			this.removeClassName(flagrate.className + '-disabled');
			this._input.writeAttribute('disabled', false);
			
			return this;
		}
		,
		/*?
		 *  flagrate.Checkbox#isEnabled() -> Boolean
		**/
		isEnabled: function () {
			return !this.hasClassName(flagrate.className + '-disabled');
		}
		,
		/*?
		 *  flagrate.Checkbox#isChecked() -> Boolean
		**/
		isChecked: function () {
			return !!this._input.checked;
		}
		,
		/*?
		 *  flagrate.Checkbox#check() -> flagrate.Checkbox
		**/
		check: function () {
			
			this._input.checked = true;
			
			return this;
		}
		,
		/*?
		 *  flagrate.Checkbox#uncheck() -> flagrate.Checkbox
		**/
		uncheck: function () {
			
			this._input.checked = false;
			
			return this;
		}
	};
	
	/*?
	 *  class flagrate.Checkboxes
	**/
	
	/*?
	 *  flagrate.createCheckboxes(option)
	 *  new flagrate.Checkboxes(option)
	 *  - option (Object) - options.
	**/
	var Checkboxes = flagrate.Checkboxes = function (opt) {
		
		opt = opt || {};
		
		this.items    = opt.items    || [];
		//this.onChange = opt.onChange || emptyFunction;
		
		var attr = opt.attribute || {};
		
		if (opt.id) { attr.id = opt.id; }
		
		//create
		var that = new Element('div', attr);
		
		var i, l;
		for (i = 0, l = this.items.length; i < l; i++) {
			// normalize items
			if (typeof this.items[i] !== 'object') {
				this.items[i] = {
					label: typeof this.items[i] === 'string' ? this.items[i] : this.items[i].toString(10),
					value: this.items[i]
				};
			}
			
			this.items[i]._checkbox = new Checkbox({
				label    : this.items[i].label,
				icon     : this.items[i].icon,
				isChecked: this.items[i].isChecked,
				onCheck  : this.items[i].onCheck,
				onUncheck: this.items[i].onUncheck
			}).insertTo(that);
		}
		extendObject(that, this);
		
		that.addClassName(flagrate.className + ' ' + flagrate.className + '-checkboxes');
		if (opt.className) { that.addClassName(opt.className); }
		
		if (opt.style) { that.setStyle(opt.style); }
		
		if (opt.isDisabled) { that.disable(); }
		
		if (opt.values) {
			that.setValues(opt.values);
		}
		
		return that;
	};
	
	flagrate.createCheckboxes = function (a) {
		return new Checkboxes(a);
	};
	
	Checkboxes.prototype = {
		/*?
		 *  flagrate.Checkboxes#select(index) -> flagrate.Checkboxes
		**/
		select: function (index) {
			
			if (this.items[index]) {
				this.items[index]._checkbox.check();
			}
			
			return this;
		},
		/*?
		 *  flagrate.Checkboxes#deselect(index) -> flagrate.Checkboxes
		**/
		deselect: function (index) {
			
			if (this.items[index]) {
				this.items[index]._checkbox.uncheck();
			}
			
			return this;
		},
		/*?
		 *  flagrate.Checkboxes#getValues() -> Array
		**/
		getValues: function () {
			
			var values = [];
			
			var i, l;
			for (i = 0, l = this.items.length; i < l; i++) {
				if (this.items[i]._checkbox.isChecked() === true) {
					values.push(this.items[i].value);
				}
			}
			
			return values;
		},
		/*?
		 *  flagrate.Checkboxes#addValue(value) -> flagrate.Checkboxes
		**/
		addValue: function (value) {
			
			var i, l;
			for (i = 0, l = this.items.length; i < l; i++) {
				if (this.items[i].value === value) {
					this.select(i);
					break;
				}
			}
			
			return this;
		},
		/*?
		 *  flagrate.Checkboxes#removeValue(value) -> flagrate.Checkboxes
		**/
		removeValue: function (value) {
			
			var i, l;
			for (i = 0, l = this.items.length; i < l; i++) {
				if (this.items[i].value === value) {
					this.deselect(i);
					break;
				}
			}
			
			return this;
		},
		/*?
		 *  flagrate.Checkboxes#setValues(values) -> flagrate.Checkboxes
		**/
		setValues: function (values) {
			
			var i, l;
			for (i = 0, l = this.items.length; i < l; i++) {
				if (values.indexOf(this.items[i].value) === -1) {
					this.deselect(i);
				} else {
					this.select(i);
				}
			}
			
			return this;
		},
		/*?
		 *  flagrate.Checkboxes#selectAll() -> flagrate.Checkboxes
		**/
		selectAll: function () {
			
			var i, l;
			for (i = 0, l = this.items.length; i < l; i++) {
				this.select(i);
			}
			
			return this;
		},
		/*?
		 *  flagrate.Checkboxes#deselectAll() -> flagrate.Checkboxes
		**/
		deselectAll: function () {
			return this.setValues([]);
		},
		/*?
		 *  flagrate.Checkboxes#enable() -> flagrate.Checkboxes
		**/
		enable: function () {
			
			var i, l;
			for (i = 0, l = this.items.length; i < l; i++) {
				this.items[i]._checkbox.enable();
			}
			
			return this;
		},
		/*?
		 *  flagrate.Checkboxes#disable() -> flagrate.Checkboxes
		**/
		disable: function () {
			
			var i, l;
			for (i = 0, l = this.items.length; i < l; i++) {
				this.items[i]._checkbox.disable();
			}
			
			return this;
		}
	};
	
	/*?
	 *  class flagrate.Radio
	**/
	
	/*?
	 *  flagrate.createRadio(option)
	 *  new flagrate.Radio(option)
	 *  - option (Object) - options.
	**/
	var Radio = flagrate.Radio = function (opt) {
		
		var id = 'flagrate-radio-' + (++Radio.idCounter).toString(10);
		
		opt = opt || {};
		
		var attr = opt.attribute || {};
		
		attr.id       = opt.id         || null;
		attr['class'] = opt.className  || null;
		
		//create
		var that = new Element('label', attr).updateText(opt.label);
		that.writeAttribute('for', id);
		extendObject(that, this);
		
		that.addClassName(flagrate.className + ' ' + flagrate.className + '-radio');
		
		if (opt.icon) {
			that.addClassName(flagrate.className + '-icon');
			that.setStyle({
				backgroundImage: 'url(' + opt.icon + ')'
			});
		}
		
		that._input = new Element('input', { id: id, type: 'radio', name: opt.name });
		that.insert({ top: new Element() });
		that.insert({ top: that._input });
		
		that._input.on('change', function () {
			if (this.isChecked()) {
				that.fire('check');
			} else {
				that.fire('uncheck');
			}
		}.bind(that));
		
		if (opt.isChecked)  { that.check(); }
		if (opt.isDisabled) { that.disable(); }
		
		return that;
	};
	
	flagrate.createRadio = function (a) {
		return new Radio(a);
	};
	
	Radio.idCounter = 0;
	
	Radio.prototype = {
		/*?
		 *  flagrate.Radio#disable() -> flagrate.Radio
		**/
		disable: function () {
			
			this.addClassName(flagrate.className + '-disabled');
			this._input.writeAttribute('disabled', true);
			
			return this;
		}
		,
		/*?
		 *  flagrate.Radio#enable() -> flagrate.Radio
		**/
		enable: function () {
			
			this.removeClassName(flagrate.className + '-disabled');
			this._input.writeAttribute('disabled', false);
			
			return this;
		}
		,
		/*?
		 *  flagrate.Radio#isEnabled() -> Boolean
		**/
		isEnabled: function () {
			return !this.hasClassName(flagrate.className + '-disabled');
		}
		,
		/*?
		 *  flagrate.Radio#isChecked() -> String
		**/
		isChecked: function () {
			return !!this._input.checked;
		}
		,
		/*?
		 *  flagrate.Radio#check() -> flagrate.Radio
		**/
		check: function () {
			
			this._input.checked = true;
			
			return this;
		}
		,
		/*?
		 *  flagrate.Radio#uncheck() -> flagrate.Radio
		**/
		uncheck: function () {
			
			this._input.checked = false;
			
			return this;
		}
	};
	
	/*?
	 *  class flagrate.Radios
	**/
	
	/*?
	 *  flagrate.createRadios(option)
	 *  new flagrate.Radios(option)
	 *  - option (Object) - options.
	**/
	var Radios = flagrate.Radios = function (opt) {
		
		opt = opt || {};
		
		this.items    = opt.items    || [];
		//this.onChange = opt.onChange || emptyFunction;
		
		var id = 'flagrate-radios-' + (++Radio.idCounter);
		
		/*?
		 *  flagrate.Radios#selectedIndex -> Number
		 *  readonly.
		**/
		this.selectedIndex = opt.selectedIndex || -1;
		
		var attr = opt.attribute || {};
		
		if (opt.id) { attr.id = opt.id; }
		
		//create
		var that = new Element('div', attr);
		
		var createOnCheckHandler = function (i) {
			
			return function () {
				that.selectedIndex = i;
			};
		};
		
		var i, l;
		for (i = 0, l = this.items.length; i < l; i++) {
			// normalize items
			if (typeof this.items[i] !== 'object') {
				this.items[i] = {
					label: typeof this.items[i] === 'string' ? this.items[i] : this.items[i].toString(10),
					value: this.items[i]
				};
			}
			
			this.items[i]._radio = new Radio({
				label: this.items[i].label,
				icon : this.items[i].icon,
				name : id
			}).on('check', createOnCheckHandler(i)).insertTo(that);
		}
		extendObject(that, this);
		
		that.addClassName(flagrate.className + ' ' + flagrate.className + '-radios');
		if (opt.className) { that.addClassName(opt.className); }
		
		if (opt.style) { that.setStyle(opt.style); }
		
		if (opt.isDisabled) { that.disable(); }
		
		if (that.selectedIndex > -1) {
			this.items[that.selectedIndex]._radio.check();
		}
		
		return that;
	};
	
	flagrate.createRadios = function (a) {
		return new Radios(a);
	};
	
	Radios.idCounter = 0;
	
	Radios.prototype = {
		/*?
		 *  flagrate.Radios#select(index) -> flagrate.Radios
		**/
		select: function (index) {
			
			if (this.items[index] !== void 0) {
				this.selectedIndex = index;
				this.items[index]._radio.check();
			}
			
			return this;
		},
		/*?
		 *  flagrate.Radios#getValue() -> any
		**/
		getValue: function () {
			
			if (this.selectedIndex === -1) {
				return void 0;
			} else {
				return this.items[this.selectedIndex].value;
			}
		},
		/*?
		 *  flagrate.Radios#setValue(value) -> flagrate.Radios
		**/
		setValue: function (value) {
			
			var i, l;
			for (i = 0, l = this.items.length; i < l; i++) {
				if (this.items[i].value === value) {
					this.select(i);
					break;
				}
			}
			
			return this;
		},
		/*?
		 *  flagrate.Radios#enable() -> flagrate.Radios
		**/
		enable: function () {
			
			var i, l;
			for (i = 0, l = this.items.length; i < l; i++) {
				this.items[i]._radio.enable();
			}
			
			return this;
		},
		/*?
		 *  flagrate.Radios#disable() -> flagrate.Radios
		**/
		disable: function () {
			
			var i, l;
			for (i = 0, l = this.items.length; i < l; i++) {
				this.items[i]._radio.disable();
			}
			
			return this;
		}
	};
	
	/*?
	 *  class flagrate.Switch
	 *  
	 *  #### Example
	 *
	 *      var sw = flagrate.createSwitch().insertTo(x);
	 *      
	 *      sw.on('on', function () {
	 *        console.log('on');
	 *      });
	 *      sw.on('off', function () {
	 *        console.log('off');
	 *      });
	 *      sw.on('change', function (e) {
	 *        console.log(e.target.isOn());
	 *      });
	 *  
	 *  #### Structure
	 *  
	 *  <div class="example-container">
	 *    <button class="flagrate flagrate-button flagrate-switch"></button>
	 *  </div>
	 *  
	 *      <button class="flagrate flagrate-button flagrate-switch"></button>
	 *  
	 *  #### Events
	 *  
	 *  * `on`: when the switch is turned on.
	 *  * `off`: when the switch is turned off.
	 *  * `change`: when the on/off status is changed.
	 *  
	 *  #### Inheritances
	 *  
	 *  * flagrate.Button
	 *  * [HTMLButtonElement](https://developer.mozilla.org/en-US/docs/Web/API/HTMLButtonElement) (MDN)
	**/
	
	/*?
	 *  flagrate.createSwitch(option)
	 *  new flagrate.Switch(option)
	 *  - option (Object) - options.
	**/
	var Switch = flagrate.Switch = function (opt) {
		
		opt = opt || {};
		
		//create
		var that = new Button({
			id        : opt.id,
			className : opt.className,
			attribute : opt.attribute,
			style     : opt.style,
			isFocused : opt.isFocused,
			isDisabled: opt.isDisabled
		});
		extendObject(that, this);
		
		that.onSelect = that.toggleSwitch.bind(that);
		
		that.addClassName(flagrate.className + '-switch');
		
		if (that.dataset) {
			that.dataset.flagrateSwitchStatus = opt.isOn ? 'on' : 'off';
		} else {
			that.writeAttribute('data-flagrate-switch-status', opt.isOn ? 'on' : 'off');
		}
		
		return that;
	};
	
	flagrate.createSwitch = function (a) {
		return new Switch(a);
	};
	
	Switch.prototype = {
		/*?
		 *  flagrate.Switch#isEnabled() -> flagrate.Switch
		 *  flagrate.Switch#enable() -> flagrate.Switch
		 *  flagrate.Switch#disable() -> flagrate.Switch
		**/
		/*?
		 *  flagrate.Switch#isOn() -> Boolean
		**/
		isOn: function () {
			if (this.dataset) {
				return this.dataset.flagrateSwitchStatus === 'on';
			} else {
				return this.readAttribute('data-flagrate-switch-status') === 'on';
			}
		}
		,
		/*?
		 *  flagrate.Switch#switchOn() -> flagrate.Switch
		**/
		switchOn: function () {
			
			if (this.dataset) {
				this.dataset.flagrateSwitchStatus = 'on';
			} else {
				this.writeAttribute('data-flagrate-switch-status', 'on');
			}
			
			return this.fire('on').fire('change');
		}
		,
		/*?
		 *  flagrate.Switch#switchOff() -> flagrate.Switch
		**/
		switchOff: function () {
			
			if (this.dataset) {
				this.dataset.flagrateSwitchStatus = 'off';
			} else {
				this.writeAttribute('data-flagrate-switch-status', 'off');
			}
			
			return this.fire('off').fire('change');
		}
		,
		/*?
		 *  flagrate.Switch#toggleSwitch() -> flagrate.Switch
		**/
		toggleSwitch: function () {
			return this.isOn() ? this.switchOff() : this.switchOn();
		}
	};
	
	/*?
	 *  class flagrate.Progress
	 *
	 *  #### Event
	 *
	 *  * `change`: when the value is changed.
	 *  
	 *  #### Inheritances
	 *  
	 *  * flagrate.Element
	 *  * [HTMLDivElement](https://developer.mozilla.org/en-US/docs/Web/API/HTMLDivElement) (MDN)
	**/
	
	/*?
	 *  flagrate.createProgress(option)
	 *  new flagrate.Progress(option)
	 *  - option (Object) - options.
	**/
	var Progress = flagrate.Progress = function (opt) {
		
		opt = opt || {};
		
		this.value = opt.value || 0;
		this.max   = opt.max   || 100;
		
		var attr = opt.attribute || {};
		
		attr.id       = opt.id         || null;
		attr['class'] = opt.className  || null;
		
		//create
		var that = new Element('div', attr);
		extendObject(that, this);
		
		that.addClassName(flagrate.className + ' ' + flagrate.className + '-progress');
		
		that._bar = new Element().insertTo(that);
		
		that._updateProgress();
		
		return that;
	};
	
	flagrate.createProgress = function (a) {
		return new Progress(a);
	};
	
	Progress.prototype = {
		/*?
		 *  flagrate.Progress#getValue() -> Number
		**/
		getValue: function () {
			return this.value;
		}
		,
		/*?
		 *  flagrate.Progress#setValue(number) -> flagrate.Progress
		**/
		setValue: function (number) {
			
			if (typeof number !== 'number') { return this; }
			
			this.value = Math.max(0, Math.min(this.max, number));
			
			this.fire('change');
			
			return this._updateProgress();
		}
		,
		_updateProgress: function () {
			
			var percentage = Math.max(0, Math.min(100, this.value / this.max * 100));
			
			this._bar.setStyle({ width: percentage + '%' });
			
			return this;
		}
	};
	
	/*?
	 *  class flagrate.Slider
	 *
	 *  #### Events
	 *
	 *  * `change`: when the value is changed. (by flagrate.Progress)
	 *  * `slide` : when the slide by user.
	 *  
	 *  #### Inheritance
	 *  
	 *  * flagrate.Progress
	**/
	
	/*?
	 *  flagrate.createSlider(option)
	 *  new flagrate.Slider(option)
	 *  - option (Object) - options.
	**/
	var Slider = flagrate.Slider = function (opt) {
		
		opt = opt || {};
		
		//create
		var that = new Progress(opt);
		extendObject(that, this);
		
		that.addClassName(flagrate.className + '-slider');
		
		if (window.ontouchstart !== void 0) {
			that.on('touchstart', that._onPointerDownHandler.bind(that));
		}
		if (navigator.pointerEnabled) {
			that.on('pointerdown', that._onPointerDownHandler.bind(that));
		} else if (navigator.msPointerEnabled) {
			that.on('MSPointerDown', that._onPointerDownHandler.bind(that));// deprecated on IE11
		} else {
			that.on('mousedown', that._onPointerDownHandler.bind(that));
		}
		
		if (opt.isDisabled) { that.disable(); }
		
		return that;
	};
	
	flagrate.createSlider = function (a) {
		return new Slider(a);
	};
	
	Slider.prototype = {
		/*?
		 *  flagrate.Slider#disable() -> flagrate.Slider
		**/
		disable: function () {
			return this.addClassName(flagrate.className + '-disabled');
		}
		,
		/*?
		 *  flagrate.Slider#enable() -> flagrate.Slider
		**/
		enable: function () {
			return this.removeClassName(flagrate.className + '-disabled');
		}
		,
		/*?
		 *  flagrate.Slider#isEnabled() -> Boolean
		**/
		isEnabled: function () {
			return !this.hasClassName(flagrate.className + '-disabled');
		}
		,
		_onPointerDownHandler: function (e) {
			
			if (!this.isEnabled()) { return; }
			
			e.preventDefault();
			
			var x   = 0;
			var pos = 0;
			
			switch (e.type) {
				case 'mousedown':
				case 'MSPointerDown':// deprecated on IE11
				case 'pointerdown':
					x   = e.offsetX || e.layerX;
					pos = e.clientX;
					break;
				case 'touchstart':
					x   = e.touches[0].pageX - this.cumulativeOffset().left;
					pos = e.touches[0].clientX;
					break;
			}
			
			this._slide(x, pos);
		}
		,
		_slide: function (x, pos) {
			
			var unitWidth  = this.getWidth() / this.max;
			
			var onMove = function (e) {
				
				e.preventDefault();
				
				if (e.touches && e.touches[0]) {
					x   = x + e.touches[0].clientX - pos;
					pos = e.touches[0].clientX;
				} else {
					x   = x + e.clientX - pos;
					pos = e.clientX;
				}
				
				this.setValue(Math.round(x / unitWidth));
				this.fire('slide');
			}.bind(this);
			
			var onUp = function (e) {
				
				e.preventDefault();
				
				if (window.ontouchend !== void 0) {
					document.body.removeEventListener('touchmove', onMove);
					document.body.removeEventListener('touchend', onUp);
					document.body.removeEventListener('touchcancel', onUp);
				}
				if (navigator.pointerEnabled) {
					document.body.removeEventListener('pointermove', onMove);
					document.body.removeEventListener('pointerup', onUp);
				} else if (navigator.msPointerEnabled) {
					document.body.removeEventListener('MSPointerUp', onUp);
					document.body.removeEventListener('MSPointerMove', onMove);
				} else {
					document.body.removeEventListener('mousemove', onMove);
					document.body.removeEventListener('mouseup', onUp);
				}
				
				if (e.touches && e.touches[0]) {
					x = x + e.touches[0].clientX - pos;
					this.setValue(Math.round(x / unitWidth));
					this.fire('slide');
				}
				
				if (e.clientX) {
					x = x + e.clientX - pos;
					this.setValue(Math.round(x / unitWidth));
					this.fire('slide');
				}
			}.bind(this);
			
			if (window.ontouchend !== void 0) {
				document.body.addEventListener('touchmove', onMove);
				document.body.addEventListener('touchend', onUp);
				document.body.addEventListener('touchcancel', onUp);
			}
			if (navigator.pointerEnabled) {
				document.body.addEventListener('pointermove', onMove);
				document.body.addEventListener('pointerup', onUp);
			} else if (navigator.msPointerEnabled) {
				document.body.addEventListener('MSPointerMove', onMove);
				document.body.addEventListener('MSPointerUp', onUp);
			} else {
				document.body.addEventListener('mousemove', onMove);
				document.body.addEventListener('mouseup', onUp);
			}
			
			this.setValue(Math.round(x / unitWidth));
			this.fire('slide');
		}
	};
	
	/*?
	 *  class flagrate.Tab
	**/
	
	/*?
	 *  flagrate.createTab(option)
	 *  new flagrate.Tab(option)
	 *  - option (Object) - option.
	 *  
	 *  Create and initialize the tab.
	 *  
	 *  #### option
	 *  
	 *  * `id`            (String): `id` attribute of container.
	 *  * `className`     (String):
	 *  * `attribute`     (Object):
	 *  * `style`         (Object): (using flagrate.Element.setStyle)
	 *  * `tabs`          (Array): Array of **tab** object.
	 *  * `selectedIndex` (Number):
	 *  * `fill`          (Boolean; default `false`):
	 *  * `bodyless`      (Boolean; default `false`):
	 *  * `onSelect`      (Function): Triggered whenever select the tab.
	 *  
	 *  #### tab
	 *  
	 *  * `key`           (String):
	 *  * `label`         (String):
	 *  * `icon`          (String):
	 *  * `text`          (String):
	 *  * `html`          (String):
	 *  * `element`       (Element):
	 *  * `onSelect`      (Function):
	**/
	var Tab = flagrate.Tab = function (opt) {
		
		opt = opt || {};
		
		/*?
		 *  flagrate.Tab#tabs -> Array
		 *  This is readonly property for array of tab.
		**/
		this.tabs = opt.tabs || [];
		
		/*?
		 *  flagrate.Tab#bodyless -> Boolean
		 *  readonly.
		**/
		this.bodyless = opt.bodyless || false;
		
		/*?
		 *  flagrate.Tab#onSelect -> Function
		**/
		this.onSelect = opt.onSelect || null;
		
		var attr = opt.attribute || [];
		
		attr.id       = opt.id;
		attr['class'] = flagrate.className + ' ' + flagrate.className + '-tab';
		
		if (opt.fill) {
			attr['class'] += ' ' + flagrate.className + '-tab-fill';
		}
		
		// create
		var that = new Element('div', attr);
		extendObject(that, this);
		
		if (opt.className) { that.addClassName(opt.className); }
		if (opt.style)     { that.setStyle(opt.style); }
		
		/*?
		 *  flagrate.Tab#selectedIndex -> Number
		 *  This is readonly property for index of selected tab.
		**/
		that.selectedIndex = opt.selectedIndex || 0;
		
		that._create()._render();
		
		if (that.tabs.length > 0) { that.select(that.selectedIndex); }
		
		return that;
	};
	
	flagrate.createTab = function (a) {
		return new Tab(a);
	};
	
	Tab.prototype = {
		/*?
		 *  flagrate.Tab#select(tab) -> flagrate.Tab
		 *  - tab (Object|String|Number) - Object: tab object, String: key of tab, Number: index of tab.
		 *  
		 *  select the tab.
		**/
		select: function (a) {
			
			var index = (typeof a === 'number') ? a : this.indexOf(a);
			
			if (index < 0 || index >= this.tabs.length) { return this; }
			
			if (0 <= this.selectedIndex && this.selectedIndex < this.tabs.length && this.tabs[this.selectedIndex]._button) {
				this.tabs[this.selectedIndex]._button.removeClassName(flagrate.className + '-tab-selected');
			}
			
			this.selectedIndex = index;
			
			var tab = this.tabs[index];
			if (!tab || !tab._button) { return this; }
			
			tab._button.addClassName(flagrate.className + '-tab-selected');
			
			if (tab.text)    { this._body.updateText(tab.text); }
			if (tab.html)    { this._body.update(tab.html); }
			if (tab.element) { this._body.update(tab.element); }
			
			if (tab.onSelect)  { tab.onSelect(window.event, tab); }
			if (this.onSelect) { this.onSelect(window.event, tab); }
			
			return this;
		}
		,
		/*?
		 *  flagrate.Tab#unshift(tab) -> Number
		 *  - tab (Object|Array)
		 *  
		 *  unshift the tab.
		**/
		unshift: function (r) {
			
			if (r instanceof Array) {
				var i, l;
				for (i = 0, l = r.length; i < l; i++) {
					this.tabs.unshift(r);
				}
			} else {
				this.tabs.unshift(r);
			}
			
			this._render();
			
			return this.tabs.length;
		}
		,
		/*?
		 *  flagrate.Tab#push(tab) -> Number
		 *  - tab (Object|Array)
		 *  
		 *  push the tab.
		**/
		push: function (r) {
			
			if (r instanceof Array) {
				var i, l;
				for (i = 0, l = r.length; i < l; i++) {
					this.tabs.push(r);
				}
			} else {
				this.tabs.push(r);
			}
			
			this._render();
			
			return this.tabs.length;
		}
		,
		/*?
		 *  flagrate.Tab#shift([count = 1]) -> Object|Array
		 *  - count (Number)
		 *  
		 *  shift the tab.
		**/
		shift: function (c) {
			
			c = c || 1;
			
			var removes = [];
			
			var i, l;
			for (i = 0, l = this.tabs.length; i < l && i < c; i++) {
				removes.push(this.tabs.shift());
			}
			
			this._render();
			
			return c === 1 ? removes[0] : removes;
		}
		,
		/*?
		 *  flagrate.Tab#pop([count = 1]) -> Object|Array
		 *  - count (Number)
		 *  
		 *  pop the tab.
		**/
		pop: function (c) {
			
			c = c || 1;
			
			var removes = [];
			
			var i, l;
			for (i = 0, l = this.tabs.length; i < l && i < c; i++) {
				removes.push(this.tabs.pop());
			}
			
			this._render();
			
			return c === 1 ? removes[0] : removes;
		}
		,
		/*?
		 *  flagrate.Tab#splice(index[, howMany, tab]) -> Array
		 *  - index   (Number) - Index at which to start changing the flagrate.Tab#tabs.
		 *  - howMany (Number) - An integer indicating the number of old flagrate.Tab#tabs to remove.
		 *  - tab     (Object|Array) - The row(s) to add to the flagrate.Tab#tabs.
		 *  
		 *  Changes the content of a tabs, adding new tab(s) while removing old tab(s).
		**/
		splice: function (index, c, t) {
			
			c = typeof c === 'undefined' ? this.tabs.length - index : c;
			
			var removes = this.tabs.splice(index, c);
			
			if (t) {
				if (t instanceof Array === false) { t = [t]; }
				
				var i, l;
				for (i = 0, l = t.length; i < l; i++) {
					this.tabs.splice(index + i, 0, t[i]);
				}
			}
			
			this._render();
			
			return removes;
		}
		,
		/*?
		 *  flagrate.Tab#removeTab(tab) -> Object|Array
		 *  - tab (Array|Object|String|Number) - tab to locate in the flagrate.Tab#tabs.
		 *
		 *  remove tab(s).
		**/
		removeTab: function (a) {
			
			var removes = [];
			var bulk    = false;
			
			if (a instanceof Array === false) {
				a = [a];
			}
			
			var i, l;
			for (i = 0, l = a.length; i < l; i++) {
				var index = (typeof a[i] === 'number') ? a[i] : this.indexOf(a[i]);
				if (index !== -1) {
					removes.push(this.splice(index, 1));
				}
			}
			
			return bulk ? removes : removes[0];
		}
		,
		/*?
		 *  flagrate.Tab#indexOf(tab) -> Number
		 *  - tab (Object|String) - tab to locate in the flagrate.Tab#tabs.
		**/
		indexOf: function (a) {
			
			if (typeof a === 'string') {
				var index = -1;
				
				var i, l;
				for (i = 0, l = this.tabs.length; i < l; i++) {
					if (this.tabs[i].key === a) {
						index = i;
						break;
					}
				}
				
				return index;
			} else {
				return this.tabs.indexOf(a);
			}
		}
		,
		_create: function () {
			
			this._head = new Element('div', { 'class': flagrate.className + '-tab-head' }).insertTo(this);
			
			if (this.bodyless === true) {
				this._body = new Element();
			} else {
				this._body = new Element('div', { 'class': flagrate.className + '-tab-body' }).insertTo(this);
			}
			
			return this;
		}
		,
		_render: function () {
			
			this._head.update();
			
			var i, l, tab;
			for (i = 0, l = this.tabs.length; i < l; i++) {
				tab = this.tabs[i];
				
				if (!tab._button) {
					tab._button = new Button(
						{
							icon    : tab.icon,
							label   : tab.label,
							onSelect: this._createOnSelectHandler(this, tab)
						}
					);
				}
				
				tab._button.insertTo(this._head);
			}
			
			return this;
		}
		,
		_createOnSelectHandler: function (that, tab) {
			
			return function (e) {
				
				that.select(tab);
			};
		}
	};
	
	/*?
	 *  class flagrate.Popover
	**/
	
	/*?
	 *  flagrate.createPopover(option)
	 *  new flagrate.Popover(option)
	 *  - option (Object) - options.
	 *  
	 *  Popover.
	 *  
	 *  #### option
	 *  
	 *  * `target`    (Element):
	 *  * `text`      (String):
	 *  * `html`      (String):
	 *  * `element`   (Element):
	 *  * `className` (String):
	**/
	var Popover = flagrate.Popover = function (opt) {
		
		opt = opt || {};
		
		this.target = opt.target  || null;
		var text    = opt.text    || null;
		var html    = opt.html    || null;
		var element = opt.element || null;
		
		this.isShowing = false;
		
		/*?
		 *  flagrate.Popover#open([target]) -> flagrate.Popover
		 *  - target (Element) - for targeting to force
		**/
		this.open = function (target) {
			
			var e = window.event || {};
			var t = this.target || e.target || document.documentElement;
			
			if (target instanceof Event)       { e = target; }
			if (target instanceof HTMLElement) { t = target; }
			
			if (this.isShowing) { this.close(); }
			
			this.isShowing = true;
			
			var d = this._div = new Element('div', {
				'class': flagrate.className + ' ' + flagrate.className + '-popover'
			});
			
			if (opt.className) { d.addClassName(opt.className); }
			
			if (text)    { d.updateText(text); }
			if (html)    { d.update(html); }
			if (element) { d.update(element); }
			
			d.style.opacity = 0;
			d.insertTo(document.body);
			
			Popover._updatePosition(t, d);
			
			d.style.opacity = 1;
			
			if (e.type && e.type === 'mouseover') {
				document.body.addEventListener('click', this.close);
				document.body.addEventListener('mouseout', this.close);
				document.body.addEventListener('mouseup', this.close);
				document.body.addEventListener('mousewheel', this.close);
			}
			
			var positioning = function () {
				
				if (Element.exists(t) === true) {
					Popover._updatePosition(t, d);
					this._positioningTimer = setTimeout(positioning, 30);
				} else {
					this.close();
				}
			}.bind(this);
			this._positioningTimer = setTimeout(positioning, 30);
			
			var stopper = function (e) {
				e.stopPropagation();
				if (e.type === 'mousewheel') { e.preventDefault(); }
			};
			
			this._div.on('click', stopper);
			this._div.on('mouseup', stopper);
			this._div.on('mousewheel', stopper);
			
			return this;
		}.bind(this);
		
		/*?
		 *  flagrate.Popover#close() -> flagrate.Popover
		**/
		this.close = function () {
			
			clearTimeout(this._positioningTimer);
			
			document.body.removeEventListener('click', this.close);
			document.body.removeEventListener('mouseup', this.close);
			document.body.removeEventListener('mouseout', this.close);
			document.body.removeEventListener('mousewheel', this.close);
			
			this.isShowing = false;
			
			var div = this._div;
			setTimeout(function () {
				if (div && div.remove) { div.remove(); }
			}, 0);
			
			delete this._div;
			
			return this;
		}.bind(this);
		
		if (this.target !== null) { this.target.addEventListener('mouseover', this.open); }
		
		return this;
	};
	
	flagrate.createPopover = function (a) {
		return new Popover(a);
	};
	
	Popover.prototype = {
		/*?
		 *  flagrate.Popover#visible() -> Boolean
		**/
		visible: function () {
			return this.isShowing;
		}
		,
		/*?
		 *  flagrate.Popover#remove() -> flagrate.Popover
		**/
		remove: function () {
			if (this._div) { this.close(); }
			
			if (this.target !== null) {
				this.target.removeEventListener('mouseover', this.open);
			}
		}
	};
	
	Popover._updatePosition = function (target, div) {
		
		var tOffset  = Element.cumulativeOffset(target);
		var tScroll  = Element.cumulativeScrollOffset(target);
		var tWidth   = Element.getWidth(target);
		var tHeight  = Element.getHeight(target);
		var width    = div.getWidth();
		var height   = div.getHeight();
		
		var x = tOffset.left - tScroll.left + (tWidth / 2) - (width / 2);
		var y = tOffset.top - tScroll.top + tHeight;
		
		if (y + height > window.innerHeight) {
			y  = window.innerHeight - y + tHeight;
			
			div.removeClassName(flagrate.className + '-popover-tail-top');
			div.addClassName(flagrate.className + '-popover-tail-bottom');
			div.style.top    = '';
			div.style.bottom = y + 'px';
		} else {
			div.removeClassName(flagrate.className + '-popover-tail-bottom');
			div.addClassName(flagrate.className + '-popover-tail-top');
			div.style.top    = y + 'px';
			div.style.bottom = '';
		}
		
		div.style.left = x + 'px';
	};
	
	/*?
	 *  class flagrate.Tutorial
	 *  
	 *  The flagrate.Tutorial object provides a tutorial UI.
	 *  
	 *  #### Example
	 *  
	 *      // create
	 *      var tutorial = flagrate.createTutorial({
	 *        steps: [
	 *          {
	 *            target: '#tutorial-step1',// using selector string
	 *            text  : 'step1'
	 *          },
	 *          {
	 *            target: '#tutorial-step2',
	 *            text  : 'step2',
	 *          },
	 *          {
	 *            target: element,
	 *            text  : 'step3'
	 *          },
	 *          {
	 *            title : 'Finish',
	 *            text  : 'Good luck!'
	 *          }
	 *        ]
	 *      });
	 *      
	 *      // open
	 *      tutorial.open();
	**/
	
	/*?
	 *  flagrate.createTutorial(option)
	 *  new flagrate.Tutorial(option)
	 *  - option (Object) - options.
	 *  
	 *  Creates new tutorial.
	 *  
	 *  #### option
	 *  
	 *  * `steps`              (Array; required): Array of **step** object.
	 *  * `count`              (Number; default `0`): current count of step.
	 *  * `onFinish`           (Function): callback when finish.
	 *  * `onAbort`            (Function): callback when abort.
	 *  * `onClose`            (Function): callback when close.
	 *  
	 *  #### step
	 *  
	 *  * `target`             (Element|String): Element to target. If target is undefined or not found, will creates flagrate.Modal.
	 *  * `title`              (String): Title for this step.
	 *  * `text`               (String): Descriptive text for this step.
	 *  * `html`               (String): Descriptive html for this step.
	 *  * `onStep`             (Function): Triggered whenever a step is started.
	 *  * `onBeforeStep`       (Function): Triggered at before starting of this step.
	 *  * `onAfterStep`        (Function): Triggered at after of this step.
	 *  
	 *  ##### onBeforeStep / onAfterStep
	 *  
	 *      // async callback
	 *      function (done) {// if expects callback, will waits for it.
	 *        setTimeout(done, 1000);
	 *      }
	 *      
	 *      // sync
	 *      function () {
	 *        // ...
	 *      }
	**/
	var Tutorial = flagrate.Tutorial = function (opt) {
		
		opt = opt || {};
		
		this.steps    = opt.steps    || [];
		this.index    = opt.count    || 0;
		this.onFinish = opt.onFinish || emptyFunction;
		this.onAbort  = opt.onAbort  || emptyFunction;
		this.onClose  = opt.onClose  || emptyFunction;
	};
	
	flagrate.createTutorial = function (a) {
		return new Tutorial(a);
	};
	
	Tutorial.prototype = {
		/*?
		 *  flagrate.Tutorial#visible() -> Boolean
		**/
		visible: function () {
			return !!this._popover || !!this._modal || !!this._inStep;
		}
		,
		/*?
		 *  flagrate.Tutorial#open() -> flagrate.Tutorial
		**/
		open: function () {
			
			if (this.visible() === false) {
				this._main();
			}
			
			return this;
		}
		,
		/*?
		 *  flagrate.Tutorial#close() -> flagrate.Tutorial
		**/
		close: function () {
			
			if (this.visible() === true) {
				this._afterStep(this.onClose.bind(this));
			}
			
			return this;
		}
		,
		/*?
		 *  flagrate.Tutorial#abort() -> flagrate.Tutorial
		**/
		abort: function () {
			
			if (this.visible() === true) {
				this._afterStep(this.onAbort.bind(this));
			}
			
			return this;
		}
		,
		/*?
		 *  flagrate.Tutorial#finish() -> flagrate.Tutorial
		**/
		finish: function () {
			
			this._afterStep(this.onFinish.bind(this));
			this.index = 0;
			
			return this;
		}
		,
		/*?
		 *  flagrate.Tutorial#prev() -> flagrate.Tutorial
		**/
		prev: function () {
			
			this._afterStep(function () {
				
				if (this.index > 0) { --this.index; }
				this._main();
			}.bind(this));
			
			return this;
		}
		,
		/*?
		 *  flagrate.Tutorial#next() -> flagrate.Tutorial
		**/
		next: function () {
			
			this._afterStep(function () {
				
				if ((this.index + 1) < this.steps.length) { ++this.index; }
				this._main();
			}.bind(this));
			
			return this;
		}
		,
		_main: function () {
			
			this._inStep = true;
			
			var step = this.steps[this.index];
			
			if (step.onBeforeStep) {
				if (step.onBeforeStep.length) {
					step.onBeforeStep(this._step.bind(this));
					return this;
				} else {
					step.onBeforeStep();
				}
			}
			
			this._step();
			
			return this;
		}
		,
		_step: function () {
			
			var step = this.steps[this.index];
			
			var buttons = [];
			
			if ((this.index + 1) >= this.steps.length) {
				buttons.push({
					className: flagrate.className + '-tutorial-button-finish',
					onSelect : function () {
						this._afterStep(this.finish.bind(this));
					}.bind(this)
				});
			} else {
				buttons.push({
					className: flagrate.className + '-tutorial-button-next',
					onSelect : function () {
						this._afterStep(this.next.bind(this));
					}.bind(this)
				});
			}
			
			if (this.index > 0) {
				buttons.push({
					className: flagrate.className + '-tutorial-button-prev',
					onSelect: function () {
						this._afterStep(this.prev.bind(this));
					}.bind(this)
				});
			}
			
			if ((this.index + 1) < this.steps.length) {
				buttons.push({
					className: flagrate.className + '-tutorial-button-abort',
					onSelect: function () {
						this._afterStep(this.abort.bind(this));
					}.bind(this)
				});
			}
			
			buttons[0].color = '@primary';
			
			var target;
			if (step.target && typeof step.target === 'string') {
				target = document.querySelector(step.target);
			} else {
				target = step.target;
			}
			
			if (target) {
				var container = new Element();
				var body      = new Element();
				
				if (step.html) {
					body.insert(step.html).insertTo(container);
				}
				
				if (step.text) {
					body.insertText(step.text).insertTo(container);
				}
					
				var buttonContainer = new Element('footer').insertTo(container);
				buttons.forEach(function (button) {
					new Button(button).insertTo(buttonContainer);
				});
				
				this._popover = new Popover({
					className: flagrate.className + '-tutorial',
					element  : container
				});
				
				this._popover.open(target);
			} else {
				this._modal = new flagrate.Modal({
					disableCloseByMask: true,
					disableCloseButton: true,
					disableCloseByEsc : true,
					className         : flagrate.className + '-tutorial',
					title             : step.title,
					text              : step.text,
					html              : step.html,
					buttons           : buttons
				});
				
				this._modal.open();
			}
			
			if (step.onStep) { step.onStep(); }
			
			return this;
		}
		,
		_afterStep: function (done) {
			
			this._inStep = false;
			
			var pp = false;
			
			if (this._popover) {
				pp = true;
				this._popover.remove();
				delete this._popover;
			}
			if (this._modal) {
				pp = true;
				this._modal.close();
				delete this._modal;
			}
			
			if (pp === true) {
				var step = this.steps[this.index];
				
				if (step.onAfterStep) {
					if (step.onAfterStep.length) {
						step.onAfterStep(done);
						return this;
					} else {
						step.onAfterStep();
					}
				}
			}
			
			done();
			
			return this;
		}
	};
	
	/*?
	 *  class flagrate.Notify
	 *  
	 *  The flagrate.Notify object provides a notification UI.
	 *  also, supports **Desktop Notifications**.
	 *  
	 *  #### Example
	 *  
	 *      // create and initialize a Notify instance
	 *      var notify = flagrate.createNotify({
	 *        title: 'Somehow Web App'
	 *      });
	 *      
	 *      // create notify
	 *      notify.create({ text: 'Hello' });
	 *      
	 *      setTimeout(function () {
	 *        notify.create({
	 *          text   : 'Hey, are you awake?',
	 *          onClick: function () {
	 *            notify.create({ text: 'Aaaah' });
	 *          }
	 *        });
	 *      }, 1000 * 30);
	 *  
	 *  #### Related
	 *  
	 *  * [Web Notifications](http://www.w3.org/TR/notifications/) (W3C)
	**/
	// ref: Hypernotifier/1.0 https://github.com/kanreisa/Hypernotifier/blob/792fa7/hypernotifier.js
	
	/*?
	 *  flagrate.createNotify(option)
	 *  new flagrate.Notify(option)
	 *  - option (Object) - configuration for the notifications.
	 *  
	 *  Initialize the notifications.
	 *  
	 *  #### option
	 *  
	 *  * `target`                (Element; default `document.body`):
	 *  * `className`             (String):
	 *  * `disableDesktopNotify`  (Boolean; default `false`):
	 *  * `disableFocusDetection` (Boolean; default `false`): 
	 *  * `hAlign`                (String;  default `"right"`; `"right"` | `"left"`):
	 *  * `vAlign`                (String;  default `"bottom"`; `"top"` | `"bottom"`):
	 *  * `hMargin`               (Number;  default `10`):
	 *  * `vMargin`               (Number;  default `10`):
	 *  * `spacing`               (Number;  default `10`):
	 *  * `timeout`               (Number;  default `5`):
	 *  * `title`                 (String;  default `"Notify"`):
	**/
	var Notify = flagrate.Notify = function (opt) {
		
		opt = opt || {};
		
		this.target    = opt.target    || document.body;
		this.className = opt.className || null;
		
		this.disableDesktopNotify  = opt.disableDesktopNotify  || false;//Notification API(experimental)
		this.disableFocusDetection = opt.disableFocusDetection || false;
		
		this.hAlign  = opt.hAlign  || 'right';
		this.vAlign  = opt.vAlign  || 'bottom';
		this.hMargin = opt.hMargin || 10;//pixels
		this.vMargin = opt.vMargin || 10;//pixels
		this.spacing = opt.spacing || 10;//pixels
		this.timeout = opt.timeout || 5;//seconds
		
		this.title   = opt.title   || 'Notify';
		
		this.notifies = [];
		
		if (this.disableDesktopNotify === false) {
			this.desktopNotifyType = null;
			
			/*- Check supported -*/
			if ((window.Notification !== void 0) && window.Notification.permission) {
				this.desktopNotifyType = 'w3c';
			} else if (window.webkitNotifications !== void 0) {
				this.desktopNotifyType = 'webkit';
			} else {
				this.disableDesktopNotify = true;
			}
			
			/*- Check protocol -*/
			if (window.location.protocol !== 'file:') {
				/*- Get Permissions -*/
				if ((this.desktopNotifyType === 'w3c') && (window.Notification.permission === 'default')) {
					this.create({
						text   : 'Click here to activate desktop notifications...',
						onClick: function () {
							window.Notification.requestPermission();
						}.bind(this)
					});
				}
				
				if ((this.desktopNotifyType === 'webkit') && (window.webkitNotifications.checkPermission() === 1)) {
					this.create({
						text   : 'Click here to activate desktop notifications...',
						onClick: function () {
							window.webkitNotifications.requestPermission();
						}.bind(this)
					});
				}
			}
		}
		
		return this;
	};
	
	flagrate.createNotify = function (a) {
		return new Notify(a);
	};
	
	Notify.prototype = {
		/*?
		 *  flagrate.Notify#create(option) -> flagrate.Notify
		 *  - option (Object|String) - configuration for the notification.
		 *  
		 *  Create and show the notification.
		 *  
		 *  #### option
		 *  
		 *  * `title`   (String; default `"Notify"`):
		 *  * `text`    (String; required):
		 *  * `icon`    (String): The URL of the image used as an icon.
		 *  * `onClick` (Function):
		 *  * `onClose` (Function):
		 *  * `timeout` (Number; default `5`):
		**/
		create: function (opt) {
			
			opt = opt || {};
			
			// sugar
			if (typeof opt === 'string') {
				opt = {
					text: opt
				};
			}
			
			/*- Desktop notify -*/
			if (this.disableDesktopNotify === false) {
				var hasFocus = !!document.hasFocus ? document.hasFocus() : false;
				if (this.disableFocusDetection === false && hasFocus === false) {
					if (this.createDesktopNotify(opt) === true) {
						return this;
					}
				}
			}
			
			/*- Setting up -*/
			var title   = opt.title   || this.title;
			var message = opt.message || opt.body || opt.content || opt.text || null;
			var onClick = opt.onClick || null;
			var onClose = opt.onClose || null;
			var timeout = (opt.timeout !== void 0) ? opt.timeout : this.timeout;
			
			var isAlive = true;
			var closeTimer;
			
			/*- Positions -*/
			var hPosition = this.hMargin;
			var vPosition = this.vMargin;
			
			/*- Create a new element for notify -*/
			//
			// <div class="flagrate-notify">
			//   <div class="title">Notification</div>
			//   <div class="text">yadda yadda yadda..</div>
			//   <div class="close">&#xd7;</div>
			// </div>
			//
			var notify = new Element('div', { 'class': this.className });
			notify.addClassName(flagrate.className + ' ' + flagrate.className + '-notify');
			new Element('div', { 'class': 'title' }).insertText(title).insertTo(notify);
			new Element('div', { 'class': 'text' }).insertText(message).insertTo(notify);
			var notifyClose = new Element('div', { 'class': 'close' }).update('&#xd7;').insertTo(notify);
			
			if (opt.icon) {
				notify.addClassName(flagrate.className + '-notify-icon');
				new Element('div', { 'class': 'icon' }).setStyle({ 'backgroundImage': 'url(' + opt.icon + ')' }).insertTo(notify);
			}
			
			/*- Remove a notify element -*/
			var closeNotify = function () {
				
				isAlive = false;
				
				notify.style.opacity = 0;
				
				//onClose event
				if (onClose !== null) {
					onClose();
				}
				
				setTimeout(function () {
					
					this.target.removeChild(notify);
					
					this.notifies.splice(this.notifies.indexOf(notify), 1);
					this.positioner();
				}.bind(this), 300);
			}.bind(this);
			
			notifyClose.on('click', function (e) {
				
				e.stopPropagation();
				e.preventDefault();
				
				if (isAlive) {
					closeNotify();
				}
			}, false);
			
			notify.style.display = 'none';
			
			notify.style.position      = 'fixed';
			notify.style[this.hAlign] = hPosition + 'px';
			notify.style[this.vAlign] = vPosition + 'px';
			
			/*- onClick event -*/
			if (onClick === null) {
				notify.on('click', function (e) {
					
					closeNotify();
				});
			} else {
				notify.style.cursor = 'pointer';
				notify.on('click', function (e) {
					
					e.stopPropagation();
					e.preventDefault();
					
					onClick();
					closeNotify();
				});
			}
			
			/*- Insert to the target -*/
			this.target.appendChild(notify);
			
			/*- Show notify -*/
			notify.style.display = 'block';
			setTimeout(function () {
				notify.style.opacity = 1;
			}, 10);
			
			/*- Set timeout -*/
			if (timeout !== 0) {
				var onTimeout = function () {
					
					if (isAlive) {
						closeNotify();
					}
				};
				
				closeTimer = setTimeout(onTimeout, timeout * 1000);
				
				//Clear timeout
				notify.on('mouseover', function () {
					
					clearTimeout(closeTimer);
					closeTimer = setTimeout(onTimeout, timeout * 1000);
				});
			}
			
			this.notifies.push(notify);
			this.positioner();
			
			return this;
		}
		,
		createDesktopNotify: function (opt) {
			/*- Setting up -*/
			var title   = opt.title   || this.title;
			var message = opt.message || opt.body || opt.content || opt.text || null;
			var onClick = opt.onClick || null;
			var onClose = opt.onClose || null;
			var timeout = (opt.timeout !== void 0) ? opt.timeout : this.timeout;
			
			var isAlive = true;
			var notify  = null;
			var type    = this.desktopNotifyType;
			var closeTimer;
			
			/*- Create a desktop notification -*/
			if (type === 'w3c') {
				/*- Get Permissions -*/
				if (window.Notification.permission !== 'granted') {
					return false;
				}
				
				notify = new window.Notification(title, {
					icon: opt.icon,
					body: message
				});
			}
			
			if (type === 'webkit') {
				/*- Get Permissions -*/
				if (window.webkitNotifications.checkPermission() !== 0) {
					return false;
				}
				
				notify = window.webkitNotifications.createNotification('', title, message);
			}
			
			/*- Set timeout -*/
			if (timeout !== 0) {
				closeTimer = setTimeout(function () {
					
					if (isAlive) {
						if (type === 'w3c') {
							notify.close();
						} else {
							notify.cancel();
						}
					}
				}, timeout * 1000);
			}
			
			/*- onClick event -*/
			if (onClick === null) {
				notify.addEventListener('click', function (e) {
					
					if (type === 'w3c') {
						notify.close();
					} else {
						notify.cancel();
					}
				});
			} else {
				notify.addEventListener('click', function (e) {
					
					onClick();
					if (type === 'w3c') {
						notify.close();
					} else {
						notify.cancel();
					}
				});
			}
			
			/*- onClose event -*/
			notify.onclose = function () {
				isAlive = false;
				if (onClose !== null) {
					onClose();
				}
			};
			
			/*- Show notify -*/
			if (notify.show) { notify.show(); }
			
			return true;
		}
		,
		positioner: function () {
			var tH = (this.target === document.body) ? (window.innerHeight || document.body.clientHeight) : this.target.offsetHeight;
			var pX = 0;
			var pY = 0;
			
			var i, l;
			for (i = 0, l = this.notifies.length; i < l; i++) {
				var notify = this.notifies[i];
				
				var x = this.vMargin + pX;
				var y = this.hMargin + pY;
				
				notify.style[this.hAlign] = x.toString(10) + 'px';
				notify.style[this.vAlign] = y.toString(10) + 'px';
				
				pY += this.spacing + notify.offsetHeight;
				
				if ((pY + notify.offsetHeight + this.vMargin + this.spacing) >= tH) {
					pY  = 0;
					pX += this.spacing + notify.offsetWidth;
				}
			}
		}
	};
	/*?
	 *  flagrate.Notify#disableFocusDetection -> Boolean
	 *  flagrate.Notify#hAlign -> String
	 *  flagrate.Notify#vAlign -> String
	 *  flagrate.Notify#hMargin -> Number
	 *  flagrate.Notify#vMargin -> Number
	 *  flagrate.Notify#spacing -> Number
	 *  flagrate.Notify#timeout -> Number
	 *  flagrate.Notify#title -> String
	**/
	
	/*?
	 *  class flagrate.Modal
	**/
	// ref: Hypermodal/1.2 https://github.com/kanreisa/Hypermodal/blob/9470a7/hypermodal.css
	
	/*?
	 *  flagrate.createModal(option)
	 *  new flagrate.Modal(option)
	 *  - option (Object) - configuration for the modal.
	 *  
	 *  Create and initialize the modal.
	 *  
	 *  #### option
	 *  
	 *  * `target`                   (Element; default `document.body`):
	 *  * `id`                       (String):
	 *  * `className`                (String):
	 *  * `title`                    (String):
	 *  * `subtitle`                 (String):
	 *  * `text`                     (String):
	 *  * `html`                     (String):
	 *  * `element`                  (Element):
	 *  * `href`                     (String):
	 *  * `buttons`                  (Array): of button object.
	 *  * `sizing`                   (String;  default `"flex"`; `"flex"` | `"full"`):
	 *  * `onBeforeClose`            (Function):
	 *  * `onClose`                  (Function):
	 *  * `onShow`                   (Function):
	 *  * `disableCloseButton`       (Boolean; default `false`):
	 *  * `disableCloseByMask`       (Boolean; default `false`):
	 *  * `disableCloseByEsc`        (Boolean; default `false`):
	 *  
	 *  #### button
	 *  
	 *  * `key`                      (String):
	 *  * `label`                    (String; required):
	 *  * `icon`                     (String):
	 *  * `color`                    (String):
	 *  * `onSelect`                 (Function):
	 *  * `isFocused`                (Boolean; default `false`):
	 *  * `isDisabled`               (Boolean; default `false`):
	 *  * `className`                (String):
	**/
	var Modal = flagrate.Modal = function (opt) {
		
		opt = opt || {};
		
		this.target    = opt.target    || document.body;
		this.id        = opt.id        || null;
		this.className = opt.className || null;
		
		this.title     = opt.title    || '';
		this.subtitle  = opt.subtitle || opt.description || '';
		this.text      = opt.text     || '';
		this.html      = opt.html     || '';
		this.element   = opt.element  || opt.content || null;
		this.href      = opt.href     || '';
		this.buttons   = opt.buttons  || [];
		this.sizing    = opt.sizing   || 'flex';
		
		this.onBeforeClose = opt.onBeforeClose || emptyFunction;
		this.onClose       = opt.onClose       || emptyFunction;
		this.onShow        = opt.onShow        || emptyFunction;
		
		this.disableCloseButton = opt.disableCloseButton || false;
		this.disableCloseByMask = opt.disableCloseByMask || false;
		this.disableCloseByEsc  = opt.disableCloseByEsc  || false;
		
		if (this.buttons.length === 0) {
			this.buttons = [
				{
					label    : 'OK',
					color    : '@primary',
					onSelect : this.close.bind(this),
					isFocused: true
				}
			];
		}
		
		//create
		this._modal = new Element('div');
		this._modal.on('click', function (e) {
			
			e.stopPropagation();
		});
		
		if (this.disableCloseButton === false) {
			this._closeButton = new Button({
				label   : '',
				onSelect: this.close.bind(this)
			}).insertTo(this._modal);
		}
		
		this._header = new Element('hgroup').insertTo(this._modal);
		new Element('h1').insertText(this.title).insertTo(this._header);
		new Element('small').insertText(this.subtitle).insertTo(this._header);
		
		this._content = new Element('div').insertTo(this._modal);
		/*?
		 *  flagrate.Modal#content -> flagrate.Element
		**/
		this.content  = new Element('div').insertTo(this._content);
		
		if (this.text    !== '')   { this.content.insertText(this.text); }
		if (this.html    !== '')   { this.content.update(this.html); }
		if (this.element !== null) { this.content.update(this.element); }
		
		this._footer = new Element('footer').insertTo(this._modal);
		
		var i, l;
		for (i = 0, l = this.buttons.length; i < l; i++) {
			var a = this.buttons[i];
			
			a.button = new Button({
				className : a.className,
				label     : a.label,
				icon      : a.icon,
				color     : a.color,
				isFocuesed: a.isFocused || false,
				isDisabled: a.isDisabled,
				onSelect  : this._createButtonOnSelectHandler(this, a)
			});
			
			a.disable  = a.button.disable.bind(a.button);
			a.enable   = a.button.enable.bind(a.button);
			a.setColor = a.button.setColor.bind(a.button);
			
			this._footer.insert(a.button);
		}
		
		this._base = new Element('div', {
			id     : this.id,
			'class': this.className
		});
		
		if (this.target !== document.body) { this._base.style.position = 'absolute'; }
		
		this._base.addClassName(
			flagrate.className + ' ' +
			flagrate.className + '-modal ' +
			flagrate.className + '-sizing-' + this.sizing
		);
		
		this._obi = new Element('div').update(this._modal).insertTo(this._base);
		
		if (this.disableCloseByMask === false) {
			this._base.on('click', this.close.bind(this));
		}
		
		this._onKeydownHandler = function (e) {
			
			var active = document.activeElement.tagName;
			
			if (active !== 'BODY' && active !== 'DIV') { return; }
			if (window.getSelection().toString() !== '') { return; }
			
			e.stopPropagation();
			e.preventDefault();
			
			// TAB:9
			if (e.keyCode === 9) {
				if (this._closeButton) { return this._closeButton.focus(); }
				if (this.buttons[0])   { return this.buttons[0].button.focus(); }
			}
			
			// ENTER:13
			if (e.keyCode === 13 && this.buttons[0]) { return this.buttons[0].button.click(); }
			
			// ESC:27
			if (e.keyCode === 27) { return this.close(); }
		}.bind(this);
		
		return this;
	};
	
	flagrate.createModal = function (a) {
		return new Modal(a);
	};
	
	Modal.prototype = {
		/*?
		 *  flagrate.Modal#visible() -> Boolean
		 *  
		 *  Tells weather modal is visible
		**/
		visible: function () {
			return this._base.hasClassName(flagrate.className + '-modal-visible');
		}
		,
		/*?
		 *  flagrate.Modal#open() -> flagrate.Modal
		 *  
		 *  Open the modal.
		**/
		open: function () {
			
			if (this.visible() === true) { return this; }
			
			// make free
			if (document.activeElement) { document.activeElement.blur(); }
			window.getSelection().removeAllRanges();
			
			if (this.closingTimer) { clearTimeout(this.closingTimer); }
			
			Element.insert(this.target, this._base);
			
			setTimeout(function () {
				this._base.addClassName(flagrate.className + '-modal-visible');
			}.bind(this), 0);
			
			// Callback: onShow
			this.onShow(this);
			
			var baseWidth   = -1;
			var baseHeight  = -1;
			var modalWidth  = -1;
			var modalHeight = -1;
			var positioning = function _positioning() {
				
				if (
					baseWidth   !== this._base.getWidth()   ||
					baseHeight  !== this._base.getHeight()  ||
					modalWidth  !== this._modal.getWidth()  ||
					modalHeight !== this._modal.getHeight()
				) {
					baseWidth   = this._base.getWidth();
					baseHeight  = this._base.getHeight();
					modalWidth  = this._modal.getWidth();
					modalHeight = this._modal.getHeight();
				
					if (this.sizing === 'flex') {
						if (baseWidth - 20 <= modalWidth) {
							this._modal.style.left        = '0';
							this._content.style.width     = baseWidth + 'px';
							this._content.style.overflowX = 'auto';
						} else {
							this._modal.style.left        = Math.floor((baseWidth / 2) - (modalWidth / 2)) + 'px';
							this._content.style.width     = '';
							this._content.style.overflowX = 'visible';
						}
						
						if (baseHeight - 20 <= modalHeight) {
							this._obi.style.top        = '10px';
							this._obi.style.bottom     = '10px';
							this._obi.style.height     = '';
							this._content.style.height = baseHeight - this._header.getHeight() - this._footer.getHeight() - 20 + 'px';
							this._content.style.overflowY = 'auto';
						} else {
							this._obi.style.top           = (baseHeight / 2) - (modalHeight / 2) + 'px';
							this._obi.style.bottom        = '';
							this._obi.style.height        = modalHeight + 'px';
							this._content.style.height    = '';
							this._content.style.overflowY = 'visible';
						}
					}
					
					if (this.sizing === 'full') {
						this._modal.style.right       = '10px';
						this._modal.style.left        = '10px';
						this._content.style.overflowX = 'auto';
						
						this._obi.style.top        = '10px';
						this._obi.style.bottom     = '10px';
						this._obi.style.height     = '';
						this._content.style.height = baseHeight - this._header.getHeight() - this._footer.getHeight() - 20 + 'px';
						this._content.style.overflowY = 'auto';
					}
				}
				
				this.positioningTimer = setTimeout(positioning.bind(this), 30);
			};
			this.positioningTimer = setTimeout(positioning.bind(this), 0);
			
			if (this.disableCloseByEsc === false) {
				window.addEventListener('keydown', this._onKeydownHandler);
			}
			
			return this;
		}
		,
		// DEPRECATED
		show: function () {
			return this.open();
		}
		,
		// DEPRECATED
		render: function () {
			return this.open();
		}
		,
		/*?
		 *  flagrate.Modal#close() -> flagrate.Modal
		 *  
		 *  Close the modal.
		**/
		close: function (e) {
			
			if (this.visible() === false) { return this; }
			
			this._base.removeClassName(flagrate.className + '-modal-visible');
			
			if (e) {
				e.stopPropagation();
				e.preventDefault();
			}
			
			// Callback: onBeforeClose
			if (this.onBeforeClose(this, e) === false) {
				return this;//abort closing
			}
			
			clearTimeout(this.positioningTimer);
			
			this.closingTimer = setTimeout(function (){ this._base.remove(); }.bind(this), 200);
			
			if (this.disableCloseByEsc === false) {
				window.removeEventListener('keydown', this._onKeydownHandler);
			}
			
			// Callback: onClose
			this.onClose(this, e);
			
			return this;
		}
		,
		/*?
		 *  flagrate.Modal#getButtonByKey(key) -> flagrate.Button | null
		**/
		getButtonByKey: function (key) {
			
			var result = null;
			
			var buttons = this.buttons;
			var i, l;
			for (i = 0; i < buttons.length; i++) {
				if (!buttons[i].key) { continue; }
				
				if (buttons[i].key === key) {
					result = buttons[i].button;
					break;
				}
			}
			
			return result;
		}
		,
		/*?
		 *  flagrate.Modal#getButtons() -> Array
		**/
		getButtons: function () {
			return this.buttons || [];
		}
		,
		_createButtonOnSelectHandler: function (that, button) {
			
			return function (e) {
				try {
					if (button.onSelect) { button.onSelect(e, that); }
					if (button.onClick)  { button.onClick(e, that); }// DEPRECATED
				} catch (err) {
					throw new Error('flagrate.Modal: ' + err);
				}
			};
		}
	};
	
	/*?
	 *  class flagrate.Grid
	**/
	// ref: Hypergrid/1.9 https://github.com/kanreisa/Hypergrid/blob/90b032/hypergrid.js
	
	/*?
	 *  flagrate.createGrid(option)
	 *  new flagrate.Grid(option)
	 *  - option (Object) - configuration for the grid.
	 *  
	 *  Create and initialize the grid.
	 *  
	 *  #### option
	 *  
	 *  * `id`                       (String): `id` attribute of container.
	 *  * `className`                (String):
	 *  * `attribute`                (Object):
	 *  * `style`                    (Object): (using flagrate.Element.setStyle)
	 *  * `cols`                     (Array): of col object.
	 *  * `rows`                     (Array): of row object.
	 *  * `pagination`               (Boolean; default `false`):
	 *  * `numberOfRowsPerPage`      (Number; default `20`): pagination.
	 *  * `fill`                     (Boolean; default `false`):
	 *  * `headless`                 (Boolean; default `false`):
	 *  * `multiSelect`              (Boolean; default `false`):
	 *  * `disableCheckbox`          (Boolean; default `false`):
	 *  * `disableSelect`            (Boolean; default `false`):
	 *  * `disableSort`              (Boolean; default `false`):
	 *  * `disableFilter`            (Boolean; default `false`):
	 *  * `disableResize`            (Boolean; default `false`):
	 *  * `onSelect`                 (Function):
	 *  * `onDeselect`               (Function):
	 *  * `onClick`                  (Function):
	 *  * `onDblClick`               (Function):
	 *  * `onRender`                 (Function):
	 *  * `onRendered`               (Function):
	 *  * `postProcessOfRow`         (Function):
	 *  
	 *  #### col
	 *  
	 *  * `id`                       (String): `id` attribute of `th`
	 *  * `className`                (String):
	 *  * `attribute`                (Object):
	 *  * `style`                    (Object): styling of `th` (using flagrate.Element.setStyle)
	 *  * `key`                      (String; required):
	 *  * `label`                    (String; default `""`):
	 *  * `icon`                     (String):
	 *  * `align`                    (String):
	 *  * `width`                    (Number):
	 *  * `disableSort`              (Boolean; default `false`):
	 *  * `disableResize`            (Boolean; default `false`):
	 *  
	 *  #### row
	 *  
	 *  * `id`                       (String): `id` attribute of `tr`
	 *  * `className`                (String):
	 *  * `attribute`                (Object):
	 *  * `style`                    (Object): styling of `tr` (using flagrate.Element.setStyle)
	 *  * `cell`                     (Object|String; default `{}`): of cell object. or String for text.
	 *  * `menuItems`                (Array): of Menu items.
	 *  * `isSelected`               (Boolean):
	 *  * `onSelect`                 (Function):
	 *  * `onDeselect`               (Function):
	 *  * `onClick`                  (Function):
	 *  * `onDblClick`               (Function):
	 *  * `postProcess`              (Function):
	 *  
	 *  #### cell
	 *  
	 *  * `id`                       (String): `id` attribute of `td`
	 *  * `className`                (String):
	 *  * `attribute`                (Object):
	 *  * `style`                    (Object): styling of `td` (using flagrate.Element.setStyle)
	 *  * `text`                     (String):
	 *  * `html`                     (String):
	 *  * `element`                  (Element):
	 *  * `icon`                     (String):
	 *  * `sortAlt`                  (Number|String):
	 *  * `onClick`                  (Function):
	 *  * `onDblClick`               (Function):
	 *  * `postProcess`              (Function):
	**/
	var Grid = flagrate.Grid = function (opt) {
		
		opt = opt || {};
		
		this.id                  = opt.id                  || null;
		this.className           = opt.className           || null;
		this.attribute           = opt.attribute           || null;
		this.style               = opt.style               || null;
		this.cols                = opt.cols                || [];
		this.rows                = opt.rows                || [];
		this.pagination          = opt.pagination          || false;
		this.fill                = opt.fill                || false;
		this.headless            = opt.headless            || false;
		this.multiSelect         = opt.multiSelect         || false;
		this.disableCheckbox     = opt.disableCheckbox     || false;
		this.disableSelect       = opt.disableSelect       || false;
		this.disableSort         = opt.disableSort         || false;
		this.disableFilter       = opt.disableFilter       || false;
		this.disableResize       = opt.disableResize       || false;
		this.onSelect            = opt.onSelect            || null;
		this.onDeselect          = opt.onDeselect          || null;
		this.onClick             = opt.onClick             || null;
		this.onDblClick          = opt.onDblClick          || null;
		this.onRender            = opt.onRender            || null;
		this.onRendered          = opt.onRendered          || null;
		this.postProcessingOfRow = opt.postProcessingOfRow || null;
		
		this._id = 'flagrate-grid-' + (++Grid.idCounter).toString(10);
		
		this._selectedRows = [];
		
		if (this.pagination) {
			this.numberOfRowsPerPage = opt.numberOfRowsPerPage || 20;
			this.pagePosition = 0;
		}
		
		if (this.headless) {
			this.disableSort   = true;
			this.disableResize = true;
		}
		
		/*?
		 *  flagrate.Grid#sortedByKey -> String | null
		 *  readonly.
		 *
		 *  flagrate.Grid#sortedByAsc -> Boolean | null
		 *  readonly.
		**/
		this.sortedByKey = null;
		this.sortedByAsc = null;
		
		return this._create()._requestRender();
	};
	
	flagrate.createGrid = function (a) {
		return new Grid(a);
	};
	
	Grid.idCounter = 0;
	
	Grid.prototype = {
		/*?
		 *  flagrate.Grid#insertTo(element[, position = "bottom"]) -> flagrate.Grid
		 *
		 *  please refer to flagrate.Element.insertTo
		**/
		insertTo: function (element, pos) {
			return this.element.insertTo(element, pos) && this;
		}
		,
		/*?
		 *  flagrate.Grid#select(row) -> flagrate.Grid
		 *
		 *  select row(s)
		**/
		select: function (a) {
			
			var rows, i, l;
			
			if (a instanceof Array) {
				rows = a;
			} else {
				rows = [];
				
				for (i = 0, l = arguments.length; i < l; i++) {
					rows.push(arguments[i]);
				}
			}
			
			if (this.multiSelect === false) { this.deselectAll(); }
			
			for (i = 0, l = rows.length; i < l; i++) {
				var row = rows[i];
				
				if (typeof row === 'number') {
					row = this.rows[row];
				}
				
				row.isSelected = true;
				
				if (row._tr && row._tr.hasClassName(flagrate.className + '-grid-row-selected') === true) {
					continue;
				}
				
				this._selectedRows.push(row);
				
				if (row._tr) { row._tr.addClassName(flagrate.className + '-grid-row-selected'); }
				
				if (row._checkbox) { row._checkbox.check(); }
				
				if (row.onSelect)  { row.onSelect(window.event, row); }
				if (this.onSelect) { this.onSelect(window.event, row); }
			}
			
			if (this._selectedRows.length !== 0 && this._checkbox) {
				this._checkbox.check();
			}
			
			this.element.fire('change');
			
			return this;
		}
		,
		/*?
		 *  flagrate.Grid#deselect(row) -> flagrate.Grid
		 *
		 *  deselect row(s)
		**/
		deselect: function (a) {
			
			var rows, i, l;
			
			if (a instanceof Array) {
				rows = a;
			} else {
				rows = [];
				
				for (i = 0, l = arguments.length; i < l; i++) {
					rows.push(arguments[i]);
				}
			}
			
			for (i = 0, l = rows.length; i < l; i++) {
				var row = rows[i];
				
				if (typeof row === 'number') {
					row = this.rows[row];
				}
				
				row.isSelected = false;
				
				if (row._tr && row._tr.hasClassName(flagrate.className + '-grid-row-selected') === false) {
					continue;
				}
				
				this._selectedRows.splice(this._selectedRows.indexOf(row), 1);
				
				if (row._tr) { row._tr.removeClassName(flagrate.className + '-grid-row-selected'); }
				
				if (row._checkbox) { row._checkbox.uncheck(); }
				
				if (row.onDeselect)  { row.onDeselect(window.event, row); }
				if (this.onDeselect) { this.onDeselect(window.event, row); }
			}
			
			if (this._selectedRows.length === 0 && this._checkbox) {
				this._checkbox.uncheck();
			}
			
			this.element.fire('change');
			
			return this;
		}
		,
		/*?
		 *  flagrate.Grid#selectAll() -> flagrate.Grid
		 *
		 *  select all rows
		**/
		selectAll: function () {
			return this.select(this.rows);
		}
		,
		/*?
		 *  flagrate.Grid#deselectAll() -> flagrate.Grid
		 *
		 *  deselect all rows
		**/
		deselectAll: function () {
			return this.deselect(this.rows);
		}
		,
		/*?
		 *  flagrate.Grid#getSelectedRows() -> Array
		 *
		 *  get selected rows
		**/
		getSelectedRows: function () {
			return this._selectedRows;
		}
		,
		/*?
		 *  flagrate.Grid#sort(key[, isAsc = true]) -> flagrate.Grid
		 *  - key   (String)
		 *  - isAsc (Boolean)
		 *
		 *  sort rows by key
		**/
		sort: function (key, isAsc) {
			
			if (isAsc === void 0) { isAsc = true; }
			
			this.rows.sort(function (a, b) {
				
				var A = 0;
				var B = 0;
				
				if (a.cell[key]) {
					A = (a.cell[key].sortAlt !== void 0) ? a.cell[key].sortAlt : a.cell[key].text || a.cell[key].html || (a.cell[key].element && a.cell[key].element.innerHTML) || (a.cell[key]._div && a.cell[key]._div.innerHTML) || 0;
				}
				if (b.cell[key]) {
					B = (b.cell[key].sortAlt !== void 0) ? b.cell[key].sortAlt : b.cell[key].text || b.cell[key].html || (b.cell[key].element && b.cell[key].element.innerHTML) || (b.cell[key]._div && b.cell[key]._div.innerHTML) || 0;
				}
				
				return A === B ? 0 : (A > B ? 1 : -1);
			});
			
			if (isAsc === false) { this.rows.reverse(); }
			
			var i, l;
			for (i = 0, l = this.cols.length; i < l; i++) {
				if (this.cols[i].key === key) {
					if (this.cols[i]._th) {
						if (isAsc) {
							this.cols[i]._th.addClassName(flagrate.className + '-grid-col-sorted-asc');
							this.cols[i]._th.removeClassName(flagrate.className + '-grid-col-sorted-desc');
						} else {
							this.cols[i]._th.addClassName(flagrate.className + '-grid-col-sorted-desc');
							this.cols[i]._th.removeClassName(flagrate.className + '-grid-col-sorted-asc');
						}
					}
					
					this.cols[i].isSorted = true;
					this.cols[i].isAsc    = isAsc;
					
					this.sortedByKey = key;
					this.sortedByAsc = isAsc;
				} else {
					if (this.cols[i].isSorted && this.cols[i]._th) {
						this.cols[i]._th.removeClassName(flagrate.className + '-grid-col-sorted-asc').removeClassName(flagrate.className + '-grid-col-sorted-desc');
					}
					
					this.cols[i].isSorted = false;
					this.cols[i].isAsc    = null;
				}
			}
			
			this._requestRender();
			
			return this;
		}
		,
		/*?
		 *  flagrate.Grid#unshift(row) -> Number
		 *  - row (Object|Array)
		 *
		 *  unshift row(s)
		**/
		unshift: function (r) {
			
			if (r instanceof Array) {
				var i, l;
				for (i = 0, l = r.length; i < l; i++) {
					this.rows.unshift(r[i]);
				}
			} else {
				this.rows.unshift(r);
			}
			
			if (this.sortedByKey === null) {
				this._requestRender();
			} else {
				this.sort(this.sortedByKey, this.sortedByAsc);
			}
			
			return this.rows.length;
		}
		,
		/*?
		 *  flagrate.Grid#push(row) -> Number
		 *  - row (Object|Array)
		 *
		 *  push row(s)
		**/
		push: function (r) {
			
			if (r instanceof Array) {
				var i, l;
				for (i = 0, l = r.length; i < l; i++) {
					this.rows.push(r[i]);
				}
			} else {
				this.rows.push(r);
			}
			
			if (this.sortedByKey === null) {
				this._requestRender();
			} else {
				this.sort(this.sortedByKey, this.sortedByAsc);
			}
			
			return this.rows.length;
		}
		,
		/*?
		 *  flagrate.Grid#shift([count = 1]) -> Object|Array
		 *  - count (Number)
		 *
		 *  shift row(s)
		**/
		shift: function (c) {
			
			c = c || 1;
			
			var removes = [];
			
			var i, l;
			for (i = 0, l = this.rows.length; i < l && i < c; i++) {
				removes.push(this.rows.shift());
			}
			
			this._requestRender();
			
			return c === 1 ? removes[0] : removes;
		}
		,
		/*?
		 *  flagrate.Grid#pop([count = 1]) -> Object|Array
		 *  - count (Number)
		 *
		 *  pop row(s)
		**/
		pop: function (c) {
			
			c = c || 1;
			
			var removes = [];
			
			var i, l;
			for (i = 0, l = this.rows.length; i < l && i < c; i++) {
				removes.push(this.rows.pop());
			}
			
			this._requestRender();
			
			return c === 1 ? removes[0] : removes;
		}
		,
		/*?
		 *  flagrate.Grid#splice(index[, howMany, row]) -> Array
		 *  - index   (Number) - Index at which to start changing the flagrate.Grid#rows.
		 *  - howMany (Number) - An integer indicating the number of old flagrate.Grid#rows to remove.
		 *  - row     (Object|Array) - The row(s) to add to the flagrate.Grid#rows.
		 *
		 *  Changes the content of a rows, adding new row(s) while removing old rows.
		**/
		splice: function (index, c, r) {
			
			c = typeof c === 'undefined' ? this.rows.length - index : c;
			
			var removes = this.rows.splice(index, c);
			
			if (r) {
				if (r instanceof Array === false) { r = [r]; }
				
				var i, l;
				for (i = 0, l = r.length; i < l; i++) {
					this.rows.splice(index + i, 0, r[i]);
				}
			}
			
			if (this.sortedByKey === null) {
				this._requestRender();
			} else {
				this.sort(this.sortedByKey, this.sortedByAsc);
			}
			
			return removes;
		}
		,
		/*?
		 *  flagrate.Grid#indexOf(row[, fromIndex = 0]) -> Number
		 *  - row       (Object) - row to locate in the flagrate.Grid.
		 *  - fromIndex (Number) - The index to start the search at.
		 *
		 *  Returns the index at which a given row can be found in the flagrate.Grid#rows, or -1 if it is not present.
		**/
		indexOf: function (r, index) {
			return this.rows.indexOf(r, index);
		}
		,
		/*?
		 *  flagrate.Grid#removeRow(row) -> Object|Array
		 *  - row (Object|Array) - row to locate in the flagrate.Grid.
		 *
		 *  remove row(s).
		**/
		removeRow: function (r) {
			
			var removes = [];
			var bulk    = false;
			
			if (r instanceof Array === false) {
				r = [r];
			}
			
			var i, l;
			for (i = 0, l = r.length; i < l; i++) {
				var index = this.indexOf(r[i]);
				if (index !== -1) { removes.push(this.splice(index, 1)); }
			}
			
			return bulk ? removes : removes[0];
		}
		,
		/*?
		 *  flagrate.Grid#disable() -> flagrate.Grid
		**/
		disable: function () {
			
			this.element.addClassName(flagrate.className + '-disabled');
			
			return this;
		}
		,
		/*?
		 *  flagrate.Grid#enable() -> flagrate.Grid
		**/
		enable: function () {
			
			this.element.removeClassName(flagrate.className + '-disabled');
			
			return this;
		}
		,
		/*?
		 *  flagrate.Grid#isEnabled() -> Boolean
		**/
		isEnabled: function () {
			return !this.element.hasClassName(flagrate.className + '-disabled');
		}
		,
		_create: function () {
			
			/*?
			 *  flagrate.Grid#element -> flagrate.Element
			 *
			 *  This is entity of Grid container. it's flagrate.Element.
			**/
			this.element = new Element('div');
			
			if (this.id)        { this.element.writeAttribute('id', this.id); }
			if (this.className) { this.element.writeAttribute('class', this.className); }
			if (this.attribute) { this.element.writeAttribute(this.attribute); }
			if (this.style)     { this.element.setStyle(this.style); }
			
			this.element.addClassName(flagrate.className + ' ' + flagrate.className + '-grid');
			
			if (this.headless) { this.element.addClassName(flagrate.className + '-grid-headless'); }
			
			// head container 
			this._head = new Element('div', { 'class': flagrate.className + '-grid-head' }).insertTo(this.element);
			this._thead = new Element('thead').insertTo(new Element('table').insertTo(this._head));
			
			// body container
			this._body = new Element('div', { 'class': flagrate.className + '-grid-body' }).insertTo(this.element);
			this._tbody = new Element('tbody').insertTo(new Element('table').insertTo(this._body));
			
			// style container
			this._style = new Element('style').insertTo(this.element);
			this._style.type = 'text/css';
			
			// head
			var tr = new Element('tr').insertTo(this._thead);
			
			if (this.disableCheckbox === false && this.disableSelect === false && this.multiSelect === true) {
				this._checkbox = new Checkbox({
					onCheck  : this.selectAll.bind(this),
					onUncheck: this.deselectAll.bind(this)
				}).insertTo(new Element('th', { 'class': flagrate.className + '-grid-cell-checkbox' }).insertTo(tr));
			}
			
			var i, l;
			for (i = 0, l = this.cols.length; i < l; i++) {
				var col = this.cols[i];
				
				col._id = this._id + '-col-' + i.toString(10);
				
				col._th  = new Element('th').insertTo(tr);
				
				if (col.id)        { col._th.writeAttribute('id', col.id); }
				if (col.className) { col._th.writeAttribute('class', col.className); }
				if (col.attribute) { col._th.writeAttribute(col.attribute); }
				if (col.style)     { col._th.setStyle(col.style); }
				
				col._th.addClassName(col._id);
				
				var width = !!col.width ? (col.width.toString(10) + 'px') : 'auto';
				this._style.insertText('.' + col._id + '{width:' + width + '}');
				
				if (col.align) { col._th.style.textAlign = col.align; }
				
				col._div = new Element().insertTo(col._th);
				
				if (col.label) { col._div.updateText(col.label); }
				
				if (col.icon) {
					col._div.addClassName(flagrate.className + '-icon');
					col._div.setStyle({
						backgroundImage: 'url(' + col.icon + ')'
					});
				}
				
				if (this.disableResize === false && !col.disableResize) {
					col._resizeHandle = new Element('div', {
						'class': flagrate.className + '-grid-col-resize-handle'
					}).insertTo(this.element);
					
					col._resizeHandle.onmousedown = this._createResizeHandleOnMousedownHandler(this, col);
				}
				
				if (this.disableSort === false && !col.disableSort) {
					col._th.addClassName(flagrate.className + '-grid-col-sortable');
					col._th.onclick = this._createColOnClickHandler(this, col);
				}
			}
			
			new Element('th', { 'class': this._id + '-col-last' }).insertTo(tr);
			this._style.insertText('.' + this._id + '-col-last:after{right:0}');
			
			// pagination (testing)
			if (this.pagination) {
				this.element.addClassName(flagrate.className + '-grid-pagination');
				// pager container 
				this._pager = new Toolbar({
					className: flagrate.className + '-grid-pager',
					items: [
						{
							key    : 'rn',
							element: new Element('span').insertText('-')
						},
						{
							key    : 'first',
							element: new Button({
								className: flagrate.className + '-grid-pager-first',
								onSelect : function () {
									this.pagePosition = 0;
									this._requestRender();
								}.bind(this)
							})
						},
						{
							key    : 'prev',
							element: new Button({
								className: flagrate.className + '-grid-pager-prev',
								onSelect : function () {
									--this.pagePosition;
									this._requestRender();
								}.bind(this)
							})
						},
						{
							key    : 'num',
							element: new Element('span', { 'class': flagrate.className + '-grid-pager-num' }).insertText('-')
						},
						{
							key    : 'next',
							element: new Button({
								className: flagrate.className + '-grid-pager-next',
								onSelect : function () {
									++this.pagePosition;
									this._requestRender();
								}.bind(this)
							})
						},
						{
							key    : 'last',
							element: new Button({
								className: flagrate.className + '-grid-pager-last',
								onSelect : function () {
									this.pagePosition = Math.floor(this.rows.length / this.numberOfRowsPerPage);
									this._requestRender();
								}.bind(this)
							})
						}
					]
				}).insertTo(this.element);
			}
			
			if (this.fill) {
				this.element.addClassName(flagrate.className + '-grid-fill');
				
				this._body.onscroll = this._createBodyOnScrollHandler(this);
			} else {
				this.element.onscroll = this._createOnScrollHandler(this);
			}
			
			return this;
		}
		,
		_requestRender: function () {
			
			if (this._renderTimer) { clearTimeout(this._renderTimer); }
			this._renderTimer = setTimeout(this._render.bind(this), 0);
			
			return this;
		}
		,
		_render: function () {
			
			if (this.onRender !== null && this.onRender(this) === false) {
				return this;
			}
			
			var isCheckable = (this.disableCheckbox === false && this.disableSelect === false && this.multiSelect === true);
			
			var i, j, row, col, cell, pl, pages, from, to;
			var rl = this.rows.length;
			var cl = this.cols.length;
			
			if (this.pagination) {
				pl    = 0;
				pages = Math.ceil(rl / this.numberOfRowsPerPage);
				if (pages <= this.pagePosition) { this.pagePosition = pages - 1; }
				if (this.pagePosition <= 0) { this.pagePosition = 0; }
				from  = this.pagePosition * this.numberOfRowsPerPage;
				to    = from + this.numberOfRowsPerPage;
			}
			
			this._tbody.update();
			
			for (i = 0; i < rl; i++) {
				if (this.pagination) {
					if (i < from) { continue; }
					if (i >= to)  { break; }
					++pl;
				}
				
				row = this.rows[i];
				
				if (!row._tr) { row._tr = new Element('tr'); }
				row._tr.insertTo(this._tbody);
				
				if (row.id)        { row._tr.writeAttribute('id', row.id); }
				if (row.className) { row._tr.writeAttribute('class', row.className); }
				if (row.attribute) { row._tr.writeAttribute(row.attribute); }
				if (row.style)     { row._tr.setStyle(row.style); }
				
				if (row.onClick || this.onClick || this.disableSelect === false) {
					if (this.disableSelect === false) {
						row._tr.addClassName(flagrate.className + '-grid-row-selectable');
					}
					if (row.onClick || this.onClick) {
						row._tr.addClassName(flagrate.className + '-grid-row-clickable');
					}
					
					row._tr.onclick = this._createRowOnClickHandler(this, row);
				}
				
				if (row.onDblClick || this.onDblClick) {
					row._tr.ondblclick = this._createRowOnDblClickHandler(this, row);
				}
				
				if (isCheckable && !row._checkbox) {
					row._checkbox = new Checkbox({
						onChange: this._createRowOnCheckHandler(this, row)
					}).insertTo(new Element('td', { 'class': flagrate.className + '-grid-cell-checkbox' }).insertTo(row._tr));
				}
				
				if (row.isSelected === true) { this.select(row); }
				
				for (j = 0; j < cl; j++) {
					col  = this.cols[j];
					cell = (row.cell[col.key] === void 0) ? (row.cell[col.key] = {}) : row.cell[col.key];
					
					if (typeof cell === 'string') {
						cell = row.cell[col.key] = { text: cell };
					}
					
					if (!cell._td) { cell._td = new Element('td'); }
					cell._td.insertTo(row._tr);
					
					if (cell.id)        { cell._td.writeAttribute('id', cell.id); }
					if (cell.className) { cell._td.writeAttribute('class', cell.className); }
					if (cell.attribute) { cell._td.writeAttribute(cell.attribute); }
					if (cell.style)     { cell._td.setStyle(cell.style); }
					
					if (col.align) { cell._td.style.textAlign = col.align; }
					
					cell._td.addClassName(col._id);
					
					if (!cell._div) { cell._div = new Element(); }
					cell._div.insertTo(cell._td);
					
					if (cell.text)    { cell._div.updateText(cell.text); }
					if (cell.html)    { cell._div.update(cell.html); }
					if (cell.element) { cell._div.update(cell.element); }
					
					if (cell.icon) {
						cell._div.addClassName(flagrate.className + '-icon');
						cell._div.setStyle({
							backgroundImage: 'url(' + cell.icon + ')'
						});
					}
					
					if (cell.onClick) {
						cell._td.addClassName(flagrate.className + '-grid-cell-clickable');
						
						cell._td.onclick = this._createCellOnClickHandler(this, cell);
					}
					
					if (cell.onDblClick) {
						cell._td.ondblclick = this._createCellOnDblClickHandler(this, cell);
					}
					
					// post-processing
					if (cell.postProcess) { cell.postProcess(cell._td); }
				}
				
				if (!row._last) { row._last = new Element('td', { 'class': this._id + '-col-last' }); }
				row._last.insertTo(row._tr);
				
				// menu
				if (row.menuItems) {
					row._last.addClassName(flagrate.className + '-grid-cell-menu');
					
					//row
					if (row._menu) { row._menu.remove(); }
					row._menu = new ContextMenu({
						target: row._tr,
						items : row.menuItems
					});
					
					row._last.onclick = this._createLastRowOnClickHandler(this, row);
				}
				
				// post-processing
				if (row.postProcess) { row.postProcess(row._tr); }
				if (this.postProcessOfRow) { this.postProcessOfRow(row._tr); }
			}//<--for
			
			if (this.pagination) {
				this._pager.getElementByKey('rn').updateText((from + 1) + ' - ' + (from + pl) + ' / ' + rl);
				this._pager.getElementByKey('num').updateText((this.pagePosition + 1) + ' / ' + pages);
			}
			
			if (this.disableResize === false) {
				if (this.fill) {
					this._head.style.right = (this._body.offsetWidth - this._body.clientWidth) + 'px';
					this._head.scrollLeft = this._body.scrollLeft;
				}
				
				this._updateLayoutOfCols();
				this._updatePositionOfResizeHandles();
			}
			
			if (this.onRendered !== null) { this.onRendered(this); }
			
			return this;
		}
		,
		_updatePositionOfResizeHandles: function () {
			
			var adj = this.fill ? -this._body.scrollLeft : 0;
			
			var col;
			
			var i, l;
			for (i = 0, l = this.cols.length; i < l; i++) {
				col = this.cols[i];
				
				if (col._resizeHandle) {
					col._resizeHandle.style.left = (col._th.offsetLeft + col._th.getWidth() + adj) + 'px';
				}
			}
			
			return this;
		}
		,
		_updateLayoutOfCols: function () {
			
			var col;
			
			var i, l;
			for (i = 0, l = this.cols.length; i < l; i++) {
				col = this.cols[i];
				
				if (col.width) { continue; }
				
				col.width = col._th.getWidth();
				
				this._style.updateText(
					this._style.innerHTML.replace(
						new RegExp('('+ col._id + '{width:)([^}]*)}'),
						'$1' + col.width + 'px}'
					)
				);
			}
			
			this.element.addClassName(flagrate.className + '-grid-fixed');
			
			setTimeout(function () {
				
				var base = this.fill ? this._body : this.element;
				this._style.updateText(
					this._style.innerHTML.replace(
						new RegExp('(' + this._id + '-col-last:after{right:)([^}]*)}'),
						'$1' + (base.scrollWidth - base.clientWidth - base.scrollLeft) + 'px!important}'
					)
				);
			}.bind(this), 0);
			
			return this;
		}
		,
		_createOnScrollHandler: function (that) {
			
			return function (e) {
				
				if (that.disableResize === false) { that._updateLayoutOfCols(); }
			};
		}
		,
		_createBodyOnScrollHandler: function (that) {
			
			return function (e) {
				
				that._head.style.right = (that._body.offsetWidth - that._body.clientWidth) + 'px';
				that._head.scrollLeft = that._body.scrollLeft;
				
				if (that.disableResize === false) {
					that._updateLayoutOfCols();
					that._updatePositionOfResizeHandles();
				}
			};
		}
		,
		_createColOnClickHandler: function (that, col) {
			
			return function (e) {
				
				that.sort(col.key, !col.isAsc);
			};
		}
		,
		_createRowOnClickHandler: function (that, row) {
			
			return function (e) {
				
				if (that.isEnabled() === false) { return; }
				
				if (row.onClick)  { row.onClick(e, row); }
				if (that.onClick) { that.onClick(e, row); }
				
				if (that.disableSelect === false) {
					if (row.isSelected === true) {
						that.deselect(row);
					} else {
						that.select(row);
					}
				}
			};
		}
		,
		_createRowOnDblClickHandler: function (that, row) {
			
			return function (e) {
				
				if (that.isEnabled() === false) { return; }
				
				if (row.onDblClick)  { row.onDblClick(e, row); }
				if (that.onDblClick) { that.onDblClick(e, row); }
			};
		}
		,
		_createCellOnClickHandler: function (that, cell) {
			
			return function (e) {
				
				if (that.isEnabled() === false) { return; }
				
				if (cell.onClick) { cell.onClick(e, cell); }
			};
		}
		,
		_createCellOnDblClickHandler: function (that, cell) {
			
			return function (e) {
				
				if (that.isEnabled() === false) { return; }
				
				if (cell.onDblClick) { cell.onDblClick(e, cell); }
			};
		}
		,
		_createRowOnCheckHandler: function (that, row) {
			
			return function (e) {
				
				if (that.isEnabled() === false) {
					e.targetCheckbox.uncheck();
					return;
				}
				
				e.stopPropagation();
				
				if (that.disableSelect === false) {
					if (row.isSelected === true) {
						that.deselect(row);
					} else {
						that.select(row);
					}
				}
			};
		}
		,
		_createLastRowOnClickHandler: function (that, row) {
			
			return function (e) {
				
				if (that.isEnabled() === false) { return; }
				
				e.stopPropagation();
				
				if (row._menu) { row._menu.open(e); }
			};
		}
		,
		_createResizeHandleOnMousedownHandler: function (that, col) {
			
			return function (e) {
				
				//e.stopPropagation();
				e.preventDefault();
				
				var current = e.clientX;
				var origin  = current;
				
				var onMove = function (e) {
					
					e.preventDefault();
					
					var delta = e.clientX - current;
					current += delta;
					
					col._resizeHandle.style.left = (parseInt(col._resizeHandle.style.left.replace('px', ''), 10) + delta) + 'px';
				};
				
				var onUp = function (e) {
					
					e.preventDefault();
					
					document.body.removeEventListener('mousemove', onMove, true);
					document.body.removeEventListener('mouseup',   onUp, true);
					
					var delta = e.clientX - origin;
					var w     = col._th.getWidth() + delta;
					w = col.width = w < 0 ? 0 : w;
					
					that._style.updateText(
						that._style.innerHTML.replace(new RegExp('('+ col._id + '{width:)([^}]*)}'), '$1' + w + 'px}')
					);
					
					that._updateLayoutOfCols();
					that._updatePositionOfResizeHandles();
				};
				
				document.body.addEventListener('mousemove', onMove, true);
				document.body.addEventListener('mouseup',   onUp, true);
			};
		}
	};
	
	/*?
	 *  class flagrate.Form
	 *
	 *  This is **NOT** stable for now. testing.
	 *  some required methods are missing.
	**/
	
	/*?
	 *  flagrate.createForm(option)
	 *  new flagrate.Form(option)
	 *  - option (Object) - configuration.
	 *  
	 *  Create and initialize the Form.
	 *  
	 *  #### option
	 *  
	 *  * `fields`                   (Array; default `[]`): of **[field](#field)** object.
	 *  * `id`                       (String): `id` attribute of container.
	 *  * `className`                (String): `class` attribute of container.
	 *  * `attribute`                (Object): additional attribute of container.
	 *  * `style`                    (Object): style of container. (using flagrate.Element.setStyle)
	 *  * `nolabel`                  (Boolean; default `false`): hide labels.
	 *  * `vertical`                 (Boolean; default `false`): vertical label style.
	 *  
	 *  #### field
	 *  
	 *  * `key`                      (String):
	 *  * `pointer`                  (String|null):
	 *  * `label`                    (String; default `""`):
	 *  * `icon`                     (String):
	 *  * `text`                     (String):
	 *  * `html`                     (String):
	 *  * `element`                  (Element):
	 *  * `input`                    (Object): see **[input](#input)**
	 *  * `depends`                  (Array): of **[depend](#depend)**
	 *  * `id`                       (String): `id` attribute of container.
	 *  * `className`                (String): `class` attribute of container.
	 *  * `attribute`                (Object): additional attribute of container.
	 *  * `style`                    (Object): style of container. (using flagrate.Element.setStyle)
	 *
	 *  #### input
	 *
	 *  * `type`                     (String|Object; **required**): **[inputtype](#inputType)** String or Object
	 *  * `option`                   (Object): *(see the options for each type)*
	 *  * `isRequired`               (Boolean; default `false`):
	 *  * `min`                      (Number): (simple validator)
	 *  * `max`                      (Number): (simple validator)
	 *  * `minLength`                (Number): (simple validator)
	 *  * `maxLength`                (Number): (simple validator)
	 *  * `validators`               (Array): of **[inputValidator](#inputvalidator)** String or Object or Function.
	 *  * `toString`                 (Boolean; default `false`):
	 *  * `trim`                     (Boolean; default `false`):
	 *  * `toNumber`                 (Boolean; default `false`):
	 *  * `transform`                (Function): alternate result transform/converting function. (only sync)
	 *
	 *  #### depend
	 *
	 *  * `key`                      (String): unique key for identifying fields. if looking result, must change to use the pointer.
	 *  * `pointer`                  (String):
	 *  * `val`                      (any):
	 *  * `op`                       (String): `===`, `!==`, `>=`, `<=`, `>`, `<`, `in`
	 *  * `tester`                   (Function): alternate testing function. this disables normal testing. (only sync)
	 *
	 *  #### inputType
	 *
	 *  if specified a String, will use flagrate.Form.inputType[(specified)].
	 *
	 *  #### inputValidator
	 *
	 *  if specified a String, will use flagrate.Form.inputValidator[(specified)].
	 *
	 *      // Example: custom validator
	 *      validators: [
	 *        // using regex:
	 *        {
	 *          regexp: /^[a-z0-9]+(-[a-z0-9]+)*(\.([a-z0-9]+(-[a-z0-9]+)*))*$/i,
	 *          error: 'Please enter a valid hostname string.'
	 *        },
	 *        // using async function:
	 *        function (input, done) {
	 *          someAsyncFunction(input, function (err, result) {
	 *            if (err) {
	 *              done('error', 'This hostname is already in use. (' + err + ')');
	 *            } else {
	 *              done('success');
	 *            }
	 *          });
	 *        },
	 *        // using sync function:
	 *        function (input, done) {
	 *          var err = someSyncFunction(input);
	 *          if (err) {
	 *            done('error', 'This hostname is prohibited. (' + err + ')');
	 *          } else {
	 *            done('success');
	 *          }
	 *        }
	 *      ]
	 *
	 *  see flagrate.Form.inputValidator to read more documents.
	**/
	var Form = flagrate.Form = function (opt) {
		
		opt = opt || {};
		
		this.id                  = opt.id                  || null;
		this.className           = opt.className           || null;
		this.attribute           = opt.attribute           || null;
		this.style               = opt.style               || null;
		this.nolabel             = opt.nolabel             || false;
		this.vertical            = opt.vertical            || false;
		
		this.fields = [];
		
		this._create();
		
		if (opt.fields && opt.fields.length !== 0) {
			this.push(opt.fields);
		}
		
		return this;
	};
	
	flagrate.createForm = function (a) {
		return new Form(a);
	};
	
	Form.idCounter = 0;
	
	Form.prototype = {
		/*?
		 *  flagrate.Form#insertTo(element[, position = "bottom"]) -> flagrate.Form
		 *
		 *  please refer to flagrate.Element.insertTo
		**/
		insertTo: function (element, pos) {
			return this.element.insertTo(element, pos) && this;
		},
		
		/*?
		 *  flagrate.Form#getResult() -> Object
		 *
		 *  Returns a result Object.
		**/
		getResult: function () {
			
			var result = {};
			
			var i, l, j, m, field, key;
			for (i = 0, l = this.fields.length; i < l; i++) {
				field = this.fields[i];
				
				if ((!field.key && typeof field.pointer !== 'string') || field._dependsIsOk !== true) { continue; }
				
				if (field.pointer === null) { continue; }
				
				if (typeof field.pointer === 'string') {
					jsonPointer.set(result, field.pointer, field.getVal());
				} else if (field.key) {
					result[field.key] = field.getVal();
				}
			}
			
			return result;
		},
		
		/*?
		 *  flagrate.Form#validate([done]) -> flagrate.Form
		 *  - done (Function) - callback when the validation is done.
		 *
		 *  #### Example
		 *
		 *      form.validate(function(success) {
		 *        if (success) {
		 *          console.log('form is valid.');
		 *        } else {
		 *          console.log('form is invalid.');
		 *        }
		 *      });
		**/
		validate: function (callback) {
			
			var i, l, j, m, field, fields = [], run;
			
			for (i = 0, l = this.fields.length; i < l; i++) {
				field = this.fields[i];
				
				if (field._dependsIsOk === true && field.input && field.input._type) {
					fields.push(field);
				}
			}
			
			var hasError = false;
			
			var fin = function () {
				if (callback) { callback(!hasError); }
			};
			
			var done = function (result) {
				
				if (result === false) {
					hasError = true;
				}
				
				run();
			};
			
			run = function () {
				
				if (fields.length === 0) { return fin(); }
				
				fields.shift().validate(done);
			};
			run();
			
			return this;
		},
		
		/*?
		 *  flagrate.Form#enable() -> flagrate.Form
		**/
		enable: function () {
			
			var i, l, field;
			
			for (i = 0, l = this.fields.length; i < l; i++) {
				field = this.fields[i];
				
				if (field.input && field.input._type) {
					field.input._type.enable.call(field.input);
				}
			}
			
			return this;
		},
		
		/*?
		 *  flagrate.Form#disable() -> flagrate.Form
		**/
		disable: function () {
			
			var i, l, field;
			
			for (i = 0, l = this.fields.length; i < l; i++) {
				field = this.fields[i];
				
				if (field.input && field.input._type) {
					field.input._type.disable.call(field.input);
				}
			}
			
			return this;
		},
		
		/*?
		 *  flagrate.Form#getField(key) -> Object | null
		 *  - key (String) - specified field key.
		**/
		getField: function (key) {
			
			var i, l, field;
			for (i = 0, l = this.fields.length; i < l; i++) {
				field = this.fields[i];
				
				if (field.key && field.key === key) {
					return field;
				}
			}
			
			return null;
		},
		
		/*?
		 *  flagrate.Form#push(field) -> Number
		 *  - field (Object|Array)
		 *
         *  push field(s)
		**/
		push: function (f) {
			
			var i, l;
			
			if (f instanceof Array) {
				for (i = 0, l = f.length; i < l; i++) {
					this._createField(f[i]);
					this.fields.push(f[i]);
				}
			} else {
				this._createField(f);
				this.fields.push(f);
			}
			
			for (i = 0, l = this.fields.length; i < l; i++) {
				this._collectFieldRefs(this.fields[i]);
				this._checkFieldDepends(this.fields[i]);
			}
			
			this._requestRender();
			
			return this.fields.length;
		},
		
		/*?
		 *  flagrate.Form#splice(index[, howMany, field]) -> Array
		 *  - index   (Number) - Index at which to start changing the flagrate.Form#fields.
		 *  - howMany (Number) - An integer indicating the number of old flagrate.Form#fields to remove.
		 *  - field   (Object|Array) - The row(s) to add to the flagrate.Form#fields.
		 *
		 *  Changes the content of a fields, adding new field(s) while removing old field(s).
		**/
		splice: function (index, c, f) {
			
			var i, l;
			
			c = typeof c === 'undefined' ? this.fields.length - index : c;
			
			var removes = this.fields.splice(index, c);
			
			for (i = 0, l = removes.length; i < l; i++) {
				if (removes[i]._div) {
					removes[i]._div.remove();
					delete removes[i]._div;
				}
			}
			
			if (f) {
				if (f instanceof Array === false) { f = [f]; }
				
				for (i = 0, l = f.length; i < l; i++) {
					this._createField(f[i]);
					this.fields.splice(index + i, 0, f[i]);
				}
			}
			
			for (i = 0, l = this.fields.length; i < l; i++) {
				this._collectFieldRefs(this.fields[i]);
				this._checkFieldDepends(this.fields[i]);
			}
			
			this._requestRender();
			
			return removes;
		},
		
		/*?
		 *  flagrate.Form#removeField(field) -> Object|Array
		 *  - field (Object|Array|String|Number) - field to locale in the flagrate.Form#fields. String is field#key.
		 *
		 *  remove field(s)
		**/
		removeField: function (f) {
			
			var removes = [];
			var bulk    = false;
			
			if (f instanceof Array === false) {
				f = [f];
			}
			
			var i, l;
			for (i = 0, l = f.length; i < l; i++) {
				var index = (typeof f[i] === 'number') ? f[i] : this.indexOf(f[i]);
				if (index !== -1) {
					removes.push(this.splice(index, 1));
				}
			}
			
			return bulk ? removes : removes[0];
		},
		
		/*?
		 *  flagrate.Form#indexOf(field) -> Object|Array
		 *  - field (Object|String) - field to locale in the flagrate.Form#fields.
		**/
		indexOf: function (f) {
			
			if (typeof f === 'string') {
				var index = -1;
				
				var i, l;
				for (i = 0, l = this.fields.length; i < l; i++) {
					if (this.fields[i].key === f) {
						index = i;
						break;
					}
				}
				
				return index;
			} else {
				return this.fields.indexOf(f);
			}
		},
		_create: function () {
			
			/*?
			 *  flagrate.Form#element -> flagrate.Element
			 *
			 *  This is entity of Form container. it's flagrate.Element.
			**/
			this.element = new Element('form');
			
			if (this.id)        { this.element.writeAttribute('id', this.id); }
			if (this.className) { this.element.writeAttribute('class', this.className); }
			if (this.attribute) { this.element.writeAttribute(this.attribute); }
			if (this.style)     { this.element.setStyle(this.style); }
			
			this.element.addClassName(flagrate.className + ' ' + flagrate.className + '-form');
			
			if (this.nolabel === true) {
				this.element.addClassName(flagrate.className + '-form-nolabel');
			}
			if (this.vertical === true) {
				this.element.addClassName(flagrate.className + '-form-vertical');
			}
			
			this.element.on('submit', function (e) {
				e.preventDefault();
			});
			
			return this;
		},
		_requestRender: function () {
			
			if (this._renderTimer) { clearTimeout(this._renderTimer); }
			this._renderTimer = setTimeout(this._render.bind(this), 0);
			
			return this;
		},
		_render: function () {
			
			var active = document.activeElement;
			
			var i, l, field;
			for (i = 0, l = this.fields.length; i < l; i++) {
				field = this.fields[i];
				
				if (field._dependsIsOk === true) {
					field._div.insertTo(this.element);
				} else {
					if (field.visible() === true) {
						field._div.remove();
					}
				}
			}
			
			if (active) {
				if (/Trident/.test(window.navigator.userAgent) === true) {
					setTimeout(function () {
						active.focus();
						
						var reselect = (
							(
								active.tagName === 'INPUT' && (
									active.type === 'text' ||
									active.type === 'password' ||
									active.type === 'number'
								)
							) ||
							active.tagName === 'TEXTAREA'
						);
						if (reselect) {
							if (typeof active.selectionStart === 'number') {
								active.selectionStart = active.selectionEnd = active.value.length;
							} else if (typeof active.createTextRange !== 'undefined') {
								var range = active.createTextRange();
								range.collapse(false);
								range.select();
							}
						}
					}, 0);
				} else {
					active.focus();
				}
			}
			
			return this;
		},
		_collectFieldRefs: function (field) {
			
			field._refs = [];
			
			if (typeof field.point !== 'undefined') {
				field.pointer = field.point;
				delete field.point;
			}
			if (!field.key && typeof field.pointer !== 'string') {
				return this;
			}
			
			var i, l, j, m, k, n, fi, s;
			for (i = 0, l = this.fields.length; i < l; i++) {
				fi = this.fields[i];
				
				if (field === fi || !fi.depends || fi.depends.length === 0) {
					continue;
				}
				
				for (j = 0, m = fi.depends.length; j < m; j++) {
					if (fi.depends[j] instanceof Array) {
						s = false;
						
						for (k = 0, n = fi.depends[j].length; k < n; k++) {
							if (fi.depends[j][k].key === field.key) {
								s = true;
								break;
							}
							if (typeof fi.depends[j][k].point === 'string') {
								fi.depends[j][k].pointer = fi.depends[j][k].point;
								delete fi.depends[j][k].point;
							}
							if (typeof fi.depends[j][k].pointer === 'string') {
								if (fi.depends[j][k].pointer === field.pointer) {
									s = true;
									break;
								}
								if (fi.depends[j][k].pointer === '/' + field.key) {
									s = true;
									break;
								}
							}
						}
						
						if (s) {
							field._refs.push(fi);
						}
						break;
					} else {
						if (fi.depends[j].key === field.key) {
							field._refs.push(fi);
							break;
						}
						if (typeof fi.depends[j].point === 'string') {
							fi.depends[j].pointer = fi.depends[j].point;
							delete fi.depends[j].point;
						}
						if (typeof fi.depends[j].pointer === 'string') {
							if (fi.depends[j].pointer === field.pointer) {
								field._refs.push(fi);
								break;
							}
							if (fi.depends[j].pointer === '/' + field.key) {
								field._refs.push(fi);
								break;
							}
						}
					}
				}
			}
			
			return this;
		},
		_compareDepend: function (d) {
			
			var v;
			
			if (d.key) {
				var f = this.getField(d.key);
				if (f !== null) {
					if (!d.op && !d.tester && d.val === void 0) {
						return true;
					}
					if (f._dependsIsOk === true) {
						v = f.getVal();
					}
				}
			} else if (typeof d.pointer === 'string') {
				try {
					v = jsonPointer.get(this.getResult(), d.pointer);
				} catch (e) {
					// undefined
				}
			} else {
				return true;
			}
			
			if (typeof d.tester === 'function') {
				return !!d.tester(v, d);
			}
			
			if (d.op) {
				if (d.op === '===' && d.val === v) { return true; }
				if (d.op === '!==' && d.val !== v) { return true; }
				if (d.op === '>=' && d.val >= v) { return true; }
				if (d.op === '<=' && d.val <= v) { return true; }
				if (d.op === '>' && d.val > v) { return true; }
				if (d.op === '<' && d.val < v) { return true; }
				if (d.op === 'in' && typeof v[d.val] !== 'undefined') { return true; }
			} else {
				if (d.val === v) {
					return true;
				}
			}
			
			return false;
		},
		_checkFieldDepends: function (field) {
			
			var depends = field.depends;
			
			if (!depends || depends.length === 0) {
				field._dependsIsOk = true;
				return true;
			}
			
			var result = true;
			var i, l, j, m, d, f, s;
			
			for (i = 0, l = depends.length; i < l; i++) {
				d = depends[i];
				
				if (d instanceof Array) {
					s = false;
					
					for (j = 0, m = d.length; j < m; j++) {
						if (this._compareDepend(d[j]) === true) {
							s = true;
							break;
						}
					}
					
					if (s === false) {
						result = false;
						break;
					}
				} else {
					if (this._compareDepend(d) === false) {
						result = false;
						break;
					}
				}
			}
			
			field._dependsIsOk = result;
			return result;
		},
		_createField: function (field) {
			
			field._dependsIsOk  = (!field.depends || field.depends.length === 0);
			//field._inputIsValid = null;
			
			// field container
			field._div = new Element('div');
			
			// attributes to field container
			if (field.id)        { field._div.writeAttribute('id', field.id); }
			if (field.className) { field._div.writeAttribute('class', field.className); }
			if (field.attribute) { field._div.writeAttribute(field.attribute); }
			if (field.style)     { field._div.setStyle(field.style); }
			
			// create label
			if (this.nolabel === false) {
				field._label = new Element('label').insertText(field.label || '');
				new Element('div', {
					'class': flagrate.className + '-form-field-label'
				}).insert(field._label).insertTo(field._div);
				
				// icon to label
				if (field.icon) {
					field._label.addClassName(flagrate.className + '-icon');
					field._label.setStyle({
						backgroundImage: 'url(' + field.icon + ')'
					});
				}
			}
			
			// input container
			field._inputC = new Element('div').insertTo(field._div);
			
			// input ready?
			if (field.input && field.input.type) {
				if (typeof field.input.type === 'string') {
					field.input._type = Form.inputType[field.input.type];
				} else {
					field.input._type = field.input.type;
				}
			}
			
			// init input
			if (field.input && field.input._type) {
				if (!field.input.id) {
					field.input.id = flagrate.className + '-form-input-' + (++Form.idCounter);
				}
				
				if (this.nolabel === false) { field._label.writeAttribute('for', field.input.id); }
				
				field.input.element = field.input._type.create.call(field.input);
				new Element('div', {
					'class': flagrate.className + '-form-field-input'
				}).insert(field.input.element).insertTo(field._inputC);
				
				field.input.element.writeAttribute('id', field.input.id);
				
				// value, values is alias but it's deprecated!
				if (field.input.value) {
					//console.warn('field.input.value is deprecated. please use field.input.val!');
					field.input.val = field.input.value;
				} else if (field.input.values) {
					//console.warn('field.input.values is deprecated. please use field.input.val!');
					field.input.val = field.input.values;
				}
				
				// set the default value
				if (field.input.val !== void 0) {
					field.input._type.setVal.call(field.input, field.input.val);
				}
				
				if (field.input.style) {
					field.input.element.setStyle(field.input.style);
				}
				
				// init validator
				if (field.input.validators) {
					field.input.validators.forEach(function (v, i) {
						if (typeof v === 'string') {
							field.input.validators[i] = flagrate.Form.inputValidator[v];
						}
					});
				} else {
					field.input.validators = [];
				}
				
				// result block
				field.input._result = new Element('ul', {
					'class': flagrate.className + '-form-field-result'
				}).insertTo(field._inputC);
				
				// etc
				if (field.input.isRequired === true) {
					field._div.addClassName(flagrate.className + '-required');
				}
			}
			
			// misc
			if (field.element) {
				new Element('div', {
					'class': flagrate.className + '-form-field-element'
				}).insert(field.element).insertTo(field._inputC);
			}
			if (field.html) {
				new Element('div', {
					'class': flagrate.className + '-form-field-html'
				}).insert(field.html).insertTo(field._inputC);
			}
			if (field.text) {
				new Element('p', {
					'class': flagrate.className + '-form-field-text'
				}).insertText(field.text).insertTo(field._inputC);
			}
			
			// field methods
			field.visible = function () {
				return (field._div.parentNode !== null && field._div.parentNode === this.element);
			}.bind(this);
			
			field.getVal = function () {
				
				if (!field.input) {
					return void 0;
				}
				
				var result = field.input._type.getVal.call(field.input);
				
				if (field.input.toString === true) {
					result = result.toString();
				}
				
				if (field.input.trim === true && typeof result === 'string') {
					result = result.trim();
				}
				
				if (field.input.toNumber === true && typeof result !== 'number') {
					if (typeof result === 'string') {
						result = parseFloat(result);
					} else if (result instanceof Date) {
						result = result.getTime();
					} else if (typeof result === 'boolean') {
						result = (result === true) ? 1 : 0;
					}
				}
				
				if (typeof field.input.transform === 'function') {
					result = field.input.transform.call(field.input, result);
				}
				
				return result;
			};
			
			field.setVal = function (val) {
				
				if (!field.input) {
					return field;
				}
				
				field.input._type.setVal.call(field.input, val);
				
				field._inputOnChange();
				
				return field;
			};
			
			field.validate = function (callback) {
				
				var val = field.getVal();
				
				var hasError   = false;
				var hasWarning = false;
				
				field.input._result.update();
				
				// simple validator
				if (field.input.isRequired === true) {
					if (val === void 0) {
						hasError = true;
					} else if (val === false || val === null) {
						hasError = true;
					} else if (typeof val === 'number' && isNaN(val) === true) {
						hasError = true;
					} else if ((val.length !== void 0) && val.length === 0) {
						hasError = true;
					}
				}
				if (field.input.min) {
					if (typeof val === 'number') {
						if (field.input.min > val) {
							hasError = true;
						}
					} else if (typeof val === 'string' && val !== '') {
						if (field.input.min > parseInt(val, 10)) {
							hasError = true;
						}
					} else if (val instanceof Array) {
						if (field.input.min > val.length) {
							hasError = true;
						}
					}
				}
				if (field.input.max) {
					if (typeof val === 'number') {
						if (field.input.max < val) {
							hasError = true;
						}
					} else if (typeof val === 'string' && val !== '') {
						if (field.input.max < parseInt(val, 10)) {
							hasError = true;
						}
					} else if (val instanceof Array) {
						if (field.input.max < val.length) {
							hasError = true;
						}
					}
				}
				if (field.input.minLength && field.input.minLength > (val.length || (val.toString && val.toString().length) || 0) && (typeof val === 'string' && val !== '')) {
					hasError = true;
				}
				if (field.input.maxLength && field.input.maxLength < (val.length || (val.toString && val.toString().length) || 0)) {
					hasError = true;
				}
				
				// validators
				var q = [];
				field.input.validators.forEach(function (v) {
					q.push(v);
				});
				
				var fin = function () {
					if (field.input._result.innerHTML === '') {
						field._div.removeClassName(flagrate.className + '-has-result');
					} else {
						field._div.addClassName(flagrate.className + '-has-result');
					}
					
					if (hasError) {
						field._div.removeClassName(flagrate.className + '-has-warning');
						field._div.removeClassName(flagrate.className + '-has-success');
						field._div.addClassName(flagrate.className + '-has-error');
					} else if (hasWarning) {
						field._div.removeClassName(flagrate.className + '-has-error');
						field._div.removeClassName(flagrate.className + '-has-success');
						field._div.addClassName(flagrate.className + '-has-warning');
					} else {
						field._div.removeClassName(flagrate.className + '-has-error');
						field._div.removeClassName(flagrate.className + '-has-warning');
						field._div.addClassName(flagrate.className + '-has-success');
					}
					
					field._hasError   = hasError;
					field._hasWarning = hasWarning;
					
					if (callback) { callback(!hasError); }
				};
				
				var run;
				
				var done = function (result, message) {
					
					switch (result) {
					case true:
					case 'success':
						break;
					case null:
					case 'warning':
						hasWarning = true;
						break;
					case false:
					case 'error':
						hasError = true;
						break;
					}
					
					if (message) {
						new Element('li').insertText(message).insertTo(field.input._result);
					}
					
					run();
				};
				
				run = function () {
					
					if (q.length === 0 || hasError === true) { return fin(); }
					
					var v = q.shift();
					
					if (typeof v === 'function') {
						v.call(field.input, val, done);
					} else if (typeof val === 'string' && val !== ''){
						if (v.regexp.test(val)) {
							done(true, v.success);
						} else {
							done(false, v.error);
						}
					} else {
						done(true);
					}
				};
				
				run();
			};
			
			field._checkRefs = function () {
				
				var rerend = false;
				
				var i, l, refField;
				for (i = 0, l = field._refs.length; i < l; i++) {
					refField = field._refs[i];
					if (refField._dependsIsOk !== this._checkFieldDepends(refField)) {
						refField._checkRefs();
						rerend = true;
					}
				}
				
				if (rerend === true) {
					this._requestRender();
				}
			}.bind(this);
			
			field._inputOnChange = function () {
				
				// validation
				field.validate();
				
				// dependency
				field._checkRefs();
			};
			
			// listen change event
			if (field.input && field.input._type) {
				var changeEvents = field.input._type.changeEvents || ['change'];
				changeEvents.forEach(function (eventName) {
					field.input.element.on(eventName, field._inputOnChange);
				});
			}
			
			return this;
		}//<--_createField
	};
	
	/*?
	 *  flagrate.Form.inputValidator -> Object
	 *
	 *  #### Built-in validators
	 *
	 *  * numeric
	 *  * alphanumeric
	 *
	 *  #### Basic validator
	 *
	 *      // success and error messages are optional
	 *      { regexp: /RegExp/, success: 'String', error: 'String' }
	 *      // warning state is not available in this way, see Advanced.
	 *
	 *  #### Advanced validator
	 *
	 *      // Sync or Async validation
	 *      function (input, done) { done(result, message); }// message is optional
	 *
	 *      // Examples
	 *      function (input, done) { done(true); }// success
	 *      function (input, done) { done(null); }// warning
	 *      function (input, done) { done(false); }// error
	 *      function (input, done) { done('success'); }// success
	 *      function (input, done) { done('warning'); }// warning
	 *      function (input, done) { done('error'); }// error
	 *      function (input, done) { done(true, '...'); }// success with message
	 *      function (input, done) { done(null, '...'); }// warning with message
	 *      function (input, done) { done(false, '...'); }// error with message
	 *
	 *  #### Example: adding error message to built-in validators
	 *
	 *      flagrate.Form.inputValidator.numeric.error = 'Please enter a numbers.';
	 *      flagrate.Form.inputValidator.alphanumeric.error = 'Please enter a alphanumeric.';
	 *
	 *  #### Example: add the custom validator to Flagrate (to create plugin)
	 *
	 *      flagrate.Form.inputValidator.hostname = {
	 *        regexp: /^[a-z0-9]+(-[a-z0-9]+)*(\.([a-z0-9]+(-[a-z0-9]+)*))*$/i,
	 *        error: 'Please enter a valid hostname string.'
	 *      };
	**/
	Form.inputValidator = {
		numeric: {
			regexp: /^[0-9]+$/
		},
		alphanumeric: {
			regexp: /^[a-z0-9]+$/i
		}
	};
	
	/*?
	 *  flagrate.Form.inputType -> Object
	 *
	 *  #### Built-in input types
	 *
	 *  * [text](#text-string-) -> `String`
	 *  * [password](#password-string-) -> `String`
	 *  * [textarea](#textarea-string-) -> `String`
	 *  * [number](#number-number-) -> `Number`
	 *  * [combobox](#combobox-string-) -> `String`
	 *  * [checkbox](#checkbox-boolean-) -> `Boolean`
	 *  * [checkboxes](#checkboxes-array-) -> `Array`
	 *  * [switch](#switch-boolean-) -> `Boolean`
	 *  * [radios](#radios-any-) -> `any`
	 *  * [select](#select-any-array-) -> `any`|`Array`
	 *  * [file](#file-file-) -> `File`
	 *  * [files](#files-filelist-) -> `FileList`
	**/
	Form.inputType = {};
	
	/*?
	 *  #### text -> `String`
	 *  most basic single-line text input. (uses flagrate.TextInput)
	 *
	 *  * `placeholder` (String):
	 *  * `icon`        (String):
	 *  * `maxLength`   (Number):
	**/
	Form.inputType.text = {
		changeEvents: ['change', 'keyup'],
		create: function () {
			// return to define this.element
			return new TextInput({
				placeholder: this.placeholder,
				icon       : this.icon,
				attribute  : {
					maxlength: this.maxLength
				}
			});
		},
		getVal: function () {
			return this.element.getValue();
		},
		setVal: function (value) {
			this.element.setValue(value);
		},
		enable: function () {
			this.element.enable();
		},
		disable: function () {
			this.element.disable();
		}
	};
	
	/*?
	 *  #### password -> `String`
	 *  password input. Almost the same to [text](#text).
	**/
	Form.inputType.password = {
		changeEvents: ['change', 'keyup'],
		create: function () {
			return new TextInput({
				placeholder: this.placeholder,
				icon       : this.icon,
				attribute  : {
					type     : 'password',
					maxlength: this.maxLength
				}
			});
		},
		getVal: Form.inputType.text.getVal,
		setVal: Form.inputType.text.setVal,
		enable: Form.inputType.text.enable,
		disable: Form.inputType.text.disable
	};
	
	/*?
	 *  #### textarea -> `String`
	 *  textarea input. (uses flagrate.TextArea)
	 *
	 *  * `placeholder` (String):
	 *  * `icon`        (String):
	 *  * `maxLength`   (Number):
	**/
	Form.inputType.textarea = {
		changeEvents: ['change', 'keyup'],
		create: function () {
			return new TextArea({
				placeholder: this.placeholder,
				icon       : this.icon,
				attribute  : {
					maxlength: this.maxLength
				}
			});
		},
		getVal: Form.inputType.text.getVal,
		setVal: Form.inputType.text.setVal,
		enable: Form.inputType.text.enable,
		disable: Form.inputType.text.disable
	};
	
	/*?
	 *  #### number -> `Number`
	 *  number input. (uses flagrate.TextInput)
	 *
	 *  * `placeholder` (String):
	 *  * `icon`        (String):
	 *  * `min`         (Number):
	 *  * `max`         (Number):
	 *  * `maxLength`   (Number):
	**/
	Form.inputType.number = {
		changeEvents: ['change', 'keyup'],
		create: function () {
			return new TextInput({
				placeholder: this.placeholder,
				icon       : this.icon,
				attribute  : {
					type     : 'number',
					inputmode: 'numeric',
					min      : this.min,
					max      : this.max,
					maxlength: this.maxLength
				}
			});
		},
		getVal: function () {
			return parseFloat(this.element.getValue());
		},
		setVal: Form.inputType.text.setVal,
		enable: Form.inputType.text.enable,
		disable: Form.inputType.text.disable
	};
	
	/*?
	 *  #### combobox -> `String`
	 *  combobox input. (uses flagrate.ComboBox)
	 *
	 *  * `placeholder` (String):
	 *  * `icon`        (String):
	 *  * `maxLength`   (Number):
	 *  * `items`       (Array): of String values.
	**/
	Form.inputType.combobox = {
		changeEvents: ['change', 'keyup'],
		create: function () {
			return new ComboBox({
				placeholder: this.placeholder,
				icon       : this.icon,
				items      : this.items,
				attribute  : {
					maxlength: this.maxLength
				}
			});
		},
		getVal: Form.inputType.text.getVal,
		setVal: Form.inputType.text.setVal,
		enable: Form.inputType.text.enable,
		disable: Form.inputType.text.disable
	};
	
	/*?
	 *  #### checkbox -> `Boolean`
	 *  Checkbox input. (uses flagrate.Checkbox)
	 *
	 *  * `label`       (String):
	 *  * `icon`        (String):
	**/
	Form.inputType.checkbox = {
		create: function () {
			return new Checkbox({
				icon : this.icon,
				label: this.label
			});
		},
		getVal: function () {
			return this.element.isChecked();
		},
		setVal: function (value) {
			if (value) {
				this.element.check();
			} else {
				this.element.uncheck();
			}
		},
		enable: Form.inputType.text.enable,
		disable: Form.inputType.text.disable
	};
	
	/*?
	 *  #### checkboxes -> `Array`
	 *  Checkboxes input. (uses flagrate.Checkboxes)
	 *
	 *  * `items` (Array):
	**/
	Form.inputType.checkboxes = {
		create: function () {
			return new Checkboxes({
				items: this.items
			});
		},
		getVal: function () {
			return this.element.getValues();
		},
		setVal: function (values) {
			this.element.setValues(values);
		},
		enable: Form.inputType.text.enable,
		disable: Form.inputType.text.disable
	};
	
	/*?
	 *  #### switch -> `Boolean`
	 *  Switch input. (uses flagrate.Switch)
	**/
	Form.inputType['switch'] = {
		create: function () {
			return new Switch();
		},
		getVal: function () {
			return this.element.isOn();
		},
		setVal: function (value) {
			if (value) {
				this.element.switchOn();
			} else {
				this.element.switchOff();
			}
		},
		enable: Form.inputType.text.enable,
		disable: Form.inputType.text.disable
	};
	
	/*?
	 *  #### radios -> `any`
	 *  Radio buttons input. (uses flagrate.Radios)
	 *
	 *  * `items` (Array):
	**/
	Form.inputType.radios = {
		create: function () {
			return new Radios({
				items: this.items
			});
		},
		getVal: Form.inputType.text.getVal,
		setVal: Form.inputType.text.setVal,
		enable: Form.inputType.text.enable,
		disable: Form.inputType.text.disable
	};
	
	/*?
	 *  #### select -> `any`|`array`
	 *  Select input. (uses flagrate.Select)
	 *
	 *  * `items` (Array):
	 *  * `listView` (Boolean; default `false`):
	 *  * `multiple` (Boolean; default `false`):
	 *  * `max` (Number; default `-1`):
	 *  * `selectedIndex` (Number):
	 *  * `selectedIndexes` (Array): of Number
	**/
	Form.inputType.select = {
		create: function () {
			return new Select({
				items          : this.items,
				listView       : this.listView,
				multiple       : this.multiple,
				max            : this.max,
				selectedIndex  : this.selectedIndex,
				selectedIndexes: this.selectedIndexes
			});
		},
		getVal: function () {
			return (this.element.multiple === true) ? this.element.getValues() : this.element.getValue();
		},
		setVal: function (val) {
			if (this.element.multiple === false) {
				val = [val];
			} else {
				this.element.deselectAll();
			}
			
			var i, j, l, m;
			for (i = 0, l = val.length, m = this.element.items.length; i < l; i++) {
				for (j = 0; j < m; j++) {
					if (val[i] === this.element.items[j].value) {
						this.element.select(j);
						break;
					}
				}
			}
		},
		enable: Form.inputType.text.enable,
		disable: Form.inputType.text.disable
	};
	
	/*?
	 *  #### file -> `File`
	 *  File input for [File API](http://www.w3.org/TR/file-upload/)
	**/
	Form.inputType.file = {
		create: function () {
			return new Element('input', {
				type: 'file'
			});
		},
		getVal: function () {
			return this.element.files[0];
		},
		setVal: function (file) {
			this.element.files[0] = file;
		},
		enable: function () {
			this.element.writeAttribute('disabled', false);
		},
		disable: function () {
			this.element.writeAttribute('disabled', true);
		}
	};
	
	/*?
	 *  #### files -> `FileList`
	 *  File input for [File API](http://www.w3.org/TR/file-upload/)
	**/
	Form.inputType.files = {
		create: function () {
			return new Element('input', {
				type    : 'file',
				multiple: true
			});
		},
		getVal: function () {
			return this.element.files;
		},
		setVal: function (files) {
			this.element.files = files;
		},
		enable: function () {
			this.element.writeAttribute('disabled', false);
		},
		disable: function () {
			this.element.writeAttribute('disabled', true);
		}
	};
	
}());
