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

import {
    Element, Attribute, Property, InsertPosition,
    FHTMLElement, FHTMLDivElement, FHTMLTableDataCellElement,
    FHTMLTableSectionElement, FHTMLTableRowElement, FHTMLTableHeaderCellElement
} from "./element";
import { Button } from "./button";
import { ItemOption as MenuItemOption } from "./menu";
import { Checkbox, CheckboxEvent } from "./checkbox";
import { Toolbar } from "./toolbar";
import { ContextMenu } from "./context-menu";

/*?
    class flagrate.Grid
**/
export interface Option {
    /** `id` attribute of container. */
    id?: string;
    className?: string;
    attribute?: Attribute;
    style?: Property;
    cols?: ColOption[];
    rows?: RowOption[];
    /** default is `10`. */
    colMinWidth?: number;
    /** default is `false`. */
    pagination?: boolean;
    /** default is `20`. */
    numberOfRowsPerPage?: number;
    /** default is `false`. */
    fill?: boolean;
    /** default is `false`. */
    headless?: boolean;
    /** default is `false`. */
    multiSelect?: boolean;
    /** default is `false`. */
    disableCheckbox?: boolean;
    /** default is `false`. */
    disableSelect?: boolean;
    /** default is `false`. */
    disableSort?: boolean;
    ///** default is `false`. */
    //disableFilter?: boolean;
    /** default is `false`. */
    disableResize?: boolean;

    onSelect?(event?: Event, row?: Row, grid?: Grid): void;
    onDeselect?(event?: Event, row?: Row, grid?: Grid): void;
    onClick?(event?: MouseEvent, row?: Row, grid?: Grid): void;
    onDblClick?(event?: MouseEvent, row?: Row, grid?: Grid): void;
    onRender?(grid?: Grid): boolean;
    onRendered?(grid?: Grid): void;
    postProcessOfRow?(tr?: FHTMLTableRowElement, row?: Row, grid?: Grid): void;
}

export interface Col extends ColOption {
    /** readonly */isSorted?: boolean;
    /** readonly */isAsc?: boolean;

    _id?: string;
    _th?: FHTMLTableHeaderCellElement;
    _div?: FHTMLDivElement;
    _resizeHandle?: FHTMLDivElement;
}

export interface ColOption {
    /** `id` attribute of `th` */
    id?: string;
    className?: string;
    attribute?: Attribute;
    style?: Property;

    key: string;
    label?: string;
    icon?: string;
    align?: TextAlign;
    width?: number;
    minWidth?: number;

    /** default is `false`. */
    disableSort?: boolean;
    /** default is `false`. */
    disableResize?: boolean;
}

export interface Row extends RowOption {
    cell?: { [colKey: string]: string | number | Cell };

    _tr?: FHTMLTableRowElement;
    _checkbox?: Checkbox;
    _last?: FHTMLTableDataCellElement;
    _menu?: ContextMenu;
}

export interface RowOption {
    /** `id` attribute of `tr` */
    id?: string;
    className?: string;
    attribute?: Attribute;
    style?: Property;

    cell?: { [colKey: string]: string | number | CellOption };
    menuItems?: MenuItemOption[];
    isSelected?: boolean;

    onSelect?(event?: Event, row?: Row, grid?: Grid): void;
    onDeselect?(event?: Event, row?: Row, grid?: Grid): void;
    onClick?(event?: MouseEvent, row?: Row, grid?: Grid): void;
    onDblClick?(event?: MouseEvent, row?: Row, grid?: Grid): void;
    postProcess?(tr?: FHTMLTableRowElement, row?: Row, grid?: Grid): void;

    /** value of row. this will disables cell's value. */
    value?: any;
}

export interface Cell extends CellOption {
    _td?: FHTMLTableDataCellElement;
    _div?: FHTMLDivElement;
}

export interface CellOption {
    /** `id` attribute of `td` */
    id?: string;
    className?: string;
    attribute?: Attribute;
    style?: Property;

    text?: string | number;
    html?: string;
    element?: HTMLElement;
    icon?: string;
    sortAlt?: number | string;
    onClick?(event?: MouseEvent, cell?: Cell, grid?: Grid): void;
    onDblClick?(event?: MouseEvent, cell?: Cell, grid?: Grid): void;
    postProcess?(td?: FHTMLTableDataCellElement, cell?: Cell, grid?: Grid): void;

    /** value of cell. */
    value?: any;
}

export type TextAlign = "left" | "center" | "right";

