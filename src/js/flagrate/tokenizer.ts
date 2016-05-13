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

import { identity, extendObject, emptyFunction } from './util';
import { Element, Attribute, Property, FHTMLSpanElement, FHTMLDivElement } from './element';
import { Button } from './button';
import { Menu } from './menu';
import { TextInput } from './text-input';

/*?
    class flagrate.Tokenizer

    #### Event

    * `change`: when the tokens/values is changed.
**/
export interface Tokenizer extends Instance, FHTMLDivElement { }

export interface Class {
    new (option?: Option): Tokenizer;
    prototype: Instance;
}

export interface Instance {
    disable(): this;
    enable(): this;
    isEnabled(): boolean;
    setValues(values: (string | Value)[]): this;
    getValues(): (string | Value)[];
    removeValues(): this;
    removeValue(value: string | Value): this;
    setIcon(url?: string): this;
    getIcon(): string;
    focus(): void;

    onChange?(event?: any, tokenizer?: this): void;
    values?: (string | Value)[];
    max?: number;

    _updateTokens(): this;
    _tokenize(): this;
    _tokenized(candidates: (string | Value)[]): this;
    _tokenized(candidates: string | Value): this;
    _onClickHandler(event: MouseEvent): void;
    _onKeydownHandler(event: KeyboardEvent): void;
    _onFocusHandler(event: FocusEvent): void;
    _onBlurHandler(event: FocusEvent): void;

    _tokens?: FHTMLSpanElement;
    _input?: TextInput;
}

export interface Option {
    /** id attribute. */
    id?: string;

    /** class attribute. */
    className?: string;

    /** attribute/value pairs properties. */
    attribute?: Attribute;

    /** CSS style properties (uses Flagrate.Element.setStyle). */
    style?: Property;

    /** default values. */
    values?: Value[];

    /** default is `-1`. */
    max?: number;

    /** placeholder. */
    placeholder?: string;

    /** icon image URL. */
    icon?: string;

    /** default is Flagrate.identity */
    tokenize?(input: string, done: TokenizedCallback): void;
    tokenizeSync?(input: string): (string | Value)[];

    /** default is false. */
    isDisabled?: boolean;

    onChange?(event?: any, tokenizer?: Tokenizer): void;
}

export interface TokenizedCallback {
    (output: (string | Value)[]): void;
    (output: string | Value): void;
}

export interface Value {
    label: string;
    value: any;
}

/*?
    flagrate.createTextInput(option)
    new flagrate.TextInput(option)
    - option (Object) - options.

    TextInput.

    #### option

    * `id`                       (String): `id` attribute of `input` element.
    * `className`                (String):
    * `attribute`                (Object):
    * `style`                    (Object): (using flagrate.Element.setStyle)
    * `value`                    (String):
    * `placeholder`              (String):
    * `icon`                     (String):
    * `regexp`                   (RegExp):
    * `isDisabled`               (Boolean; default `false`):
**/
function FTokenizer(option: Option = {}) {

    this.values = option.values || [];
    this.max = option.max || -1;
    this.tokenize = option.tokenize || option.tokenizeSync || identity;

    if (option.onChange) {
        this.onChange = option.onChange;
    }

    const attr = option.attribute || {};
    if (option.id) {
        attr['id'] = option.id;
    }

    //create
    const tokenizer = new Element('div', attr) as Tokenizer;
    extendObject(tokenizer, this);

    tokenizer.addClassName('flagrate flagrate-tokenizer');
    if (option.className) {
        tokenizer.addClassName(option.className);
    }

    tokenizer._tokens = new Element('span').insertTo(tokenizer);
    tokenizer._input = new TextInput({ placeholder: option.placeholder }).insertTo(tokenizer);

    if (tokenizer.values.length !== 0) {
        tokenizer._updateTokens();
    }

    tokenizer.addEventListener('click', tokenizer._onClickHandler.bind(tokenizer));

    tokenizer._input.addEventListener('keydown', tokenizer._onKeydownHandler.bind(tokenizer));
    tokenizer._input.addEventListener('focus', tokenizer._onFocusHandler.bind(tokenizer));
    tokenizer._input.addEventListener('blur', tokenizer._onBlurHandler.bind(tokenizer));

    if (option.style) {
        tokenizer.setStyle(option.style);
    }
    if (option.icon) {
        tokenizer.setIcon(option.icon);
    }

    if (option.isDisabled) {
        tokenizer.disable();
    }

    return tokenizer;
}

export const Tokenizer = FTokenizer as any as Class;

export function createTokenizer(option?: Option): Tokenizer {
    return new Tokenizer(option);
}

