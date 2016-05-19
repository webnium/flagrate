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

import { extendObject } from "./util";
import { Element, Attribute, Property, FHTMLLabelElement, FHTMLInputElement } from "./element";

/*?
    class flagrate.Checkbox
**/
export interface Checkbox extends Instance, FHTMLLabelElement { }

export interface Class {
    new (option?: Option): Checkbox;
    prototype: Instance;
}

export interface Instance {
    disable(): this;
    enable(): this;
    isEnabled(): boolean;
    isChecked(): boolean;
    check(): this;
    uncheck(): this;

    onChange?(e: CheckboxEvent, target: this): void;
    onCheck?(e: CheckboxEvent, target: this): void;
    onUncheck?(e: CheckboxEvent, target: this): void;

    _input?: FHTMLInputElement;
}

export interface Option {
    /** id attribute. */
    id?: string;

    /** class attribute. */
    className?: string;

    /** attribute/value pairs properties. */
    attribute?: Attribute;

    /** Label text. */
    label?: string;

    /** icon image URL. */
    icon?: string;

    /** default is false. */
    isChecked?: boolean;

    /** default is false. */
    isFocused?: boolean;

    /** default is false. */
    isDisabled?: boolean;

    onChange?(e?: CheckboxEvent, target?: Checkbox): void;
    onCheck?(e?: CheckboxEvent, target?: Checkbox): void;
    onUncheck?(e?: CheckboxEvent, target?: Checkbox): void;
}

export interface CheckboxEvent extends Event {
    targetCheckbox?: Checkbox;
}

let idCounter = 0;

/*?
    flagrate.createCheckbox(option)
    new flagrate.Checkbox(option)
    - option (Object) - options.
**/
function FCheckbox(opt: Option = {}) {

    const id = "flagrate-checkbox-" + (++idCounter).toString(10);

    const attr = opt.attribute || {};

    attr["id"] = opt.id || null;
    attr["class"] = opt.className || null;

    //create
    const checkbox = new Element("label", attr).updateText(opt.label) as Checkbox;
    checkbox.writeAttribute("for", id);
    extendObject(checkbox, this);

    checkbox.addClassName("flagrate flagrate-checkbox");

    if (opt.icon) {
        checkbox.addClassName("flagrate-icon");
        checkbox.setStyle({
            backgroundImage: `url(${opt.icon})`
        });
    }

    checkbox.onChange = opt.onChange || null;
    checkbox.onCheck = opt.onCheck || null;
    checkbox.onUncheck = opt.onUncheck || null;

    checkbox._input = new Element("input", { id: id, type: "checkbox" });
    checkbox.insert({ top: new Element() });
    checkbox.insert({ top: checkbox._input });

    checkbox._input.addEventListener("change", e => {

        e.stopPropagation();

        const _e: CheckboxEvent = e;
        _e.targetCheckbox = checkbox;

        if (checkbox.isChecked() === true) {
            if (checkbox.onCheck) {
                checkbox.onCheck(_e, checkbox);
            }

            checkbox.fire("check", { targetCheckbox: checkbox });
        } else {
            if (checkbox.onUncheck) {
                checkbox.onUncheck(_e, checkbox);
            }

            checkbox.fire("uncheck", { targetCheckbox: checkbox });
        }

        if (checkbox.onChange) {
            checkbox.onChange(_e, checkbox);
        }

        checkbox.fire("change", { targetCheckbox: checkbox });
    });

    if (opt.isChecked === true) {
        checkbox.check();
    }
    if (opt.isFocused === true) {
        checkbox.focus();
    }
    if (opt.isDisabled === true) {
        checkbox.disable();
    }

    return checkbox;
}

export const Checkbox = FCheckbox as any as Class;

export function createCheckbox(option?: Option): Checkbox {
    return new Checkbox(option);
}

Checkbox.prototype = {
    disable() {

        this.addClassName("flagrate-disabled");
        this._input.writeAttribute("disabled", true);

        return this;
    },

    enable() {

        this.removeClassName("flagrate-disabled");
        this._input.writeAttribute("disabled", false);

        return this;
    },

    isEnabled() {
        return !this.hasClassName("flagrate-disabled");
    },

    isChecked() {
        return !!this._input.checked;
    },

    check() {
        this._input.checked = true;
        return this;
    },

    uncheck() {
        this._input.checked = false;
        return this;
    }
};