/*?
    flagrate.createGrid(option)
    new flagrate.Grid(option)
    - option (Object) - configuration for the grid.

    Create and initialize the grid.

    #### option

    * `id`                       (String): `id` attribute of container.
    * `className`                (String):
    * `attribute`                (Object):
    * `style`                    (Object): (using flagrate.Element.setStyle)
    * `cols`                     (Array): of col object.
    * `rows`                     (Array): of row object.
    * `pagination`               (Boolean; default `false`):
    * `numberOfRowsPerPage`      (Number; default `20`): pagination.
    * `fill`                     (Boolean; default `false`):
    * `headless`                 (Boolean; default `false`):
    * `multiSelect`              (Boolean; default `false`):
    * `disableCheckbox`          (Boolean; default `false`):
    * `disableSelect`            (Boolean; default `false`):
    * `disableSort`              (Boolean; default `false`):
    * `disableFilter`            (Boolean; default `false`):
    * `disableResize`            (Boolean; default `false`):
    * `onSelect`                 (Function):
    * `onDeselect`               (Function):
    * `onClick`                  (Function):
    * `onDblClick`               (Function):
    * `onRender`                 (Function):
    * `onRendered`               (Function):
    * `postProcessOfRow`         (Function):

    #### col

    * `id`                       (String): `id` attribute of `th`
    * `className`                (String):
    * `attribute`                (Object):
    * `style`                    (Object): styling of `th` (using flagrate.Element.setStyle)
    * `key`                      (String; required):
    * `label`                    (String; default `""`):
    * `icon`                     (String):
    * `align`                    (String):
    * `width`                    (Number):
    * `disableSort`              (Boolean; default `false`):
    * `disableResize`            (Boolean; default `false`):

    #### row

    * `id`                       (String): `id` attribute of `tr`
    * `className`                (String):
    * `attribute`                (Object):
    * `style`                    (Object): styling of `tr` (using flagrate.Element.setStyle)
    * `cell`                     (Object|String; default `{}`): of cell object. or String for text.
    * `menuItems`                (Array): of Menu items.
    * `isSelected`               (Boolean):
    * `onSelect`                 (Function):
    * `onDeselect`               (Function):
    * `onClick`                  (Function):
    * `onDblClick`               (Function):
    * `postProcess`              (Function):

    #### cell

    * `id`                       (String): `id` attribute of `td`
    * `className`                (String):
    * `attribute`                (Object):
    * `style`                    (Object): styling of `td` (using flagrate.Element.setStyle)
    * `text`                     (String):
    * `html`                     (String):
    * `element`                  (Element):
    * `icon`                     (String):
    * `sortAlt`                  (Number|String):
    * `onClick`                  (Function):
    * `onDblClick`               (Function):
    * `postProcess`              (Function):
**/
export class Grid {

    private _cols: Col[] = [];
    private _rows: Row[] = [];

    private _pagePosition: number = 0;

    onSelect: (event?: Event, row?: Row, grid?: Grid) => void;
    onDeselect: (event?: Event, row?: Row, grid?: Grid) => void;
    onClick: (event?: MouseEvent, row?: Row, grid?: Grid) => void;
    onDblClick: (event?: MouseEvent, row?: Row, grid?: Grid) => void;
    onRender: (grid?: Grid) => boolean;
    onRendered: (grid?: Grid) => void;
    postProcessOfRow: (tr?: FHTMLTableRowElement, row?: Row, grid?: Grid) => void;

    private _selectedRows: Row[] = [];
    private _sortedByKey: string = null;
    private _sortedByAsc: boolean = null;

    element = new Element("div", { "class": "flagrate flagrate-grid" });
    private _checkbox: Checkbox;
    private _pager: Toolbar;
    private _head = new Element("div", { "class": "flagrate-grid-head" }).insertTo(this.element);
    private _thead = new Element("thead").insertTo(new Element("table").insertTo(this._head));
    private _tr = new Element("tr").insertTo(this._thead);
    private _body = new Element("div", { "class": "flagrate-grid-body" }).insertTo(this.element);
    private _tbody = new Element("tbody").insertTo(new Element("table").insertTo(this._body));
    private _style = new Element("style").insertTo(this.element);

    static idCounter = 0;
    private _id = "flagrate-grid-" + (++Grid.idCounter).toString(10);

    private _renderTimer: number;

