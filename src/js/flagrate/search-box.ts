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

import { extendObject, emptyFunction } from './util';
import { Element, Attribute, Property, FHTMLDivElement } from './element';
import { Button } from './button';
import { TextInput } from './text-input';
import { Menu } from './menu';

/*?
    class flagrate.SearchBox

    Smart UI Component for Search Things. **(This is still in preview!!)**

    #### Example

        var searchBox = flagrate.createSearchBox({
            suggester: function (value, done) {
                someAsyncFunction(function (resultItems) {
                    done(resultItems);
                });
            },
            onSearch: function (value) {
                console.log('searching: ' + value);
            }
        }).insertTo(x);

    #### Additional Event

    * `search`:
**/
export interface SearchBox extends Instance, FHTMLDivElement { }

export interface Class {
    new (option?: Option): SearchBox;
    prototype: Instance;
}

export interface Instance {
    disable(): this;
    enable(): this;
    isEnabled(): boolean;
    getValue(): string;
    setValue(value: string): this;
    search(): this;
    suggest(): this;
    focus(): void;
    blur(): void;

    _suggested(items: (string | SuggestedItem)[]): void;
    _onKeydownHandler(e: KeyboardEvent): void;
    _onKeyupHandler(e: KeyboardEvent): void;
    _onFocusHandler(e: Event): void;
    _onBlurHandler(e: Event): void;

    _input?: TextInput;
    _button?: Button;
    _suggest?: FHTMLDivElement;
}

export interface Option {
    id?: string;
    className?: string;
    attribute?: Attribute;
    style?: Property;
    value?: string;
    placeholder?: string;
    icon?: string;
    isDisabled?: boolean;
    suggester?(value: string, callback: (items: (string | SuggestedItem)[]) => void): void;
    suggester?(value: string): (string | SuggestedItem)[];
    onSearch?(value?: string, target?: SearchBox): void;
}

export interface SuggestedItem {
    label: string;
    icon?: string;
    onSelect?(): void;
}

/*?
    flagrate.createSearchBox(option)
    new flagrate.SearchBox(option)
    - option (Object) - options.

    text input for search.

    #### option

    * `id`                       (String): `id` attribute of container element.
    * `className`                (String):
    * `attribute`                (Object):
    * `style`                    (Object): (using flagrate.Element.setStyle)
    * `value`                    (String): default value.
    * `placeholder`              (String):
    * `icon`                     (String):
    * `isDisabled`               (Boolean; default `false`):
    * `suggester`                (Function):
    * `onSearch`                 (Function): callback with input value.
**/
function FSearchBox(opt: Option = {}) {

    this.suggester = opt.suggester || null;
    this.onSearch = opt.onSearch || emptyFunction;

    const attr = opt.attribute || {};

    attr['id'] = opt.id || null;
    attr['class'] = opt.className || null;

    //create
    const searchBox = new Element('div', attr) as SearchBox;
    extendObject(searchBox, this);

    searchBox.addClassName('flagrate flagrate-search-box');

    searchBox._input = new TextInput({
        className: 'search-input',
        value: opt.value,
        placeholder: opt.placeholder,
        icon: opt.icon
    }).insertTo(searchBox);

    searchBox._button = new Button({
        className: 'search-button',
        onSelect: searchBox.search.bind(searchBox)
    }).insertTo(searchBox);

    searchBox._suggest = new Element('div', {
        'class': 'search-suggest'
    }).hide().insertTo(searchBox);

    searchBox._input.on('keydown', searchBox._onKeydownHandler.bind(searchBox));
    searchBox._input.on('keyup', searchBox._onKeyupHandler.bind(searchBox));
    searchBox._input.on('focus', searchBox._onFocusHandler.bind(searchBox));
    searchBox._input.on('blur', searchBox._onBlurHandler.bind(searchBox));

    // for Chrome
    searchBox._suggest.on('mousedown', e => e.preventDefault());

    if (opt.style) {
        searchBox.setStyle(opt.style);
    }

    if (opt.isDisabled) {
        searchBox.disable();
    }

    return searchBox;
}

export const SearchBox = FSearchBox as any as Class;

export function createSearchBox(option?: Option): SearchBox {
    return new SearchBox(option);
}

