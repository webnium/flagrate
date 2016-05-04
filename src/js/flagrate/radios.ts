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
import { Element, Attribute, Property, FHTMLDivElement } from './element';
import { Radio, Option as _RadioOption, RadioEvent } from './radio';

/*?
    class flagrate.Radios
**/
export interface Radios extends Instance, FHTMLDivElement { }

export interface Class {
    new (option?: Option): Radios;
    prototype: Instance;
}

export interface Instance {
    select(index: number): this;
    getValue(): any;
    setValue(value: any): this;
    enable(): this;
    disable(): this;
    isEnabled(): boolean;

    onChange?(event: RadioEvent, target: this): void;

    selectedIndex?: number;

    _items?: RadiosItem[]
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
    items?: (string | number | boolean | RadioOption)[];

    /** default selectedIndex */
    selectedIndex?: number;

    /** default is false. */
    isDisabled?: boolean;

    onChange?(event?: RadioEvent, target?: Radios): void;
}

export interface RadioOption extends _RadioOption {
    label: string;
    value: any;
}

export interface RadiosItem extends RadioOption {
    _radio?: Radio;
}

let idCounter = 0;

/*?
    flagrate.createRadios(option)
    new flagrate.Radios(option)
    - option (Object) - options.
**/
function FRadios(opt: Option = {}) {

    const id = 'flagrate-radios-' + (++idCounter).toString(10);

    const attr = opt.attribute || {};

    if (opt.id) {
        attr['id'] = opt.id;
    }

    //create
    const radios = new Element('div', attr) as Radios;
    extendObject(radios, this);

    radios.addClassName('flagrate flagrate-radios');
    if (opt.className) {
        radios.addClassName(opt.className);
    }

    if (opt.style) {
        radios.setStyle(opt.style);
    }

    radios.onChange = opt.onChange;

    radios.selectedIndex = opt.selectedIndex || -1;

    radios._items = [];

    (opt.items || []).forEach((item, i) => {

        const _item: RadiosItem = {} as any;

        if (typeof item === 'object') {
            extendObject(_item, item);
        } else {
            _item.label = typeof item === 'string' ? item : item.toString(10);
            _item.value = item;
        }

        _item.name = id;

        _item._radio = new Radio(_item).insertTo(radios);

        _item._radio.addEventListener('change', e => {
            if (radios.onChange) {
                radios.onChange(e, radios);
            }
        });

        _item._radio.addEventListener('check', e => {
            radios.selectedIndex = i;
        });

        radios._items.push(_item);
    });

    if (opt.isDisabled) {
        radios.disable();
    }

    if (radios.selectedIndex > -1) {
        radios._items[radios.selectedIndex]._radio.check();
    }

    return radios;
}

export const Radios = FRadios as any as Class;

export function createRadios(option?: Option): Radios {
    return new Radios(option);
}

Radios.prototype = {
    select: function (index) {

        if (this._items[index] !== void 0) {
            this.selectedIndex = index;
            this._items[index]._radio.check();
        }

        return this;
    },

    getValue: function () {

        if (this.selectedIndex === -1) {
            return void 0;
        } else {
            return this._items[this.selectedIndex].value;
        }
    },

    setValue: function (value) {

        let i = 0, l = this._items.length;
        for (; i < l; i++) {
            if (this._items[i].value === value) {
                this.select(i);
                break;
            }
        }

        return this;
    },

    enable() {

        let i = 0, l = this._items.length;
        for (; i < l; i++) {
            this._items[i]._radio.enable();
        }

        this.removeClassName('flagrate-disabled');

        return this;
    },

    disable() {

        let i = 0, l = this._items.length;
        for (; i < l; i++) {
            this._items[i]._radio.disable();
        }

        this.addClassName('flagrate-disabled');

        return this;
    },

    isEnabled() {
        return !this.hasClassName('flagrate-disabled');
    }
};