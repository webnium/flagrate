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

import { jsonPointer } from "./util";
import {
    Element, Attribute, Property, InsertPosition, FHTMLElement, FHTMLDivElement,
    FHTMLInputElement, FHTMLFormElement, FHTMLLabelElement, FHTMLUListElement
} from "./element";
import { TextInput } from "./text-input";
import { TextArea } from "./text-area";
import { ComboBox } from "./combo-box";
import { Checkbox } from "./checkbox";
import { Checkboxes, CheckboxOption as CheckboxesItem } from "./checkboxes";
import { Switch } from "./switch";
import { Radios, RadioOption as RadiosItem } from "./radios";
import { Select, ItemOption as SelectItem } from "./select";

/*?
    class flagrate.Form

    The flagrate.Form provides an interactive form UI.
**/
export interface Option {
    fields?: FieldOption[];

    /** `id` attribute of container. */
    id?: string;
    /** `class` attribute of container. */
    className?: string;
    /** additional attribute of container. */
    attribute?: Attribute;
    /** style of container. (using flagrate.Element.setStyle) */
    style?: Property;

    /** hide labels. */
    nolabel?: boolean;
    /** vertical label style. */
    vertical?: boolean;
}

export interface Field extends FieldOption {
    input?: Input;

    getVal?(): any;
    setVal?(val: any): Field;
    validate?(done?: (result?: boolean) => void): void;
    visible?(): boolean;

    /** field container element */
    /** readonly */container?: FHTMLDivElement;
    /** label element */
    /** readonly */labelElement?: FHTMLLabelElement;
    /** input container element */
    _input?: FHTMLDivElement;

    /** dependency references */
    _refs?: Field[];
    _dependsIsOk?: boolean;
    _hasError?: boolean;
    _hasWarning?: boolean;
    _checkRefs?(): void;
    _inputOnChange?(): void;
}

export interface FieldOption {
    key?: string;
    pointer?: string;

    label?: string;
    icon?: string;
    text?: string;
    html?: string;
    element?: HTMLElement;

    input?: InputOption;
    depends?: Depend[];

    /** `id` attribute of container. */
    id?: string;
    /** `class` attribute of container. */
    className?: string;
    /** additional attribute of container. */
    attribute?: Attribute;
    /** style of container. (using flagrate.Element.setStyle) */
    style?: Property;
}

export interface Input extends InputOption {
    type?: InputType;

    validators?: (RegExpValidator | ValidatorFunction)[];

    /** input element */
    /** readonly */element?: FHTMLDivElement;

    _result?: FHTMLUListElement;
}

export interface InputOption {
    type?: string | InputType;
    val?: any;

    /** default is `false`. */
    isRequired?: boolean;

    min?: number;
    max?: number;
    minLength?: number;
    maxLength?: number;
    validators?: (string | RegExpValidator | ValidatorFunction)[];

    /** if NOT String, use `val.toString()` before resulting. */
    toStr?: boolean;
    /** if String, use `String#trim()` before resulting. */
    trim?: boolean;
    /** if NOT Number, tries to convert to Number. */
    toNumber?: boolean;
    /** alternate result transform/converting function. (only sync) */
    transform?(val?: any): any;

    /** `id` attribute of input element. */
    id?: string;
    /** style of input. (using flagrate.Element.setStyle) */
    style?: Property;

    // anyway,
    placeholder?: string;
    label?: string;
    labelHTML?: string;
    icon?: string;
    items?: (string | number | boolean | CheckboxesItem | SelectItem | RadiosItem)[];
    selectedIndex?: number;
    selectedIndexes?: number[];
    listView?: boolean;
    multiple?: boolean;
    accept?: string;
    acceptTypes?: string[];
}

export interface Depend {
    /** unique key for identifying fields. if looking result, must change to use the pointer. */
    key?: string;
    pointer?: string;

    val?: any;

    /** comparison operator */
    op?: "===" | "!==" | ">=" | "<=" | ">" | "<" | "in";

    /** alternate testing function. this disables normal testing. (only sync) */
    tester?(a?: any, b?: any): boolean;
}

export interface InputType {
    changeEvents?: string[];
    create(): HTMLElement;
    getVal(): any;
    setVal(val?: any): void;
    enable(): void;
    disable(): void;
}

export interface RegExpValidator {
    regexp: RegExp,
    success?: string;
    error?: string;
}

export type ValidatorFunction = (input: any, done: (result: boolean | "success" | "warning" | "error", message?: string) => void) => void;

