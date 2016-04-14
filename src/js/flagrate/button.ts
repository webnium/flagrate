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

import { Element, FHTMLSpanElement, FHTMLButtonElement } from './element';
import { extendObject, emptyFunction } from './util';

/*?
    class flagrate.Button

    #### Example

        var button = flagrate.createButton({
            label   : 'foo',
            icon    : 'icon.png',
            onSelect: function () {
                alert('hey');
            }
        }).insertTo(x);

    #### Structure

        <button class="flagrate flagrate-button flagrate-icon" style="background-image: url(icon.png);">foo</button>

    #### Event

    * `select`:
    * `remove`:

    #### Inheritances

    * flagrate.Element
    * [HTMLButtonElement](https://developer.mozilla.org/en-US/docs/Web/API/HTMLButtonElement) (MDN)
**/
export interface Button extends Instance, FHTMLButtonElement { }

export interface Class {
    new (option?: Option): Button;
    prototype: Instance;
}

export interface createButton {
    (option?: Option): Button;
}

export interface Instance {
    select(): Button;
    disable(): Button;
    enable(): Button;
    isEnabled(): boolean;
    setLabel(label: string): Button;
    setColor(color?: string): Button;
    getColor(): string;
    setIcon(url?: string): Button;
    getIcon(): string;

    _label?: FHTMLSpanElement;
    _removeButton?: FHTMLButtonElement;
    _onSelectHandler(event: any): void;
    _onRemoveHandler(event: any): void;
}

export interface Option {
    /** id attribute. */
    id?: string;

    /** class attribute. */
    className?: string;

    /** attribute/value pairs properties. */
    attribute?: any;

    /** CSS style properties (uses flagrate.Element.setStyle). */
    style?: any;

    /** Color (uses flagrate.Button#setColor). */
    color?: string;

    /** Label text. */
    label?: string;

    /** icon image URL. */
    icon?: string;

    /** default is false. */
    isFocused?: boolean;

    /** default is false. */
    isDisabled?: boolean;

    /** default is false. */
    isRemovableByUser?: boolean;

    onSelect? (event?: any, button?: Button): void;
    onRemove? (event?: any, button?: Button): void;
}

/*?
    flagrate.createButton(option)
    new flagrate.Button(option)
    - option (Object) - options.

    Button.

    #### option

    * `id`                       (String): `id` attribute of `button` element.
    * `className`                (String):
    * `attribute`                (Object):
    * `style`                    (Object): (using flagrate.Element.setStyle)
    * `color`                    (String): (using flagrate.Button#setColor)
    * `label`                    (String; default `""`):
    * `icon`                     (String):
    * `isFocused`                (Boolean; default `false`):
    * `isDisabled`               (Boolean; default `false`):
    * `isRemovableByUser`        (Boolean; default `false`):
    * `onSelect`                 (Function):
    * `onRemove`                 (Function):
**/
function FButton(option: Option = {}) {

    option.label = option.label || '';
    option.isRemovableByUser = option.isRemovableByUser || false;

    this.onSelect = option.onSelect || emptyFunction;
    this.onRemove = option.onRemove || emptyFunction;

    const attr = option.attribute || {};

    if (option.id) {
        attr.id = option.id;
    }
    if (option.isFocused) {
        attr.autofocus = true;
    }

    if (!attr.type) {
        attr.type = 'button';
    }

    // create a button element
    const button = new Element('button', attr) as Button;
    extendObject(button, this);

    button._label = new Element('span').updateText(option.label).insertTo(button);

    button.addClassName('flagrate flagrate-button');
    if (option.className) {
        button.addClassName(option.className);
    }

    button.on('click', button._onSelectHandler.bind(button), true);

    if (option.isRemovableByUser) {
        button.addClassName('flagrate-button-removable');

        button._removeButton = new Element('button', {
            type: 'button',
            class: 'flagrate-button-remove'
        }).insertTo(button);
        button._removeButton.on('click', button._onRemoveHandler.bind(button), true);
    }

    if (option.style) {
        button.setStyle(option.style);
    }
    if (option.color) {
        button.setColor(option.color);
    }
    if (option.icon) {
        button.setIcon(option.icon);
    }

    if (option.isDisabled) {
        button.disable();
    }

    return button;
};

export const Button = FButton as any as Class;

export const createButton: createButton = (option?: Option) => {
    return new Button(option);
}

Button.prototype = {
    select () {
        return this._onSelectHandler(null);
    },

    disable () {

        this.addClassName('flagrate-disabled');
        this.writeAttribute('disabled', true);

        return this;
    },

    enable () {

        this.removeClassName('flagrate-disabled');
        this.writeAttribute('disabled', false);

        return this;
    },

    isEnabled () {
        return !this.hasClassName('flagrate-disabled');
    },

    setLabel (text) {

        this._label.updateText(text);

        return this;
    },

    setColor (color) {

        if (color.charAt(0) === '@') {
            this.style.backgroundColor = '';
            this.addClassName('flagrate-button-color-' + color.slice(1));
        } else {
            this.style.backgroundColor = color;
        }

        this._color = color;

        return this;
    },

    getColor () {
        return this._color || '';
    },

    setIcon (identifier) {

        this._iconIdentifier = identifier;

        if (identifier) {
            return this.addClassName('flagrate-icon').setStyle({
                backgroundImage: 'url(' + identifier + ')'
            });
        } else {
            return this.removeClassName('flagrate-icon').setStyle({
                backgroundImage: 'none'
            });
        }
    },

    getIcon () {
        return this._iconIdentifier || '';
    },

    _onSelectHandler (e) {

        if (this.isEnabled() === false) {
            return;
        }

        // for Firefox <- until when..?
        if (this._removeButton && e && e.layerX) {
            var bw = this.getWidth();
            var bh = this.getHeight();
            var bp = this._removeButton.getStyle('margin-right') === null ? 0 : parseInt(this._removeButton.getStyle('margin-right').replace('px', ''), 10);
            var rw = this._removeButton.getWidth();
            var rh = this._removeButton.getHeight();
            var lx = e.layerX;
            var ly = e.layerY;

            var isHitRemoveButton = (
                lx > bw - bp - rw &&
                lx < bw - bp &&
                ly > bh - ((bh - rh) / 2) - rh &&
                ly < bh - ((bh - rh) / 2)
            );
            if (isHitRemoveButton) {
                this._onRemoveHandler(e);

                return this;
            }
        }

        e.targetButton = this;

        this.onSelect(e, this);
        this.fire('select', { targetButton: this });
    },

    _onRemoveHandler (e) {

        if (this.isEnabled() && this.remove()) {
            this.onRemove(e);
        }
    }
};