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
import { Element, Attribute, Property, FHTMLLabelElement, FHTMLInputElement } from './element';

/*?
    class flagrate.Radio
**/
export interface Radio extends Instance, FHTMLLabelElement { }

export interface Class {
    new (option?: Option): Radio;
    prototype: Instance;
}

export interface Instance {
    disable(): this;
    enable(): this;
    isEnabled(): boolean;
    isChecked(): boolean;
    check(): this;
    uncheck(): this;

    onChange?(e: RadioEvent, target: this): void;
    onCheck?(e: RadioEvent, target: this): void;
    onUncheck?(e: RadioEvent, target: this): void;

    _input?: FHTMLInputElement;
    _checked?: boolean;
}

export interface Option {
    /** id attribute. */
    id?: string;

    /** name attribute. */
    name?: string;

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

    onChange?(e?: RadioEvent, target?: Radio): void;
    onCheck?(e?: RadioEvent, target?: Radio): void;
    onUncheck?(e?: RadioEvent, target?: Radio): void;
}

export interface RadioEvent extends Event {
    targetRadio?: Radio;
}

let idCounter = 0;

/*?
    flagrate.createRadio(option)
    new flagrate.Radio(option)
    - option (Object) - options.
**/
function FRadio(opt: Option = {}) {

    const id = 'flagrate-radio-' + (++idCounter).toString(10);

    const attr = opt.attribute || {};

    attr['id'] = opt.id || null;
    attr['class'] = opt.className || null;

    //create
    const radio = new Element('label', attr).updateText(opt.label) as Radio;
    radio.writeAttribute('for', id);
    extendObject(radio, this);

    radio.addClassName('flagrate flagrate-radio');

    if (opt.icon) {
        radio.addClassName('flagrate-icon');
        radio.setStyle({
            backgroundImage: `url(${opt.icon})`
        });
    }

    radio.onChange = opt.onChange || null;
    radio.onCheck = opt.onCheck || null;
    radio.onUncheck = opt.onUncheck || null;

    radio._input = new Element('input', { id: id, type: 'radio', name: opt.name });
    radio.insert({ top: new Element() });
    radio.insert({ top: radio._input });

    radio._input.addEventListener('change', e => {

        e.stopPropagation();

        const _e: RadioEvent = e;
        _e.targetRadio = radio;

        if (radio.isChecked() === true) {
            if (radio.onCheck) {
                radio.onCheck.call(radio, _e, radio);
            }

            radio.fire('check', { targetRadio: radio });
        } else {
            if (radio.onUncheck) {
                radio.onUncheck.call(radio, _e, radio);
            }

            radio.fire('uncheck', { targetRadio: radio });
        }

        if (radio.onChange) {
            radio.onChange.call(radio, _e, radio);
        }

        radio.fire('change', { targetRadio: radio });
    });

    if (opt.isChecked === true) {
        radio.check();
    }
    if (opt.isFocused === true) {
        radio.focus();
    }
    if (opt.isDisabled === true) {
        radio.disable();
    }

    return radio;
}

export const Radio = FRadio as any as Class;

export function createRadio(option?: Option): Radio {
    return new Radio(option);
}

Radio.prototype = {
    disable() {

        this.addClassName('flagrate-disabled');
        this._input.writeAttribute('disabled', true);

        return this;
    },

    enable() {

        this.removeClassName('flagrate-disabled');
        this._input.writeAttribute('disabled', false);

        return this;
    },

    isEnabled() {
        return !this.hasClassName('flagrate-disabled');
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