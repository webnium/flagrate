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
import { Element, Attribute, Property, FHTMLDivElement } from './element';
import { Button } from './button';

/*?
    class flagrate.Tab
**/
export interface Tab extends Instance, FHTMLDivElement { }

export interface Class {
    new (option?: Option): Tab;
    prototype: Instance;
}

export interface Instance {
    /** select the tab by key. */
    select(tabKey: string): this;
    /** select the tab by index. */
    select(tabIndex: number): this;
    /** select the tab by same object. */
    select(tabItem: TabItem): this;

    /** unshift the tab. */
    unshift(tabItem: TabItem): number;
    /** unshift the tabs. */
    unshift(tabItems: TabItem[]): number;

    /** push the tab. */
    push(tabItem: TabItem): number;
    /** push the tabs. */
    push(tabItems: TabItem[]): number;

    /** shift the tab(s). */
    shift(count?: number): TabItem | TabItem[];

    /** pop the tabs. */
    pop(count?: number): TabItem | TabItem[];

    /** Changes the content of a tabs, adding new tabs while removing old tab(s). */
    splice(index: number, howMany?: number, tabItems?: TabItem[]): TabItem[];
    /** Changes the content of a tabs, adding new tab while removing old tab(s). */
    splice(index: number, howMany?: number, tabItem?: TabItem): TabItem[];

    /** remove tab by key. */
    removeTab(tabKey: string): TabItem;
    /** remove tab by index. */
    removeTab(tabIndex: number): TabItem;
    /** remove tab by same object. */
    removeTab(tabItem: TabItem): TabItem;
    /** remove tabs by same objects */
    removeTab(tabItems: TabItem[]): TabItem[];

    /** get index by key. */
    indexOf(tabKey: string): number;
    /** get index by same object. */
    indexOf(tabItem: TabItem): number;

    tabs?: TabItem[];
    bodyless?: boolean;
    selectedIndex?: number;
    onSelect?(event?: TabEvent, tabItem?: TabItem): void;

    _tabs?: TabItem[];
    _bodyless?: boolean;
    _selectedIndex?: number;
    _head?: FHTMLDivElement;
    _body?: FHTMLDivElement;

    _create(): this;
    _render(): this;
    _createOnSelectHandler(tabItem: TabItem): (e: Event) => void;
}

export interface Option {
    id?: string;
    className?: string;
    attribute?: Attribute;
    style?: Property;
    tabs?: TabItemOption[];
    selectedIndex?: number;
    fill?: boolean;
    bodyless?: boolean;
    onSelect?(event?: TabEvent, tabItem?: TabItem): void;
}

export interface TabItem extends TabItemOption {
    _button?: Button;

}

export interface TabItemOption {
    key?: string;
    label?: string;
    icon?: string;
    text?: string;
    html?: string;
    element?: HTMLElement;
    onSelect?(event?: TabEvent, tabItem?: TabItem): void;
}

export interface TabEvent extends Event {
    targetTab?: Tab;
    targetTabItem?: TabItem;
}

/*?
    flagrate.createTab(option)
    new flagrate.Tab(option)
    - option (Object) - option.

    Create and initialize the tab.

    #### option

    * `id`            (String): `id` attribute of container.
    * `className`     (String):
    * `attribute`     (Object):
    * `style`         (Object): (using flagrate.Element.setStyle)
    * `tabs`          (Array): Array of **tab** object.
    * `selectedIndex` (Number):
    * `fill`          (Boolean; default `false`):
    * `bodyless`      (Boolean; default `false`):
    * `onSelect`      (Function): Triggered whenever select the tab.

    #### tab

    * `key`           (String):
    * `label`         (String):
    * `icon`          (String):
    * `text`          (String):
    * `html`          (String):
    * `element`       (Element):
    * `onSelect`      (Function):
**/
function FTab(opt: Option = {}) {

    const attr = opt.attribute || {};

    attr['id'] = opt.id;
    attr['class'] = 'flagrate flagrate-tab';

    if (opt.fill) {
        attr['class'] += ' flagrate-tab-fill';
    }

    // create
    const tab = new Element('div', attr) as Tab;
    extendObject(tab, this);

    if (opt.className) {
        tab.addClassName(opt.className);
    }
    if (opt.style) {
        tab.setStyle(opt.style);
    }

    tab._tabs = opt.tabs || [];
    tab._bodyless = opt.bodyless || false;
    tab._selectedIndex = opt.selectedIndex || 0;
    tab.onSelect = opt.onSelect || null;

    Object.defineProperties(tab, {
        tabs: {
            enumerable: true,
            get() { return tab._tabs; },
            set(tabs) {
                tab._tabs = tabs;
                tab._render();
            }
        },
        bodyless: {
            enumerable: true,
            get() { return tab._bodyless; },
            set(bodyless) {
                tab._bodyless = bodyless;
                tab.update()._create()._render();
            }
        },
        selectedIndex: {
            enumerable: true,
            get() { return tab._selectedIndex; },
            set(index) { tab.select(index); }
        }
    })

    tab._create()._render();

    if (tab.tabs.length > 0) {
        tab.select(tab.selectedIndex);
    }

    return tab;
}

