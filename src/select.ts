/*?
 *  class Flagrate.Select
 *
 *  #### Event
 *
 *  * `change`: when the value(s) changes.
 *
 *  #### Inheritance
 *  
 *  * Flagrate.Element
**/
export interface ISelect extends ISelectInstance, Flagrate.IElement { }

export interface ISelectClass {
    new? (option?: ISelectOption): ISelect;
    (option?: ISelectOption): void;
    prototype: ISelectInstance;
}

export interface ISelectInstance {
    select(index: number): ISelect;
    deselect(index: number): ISelect;
    selectAll(): ISelect;
    deselectAll(): ISelect;
    disable(): ISelect;
    enable(): ISelect;
    isEnabled(): boolean;
    getValue(): any;
    getValues(): any[];

    onChange? (event?: any, menu?: ISelect): void;

    /** readonly. */
    listView?: boolean;

    /** readonly. */
    multiple?: boolean;

    /** readonly. */
    items?: any[];

    /** readonly. */
    max?: number;

    /** readonly. */
    selectedIndex?: number;

    /** readonly. */
    selectedIndexes?: number[];

    /** readonly. */
    isPulldown?: boolean;

    _pulldown?: Flagrate.IPulldown;
    _grid?: Flagrate.IGrid;
}

export interface ISelectOption {
    /** id attribute. */
    id?: string;

    /** class attribute. */
    className?: string;

    /** attribute/value pairs properties. */
    attribute?: any;

    /** CSS style properties (uses Flagrate.Element.setStyle). */
    style?: any;

    /** default is false. */
    listView?: boolean;

    /** default is false. */
    multiple?: boolean;
    
    /** default is -1 (unlimited). */
    max?: number;

    /** Array of any value or, ISelectItemOption object. */
    items?: any[];

    selectedIndex?: number;
    selectedIndexes?: number[];

    /** default is false. */
    isDisabled?: boolean;
}

export interface ISelectItemOption {
    /** if not specifies label, tries convert value to string for display label. */
    label?: string;

    /** icon image URL. */
    icon?: string;

    /** value. */
    value: any;
}

export var Select: ISelectClass = function (option: ISelectOption = {}): ISelect {

    this.items = option.items || [];
    this.listView = option.listView || false;
    this.multiple = option.multiple || false;
    this.max = option.max || -1;

    if (this.multiple) {
        this.selectedIndexes = option.selectedIndexes || [];
    } else {
        this.selectedIndex = typeof option.selectedIndex === 'undefined' ? -1 : option.selectedIndex;
    }

    var attr = option.attribute || {};

    if (option.id) { attr.id = option.id; }

    this.isPulldown = (!this.listView && !this.multiple);

    // create
    var container = <ISelect>new Flagrate.Element('div', attr); 

    var createOnSelectHandler = (i: number) => {
        return () => container.select(i);
    };

    var createOnDeselectHandler = (i: number) => {
        return () => container.deselect(i);
    };

    // normalize items
    var i, l;
    for (i = 0, l = this.items.length; i < l; i++) {
        if (typeof this.items[i] !== 'object') {
            this.items[i] = {
                label: typeof this.items[i] === 'string' ? this.items[i] : this.items[i].toString(10),
                value: this.items[i]
            };
        }
    }

    if (this.isPulldown) {
        container._pulldown = new Flagrate.Pulldown({
            label: '-',
            items: (function () {

                var items = [{
                    label: '-',
                    onSelect: createOnSelectHandler(-1)
                }];

                var i, l;
                for (i = 0, l = this.items.length; i < l; i++) {
                    items.push({
                        label: this.items[i].label,
                        icon: this.items[i].icon,
                        onSelect: createOnSelectHandler(i)
                    });
                }

                return items;
            }.bind(this))()
        }).insertTo(container);
    } else {
        container._grid = new Flagrate.Grid({
            headless: true,
            multiSelect: this.multiple,
            cols: [
                {
                    key: 'label'
                }
            ],
            rows: (function () {

                var rows = [];

                var i, l;
                for (i = 0, l = this.items.length; i < l; i++) {
                    rows.push({
                        cell: {
                            label: {
                                text: this.items[i].label,
                                icon: this.items[i].icon
                            }
                        },
                        onSelect: createOnSelectHandler(i),
                        onDeselect: createOnDeselectHandler(i)
                    });
                }

                return rows;
            }.bind(this))()
        }).insertTo(container);
    }
    Flagrate.extendObject(container, this);

    container.addClassName(Flagrate.className + ' ' + Flagrate.className + '-select');
    if (!container.isPulldown) { container.addClassName(Flagrate.className + '-select-list-view'); }
    if (option.className) { container.addClassName(option.className); }

    if (option.style) { container.setStyle(option.style); }

    if (option.isDisabled) { container.disable(); }

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
};

export function createSelect(option?: ISelectOption): ISelect {
    return new Select(option);
};

Select.prototype = {
    select (index) {

        if (this.items.length <= index) { return this; }

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

    deselect (index) {

        if (this.items.length <= index) { return this; }

        if (this.multiple) {
            var selectedIndex = this.selectedIndexes.indexOf(index);
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
                var i, l;
                for (i = 0, l = this.items.length; i < l; i++) {
                    if (this._grid.rows[i].isSelected === true) {
                        this._grid.deselect(i);
                    }
                }
            }
        }

        return this;
    },

    selectAll () {

        if (this.multiple) {
            this._grid.selectAll();
            this.selectedIndexes = [];

            var i, l;
            for (i = 0, l = this.items.length; i < l; i++) {
                this.selectedIndexes.push(i);
            }
        }

        return this;
    },

    deselectAll () {

        if (this.multiple) {
            this._grid.deselectAll();
            this.selectedIndexes = [];
        } else {
            this.deselect();
        }

        return this;
    },

    disable () {

        this.addClassName(flagrate.className + '-disabled');

        if (this.isPulldown) {
            this._pulldown.disable();
        } else {
            this._grid.disable();
        }

        return this;
    },

    enable () {

        this.removeClassName(flagrate.className + '-disabled');

        if (this.isPulldown) {
            this._pulldown.enable();
        } else {
            this._grid.enable();
        }

        return this;
    },

    isEnabled () {
        return !this.hasClassName(flagrate.className + '-disabled');
    },

    getValue () {

        if (this.selectedIndex > -1) {
            return this.items[this.selectedIndex].value;
        } else {
            return void 0;
        }
    },

    getValues () {

        var i, l, result = [];

        for (i = 0, l = this.selectedIndexes.length; i < l; i++) {
            result.push(this.items[this.selectedIndexes[i]].value);
        }

        return result;
    }
};