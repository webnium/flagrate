/*!
 * Flagrate
 *
 * Copyright (c) 2013 Yuki KAN and Flagrate Contributors
 * Licensed under the MIT-License.
 *
 * https://github.com/kanreisa/flagrate
**/
(function _flagrate() {
	
	"use strict";
	
	// flagrate global scope
	if (typeof window.flagrate !== 'undefined') {
		throw new Error('[conflict] flagrate is already defined.');
	}
	
	var flagrate = window.flagrate = {};
	
	flagrate.className = 'flagrate';
	
	var identity = flagrate.identity = function _id(a) {
		return a;
	};
	
	// deep copy a object
	var cloneObject = flagrate.objectCloner = function _cloneObject(object) {
		return JSON.parse(JSON.stringify(object));
	};
	
	// extend object
	var extendObject = flagrate.extendObject = function _extendObject(b, a) {
		for (var k in a) b[k] = a[k];
		return b;
	};
	
	/*?
	 *  class flagrate.Element
	**/
	
	/*?
	 *  new flagrate.Element([tagName = "div", attribute]) -> flagrate.Element
	 *  - tagName (String) - The name of the HTML element to create.
	 *  - attribute (Object) - An optional group of attribute/value pairs to set on the element.
	 *  
	 *  Creates an HTML element with `tagName` as the tag name, optionally with the given attributes.
	 *
	 *  ##### Example
	 *  
	 *      // The old way:
	 *      var a = document.createElement('a');
	 *      a.setAttribute('class', 'foo');
	 *      a.setAttribute('href', '/foo.html');
	 *      a.appendChild(document.createTextNode("Next page"));
	 *      x.appendChild(a);
	 *      
	 *      // The new way:
	 *      var a = new flagrate.Element('a', { 'class': 'foo', href: '/foo.html' }).insert("Next page").insertTo(x);
	**/
	var Element = flagrate.Element = function _Element(tagName, attr) {
		
		tagName = tagName || 'div';
		attr    = attr    || {};
		
		tagName = tagName.toLowerCase();
		
		if (Element.cache[tagName] || 'type' in attr) {
			var node = Element.cache[tagName].cloneNode(false);
		} else {
			var node = document.createElement(tagName);
			Element.cache[tagName] = node.cloneNode(false);
		}
		
		extendObject(node, this);
		
		return Element.writeAttribute(node, attr);
	};
	
	Element.cache = {};
	
	Element.prototype = {
		/*?
		 *  flagrate.Element#visible() -> Boolean
		 *
		 *  please refer to flagrate.Element.visible
		**/
		visible: function() {
			return Element.visible(this);
		}
		,
		/*?
		 *  flagrate.Element#toggle() -> flagrate.Element
		 *
		 *  please refer to flagrate.Element.toggle
		**/
		toggle: function() {
			return Element.toggle(this);
		}
		,
		/*?
		 *  flagrate.Element#hide() -> flagrate.Element
		 *
		 *  please refer to flagrate.Element.hide
		**/
		hide: function() {
			return Element.hide(this);
		}
		,
		/*?
		 *  flagrate.Element#show() -> flagrate.Element
		 *
		 *  please refer to flagrate.Element.show
		**/
		show: function() {
			return Element.show(this);
		}
		,
		/*?
		 *  flagrate.Element#remove() -> flagrate.Element
		 *
		 *  please refer to flagrate.Element.remove
		**/
		remove: function() {
			return Element.remove(this);
		}
		,
		/*?
		 *  flagrate.Element#update([newContent]) -> flagrate.Element
		 *
		 *  please refer to flagrate.Element.update
		**/
		update: function(content) {
			return Element.update(this, content);
		}
		,
		/*?
		 *  flagrate.Element#updateText([newContent]) -> flagrate.Element
		 *
		 *  please refer to flagrate.Element.updateText
		**/
		updateText: function(text) {
			return Element.updateText(this, text);
		}
		,
		/*?
		 *  flagrate.Element#insert(content) -> flagrate.Element
		 *
		 *  please refer to flagrate.Element.insert
		**/
		insert: function(content) {
			return Element.insert(this, content);
		}
		,
		/*?
		 *  flagrate.Element#insertText(content) -> flagrate.Element
		 *
		 *  please refer to flagrate.Element.insertText
		**/
		insertText: function(text) {
			return Element.insertText(this, text);
		}
		,
		/*?
		 *  flagrate.Element#insertTo(element) -> flagrate.Element
		 *
		 *  please refer to flagrate.Element.insertTo
		**/
		insertTo: function(element) {
			return Element.insertTo(this, element);
		}
		,
		/*?
		 *  flagrate.Element#readAttribute(attributeName) -> flagrate.Element
		 *
		 *  please refer to flagrate.Element.readAttribute
		**/
		readAttribute: function(name) {
			return Element.readAttribute(this, name);
		}
		,
		/*?
		 *  flagrate.Element#writeAttribute(attribute[, value = true]) -> flagrate.Element
		 *
		 *  please refer to flagrate.Element.writeAttribute
		**/
		writeAttribute: function(name, value) {
			return Element.writeAttribute(this, name, value);
		}
		,
		/*?
		 *  flagrate.Element#getDimensions() -> Object
		 *
		 *  please refer to flagrate.Element.getDimensions
		**/
		getDimensions: function() {
			return Element.getDimensions(this);
		}
		,
		/*?
		 *  flagrate.Element#getHeight() -> Number
		 *
		 *  please refer to flagrate.Element.getHeight
		**/
		getHeight: function() {
			return Element.getHeight(this);
		}
		,
		/*?
		 *  flagrate.Element#getWidth() -> Number
		 *
		 *  please refer to flagrate.Element.getWidth
		**/
		getWidth: function() {
			return Element.getWidth(this);
		}
		,
		/*?
		 *  flagrate.Element#hasClassName(className) -> Boolean
		 *
		 *  please refer to flagrate.Element.hasClassName
		**/
		hasClassName: function(className) {
			return Element.hasClassName(this, className);
		}
		,
		/*?
		 *  flagrate.Element#addClassName(className) -> flagrate.Element
		 *
		 *  please refer to flagrate.Element.addClassName
		**/
		addClassName: function(className) {
			return Element.addClassName(this, className);
		}
		,
		/*?
		 *  flagrate.Element#removeClassName(className) -> flagrate.Element
		 *
		 *  please refer to flagrate.Element.removeClassName
		**/
		removeClassName: function(className) {
			return Element.removeClassName(this, className);
		}
		,
		/*?
		 *  flagrate.Element#toggleClassName(className) -> flagrate.Element
		 *
		 *  please refer to flagrate.Element.toggleClassName
		**/
		toggleClassName: function(className) {
			return Element.toggleClassName(this, className);
		}
		,
		/*?
		 *  flagrate.Element#getStyle(propertyName) -> String | Number | null
		 *
		 *  please refer to flagrate.Element.getStyle
		**/
		getStyle: function(propertyName) {
			return Element.getStyle(this, propertyName);
		}
		,
		/*?
		 *  flagrate.Element#setStyle(style) -> flagrate.Element
		 *
		 *  please refer to flagrate.Element.setStyle
		**/
		setStyle: function(style) {
			return Element.setStyle(this, style);
		}
	};
	
	/*?
	 *  flagrate.Element.visible(element) -> Boolean
	 *  - element (Element) - instance of Element.
	 *  
	 *  Tells whether `element` is visible
	 *  
	 *  This method is similar to http://api.prototypejs.org/dom/Element/visible/
	**/
	Element.visible = function(element) {
		
		return element.style.display !== 'none';
	};
	
	/*?
	 *  flagrate.Element.toggle(element) -> Element
	 *  - element (Element) - instance of Element.
	 *  
	 *  Toggles the visibility of `element`. Returns `element`.
	 *  
	 *  This method is similar to http://api.prototypejs.org/dom/Element/toggle/
	**/
	Element.toggle = function(element) {
		
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
	Element.hide = function(element) {
		
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
	Element.show = function(element) {
		
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
	Element.remove = function(element) {
		
		if (element.parentNode) element.parentNode.removeChild(element);
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
	Element.update = function(element, content) {
		
		if (!content) {
			element.innerHTML = '';
			return element;
		}
		
		if (content instanceof HTMLElement) {
			element.innerHTML = '';
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
	Element.updateText = function(element, content) {
		
		if (!content) {
			element.innerHTML = '';
			return element;
		}
		
		if (content instanceof HTMLElement && typeof content.toString !== 'undefined') {
			return Element.updateText(element, content.toString());
		}
		
		if (typeof content !== 'string') {
			content = content.toString(10);
		}
		
		element.innerHTML = '';
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
	Element.insert = function(element, insertion) {
		
		if (
			typeof insertion === 'string' ||
			typeof insertion === 'number' ||
			insertion instanceof HTMLElement
		) {
			insertion = { bottom: insertion };
		}
		
		var content, insert, childNodes;
		
		for (var position in insertion) {
			content  = insertion[position];
			position = position.toLowerCase();
			insert   = Element._insertionTranslation[position];
			
			if (content instanceof HTMLElement) {
				insert(element, content);
				continue;
			}
			
			if (typeof content !== 'string') content = content.toString(10);
			
			var div = new Element();
			div.innerHTML = content;
			if (position === 'top' || position === 'after') childNodes.reverse();
			for (var i = 0; i < div.childNodes.length; i++) {
				insert(element, div.childNodes[i]);
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
	Element.insertText = function(element, insertion) {
		
		if (
			typeof insertion === 'string' ||
			typeof insertion === 'number'
		) {
			insertion = { bottom: insertion };
		}
		
		var content, insert;
		
		for (var position in insertion) {
			content  = insertion[position];
			position = position.toLowerCase();
			insert   = Element._insertionTranslation[position];
			
			if (typeof content !== 'string') content = content.toString(10);
			
			insert(element, document.createTextNode(content));
		}
		
		return element;
	};
	
	/*?
	 *  flagrate.Element.insertTo(element, to) -> Element
	 *  - element (Element) - insert this.
	 *  - to (Element) - insert to this element.
	**/
	Element.insertTo = function(element, to) {
		
		Element.insert(to, element);
		
		return element;
	};
	
	/*?
	 *  flagrate.Element.wrap(element, wrapper[, attribute]) -> Element
	 *  - element (Element) - 
	 *  - wrapper (Element|String) - An element to wrap `element` inside, or
	 *    else a string representing the tag name of an element to be created.
	 *  - attribute (Object) - A set of attributes to apply to the wrapper
	 *    element. Refer to the flagrate.Element constructor for usage.
	 *  
	 *  Wraps an element inside another, then returns the wrapper.
	 *  
	 *  This method is similar to http://api.prototypejs.org/dom/Element/wrap/
	**/
	Element.wrap = function(element, wrapper, attr) {
		
		if (wrapper instanceof HTMLElement) {
			if (attr) Element.writeAttribute(wrapper, attr);
		} else if (typeof wrapper === 'string') {
			wrapper = new Element(wrapper, attr);
		} else {
			wrapper = new Element('div', wrapper);
		}
		
		if (element.parentNode) element.parentNode.replaceChild(wrapper, element);
		
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
	Element.readAttribute = function(element, name) {
		
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
	Element.writeAttribute = function(element, name, value) {
		
		var attr = {};
		
		if (typeof name === 'object') {
			attr = name;
		} else {
			attr[name] = (typeof value === 'undefined') ? true : value;
		}
		
		for (var k in attr) {
			value = attr[k];
			if (value === false || value === null) {
				element.removeAttribute(k);
			} else if (value === true) {
				element.setAttribute(k, k);
			} else {
				element.setAttribute(k, value);
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
	Element.getDimensions = function(element) {
		
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
		if (before.position !== 'fixed') after.position = 'absolute';
		
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
	Element.getHeight = function(element) {
		
		return Element.getDimensions(element).height;
	};
	
	/*?
	 *  flagrate.Element.getWidth(element) -> Number
	 *  - element (Element) - instance of Element.
	 *  
	 *  This method is similar to http://api.prototypejs.org/dom/Element/getWidth/
	**/
	Element.getWidth = function(element) {
		
		return Element.getDimensions(element).width;
	};
	
	/*?
	 *  flagrate.Element.hasClassName(element, className) -> Boolean
	 *  - element (Element) - instance of Element.
	 *  - className (String) - 
	 *  
	 *  This method is similar to http://api.prototypejs.org/dom/Element/hasClassName/
	**/
	Element.hasClassName = function(element, className) {
		
		return (element.className.length > 0 && (element.className === className || new RegExp('(^|\\s)' + className + '(\\s|$)').test(element.className)));
	};
	
	/*?
	 *  flagrate.Element.addClassName(element, className) -> Boolean
	 *  - element (Element) - instance of Element.
	 *  - className (String) - The class name to add.
	 *  
	 *  This method is similar to http://api.prototypejs.org/dom/Element/addClassName/
	**/
	Element.addClassName = function(element, className) {
		
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
	Element.removeClassName = function(element, className) {
		
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
	Element.toggleClassName = function(element, className) {
		
		return Element[Element.hasClassName(element, className) ? 'removeClassName' : 'addClassName'](element, className);
	};
	
	/*?
	 *  flagrate.Element.getStyle(element, propertyName) -> String | Number | null
	 *  - element (Element) - instance of Element.
	 *  - propertyName (String) - The property name of style to be retrieved.
	 *  
	 *  This method is similar to http://api.prototypejs.org/dom/Element/getStyle/
	**/
	Element.getStyle = function(element, style) {
		
		if (style === 'float') style = 'cssFloat';
		
		var value = element.style[style];
		if (!value || value === 'auto') {
			var css = document.defaultView.getComputedStyle(element, null);
			value = css ? css[style] : null;
		}
		
		if (style === 'opacity') return value ? parseFloat(value) : 1.0;
		
		return value === 'auto' ? null : value;
	};
	
	/*?
	 *  flagrate.Element.setStyle(element, style) -> Element
	 *  - element (Element) - instance of Element.
	 *  - style (Object) -
	 *  
	 *  This method is similar to http://api.prototypejs.org/dom/Element/setStyle/
	**/
	Element.setStyle = function(element, style) {
		
		for (var p in style) {
			element.style[(p === 'float' || p === 'cssFloat') ? ((typeof element.style.styleFloat === 'undefined') ? 'cssFloat' : 'styleFloat') : p] = style[p];
		}
		
		return element;
	};
	
	// from https://github.com/sstephenson/prototype/blob/1fb9728/src/dom/dom.js#L3021-L3041
	Element._insertionTranslation = {
		before: function(element, node) {
			element.parentNode.insertBefore(node, element);
		},
		top: function(element, node) {
			element.insertBefore(node, element.firstChild);
		},
		bottom: function(element, node) {
			element.appendChild(node);
		},
		after: function(element, node) {
			element.parentNode.insertBefore(node, element.nextSibling);
		}
	};
	
	/*?
	 *  class flagrate.Button
	**/
	
	/*?
	 *  new flagrate.Button(attribute, option)
	 *  - attribute (Object) - attributes for button element.
	 *  - option (Object) - options.
	**/
	var Button = flagrate.Button = function _Button(attr, opt) {
		
		opt = opt || {};
		
		this.label             = opt.label             || '';
		this.icon              = opt.icon              || null;
		this.onSelect          = opt.onSelect          || function(){};
		this.onRemove          = opt.onRemove          || function(){};
		this.isRemovableByUser = opt.isRemovableByUser || false;
		
		//create
		var that = new Element('button', attr).updateText(this.label);
		extendObject(that, this);
		
		that.addClassName(flagrate.className + ' ' + flagrate.className + '-button');
		
		that.addEventListener('click', that._onSelectHandler.bind(that));
		
		if (that.icon) {
			that.addClassName(flagrate.className + '-icon');
			that.setStyle({
				backgroundImage: 'url(' + that.icon + ')'
			});
		}
		
		if (that.isRemovableByUser) {
			new Element('button', {
				'class': flagrate.className + '-button-remove'
			}).insertTo(that).addEventListener('click', that._onRemoveHandler.bind(that))
		}
		
		if (opt.color) that.setColor(opt.color);
		
		return that;
	};
	
	Button.prototype = {
		/*?
		 *  flagrate.Button#select() -> flagrate.Button
		**/
		select: function() {
			return this._onSelectHandler(null);
		}
		,
		/*?
		 *  flagrate.Button#disable() -> flagrate.Button
		**/
		disable: function() {
			
			this.addClassName(flagrate.className + '-button-disabled');
			this.writeAttribute('disabled', true);
			
			return this;
		}
		,
		/*?
		 *  flagrate.Button#enable() -> flagrate.Button
		**/
		enable: function() {
			
			this.removeClassName(flagrate.className + '-button-disabled');
			this.writeAttribute('disabled', false);
			
			return this;
		}
		,
		/*?
		 *  flagrate.Button#isDisabled() -> Boolean
		**/
		isDisabled: function() {
			return this.hasClassName(flagrate.className + '-button-disabled');
		}
		,
		/*?
		 *  flagrate.Button#isEnabled() -> Boolean
		**/
		isEnabled: function() {
			return !this.hasClassName(flagrate.className + '-button-disabled');
		}
		,
		/*?
		 *  flagrate.Button#setColor(color) -> flagrate.Button
		**/
		setColor: function(color) {
			
			if (color.charAt(0) === '@') {
				this.style.backgroundColor = '';
				this.addClassName(flagrate.className + '-button-color-' + color.slice(1));
			} else {
				this.style.backgroundColor = color;
			}
			
			return this;
		}
		,
		_onSelectHandler: function(e) {
			
			if (this.isEnabled()) this.onSelect(e);
			
			return this;
		}
		,
		_onRemoveHandler: function(e) {
			
			if (this.isEnabled()) this.remove() && this.onRemove(e);
			
			return this;
		}
	};
	
	/*?
	 *  class flagrate.Menu
	**/
	
	/*?
	 *  new flagrate.Menu(attribute, option)
	 *  - attribute (Object) - attributes for container element.
	 *  - option (Object) - options.
	**/
	var Menu = flagrate.Menu = function _Menu(attr, opt) {
		
		opt = opt || {};
		
		this.items    = opt.items    || [];
		this.onSelect = opt.onSelect || function(){};
		
		//create
		var that = new Element('div', attr);
		extendObject(that, this);
		
		that.addClassName(flagrate.className + ' ' + flagrate.className + '-menu');
		
		that.items.forEach(function(a) {
			that.push(a);
		}.bind(that));
		
		return that;
	};
	
	Menu.prototype = {
		/*?
		 *  flagrate.Menu#push(item) -> flagrate.Menu
		**/
		push: function(a) {
			
			if (a instanceof Array) {
				//todo
			} else {
				new Button(
					null,
					{
						icon    : a.icon,
						label   : a.label,
						onSelect: function(e) {
							
							if (a.onSelect) a.onSelect(e);
							this.onSelect(e);
						}.bind(this)
					}
				).insertTo(this);
			}
			
			return this;
		}
	};
	
	/*?
	 *  class flagrate.TextInput
	**/
	
	/*?
	 *  new flagrate.TextInput(attribute, option)
	 *  - attribute (Object) - attributes for input element.
	 *  - option (Object) - options.
	**/
	var TextInput = flagrate.TextInput = function _TextInput(attr, opt) {
		
		opt = opt || {};
		
		this.icon   = opt.icon   || null;
		this.regexp = opt.regexp || null;
		
		//create
		var that = new Element('input', attr);
		extendObject(that, this);
		
		that.addClassName(flagrate.className + ' ' + flagrate.className + '-textinput');
		
		if (that.icon) {
			that.addClassName(flagrate.className + '-icon');
			that.setStyle({
				backgroundImage: 'url(' + that.icon + ')'
			});
		}
		
		return that;
	};
	
	TextInput.prototype = {
		/*?
		 *  flagrate.TextInput#disable() -> flagrate.TextInput
		**/
		disable: function() {
			
			this.addClassName(flagrate.className + '-textinput-disabled');
			this.writeAttribute('disabled', true);
			
			return this;
		}
		,
		/*?
		 *  flagrate.TextInput#enable() -> flagrate.TextInput
		**/
		enable: function() {
			
			this.removeClassName(flagrate.className + '-textinput-disabled');
			this.writeAttribute('disabled', false);
			
			return this;
		}
		,
		/*?
		 *  flagrate.TextInput#isDisabled() -> Boolean
		**/
		isDisabled: function() {
			return this.hasClassName(flagrate.className + '-textinput-disabled');
		}
		,
		/*?
		 *  flagrate.TextInput#isEnabled() -> Boolean
		**/
		isEnabled: function() {
			return !this.hasClassName(flagrate.className + '-textinput-disabled');
		}
		,
		/*?
		 *  flagrate.TextInput#getValue() -> String
		**/
		getValue: function() {
			return this.readAttribute('value') || '';
		}
		,
		/*?
		 *  flagrate.TextInput#setValue(value) -> flagrate.TextInput
		**/
		setValue: function(value) {
			return this.writeAttribute('value', value);
		}
		,
		/*?
		 *  flagrate.TextInput#isValid() -> Boolean
		**/
		isValid: function() {
			return this.regexp.test(this.getValue());
		}
	};
	
	/*?
	 *  class flagrate.Tokenizer
	**/
	
	/*?
	 *  new flagrate.Tokenizer(attribute, option)
	 *  - attribute (Object) - attributes for container element.
	 *  - option (Object) - options.
	**/
	var Tokenizer = flagrate.Tokenizer = function _Tokenizer(attr, opt) {
		
		opt = opt || {};
		
		this.icon        = opt.icon        || null;
		this.placeholder = opt.placeholder || null;
		this.values      = opt.values      || [];
		this.maximum     = opt.maximum     || -1;
		this.tokenize    = opt.tokenize    || identity;
		
		//create
		var that = new Element('div', attr);
		extendObject(that, this);
		
		that.addClassName(flagrate.className + ' ' + flagrate.className + '-tokenizer');
		
		if (that.icon) {
			that.addClassName(flagrate.className + '-icon');
			that.setStyle({
				backgroundImage: 'url(' + that.icon + ')'
			});
		}
		
		that._tokens = new Element('span').insertTo(that);
		that._input  = new TextInput({ placeholder: that.placeholder }).insertTo(that);
		
		if (that.values.length !== 0) {
			that._updateTokens();
		}
		
		that.addEventListener('click', that._onClickHandler.bind(that));
		
		that._input.addEventListener('keyup',   that._onKeyupHandler.bind(that));
		that._input.addEventListener('keydown', that._onKeydownHandler.bind(that));
		that._input.addEventListener('focus',   that._onFocusHandler.bind(that));
		that._input.addEventListener('blur',    that._onBlurHandler.bind(that));
		
		return that;
	};
	
	Tokenizer.prototype = {
		/*?
		 *  flagrate.Tokenizer#getValues() -> Array
		**/
		getValues: function() {
			return this.values;
		}
		,
		/*?
		 *  flagrate.Tokenizer#setValues(values) -> flagrate.Tokenizer
		**/
		setValues: function(values) {
			
			this.values = values;
			
			return this._updateTokens();
		}
		,
		/*?
		 *  flagrate.Tokenizer#removeAllValues() -> flagrate.Tokenizer
		**/
		removeAllValues: function() {
			
			this.values = [];
			
			return this._updateTokens();
		}
		,
		/*?
		 *  flagrate.Tokenizer#removeValue(value) -> flagrate.Tokenizer
		**/
		removeValue: function(value) {
			
			this.values.splice(this.values.indexOf(value), 1);
			
			return this._updateTokens();
		}
		,
		_updateTokens: function() {
			
			this._tokens.update();
			
			this.values.forEach(function(value) {
				
				var label = '';
				
				if (typeof value === 'string') {
					label = value;
				} else {
					label = value.label;
				}
				
				new Button(
					null,
					{
						isRemovableByUser: true,
						onRemove         : function(){ this.removeValue(value); }.bind(this),
						label            : label
					}
				).insertTo(this._tokens);
			}.bind(this));
			
			var vw = this.getWidth();
			var pl = parseInt(this.getStyle('padding-left').replace('px', ''), 10)  || 4;
			var pr = parseInt(this.getStyle('padding-right').replace('px', ''), 10) || 4;
			var tw = this._tokens.getWidth();
			var tm = parseInt(this._tokens.getStyle('margin-left').replace('px', ''), 10) || 2;
			var im = parseInt(this._input.getStyle('margin-left').replace('px', ''), 10) || 2;
			var aw = vw - pl - pr - tw - tm - im - 2;
			
			if (aw > 30) {
				this._input.style.width = aw + 'px';
			} else if (aw < -5) {
				this._input.style.width = '';
			} else {
				this._input.style.width = '100%';
			}
			
			return this;
		}
		,
		_tokenize: function(e) {
			
			this._candidates = [];
			
			var str = this._input.value;
			
			var result = this.tokenize(str, this._tokenized.bind(this));
			
			if (result) this._tokenized(result);
			
			return this;
		}
		,
		_tokenized: function(candidates) {
			
			if (candidates instanceof Array === false) candidates = [candidates];
			
			this._candidates = candidates;
			
			var menu = new Menu(
				null,
				{
					onSelect: function() {
						menu.remove();
					}
				}
			);
			
			menu.style.left = this._input.offsetLeft + 'px';
			
			this.insert({ top: menu });
			
			candidates.forEach(function(candidate) {
				
				if (typeof candidate === 'string') {
					var a = { label: candidate };
				} else {
					var a = candidate;
				}
				
				if (a.onSelect) a._onSelect = a.onSelect;
				
				a.onSelect = function(e) {
					
					this.values.push(candidate);
					this._updateTokens();
					
					if (a._onSelect) a._onSelect(e);
				}.bind(this);
				
				menu.push(a);
			}.bind(this));
			
			if (this._menu) this._menu.remove();
			this._menu = menu;
			
			return this;
		}
		,
		_onClickHandler: function(e) {
			this._input.focus();
		}
		,
		_onKeyupHandler: function(e) {
			this._tokenize();
		}
		,
		_onKeydownHandler: function(e) {
			
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
					this.values.push(this._candidates[0]);
					this._updateTokens();
					
					if (this._menu) this._menu.remove();
				}
			}
			
			if (this._input.value === '' && this.values.length !== 0) {
				if (
					// BS:8
					(e.keyCode === 8)
				) {
					e.stopPropagation();
					e.preventDefault();
					
					this._input.value = this.values.pop();
					this._updateTokens();
					
					if (this._menu) this._menu.remove();
				}
			}
		}
		,
		_onFocusHandler: function(e) {
			
			this._updateTokens();
			
			this._tokenize();
		}
		,
		_onBlurHandler: function(e) {
			
			this._input.value = '';
			
			if (this._menu) {
				this._menu.style.opacity = '0';
				setTimeout(function(){ this._menu.remove(); }.bind(this), 500);
			}
		}
	};
	
	/*?
	 *  class flagrate.TextArea
	**/
	
	/*?
	 *  new flagrate.TextArea(attribute, option)
	 *  - attribute (Object) - attributes for input element.
	 *  - option (Object) - options.
	**/
	var TextArea = flagrate.TextArea = function _TextArea(attr, opt) {
		
		opt = opt || {};
		
		this.icon   = opt.icon   || null;
		this.regexp = opt.regexp || null;
		
		//create
		var that = new Element('textarea', attr);
		extendObject(that, this);
		
		that.addClassName(flagrate.className + ' ' + flagrate.className + '-textarea');
		
		if (that.icon) {
			that.addClassName(flagrate.className + '-icon');
			that.setStyle({
				backgroundImage: 'url(' + that.icon + ')'
			});
		}
		
		return that;
	};
	
	TextArea.prototype = {
		/*?
		 *  flagrate.TextArea#disable() -> flagrate.TextArea
		**/
		disable: function() {
			
			this.addClassName(flagrate.className + '-textarea-disabled');
			this.writeAttribute('disabled', true);
			
			return this;
		}
		,
		/*?
		 *  flagrate.TextArea#enable() -> flagrate.TextArea
		**/
		enable: function() {
			
			this.removeClassName(flagrate.className + '-textarea-disabled');
			this.writeAttribute('disabled', false);
			
			return this;
		}
		,
		/*?
		 *  flagrate.TextArea#isDisabled() -> Boolean
		**/
		isDisabled: function() {
			return this.hasClassName(flagrate.className + '-textarea-disabled');
		}
		,
		/*?
		 *  flagrate.TextArea#isEnabled() -> Boolean
		**/
		isEnabled: function() {
			return !this.hasClassName(flagrate.className + '-textarea-disabled');
		}
		,
		/*?
		 *  flagrate.TextArea#getValue() -> String
		**/
		getValue: function() {
			return this.value || '';
		}
		,
		/*?
		 *  flagrate.TextArea#setValue(value) -> flagrate.TextArea
		**/
		setValue: function(value) {
			return this.value = value;
		}
		,
		/*?
		 *  flagrate.TextArea#isValid() -> Boolean
		**/
		isValid: function() {
			return this.regexp.test(this.getValue());
		}
	};
	
	/*?
	 *  class flagrate.Notify
	**/
	
	/*?
	 *  new flagrate.Notify(option) -> flagrate.Notify
	 *  - option (Object) - configuration for the notifications.
	 *  
	 *  Initialize the notifications.
	 *  
	 *  ##### option
	 *  
	 *  * `target`               (Element; default `document.body`):
	 *  * `className`            (String;  default `"flagrate-notify"`):
	 *  * `disableDesktopNotify` (Boolean; default `false`):
	 *  * `hAlign`               (String;  default `"right"`; `"right"` | `"left"`):
	 *  * `vAlign`               (String;  default `"bottom"`; `"top"` | `"bottom"`):
	 *  * `hMargin`              (Number;  default `10`):
	 *  * `vMargin`              (Number;  default `10`):
	 *  * `spacing`              (Number;  default `10`):
	 *  * `timeout`              (Number;  default `5`):
	 *  * `title`                (String;  default `"Notify"`):
	**/
	var Notify = flagrate.Notify = function _Notify(opt) {
		
		opt = opt || {};
		
		this.target    = opt.target    || document.body;
		this.className = opt.className || flagrate.className + ' ' + flagrate.className + '-notify';
		
		this.disableDesktopNotify = opt.disableDesktopNotify || false;//Notification API(experimental)
		
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
			if (typeof window.webkitNotifications !== 'undefined') {
				this.desktopNotifyType = 'webkit';
			}
			
			if (this.desktopNotifyType === null) {
				this.disableDesktopNotify = true;
			}
			
			/*- Get Permissions -*/
			if ((this.desktopNotifyType === 'webkit') && (window.webkitNotifications.checkPermission() === 1)) {
				this.create({
					text   : 'Click here to activate desktop notifications...',
					onClick: function() {
						window.webkitNotifications.requestPermission();
					}.bind(this)
				});
			}
		}
		
		return this;
	};
	
	Notify.prototype = {
		/*?
		 *  flagrate.Notify#create(option) -> flagrate.Notify
		 *  - option (Object) - configuration for the notification.
		 *  
		 *  Create and show the notification.
		 *  
		 *  ##### option
		 *  
		 *  * `title`   (String; default `"Notify"`):
		 *  * `text`    (String; required):
		 *  * `onClick` (Function):
		 *  * `onClose` (Function):
		 *  * `timeout` (Number; default `5`):
		**/
		create: function _create(opt) {
			
			opt = opt || {};
			
			/*- Desktop notify -*/
			if (this.disableDesktopNotify === false) {
				if (this.createDesktopNotify(opt) === true) {
					return this;
				}
			}
			
			/*- Setting up -*/
			var title   = opt.title   || this.title;
			var message = opt.message || opt.body || opt.content || opt.text || null;
			var onClick = opt.onClick || null;
			var onClose = opt.onClose || null;
			var timeout = (typeof opt.timeout !== 'undefined') ? opt.timeout : this.timeout;
			
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
			new Element('div', { 'class': 'title' }).insertText(title).insertTo(notify);
			new Element('div', { 'class': 'text' }).insertText(message).insertTo(notify);
			var notifyClose = new Element('div', { 'class': 'close' }).update('&#xd7;').insertTo(notify);
			
			notifyClose.addEventListener('click', function(e) {
				
				e.stopPropagation();
				e.preventDefault();
				
				if (isAlive) {
					closeNotify();
				}
			}, false);
			
			notify.style.display = 'none';
			
			notify.style.position      = 'absolute';
			notify.style[this.hAlign] = hPosition + 'px';
			notify.style[this.vAlign] = vPosition + 'px';
			
			/*- onClick event -*/
			if (onClick === null) {
				notify.addEventListener('click', function(e) {
					
					closeNotify();
				});
			} else {
				notify.style.cursor = 'pointer';
				notify.addEventListener('click', function(e) {
					
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
			setTimeout(function() {
				notify.style.opacity = 1;
			}, 10);
			
			/*- Set timeout -*/
			if (timeout !== 0) {
				var onTimeout = function() {
					
					if (isAlive) {
						closeNotify();
					}
				}
				
				closeTimer = setTimeout(onTimeout, timeout * 1000);
				
				//Clear timeout
				notify.addEventListener('mouseover', function() {
					
					clearTimeout(closeTimer);
					closeTimer = setTimeout(onTimeout, timeout * 1000);
				});
			}
			
			/*- Remove a notify element -*/
			var closeNotify = function() {
				
				isAlive = false;
				
				notify.style.opacity = 0;
				
				//onClose event
				if (onClose !== null) {
					onClose();
				}
				
				setTimeout(function() {
					
					this.target.removeChild(notify);
					
					this.notifies.splice(this.notifies.indexOf(notify), 1);
					this.positioner();
				}.bind(this), 300);
			}.bind(this);
			
			this.notifies.push(notify);
			this.positioner();
			
			return this;
		}
		,
		createDesktopNotify: function _createDesktopNotify(opt) {
			/*- Setting up -*/
			var title   = opt.title   || this.title;
			var message = opt.message || opt.body || opt.content || opt.text || null;
			var onClick = opt.onClick || null;
			var onClose = opt.onClose || null;
			var timeout = (typeof opt.timeout !== 'undefined') ? opt.timeout : this.timeout;
			
			var isAlive = true;
			var notify  = null;
			var type    = this.desktopNotifyType;
			var closeTimer;
			
			/*- Create a desktop notification -*/
			if (type === 'webkit') {
				/*- Get Permissions -*/
				if (window.webkitNotifications.checkPermission() !== 0) {
					return false;
				}
				
				notify = window.webkitNotifications.createNotification('', title, message);
			}
			
			/*- Set timeout -*/
			if (timeout !== 0) {
				closeTimer = setTimeout(function() {
					
					if (isAlive) {
						notify.cancel();
					}
				}, timeout * 1000);
			}
			
			/*- onClick event -*/
			if (onClick === null) {
				notify.addEventListener('click', function(e) {
					
					notify.cancel();
				});
			} else {
				notify.addEventListener('click', function(e) {
					
					onClick();
					notify.cancel();
				});
			}
			
			/*- onClose event -*/
			notify.onclose = function() {
				isAlive = false;
				if (onClose !== null) {
					onClose();
				}
			};
			
			/*- Show notify -*/
			notify.show();
			
			return true;
		}
		,
		positioner: function _positioner() {
			var tH = (this.target === document.body) ? (window.innerHeight || document.body.clientHeight) : this.target.offsetHeight;
			var pX = 0;
			var pY = 0;
			
			this.notifies.forEach(function(notify, i) {
				var x = this.vMargin + pX;
				var y = this.hMargin + pY;
				
				notify.style[this.hAlign] = x.toString(10) + 'px';
				notify.style[this.vAlign] = y.toString(10) + 'px';
				
				pY += this.spacing + notify.offsetHeight;
				
				if ((pY + notify.offsetHeight + this.vMargin + this.spacing) >= tH) {
					pY  = 0;
					pX += this.spacing + notify.offsetWidth;
				}
			}.bind(this));
		}
	};
	
	/*?
	 *  class flagrate.Modal
	**/
	
	/*?
	 *  new flagrate.Modal(option) -> flagrate.Modal
	 *  - option (Object) - configuration for the modal.
	 *  
	 *  Create and initialize the modal.
	 *  
	 *  ##### option
	 *  
	 *  * `target`                   (Element; default `document.body`):
	 *  * `id`                       (String):
	 *  * `className`                (String;  default `"flagrate-modal"`):
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
	 *  ##### button
	 *  
	 *  * `key`                      (String):
	 *  * `label`                    (String; required):
	 *  * `icon`                     (String):
	 *  * `color`                    (String):
	 *  * `onSelect`                 (Function):
	 *  * `isFocused`                (Boolean; default `false`):
	 *  * `isDisabled`               (Boolean; default `false`):
	**/
	var Modal = flagrate.Modal = function _Modal(opt) {
		
		opt = opt || {};
		
		this.target    = opt.target    || document.body;
		this.id        = opt.id        || null;
		this.className = opt.className || flagrate.className + ' ' + flagrate.className + '-modal';
		
		this.title     = opt.title    || '';
		this.subtitle  = opt.subtitle || '';
		this.text      = opt.text     || '';
		this.html      = opt.html     || '';
		this.element   = opt.element  || null;
		this.href      = opt.href     || '';
		this.buttons   = opt.buttons  || [];
		this.sizing    = opt.sizing   || 'flex';
		
		this.onBeforeClose = opt.onBeforeClose || function(){};
		this.onClose       = opt.onClose       || function(){};
		this.onShow        = opt.onShow        || function(){};
		
		this.disableCloseButton = opt.disableCloseButton || false;
		this.disableCloseByMask = opt.disableCloseByMask || false;
		this.disableCloseByEsc  = opt.disableCloseByEsc  || false;
		
		if (this.buttons.length === 0) {
			this.buttons = [
				{
					label    : 'OK',
					color    : '@blue',
					onSelect : this.close.bind(this),
					isFocused: true
				}
			];
		}
		
		//create
		this._modal = new Element('div');
		this._modal.addEventListener('click', function(e) {
			
			e.stopPropagation();
		});
		
		if (this.disableCloseButton === false) {
			new Button(null, {
				label   : '',
				onSelect: this.close.bind(this)
			}).insertTo(this._modal);
		}
		
		this._header = new Element('hgroup').insertTo(this._modal);
		new Element('h1').insertText(this.title).insertTo(this._header);
		new Element('small').insertText(this.subtitle).insertTo(this._header);
		
		this._content = new Element('div').insertTo(this._modal);
		this.content  = new Element('div').insertTo(this._content);
		
		if (this.text    !== '') this.content.insertText(this.text);
		if (this.html    !== '') this.content.update(this.html);
		if (this.element !== null) this.content.update(this.element);
		
		this._footer = new Element('footer').insertTo(this._modal);
		
		this.buttons.forEach(function(a) {
			
			a.button = new Button({
				autofocus: a.isFocused || false
			}, {
				label   : a.label,
				icon    : a.icon,
				onSelect: function(e) {
					a.onSelect(e, a.button, this)
				}.bind(this)
			});
			
			if (a.color) a.button.setColor(a.color);
			
			if (a.isDisabled) a.button.disable();
			
			this._footer.insert(a.button);
		}.bind(this));
		
		this._base = new Element('div', {
			id     : this.id,
			'class': this.className
		});
		
		this._obi = new Element('div').update(this._modal).insertTo(this._base);
		
		if (this.disableCloseByMask === false) {
			this._base.addEventListener('click', this.close.bind(this));
		}
		
		this._onKeydownHandler = function(e) {
			
			// ESC:27
			if (e.keyCode !== 27) return;
			
			this.close();
		}.bind(this);
		
		return this;
	};
	
	Modal.prototype = {
		/*?
		 *  flagrate.Modal#visible() -> Boolean
		 *  
		 *  Tells weather modal is visible
		**/
		visible: function _visible() {
			return this._base.hasClassName(flagrate.className + '-modal-visible');
		}
		,
		/*?
		 *  flagrate.Modal#show() -> flagrate.Modal
		 *  
		 *  Show the modal.
		**/
		show: function _show() {
			
			if (this.visible() === true) return this;
			
			if (this.closingTimer) clearTimeout(this.closingTimer);
			
			Element.insert(this.target, this._base);
			
			setTimeout(function() {
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
							this._modal.style.left        = '10px';
							this._content.style.width     = baseWidth - 20 + 'px';
							this._content.style.overflowX = 'auto';
						} else {
							this._modal.style.left        = (baseWidth / 2) - (modalWidth / 2) + 'px';
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
			
			if (this.disableCloseByEsc === false) window.addEventListener('keydown', this._onKeydownHandler);
			
			return this;
		}
		,
		/*?
		 *  flagrate.Modal#close() -> flagrate.Modal
		 *  
		 *  Close the modal.
		**/
		close: function _close(e) {
			
			if (this.visible() === false) return this;
			
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
			
			this.closingTimer = setTimeout(function(){ this._base.remove(); }.bind(this), 200);
			
			if (this.disableCloseByEsc === false) window.removeEventListener('keydown', this._onKeydownHandler);
			
			// Callback: onClose
			this.onClose(this, e);
			
			return this;
		}
	};
	
})();