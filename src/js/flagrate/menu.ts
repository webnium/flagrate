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
import { Element, Attribute, Property, FHTMLDivElement } from './element';
import * as button from './button';
import { Buttons } from './buttons';

/*?
    class flagrate.Menu

    #### Example

        var menu = flagrate.createMenu({
            items: [
                {
                    label: 'foo'
                },
                {
                    label: 'bar',
                    icon : 'icon.png'
                },
                '--',
                {
                    label: 'disabled button',
                    isDisabled: true
                }
            ]
        }).insertTo(x);

    #### Structure

    <div class="example-container">
        <div class="flagrate flagrate-menu">
            <button class="flagrate flagrate-button">foo</button>
            <button class="flagrate flagrate-button flagrate-icon" style="background-image: url(icon.png);">bar</button>
            <hr>
            <button class="flagrate flagrate-button flagrate-disabled" disabled="disabled">disabled button</button>
        </div>
    </div>

        <div class="flagrate flagrate-menu">
            <button class="flagrate flagrate-button">foo</button>
            <button class="flagrate flagrate-button flagrate-icon" style="background-image: url(icon.png);">bar</button>
            <hr>
            <button class="flagrate flagrate-button flagrate-disabled" disabled="disabled">disabled button</button>
        </div>

    `button` elements are created with flagrate.Button

    #### Inheritances

    * flagrate.Element
    * flagrate.Button
**/
export interface Menu extends Instance, FHTMLDivElement { }

export interface Class {
    new (option?: Option): Menu;
    prototype: Instance;
}

export interface Instance {
    push(item: ItemOption): this;
    getButtonByKey(key: string): button.Button;
    getButtons(): button.Button[];
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

    /** Button items */
    items?: ItemOption[];

    onSelect?(event?: button.ButtonEvent, menu?: Menu): void;
}

export interface ItemOption extends button.Option {
    /** key */
    key?: string;
}

/*?
    flagrate.createMenu(option)
    new flagrate.Menu(option)
    - option (Object) - options.

    Menu.

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
    * `isDisabled`               (Boolean; default `false`):
    * `onSelect`                 (Function):
**/
function FMenu(option: Option = {}) {

    option.items = option.items || [];

    this.onSelect = option.onSelect || emptyFunction;

    const attr = option.attribute || {};
    if (option.id) {
        attr['id'] = option.id;
    }

    // create a container
    const container = new Element('div', attr) as Menu;
    extendObject(container, this);

    container.addClassName('flagrate flagrate-menu');
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

    container.addEventListener('mouseup', (e) => {
        e.stopPropagation();
    });

    return container;
}

export const Menu = FMenu as any as Class;

export function createMenu(option?: Option): Menu {
    return new Menu(option);
}

Menu.prototype = {
    push(option: ItemOption) {

        if (typeof option === 'string') {
            new Element('hr').insertTo(this);
        } else {
            const _onSelect = option.onSelect;

            option.onSelect = (e, button) => {

                if (_onSelect) {
                    _onSelect(e, button);
                }

                this.onSelect(e, this);
            };

            const btn = new button.Button(option).insertTo(this);

            if (option.key) {
                btn.dataset['_key'] = option.key;
            }
        }

        return this;
    },

    getButtonByKey: Buttons.prototype.getButtonByKey,

    getButtons: Buttons.prototype.getButtons
};