    constructor(private _opt: Option = {}) {

        if (_opt.id) {
            this.element.writeAttribute("id", _opt.id);
        }
        if (_opt.className) {
            this.element.addClassName(_opt.className);
        }
        if (_opt.attribute) {
            this.element.writeAttribute(_opt.attribute);
        }
        if (_opt.style) {
            this.element.setStyle(_opt.style);
        }

        if (_opt.cols) {
            this._cols = _opt.cols;
        }
        if (_opt.rows) {
            this._rows = _opt.rows;
        }

        if (_opt.colMinWidth === undefined) {
            _opt.colMinWidth = 10;
        }
        if (_opt.pagination === undefined) {
            _opt.pagination = false;
        }
        if (!_opt.numberOfRowsPerPage) {
            _opt.numberOfRowsPerPage = 20;
        }
        if (_opt.fill === undefined) {
            _opt.fill = false;
        }

        if (_opt.headless === true) {
            _opt.disableSort = true;
            _opt.disableResize = true;
            this.element.addClassName("flagrate-grid-headless");
        }

        if (_opt.multiSelect === undefined) {
            _opt.multiSelect = false;
        }
        if (_opt.disableCheckbox === undefined) {
            _opt.disableCheckbox = false;
        }
        if (_opt.disableSelect === undefined) {
            _opt.disableSelect = false;
        }
        if (_opt.disableSort === undefined) {
            _opt.disableSort = false;
        }
        /* if (_opt.disableFilter === undefined) {
            _opt.disableFilter = false;
        } */
        if (_opt.disableResize === undefined) {
            _opt.disableResize = false;
        }

        this.onSelect = _opt.onSelect;
        this.onDeselect = _opt.onDeselect;
        this.onClick = _opt.onClick;
        this.onDblClick = _opt.onDblClick;
        this.onRender = _opt.onRender;
        this.onRendered = _opt.onRendered;
        this.postProcessOfRow = _opt.postProcessOfRow;

        this._create()._requestRender();
    }

    get headless(): boolean {
        return this.element.hasClassName("flagrate-grid-headless");
    }
    set headless(enable: boolean) {

        if (enable) {
            this.element.addClassName("flagrate-grid-headless");
        } else {
            this.element.removeClassName("flagrate-grid-headless");
        }
    }

    get fill(): boolean {
        return this.element.hasClassName("flagrate-grid-fill");
    }
    set fill(enable: boolean) {

        if (enable) {
            this.element.addClassName("flagrate-grid-fill");

            this._body.onscroll = this._createBodyOnScrollHandler();
        } else {
            this.element.removeClassName("flagrate-grid-fill");

            this.element.onscroll = this._createOnScrollHandler();
        }

        this._requestRender();
    }

    get rows(): Row[] {
        return this._rows;
    }
    set rows(rows: Row[]) {
        this._rows = rows;
        this._requestRender();
    }

    get sortedByKey(): string {
        return this._sortedByKey;
    }

    get sortedByAsc(): boolean {
        return this._sortedByAsc;
    }

    get selectedRows(): Row[] {
        return this.getSelectedRows();
    }
    set selectedRows(rows: Row[]) {
        this.select(rows);
    }

    insertTo(element: HTMLElement, pos?: InsertPosition): this {
        return this.element.insertTo(element, pos) && this;
    }

    on(eventType: string, listener: EventListener, useCapture?: boolean): this {
        return this.element.on(eventType, listener, useCapture) && this;
    }

    off(eventType: string, listener?: EventListener, useCapture?: boolean): this {
        return this.element.off(eventType, listener, useCapture) && this;
    }

    /** select row(s) */
    select(...row: (number | Row)[]): this;
    select(rows: (number | Row)[]): this;
    select(a) {

        let rows: Row[];

        if (Array.isArray(a) === true) {
            rows = a;
        } else {
            rows = [];

            for (let i = 0, l = arguments.length; i < l; i++) {
                rows.push(arguments[i]);
            }
        }

        if (this._opt.multiSelect === false) {
            this.deselectAll();
        }

        for (let i = 0, l = rows.length; i < l; i++) {
            let row = rows[i];

            if (typeof row === "number") {
                row = this._rows[<number>row];
            }

            row.isSelected = true;

            if (row._tr && row._tr.hasClassName("flagrate-grid-row-selected") === true) {
                continue;
            }

            this._selectedRows.push(row);

            if (row._tr) {
                row._tr.addClassName("flagrate-grid-row-selected");
            }

            if (row._checkbox) {
                row._checkbox.check();
                setTimeout(() => {
                    if (row.isSelected === true) {
                        row._checkbox.check();
                    }
                }, 0);
            }

            if (row.onSelect) {
                row.onSelect.call(this, window.event, row, this);
            }
            if (this.onSelect) {
                this.onSelect(window.event, row, this);
            }
        }

        if (this._selectedRows.length !== 0 && this._checkbox) {
            this._checkbox.check();
        }

        this.element.fire("change", { targetGrid: this });

        return this;
    }

