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

import { Element, FHTMLElement, FHTMLDivElement } from './element';

/*?
    class flagrate.Popover
**/
export interface Option {
    target?: HTMLElement;
    text?: string;
    html?: string;
    element?: HTMLElement;
    className?: string;
}

/*?
    flagrate.createPopover(option)
    new flagrate.Popover(option)
    - option (Object) - options.

    Popover.

    #### option

    * `target`    (Element):
    * `text`      (String):
    * `html`      (String):
    * `element`   (Element):
    * `className` (String):
**/
export class Popover {

    private _target: FHTMLElement;
    private _text: string;
    private _html: string;
    private _element: HTMLElement;
    private _className: string;

    private _div: FHTMLDivElement;
    private _positioningTimer: number;
    private _isShowing = false;

    private _openHandler = this.open.bind(this);
    private _closeHandler = this.close.bind(this);

    constructor(opt: Option = {}) {

        if (opt.target) {
            if (!opt.target['isFlagrated']) {
                opt.target = Element.extend(opt.target);
            }
            this._target = opt.target as FHTMLElement;
        }
        if (opt.text) {
            this._text = opt.text;
        }
        if (opt.html) {
            this._html = opt.html;
        }
        if (opt.element) {
            this._element = opt.element;
        }
        if (opt.className) {
            this._className = opt.className;
        }

        if (this._target) {
            this._target.addEventListener('mouseover', this._openHandler);
        }
    }

    get target(): FHTMLElement {
        return this._target;
    }

    set target(element: FHTMLElement) {
        this.setTarget(element);
    }

    get text(): string {
        return this._text;
    }

    set text(text: string) {
        this.setText(text);
    }

    get html(): string {
        return this._html;
    }

    set html(html: string) {
        this.setHTML(html);
    }

    get element(): HTMLElement {
        return this._element;
    }

    set element(element: HTMLElement) {
        this.setElement(element);
    }

    get className(): string {
        return this._className;
    }

    set className(className: string) {
        this.setClassName(className);
    }

    get isShowing(): boolean {
        return this._isShowing;
    }

    set isShowing(boolean: boolean) {

        if (boolean === true) {
            this.open();
        } else {
            this.close();
        }
    }

    open(forceTarget?: Event | HTMLElement): this {

        if (this._isShowing === true) {
            this.close();
        }

        let target = this._target || document.documentElement;

        if (forceTarget instanceof Event) {
            if (Element.isElement(forceTarget.target) === true) {
                target = forceTarget.target as HTMLElement;
            }

            document.body.addEventListener('click', this._closeHandler);
            document.body.addEventListener('mouseout', this._closeHandler);
            document.body.addEventListener('mouseup', this._closeHandler);
            window.addEventListener('scroll', this._closeHandler);
        } else if (Element.isElement(forceTarget) === true) {
            target = forceTarget;
        }

        const div = this._create();

        this._positioningTimer = setInterval(() => {

            if (Element.exists(target) === true) {
                _updatePosition(target, div);
            } else {
                this.close();
            }
        }, 10);

        this._div.on('click', e => e.stopPropagation());
        this._div.on('mouseup', e => e.stopPropagation());
        this._div.on('mousewheel', e => {
            e.stopPropagation();
            e.preventDefault();
        });

        _updatePosition(target, div);

        return this;
    }

    close(): this {

        clearInterval(this._positioningTimer);

        document.body.removeEventListener('click', this._closeHandler);
        document.body.removeEventListener('mouseup', this._closeHandler);
        document.body.removeEventListener('mouseout', this._closeHandler);
        window.removeEventListener('scroll', this._closeHandler);

        this._isShowing = false;

        const div = this._div;

        div.removeClassName('flagrate-popover-visible');

        setTimeout(() => {
            if (div && div.remove) {
                div.remove();
            }
        }, 1000);

        delete this._div;

        return this;
    }

    visible(): boolean {
        return this._isShowing && !!this._div.hasClassName('flagrate-popover-visible');
    }

    remove(): void {

        if (this._div) {
            this.close();
        }

        if (this._target) {
            this._target.removeEventListener('mouseover', this._openHandler);
        }
    }

    setTarget(element: FHTMLElement): this {

        if (this._target === element) {
            return this;
        }
        if (!element['isFlagrated']) {
            element = Element.extend(element);
        }
        this._target = element;

        if (this._isShowing === true) {
            this.open();
        }

        return this;
    }

    setText(text: string): this {

        if (this._text === text) {
            return this;
        }
        this._text = text;

        if (this._isShowing === true) {
            this._div.updateText(text);
        }

        return this;
    }

    setHTML(html: string): this {

        if (this._html === html) {
            return this;
        }
        this._html = html;

        if (this._isShowing === true) {
            this._div.update(html);
        }

        return this;
    }

    setElement(element: HTMLElement): this {

        if (this._element === element) {
            return this;
        }
        this._element = element;

        if (this._isShowing === true) {
            this._div.update(element);
        }

        return this;
    }

    setClassName(className: string): this {

        if (this._className === className) {
            return this;
        }

        if (this._isShowing === true) {
            this._div.removeClassName(this._className).addClassName(className);
        }

        this._className = className;

        return this;
    }

    private _create(): FHTMLDivElement {

        this._isShowing = true;

        const div = this._div = new Element('div', {
            'class': 'flagrate flagrate-popover'
        });

        if (this._className) {
            div.addClassName(this._className);
        }

        if (this._text) {
            div.updateText(this._text);
        }
        if (this._html) {
            div.update(this._html);
        }
        if (this._element) {
            div.update(this._element);
        }

        div.insertTo(document.body);

        setTimeout(() => div.addClassName('flagrate-popover-visible'), 0);

        return div;
    }
}

export function createPopover(option?: Option): Popover {
    return new Popover(option);
}

function _updatePosition(target: HTMLElement, div: FHTMLDivElement) {

    const tOffset = Element.cumulativeOffset(target);
    const tScroll = Element.cumulativeScrollOffset(target);
    const tWidth = Element.getWidth(target);
    const tHeight = Element.getHeight(target);
    const width = div.getWidth();
    const height = div.getHeight();

    let x = tOffset.left - tScroll.left + Math.round((tWidth / 2) - (width / 2));
    let y = tOffset.top - tScroll.top + tHeight;

    if (y + height > window.innerHeight) {
        y = window.innerHeight - y + tHeight;

        div.removeClassName('flagrate-popover-tail-top');
        div.addClassName('flagrate-popover-tail-bottom');
        div.style.top = '';
        div.style.bottom = `${y}px`;
    } else {
        div.removeClassName('flagrate-popover-tail-bottom');
        div.addClassName('flagrate-popover-tail-top');
        div.style.top = `${y}px`;
        div.style.bottom = '';
    }

    div.style.left = `${x}px`;
}