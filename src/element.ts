function isElement(object): boolean {
    return !!(object && object.nodeType === 1);
}

/*?
 *  class Flagrate.Element
 *
 *  The Flagrate.Element object provides a variety of powerful DOM methods for interacting
 *   with DOM elements.
 *
 *  #### Example
 *
 *      var preview = Flagrate.createElement().insertTo(x);
 *      preview.on('updated', function (e) {
 *        console.log('fired custom event', e);
 *      });
 *      
 *      var input = Flagrate.createTextInput().insertTo(x);
 *      input.on('change', function () {
 *        preview.updateText(input.value);
 *        preview.fire('updated');
 *      });
 *
 *  #### Inheritance
 *
 *  * [HTMLElement](https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement) (MDN)
**/
export interface IElement extends IElementInstance, HTMLElement { }

export interface IElementClass {
    new? (tagName?: string, attribute?: any): IElement;
    (tagName?: string, attribute?: any): void;
    prototype?: IElementInstance;

    cache?: Object;

    _insertionTranslation?: IElementInsertionF;

    /*?
     *  Flagrate.Element.visible(element) -> Boolean
     *
     *  This method is similar to http://api.prototypejs.org/dom/Element/visible/
    **/
    /**
     *  Tells whether `element` is visible
     *  @param element target.
    **/
    visible? <T extends HTMLElement>(element: T): boolean;

    /*?
     *  Flagrate.Element.exists(element) -> Boolean
    **/
    /**
     *  Tells whether `element` is exists on document.
     *  @param element target.
    **/
    exists? <T extends HTMLElement>(element: T): boolean;

    /*?
     *  Flagrate.Element.toggle(element) -> Element
     *
     *  This method is similar to http://api.prototypejs.org/dom/Element/toggle/
    **/
    /**
     *  Toggles the visibility of `element`. Returns `element`.
     *  @param element target.
    **/
    toggle? <T extends HTMLElement>(element: T): T;

    /*?
     *  Flagrate.Element.hide(element) -> Element
     *
     *  This method is similar to http://api.prototypejs.org/dom/Element/hide/
    **/
    /**
     *  Sets `display: none` on `element`. Returns `element`.
     *  @param element target.
    **/
    hide? <T extends HTMLElement>(element: T): T;

    /*?
     *  Flagrate.Element.show(element) -> Element
     *
     *  This method is similar to http://api.prototypejs.org/dom/Element/show/
    **/
    /**
     *  Removes `display: none` on `element`. Returns `element`.
     *  @param element target.
    **/
    show? <T extends HTMLElement>(element: T): T;

