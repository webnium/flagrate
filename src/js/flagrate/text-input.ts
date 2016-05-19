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
"use strict";

import { extendObject, emptyFunction } from "./util";
import { Element, Attribute, Property, FHTMLInputElement }  from "./element";

/*?
    class flagrate.TextInput

    TextInput.

    #### Inheritance

    * flagrate.Element
    * [HTMLInputElement](https://developer.mozilla.org/en-US/docs/Web/API/HTMLInputElement) (MDN)
**/
export interface TextInput extends Instance, FHTMLInputElement { }

export interface Class {
    new (option?: Option): TextInput;
    prototype: Instance;
}

export interface Instance {
    disable(): this;
    enable(): this;
    isEnabled(): boolean;
    setValue(value: string): this;
    getValue(): string;
    setIcon(url?: string): this;
    getIcon(): string;
    isValid(): boolean;
}

export interface Option {
    /** id attribute. */
    id?: string;

    /** class attribute. */
    className?: string;

    /** attribute/value pairs properties. */
    attribute?: Attribute;

    /** CSS style properties (uses flagrate.Element.setStyle). */
    style?: Property;

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
    flagrate.createTextInput(option)
    new flagrate.TextInput(option)
    - option (Object) - options.

    TextInput.

    #### option

    * `id`                       (String): `id` attribute of `input` element.
    * `className`                (String):
    * `attribute`                (Object):
    * `style`                    (Object): (using flagrate.Element.setStyle)
    * `value`                    (String):
    * `placeholder`              (String):
    * `icon`                     (String):
    * `regexp`                   (RegExp):
    * `isDisabled`               (Boolean; default `false`):
**/
function FTextInput(option: Option = {}) {

    this.regexp = option.regexp || null;

    const attr = option.attribute || {};

    if (option.id) {
        attr["id"] = option.id;
    }
    if (option.value) {
        attr["value"] = option.value;
    }
    if (option.placeholder) {
        attr["placeholder"] = option.placeholder;
    }

    //create
    const input = new Element("input", attr) as TextInput;
    extendObject(input, this);

    input.addClassName("flagrate flagrate-textinput");
    if (option.className) {
        input.addClassName(option.className);
    }

    if (option.style) {
        input.setStyle(option.style);
    }
    if (option.icon) {
        input.setIcon(option.icon);
    }

    if (option.isDisabled) {
        input.disable();
    }

    return input;
}

export const TextInput = FTextInput as any as Class;

export function createTextInput(option?: Option): TextInput {
    return new TextInput(option);
}

TextInput.prototype = {
    disable() {

        this.addClassName("flagrate-disabled");
        this.writeAttribute("disabled", true);

        return this;
    },

    enable() {

        this.removeClassName("flagrate-disabled");
        this.writeAttribute("disabled", false);

        return this;
    },

    isEnabled() {
        return !this.hasClassName("flagrate-disabled");
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
            return this.addClassName("flagrate-icon").setStyle({
                backgroundImage: `url(${identifier})`
            });
        } else {
            return this.removeClassName("flagrate-icon").setStyle({
                backgroundImage: "none"
            });
        }
    },

    getIcon() {
        return this._iconIdentifier || "";
    },

    isValid: function () {
        return this.regexp.test(this.getValue());
    }
};