    /** deselect row(s) */
    deselect(...row: (number | Row)[]): this;
    deselect(rows: (number | Row)[]): this;
    deselect(a) {

        let rows: Row[];

        if (Array.isArray(a)) {
            rows = a;
        } else {
            rows = [];

            for (let i = 0, l = arguments.length; i < l; i++) {
                rows.push(arguments[i]);
            }
        }

        for (let i = 0, l = rows.length; i < l; i++) {
            let row = rows[i];

            if (typeof row === "number") {
                row = this._rows[<number>row];
            }

            row.isSelected = false;

            if (row._tr && row._tr.hasClassName("flagrate-grid-row-selected") === false) {
                continue;
            }

            this._selectedRows.splice(this._selectedRows.indexOf(row), 1);

            if (row._tr) {
                row._tr.removeClassName("flagrate-grid-row-selected");
            }

            if (row._checkbox) {
                row._checkbox.uncheck();
                setTimeout(() => {
                    if (row.isSelected === false) {
                        row._checkbox.uncheck();
                    }
                }, 0);
            }

            if (row.onDeselect) {
                row.onDeselect.call(this, window.event, row, this);
            }
            if (this.onDeselect) {
                this.onDeselect(window.event, row, this);
            }
        }

        if (this._selectedRows.length === 0 && this._checkbox) {
            this._checkbox.uncheck();
        }

        this.element.fire("change", { targetGrid: this });

        return this;
    }

    /** select all rows */
    selectAll(): this {
        return this.select(this._rows);
    }

    /** deselect all rows */
    deselectAll(): this {
        return this.deselect(this._rows);
    }

    /** get selected rows */
    getSelectedRows(): Row[] {
        return this._selectedRows;
    }

    /** get values of selected rows */
    getValues(): any[] {

        return this._selectedRows.map(row => {

            // row's value is first
            if (row.value === undefined) {
                return row.value;
            }

            const ret = {};

            for (const key in row.cell) {
                if (typeof row.cell[key] === "object" && (<Cell>row.cell[key]).value !== undefined) {
                    ret[key] = (<Cell>row.cell[key]).value;
                }
            }

            return ret;
        });
    }

    /** sort rows by key */
    sort(key: string, isAsc?: boolean): this {

        if (isAsc === undefined) {
            isAsc = true;
        }

        this._rows.sort((a, b) => {

            let A: any = 0;
            let B: any = 0;

            const cellA: Cell = a.cell[key];
            const cellB: Cell = b.cell[key];

            if (typeof cellA === "object") {
                A = (cellA.sortAlt !== undefined) ? cellA.sortAlt : cellA.text || cellA.html || (cellA.element && cellA.element.innerHTML) || (cellA._div && cellA._div.innerHTML) || 0;
            } else {
                A = cellA || 0;
            }
            if (typeof cellB === "object") {
                B = (cellB.sortAlt !== undefined) ? cellB.sortAlt : cellB.text || cellB.html || (cellB.element && cellB.element.innerHTML) || (cellB._div && cellB._div.innerHTML) || 0;
            } else {
                B = cellB || 0;
            }

            return A === B ? 0 : (A > B ? 1 : -1);
        });

        if (isAsc === false) {
            this._rows.reverse();
        }

        for (let i = 0, l = this._cols.length; i < l; i++) {
            if (this._cols[i].key === key) {
                if (isAsc) {
                    this._cols[i]._th.addClassName("flagrate-grid-col-sorted-asc");
                    this._cols[i]._th.removeClassName("flagrate-grid-col-sorted-desc");
                } else {
                    this._cols[i]._th.addClassName("flagrate-grid-col-sorted-desc");
                    this._cols[i]._th.removeClassName("flagrate-grid-col-sorted-asc");
                }

                this._cols[i].isSorted = true;
                this._cols[i].isAsc = isAsc;

                this._sortedByKey = key;
                this._sortedByAsc = isAsc;
            } else {
                if (this._cols[i].isSorted) {
                    this._cols[i]._th.removeClassName("flagrate-grid-col-sorted-asc").removeClassName("flagrate-grid-col-sorted-desc");
                }

                this._cols[i].isSorted = false;
                this._cols[i].isAsc = null;
            }
        }

        this._requestRender();

        return this;
    }

    unshift(row: Row): number;
    unshift(rows: Row[]): number;
    unshift(r) {

        if (Array.isArray(r) === true) {
            for (let i = 0, l = r.length; i < l; i++) {
                this._rows.unshift(r[i]);
            }
        } else {
            this._rows.unshift(r);
        }

        if (this._sortedByKey === null) {
            this._requestRender();
        } else {
            this.sort(this._sortedByKey, this._sortedByAsc);
        }

        return this._rows.length;
    }