    /*?
     *  Flagrate.Element.remove(element) -> Element
     *
     *  This method is similar to http://api.prototypejs.org/dom/Element/remove/
    **/
    /**
     *  Completely removes `element` from the document and returns it.
     *  @param element target.
    **/
    remove? <T extends HTMLElement>(element: T): T;
    update? <T extends HTMLElement>(element: T, content?: string): T;
    update? <T extends HTMLElement>(element: T, content?: number): T;
    update? <T extends HTMLElement, U extends HTMLElement>(element: T, content?: U): T;
    updateText? <T extends HTMLElement>(element: T, content?: string): T;
    updateText? <T extends HTMLElement>(element: T, content?: number): T;
    insert? <T extends HTMLElement>(element: T, content: string): T;
    insert? <T extends HTMLElement>(element: T, content: number): T;
    insert? <T extends HTMLElement, U extends HTMLElement>(element: T, content: U): T;
    insert? <T extends HTMLElement>(element: T, content: IElementInsertion): T;
    insertText? <T extends HTMLElement>(element: T, content: string): T;
    insertText? <T extends HTMLElement>(element: T, content: number): T;
    insertText? <T extends HTMLElement>(element: T, content: IElementInsertion): T;
    insertTo? <T extends HTMLElement, U extends HTMLElement>(element: T, to: U, position: 'before'): T;
    insertTo? <T extends HTMLElement, U extends HTMLElement>(element: T, to: U, position: 'top'): T;
    insertTo? <T extends HTMLElement, U extends HTMLElement>(element: T, to: U, position: 'bottom'): T;
    insertTo? <T extends HTMLElement, U extends HTMLElement>(element: T, to: U, position: 'after'): T;
    insertTo? <T extends HTMLElement, U extends HTMLElement>(element: T, to: U, position?): T;
    readAttribute? <T extends HTMLElement>(element: T, name: string): string;
    writeAttribute? <T extends HTMLElement>(element: T, attributeName: string, value?: boolean): T;
    writeAttribute? <T extends HTMLElement>(element: T, attributeName: string, value?: string): T;
    writeAttribute? <T extends HTMLElement>(element: T, attribute: any): T;
    getDimensions? <T extends HTMLElement>(element: T): IElementDimension;
    getHeight? <T extends HTMLElement>(element: T): number;
    getWidth? <T extends HTMLElement>(element: T): number;
    cumulativeOffset? <T extends HTMLElement>(element: T): IElementOffset;
    cumulativeScrollOffset? <T extends HTMLElement>(element: T): IElementOffset;
    hasClassName? <T extends HTMLElement>(element: T, className: string): boolean;
    addClassName? <T extends HTMLElement>(element: T, className: string): T;
    removeClassName? <T extends HTMLElement>(element: T, className: string): T;
    toggleClassName? <T extends HTMLElement>(element: T, className: string): T;
    getStyle? <T extends HTMLElement>(element: T, propertyName: string): any;
    getStyle? <T extends HTMLElement>(element: T, propertyName: 'opacity'): number;
    getStyle? <T extends HTMLElement>(element: T, propertyName: any): any;
    setStyle? <T extends HTMLElement>(element: T, style: any): T;
    on? <T extends HTMLElement>(element: T, eventType: string, listener: EventListener, useCapture?: boolean): T;
    off? <T extends HTMLElement>(element: T, eventType: string, listener?: EventListener, useCapture?: boolean): T;
    fire? <T extends HTMLElement>(element: T, eventType: string, property?: any): T;
    emit? <T extends HTMLElement>(element: T, eventType: string, property?: any): T;
    extend? <T extends HTMLElement>(element: T): IElement;
}

export interface IElementInstance {
    isFlagrated?: boolean;

    /*?
     *  Flagrate.Element#visible() -> Boolean
     *
     *  ref: Flagrate.Element.visible
    **/
    /** Tells whether the visibility. */
    visible? (): boolean;

    /*?
     *  Flagrate.Element#exists() -> Boolean
     *
     *  ref: Flagrate.Element.exists
    **/
    /** Tells whether `element` is exists on document. */
    exists? (): boolean;

    /*?
     *  Flagrate.Element#toggle() -> Flagrate.Element
     *
     *  ref: Flagrate.Element.toggle
    **/
    /** Toggles the visibility of `element`. Returns `element`. */
    toggle? (): IElement;

    /*?
     *  Flagrate.Element#hide() -> Flagrate.Element
     *
     *  ref: Flagrate.Element.hide
    **/
    /** Sets `display: none` on `element`. Returns `element`. */
    hide? (): IElement;

    /*?
     *  Flagrate.Element#show() -> Flagrate.Element
     *
     *  ref: Flagrate.Element.show
    **/
    /** Removes `display: none` on `element`. Returns `element`. */
    show? (): IElement;

    /*?
     *  Flagrate.Element#remove() -> Flagrate.Element
     *
     *  ref: Flagrate.Element.remove
    **/
    /** Completely removes `element` from the document and returns it. */
    remove? (): IElement;