export const Tab = FTab as any as Class;

export function createTab(option?: Option): Tab {
    return new Tab(option);
}

Tab.prototype = {
    select(a) {

        const tab = this as Tab;

        const index = (typeof a === 'number') ? a : tab.indexOf(a);

        if (index < 0 || index >= tab._tabs.length) {
            return tab;
        }

        if (0 <= tab._selectedIndex && tab._selectedIndex < tab._tabs.length && tab._tabs[tab._selectedIndex]._button) {
            tab._tabs[tab._selectedIndex]._button.removeClassName('flagrate-tab-selected');
        }

        tab._selectedIndex = index;

        const tabItem = tab._tabs[index];
        if (!tabItem || !tabItem._button) {
            return tab;
        }

        tabItem._button.addClassName('flagrate-tab-selected');

        if (tabItem.text) {
            tab._body.updateText(tabItem.text);
        }
        if (tabItem.html) {
            tab._body.update(tabItem.html);
        }
        if (tabItem.element) {
            tab._body.update(tabItem.element);
        }

        const tabEvent: TabEvent = window.event || {} as TabEvent;
        tabEvent.targetTab = tab;
        tabEvent.targetTabItem = tabItem;

        if (tabItem.onSelect) {
            tabItem.onSelect.call(tab, tabEvent, tabItem);
        }
        if (tab.onSelect) {
            tab.onSelect(tabEvent, tabItem);
        }

        return tab;
    },

    unshift(r) {

        const tab = this as Tab;

        if (r instanceof Array) {
            for (let i = 0, l = r.length; i < l; i++) {
                tab._tabs.unshift(r);
            }
        } else {
            tab._tabs.unshift(r);
        }

        tab._render();

        return tab._tabs.length;
    },

    push(r) {

        const tab = this as Tab;

        if (r instanceof Array) {
            for (let i = 0, l = r.length; i < l; i++) {
                tab._tabs.push(r);
            }
        } else {
            tab._tabs.push(r);
        }

        tab._render();

        return tab._tabs.length;
    },

    shift(c) {

        const tab = this as Tab;

        const count = c || 1;
        const removes = [];

        for (let i = 0, l = tab._tabs.length; i < l && i < count; i++) {
            removes.push(tab._tabs.shift());
        }

        tab._render();

        return !c ? removes[0] : removes;
    },

    pop(c) {

        const tab = this as Tab;

        const count = c || 1;
        const removes = [];

        for (let i = 0, l = tab._tabs.length; i < l && i < count; i++) {
            removes.push(tab._tabs.pop());
        }

        tab._render();

        return !c ? removes[0] : removes;
    },

    splice(index, c, t) {

        const tab = this as Tab;

        c = typeof c === 'undefined' ? this._tabs.length - index : c;

        const removes = tab._tabs.splice(index, c);

        if (t) {
            if (t instanceof Array === false) {
                t = [t];
            }

            for (let i = 0, l = t.length; i < l; i++) {
                tab._tabs.splice(index + i, 0, t[i]);
            }
        }

        tab._render();

        return removes;
    },

    removeTab(a) {

        const tab = this as Tab;

        const removes = [];
        let bulk = false;

        if (a instanceof Array === false) {
            bulk = true;
            a = [a];
        }

        for (let i = 0, l = a.length; i < l; i++) {
            const index = (typeof a[i] === 'number') ? a[i] : tab.indexOf(a[i]);
            if (index !== -1) {
                removes.push(tab.splice(index, 1));
            }
        }

        return bulk ? removes : removes[0];
    },

    indexOf(a) {

        const tab = this as Tab;

        if (typeof a === 'string') {
            let index = -1;

            for (let i = 0, l = tab._tabs.length; i < l; i++) {
                if (tab._tabs[i].key === a) {
                    index = i;
                    break;
                }
            }

            return index;
        } else {
            return tab._tabs.indexOf(a);
        }
    },

    _create() {

        const tab = this as Tab;

        tab._head = new Element('div', { 'class': 'flagrate-tab-head' }).insertTo(tab);

        if (tab._bodyless === true) {
            tab._body = new Element();
        } else {
            tab._body = new Element('div', { 'class': 'flagrate-tab-body' }).insertTo(tab);
        }

        return tab;
    },

    _render() {

        const tab = this as Tab;

        tab._head.update();

        tab._tabs.forEach(tabItem => {

            if (!tabItem._button) {
                tabItem._button = new Button({
                    icon: tabItem.icon,
                    label: tabItem.label,
                    onSelect: tab._createOnSelectHandler(tabItem)
                });
            }

            tabItem._button.insertTo(tab._head);
        });

        return tab;
    },

    _createOnSelectHandler(tabItem) {

        const tab = this as Tab;

        return (e) => {

            if (/firefox/i.test(navigator.userAgent) === true) {
                window.event = e;
            }

            tab.select(tabItem);
        };
    }
};