/*?
    flagrate.createForm(option)
    new flagrate.Form(option)
    - option (Object) - configuration.

    Create and initialize the Form.

    #### option

    * `fields`                   (Array; default `[]`): of **[field](#field)** object.
    * `id`                       (String): `id` attribute of container.
    * `className`                (String): `class` attribute of container.
    * `attribute`                (Object): additional attribute of container.
    * `style`                    (Object): style of container. (using flagrate.Element.setStyle)
    * `nolabel`                  (Boolean; default `false`): hide labels.
    * `vertical`                 (Boolean; default `false`): vertical label style.

    #### field

    * `key`                      (String):
    * `pointer`                  (String|null):
    * `label`                    (String; default `""`):
    * `icon`                     (String):
    * `text`                     (String):
    * `html`                     (String):
    * `element`                  (Element):
    * `input`                    (Object): see **[input](#input)**
    * `depends`                  (Array): of **[depend](#depend)**
    * `id`                       (String): `id` attribute of container.
    * `className`                (String): `class` attribute of container.
    * `attribute`                (Object): additional attribute of container.
    * `style`                    (Object): style of container. (using flagrate.Element.setStyle)

    #### input

    * `type`                     (String|Object; **required**): **[inputtype](#inputType)** String or Object
    * `val`                      (any): default value(s) of this input.
    * `isRequired`               (Boolean; default `false`):
    * `min`                      (Number): (simple validator)
    * `max`                      (Number): (simple validator)
    * `minLength`                (Number): (simple validator)
    * `maxLength`                (Number): (simple validator)
    * `validators`               (Array): of **[inputValidator](#inputvalidator)** String or Object or Function.
    * `toString`                 (Boolean; default `false`): if NOT String, use [#toString()](https://developer.mozilla.org/ja/docs/toString) before resulting.
    * `trim`                     (Boolean; default `false`): if String, use [String#trim()](https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Global_Objects/String/trim) before resulting.
    * `toNumber`                 (Boolean; default `false`): if NOT Number, tries to convert to Number.
    * `transform`                (Function): alternate result transform/converting function. (only sync)
    * `id`                       (String): `id` attribute of input element.

    #### depend

    * `key`                      (String): unique key for identifying fields. if looking result, must change to use the pointer.
    * `pointer`                  (String):
    * `val`                      (any):
    * `op`                       (String): `===`, `!==`, `>=`, `<=`, `>`, `<`, `in`
    * `tester`                   (Function): alternate testing function. this disables normal testing. (only sync)

    #### inputType

    if specified a String, will use flagrate.Form.inputType[(specified)].

    #### inputValidator

    if specified a String, will use flagrate.Form.inputValidator[(specified)].

        // Example: custom validator
        validators: [
            // using regex:
            {
                regexp: /^[a-z0-9]+(-[a-z0-9]+)*(\.([a-z0-9]+(-[a-z0-9]+)*))*$/i,
                error: "Please enter a valid hostname string."
            },
            // using async function:
            function (input, done) {
                someAsyncFunction(input, function (err, result) {
                    if (err) {
                        done("error", "This hostname is already in use. (" + err + ")");
                    } else {
                        done("success");
                    }
                });
            },
            // using sync function:
            function (input, done) {
                var err = someSyncFunction(input);
                if (err) {
                    done("error", "This hostname is prohibited. (" + err + ")");
                } else {
                    done("success");
                }
            }
        ]

    see flagrate.Form.inputValidator to read more documents.
**/
export class Form {

    private _fields: Field[] = [];

    private _nolabel: boolean = false;
    private _vertical: boolean = false;

    element = new Element("form", { "class": "flagrate flagrate-form" });

    static idCounter = 0;
    private _id = "flagrate-form-" + (++Form.idCounter).toString(10);

    private _renderTimer: number;