Tokenizer.prototype = {
    disable() {

        this.addClassName('flagrate-disabled');
        this._input.disable();

        return this._updateTokens();
    },

    enable() {

        this.removeClassName('flagrate-disabled');
        this._input.enable();

        return this._updateTokens();
    },

    isEnabled() {
        return !this.hasClassName('flagrate-disabled');
    },

    setValues(values) {

        this.values = values;

        return this._updateTokens();
    },

    getValues() {
        return this.values;
    },

    removeValues() {

        this.values = [];

        return this._updateTokens();
    },

    removeValue(value) {

        this.values.splice(this.values.indexOf(value), 1);

        return this._updateTokens();
    },

    setIcon(identifier) {

        this._iconIdentifier = identifier;

        if (identifier) {
            this.addClassName('flagrate-icon').setStyle({
                backgroundImage: `url(${identifier})`
            });
        } else {
            this.removeClassName('flagrate-icon').setStyle({
                backgroundImage: 'none'
            });
        }

        return this._updateTokens();
    },

    getIcon() {
        return this._iconIdentifier || '';
    },

    focus() {
        this._input.focus();
    },

    _updateTokens() {

        const tokenizer: Tokenizer = this;

        tokenizer._tokens.update();

        tokenizer.values.forEach(value => {

            let label;

            if (typeof value === 'string') {
                label = value;
            } else {
                label = value.label;
            }

            new Button({
                isDisabled: tokenizer.isEnabled() === false,
                isRemovableByUser: tokenizer.isEnabled(),
                onRemove: () => tokenizer.removeValue(value),
                label: label
            }).insertTo(tokenizer._tokens);
        });

        const vw = tokenizer.getWidth();
        const bw = tokenizer.getStyle('border-width') === null ? 2 : parseInt(tokenizer.getStyle('border-width').replace('px', ''), 10);
        const pl = tokenizer.getStyle('padding-left') === null ? 4 : parseInt(tokenizer.getStyle('padding-left').replace('px', ''), 10);
        const pr = tokenizer.getStyle('padding-right') === null ? 4 : parseInt(tokenizer.getStyle('padding-right').replace('px', ''), 10);
        const tw = tokenizer._tokens.getWidth();
        const tm = tokenizer._tokens.getStyle('margin-left') === null ? 2 : parseInt(tokenizer._tokens.getStyle('margin-left').replace('px', ''), 10);
        const im = tokenizer._input.getStyle('margin-left') === null ? 2 : parseInt(tokenizer._input.getStyle('margin-left').replace('px', ''), 10);
        const ip = tokenizer._input.getStyle('padding-left') === null ? 2 : parseInt(tokenizer._input.getStyle('padding-left').replace('px', ''), 10);
        const aw = vw - pl - pr - tw - tm - im - ip - (bw * 2) - 2;

        if (aw > 30) {
            tokenizer._input.style.width = `${aw}px`;
        } else if (aw < -5) {
            tokenizer._input.style.width = '';
        } else {
            tokenizer._input.style.width = '100%';
        }

        tokenizer.fire('change');

        return this;
    },

    _tokenize() {

        this._candidates = [];

        const str = this._input.value;

        const result = this.tokenize(str, this._tokenized.bind(this));

        if (result !== void 0) {
            this._tokenized(result);
        }

        this._lastTokenizedValue = this._input.value;

        return this;
    },

    _tokenized(candidates) {

        if (candidates instanceof Array === false) {
            candidates = [candidates];
        }

        this._candidates = [];

        const menu = new Menu({
            onSelect: () => menu.remove()
        });

        menu.style.left = `${this._input.offsetLeft}px`;

        for (let i = 0, l = candidates.length, candidate, menuItem; i < l; i++) {
            candidate = candidates[i];

            if (typeof candidate === 'string') {
                if (candidate === '') {
                    continue;
                }
                menuItem = { label: candidate };
            } else {
                menuItem = candidate;
            }

            if (menuItem.onSelect) {
                menuItem._onSelect = menuItem.onSelect;
            }

            menuItem.onSelect = _createMenuOnSelectHandler(this, candidate);

            this._candidates.push(candidate);
            menu.push(menuItem);
        }

        if (this._menu) {
            this._menu.remove();
        }

        if (this._candidates.length !== 0) {
            this.insert({ top: menu });
            this._menu = menu;
        }

        return this;
    },

    _onClickHandler() {
        this.focus();
    },

    _onKeydownHandler(e) {

        // ENTER:13
        if (e.keyCode === 13 && this._lastTokenizedValue !== this._input.value) {
            e.stopPropagation();
            e.preventDefault();

            this._lastTokenizedValue = this._input.value;

            this._tokenize();

            return;
        }

        if (this._candidates && this._candidates.length !== 0) {
            if (
                // ENTER:13
                (e.keyCode === 13) ||
                // right:39
                (e.keyCode === 39)
            ) {
                e.stopPropagation();
                e.preventDefault();

                this._input.value = '';
                if (this.max < 0 || this.max > this.values.length) {
                    this.values.push(this._candidates[0]);
                }
                this._updateTokens();

                if (this.onChange) {
                    this.onChange();
                }

                if (this._menu) {
                    this._menu.remove();
                }
            }
        }

        if (this._input.value === '' && this.values.length !== 0) {
            if (
                // BS:8
                (e.keyCode === 8)
            ) {
                e.stopPropagation();
                e.preventDefault();

                const value: Value = this.values.pop();
                this._input.value = typeof value === 'string' ? value : typeof value.value === 'string' ? value.value : '';

                this._updateTokens();

                if (this.onChange) {
                    this.onChange();
                }

                if (this._menu) {
                    this._menu.remove();
                }
            }
        }

        setTimeout(() => {

            if (this.max > -1 && this.max <= this.values.length && this._input.value !== '') {
                e.stopPropagation();

                this._input.value = '';

                return;
            }

            this._tokenize();
        }, 0);
    },

    _onFocusHandler() {

        this._updateTokens();
        this._tokenize();

        this.addClassName('flagrate-tokenizer-focus');
    },

    _onBlurHandler() {

        this._input.value = '';
        if (this._menu) {
            this._menu.style.opacity = '0';
            setTimeout(() => this._menu.remove(), 500);
        }

        this.removeClassName('flagrate-tokenizer-focus');
    }
};

function _createMenuOnSelectHandler(tokenizer: Tokenizer, candidate: Value) {

    return function (e) {

        if (tokenizer.max < 0 || tokenizer.max > tokenizer.values.length) {
            tokenizer.values.push(candidate);
        }
        tokenizer._updateTokens();

        if (tokenizer.onChange) {
            tokenizer.onChange(e, this);
        }
    };
}