    update? (content?: string): IElement;
    update? (content?: number): IElement;
    update? <T extends HTMLElement>(content?: T): IElement;
    updateText? (content?: string): IElement;
    updateText? (content?: number): IElement;
    insert? (content: string): IElement;
    insert? (content: number): IElement;
    insert? <T extends HTMLElement>(content: T): IElement;
    insert? (content: IElementInsertion): IElement;
    insertText? (content: string): IElement;
    insertText? (content: number): IElement;
    insertText? (content: IElementInsertion): IElement;
    insertTo? <T extends HTMLElement>(to: T, position: 'before'): IElement;
    insertTo? <T extends HTMLElement>(to: T, position: 'top'): IElement;
    insertTo? <T extends HTMLElement>(to: T, position: 'bottom'): IElement;
    insertTo? <T extends HTMLElement>(to: T, position: 'after'): IElement;
    insertTo? <T extends HTMLElement>(to: T, position?): IElement;
    readAttribute? (name: string): string;
    writeAttribute? (attributeName: string, value?: boolean): IElement;
    writeAttribute? (attributeName: string, value?: string): IElement;
    writeAttribute? (attribute: any): IElement;
    getDimensions? (): IElementDimension;
    getHeight? (): number;
    getWidth? (): number;
    cumulativeOffset? (): IElementOffset;
    cumulativeScrollOffset? (): IElementOffset;
    hasClassName? (className: string): boolean;
    addClassName? (className: string): IElement;
    removeClassName? (className: string): IElement;
    toggleClassName? (className: string): IElement;
    getStyle? (propertyName: string): any;
    getStyle? (propertyName: 'opacity'): number;
    getStyle? (propertyName: any): any;
    setStyle? (style: any): IElement;
    on? (eventType: string, listener: EventListener, useCapture?: boolean): IElement;
    off? (eventType: string, listener?: EventListener, useCapture?: boolean): IElement;
    fire? (eventType: string, property?: any): IElement;
    emit? (eventType: string, property?: any): IElement;
}

export interface IElementDimension {
    width: number;
    height: number;
}

export interface IElementOffset {
    top: number;
    left: number;
}

export interface IElementInsertion {
    before?: HTMLElement;
    top?: HTMLElement;
    bottom?: HTMLElement;
    after?: HTMLElement;
}

export interface IElementInsertionF {
    before? <T extends HTMLElement, U extends HTMLElement>(element: T, node: U): void;
    top? <T extends HTMLElement, U extends HTMLElement>(element: T, node: U): void;
    bottom? <T extends HTMLElement, U extends HTMLElement>(element: T, node: U): void;
    after? <T extends HTMLElement, U extends HTMLElement>(element: T, node: U): void;
}

/*?
 *  Flagrate.createElement([tagName = "div", attribute])
 *  new Flagrate.Element([tagName = "div", attribute])
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
 *      var a = Flagrate.createElement('a', { 'class': 'foo', href: '/foo.html' }).insert("Next page").insertTo(x);
**/
export var Element: IElementClass = function(tagName = 'div', attribute?: any): IElement {

    var node: IElement;

    if (Element.cache[tagName]) {
        node = Element.cache[tagName].cloneNode(false);
    } else if ((attribute && attribute.hasOwnProperty('type')) || tagName === 'select') {
        node = document.createElement(tagName);
    } else {
        node = document.createElement(tagName);
        Element.cache[tagName] = node.cloneNode(false);
    }

    Flagrate.extendObject(node, this);

    return attribute ? node.writeAttribute(attribute) : node;
};

/**
 *  Creates an HTML element with `tagName` as the tag name, optionally with the given attributes.
 *  @param tagName The name of the HTML element to create.
 *  @param attribute An optional group of attribute/value pairs to set on the element.
**/
export function createElement(tagName?: string, attribute?: any): IElement {
    return new Element(tagName, attribute);
}

Element.cache = {};

