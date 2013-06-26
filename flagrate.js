/* jshint laxcomma: true */
/*!
 * Flagrate
 *
 * Copyright (c) 2013 Webnium and Flagrate Contributors
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
		attr    = attr    || null;
		
		tagName = tagName.toLowerCase();
		
		var node;
		
		if (Element.cache[tagName]) {
			node = Element.cache[tagName].cloneNode(false);
		} else if ((attr !== null && 'type' in attr) || tagName === 'select') {
			node = document.createElement(tagName);
		}else {
			node = document.createElement(tagName);
			Element.cache[tagName] = node.cloneNode(false);
		}
		
		extendObject(node, this);
		
		return attr === null ? node : Element.writeAttribute(node, attr);
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
		 *  flagrate.Element#cumulativeOffset() -> Object
		 *
		 *  please refer to flagrate.Element.cumulativeOffset
		**/
		cumulativeOffset: function() {
			return Element.cumulativeOffset(this);
		}
		,
		/*?
		 *  flagrate.Element#cumulativeScrollOffset() -> Object
		 *
		 *  please refer to flagrate.Element.cumulativeScrollOffset
		**/
		cumulativeScrollOffset: function() {
			return Element.cumulativeScrollOffset(this);
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
			} else if (typeof value !== 'undefined') {
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
	 *  flagrate.Element.cumulativeOffset(element) -> Object
	 *  - element (Element) - instance of Element.
	 *  
	 *  This method is similar to http://api.prototypejs.org/dom/Element/cumulativeOffset/
	**/
	Element.cumulativeOffset = function(element) {
		
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
	Element.cumulativeScrollOffset = function(element) {
		
		var t = 0, l = 0;
		do {
			t      += element.scrollTop  || 0;
			l      += element.scrollLeft || 0;
			element = element.parentNode;
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
			value = css ? css.getPropertyValue(style) : null;
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
	 *  new flagrate.Button(option) -> flagrate.Button
	 *  - option (Object) - options.
	 *  
	 *  Button.
	 *  
	 *  ##### option
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
	var Button = flagrate.Button = function _Button(opt) {
		
		opt = opt || {};
		
		opt.label             = opt.label             || '';
		opt.isRemovableByUser = opt.isRemovableByUser || false;
		
		this.onSelect = opt.onSelect || function(){};
		this.onRemove = opt.onRemove || function(){};
		
		var attr = opt.attribute || {};
		
		attr.id          = opt.id        || null;
		attr['class']    = opt.className || null;
		attr.autofocus   = opt.isFocused || false;
		
		//create
		var that = new Element('button', attr).updateText(opt.label);
		extendObject(that, this);
		
		that.addClassName(flagrate.className + ' ' + flagrate.className + '-button');
		
		that.addEventListener('click', that._onSelectHandler.bind(that));
		
		if (opt.icon) {
			that.addClassName(flagrate.className + '-icon');
			that.setStyle({
				backgroundImage: 'url(' + opt.icon + ')'
			});
		}
		
		if (opt.isRemovableByUser) {
			that._removeButton = new Element('button', {
				'class': flagrate.className + '-button-remove'
			}).insertTo(that);
			that._removeButton.addEventListener('click', that._onRemoveHandler.bind(that));
		}
		
		if (opt.style) that.setStyle(opt.style);
		if (opt.color) that.setColor(opt.color);
		
		if (opt.isDisabled) that.disable();
		
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
			
			if (this.isEnabled() === false) return;
			
			//for Firefox
			if (this.isRemovableByUser && e && e.layerX) {
				var bw = this.getWidth();
				var bh = this.getHeight();
				var bp = parseInt(this.getStyle('padding-right').replace('px', ''), 10);
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
			
			this.onSelect(e);
		}
		,
		_onRemoveHandler: function(e) {
			
			if (this.isEnabled() && this.remove()) this.onRemove(e);
		}
	};
	
	/*?
	 *  class flagrate.Menu
	**/
	
	/*?
	 *  new flagrate.Menu(option) -> flagrate.Menu
	 *  - option (Object) - options.
	 *  
	 *  Menu.
	 *  
	 *  ##### option
	 *  
	 *  * `id`                       (String): `id` attribute of container element.
	 *  * `className`                (String):
	 *  * `attribute`                (Object):
	 *  * `items`                    (Array): of item
	 *  * `onSelect`                 (Function):
	 *  
	 *  ##### item
	 *  
	 *  * `key`                      (String):
	 *  * `label`                    (String; default `""`):
	 *  * `icon`                     (String):
	 *  * `isDisabled`               (Boolean; default `false`):
	 *  * `onSelect`                 (Function):
	**/
	var Menu = flagrate.Menu = function _Menu(opt) {
		
		opt = opt || {};
		
		opt.items = opt.items    || [];
		
		this.onSelect = opt.onSelect || function(){};
		
		var attr = opt.attribute || {};
		
		attr.id       = opt.id;
		attr['class'] = opt.className;
		
		//create
		var that = new Element('div', attr);
		extendObject(that, this);
		
		that.addClassName(flagrate.className + ' ' + flagrate.className + '-menu');
		
		for (var i = 0, l = opt.items.length; i < l; i++) {
			that.push(opt.items[i]);
		}
		
		that.addEventListener('click', function(e) {
			
			e.stopPropagation();
			e.preventDefault();
		});
		
		return that;
	};
	
	Menu.prototype = {
		/*?
		 *  flagrate.Menu#push(item) -> flagrate.Menu
		**/
		push: function(a) {
			
			if (a instanceof Array) {
				//todo
			} else if (typeof a === 'string') {
				new Element('hr').insertTo(this);
			} else {
				var button = new Button(
					{
						icon      : a.icon,
						label     : a.label,
						isDisabled: a.isDisabled,
						onSelect  : function(e) {
							
							if (a.onSelect) a.onSelect(e);
							this.onSelect(e);
						}.bind(this)
					}
				).insertTo(this);
				
				if (a.key) button._key = a.key;
			}
			
			return this;
		}
		,
		/*?
		 *  flagrate.Menu#getButtonByKey(key) -> Button | null
		**/
		getButtonByKey: function(key) {
			
			var result = null;
			
			var elements = this.childNodes;
			for (var i = 0; i < elements.length; i++) {
				if (!elements[i]._key) continue;
				
				if (elements[i]._key === key) {
					result = element[i]._key;
					break;
				}
			}
			
			return result;
		}
	};
	
	/*?
	 *  class flagrate.Pulldown
	**/
	
	/*?
	 *  new flagrate.Pulldown(option) -> flagrate.Pulldown
	 *  - option (Object) - options.
	 *  
	 *  Pulldown.
	 *  
	 *  ##### option
	 *  
	 *  * `id`                       (String): `id` attribute of `button` element.
	 *  * `className`                (String):
	 *  * `attribute`                (Object):
	 *  * `style`                    (Object): (using flagrate.Element.setStyle)
	 *  * `items`                    (Array): of item (see: flagrate.Menu)
	 *  * `isDisabled`               (Boolean; default `false`):
	 *  * `onSelect`                 (Function):
	**/
	var Pulldown = flagrate.Pulldown = function _Pulldown(opt) {
		
		opt = opt || {};
		
		opt.label = opt.label || '';
		opt.items = opt.items || null;
		
		opt.onSelect = opt.onSelect || function(){};
		
		//create
		var that = new Button({
			attribute: opt.attribute,
			label    : opt.label,
			icon     : opt.icon
		});
		extendObject(that, this);
		
		that.addClassName(flagrate.className + '-pulldown');
		
		that.onSelect = function(e) {
			
			if (that._menu) {
				that._menu.remove();
				delete that._menu;
				return;
			}
			
			var removeMenu = function(e) {
				
				document.body.removeEventListener('click', removeMenu);
				that.parentNode.removeEventListener('click', removeMenu);
				that.removeEventListener('click', removeMenu);
				
				menu.style.opacity = '0';
				setTimeout(function(){ menu.remove(); }.bind(this), 500);
				
				delete that._menu;
			};
			
			var menu = that._menu = new Menu(
				{
					className: flagrate.className + '-pulldown-menu',
					items    : opt.items,
					onSelect : function() {
						
						opt.onSelect();
						menu.remove();
						delete that._menu;
					}
				}
			);
			
			menu.style.top  = that.offsetTop + that.getHeight() + 'px';
			menu.style.left = that.offsetLeft + 'px';
			
			that.insert({ after: menu });
			
			setTimeout(function() {
				document.body.addEventListener('click', removeMenu);
				that.parentNode.addEventListener('click', removeMenu);
				that.addEventListener('click', removeMenu);
			}, 0);
		};
		
		new Element('span', { 'class': flagrate.className + '-pulldown-triangle' }).insertTo(that);
		
		if (opt.style) that.setStyle(opt.style);
		if (opt.color) that.setColor(opt.color);
		
		if (opt.isDisabled) that.disable();
		
		return that;
	};
	
	/*?
	 *  class flagrate.Popover
	**/
	
	/*?
	 *  new flagrate.Popover(option) -> flagrate.Popover
	 *  - option (Object) - options.
	 *  
	 *  Popover.
	 *  
	 *  ##### option
	 *  
	 *  * `target`                   (Element):
	 *  * `text`                     (String):
	 *  * `html`                     (String):
	 *  * `element`                  (Element):
	**/
	var Popover = flagrate.Popover = function _Popover(opt) {
		
		opt = opt || {};
		
		this.target = opt.target  || null;
		var text    = opt.text    || null;
		var html    = opt.html    || null;
		var element = opt.element || null;
		
		this.isShowing = false;
		
		/*?
		 *  flagrate.Popover#open() -> flagrate.Popover
		**/
		this.open = function(target) {
			
			var e = window.event || {};
			var t = this.target || e.target || document.body;
			
			if (target instanceof HTMLElement) t = target;
			
			if (this.isShowing) this.close();
			
			this.isShowing = true;
			
			this._div = new Element('div', {
				'class': flagrate.className + ' ' + flagrate.className + '-popover'
			});
			
			if (text)    this._div.updateText(text);
			if (html)    this._div.update(html);
			if (element) this._div.update(element);
			
			this._div.style.opacity = 0;
			this._div.insertTo(document.body);
			
			var tOffset  = Element.cumulativeOffset(t);
			var tScroll  = Element.cumulativeScrollOffset(t);
			var tWidth   = Element.getWidth(t);
			var tHeight  = Element.getHeight(t);
			var width    = this._div.getWidth();
			var height   = this._div.getHeight();
			
			var x = tOffset.left - tScroll.left + (tWidth / 2) - (width / 2);
			var y = tOffset.top - tScroll.top + tHeight;
			
			var xa = 'left';
			var ya = 'top';
			
			if (y + height > window.innerHeight) {
				ya = 'bottom';
				y  = window.innerHeight - y + tHeight;
			}
			
			this._div.addClassName(flagrate.className + '-popover-tail-' + ya);
			
			this._div.style[xa]     = x + 'px';
			this._div.style[ya]     = y + 'px';
			this._div.style.opacity = 1;
			
			if (e.type && e.type === 'mouseover') {
				document.body.addEventListener('click', this.close);
				document.body.addEventListener('mouseout', this.close);
			}
			
			document.body.addEventListener('mouseup', this.close);
			document.body.addEventListener('mousewheel', this.close);
			
			var stopper = function(e) {
				e.stopPropagation();
				if (e.type === 'mousewheel') e.preventDefault();
			};
			
			this._div.addEventListener('click', stopper);
			this._div.addEventListener('mouseup', stopper);
			this._div.addEventListener('mousewheel', stopper);
			
			return this;
		}.bind(this);
		
		/*?
		 *  flagrate.Popover#close() -> flagrate.Popover
		**/
		this.close = function() {
			
			document.body.removeEventListener('click', this.close);
			document.body.removeEventListener('mouseup', this.close);
			document.body.removeEventListener('mouseout', this.close);
			document.body.removeEventListener('mousewheel', this.close);
			
			this.isShowing = false;
			
			var div = this._div;
			setTimeout(function() {
				if (div && div.remove) div.remove();
			}, 0);
			
			delete this._div;
			
			return this;
		}.bind(this);
		
		if (this.target !== null) this.target.addEventListener('mouseover', this.open);
		
		return this;
	};
	
	Popover.prototype = {
		/*?
		 *  flagrate.Popover#visible() -> Boolean
		**/
		visible: function() {
			return this.isShowing;
		}
		,
		/*?
		 *  flagrate.Popover#remove() -> flagrate.Popover
		**/
		remove: function() {
			if (this._div) this.close();
			
			if (this.target !== null) this.target.removeEventListener('mouseover', this.open);
		}
	};
	
	/*?
	 *  class flagrate.ContextMenu
	**/
	
	/*?
	 *  new flagrate.ContextMenu(option) -> flagrate.ContextMenu
	 *  - option (Object) - options.
	 *  
	 *  ContextMenu.
	 *  
	 *  ##### option
	 *  
	 *  * `target`                   (Element):
	 *  * `items`                    (Array): of item (see: flagrate.Menu)
	**/
	var ContextMenu = flagrate.ContextMenu = function _ContextMenu(opt) {
		
		opt = opt || {};
		
		this.target = opt.target || null;
		this.items  = opt.items  || null;
		
		this.isShowing = false;
		
		/*?
		 *  flagrate.ContextMenu#open() -> flagrate.ContextMenu
		**/
		this.open = function() {
			
			var e = window.event || {};
			
			if (e.preventDefault) {
				e.preventDefault();
			}
			
			if (this.isShowing) this.close();
			
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
			
			if (x + this._menu.getWidth() > window.innerWidth) x = x - this._menu.getWidth();
			
			if (y + this._menu.getHeight() > window.innerHeight) y = y - this._menu.getHeight();
			
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
		this.close = function() {
			
			document.body.removeEventListener('click', this.close);
			document.body.removeEventListener('mouseup', this.close);
			document.body.removeEventListener('mousewheel', this.close);
			
			this.isShowing = false;
			
			var menu = this._menu;
			setTimeout(function() {
				if (menu && menu.remove) menu.remove();
			}, 0);
			
			delete this._menu;
			
			return this;
		}.bind(this);
		
		if (this.target !== null) this.target.addEventListener('contextmenu', this.open);
		
		return this;
	};
	
	ContextMenu.prototype = {
		/*?
		 *  flagrate.ContextMenu#visible() -> Boolean
		**/
		visible: function() {
			return this.isShowing;
		}
		,
		/*?
		 *  flagrate.ContextMenu#remove() -> flagrate.ContextMenu
		**/
		remove: function() {
			if (this._menu) this.close();
			
			if (this.target !== null) this.target.removeEventListener('contextmenu', this.open);
		}
	};
	
	/*?
	 *  class flagrate.Toolbar
	**/
	
	/*?
	 *  new flagrate.Toolbar(attribute, option) -> flagrate.Toolbar
	 *  - option (Object) - options.
	 *  
	 *  Toolbar.
	 *  
	 *  ##### option
	 *  
	 *  * `id`                       (String): `id` attribute of container element.
	 *  * `className`                (String):
	 *  * `attribute`                (Object):
	 *  * `style`                    (Object): (using flagrate.Element.setStyle)
	 *  * `items`                    (Array): of item or String to create border, Element to insert any element.
	 *  
	 *  ##### item
	 *  
	 *  * `key`                      (String):
	 *  * `element`                  (Element):
	**/
	var Toolbar = flagrate.Toolbar = function _Toolbar(opt) {
		
		opt = opt || {};
		
		opt.items = opt.items || [];
		
		var attr = opt.attribute || {};
		
		attr.id       = opt.id;
		attr['class'] = opt.className;
		
		//create
		var that = new Element('div', attr);
		extendObject(that, this);
		
		that.addClassName(flagrate.className + ' ' + flagrate.className + '-toolbar');
		
		for (var i = 0, l = opt.items.length; i < l; i++) {
			that.push(opt.items[i]);
		}
		
		if (opt.style) that.setStyle(opt.style);
		
		return that;
	};
	
	Toolbar.prototype = {
		/*?
		 *  flagrate.Toolbar#push(item) -> flagrate.Toolbar
		**/
		push: function(a) {
			
			if (typeof a === 'string') {
				new Element('hr').insertTo(this);
			} else if (a instanceof HTMLElement) {
				this.insert(a);
			} else {
				if (a.element) {
					if (a.key) a.element._key = a.key;
					this.insert(a.element);
				}
			}
			
			return this;
		}
		,
		/*?
		 *  flagrate.Toolbar#getElementByKey(key) -> Element | null
		**/
		getElementByKey: function(key) {
			
			var result = null;
			
			var elements = this.childNodes;
			for (var i = 0; i < elements.length; i++) {
				if (!elements[i]._key) continue;
				
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
	**/
	
	/*?
	 *  new flagrate.TextInput(option) -> flagrate.TextInput
	 *  - option (Object) - options.
	 *  
	 *  TextInput.
	 *  
	 *  ##### option
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
	var TextInput = flagrate.TextInput = function _TextInput(opt) {
		
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
		
		if (opt.style) that.setStyle(opt.style);
		
		if (opt.isDisabled) that.disable();
		
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
	 *  new flagrate.Tokenizer(option) -> flagrate.Tokenizer
	 *  - option (Object) - options.
	 *  
	 *  Tokenizer.
	 *  
	 *  ##### option
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
	var Tokenizer = flagrate.Tokenizer = function _Tokenizer(opt) {
		
		opt = opt || {};
		
		opt.placeholder = opt.placeholder || null;
		
		this.values   = opt.values   || [];
		this.max      = opt.max      || -1;
		this.tokenize = opt.tokenize || identity;
		this.onChange = opt.onChange || function(){};
		
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
		
		that.addEventListener('click', that._onClickHandler.bind(that));
		
		that._input.addEventListener('keydown',  that._onKeydownHandler.bind(that));
		that._input.addEventListener('focus',    that._onFocusHandler.bind(that));
		that._input.addEventListener('blur',     that._onBlurHandler.bind(that));
		
		if (opt.style) that.setStyle(opt.style);
		
		if (opt.isDisabled) that.disable();
		
		return that;
	};
	
	Tokenizer.prototype = {
		/*?
		 *  flagrate.Tokenizer#disable() -> flagrate.Tokenizer
		**/
		disable: function() {
			
			this.addClassName(flagrate.className + '-tokenizer-disabled');
			this._input.disable();
			
			return this._updateTokens();
		}
		,
		/*?
		 *  flagrate.Tokenizer#enable() -> flagrate.Tokenizer
		**/
		enable: function() {
			
			this.removeClassName(flagrate.className + '-tokenizer-disabled');
			this._input.enable();
			
			return this._updateTokens();
		}
		,
		/*?
		 *  flagrate.Tokenizer#isEnabled() -> Boolean
		**/
		isEnabled: function() {
			return !this.hasClassName(flagrate.className + '-tokenizer-disabled');
		}
		,
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
			
			for (var i = 0, l = this.values.length; i < l; i++) {
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
			var bw = parseInt(this.getStyle('border-width').replace('px', ''), 10)  || 2;
			var pl = parseInt(this.getStyle('padding-left').replace('px', ''), 10)  || 4;
			var pr = parseInt(this.getStyle('padding-right').replace('px', ''), 10) || 4;
			var tw = this._tokens.getWidth();
			var tm = parseInt(this._tokens.getStyle('margin-left').replace('px', ''), 10) || 2;
			var im = parseInt(this._input.getStyle('margin-left').replace('px', ''), 10) || 2;
			var ip = parseInt(this._input.getStyle('padding-left').replace('px', ''), 10) || 2;
			var aw = vw - pl - pr - tw - tm - im - ip - (bw * 2);
			
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
		_createTokenButtonOnRemoveHandler: function(that, value) {
			return function() { that.removeValue(value); };
		}
		,
		_tokenize: function(e) {
			
			this._candidates = [];
			
			var str = this._input.value;
			
			var result = this.tokenize(str, this._tokenized.bind(this));
			
			if (result) this._tokenized(result);
			
			this._lastTokenizedValue = this._input.value;
			
			return this;
		}
		,
		_tokenized: function(candidates) {
			
			if (candidates instanceof Array === false) candidates = [candidates];
			
			this._candidates = candidates;
			
			var menu = new Menu(
				{
					onSelect: function() {
						menu.remove();
					}
				}
			);
			
			menu.style.left = this._input.offsetLeft + 'px';
			
			this.insert({ top: menu });
			
			for (var i = 0, l = candidates.length; i < l; i++) {
				var candidate = candidates[i];
				
				var a;
				
				if (typeof candidate === 'string') {
					a = { label: candidate };
				} else {
					a = candidate;
				}
				
				if (a.onSelect) a._onSelect = a.onSelect;
				
				a.onSelect = this._createMenuOnSelectHandler(this, candidate, a);
				
				menu.push(a);
			}
			
			if (this._menu) this._menu.remove();
			this._menu = menu;
			
			return this;
		}
		,
		_createMenuOnSelectHandler: function(that, candidate, menuItem) {
			
			return function(e) {
				
				if (that.max < 0 || that.max > that.values.length) {
					that.values.push(candidate);
				}
				that._updateTokens();
				that.onChange();
				
				if (menuItem._onSelect) menuItem._onSelect(e);
			};
		}
		,
		_onClickHandler: function(e) {
			this._input.focus();
		}
		,
		_onKeydownHandler: function(e) {
			
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
					
					if (this._menu) this._menu.remove();
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
					
					if (this._menu) this._menu.remove();
				}
			}
			
			setTimeout(function() {
			
				if (this.max > -1 && this.max <= this.values.length && this._input.value !== '') {
					e.stopPropagation();
					
					this._input.value = '';
					
					return;
				}
				
				this._tokenize();
			}.bind(this), 0);
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
	 *  new flagrate.TextArea(option) -> flagrate.TextArea
	 *  - option (Object) - options.
	 *  
	 *  TextArea.
	 *  
	 *  ##### option
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
	var TextArea = flagrate.TextArea = function _TextArea(opt) {
		
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
		
		if (opt.value) that.setValue(opt.value);
		if (opt.style) that.setStyle(opt.style);
		
		if (opt.isDisabled) that.disable();
		
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
			
			this.value = value;
			
			return this;
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
	 *  class flagrate.Checkbox
	**/
	
	/*?
	 *  new flagrate.Checkbox(option) -> flagrate.Checkbox
	 *  - option (Object) - options.
	**/
	var Checkbox = flagrate.Checkbox = function _Checkbox(opt) {
		
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
		
		that._input.addEventListener('change', function(e) {
			
			if (that.isChecked()) {
				if (that.onCheck) that.onCheck(e);
			} else {
				if (that.onUncheck) that.onUncheck(e);
			}
			
			if (that.onChange) that.onChange(e);
		});
		
		if (opt.isChecked)  that.check();
		if (opt.isDisabled) that.disable();
		
		return that;
	};
	
	Checkbox.idCounter = 0;
	
	Checkbox.prototype = {
		/*?
		 *  flagrate.Checkbox#disable() -> flagrate.Checkbox
		**/
		disable: function() {
			
			this.addClassName(flagrate.className + '-checkbox-disabled');
			this._input.writeAttribute('disabled', true);
			
			return this;
		}
		,
		/*?
		 *  flagrate.Checkbox#enable() -> flagrate.Checkbox
		**/
		enable: function() {
			
			this.removeClassName(flagrate.className + '-checkbox-disabled');
			this._input.writeAttribute('disabled', false);
			
			return this;
		}
		,
		/*?
		 *  flagrate.Checkbox#isEnabled() -> Boolean
		**/
		isEnabled: function() {
			return !this.hasClassName(flagrate.className + '-checkbox-disabled');
		}
		,
		/*?
		 *  flagrate.Checkbox#isChecked() -> Boolean
		**/
		isChecked: function() {
			return !!this._input.checked;
		}
		,
		/*?
		 *  flagrate.Checkbox#check() -> flagrate.Checkbox
		**/
		check: function() {
			
			this._input.checked = true;
			
			return this;
		}
		,
		/*?
		 *  flagrate.Checkbox#uncheck() -> flagrate.Checkbox
		**/
		uncheck: function() {
			
			this._input.checked = false;
			
			return this;
		}
	};
	
	/*?
	 *  class flagrate.Radio
	**/
	
	/*?
	 *  new flagrate.Radio(option) -> flagrate.Radio
	 *  - option (Object) - options.
	**/
	var Radio = flagrate.Radio = function _Radio(opt) {
		
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
		
		if (opt.isChecked)  that.check();
		if (opt.isDisabled) that.disable();
		
		return that;
	};
	
	Radio.idCounter = 0;
	
	Radio.prototype = {
		/*?
		 *  flagrate.Radio#disable() -> flagrate.Radio
		**/
		disable: function() {
			
			this.addClassName(flagrate.className + '-radio-disabled');
			this._input.writeAttribute('disabled', true);
			
			return this;
		}
		,
		/*?
		 *  flagrate.Radio#enable() -> flagrate.Radio
		**/
		enable: function() {
			
			this.removeClassName(flagrate.className + '-radio-disabled');
			this._input.writeAttribute('disabled', false);
			
			return this;
		}
		,
		/*?
		 *  flagrate.Radio#isEnabled() -> Boolean
		**/
		isEnabled: function() {
			return !this.hasClassName(flagrate.className + '-radio-disabled');
		}
		,
		/*?
		 *  flagrate.Radio#isChecked() -> String
		**/
		isChecked: function() {
			return this._input.readAttribute('checked') === 'checked';
		}
		,
		/*?
		 *  flagrate.Radio#check() -> flagrate.Radio
		**/
		check: function() {
			return this._input.writeAttribute('checked', true);
		}
		,
		/*?
		 *  flagrate.Radio#uncheck() -> flagrate.Radio
		**/
		uncheck: function() {
			return this._input.writeAttribute('checked', false);
		}
	};
	
	/*?
	 *  class flagrate.Progress
	**/
	
	/*?
	 *  new flagrate.Progress(option) -> flagrate.Progress
	 *  - option (Object) - options.
	**/
	var Progress = flagrate.Progress = function _Progress(opt) {
		
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
		
		that._updateProgress();
		
		return that;
	};
	
	Progress.prototype = {
		/*?
		 *  flagrate.Progress#getValue() -> Number
		**/
		getValue: function() {
			return this.value;
		}
		,
		/*?
		 *  flagrate.Progress#setValue(number) -> flagrate.Progress
		**/
		setValue: function(number) {
			
			if (typeof number !== 'number') return this;
			
			this.value = Math.max(0, Math.min(this.max, number));
			
			return this._updateProgress();
		}
		,
		_updateProgress: function() {
			
			var percentage = Math.max(0, Math.min(100, this.value / this.max * 100));
			
			this.update(
				new Element().setStyle({ width: percentage + '%' })
			);
			
			return this;
		}
	};
	
	/*?
	 *  class flagrate.Slider
	**/
	
	/*?
	 *  new flagrate.Slider(option) -> flagrate.Slider
	 *  - option (Object) - options.
	**/
	var Slider = flagrate.Slider = function _Slider(opt) {
		
		opt = opt || {};
		
		//create
		var that = new Progress(opt);
		extendObject(that, this);
		
		that.addClassName(flagrate.className + '-slider');
		
		that.addEventListener('mousedown',     that._onPointerDownHandler.bind(that));
		that.addEventListener('touchstart',    that._onPointerDownHandler.bind(that));
		that.addEventListener('MSPointerDown', that._onPointerDownHandler.bind(that));
		
		if (opt.isDisabled) that.disable();
		
		return that;
	};
	
	Slider.prototype = {
		/*?
		 *  flagrate.Slider#disable() -> flagrate.Slider
		**/
		disable: function() {
			return this.addClassName(flagrate.className + '-slider-disabled');
		}
		,
		/*?
		 *  flagrate.Slider#enable() -> flagrate.Slider
		**/
		enable: function() {
			return this.removeClassName(flagrate.className + '-slider-disabled');
		}
		,
		/*?
		 *  flagrate.Slider#isEnabled() -> Boolean
		**/
		isEnabled: function() {
			return !this.hasClassName(flagrate.className + '-slider-disabled');
		}
		,
		_onPointerDownHandler: function(e) {
			
			if (!this.isEnabled()) return;
			
			e.preventDefault();
			
			var x   = 0;
			var pos = 0;
			
			switch (e.type) {
				case 'mousedown':
				case 'MSPointerDown':
					x   = e.offsetX || e.layerX;
					pos = e.clientX;
					break;
				case 'touchstart':
					x   = e.touches[0].clientX - e.target.offsetLeft;
					pos = e.touches[0].clientX;
					break;
			}
			
			this._slide(x, pos);
		}
		,
		_slide: function(x, pos) {
			
			var unitWidth  = this.getWidth() / this.max;
			
			var onMove = function(e) {
				
				e.preventDefault();
				
				if (e.touches && e.touches[0]) {
					x   = x + e.touches[0].clientX -pos;
					pos = e.touches[0].clientX;
				} else {
					x   = x + e.clientX - pos;
					pos = e.clientX;
				}
				
				this.setValue(Math.round(x / unitWidth));
			}.bind(this);
			
			var onUp = function(e) {
				
				e.preventDefault();
				
				document.body.removeEventListener('mousemove',     onMove);
				document.body.removeEventListener('touchmove',     onMove);
				document.body.removeEventListener('MSPointerMove', onMove);
				document.body.removeEventListener('mouseup',       onUp);
				document.body.removeEventListener('touchend',      onUp);
				document.body.removeEventListener('touchcancel',   onUp);
				document.body.removeEventListener('MSPointerUp',   onUp);
				
				if (e.touches && e.touches[0]) {
					x = x + e.touches[0].clientX -pos;
					this.setValue(Math.round(x / unitWidth));
				}
				
				if (e.clientX) {
					x = x + e.clientX - pos;
					this.setValue(Math.round(x / unitWidth));
				}
			}.bind(this);
			
			document.body.addEventListener('mousemove',     onMove);
			document.body.addEventListener('touchmove',     onMove);
			document.body.addEventListener('MSPointerMove', onMove);
			document.body.addEventListener('mouseup',       onUp);
			document.body.addEventListener('touchend',      onUp);
			document.body.addEventListener('touchcancel',   onUp);
			document.body.addEventListener('MSPointerUp',   onUp);
			
			this.setValue(Math.round(x / unitWidth));
		}
	};
	
	/*?
	 *  class flagrate.Notify
	**/
	// ref: Hypernotifier/1.0 https://github.com/kanreisa/Hypernotifier/blob/792fa7/hypernotifier.js
	
	/*?
	 *  new flagrate.Notify(option) -> flagrate.Notify
	 *  - option (Object) - configuration for the notifications.
	 *  
	 *  Initialize the notifications.
	 *  
	 *  ##### option
	 *  
	 *  * `target`               (Element; default `document.body`):
	 *  * `className`            (String):
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
		this.className = opt.className || null;
		
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
			notify.addClassName(flagrate.className + ' ' + flagrate.className + '-notify');
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
			
			notify.style.position      = 'fixed';
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
				};
				
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
			
			for (var i = 0, l = this.notifies.length; i < l; i++) {
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
	 *  class flagrate.Modal
	**/
	// ref: Hypermodal/1.2 https://github.com/kanreisa/Hypermodal/blob/9470a7/hypermodal.css
	
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
		this.className = opt.className || null;
		
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
			this._closeButton = new Button({
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
		
		for (var i = 0, l = this.buttons.length; i < l; i++) {
			var a = this.buttons[i];
			
			a.button = new Button({
				label     : a.label,
				icon      : a.icon,
				color     : a.color,
				isFocuesed: a.isFocused || false,
				isDisabled: a.isDisabled,
				onSelect  : this._createButtonOnSelectHandler(this, a)
			});
			
			this._footer.insert(a.button);
		}
		
		this._base = new Element('div', {
			id     : this.id,
			'class': this.className
		});
		
		this._base.addClassName(flagrate.className + ' ' + flagrate.className + '-modal');
		
		this._obi = new Element('div').update(this._modal).insertTo(this._base);
		
		if (this.disableCloseByMask === false) {
			this._base.addEventListener('click', this.close.bind(this));
		}
		
		this._onKeydownHandler = function(e) {
			
			var active = document.activeElement.tagName;
			
			if (active !== 'BODY') return;
			
			e.stopPropagation();
			e.preventDefault();
			
			// TAB:9
			if (e.keyCode === 9) {
				if (this._closeButton) return this._closeButton.focus();
				if (this.buttons[0]) return this.buttons[0].focus();
			}
			
			// ENTER:13
			if (e.keyCode === 13 && this.buttons[0]) return this.buttons[0].button.click();
			
			// ESC:27
			if (e.keyCode === 27) return this.close();
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
		,
		_createButtonOnSelectHandler: function(that, button) {
			
			return function(e) {
				try {
					button.onSelect(e, that);
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
	 *  new flagrate.Grid(option) -> flagrate.Grid
	 *  - option (Object) - configuration for the grid.
	 *  
	 *  Create and initialize the grid.
	 *  
	 *  ##### option
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
	 *  ##### col
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
	 *  ##### row
	 *  
	 *  * `id`                       (String): `id` attribute of `tr`
	 *  * `className`                (String):
	 *  * `attribute`                (Object):
	 *  * `style`                    (Object): styling of `tr` (using flagrate.Element.setStyle)
	 *  * `cell`                     (Object; default `{}`): of cell object.
	 *  * `menuItems`                (Array): of Menu items.
	 *  * `isSelected`               (Boolean):
	 *  * `onSelect`                 (Function):
	 *  * `onDeselect`               (Function):
	 *  * `onClick`                  (Function):
	 *  * `onDblClick`               (Function):
	 *  * `postProcess`              (Function):
	 *  
	 *  ##### cell
	 *  
	 *  * `id`                       (String): `id` attribute of `td`
	 *  * `className`                (String):
	 *  * `attribute`                (Object):
	 *  * `style`                    (Object): styling of `td` (using flagrate.Element.setStyle)
	 *  * `text`                     (String):
	 *  * `html`                     (String):
	 *  * `element`                  (Element):
	 *  * `sortAlt`                  (Number|String):
	 *  * `onClick`                  (Function):
	 *  * `onDblClick`               (Function):
	 *  * `postProcess`              (Function):
	**/
	//<div class="flagrate flagrate-grid">
	//  <div class="flagrate-grid-head">
	//    <table>
	//      <thead>
	//        <tr>
	//          <th>
	//          </th>
	//        </tr>
	//      </thead>
	//    </table>
	//  </div>
	//  <div class="flagrate-grid-body">
	//    <table>
	//      <tbody>
	//        <tr>
	//          <td>
	//          </td>
	//        </tr>
	//      </tbody>
	//    </table>
	//  </div>
	//</div>
	var Grid = flagrate.Grid = function _Grid(opt) {
		
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
		
		return this._create()._requestRender();
	};
	
	Grid.idCounter = 0;
	
	Grid.prototype = {
		/*?
		 *  flagrate.Grid#insertTo(element) -> flagrate.Grid
		 *
		 *  please refer to flagrate.Element.insertTo
		**/
		insertTo: function(element) {
			return this.element.insertTo(element) && this;
		}
		,
		/*?
		 *  flagrate.Grid#select(row(s)[, row, row, ...]) -> flagrate.Grid
		 *
		 *  select row(s)
		**/
		select: function(a) {
			
			var rows;
			
			if (a instanceof Array) {
				rows = a;
			} else {
				rows = [];
				
				for (var i = 0, l = arguments.length; i < l; i++) {
					if (typeof arguments[i] === 'number') {
						if (this.rows[arguments[i]]) rows.push(this.rows[arguments[i]]);
					} else if (typeof a === 'object') {
						rows.push(a);
					}
				}
			}
			
			if (this.multiSelect === false) this.deselectAll();
			
			for (var j = 0, m = rows.length; j < m; j++) {
				var row = rows[j];
				
				row.isSelected = true;
				
				if (row._tr && row._tr.hasClassName(flagrate.className + '-grid-row-selected') === true) continue;
				
				this._selectedRows.push(row);
				
				if (row._tr) row._tr.addClassName(flagrate.className + '-grid-row-selected');
				
				if (row._checkbox) row._checkbox.check();
				
				if (row.onSelect) row.onSelect(window.event, row);
				if (this.onSelect) this.onSelect(window.event, row);
			}
			
			if (this._selectedRows.length !== 0 && this._checkbox) this._checkbox.check();
			
			return this;
		}
		,
		/*?
		 *  flagrate.Grid#deselect(row(s)[, row, row, ...]) -> flagrate.Grid
		 *
		 *  deselect row(s)
		**/
		deselect: function(a) {
			
			var rows;
			
			if (a instanceof Array) {
				rows = a;
			} else {
				rows = [];
				
				for (var i = 0, l = arguments.length; i < l; i++) {
					if (typeof arguments[i] === 'number') {
						if (this.rows[arguments[i]]) rows.push(this.rows[arguments[i]]);
					} else if (typeof a === 'object') {
						rows.push(a);
					}
				}
			}
			
			for (var j = 0, m = rows.length; j < m; j++) {
				var row = rows[j];
				
				row.isSelected = false;
				
				if (row._tr && row._tr.hasClassName(flagrate.className + '-grid-row-selected') === false) continue;
				
				this._selectedRows.splice(this._selectedRows.indexOf(row), 1);
				
				if (row._tr) row._tr.removeClassName(flagrate.className + '-grid-row-selected');
				
				if (row._checkbox) row._checkbox.uncheck();
				
				if (row.onDeselect) row.onDeselect(window.event, row);
				if (this.onDeselect) this.onDeselect(window.event, row);
			}
			
			if (this._selectedRows.length === 0 && this._checkbox) this._checkbox.uncheck();
			
			return this;
		}
		,
		/*?
		 *  flagrate.Grid#selectAll() -> flagrate.Grid
		 *
		 *  select all rows
		**/
		selectAll: function() {
			return this.select(this.rows);
		}
		,
		/*?
		 *  flagrate.Grid#deselectAll() -> flagrate.Grid
		 *
		 *  deselect all rows
		**/
		deselectAll: function() {
			return this.deselect(this.rows);
		}
		,
		/*?
		 *  flagrate.Grid#getSelectedRows() -> Array
		 *
		 *  get selected rows
		**/
		getSelectedRows: function() {
			return this._selectedRows;
		}
		,
		/*?
		 *  flagrate.Grid#sort(key, isAsc) -> flagrate.Grid
		 *  - key   (String)
		 *  - isAsc (Boolean)
		 *
		 *  sort rows by key
		**/
		sort: function(key, isAsc) {
			
			this.rows.sort(function(a, b) {
				
				var A = 0;
				var B = 0;
				
				if (a.cell[key]) A = a.cell[key].sortAlt || a.cell[key].text || a.cell[key].html || a.cell[key].element && a.cell[key].element.innerHTML || a.cell[key]._div && a.cell[key]._div.innerHTML || 0;
				if (b.cell[key]) B = b.cell[key].sortAlt || b.cell[key].text || b.cell[key].html || b.cell[key].element && b.cell[key].element.innerHTML || b.cell[key]._div && b.cell[key]._div.innerHTML || 0;
				
				return (A > B) ? 1 : -1;
			});
			
			if (!isAsc) this.rows.reverse();
			
			for (var i = 0, l = this.cols.length; i < l; i++) {
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
					this.cols[i].isAsc    = !!isAsc;
				} else {
					if (this.cols[i].isSorted && this.cols[i]._th) this.cols[i]._th.removeClassName(flagrate.className + '-grid-col-sorted-asc').removeClassName(flagrate.className + '-grid-col-sorted-desc');
					
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
		 *  - row (Object, Array)
		 *
		 *  unshift row(s)
		**/
		unshift: function(r) {
			
			if (r instanceof Array) {
				for (var i = 0, l = r.length; i < l; i++) {
					this.rows.unshift(r);
				}
			} else {
				this.rows.unshift(r);
			}
			
			this._requestRender();
			
			return this.rows.length;
		}
		,
		/*?
		 *  flagrate.Grid#push(row) -> Number
		 *  - row (Object, Array)
		 *
		 *  push row(s)
		**/
		push: function(r) {
			
			if (r instanceof Array) {
				for (var i = 0, l = r.length; i < l; i++) {
					this.rows.push(r);
				}
			} else {
				this.rows.push(r);
			}
			
			this._requestRender();
			
			return this.rows.length;
		}
		,
		/*?
		 *  flagrate.Grid#shift(count) -> Object|Array
		 *  - count (Number; default `1`)
		 *
		 *  shift row(s)
		**/
		shift: function(c) {
			
			c = c || 1;
			
			var removes = [];
			
			for (var i = 0, l = this.rows.length; i < l && i < c; i++) {
				removes.push(this.rows.shift());
			}
			
			this._requestRender();
			
			return c === 1 ? removes[0] : removes;
		}
		,
		/*?
		 *  flagrate.Grid#pop(count) -> Object|Array
		 *  - count (Number; default `1`)
		 *
		 *  pop row(s)
		**/
		pop: function(c) {
			
			c = c || 1;
			
			var removes = [];
			
			for (var i = 0, l = this.rows.length; i < l && i < c; i++) {
				removes.push(this.rows.pop());
			}
			
			this._requestRender();
			
			return c === 1 ? removes[0] : removes;
		}
		,
		/*?
		 *  flagrate.Grid#splice(index, howMany, row) -> Array
		 *  - index   (Number) - Index at which to start changing the flagrate.Grid#rows.
		 *  - howMany (Number) - An integer indicating the number of old flagrate.Grid#rows to remove.
		 *  - row     (Object, Array) - The row(s) to add to the flagrate.Grid#rows.
		 *
		 *  Changes the content of a rows, adding new row(s) while removing old rows.
		**/
		splice: function(index, c, r) {
			
			c = c || this.rows.length - index;
			
			var removes = this.rows.splice(index, c);
			
			if (r instanceof Array === false) r = [r];
			
			for (var i = 0, l = r.length; i < l; i++) {
				this.rows.splice(index + i, 0, r[i]);
			}
			
			this._requestRender();
			
			return removes;
		}
		,
		/*?
		 *  flagrate.Grid#indexOf(row[, fromIndex]) -> Number
		 *  - row     (Object) - row to locate in the flagrate.Grid.
		 *  - index   (Number; default `0`) - The index to start the search at.
		 *
		 *  Returns the index at which a given row can be found in the flagrate.Grid#rows, or -1 if it is not present.
		**/
		indexOf: function(r, index) {
			return this.rows.indexOf(r, index);
		}
		,
		/*?
		 *  flagrate.Grid#delete(row) -> Object|Array
		 *  - row (Object, Array) - row to locate in the flagrate.Grid.
		 *
		 *  delete row(s).
		**/
		'delete': function(r) {
			
			var removes = [];
			
			if (r instanceof Array === false) r = [r];
			
			for (var i = 0, l = r.length; i < l; i++) {
				var index = this.indexOf(r[i]);
				if (index !== -1) removes.push(this.splice(index, 1));
			}
			
			return removes;
		}
		,
		_create: function() {
			
			// root container
			this.element = new Element('div');
			
			if (this.id)        this.element.writeAttribute('id', this.id);
			if (this.className) this.element.writeAttribute('class', this.className);
			if (this.attribute) this.element.writeAttribute(this.attribute);
			if (this.style)     this.element.setStyle(this.style);
			
			this.element.addClassName(flagrate.className + ' ' + flagrate.className + '-grid');
			
			if (this.headless) this.element.addClassName(flagrate.className + '-grid-headless');
			
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
			
			for (var i = 0, l = this.cols.length; i < l; i++) {
				var col = this.cols[i];
				
				col._id = this._id + '-col-' + i.toString(10);
				
				col._th  = new Element('th').insertTo(tr);
				
				if (col.id)        col._th.writeAttribute('id', col.id);
				if (col.className) col._th.writeAttribute('class', col.className);
				if (col.attribute) col._th.writeAttribute(col.attribute);
				if (col.style)     col._th.setStyle(col.style);
				
				col._th.addClassName(col._id);
				
				var width = !!col.width ? (col.width.toString(10) + 'px') : 'auto';
				this._style.insertText('.' + col._id + '{width:' + width + '}');
				
				if (col.align) col._th.style.textAlign = col.align;
				
				col._div = new Element().insertTo(col._th);
				
				if (col.label) col._div.updateText(col.label);
				
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
								onSelect : function() {
									this.pagePosition = 0;
									this._requestRender();
								}.bind(this)
							})
						},
						{
							key    : 'prev',
							element: new Button({
								className: flagrate.className + '-grid-pager-prev',
								onSelect : function() {
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
								onSelect : function() {
									++this.pagePosition;
									this._requestRender();
								}.bind(this)
							})
						},
						{
							key    : 'last',
							element: new Button({
								className: flagrate.className + '-grid-pager-last',
								onSelect : function() {
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
		_requestRender: function() {
			
			if (this._renderTimer) clearTimeout(this._renderTimer);
			this._renderTimer = setTimeout(this._render.bind(this), 0);
			
			return this;
		}
		,
		_render: function() {
			
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
				if (pages <= this.pagePosition) this.pagePosition = pages - 1;
				if (this.pagePosition <= 0) this.pagePosition = 0;
				from  = this.pagePosition * this.numberOfRowsPerPage;
				to    = from + this.numberOfRowsPerPage;
			}
			
			this._tbody.update();
			
			for (i = 0; i < rl; i++) {
				if (this.pagination) {
					if (i < from) continue;
					if (i >= to)  break;
					++pl;
				}
				
				row = this.rows[i];
				
				if (!row._tr) row._tr = new Element('tr');
				row._tr.insertTo(this._tbody);
				
				if (row.id)        row._tr.writeAttribute('id', row.id);
				if (row.className) row._tr.writeAttribute('class', row.className);
				if (row.attribute) row._tr.writeAttribute(row.attribute);
				if (row.style)     row._tr.setStyle(row.style);
				
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
				
				if (row.isSelected === true) this.select(row);
				
				for (j = 0; j < cl; j++) {
					col  = this.cols[j];
					cell = row.cell[col.key] || (row.cell[col.key] = {});
					
					if (!cell._td) cell._td = new Element('td');
					cell._td.insertTo(row._tr);
					
					if (cell.id)        cell._td.writeAttribute('id', cell.id);
					if (cell.className) cell._td.writeAttribute('class', cell.className);
					if (cell.attribute) cell._td.writeAttribute(cell.attribute);
					if (cell.style)     cell._td.setStyle(cell.style);
					
					if (col.align) cell._td.style.textAlign = col.align;
					
					cell._td.addClassName(col._id);
					
					if (!cell._div) cell._div = new Element();
					cell._div.insertTo(cell._td);
					
					if (cell.text)    cell._div.updateText(cell.text);
					if (cell.html)    cell._div.update(cell.html);
					if (cell.element) cell._div.update(cell.element);
					
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
					if (cell.postProcess) cell.postProcess(cell._td);
				}
				
				if (!row._last) row._last = new Element('td', { 'class': this._id + '-col-last' });
				row._last.insertTo(row._tr);
				
				// menu
				if (row.menuItems) {
					row._last.addClassName(flagrate.className + '-grid-cell-menu');
					
					//row
					if (row._menu) row._menu.remove();
					row._menu = new ContextMenu({
						target: row._tr,
						items : row.menuItems
					});
					
					row._last.onclick = this._createLastRowOnClickHandler(this, row);
				}
				
				// post-processing
				if (row.postProcess) row.postProcess(row._tr);
				if (this.postProcessOfRow) this.postProcessOfRow(row._tr);
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
			
			if (this.onRendered !== null) this.onRendered(this);
			
			return this;
		}
		,
		_updatePositionOfResizeHandles: function() {
			
			var adj = this.fill ? -this._body.scrollLeft : 0;
			
			var col;
			
			for (var i = 0, l = this.cols.length; i < l; i++) {
				col = this.cols[i];
				
				if (col._resizeHandle) {
					col._resizeHandle.style.left = (col._th.offsetLeft + col._th.getWidth() + adj) + 'px';
				}
			}
			
			return this;
		}
		,
		_updateLayoutOfCols: function() {
			
			var col;
			
			for (var i = 0, l = this.cols.length; i < l; i++) {
				col = this.cols[i];
				
				if (col.width) continue;
				
				col.width = col._th.getWidth();
				
				this._style.updateText(
					this._style.innerHTML.replace(
						new RegExp('('+ col._id + '{width:)([^}]*)}'),
						'$1' + col.width + 'px}'
					)
				);
			}
			
			this.element.addClassName(flagrate.className + '-grid-fixed');
			
			setTimeout(function() {
				
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
		_createOnScrollHandler: function(that) {
			
			return function(e) {
				
				if (that.disableResize === false) that._updateLayoutOfCols();
			};
		}
		,
		_createBodyOnScrollHandler: function(that) {
			
			return function(e) {
				
				that._head.style.right = (that._body.offsetWidth - that._body.clientWidth) + 'px';
				that._head.scrollLeft = that._body.scrollLeft;
				
				if (that.disableResize === false) {
					that._updateLayoutOfCols();
					that._updatePositionOfResizeHandles();
				}
			};
		}
		,
		_createColOnClickHandler: function(that, col) {
			
			return function(e) {
				
				that.sort(col.key, !col.isAsc);
			};
		}
		,
		_createRowOnClickHandler: function(that, row) {
			
			return function(e) {
				
				if (row.onClick)  row.onClick(e, row);
				if (that.onClick) that.onClick(e, row);
				
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
		_createRowOnDblClickHandler: function(that, row) {
			
			return function(e) {
				
				if (row.onDblClick)  row.onDblClick(e, row);
				if (that.onDblClick) that.onDblClick(e, row);
			};
		}
		,
		_createCellOnClickHandler: function(that, cell) {
			
			return function(e) {
				
				if (cell.onClick) cell.onClick(e, cell);
			};
		}
		,
		_createCellOnDblClickHandler: function(that, cell) {
			
			return function(e) {
				
				if (cell.onDblClick) cell.onDblClick(e, cell);
			};
		}
		,
		_createRowOnCheckHandler: function(that, row) {
			
			return function(e) {
				
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
		_createLastRowOnClickHandler: function(that, row) {
			
			return function(e) {
				
				e.stopPropagation();
				
				if (row._menu) row._menu.open();
			};
		}
		,
		_createResizeHandleOnMousedownHandler: function(that, col) {
			
			return function(e) {
				
				//e.stopPropagation();
				e.preventDefault();
				
				var current = e.clientX;
				var origin  = current;
				
				var onMove = function(e) {
					
					e.preventDefault();
					
					var delta = e.clientX - current;
					current += delta;
					
					col._resizeHandle.style.left = (parseInt(col._resizeHandle.style.left.replace('px', ''), 10) + delta) + 'px';
				};
				
				var onUp = function(e) {
					
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
	
})();