    push(row: Row): number;
    push(rows: Row[]): number;
    push(r) {

        if (Array.isArray(r) === true) {
            for (let i = 0, l = r.length; i < l; i++) {
                this._rows.push(r[i]);
            }
        } else {
            this._rows.push(r);
        }

        if (this._sortedByKey === null) {
            this._requestRender();
        } else {
            this.sort(this._sortedByKey, this._sortedByAsc);
        }

        return this._rows.length;
    }

    shift(count?: number): Row | Row[];
    shift(c) {

        const count = c || 1;
        const removes: Row[] = [];

        for (let i = 0, l = this._rows.length; i < l && i < count; i++) {
            removes.push(this._rows.shift());
        }

        this._requestRender();

        return !c ? removes[0] : removes;
    }

    pop(count?: number): Row | Row[];
    pop(c) {

        const count = c || 1;
        const removes: Row[] = [];

        for (let i = 0, l = this._rows.length; i < l && i < count; i++) {
            removes.push(this._rows.pop());
        }

        this._requestRender();

        return !c ? removes[0] : removes;
    }

    splice(index: number, howMany?: number, rows?: Row[]): Row[];
    splice(index: number, howMany?: number, row?: Row): Row[];
    splice(index, c, r) {

        c = typeof c === "undefined" ? this._rows.length - index : c;

        const removes = this._rows.splice(index, c);

        if (r) {
            if (r instanceof Array === false) {
                r = [r];
            }

            for (let i = 0, l = r.length; i < l; i++) {
                this._rows.splice(index + i, 0, r[i]);
            }
        }

        if (this._sortedByKey === null) {
            this._requestRender();
        } else {
            this.sort(this._sortedByKey, this._sortedByAsc);
        }

        return removes;
    }

    indexOf(row: Row, fromIndex?: number): number {
        return this._rows.indexOf(row, fromIndex);
    }

    removeRow(row: Row): Row;
    removeRow(rows: Row[]): Row[];
    removeRow(r) {

        const removes: Row[] = [];
        let bulk = true;

        if (r instanceof Array === false) {
            bulk = false;
            r = [r];
        }

        for (let i = 0, l = r.length; i < l; i++) {
            const index = this.indexOf(r[i]);
            if (index !== -1) {
                removes.push(this.splice(index, 1));
            }
        }

        return bulk ? removes : removes[0];
    }

    disable() {

        this.element.addClassName("flagrate-disabled");

        return this;
    }

    enable() {

        this.element.removeClassName("flagrate-disabled");

        return this;
    }

    isEnabled() {
        return !this.element.hasClassName("flagrate-disabled");
    }

