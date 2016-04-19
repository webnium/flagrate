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
import { Checkbox, Option as _CheckboxOption, CheckboxEvent } from './checkbox';

/*?
    class flagrate.Checkboxes
**/
export interface Checkboxes extends Instance, FHTMLDivElement { }

export interface Class {
    new (option?: Option): Checkboxes;
    prototype: Instance;
}

export interface Instance {
    select(index: number): this;
    deselect(index: number): this;
    selectAll(): this;
    deselectAll(): this;
    getValues(): any[];
    addValue(value: any): this;
    removeValue(value: any): this;
    setValues(values: any[]): this;
    selectAll(): this;
    deselectAll(): this;
    enable(): this;
    disable(): this;
    isEnabled(): boolean;

    onChange?(event: CheckboxEvent, target: this): void;

    _items?: CheckboxesItem[]
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
    items?: (string | number | boolean | CheckboxOption)[];

    /** default value */
    values?: any[];

    /** default is false. */
    isDisabled?: boolean;

    onChange?(event?: CheckboxEvent, target?: Checkboxes): void;
}

export interface CheckboxOption extends _CheckboxOption {
    label: string;
    value: any;
}

export interface CheckboxesItem extends CheckboxOption {
    _checkbox?: Checkbox;
}

/*?
    flagrate.createCheckboxes(option)
    new flagrate.Checkboxes(option)
    - option (Object) - options.
**/
function FCheckboxes(opt: Option = {}) {

    const attr = opt.attribute || {};

    if (opt.id) {
        attr['id'] = opt.id;
    }

    //create
    const checkboxes = new Element('div', attr) as Checkboxes;
    extendObject(checkboxes, this);

    checkboxes.addClassName('flagrate flagrate-checkboxes');
    if (opt.className) {
        checkboxes.addClassName(opt.className);
    }

    if (opt.style) {
        checkboxes.setStyle(opt.style);
    }

    checkboxes.onChange = opt.onChange;

    checkboxes._items = [];

    (opt.items || []).forEach(item => {

        const _item: CheckboxesItem = {} as any;

        if (typeof item === 'object') {
            extendObject(_item, item);
        } else {
            _item.label = typeof item === 'string' ? item : item.toString(10);
            _item.value = item;
        }

        _item._checkbox = new Checkbox(_item).insertTo(checkboxes);

        _item._checkbox.addEventListener('change', e => {
            if (checkboxes.onChange) {
                checkboxes.onChange(e, checkboxes);
            }
        });

        checkboxes._items.push(_item);
    });

    if (opt.isDisabled) {
        checkboxes.disable();
    }

    if (opt.values) {
        checkboxes.setValues(opt.values);
    }

    return checkboxes;
}

export const Checkboxes = FCheckboxes as any as Class;

export function createCheckboxes(option?: Option): Checkboxes {
    return new Checkboxes(option);
}

Checkboxes.prototype = {
    select(index) {

        if (this._items[index]) {
            this._items[index]._checkbox.check();
        }

        return this;
    },

    deselect(index) {

        if (this._items[index]) {
            this._items[index]._checkbox.uncheck();
        }

        return this;
    },

    getValues() {

        const values = [];

        let i = 0, l = this._items.length;
        for (; i < l; i++) {
            if (this._items[i]._checkbox.isChecked() === true) {
                values.push(this._items[i].value);
            }
        }

        return values;
    },

    addValue(value) {

        let i = 0, l = this._items.length;
        for (; i < l; i++) {
            if (this._items[i].value === value) {
                this.select(i);
                break;
            }
        }

        return this;
    },

    removeValue(value) {

        let i = 0, l = this._items.length;
        for (; i < l; i++) {
            if (this._items[i].value === value) {
                this.deselect(i);
                break;
            }
        }

        return this;
    },

    setValues(values) {

        let i = 0, l = this._items.length;
        for (; i < l; i++) {
            if (values.indexOf(this._items[i].value) === -1) {
                this.deselect(i);
            } else {
                this.select(i);
            }
        }

        return this;
    },

    selectAll() {

        let i = 0, l = this._items.length;
        for (; i < l; i++) {
            this.select(i);
        }

        return this;
    },

    deselectAll() {
        return this.setValues([]);
    },

    enable() {

        let i = 0, l = this._items.length;
        for (; i < l; i++) {
            this._items[i]._checkbox.enable();
        }

        this.removeClassName('flagrate-disabled');

        return this;
    },

    disable() {

        let i = 0, l = this._items.length;
        for (; i < l; i++) {
            this._items[i]._checkbox.disable();
        }

        this.addClassName('flagrate-disabled');

        return this;
    },

    isEnabled() {
        return !this.hasClassName('flagrate-disabled');
    }
};