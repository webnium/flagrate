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
import { Element, Attribute, Property, FHTMLElement, FHTMLDivElement } from "./element";

/*?
    class flagrate.Toolbar
**/
export interface Toolbar extends Instance, FHTMLDivElement { }

export interface Class {
    new (option?: Option): Toolbar;
    prototype: Instance;
}

export interface Instance {
    push(item: ItemOption): this;
    getElementByKey(key: string): FHTMLElement;
    getElements(): FHTMLElement[];
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

    /** items */
    items?: ItemOption[];
}

export interface ItemOption {
    /** key */
    key?: string;

    /** element */
    element?: FHTMLElement;

    /** if this true ignores element option */
    isBorder?: boolean;
}

/*?
    flagrate.createToolbar(option)
    new flagrate.Toolbar(option)
    - option (Object) - options.

    Toolbar.

    #### option

    * `id`                       (String): `id` attribute of container element.
    * `className`                (String):
    * `attribute`                (Object):
    * `style`                    (Object): (using flagrate.Element.setStyle)
    * `items`                    (Array): of item or String to create border, Element to insert any element.

    #### item

    * `key`                      (String):
    * `element`                  (Element):
**/
function FToolbar(option: Option = {}): Toolbar {

    const items = option.items || [];
    const attr = option.attribute || {};

    if (option.id) {
        attr["id"] = option.id;
    }

    //create
    const container = new Element("div", attr) as Toolbar;
    extendObject(container, this);

    container.addClassName("flagrate flagrate-toolbar");
    if (option.className) {
        container.addClassName(option.className);
    }

    if (option.style) {
        container.setStyle(option.style);
    }

    for (let i = 0, l = items.length; i < l; i++) {
        container.push(items[i]);
    }

    return container;
}

export const Toolbar = FToolbar as any as Class;

export function createToolbar(option?: Option): Toolbar {
    return new Toolbar(option);
}

Toolbar.prototype = {
    push(option: ItemOption) {

        if (typeof option === "string") {
            new Element("hr").insertTo(this);
        } else if (option instanceof HTMLElement) {
            this.insert(option);
        } else {
            let element;

            if (option.isBorder) {
                element = new Element("hr").insertTo(this);
            } else {
                if (!option.element.isFlagrated) {
                    option.element = Element.extend(option.element);
                }
                element = Element.insertTo(option.element, this);
            }

            if (option.key) {
                element.dataset["_key"] = option.key;
            }
        }

        return this;
    },

    getElementByKey(key: string) {

        const elements = this.childNodes;
        for (let i = 0, l = elements.length; i < l; i++) {
            if (elements[i].dataset["_key"] === key) {
                return elements[i];
            }
        }

        return null;
    },

    getElements() {
        return this.childNodes || [];
    }
};