    private _create(): this {

        if (this._opt.disableCheckbox === false && this._opt.disableSelect === false && this._opt.multiSelect === true) {
            this._checkbox = new Checkbox({
                onCheck: this.selectAll.bind(this),
                onUncheck: this.deselectAll.bind(this)
            }).insertTo(new Element("th", { "class": "flagrate-grid-cell-checkbox" }).insertTo(this._tr));
        }

        for (let i = 0, l = this._cols.length; i < l; i++) {
            let col = this._cols[i];

            col._id = `${this._id}-col-${col.key}`;
            col._th = new Element("th").insertTo(this._tr);

            if (col.id) {
                col._th.writeAttribute("id", col.id);
            }
            if (col.className) {
                col._th.writeAttribute("class", col.className);
            }
            if (col.attribute) {
                col._th.writeAttribute(col.attribute);
            }
            if (col.style) {
                col._th.setStyle(col.style);
            }

            col._th.addClassName(col._id);

            const width = !!col.width ? (col.width.toString(10) + "px") : "auto";
            this._style.insertText(`.${col._id}{width:${width}}`);

            if (col.align) {
                col._th.style.textAlign = col.align;
            }

            col._div = new Element().insertTo(col._th);

            if (col.label) {
                col._div.updateText(col.label);
            }

            if (col.icon) {
                col._div.addClassName("flagrate-icon");
                col._div.setStyle({
                    backgroundImage: "url(" + col.icon + ")"
                });
            }

            if (this._opt.disableResize === false && !col.disableResize) {
                col._resizeHandle = new Element("div", {
                    "class": "flagrate-grid-col-resize-handle"
                }).insertTo(this.element);

                col._resizeHandle.onmousedown = this._createResizeHandleOnMousedownHandler(col);
            }

            if (this._opt.disableSort === false && !col.disableSort) {
                col._th.addClassName("flagrate-grid-col-sortable");
                col._th.onclick = this._createColOnClickHandler(col);
            }
        }

        new Element("th", { "class": this._id + "-col-last" }).insertTo(this._tr);
        this._style.insertText("." + this._id + "-col-last:after{right:0}");

        // pagination (testing)
        if (this._opt.pagination) {
            this.element.addClassName("flagrate-grid-pagination");
            // pager container
            this._pager = new Toolbar({
                className: "flagrate-grid-pager",
                items: [
                    {
                        key: "rn",
                        element: new Element("span").insertText("-")
                    },
                    {
                        key: "first",
                        element: new Button({
                            className: "flagrate-grid-pager-first",
                            onSelect: () => {
                                this._pagePosition = 0;
                                this._requestRender();
                            }
                        })
                    },
                    {
                        key: "prev",
                        element: new Button({
                            className: "flagrate-grid-pager-prev",
                            onSelect: () => {
                                --this._pagePosition;
                                this._requestRender();
                            }
                        })
                    },
                    {
                        key: "num",
                        element: new Element("span", { "class": "flagrate-grid-pager-num" }).insertText("-")
                    },
                    {
                        key: "next",
                        element: new Button({
                            className: "flagrate-grid-pager-next",
                            onSelect: () => {
                                ++this._pagePosition;
                                this._requestRender();
                            }
                        })
                    },
                    {
                        key: "last",
                        element: new Button({
                            className: "flagrate-grid-pager-last",
                            onSelect: () => {
                                this._pagePosition = Math.floor(this._rows.length / this._opt.numberOfRowsPerPage);
                                this._requestRender();
                            }
                        })
                    }
                ]
            }).insertTo(this.element);
        }

        if (this._opt.fill) {
            this.element.addClassName("flagrate-grid-fill");

            this._body.onscroll = this._createBodyOnScrollHandler();
        } else {
            this.element.onscroll = this._createOnScrollHandler();
        }

        return this;
    }

    private _requestRender(): this {

        if (this._renderTimer) {
            clearTimeout(this._renderTimer);
        }
        this._renderTimer = setTimeout(this._render.bind(this), 0);

        return this;
    }