Element.prototype = {
    isFlagrated: true,

    visible () {
        return Element.visible(<IElement>this);
    },

    exists () {
        return Element.exists(<IElement>this);
    },

    toggle () {
        return Element.toggle(<IElement>this);
    },

    hide () {
        return Element.hide(<IElement>this);
    },

    show () {
        return Element.show(<IElement>this);
    },

    remove () {
        return Element.remove(<IElement>this);
    },

    /*?
     *  Flagrate.Element#update([newContent]) -> Flagrate.Element
     *
     *  please refer to Flagrate.Element.update
    **/
    update (content) {
        return Element.update(<IElement>this, content);
    },

    /*?
     *  Flagrate.Element#updateText([newContent]) -> Flagrate.Element
     *
     *  please refer to Flagrate.Element.updateText
    **/
    updateText (text) {
        return Element.updateText(<IElement>this, text);
    },

    /*?
     *  Flagrate.Element#insert(content) -> Flagrate.Element
     *
     *  please refer to Flagrate.Element.insert
    **/
    insert (content) {
        return Element.insert(<IElement>this, content);
    },

    /*?
     *  Flagrate.Element#insertText(content) -> Flagrate.Element
     *
     *  please refer to Flagrate.Element.insertText
    **/
    insertText (text) {
        return Element.insertText(<IElement>this, text);
    },

    /*?
     *  Flagrate.Element#insertTo(element[, position = "bottom"]) -> Flagrate.Element
     *
     *  please refer to Flagrate.Element.insertTo
    **/
    insertTo (element, pos) {
        return Element.insertTo(<IElement>this, element, pos);
    },

    /*?
     *  Flagrate.Element#readAttribute(attributeName) -> Flagrate.Element
     *
     *  please refer to Flagrate.Element.readAttribute
    **/
    readAttribute (name) {
        return Element.readAttribute(<IElement>this, name);
    },

    /*?
     *  Flagrate.Element#writeAttribute(attribute[, value = true]) -> Flagrate.Element
     *
     *  please refer to Flagrate.Element.writeAttribute
    **/
    writeAttribute (name, value?): IElement {
        return Element.writeAttribute(<IElement>this, name, value);
    },

    /*?
     *  Flagrate.Element#getDimensions() -> Object
     *
     *  please refer to Flagrate.Element.getDimensions
    **/
    getDimensions () {
        return Element.getDimensions(<IElement>this);
    },

    /*?
     *  Flagrate.Element#getHeight() -> Number
     *
     *  please refer to Flagrate.Element.getHeight
    **/
    getHeight () {
        return Element.getHeight(<IElement>this);
    },

    /*?
     *  Flagrate.Element#getWidth() -> Number
     *
     *  please refer to Flagrate.Element.getWidth
    **/
    getWidth () {
        return Element.getWidth(<IElement>this);
    },

    /*?
     *  Flagrate.Element#cumulativeOffset() -> Object
     *
     *  please refer to Flagrate.Element.cumulativeOffset
    **/
    cumulativeOffset () {
        return Element.cumulativeOffset(<IElement>this);
    },

    /*?
     *  Flagrate.Element#cumulativeScrollOffset() -> Object
     *
     *  please refer to Flagrate.Element.cumulativeScrollOffset
    **/
    cumulativeScrollOffset () {
        return Element.cumulativeScrollOffset(<IElement>this);
    },

    /*?
     *  Flagrate.Element#hasClassName(className) -> Boolean
     *
     *  please refer to Flagrate.Element.hasClassName
    **/
    hasClassName (className) {
        return Element.hasClassName(<IElement>this, className);
    },

    /*?
     *  Flagrate.Element#addClassName(className) -> Flagrate.Element
     *
     *  please refer to Flagrate.Element.addClassName
    **/
    addClassName (className) {
        return Element.addClassName(<IElement>this, className);
    },

    /*?
     *  Flagrate.Element#removeClassName(className) -> Flagrate.Element
     *
     *  please refer to Flagrate.Element.removeClassName
    **/
    removeClassName (className) {
        return Element.removeClassName(<IElement>this, className);
    },

    /*?
     *  Flagrate.Element#toggleClassName(className) -> Flagrate.Element
     *
     *  please refer to Flagrate.Element.toggleClassName
    **/
    toggleClassName (className) {
        return Element.toggleClassName(<IElement>this, className);
    },

    /*?
     *  Flagrate.Element#getStyle(propertyName) -> String | Number | null
     *
     *  please refer to Flagrate.Element.getStyle
    **/
    getStyle (propertyName) {
        return Element.getStyle(<IElement>this, propertyName);
    },

    /*?
     *  Flagrate.Element#setStyle(style) -> Flagrate.Element
     *
     *  please refer to Flagrate.Element.setStyle
    **/
    setStyle (style) {
        return Element.setStyle(<IElement>this, style);
    },

    /*?
     *  Flagrate.Element#on(eventName, listener[, useCapture = false]) -> Flagrate.Element
     *
     *  please refer to Flagrate.Element.on
    **/
    on (name, listener, useCapture) {
        return Element.on(<IElement>this, name, listener, useCapture);
    },

    /*?
     *  Flagrate.Element#off(eventName, listener[, useCapture = false]) -> Flagrate.Element
     *
     *  please refer to Flagrate.Element.off
    **/
    off (name, listener, useCapture) {
        return Element.off(<IElement>this, name, listener, useCapture);
    },

    /*?
     *  Flagrate.Element#fire(eventName[, property]) -> Flagrate.Element
     *
     *  please refer to Flagrate.Element.fire
    **/
    fire (name, property) {
        return Element.fire(<IElement>this, name, property);
    }
};

