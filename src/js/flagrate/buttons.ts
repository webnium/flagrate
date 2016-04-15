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
import { Element, FHTMLDivElement } from './element';
import * as button from './button';

/*?
    class flagrate.Buttons

    #### Example

        var button = flagrate.createButtons({
            items: [
                { label: 'Left' },
                { label: 'Middle' },
                { label: 'Right' }
            ]
        }).insertTo(x);

    #### Structure

    <div class="example-container">
        <div class="flagrate flagrate-buttons">
            <button class="flagrate flagrate-button">Left</button><button class="flagrate flagrate-button">Middle</button><button class="flagrate flagrate-button">Right</button>
        </div>
    </div>

        <div class="flagrate flagrate-buttons">
            <button class="flagrate flagrate-button">Left</button>
            <button class="flagrate flagrate-button">Middle</button>
            <button class="flagrate flagrate-button">Right</button>
        </div>

    #### Inheritances

    * flagrate.Element
    * flagrate.Button
**/
export interface Buttons extends Instance, FHTMLDivElement { }

export interface Class {
    new (option?: Option): Buttons;
    prototype: Instance;
}

export interface Instance {
    push(button: ButtonOption): Buttons;
    getButtonByKey(key: string): button.Button;
    getButtons(): button.Button[];
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

    /** Button items */
    items?: ButtonOption[];

    onSelect? (event?: any, buttons?: Buttons): void;
}

export interface ButtonOption extends button.Option {
    /** key */
    key?: string;
}

/*?
    flagrate.createButtons(option)
    new flagrate.Buttons(option)
    - option (Object) - options.

    Button group.

    #### option

    * `id`                       (String): `id` attribute of container element.
    * `className`                (String):
    * `attribute`                (Object):
    * `items`                    (Array): of item
    * `onSelect`                 (Function):

    #### item

    * `key`                      (String):
    * `label`                    (String; default `""`):
    * `icon`                     (String):
    * `color`                    (String):
    * `isDisabled`               (Boolean; default `false`):
    * `onSelect`                 (Function):
**/
function FButtons(option: Option = {}) {

    option.items = option.items || [];

    this.onSelect = option.onSelect || emptyFunction;

    const attr = option.attribute || {};
    if (option.id) {
        attr.id = option.id;
    }

    // create a container
    const container = new Element('div', attr) as Buttons;
    extendObject(container, this);

    container.addClassName('flagrate flagrate-buttons');
    if (option.className) {
        container.addClassName(option.className);
    }

    if (option.style) {
        container.setStyle(option.style);
    }

    let i = 0, l = option.items.length;
    for (; i < l; i++) {
        container.push(option.items[i]);
    }

    container.addEventListener('click', (e) => {
        e.stopPropagation();
        e.preventDefault();
    });

    return container;
}

export const Buttons = FButtons as any as Class;

export function createButtons(option?: Option): Buttons {
    return new Buttons(option);
}

Buttons.prototype = {
    push (option: ButtonOption) {

        const _onSelect = option.onSelect;

        option.onSelect = (e) => {

            if (_onSelect) {
                _onSelect(e);
            }

            this.onSelect(e);
        };

        const btn = new button.Button(option).insertTo(this);

        if (option.key) {
            btn.dataset['_key'] = option.key;
        }

        return this;
    },

    getButtonByKey (key: string) {

        let result = null;

        const elements = this.childNodes;
        let i = 0, l = elements.length;
        for (; i < l; i++) {
            if (elements[i].dataset['_key'] === key) {
                result = elements[i];
                break;
            }
        }

        return result;
    },

    getButtons () {
        return this.childNodes || [];
    }
};