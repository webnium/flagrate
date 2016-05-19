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
import { Element, Attribute, Property, FHTMLDivElement }  from "./element";
import { Button, ButtonEvent }  from "./button";
import { Menu, ItemOption }  from "./menu";

/*?
    class flagrate.Pulldown

    #### Example

        var menu = flagrate.createPulldown({
            label: "foo",
            items: [
                {
                    label: "bar"
                }
            ]
        }).insertTo(x);

    #### Structure

        <button class="flagrate flagrate-button flagrate-pulldown">
            "foo"
            <span class="flagrate-pulldown-triangle"></span>
        </button>
        <div class="flagrate-pulldown-menu flagrate flagrate-menu">
            <button class="flagrate flagrate-button">bar</button>
        </div>

    menu `div` are created with flagrate.Menu

    #### Events

    * `select`:
    * `open`:
    * `close`:

    #### Inheritances

    * flagrate.Element
    * flagrate.Button
    * flagrate.Menu
**/
export interface Pulldown extends Instance, Button { }

export interface Class {
    new (option?: Option): Pulldown;
    prototype: Instance;
}

export interface Instance {
    items?: ItemOption[];

    open(event?: any): this;
    close(event?: any): this;

    onOpen?(event?: ButtonEvent, button?: this): void;
    onClose?(event?: ButtonEvent, button?: this): void;

    _menu?: FHTMLDivElement;
    _open?: boolean;
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
    isDisabled?: boolean;

    /** Button items */
    items?: ItemOption[];

    onSelect?(event?: ButtonEvent, button?: Pulldown): void;
    onOpen?(event?: any, button?: Pulldown): void;
    onClose?(event?: any, button?: Pulldown): void;
}

/*?
    flagrate.createPulldown(option)
    new flagrate.Pulldown(option)
    - option (Object) - options.

    Pulldown.

    #### option

    * `id`                       (String): `id` attribute of `button` element.
    * `className`                (String):
    * `attribute`                (Object):
    * `style`                    (Object): (using flagrate.Element.setStyle)
    * `items`                    (Array): of item (see: flagrate.Menu)
    * `isDisabled`               (Boolean; default `false`):
    * `onSelect`                 (Function):
    * `onOpen`                   (Function):
    * `onClose`                  (Function):
**/
function FPulldown(option: Option = {}) {

    option.label = option.label || "";

    this.items = option.items || [];

    this.onOpen = option.onOpen || emptyFunction;
    this.onClose = option.onClose || emptyFunction;

    const attr = option.attribute || {};
    if (option.id) {
        attr["id"] = option.id;
    }

    //create
    const pulldown = <Pulldown>new Button({
        attribute: attr,
        label: option.label,
        icon: option.icon,
        onSelect: option.onSelect
    });

    extendObject(pulldown, this);

    pulldown.addEventListener("select", pulldown.open.bind(pulldown));

    pulldown.addClassName("flagrate-pulldown");
    if (option.className) {
        pulldown.addClassName(option.className);
    }

    new Element("span", { "class": "flagrate-pulldown-triangle" }).insertTo(pulldown);

    if (option.style) {
        pulldown.setStyle(option.style);
    }
    if (option.color) {
        pulldown.setColor(option.color);
    }

    if (option.isDisabled) {
        pulldown.disable();
    }

    return pulldown;
}

export const Pulldown = FPulldown as any as Class;

export function createPulldown(option?: Option): Pulldown {
    return new Pulldown(option);
}

Pulldown.prototype = {
    open(e) {

        const pulldown = this as Pulldown;

        if (pulldown._open === true || !!pulldown._menu) {
            pulldown.close();
            return;
        }

        pulldown._open = true;

        pulldown._menu = new Element("div", {"class": "flagrate-pulldown-menu"})
            .insert(
                new Menu({
                    items: pulldown.items,
                    onSelect: (e) => {

                        if (pulldown.onSelect) {
                            pulldown.onSelect(e, pulldown);
                        }

                        pulldown.fire("select", { targetPulldown: pulldown });
                    }
                })
            );

        pulldown._menu.style.top = `${pulldown.offsetTop + pulldown.getHeight()}px`;
        pulldown._menu.style.left = `${pulldown.offsetLeft}px`;

        pulldown.insert({ after: pulldown._menu });

        // To prevent overflow.
        let menuHeight = pulldown._menu.getHeight();
        let menuMargin = parseInt(pulldown._menu.getStyle("margin-top").replace("px", ""), 10);
        let cummOffsetTop = pulldown.cumulativeOffset().top;
        let upsideSpace = - window.pageYOffset + cummOffsetTop;
        let downsideSpace = window.pageYOffset + window.innerHeight - cummOffsetTop - pulldown.getHeight();
        if (menuHeight + menuMargin > downsideSpace) {
            if (upsideSpace > downsideSpace) {
                if (upsideSpace < menuHeight + menuMargin) {
                    menuHeight = (upsideSpace - menuMargin - menuMargin);
                    pulldown._menu.style.maxHeight = `${menuHeight}px`;
                }
                pulldown._menu.style.top = `${(pulldown.offsetTop - menuHeight - (menuMargin * 2))}px`;
            } else {
                menuHeight = (downsideSpace - menuMargin - menuMargin);
                pulldown._menu.style.maxHeight = `${menuHeight}px`;
            }
        }

        const close = (e: Event) => {

            document.body.removeEventListener("click", close);
            if (pulldown.parentNode) {
                pulldown.parentNode.removeEventListener("click", close);
            }
            pulldown.removeEventListener("select", close);

            pulldown.close(e);
        };

        setTimeout(() => {
            document.body.addEventListener("click", close);
            if (pulldown.parentNode) {
                pulldown.parentNode.addEventListener("click", close);
            }
            pulldown.addEventListener("select", close);
        }, 0);

        pulldown.onOpen.call(pulldown, e, pulldown);
        pulldown.fire("open", { targetPulldown: pulldown });

        return this;
    },

    close(e) {

        const pulldown = this as Pulldown;

        if (pulldown._open === false || !pulldown._menu) {
            return;
        }

        pulldown._open = false;

        pulldown._menu.style.opacity = "0";

        setTimeout(() => {

            if (!pulldown._menu) {
                return;
            }

            pulldown._menu.remove();
            delete pulldown._menu;

            pulldown.onClose(e, pulldown);
            pulldown.fire("close", { targetPulldown: pulldown });
        }, 250);

        return this;
    }
};