    constructor(private _opt: Option = {}) {

        if (_opt.nolabel === true) {
            this._nolabel = true;
        }
        if (_opt.vertical === true) {
            this._vertical = true;
        }

        this._create();

        if (_opt.fields && _opt.fields.length !== 0) {
            this.push(_opt.fields);
        }
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

    /** Returns a result Object. */
    getResult(): any {

        const result = {};

        for (let i = 0, l = this._fields.length; i < l; i++) {
            let field = this._fields[i];

            if ((!field.key && typeof field.pointer !== "string") || field._dependsIsOk !== true) {
                continue;
            }

            if (field.pointer === null) {
                // null pointer
                continue;
            }

            if (typeof field.pointer === "string") {
                jsonPointer.set(result, field.pointer, field.getVal());
            } else if (field.key) {
                result[field.key] = field.getVal();
            }
        }

        return result;
    }

    /*?
        #### Example

            form.validate(function(success) {
                if (success) {
                    console.log("form is valid.");
                } else {
                    console.log("form is invalid.");
                }
            });
    **/
    validate(callback?: (success?: boolean) => void): this {

        const fields: Field[] = [];

        for (let i = 0, l = this._fields.length; i < l; i++) {
            let field = this._fields[i];

            if (field._dependsIsOk === true && field.input && field.input.type) {
                fields.push(field);
            }
        }

        let hasError = false;

        function fin() {

            if (callback) {
                callback(!hasError);
            }
        }

        function done(result) {

            if (result === false) {
                hasError = true;
            }

            run();
        }

        function run() {

            if (fields.length === 0) {
                return fin();
            }

            fields.shift().validate(done);
        }
        run();

        return this;
    }

    enable(): this {

        for (let i = 0, l = this._fields.length; i < l; i++) {
            const field = this._fields[i];

            if (field.input && field.input.type) {
                field.input.type.enable.call(field.input);
            }
        }

        return this;
    }

    disable(): this {

        for (let i = 0, l = this._fields.length; i < l; i++) {
            const field = this._fields[i];

            if (field.input && field.input.type) {
                field.input.type.disable.call(field.input);
            }
        }

        return this;
    }

    getField(key: string): Field {

        for (let i = 0, l = this._fields.length; i < l; i++) {
            const field = this._fields[i];

            if (field.key && field.key === key) {
                return field;
            }
        }

        return null;
    }

    push(field: Field): number;
    push(fields: Field[]): number;
    push(f) {

        if (f instanceof Array) {
            for (let i = 0, l = f.length; i < l; i++) {
                this._createField(f[i]);
                this._fields.push(f[i]);
            }
        } else {
            this._createField(f);
            this._fields.push(f);
        }

        for (let i = 0, l = this._fields.length; i < l; i++) {
            this._collectFieldRefs(this._fields[i]);
            this._checkFieldDepends(this._fields[i]);
        }

        this._requestRender();

        return this._fields.length;
    }

    splice(index: number, howMany?: number, fields?: Field[]): Field[];
    splice(index: number, howMany?: number, field?: Field): Field[];
    splice(index, c, f) {

        c = typeof c === "undefined" ? this._fields.length - index : c;

        const removes = this._fields.splice(index, c);

        for (let i = 0, l = removes.length; i < l; i++) {
            if (removes[i].element) {
                removes[i].element.remove();
                delete removes[i].element;
            }
        }

        if (f) {
            if (f instanceof Array === false) {
                f = [f];
            }

            for (let i = 0, l = f.length; i < l; i++) {
                this._createField(f[i]);
                this._fields.splice(index + i, 0, f[i]);
            }
        }

        for (let i = 0, l = this._fields.length; i < l; i++) {
            this._collectFieldRefs(this._fields[i]);
            this._checkFieldDepends(this._fields[i]);
        }

        this._requestRender();

        return removes;
    }

    removeField(field: Field): Field;
    removeField(fields: Field[]): Field[];
    removeField(f) {

        const removes: Field[] = [];
        let bulk = true;

        if (f instanceof Array === false) {
            bulk = false;
            f = [f];
        }

        for (let i = 0, l = f.length; i < l; i++) {
            const index = (typeof f[i] === "number") ? f[i] : this.indexOf(f[i]);
            if (index !== -1) {
                removes.push(this.splice(index, 1));
            }
        }

        return bulk ? removes : removes[0];
    }

    indexOf(field: Field): number;
    indexOf(keyOfField: string): number;
    indexOf(f) {

        if (typeof f === "string") {
            let index = -1;

            for (let i = 0, l = this._fields.length; i < l; i++) {
                if (this._fields[i].key === f) {
                    index = i;
                    break;
                }
            }

            return index;
        } else {
            return this._fields.indexOf(f);
        }
    }

    private _create(): this {

        if (this._opt.id) {
            this.element.writeAttribute("id", this._opt.id);
        }
        if (this._opt.className) {
            this.element.addClassName(this._opt.className);
        }
        if (this._opt.attribute) {
            this.element.writeAttribute(this._opt.attribute);
        }
        if (this._opt.style) {
            this.element.setStyle(this._opt.style);
        }

        if (this._opt.nolabel === true) {
            this.element.addClassName("flagrate-form-nolabel");
        }
        if (this._opt.vertical === true) {
            this.element.addClassName("flagrate-form-vertical");
        }

        this.element.addEventListener("submit", e => e.preventDefault());

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

        const active = document.activeElement as HTMLInputElement;

        for (let i = 0, l = this._fields.length; i < l; i++) {
            const field = this._fields[i];

            if (field._dependsIsOk === true) {
                field.container.insertTo(this.element);
            } else {
                if (field.visible() === true) {
                    field.container.remove();
                }
            }
        }

        if (active) {
            if (/Trident/.test(window.navigator.userAgent) === true) {
                setTimeout(() => {
                    if (active.focus) {
                        active.focus();
                    }

                    const isMustReselected = (
                        (
                            active.tagName === "INPUT" && (
                                active.type === "text" ||
                                active.type === "password" ||
                                active.type === "number"
                            )
                        ) ||
                        active.tagName === "TEXTAREA"
                    );
                    if (isMustReselected) {
                        if (typeof active.selectionStart === "number") {
                            active.selectionStart = active.selectionEnd = active.value.length;
                        } else if (typeof active.createTextRange !== "undefined") {
                            const range = active.createTextRange();
                            range.collapse(false);
                            range.select();
                        }
                    }
                }, 0);
            } else {
                if (active.focus) {
                    active.focus();
                }
            }
        }

        return this;
    }

    private _collectFieldRefs(field: Field): this {

        field._refs = [];

        // DEPRECATED
        if (typeof field["point"] !== "undefined") {
            field.pointer = field["point"];
            delete field["point"];
        }
        if (!field.key && typeof field.pointer !== "string") {
            return this;
        }

        let i, l, j, m, k, n, fi, s;
        for (i = 0, l = this._fields.length; i < l; i++) {
            fi = this._fields[i];

            if (field === fi || !fi.depends || fi.depends.length === 0) {
                continue;
            }

            for (j = 0, m = fi.depends.length; j < m; j++) {
                if (fi.depends[j] instanceof Array) {
                    s = false;

                    for (k = 0, n = fi.depends[j].length; k < n; k++) {
                        if (fi.depends[j][k].key === field.key) {
                            s = true;
                            break;
                        }
                        if (typeof fi.depends[j][k].point === "string") {
                            fi.depends[j][k].pointer = fi.depends[j][k].point;
                            delete fi.depends[j][k].point;
                        }
                        if (typeof fi.depends[j][k].pointer === "string") {
                            if (fi.depends[j][k].pointer === field.pointer) {
                                s = true;
                                break;
                            }
                            if (fi.depends[j][k].pointer === "/" + field.key) {
                                s = true;
                                break;
                            }
                        }
                    }

                    if (s) {
                        field._refs.push(fi);
                    }
                    break;
                } else {
                    if (fi.depends[j].key === field.key) {
                        field._refs.push(fi);
                        break;
                    }
                    if (typeof fi.depends[j].point === "string") {
                        fi.depends[j].pointer = fi.depends[j].point;
                        delete fi.depends[j].point;
                    }
                    if (typeof fi.depends[j].pointer === "string") {
                        if (fi.depends[j].pointer === field.pointer) {
                            field._refs.push(fi);
                            break;
                        }
                        if (fi.depends[j].pointer === "/" + field.key) {
                            field._refs.push(fi);
                            break;
                        }
                    }
                }
            }
        }

        return this;
    }

    private _compareDepend(d: Depend): boolean {

        let v;

        if (d.key) {
            const f = this.getField(d.key);
            if (f !== null) {
                if (!d.op && !d.tester && d.val === undefined) {
                    return true;
                }
                if (f._dependsIsOk === true) {
                    v = f.getVal();
                }
            }
        } else if (typeof d.pointer === "string") {
            try {
                v = jsonPointer.get(this.getResult(), d.pointer);
            } catch (e) {
                // undefined
            }
        } else {
            return true;
        }

        if (typeof d.tester === "function") {
            return !!d.tester(v, d);
        }

        if (d.op) {
            if (d.op === "===" && d.val === v) { return true; }
            if (d.op === "!==" && d.val !== v) { return true; }
            if (d.op === ">=" && d.val >= v) { return true; }
            if (d.op === "<=" && d.val <= v) { return true; }
            if (d.op === ">" && d.val > v) { return true; }
            if (d.op === "<" && d.val < v) { return true; }
            if (d.op === "in" && typeof v[d.val] !== "undefined") { return true; }
        } else {
            if (d.val === v) {
                return true;
            }
        }

        return false;
    }

    private _checkFieldDepends(field: Field): boolean {

        const depends = field.depends;

        if (!depends || depends.length === 0) {
            field._dependsIsOk = true;
            return true;
        }

        let result = true;
        let i, l, j, m, d, f, s;

        for (i = 0, l = depends.length; i < l; i++) {
            d = depends[i];

            if (d instanceof Array) {
                s = false;

                for (j = 0, m = d.length; j < m; j++) {
                    if (this._compareDepend(d[j]) === true) {
                        s = true;
                        break;
                    }
                }

                if (s === false) {
                    result = false;
                    break;
                }
            } else {
                if (this._compareDepend(d) === false) {
                    result = false;
                    break;
                }
            }
        }

        field._dependsIsOk = result;
        return result;
    }

    private _createField(field: Field): this {

        field._dependsIsOk = (!field.depends || field.depends.length === 0);

        // field container
        field.container = new Element("div");

        // attributes to field container
        if (field.id) {
            field.container.writeAttribute("id", field.id);
        }
        if (field.className) {
            field.container.writeAttribute("class", field.className);
        }
        if (field.attribute) {
            field.container.writeAttribute(field.attribute);
        }
        if (field.style) {
            field.container.setStyle(field.style);
        }

        // create label
        if (this._nolabel === false) {
            field.labelElement = new Element("label").insertText(field.label || "");

            new Element("div", { "class": "flagrate-form-field-label" })
                .insert(field.labelElement)
                .insertTo(field.container);

            // icon to label
            if (field.icon) {
                field.labelElement.addClassName("flagrate-icon");
                field.labelElement.setStyle({
                    backgroundImage: `url(${field.icon})`
                });
            }
        }

        // input container
        field._input = new Element("div").insertTo(field.container);

        // input ready?
        if (field.input && field.input.type) {
            if (typeof field.input.type === "string") {
                field.input.type = Form.inputType[<string><any>field.input.type];
            } else if (!field.input.type.create) {
                delete field.input;
            }
        }

        // init input
        if (field.input && field.input.type) {
            const input = field.input;

            if (!input.id) {
                input.id = "flagrate-form-input-" + (++Form.idCounter);
            }

            if (this._nolabel === false) {
                field.labelElement.writeAttribute("for", input.id);
            }

            input.element = input.type.create.call(input);

            new Element("div", { "class": "flagrate-form-field-input" })
                .insert(input.element)
                .insertTo(field._input);

            input.element.writeAttribute("id", input.id);

            // value, values is just alias.
            if (input["value"]) {
                input.val = input["value"];
            } else if (input["values"]) {
                input.val = input["values"];
            }

            // set the default value
            if (input.val !== undefined) {
                input.type.setVal.call(input, input.val);
            }

            if (input.style) {
                input.element.setStyle(input.style);
            }

            // toString is alias for toStr.
            if (typeof input["toString"] === "boolean" && input.toStr === undefined) {
                input.toStr = input["toString"] as any as boolean;
            }

            // init validator
            if (input.validators) {
                input.validators.forEach((v, i) => {
                    if (typeof v === "string") {
                        input.validators[i] = Form.inputValidator[<string><any>v];
                    }
                });
            } else {
                input.validators = [];
            }

            // result block
            input._result = new Element("ul", {
                "class": "flagrate-form-field-result"
            }).insertTo(field._input);

            // etc
            if (input.isRequired === true) {
                field.container.addClassName("flagrate-required");
            }
        }

        // misc
        if (field.element) {
            new Element("div", {
                "class": "flagrate-form-field-element"
            }).insert(field.element).insertTo(field._input);
        }
        if (field.html) {
            new Element("div", {
                "class": "flagrate-form-field-html"
            }).insert(field.html).insertTo(field._input);
        }
        if (field.text) {
            new Element("p", {
                "class": "flagrate-form-field-text"
            }).insertText(field.text).insertTo(field._input);
        }

        // field methods
        field.visible = () => {
            return (field.container.parentNode !== null && field.container.parentNode === this.element);
        };

        field.getVal = () => {

            if (!field.input) {
                return undefined;
            }

            let result = field.input.type.getVal.call(field.input);

            if (field.input.toStr === true) {
                result = result.toString();
            }

            if (field.input.trim === true && typeof result === "string") {
                result = result.trim();
            }

            if (field.input.toNumber === true && typeof result !== "number") {
                if (typeof result === "string") {
                    result = parseFloat(result);
                } else if (result instanceof Date) {
                    result = result.getTime();
                } else if (typeof result === "boolean") {
                    result = (result === true) ? 1 : 0;
                }
            }

            if (typeof field.input.transform === "function") {
                result = field.input.transform.call(field.input, result);
            }

            return result;
        };

        field.setVal = val => {

            if (!field.input) {
                return field;
            }

            field.input.type.setVal.call(field.input, val);

            field._inputOnChange();

            return field;
        };

        field.validate = callback => {

            const val = field.getVal();

            let hasError = false;
            let hasWarning = false;

            field.input._result.update();

            // simple validator
            if (field.input.isRequired === true) {
                if (val === undefined) {
                    hasError = true;
                } else if (val === false || val === null) {
                    hasError = true;
                } else if (typeof val === "number" && isNaN(val) === true) {
                    hasError = true;
                } else if ((val.length !== undefined) && val.length === 0) {
                    hasError = true;
                }
            }
            if (field.input.min) {
                if (typeof val === "number") {
                    if (field.input.min > val) {
                        hasError = true;
                    }
                } else if (typeof val === "string" && val !== "") {
                    if (field.input.min > parseInt(val, 10)) {
                        hasError = true;
                    }
                } else if (val instanceof Array) {
                    if (field.input.min > val.length) {
                        hasError = true;
                    }
                }
            }
            if (field.input.max) {
                if (typeof val === "number") {
                    if (field.input.max < val) {
                        hasError = true;
                    }
                } else if (typeof val === "string" && val !== "") {
                    if (field.input.max < parseInt(val, 10)) {
                        hasError = true;
                    }
                } else if (val instanceof Array) {
                    if (field.input.max < val.length) {
                        hasError = true;
                    }
                }
            }
            if (field.input.minLength && field.input.minLength > (val.length || (val.toString && val.toString().length) || 0) && (typeof val === "string" && val !== "")) {
                hasError = true;
            }
            if (field.input.maxLength && field.input.maxLength < (val.length || (val.toString && val.toString().length) || 0)) {
                hasError = true;
            }

            // validators
            const q = [];
            field.input.validators.forEach(function (v) {
                q.push(v);
            });

            function fin() {
                if (field.input._result.innerHTML === "") {
                    field.container.removeClassName("flagrate-has-result");
                } else {
                    field.container.addClassName("flagrate-has-result");
                }

                if (hasError) {
                    field.container.removeClassName("flagrate-has-warning");
                    field.container.removeClassName("flagrate-has-success");
                    field.container.addClassName("flagrate-has-error");
                } else if (hasWarning) {
                    field.container.removeClassName("flagrate-has-error");
                    field.container.removeClassName("flagrate-has-success");
                    field.container.addClassName("flagrate-has-warning");
                } else {
                    field.container.removeClassName("flagrate-has-error");
                    field.container.removeClassName("flagrate-has-warning");
                    field.container.addClassName("flagrate-has-success");
                }

                field._hasError = hasError;
                field._hasWarning = hasWarning;

                if (callback) { callback(!hasError); }
            }

            function done(result, message?) {

                switch (result) {
                    case true:
                    case "success":
                        break;
                    case null:
                    case "warning":
                        hasWarning = true;
                        break;
                    case false:
                    case "error":
                        hasError = true;
                        break;
                }

                if (message) {
                    new Element("li").insertText(message).insertTo(field.input._result);
                }

                run();
            }

            function run() {

                if (q.length === 0 || hasError === true) { return fin(); }

                let v = q.shift();

                if (typeof v === "function") {
                    v.call(field.input, val, done);
                } else if (typeof val === "string" && val !== "") {
                    if (v.regexp.test(val)) {
                        done(true, v.success);
                    } else {
                        done(false, v.error);
                    }
                } else {
                    done(true);
                }
            }

            run();
        };

        field._checkRefs = () => {

            let rerend = false;

            for (let i = 0, l = field._refs.length, refField; i < l; i++) {
                refField = field._refs[i];
                if (refField._dependsIsOk !== this._checkFieldDepends(refField)) {
                    refField._checkRefs();
                    rerend = true;
                }
            }

            if (rerend === true) {
                this._requestRender();
            }
        };

        field._inputOnChange = () => {

            // validation
            field.validate();

            // dependency
            field._checkRefs();
        };

        // listen change event
        if (field.input && field.input.type) {
            const changeEvents = field.input.type.changeEvents || ["change"];
            changeEvents.forEach(eventName => {
                field.input.element.addEventListener(eventName, field._inputOnChange);
            });
        }

        return this;
    }

    /*?
        flagrate.Form.inputValidator -> Object

        #### Built-in validators

        * numeric
        * alphanumeric

        #### Basic validator

            // success and error messages are optional
            { regexp: /RegExp/, success: "String", error: "String" }
            // warning state is not available in this way, see Advanced.

        #### Advanced validator

            // Sync or Async validation
            function (input, done) { done(result, message); }// message is optional

            // Examples
            function (input, done) { done(true); }// success
            function (input, done) { done(null); }// warning
            function (input, done) { done(false); }// error
            function (input, done) { done("success"); }// success
            function (input, done) { done("warning"); }// warning
            function (input, done) { done("error"); }// error
            function (input, done) { done(true, "..."); }// success with message
            function (input, done) { done(null, "..."); }// warning with message
            function (input, done) { done(false, "..."); }// error with message

        #### Example: adding error message to built-in validators

            flagrate.Form.inputValidator.numeric.error = "Please enter a numbers.";
            flagrate.Form.inputValidator.alphanumeric.error = "Please enter a alphanumeric.";

        #### Example: add the custom validator to Flagrate (to create plugin)

            flagrate.Form.inputValidator.hostname = {
                regexp: /^[a-z0-9]+(-[a-z0-9]+)*(\.([a-z0-9]+(-[a-z0-9]+)*))*$/i,
                error: "Please enter a valid hostname string."
            };
    **/
    static inputValidator = {
        numeric: {
            regexp: /^[0-9]+$/
        },
        alphanumeric: {
            regexp: /^[a-z0-9]+$/i
        }
    };

    /*?
        flagrate.Form.inputType -> Object

        #### Built-in input types

        * [text](#text-string-) -> `String`
        * [password](#password-string-) -> `String`
        * [textarea](#textarea-string-) -> `String`
        * [number](#number-number-) -> `Number`
        * [combobox](#combobox-string-) -> `String`
        * [checkbox](#checkbox-boolean-) -> `Boolean`
        * [checkboxes](#checkboxes-array-) -> `Array`
        * [switch](#switch-boolean-) -> `Boolean`
        * [radios](#radios-any-) -> `any`
        * [select](#select-any-array-) -> `any`|`Array`
        * [file](#file-file-) -> `File`
        * [files](#files-filelist-) -> `FileList`
    **/
    static inputType = {
        /*?
            #### text -> `String`
            most basic single-line text input. (uses flagrate.TextInput)

            * `placeholder` (String):
            * `icon`        (String):
            * `maxLength`   (Number):
        **/
        text: {
            changeEvents: ["change", "keyup"],
            create() {
                // return to define this.element
                return new TextInput({
                    placeholder: this.placeholder,
                    icon: this.icon,
                    attribute: {
                        maxlength: this.maxLength
                    }
                });
            },
            getVal(): string {
                return this.element.getValue();
            },
            setVal(value: string) {
                this.element.setValue(value);
            },
            enable() {
                this.element.enable();
            },
            disable() {
                this.element.disable();
            }
        },

        /*?
            #### password -> `String`
            password input. Almost the same to [text](#text).
        **/
        password: {
            changeEvents: ["change", "keyup"],
            create() {
                return new TextInput({
                    placeholder: this.placeholder,
                    icon: this.icon,
                    attribute: {
                        type: "password",
                        maxlength: this.maxLength
                    }
                });
            },
            getVal(): string {
                return this.element.getValue();
            },
            setVal(value: string) {
                this.element.setValue(value);
            },
            enable() {
                this.element.enable();
            },
            disable() {
                this.element.disable();
            }
        },

        /*?
            #### textarea -> `String`
            textarea input. (uses flagrate.TextArea)

            * `placeholder` (String):
            * `icon`        (String):
            * `maxLength`   (Number):
        **/
        textarea: {
            changeEvents: ["change", "keyup"],
            create() {
                return new TextArea({
                    placeholder: this.placeholder,
                    icon: this.icon,
                    attribute: {
                        maxlength: this.maxLength
                    }
                });
            },
            getVal(): string {
                return this.element.getValue();
            },
            setVal(value: string) {
                this.element.setValue(value);
            },
            enable() {
                this.element.enable();
            },
            disable() {
                this.element.disable();
            }
        },

        /*?
            #### number -> `Number`
            number input. (uses flagrate.TextInput)

            * `placeholder` (String):
            * `icon`        (String):
            * `min`         (Number):
            * `max`         (Number):
            * `maxLength`   (Number):
        **/
        number: {
            changeEvents: ["change", "keyup"],
            create() {
                return new TextInput({
                    placeholder: this.placeholder,
                    icon: this.icon,
                    attribute: {
                        type: "number",
                        inputmode: "numeric",
                        min: this.min,
                        max: this.max,
                        maxlength: this.maxLength
                    }
                });
            },
            getVal(): number {
                return parseFloat(this.element.getValue());
            },
            setVal(value: string) {
                this.element.setValue(value);
            },
            enable() {
                this.element.enable();
            },
            disable() {
                this.element.disable();
            }
        },

        /*?
            #### combobox -> `String`
            combobox input. (uses flagrate.ComboBox)

            * `placeholder` (String):
            * `icon`        (String):
            * `maxLength`   (Number):
            * `items`       (Array): of String values.
        **/
        combobox: {
            changeEvents: ["change", "keyup"],
            create() {
                return new ComboBox({
                    placeholder: this.placeholder,
                    icon: this.icon,
                    items: this.items,
                    attribute: {
                        maxlength: this.maxLength
                    }
                });
            },
            getVal(): string {
                return this.element.getValue();
            },
            setVal(value: string) {
                this.element.setValue(value);
            },
            enable() {
                this.element.enable();
            },
            disable() {
                this.element.disable();
            }
        },

        /*?
            #### checkbox -> `Boolean`
            Checkbox input. (uses flagrate.Checkbox)

            * `label`       (String):
            * `labelHTML`   (String):
            * `icon`        (String):
        **/
        checkbox: {
            create() {
                return new Checkbox({
                    icon: this.icon,
                    label: this.label,
                    labelHTML: this.labelHTML
                });
            },
            getVal(): boolean {
                return this.element.isChecked();
            },
            setVal(value: boolean) {
                if (value) {
                    this.element.check();
                } else {
                    this.element.uncheck();
                }
            },
            enable() {
                this.element.enable();
            },
            disable() {
                this.element.disable();
            }
        },

        /*?
            #### checkboxes -> `Array`
            Checkboxes input. (uses flagrate.Checkboxes)

            * `items` (Array):
        **/
        checkboxes: {
            create() {
                return new Checkboxes({
                    items: this.items
                });
            },
            getVal() {
                return this.element.getValues();
            },
            setVal(values) {
                this.element.setValues(values);
            },
            enable() {
                this.element.enable();
            },
            disable() {
                this.element.disable();
            }
        },

        /*?
            #### switch -> `Boolean`
            Switch input. (uses flagrate.Switch)
        **/
        "switch": {
            create() {
                return new Switch();
            },
            getVal(): boolean {
                return this.element.isOn();
            },
            setVal(value: boolean) {
                if (value) {
                    this.element.switchOn();
                } else {
                    this.element.switchOff();
                }
            },
            enable() {
                this.element.enable();
            },
            disable() {
                this.element.disable();
            }
        },

        /*?
            #### radios -> `any`
            Radio buttons input. (uses flagrate.Radios)

            * `items` (Array):
        **/
        radios: {
            create() {
                return new Radios({
                    items: this.items
                });
            },
            getVal(): string {
                return this.element.getValue();
            },
            setVal(value: string) {
                this.element.setValue(value);
            },
            enable() {
                this.element.enable();
            },
            disable() {
                this.element.disable();
            }
        },

        /*?
            #### select -> `any`|`array`
            Select input. (uses flagrate.Select)

            * `items` (Array):
            * `listView` (Boolean; default `false`):
            * `multiple` (Boolean; default `false`):
            * `max` (Number; default `-1`):
            * `selectedIndex` (Number):
            * `selectedIndexes` (Array): of Number
        **/
        select: {
            create() {
                return new Select({
                    items: this.items,
                    listView: this.listView,
                    multiple: this.multiple,
                    max: this.max,
                    selectedIndex: this.selectedIndex,
                    selectedIndexes: this.selectedIndexes
                });
            },
            getVal() {
                return (this.element.multiple === true) ? this.element.getValues() : this.element.getValue();
            },
            setVal(val) {
                if (this.element.multiple === false) {
                    val = [val];
                } else {
                    this.element.deselectAll();
                }

                for (let i = 0, l = val.length, m = this.element.items.length; i < l; i++) {
                    for (let j = 0; j < m; j++) {
                        if (val[i] === this.element.items[j].value) {
                            this.element.select(j);
                            break;
                        }
                    }
                }
            },
            enable() {
                this.element.enable();
            },
            disable() {
                this.element.disable();
            }
        },

        /*?
            #### file -> `File`
            File input for [File API](http://www.w3.org/TR/file-upload/)

            * `accept` (String): pass to `accept` attribute value.
            * `acceptTypes` (Array): Array of MIME type string.
        **/
        file: {
            create() {
                return new Element("input", {
                    type: "file",
                    accept: this.accept || (this.acceptTypes ? this.acceptTypes.join(",") : undefined)
                });
            },
            getVal() {
                return this.element.files[0];
            },
            setVal(file) {
                this.element.files[0] = file;
            },
            enable() {
                this.element.writeAttribute("disabled", false);
            },
            disable() {
                this.element.writeAttribute("disabled", true);
            }
        },

        /*?
            #### files -> `FileList`
            File input for [File API](http://www.w3.org/TR/file-upload/)

            * `accept` (String): pass to `accept` attribute value.
            * `acceptTypes` (Array): Array of MIME type string.
        **/
        files: {
            create() {
                return new Element("input", {
                    type: "file",
                    accept: this.accept || (this.acceptTypes ? this.acceptTypes.join(",") : undefined),
                    multiple: true
                });
            },
            getVal() {
                return this.element.files;
            },
            setVal(files) {
                this.element.files = files;
            },
            enable() {
                this.element.writeAttribute("disabled", false);
            },
            disable() {
                this.element.writeAttribute("disabled", true);
            }
        }
    };
}

export function createForm(option?: Option): Form {
    return new Form(option);
}