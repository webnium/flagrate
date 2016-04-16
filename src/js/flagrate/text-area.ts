/*
   Copyright 2016 Webnium

   Licensed under the Apache License, Version 2.0 (the "License");
   you may not use this file except in compliance with the License.
   You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
*/
'use strict';

import { extendObject, emptyFunction } from './util';
import { Element, FHTMLTextAreaElement } from './element';

/*?
    class flagrate.TextArea

    TextArea.

    #### Inheritances

    * flagrate.Element
    * [HTMLTextAreaElement](https://developer.mozilla.org/en-US/docs/Web/API/HTMLTextAreaElement) (MDN)
**/
export interface TextArea extends Instance, FHTMLTextAreaElement { }

export interface Class {
    new (option?: Option): TextArea;
    prototype: Instance;
}

export interface Instance {
    disable(): TextArea;
    enable(): TextArea;
    isEnabled(): boolean;
    setValue(value: string): TextArea;
    getValue(): string;
    setIcon(url?: string): TextArea;
    getIcon(): string;
    isValid(): boolean;
}

export interface Option {
    /** id attribute. */
    id?: string;

    /** class attribute. */
    className?: string;

    /** attribute/value pairs properties. */
    attribute?: any;

    /** CSS style properties (uses flagrate.Element.setStyle). */
    style?: any;

    /** default value. */
    value?: string;

    /** placeholder. */
    placeholder?: string;

    /** icon image URL. */
    icon?: string;

    /** RegExp for simple validation feature. */
    regexp?: RegExp;

    /** default is false. */
    isDisabled?: boolean;
}

/*?
    flagrate.createTextArea(option)
    new flagrate.TextArea(option)
    - option (Object) - options.

    TextArea.

    #### option

    * `id`                       (String): `id` attribute of `textarea` element.
    * `className`                (String):
    * `attribute`                (Object):
    * `style`                    (Object): (using flagrate.Element.setStyle)
    * `value`                    (String):
    * `placeholder`              (String):
    * `icon`                     (String):
    * `regexp`                   (RegExp):
    * `isDisabled`               (Boolean; default `false`):
**/
function FTextArea(option: Option = {}) {

    this.regexp = option.regexp || null;

    const attr = option.attribute || {};

    if (option.id) {
        attr.id = option.id;
    }
    if (option.placeholder) {
        attr.placeholder = option.placeholder;
    }

    //create
    const textArea = new Element('textarea', attr) as TextArea;
    extendObject(textArea, this);

    textArea.addClassName('flagrate flagrate-textarea');
    if (option.className) {
        textArea.addClassName(option.className);
    }

    if (option.style) {
        textArea.setStyle(option.style);
    }
    if (option.icon) {
        textArea.setIcon(option.icon);
    }
    if (option.value) {
        textArea.setValue(option.value);
    }

    if (option.isDisabled) {
        textArea.disable();
    }

    return textArea;
}

export const TextArea = FTextArea as any as Class;

export function createTextArea(option?: Option): TextArea {
    return new TextArea(option);
}

TextArea.prototype = {
    disable() {

        this.addClassName('flagrate-disabled');
        this.writeAttribute('disabled', true);

        return this;
    },

    enable() {

        this.removeClassName('flagrate-disabled');
        this.writeAttribute('disabled', false);

        return this;
    },

    isEnabled() {
        return !this.hasClassName('flagrate-disabled');
    },

    setValue(value: string) {

        this.value = value;

        return this;
    },

    getValue() {
        return this.value;
    },

    setIcon(identifier) {

        this._iconIdentifier = identifier;

        if (identifier) {
            return this.addClassName('flagrate-icon').setStyle({
                backgroundImage: `url(${identifier})`
            });
        } else {
            return this.removeClassName('flagrate-icon').setStyle({
                backgroundImage: 'none'
            });
        }
    },

    getIcon() {
        return this._iconIdentifier || '';
    },

    isValid: function () {
        return this.regexp.test(this.getValue());
    }
};