/*?
 *  Flagrate.Element#emit(eventName[, property]) -> Flagrate.Element
 *  Alias of: Flagrate.Element#fire
**/
Element.prototype.emit = Element.prototype.fire;

Element.visible = (element) => {
    return element.style.display !== 'none';
};

Element.exists = (element) => {

    if (element.parentNode) {
        while ((element = element.parentNode) !== null) {
            if (element === document) {
                return true;
            }
        }
    }

    return false;
};

Element.toggle = (element) => {

    return Element[Element.visible(element) ? 'hide' : 'show'](element);
};

Element.hide = (element) => {

    element.style.display = 'none';
    return element;
};

Element.show = (element) => {

    element.style.display = '';
    return element;
};

Element.remove = (element) => {

    if (element.parentNode) { element.parentNode.removeChild(element); }
    return element;
};

/*?
 *  Flagrate.Element.update(element[, newContent]) -> Element
 *  - element (Element) - instance of Element.
 *  - newContent (String|Number|Element) - new content.
 *  
 *  Replaces _the content_ of `element` with the `newContent` argument and
 *  returns `element`.
 *  
 *  This method is similar to http://api.prototypejs.org/dom/Element/update/
**/
Element.update = (element, content) => {

    var i = element.childNodes.length;
    while (i--) { Element.remove(element.childNodes[i]); }

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
 *  Flagrate.Element.updateText(element[, newContent]) -> Element
 *  - element (Element) - instance of Element.
 *  - newContent (String|Number) - new text content.
**/
Element.updateText = (element, content) => {

    var i = element.childNodes.length;
    while (i--) { Element.remove(element.childNodes[i]); }

    if (content === undefined) {
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
 *  Flagrate.Element.insert(element, content) -> Element
 *  - element (Element) - instance of Element.
 *  - content (String|Number|Element|Object) - The content to insert
 *  
 *  Inserts content `above`, `below`, at the `top`, and/or at the `bottom` of
 *  the given element, depending on the option(s) given.
 *  
 *  This method is similar to http://api.prototypejs.org/dom/Element/insert/
**/
Element.insert = (element, insertion) => {

    if (typeof insertion === 'string' || typeof insertion === 'number' || isElement(insertion) === true) {
        insertion = { bottom: insertion };
    }

    var position, content, insert, div;
    for (position in insertion) {
        if (insertion.hasOwnProperty(position)) {
            content = insertion[position];
            position = position.toLowerCase();
            insert = Element._insertionTranslation[position];

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
 *  Flagrate.Element.insertText(element, content) -> Element
 *  - element (Element) - instance of Element.
 *  - content (String|Number|Object) - The content to insert
 *  
 *  Inserts content `above`, `below`, at the `top`, and/or at the `bottom` of
 *  the given element, depending on the option(s) given.
**/
Element.insertText = (element, insertion) => {

    if (typeof insertion === 'string' || typeof insertion === 'number') {
        insertion = { bottom: insertion };
    }

    var position, content, insert;
    for (position in insertion) {
        if (insertion.hasOwnProperty(position)) {
            content = insertion[position];
            position = position.toLowerCase();
            insert = Element._insertionTranslation[position];

            if (typeof content !== 'string') { content = content.toString(10); }

            insert(element, document.createTextNode(content));
        }
    }

    return element;
};

/*?
 *  Flagrate.Element.insertTo(element, to[, position = "bottom"]) -> Element
 *  - element (Element) - insert this.
 *  - to (Element) - insert to this element.
 *  - position (String) - `before` or `top` or `bottom` or `after`.
**/
Element.insertTo = (element, to, position = 'bottom') => {

    var insertion = {};

    if (position) {
        insertion[position] = element;
    } else {
        insertion['bottom'] = element;
    }

    Element.insert(to, insertion);

    return element;
};

/*?
 *  Flagrate.Element.readAttribute(element, attributeName) -> String | null
 *  - element (Element) - instance of Element.
 *  - attributeName (String) - attribute name.
 *  
 *  Returns the value of `element`'s `attribute` or `null` if `attribute` has
 *  not been specified.
 *  
 *  This method is similar to http://api.prototypejs.org/dom/Element/readAttribute/
**/
Element.readAttribute = (element, name) => {

    // ref: https://github.com/sstephenson/prototype/blob/1fb9728/src/dom/dom.js#L1856

    return element.getAttribute(name);
};

/*?
 *  Flagrate.Element.writeAttribute(element, attribute[, value = true]) -> Element
 *  - element (Element) - instance of Element.
 *  - attribute (String|Object) - attribute name or name/value pairs object.
 *  - value (Boolean|String) - value of attribute.
 *  
 *  Adds, specifies or removes attributes passed as either a hash or a name/value pair.
 *  
 *  This method is similar to http://api.prototypejs.org/dom/Element/writeAttribute/
**/
Element.writeAttribute = (element, name, value?) => {

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
 *  Flagrate.Element.getDimensions(element) -> Object
 *  - element (Element) - instance of Element.
 *  
 *  Finds the computed width and height of `element` and returns them as
 *  key/value pairs of an object.
 *  
 *  This method is similar to http://api.prototypejs.org/dom/Element/getDimensions/
**/
Element.getDimensions = (element) => {

    var display = Element.getStyle(element, 'display');

    if (display && display !== 'none') {
        return { width: element.offsetWidth, height: element.offsetHeight };
    }

    var before: any = {
        visibility: element.style.visibility,
        position: element.style.position,
        display: element.style.display
    };

    var after: any = {
        visibility: 'hidden',
        display: 'block'
    };

    // Switching `fixed` to `absolute` causes issues in Safari.
    if (before.position !== 'fixed') { after.position = 'absolute'; }

    Element.setStyle(element, after);

    var dimensions = {
        width: element.offsetWidth,
        height: element.offsetHeight
    };

    Element.setStyle(element, before);

    return dimensions;
};

/*?
 *  Flagrate.Element.getHeight(element) -> Number
 *  - element (Element) - instance of Element.
 *  
 *  This method is similar to http://api.prototypejs.org/dom/Element/getHeight/
**/
Element.getHeight = (element) => {

    return Element.getDimensions(element).height;
};

/*?
 *  Flagrate.Element.getWidth(element) -> Number
 *  - element (Element) - instance of Element.
 *  
 *  This method is similar to http://api.prototypejs.org/dom/Element/getWidth/
**/
Element.getWidth = (element) => {

    return Element.getDimensions(element).width;
};

/*?
 *  Flagrate.Element.cumulativeOffset(element) -> Object
 *  - element (Element) - instance of Element.
 *  
 *  This method is similar to http://api.prototypejs.org/dom/Element/cumulativeOffset/
**/
Element.cumulativeOffset = (element) => {

    var t = 0, l = 0;
    if (element.parentNode) {
        do {
            t += element.offsetTop || 0;
            l += element.offsetLeft || 0;
            element = element.offsetParent;
        } while (element);
    }

    var offset = {
        top: t,
        left: l
    };

    return offset;
};

/*?
 *  Flagrate.Element.cumulativeScrollOffset(element) -> Object
 *  - element (Element) - instance of Element.
 *  
 *  This method is similar to http://api.prototypejs.org/dom/Element/cumulativeScrollOffset/
**/
Element.cumulativeScrollOffset = (element: any) => {

    var t = 0, l = 0;
    do {
        t += element.scrollTop || 0;
        l += element.scrollLeft || 0;
        // for Chrome
        if (element.parentNode === document.body && document.documentElement.scrollTop !== 0) {
            element = document.documentElement;
        } else {
            element = element.parentNode;
        }
    } while (element);

    var offset = {
        top: t,
        left: l
    };

    return offset;
};

/*?
 *  Flagrate.Element.hasClassName(element, className) -> Boolean
 *  - element (Element) - instance of Element.
 *  - className (String) - 
 *  
 *  This method is similar to http://api.prototypejs.org/dom/Element/hasClassName/
**/
Element.hasClassName = (element, className) => {

    return (element.className.length > 0 && (element.className === className || new RegExp('(^|\\s)' + className + '(\\s|$)').test(element.className)));
};

/*?
 *  Flagrate.Element.addClassName(element, className) -> Element
 *  - element (Element) - instance of Element.
 *  - className (String) - The class name to add.
 *  
 *  This method is similar to http://api.prototypejs.org/dom/Element/addClassName/
**/
Element.addClassName = (element, className) => {

    if (!Element.hasClassName(element, className)) {
        element.className += (element.className ? ' ' : '') + className;
    }

    return element;
};

/*?
 *  Flagrate.Element.removeClassName(element, className) -> Element
 *  - element (Element) - instance of Element.
 *  - className (String) -
 *  
 *  This method is similar to http://api.prototypejs.org/dom/Element/removeClassName/
**/
Element.removeClassName = (element, className) => {

    element.className = element.className.replace(
        new RegExp('(^|\\s+)' + className + '(\\s+|$)'), ' '
        ).trim();

    return element;
};

/*?
 *  Flagrate.Element.toggleClassName(element, className) -> Element
 *  - element (Element) - instance of Element.
 *  - className (String) -
 *  
 *  This method is similar to http://api.prototypejs.org/dom/Element/toggleClassName/
**/
Element.toggleClassName = (element, className) => {

    return Element[Element.hasClassName(element, className) ? 'removeClassName' : 'addClassName'](element, className);
};

/*?
 *  Flagrate.Element.getStyle(element, propertyName) -> String | Number | null
 *  - element (Element) - instance of Element.
 *  - propertyName (String) - The property name of style to be retrieved.
 *  
 *  This method is similar to http://api.prototypejs.org/dom/Element/getStyle/
**/
Element.getStyle = (element, style) => {

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
 *  Flagrate.Element.setStyle(element, style) -> Element
 *  - element (Element) - instance of Element.
 *  - style (Object) -
 *  
 *  This method is similar to http://api.prototypejs.org/dom/Element/setStyle/
**/
Element.setStyle = (element, style) => {

    var p;
    for (p in style) {
        if (style.hasOwnProperty(p)) {
            element.style[(p === 'float' || p === 'cssFloat') ? 'cssFloat' : p] = style[p];
        }
    }

    return element;
};

/*?
 *  Flagrate.Element.on(element, eventName, listener[, useCapture = false]) -> Element
 *  - element (Element) - instance of Element.
 *  - eventName (String) - name of event.
 *  - listener (Function) - The function to call when the event occurs.
 *  - useCapture (Boolean) -
 *  
 *  Registers an event handler on a DOM element.
**/
Element.on = (element, name, listener, useCapture) => {

    element.addEventListener(name, listener, useCapture || false);

    return element;
};

/*?
 *  Flagrate.Element.off(element, eventName, listener[, useCapture = false]) -> Element
 *  - element (Element) - instance of Element.
 *  - eventName (String) - name of event.
 *  - listener (Function) - The function to call when the event occurs.
 *  - useCapture (Boolean) -
 *  
 *  Registers an event handler on a DOM element.
**/
Element.off = (element, name, listener, useCapture) => {

    element.removeEventListener(name, listener, useCapture || false);

    return element;
};

/*?
 *  Flagrate.Element.fire(element, eventName[, property]) -> Element
 *  - element (Element) - instance of Element.
 *  - eventName (String) - name of event.
 *  - property (Object) -
 *  
 *  Fires a custom event.
**/
Element.fire = (element, name, property) => {

    var event = document.createEvent('HTMLEvents');
    event.initEvent(name, true, true);
    if (property) { Flagrate.extendObject(event, property); }
    element.dispatchEvent(event);

    return element;
};

/*?
 *  Flagrate.Element.emit(element, eventName[, property]) -> Element
 *  Alias of: Flagrate.Element.fire
**/
Element.emit = Element.fire;

/*?
 *  Flagrate.Element.extend(element) -> Flagrate.Element
 *  - element (Element) - instance of Element.
 *  
 *  Extends the given `element` instance.
 *  
 *  **Caution**: This method will add Flagrate.Element instance methods to given element instance.
**/
Element.extend = (element) => {

    if (element.isFlagrated) { return element; }

    Flagrate.extendObject(element, Element.prototype);

    return element;
};

// from https://github.com/sstephenson/prototype/blob/1fb9728/src/dom/dom.js#L3021-L3041
Element._insertionTranslation = {
    before(element, node) {
        element.parentNode.insertBefore(node, element);
    },
    top(element, node) {
        element.insertBefore(node, element.firstChild);
    },
    bottom(element, node) {
        element.appendChild(node);
    },
    after(element, node) {
        element.parentNode.insertBefore(node, element.nextSibling);
    }
};