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

import { extendObject, emptyFunction } from "./util";
import { Element, Attribute, Property, FHTMLSpanElement, FHTMLButtonElement } from "./element";

/*?
    class flagrate.Button

    #### Example

        var button = flagrate.createButton({
            label   : "foo",
            icon    : "icon.png",
            onSelect: function () {
                alert("hey");
            }
        }).insertTo(x);

    #### Structure

        <button class="flagrate flagrate-button flagrate-icon" style="background-image: url(icon.png);">foo</button>

    #### Events

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

export interface Instance {
    select(): this;
    disable(): this;
    enable(): this;
    isEnabled(): boolean;
    setLabel(label: string): this;
    setColor(color?: string): this;
    getColor(): string;
    setIcon(url?: string): this;
    getIcon(): string;

    onSelect?(event?: ButtonEvent, button?: this): void;
    onRemove?(event?: ButtonEvent, button?: this): void;

    _label?: FHTMLSpanElement;
    _removeButton?: FHTMLButtonElement;
    _color?: string;
    _iconIdentifier?: string;
    _onSelectHandler(event: MouseEvent): void;
    _onRemoveHandler(event: MouseEvent): void;
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

    onSelect?(event?: ButtonEvent, button?: Button): void;
    onRemove?(event?: ButtonEvent, button?: Button): void;
}

export interface ButtonEvent extends MouseEvent {
    targetButton?: Button;
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

    option.label = option.label || "";
    option.isRemovableByUser = option.isRemovableByUser || false;

    this.onSelect = option.onSelect || emptyFunction;
    this.onRemove = option.onRemove || emptyFunction;

    const attr = option.attribute || {};

    if (option.id) {
        attr["id"] = option.id;
    }
    if (option.isFocused) {
        attr["autofocus"] = true;
    }

    if (!attr["type"]) {
        attr["type"] = "button";
    }

    // create a button element
    const button = new Element("button", attr) as Button;
    extendObject(button, this);

    button._label = new Element("span").updateText(option.label).insertTo(button);

    button.addClassName("flagrate flagrate-button");
    if (option.className) {
        button.addClassName(option.className);
    }

    button.addEventListener("click", button._onSelectHandler.bind(button), true);

    if (option.isRemovableByUser) {
        button.addClassName("flagrate-button-removable");

        button._removeButton = new Element("button", {
            type: "button",
            class: "flagrate-button-remove"
        }).insertTo(button);
        button._removeButton.addEventListener("click", button._onRemoveHandler.bind(button), true);
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
}

export const Button = FButton as any as Class;

export function createButton(option?: Option): Button {
    return new Button(option);
}

Button.prototype = {
    select() {
        return this._onSelectHandler(null);
    },

    disable() {

        this.addClassName("flagrate-disabled");
        this.writeAttribute("disabled", true);

        return this;
    },

    enable() {

        this.removeClassName("flagrate-disabled");
        this.writeAttribute("disabled", false);

        return this;
    },

    isEnabled() {
        return !this.hasClassName("flagrate-disabled");
    },

    setLabel(text) {

        this._label.updateText(text);

        return this;
    },

    setColor(color) {

        const button = this as Button;

        if (color.charAt(0) === "@") {
            button.style.backgroundColor = "";
            button.style.color = "";
            button.addClassName("flagrate-button-color-" + color.slice(1));
        } else {
            button.style.backgroundColor = color;

            if (/^#[0-9a-f]{6}$/i.test(color) === true) {
                const c = parseInt(color.slice(1), 16);
                if ((((c >> 16) + (c >> 8 & 0xff) + (c & 0xff)) / 3) > 150) {
                    button.style.color = "black";
                } else {
                    button.style.color = "white";
                }
            } else {
                button.style.color = "";
            }
        }

        button._color = color;

        return button;
    },

    getColor() {
        return this._color || "";
    },

    setIcon(identifier) {

        const button = this as Button;

        button._iconIdentifier = identifier;

        if (identifier) {
            return button.addClassName("flagrate-icon").setStyle({
                backgroundImage: `url(${identifier})`
            });
        } else {
            return button.removeClassName("flagrate-icon").setStyle({
                backgroundImage: "none"
            });
        }
    },

    getIcon() {
        return this._iconIdentifier || "";
    },

    _onSelectHandler(e) {

        const button = this as Button;

        if (button.isEnabled() === false) {
            return;
        }

        // for Firefox <- until when..?
        if (button._removeButton && e && e.layerX) {
            const bw = button.getWidth();
            const bh = button.getHeight();
            const bp = button._removeButton.getStyle("margin-right") === null ? 0 : parseInt(button._removeButton.getStyle("margin-right").replace("px", ""), 10);
            const rw = button._removeButton.getWidth();
            const rh = button._removeButton.getHeight();
            const lx = e.layerX;
            const ly = e.layerY;

            const isHitRemoveButton = (
                lx > bw - bp - rw &&
                lx < bw - bp &&
                ly > bh - ((bh - rh) / 2) - rh &&
                ly < bh - ((bh - rh) / 2)
            );
            if (isHitRemoveButton) {
                button._onRemoveHandler(e);

                return button;
            }
        }

        const _e: ButtonEvent = e;
        _e.targetButton = button;

        button.onSelect(_e, button);
        button.fire("select", { targetButton: button });
    },

    _onRemoveHandler(e) {

        const button = this as Button;

        if (button.isEnabled() === true) {
            button.remove();

            const _e: ButtonEvent = e;
            _e.targetButton = button;

            button.onRemove(_e, button);
            button.fire("remove", { targetButton: button });
        }
    }
};