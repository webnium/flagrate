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

import { Menu, ItemOption } from './menu';

/*?
    class flagrate.ContextMenu
**/
export interface Option {
    /** target element */
    target?: HTMLElement;

    /** Button items */
    items?: ItemOption[];
}

/*?
    flagrate.createContextMenu(option)
    new flagrate.ContextMenu(option)
    - option (Object) - options.

    ContextMenu.

    #### option

    * `target`                   (Element):
    * `items`                    (Array): of item (see: flagrate.Menu)
**/
export class ContextMenu {

    items: ItemOption[];

    private _target: HTMLElement;
    private _isShowing: boolean;
    private _menu: Menu;

    private _openHandler = this.open.bind(this);
    private _closeHandler = this.close.bind(this);

    constructor(option: Option = {}) {

        this.items = option.items || [];

        this._isShowing = false;

        this.setTarget(option.target || document.body);
    }

    setTarget(target: HTMLElement): this {

        if (this._target) {
            this._target.removeEventListener('contextmenu', this._openHandler);
        }

        target.addEventListener('contextmenu', this._openHandler);

        this._target = target;

        return this;
    }

    open(e?: MouseEvent): this {

        if (e && e.preventDefault) {
            e.preventDefault();
        }

        if (this._isShowing === true) {
            this.close();
        }

        this._isShowing = true;

        this._menu = new Menu({
            className: 'flagrate-context-menu',
            items: this.items,
            onSelect: this._closeHandler
        });

        let x = 0;
        let y = 0;
        if (e && e.clientX && e.clientY) {
            x = e.clientX;
            y = e.clientY;
        }

        this._menu.style.opacity = '0';

        this._menu.insertTo(document.body);

        if (x + this._menu.getWidth() > window.innerWidth) {
            x = x - this._menu.getWidth();
        }

        if (y + this._menu.getHeight() > window.innerHeight) {
            y = y - this._menu.getHeight();
        }

        this._menu.style.top = `${ y }px`;
        this._menu.style.left = `${ x }px`;
        this._menu.style.opacity = '1';

        document.body.addEventListener('click', this._closeHandler);
        document.body.addEventListener('mouseup', this._closeHandler);
        document.body.addEventListener('mousewheel', this._closeHandler);

        return this;
    }

    close(): this {

        document.body.removeEventListener('click', this._closeHandler);
        document.body.removeEventListener('mouseup', this._closeHandler);
        document.body.removeEventListener('mousewheel', this._closeHandler);

        this._isShowing = false;

        const menu = this._menu;
        setTimeout(() => {
            if (menu && menu.remove) {
                menu.remove();
            }
        }, 0);

        delete this._menu;

        return this;
    }

    /** Tells whether the visibility. */
    visible(): boolean {
        return this._isShowing;
    }

    /** remove the elements and listeners. */
    remove(): void {

        if (this._menu) {
            this.close()
        }

        if (this._target) {
            this._target.removeEventListener('contextmenu', this._openHandler);
        }
    }
}

export function createContextMenu(option?: Option): ContextMenu {
    return new ContextMenu(option);
}