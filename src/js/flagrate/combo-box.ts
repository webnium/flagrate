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

import { extendObject } from './util';
import { Element, FHTMLDivElement } from './element';
import { Button } from './button';
import { Menu } from './menu';
import { TextInput } from './text-input';

/*?
    class flagrate.ComboBox
**/
export interface ComboBox extends Instance, FHTMLDivElement { }

export interface Class {
    new (option?: Option): ComboBox;
    prototype: Instance;
}

export interface Instance {
    disable(): ComboBox;
    enable(): ComboBox;
    isEnabled(): boolean;
    getValue(): any;
    setValue(value: string): ComboBox;
    setIcon(url?: string): ComboBox;
    getIcon(): string;
    isValid(): boolean;

    /** readonly. */
    items?: any[];

    /** RegExp for simple validation feature. */
    regexp?: RegExp;

    _textinput?: TextInput;
    _button?: Button;
    _menu?: Menu;
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

    /** Array of any value or, ISelectItemOption object. */
    items?: any[];

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
    flagrate.createComboBox(option)
    new flagrate.ComboBox(option)
    - option (Object) - options.

    Select.

    #### option

    * `id`                       (String): `id` attribute of container element.
    * `className`                (String):
    * `attribute`                (Object):
    * `style`                    (Object): (using flagrate.Element.setStyle)
    * `value`                    (String): default value.
    * `items`                    (Array): of String values.
    * `placeholder`              (String):
    * `icon`                     (String):
    * `regexp`                   (RegExp):
    * `isDisabled`               (Boolean; default `false`):
**/
function FComboBox(option: Option = {}) {

    this.items = option.items || [];
    this.regexp = option.regexp || null;

    const attr = option.attribute || {};

    if (option.id) {
        attr.id = option.id;
    }

    //create
    const container = new Element('div', attr) as ComboBox;

    container._textinput = new TextInput({
        value: option.value,
        placeholder: option.placeholder,
        icon: option.icon
    }).insertTo(container);

    function createOnSelectHandler(value) {
        return () => {
            container.setValue(value);
            container._textinput.focus();
            container.fire('change');
        };
    }

    container._button = new Button({
        onSelect: () => {

            if (container._menu) {
                container._menu.remove();
                delete container._menu;
                return;
            }

            const items = [];
            let i = 0, l = container.items.length;
            for (; i < l; i++) {
                items.push({
                    label: container.items[i],
                    onSelect: createOnSelectHandler(container.items[i])
                });
            }

            const menu = container._menu = new Menu({
                className: 'flagrate-combobox-menu',
                items: items,
                onSelect: () => {
                    menu.remove();
                    delete container._menu;
                }
            }).insertTo(container);

            // To prevent overflow.
            let menuHeight = menu.getHeight();
            let menuMargin = parseInt(menu.getStyle('margin-top').replace('px', ''), 10);
            let cummOffsetTop = container.cumulativeOffset().top;
            let upsideSpace = - window.pageYOffset + cummOffsetTop;
            let downsideSpace = window.pageYOffset + window.innerHeight - cummOffsetTop - container.getHeight();
            if (menuHeight + menuMargin > downsideSpace) {
                if (upsideSpace > downsideSpace) {
                    if (upsideSpace < menuHeight + menuMargin) {
                        menuHeight = (upsideSpace - menuMargin - menuMargin);
                        menu.style.maxHeight =`${ menuHeight }px`;
                    }
                    menu.addClassName('flagrate-combobox-menu-upper');
                } else {
                    menuHeight = (downsideSpace - menuMargin - menuMargin);
                    menu.style.maxHeight = `${ menuHeight }px`;
                }
            }

            function removeMenu(e) {

                document.body.removeEventListener('click', removeMenu);
                container.parentNode.removeEventListener('click', removeMenu);
                container.off('click', removeMenu);

                menu.style.opacity = '0';
                setTimeout(() => menu.remove(), 500);

                delete container._menu;
            }

            setTimeout(() => {
                document.body.addEventListener('click', removeMenu);
                container.parentNode.addEventListener('click', removeMenu);
                container.on('click', removeMenu);
            }, 0);
        }
    }).insertTo(container);

    extendObject(container, this);

    container.addClassName('flagrate flagrate-combobox');
    if (option.className) {
        container.addClassName(option.className);
    }

    if (option.style) {
        container.setStyle(option.style);
    }

    if (option.isDisabled) {
        container.disable();
    }

    return container;
}

export const ComboBox = FComboBox as any as Class;

export function createComboBox(option?: Option): ComboBox {
    return new ComboBox(option);
}

ComboBox.prototype = {
    disable() {

        this.addClassName('flagrate-disabled');

        this._textinput.disable();
        this._button.disable();

        return this;
    },

    enable() {

        this.removeClassName('flagrate-disabled');

        this._textinput.enable();
        this._button.enable();

        return this;
    },

    isEnabled() {
        return !this.hasClassName('flagrate-disabled');
    },

    getValue() {
        return this._textinput.value;
    },

    setValue(value) {

        this._textinput.value = value;

        return this;
    },

    setIcon(identifier) {

        this._textinput.setIcon(identifier);

        return this;
    },

    getIcon() {
        return this._textinput.getIcon();
    },

    isValid() {
        return this.regexp.test(this.getValue());
    }
};