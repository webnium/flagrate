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
import { Option as ButtonOption } from './button';
import { Pulldown } from './pulldown';
import { Grid } from './grid';

/*?
    class flagrate.Select

    #### Event

    * `change`: when the value(s) changes.

    #### Inheritance

    * flagrate.Element
**/
export interface Select extends Instance, FHTMLDivElement { }

export interface Class {
    new (option?: Option): Select;
    prototype: Instance;
}

export interface Instance {
    select(index: number): this;
    deselect(index: number): this;
    selectAll(): this;
    deselectAll(): this;
    disable(): this;
    enable(): this;
    isEnabled(): boolean;
    getValue(): any;
    getValues(): any[];

    onChange?(event?: any, menu?: this): void;

    /** readonly. */
    listView?: boolean;

    /** readonly. */
    multiple?: boolean;

    /** readonly. */
    items?: ItemOption[];

    /** readonly. */
    max?: number;

    /** readonly. */
    selectedIndex?: number;

    /** readonly. */
    selectedIndexes?: number[];

    /** readonly. */
    isPulldown?: boolean;

    _pulldown?: Pulldown;
    _grid?: Grid;
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

    /** default is false. */
    listView?: boolean;

    /** default is false. */
    multiple?: boolean;

    /** default is -1 (unlimited). */
    max?: number;

    /** Array of any value or, SelectItemOption object. */
    items?: ItemOption[];

    selectedIndex?: number;
    selectedIndexes?: number[];

    /** default is false. */
    isDisabled?: boolean;
}

export type ItemOption = string | number | {
    /** if not specifies label, tries convert value to string for display label. */
    label?: string;

    /** icon image URL. */
    icon?: string;

    /** value. */
    value: any;
};

/*?
    flagrate.createSelect(option)
    new flagrate.Select(option)
    - option (Object) - options.

    Select.

    #### option

    * `id`                       (String): `id` attribute of container element.
    * `className`                (String):
    * `attribute`                (Object):
    * `style`                    (Object): (using flagrate.Element.setStyle)
    * `items`                    (Array):
    * `listView`                 (Boolean; default `false`):
    * `multiple`                 (Boolean; default `false`):
    * `max`                      (Number; default `-1`):
    * `selectedIndex`            (Number):
    * `selectedIndexes`          (Array): array of Number.
    * `isDisabled`               (Boolean; default `false`):
**/
function FSelect(option: Option = {}) {

    this.items = option.items || [];
    this.listView = option.listView || false;
    this.multiple = option.multiple || false;
    this.max = option.max || -1;

    if (this.multiple) {
        this.selectedIndexes = option.selectedIndexes || [];
    } else {
        this.selectedIndex = typeof option.selectedIndex === 'undefined' ? -1 : option.selectedIndex;
    }

    const attr = option.attribute || {};

    if (option.id) {
        attr['id'] = option.id;
    }

    this.isPulldown = (!this.listView && !this.multiple);

    // create
    const container = new Element('div', attr) as Select;

    function createOnSelectHandler(i: number) {
        return () => container.select(i);
    }

    function createOnDeselectHandler(i: number) {
        return () => container.deselect(i);
    }

    // normalize items
    for (let i = 0, l = this.items.length; i < l; i++) {
        if (typeof this.items[i] !== 'object') {
            this.items[i] = {
                label: typeof this.items[i] === 'string' ? this.items[i] : this.items[i].toString(10),
                value: this.items[i]
            };
        }
    }

    if (this.isPulldown) {
        container._pulldown = new Pulldown({
            label: '-',
            items: [
                {
                    label: '-',
                    onSelect: createOnSelectHandler(-1)
                }
            ].concat(
                this.items.map((item, i) => {
                    return {
                        label: item.label,
                        icon: item.icon,
                        onSelect: createOnSelectHandler(i)
                    };
                })
            )
        }).insertTo(container);
    } else {
        container._grid = new Grid({
            headless: true,
            multiSelect: this.multiple,
            cols: [
                {
                    key: 'label'
                }
            ],
            rows: this.items.map((item, i) => {
                return {
                    cell: {
                        label: {
                            text: item.label,
                            icon: item.icon
                        }
                    },
                    onSelect: createOnSelectHandler(i),
                    onDeselect: createOnDeselectHandler(i)
                };
            })
        }).insertTo(container);
    }
    extendObject(container, this);

    container.addClassName('flagrate flagrate-select');
    if (!container.isPulldown) {
        container.addClassName('flagrate-select-list-view');
    }
    if (option.className) {
        container.addClassName(option.className);
    }

    if (option.style) {
        container.setStyle(option.style);
    }

    if (option.isDisabled) {
        container.disable();
    }

    if (container.multiple) {
        container.selectedIndexes.forEach(function (index) {
            container.select(index);
        });
    } else {
        if (container.selectedIndex > -1) {
            container.select(container.selectedIndex);
        }
    }

    return container;
}