SearchBox.prototype = {
    disable() {

        this.addClassName('flagrate-disabled');
        this._input.disable();
        this._button.disable();

        this._suggest.hide();

        return this;
    },

    enable() {

        this.removeClassName('flagrate-disabled');
        this._input.enable();
        this._button.enable();

        return this;
    },

    isEnabled() {
        return !this.hasClassName('flagrate-disabled');
    },

    getValue() {
        return this._input.getValue();
    },

    setValue(value) {

        this._input.setValue(value);

        return this;
    },

    search() {

        const value = this.getValue();

        this.onSearch(value);
        this.fire('search', value);

        this._input.blur();

        return this;
    },

    suggest() {

        if (!this.suggester) {
            return this;
        }

        this._suggest.hide();

        const value = this.getValue();

        const result = this.suggester(value, this._suggested.bind(this));

        if (result !== void 0) {
            this._suggested(result);
        }

        return this;
    },

    focus() {
        this._input.focus();
    },

    blur() {
        this._input.blur();
    },

    _suggested(suggestedItems) {

        if (!suggestedItems) {
            return;
        }

        if (suggestedItems.length === 0) {
            this._suggest.hide();
            return;
        }

        const items = [];

        suggestedItems.forEach(item => {

            if (typeof item === 'string' && item.trim() !== '') {
                items.push({
                    label: item.trim(),
                    onSelect: this._createCompletionHandler(this, item.trim())
                });
            } else if (typeof item === 'object') {
                items.push({
                    label: item.label,
                    icon: item.icon,
                    onSelect: this._createSuggestionHandler(this, item.onSelect)
                });
            }
        });

        if (items.length === 0) {
            this._suggest.hide();
            return;
        }

        const menu = this._menu = new Menu({
            items: items,
            onSelect: () => {
                this._suggest.hide();
            }
        });

        Element.addClassName(menu.firstChild, 'flagrate-search-suggest-selected');

        this._suggest.update(menu).show();

        // To prevent overflow.
        let menuHeight = this._suggest.getHeight();
        let menuMargin = parseInt(this._suggest.getStyle('margin-top').replace('px', ''), 10);
        let cummOffsetTop = this.cumulativeOffset().top;
        let upsideSpace = - window.pageYOffset + cummOffsetTop;
        let downsideSpace = window.pageYOffset + window.innerHeight - cummOffsetTop - this.getHeight();
        if (menuHeight + menuMargin > downsideSpace) {
            if (upsideSpace > downsideSpace) {
                if (upsideSpace < menuHeight + menuMargin) {
                    menuHeight = (upsideSpace - menuMargin - menuMargin);
                    this._suggest.style.maxHeight = menuHeight + 'px';
                }
                this._suggest.addClassName('flagrate-search-suggest-upper');
            } else {
                menuHeight = (downsideSpace - menuMargin - menuMargin);
                this._suggest.style.maxHeight = menuHeight + 'px';
                this._suggest.removeClassName('flagrate-search-suggest-upper');
            }
        } else {
            this._suggest.removeClassName('flagrate-search-suggest-upper');
        }

        // reset scroll position
        this._suggest.scrollTop = 0;
    },

    _onKeydownHandler(e) {

        // ESC: 27
        if (e.keyCode === 27) {
            this._input.select();
            this._suggest.hide();
        } else if (this._suggest.visible() === true) {
            // ENTER: 13
            if (e.keyCode === 13) {
                const target = this._menu.getElementsByClassName('flagrate-search-suggest-selected')[0];
                target.click();
                return;
            }

            // UP: 38, DOWN: 40
            if (e.keyCode !== 38 && e.keyCode !== 40) {
                return;
            }

            e.preventDefault();

            const elements = this._menu.getElementsByTagName('button');

            let i = 0, l = elements.length;
            for (; i < l; i++) {
                if (elements[i].hasClassName('flagrate-search-suggest-selected') === true) {
                    if ((e.keyCode === 38 && i !== 0) || (e.keyCode === 40 && (i + 1) !== l)) {
                        elements[i].removeClassName('flagrate-search-suggest-selected');
                    }

                    let scrollTop = -1;

                    if (e.keyCode === 38 && i !== 0) {
                        elements[i - 1].addClassName('flagrate-search-suggest-selected');
                        scrollTop = elements[i - 1].offsetHeight + elements[i - 1].offsetTop;
                    } else if (e.keyCode === 40 && (i + 1) !== l) {
                        elements[i + 1].addClassName('flagrate-search-suggest-selected');
                        scrollTop = elements[i + 1].offsetHeight + elements[i + 1].offsetTop;
                    }

                    if (scrollTop !== -1) {
                        this._suggest.scrollTop = scrollTop + 4 - this._suggest.getHeight();
                    }

                    break;
                }
            }
        } else if (e.keyCode === 13) {
            setTimeout(this.search.bind(this), 100);
        }
    },

    _onKeyupHandler(e) {

        if (this._lastValue !== this.getValue()) {
            this._lastValue = this.getValue();

            this.suggest();
        }
    },

    _onFocusHandler(e) {

        setTimeout(this.suggest.bind(this), 100);
    },

    _onBlurHandler(e) {

        setTimeout(() => {
            if (document.activeElement !== this._suggest && this._suggest.visible() === true) {
                this._suggest.hide();
            }
        }, 100);
    }
};

function _createCompletionHandler(searchBox: SearchBox, value: string) {

    return () => {
        searchBox._input.setValue(value);
        searchBox._input.focus();
    };
}

function _createSuggestionHandler(searchBox: SearchBox, onSelect: () => void) {

    return () => {
        onSelect.call(searchBox);
        searchBox._input.blur();
    };
}