    private _render(): this {

        if (!!this.onRender && this.onRender(this) === false) {
            return this;
        }

        const isCheckable = (this._opt.disableCheckbox === false && this._opt.disableSelect === false && this._opt.multiSelect === true);

        let i: number, j: number, row: Row, col: Col, cell: Cell, pl: number, pages: number, from: number, to: number;
        const rl = this._rows.length;
        const cl = this._cols.length;

        if (this._opt.pagination) {
            pl = 0;
            pages = Math.ceil(rl / this._opt.numberOfRowsPerPage);
            if (pages <= this._pagePosition) {
                this._pagePosition = pages - 1;
            }
            if (this._pagePosition <= 0) {
                this._pagePosition = 0;
            }
            from = this._pagePosition * this._opt.numberOfRowsPerPage;
            to = from + this._opt.numberOfRowsPerPage;
        }

        this._tbody.update();

        for (i = 0; i < rl; i++) {
            if (this._opt.pagination) {
                if (i < from) {
                    continue;
                }
                if (i >= to) {
                    break;
                }
                ++pl;
            }

            row = this._rows[i];

            if (!row._tr) {
                row._tr = new Element("tr");
            }
            row._tr.insertTo(this._tbody);

            if (row.id) {
                row._tr.writeAttribute("id", row.id);
            }
            if (row.className) {
                row._tr.writeAttribute("class", row.className);
            }
            if (row.attribute) {
                row._tr.writeAttribute(row.attribute);
            }
            if (row.style) {
                row._tr.setStyle(row.style);
            }

            if (row.onClick || this.onClick || this._opt.disableSelect === false) {
                if (this._opt.disableSelect === false) {
                    row._tr.addClassName("flagrate-grid-row-selectable");
                }
                if (row.onClick || this.onClick) {
                    row._tr.addClassName("flagrate-grid-row-clickable");
                }

                row._tr.onclick = this._createRowOnClickHandler(row);
            }

            if (row.onDblClick || this.onDblClick) {
                row._tr.ondblclick = this._createRowOnDblClickHandler(row);
            }

            if (isCheckable && !row._checkbox) {
                row._checkbox = new Checkbox({
                    onChange: this._createRowOnCheckHandler(row)
                }).insertTo(new Element("td", { "class": "flagrate-grid-cell-checkbox" }).insertTo(row._tr));
            }

            if (row.isSelected === true) {
                this.select(row);
            }

            for (j = 0; j < cl; j++) {
                col = this._cols[j];
                cell = (row.cell[col.key] === undefined) ? (row.cell[col.key] = {}) : row.cell[col.key];

                if (typeof cell === "string" || typeof cell === "number") {
                    cell = row.cell[col.key] = { text: <string | number>cell };
                }

                if (!cell._td) {
                    cell._td = new Element("td");
                }
                cell._td.insertTo(row._tr);

                if (cell.id) {
                    cell._td.writeAttribute("id", cell.id);
                }
                if (cell.className) {
                    cell._td.writeAttribute("class", cell.className);
                }
                if (cell.attribute) {
                    cell._td.writeAttribute(cell.attribute);
                }
                if (cell.style) {
                    cell._td.setStyle(cell.style);
                }

                if (col.align) {
                    cell._td.style.textAlign = col.align;
                }

                cell._td.addClassName(col._id);

                if (!cell._div) {
                    cell._div = new Element();
                }
                cell._div.insertTo(cell._td);

                if (cell.text !== undefined) {
                    cell._div.updateText(cell.text);
                }
                if (cell.html) {
                    cell._div.update(cell.html);
                }
                if (cell.element) {
                    cell._div.update(cell.element);
                }

                if (cell.icon) {
                    cell._div.addClassName("flagrate-icon");
                    cell._div.setStyle({
                        backgroundImage: "url(" + cell.icon + ")"
                    });
                }

                if (cell.onClick) {
                    cell._td.addClassName("flagrate-grid-cell-clickable");

                    cell._td.onclick = this._createCellOnClickHandler(cell);
                }

                if (cell.onDblClick) {
                    cell._td.ondblclick = this._createCellOnDblClickHandler(cell);
                }

                // post-processing
                if (cell.postProcess) {
                    cell.postProcess.call(this, cell._td, cell, this);
                }
            }

            if (!row._last) {
                row._last = new Element("td", { "class": this._id + "-col-last" });
            }
            row._last.insertTo(row._tr);

            // menu
            if (row.menuItems) {
                row._last.addClassName("flagrate-grid-cell-menu");

                //row
                if (row._menu) {
                    row._menu.remove();
                }
                row._menu = new ContextMenu({
                    target: row._tr,
                    items: row.menuItems
                });

                row._last.onclick = this._createLastRowOnClickHandler(row);
            }

            // post-processing
            if (row.postProcess) {
                row.postProcess.call(this, row._tr, row, this);
            }
            if (this.postProcessOfRow) {
                this.postProcessOfRow(row._tr, row, this);
            }
        }//<--for

        if (this._opt.pagination) {
            this._pager.getElementByKey("rn").updateText((from + 1) + " - " + (from + pl) + " / " + rl);
            this._pager.getElementByKey("num").updateText((this._pagePosition + 1) + " / " + pages);
        }

        if (this._opt.disableResize === false) {
            if (this._opt.fill) {
                this._head.style.right = (this._body.offsetWidth - this._body.clientWidth) + "px";
                this._head.scrollLeft = this._body.scrollLeft;
            }

            this._updateLayoutOfCols();
            this._updatePositionOfResizeHandles();
        }

        if (this.onRendered) {
            this.onRendered(this);
        }

        return this;
    }

    private _updatePositionOfResizeHandles() {

        const adj = this._opt.fill ? -this._body.scrollLeft : 0;

        let col;
        for (let i = 0, l = this._cols.length; i < l; i++) {
            col = this._cols[i];

            if (col._resizeHandle) {
                col._resizeHandle.style.left = (col._th.offsetLeft + col._th.getWidth() + adj) + "px";
            }
        }

        return this;
    }

    private _updateLayoutOfCols() {

        let col;

        for (let i = 0, l = this._cols.length; i < l; i++) {
            col = this._cols[i];

            if (col.width) {
                continue;
            }

            const minWidth = col.minWidth === undefined ? this._opt.colMinWidth : col.minWidth;
            col.width = Math.max(col._th.getWidth(), minWidth);

            this._style.updateText(
                this._style.innerHTML.replace(
                    new RegExp("(" + col._id + "{width:)([^}]*)}"),
                    "$1" + col.width + "px}"
                )
            );
        }

        this.element.addClassName("flagrate-grid-fixed");

        setTimeout(() => {

            const base = this._opt.fill ? this._body : this.element;

            this._style.updateText(
                this._style.innerHTML.replace(
                    new RegExp("(" + this._id + "-col-last:after{right:)([^}]*)}"),
                    "$1" + (base.scrollWidth - base.clientWidth - base.scrollLeft) + "px!important}"
                )
            );
        }, 0);

        return this;
    }