export const Select = FSelect as any as Class;

export function createSelect(option?: Option): Select {
    return new Select(option);
}

Select.prototype = {
    select(index) {

        if (this.items.length <= index) {
            return this;
        }

        if (this.multiple) {
            if (this.max > -1 && this.selectedIndexes.length >= this.max) {
                if (this._grid.rows[index].isSelected === true) {
                    this._grid.deselect(index);
                }
                return this;
            }
            if (this.selectedIndexes.indexOf(index) === -1) {
                this.selectedIndexes.push(index);
            }
        } else {
            this.selectedIndex = index;
        }

        if (this.isPulldown) {
            if (index === -1) {
                this._pulldown.setLabel('-');
                this._pulldown.setIcon(null);
            } else {
                this._pulldown.setLabel(this.items[index].label);
                this._pulldown.setIcon(this.items[index].icon);
            }

            this.fire('change');
        } else {
            if (!this._grid.rows[index].isSelected) {
                this._grid.select(index);
            }
        }

        return this;
    },

    deselect(index) {

        if (this.items.length <= index) {
            return this;
        }

        if (this.multiple) {
            const selectedIndex = this.selectedIndexes.indexOf(index);
            if (selectedIndex !== -1) {
                this.selectedIndexes.splice(this.selectedIndexes.indexOf(index), 1);
            }
        } else {
            this.selectedIndex = -1;
        }

        if (this.isPulldown) {
            this._pulldown.setLabel('-');
            this._pulldown.setIcon(null);

            this.fire('change');
        } else {
            if (this.multiple) {
                if (this._grid.rows[index].isSelected === true) {
                    this._grid.deselect(index);
                }
            } else {
                let i = 0, l = this.items.length;
                for (; i < l; i++) {
                    if (this._grid.rows[i].isSelected === true) {
                        this._grid.deselect(i);
                    }
                }
            }
        }

        return this;
    },

    selectAll() {

        if (this.multiple) {
            this._grid.selectAll();
            this.selectedIndexes = [];

            let i = 0, l = this.items.length;
            for (; i < l; i++) {
                this.selectedIndexes.push(i);
            }
        }

        return this;
    },

    deselectAll() {

        if (this.multiple) {
            this._grid.deselectAll();
            this.selectedIndexes = [];
        } else {
            this.deselect();
        }

        return this;
    },

    disable() {

        this.addClassName('flagrate-disabled');

        if (this.isPulldown) {
            this._pulldown.disable();
        } else {
            this._grid.disable();
        }

        return this;
    },

    enable() {

        this.removeClassName('flagrate-disabled');

        if (this.isPulldown) {
            this._pulldown.enable();
        } else {
            this._grid.enable();
        }

        return this;
    },

    isEnabled() {
        return !this.hasClassName('flagrate-disabled');
    },

    getValue() {

        if (this.selectedIndex > -1) {
            return this.items[this.selectedIndex].value;
        } else {
            return void 0;
        }
    },

    getValues() {

        let i = 0, l = this.selectedIndexes.length, result = [];

        for (; i < l; i++) {
            result.push(this.items[this.selectedIndexes[i]].value);
        }

        return result;
    }
};