    private _createOnScrollHandler() {

        return (e: Event) => {

            if (this._opt.disableResize === false) {
                this._updateLayoutOfCols();
            }
        };
    }

    private _createBodyOnScrollHandler() {

        return (e: Event) => {

            this._head.style.right = (this._body.offsetWidth - this._body.clientWidth) + "px";
            this._head.scrollLeft = this._body.scrollLeft;

            if (this._opt.disableResize === false) {
                this._updateLayoutOfCols();
                this._updatePositionOfResizeHandles();
            }
        };
    }

    private _createColOnClickHandler(col: Col) {

        return (e: MouseEvent) => {

            this.sort(col.key, !col.isAsc);
        };
    }

    private _createRowOnClickHandler(row: Row) {

        return (e: MouseEvent) => {

            if (/firefox/i.test(navigator.userAgent) === true) {
                window.event = e;
            }

            if (this.isEnabled() === false) {
                return;
            }

            if (row.onClick) {
                row.onClick.call(this, e, row, this);
            }
            if (this.onClick) {
                this.onClick(e, row, this);
            }

            if (this._opt.disableSelect === false) {
                if (row.isSelected === true) {
                    this.deselect(row);
                } else {
                    this.select(row);
                }
            }

            if (row._checkbox) {
                row._checkbox.focus();
            }

            return false;
        };
    }

    private _createRowOnDblClickHandler(row: Row) {

        return (e: MouseEvent) => {
            if (/firefox/i.test(navigator.userAgent) === true) {
                window.event = e;
            }

            if (this.isEnabled() === false) {
                return;
            }

            if (row.onDblClick) {
                row.onDblClick.call(this, e, row, this);
            }
            if (this.onDblClick) {
                this.onDblClick(e, row, this);
            }
        };
    }

    private _createCellOnClickHandler(cell: Cell) {

        return (e: MouseEvent) => {

            if (this.isEnabled() === false) {
                return;
            }

            if (cell.onClick) {
                cell.onClick.call(this, e, cell, this);
            }
        };
    }

    private _createCellOnDblClickHandler(cell: Cell) {

        return (e: MouseEvent) => {

            if (this.isEnabled() === false) {
                return;
            }

            if (cell.onDblClick) {
                cell.onDblClick.call(this, e, cell, this);
            }
        };
    }

    private _createRowOnCheckHandler(row: Row) {

        return (e: CheckboxEvent) => {

            if (this.isEnabled() === false) {
                if (e.targetCheckbox.isChecked() === true) {
                    e.targetCheckbox.uncheck();
                } else {
                    e.targetCheckbox.check();
                }
                return;
            }

            if (this._opt.disableSelect === false) {
                if (row._checkbox.isChecked() === true) {
                    this.select(row);
                } else {
                    this.deselect(row);
                }
            }
        };
    }

    private _createLastRowOnClickHandler(row: Row) {

        return (e: MouseEvent) => {

            if (this.isEnabled() === false) {
                return;
            }

            e.stopPropagation();

            if (row._menu) {
                row._menu.open(e);
            }
        };
    }

    private _createResizeHandleOnMousedownHandler(col: Col) {

        return (e: MouseEvent) => {

            //e.stopPropagation();
            e.preventDefault();

            let current = e.clientX;
            const origin = current;

            const onMove = (e: MouseEvent) => {

                e.preventDefault();

                const delta = e.clientX - current;
                current += delta;

                col._resizeHandle.style.left = (parseInt(col._resizeHandle.style.left.replace("px", ""), 10) + delta) + "px";
            };

            const onUp = (e: MouseEvent) => {

                e.preventDefault();

                document.removeEventListener("mousemove", onMove, true);
                document.removeEventListener("mouseup", onUp, true);

                const minWidth = col.minWidth === undefined ? this._opt.colMinWidth : col.minWidth;
                const delta = e.clientX - origin;
                let width = col._th.getWidth() + delta;
                width = col.width = Math.max(width, minWidth);

                this._style.updateText(
                    this._style.innerHTML.replace(new RegExp(`(${col._id}{width:)([^}]*)}`), `$1${width}px}`)
                );

                this._updateLayoutOfCols();
                this._updatePositionOfResizeHandles();
            };

            document.addEventListener("mousemove", onMove, true);
            document.addEventListener("mouseup", onUp, true);
        };
    }
}

export function createGrid(a): Grid {
    return new Grid(a);
}