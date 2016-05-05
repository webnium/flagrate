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
import { Button } from './button';

/*?
    class flagrate.Modal
**/
// ref: Hypermodal/1.2 https://github.com/kanreisa/Hypermodal/blob/9470a7/hypermodal.css
export interface Option {
    /** default is `document.body`. */
    target?: HTMLElement;
    id?: string;
    className?: string;
    title?: string;
    subtitle?: string;
    description?: string;
    text?: string;
    html?: string;
    element?: HTMLElement;
    content?: FHTMLDivElement;
    //href?: string;
    buttons?: ModalButton[];
    /** default is `"flex"`. */
    sizing?: Sizing;
    onBeforeClose?(modal?: Modal, e?: Event): boolean;
    onClose?(modal?: Modal, e?: Event): void;
    onShow?(modal?: Modal): void;
    /** default is `false`. */
    disableCloseButton?: boolean;
    /** default is `false`. */
    disableCloseByMask?: boolean;
    /** default is `false`. */
    disableCloseByEsc?: boolean;
}

export type Sizing = "flex" | "full";

export interface ModalButton {
    key?: string;
    label?: string;
    icon?: string;
    color?: string;
    onSelect?(): void;
    isFocused?: boolean;
    isDisabled?: boolean;
    className?: string;

    _button?: Button;
}

/*?
    flagrate.createModal(option)
    new flagrate.Modal(option)
    - option (Object) - configuration for the modal.

    Create and initialize the modal.

    #### option

    * `target`                   (Element; default `document.body`):
    * `id`                       (String):
    * `className`                (String):
    * `title`                    (String):
    * `subtitle`                 (String):
    * `text`                     (String):
    * `html`                     (String):
    * `element`                  (Element):
    * `href`                     (String):
    * `buttons`                  (Array): of button object.
    * `sizing`                   (String;  default `"flex"`; `"flex"` | `"full"`):
    * `onBeforeClose`            (Function):
    * `onClose`                  (Function):
    * `onShow`                   (Function):
    * `disableCloseButton`       (Boolean; default `false`):
    * `disableCloseByMask`       (Boolean; default `false`):
    * `disableCloseByEsc`        (Boolean; default `false`):

    #### button

    * `key`                      (String):
    * `label`                    (String; required):
    * `icon`                     (String):
    * `color`                    (String):
    * `onSelect`                 (Function):
    * `isFocused`                (Boolean; default `false`):
    * `isDisabled`               (Boolean; default `false`):
    * `className`                (String):
**/
export class Modal {

    private _target: HTMLElement = document.body;
    private _id: string;
    private _className: string;

    private _title = '';
    private _subtitle = '';
    private _text: string;
    private _html: string;
    private _element: HTMLElement;
    private _content: FHTMLDivElement;
    //private _href: string;
    private _buttons: ModalButton[] = [];
    private _sizing: Sizing = 'flex';

    onBeforeClose: (modal?: Modal, e?: Event) => boolean;
    onClose: (modal?: Modal, e?: Event) => void;
    onShow: (modal?: Modal) => void;

    private _disableCloseButton = false;
    private _disableCloseByMask = false;
    private _disableCloseByEsc = false;

    private _container: FHTMLDivElement;
    private _obi: FHTMLDivElement;

    private _modal: FHTMLDivElement;
    private _closeButton: Button;
    private _header: FHTMLElement;
    private _middle: FHTMLDivElement;
    private _footer: FHTMLElement;

    private _positioningTimer: number;
    private _closingTimer: number;

    private _close = this.close.bind(this);
    private __onKeydownHandler = this._onKeydownHandler.bind(this);

    constructor(opt: Option = {}) {

        if (opt.target) {
            this._target = opt.target;
        }
        if (opt.id) {
            this._id = opt.id;
        }
        if (opt.className) {
            this._className = opt.className;
        }

        if (opt.title) {
            this._title = opt.title;
        }
        if (opt.subtitle || opt.description) {
            this._subtitle = opt.subtitle || opt.description;
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
        if (opt.content) {
            this._content = opt.content;
        }
        /* if (opt.href) {
            this._href = opt.href;
        } */
        if (opt.buttons) {
            this._buttons = opt.buttons;
        }

        if (opt.onBeforeClose) {
            this.onBeforeClose = opt.onBeforeClose;
        }
        if (opt.onClose) {
            this.onClose = opt.onClose;
        }
        if (opt.onShow) {
            this.onShow = opt.onShow;
        }

        if (opt.disableCloseButton !== undefined) {
            this._disableCloseButton = opt.disableCloseButton;
        }
        if (opt.disableCloseByMask !== undefined) {
            this._disableCloseByMask = opt.disableCloseByMask;
        }
        if (opt.disableCloseByEsc !== undefined) {
            this._disableCloseByEsc = opt.disableCloseByEsc;
        }

        if (this._buttons.length === 0) {
            this._buttons = [
                {
                    label: 'OK',
                    color: '@primary',
                    onSelect: this._close,
                    isFocused: true
                }
            ];
        }

        this._create();
    }

    get content(): FHTMLDivElement {
        return this._content;
    }

    visible(): boolean {
        return this._container.hasClassName('flagrate-modal-visible');
    }

    open(): this {

        if (this.visible() === true) {
            return this;
        }

        // make free
        if (document.activeElement && document.activeElement['blur']) {
            (<HTMLElement>document.activeElement).blur();
        }
        window.getSelection().removeAllRanges();

        if (this._closingTimer) {
            clearTimeout(this._closingTimer);
        }

        Element.insert(this._target, this._container);

        setTimeout(() => this._container.addClassName('flagrate-modal-visible'), 0);

        // Callback: onShow
        if (this.onShow) {
            this.onShow(this);
        }

        this._positioning();

        // focus to primary button
        if (this._buttons[0]) {
            this._buttons[0]._button.focus();
        }

        window.addEventListener('keydown', this.__onKeydownHandler, true);

        return this;
    }

    /** DEPRECATED */
    show(): this {
        return this.open();
    }

    /** DEPRECATED */
    render(): this {
        return this.open();
    }

    close(e?: Event): this {

        if (this.visible() === false) {
            return this;
        }

        this._container.removeClassName('flagrate-modal-visible');

        if (e) {
            e.stopPropagation();
            e.preventDefault();
        }

        // Callback: onBeforeClose
        if (this.onBeforeClose) {
            if (this.onBeforeClose(this, e) === false) {
                return this;//abort closing
            }
        }

        clearTimeout(this._positioningTimer);

        this._closingTimer = setTimeout(() => this._container.remove(), 1000);

        window.removeEventListener('keydown', this.__onKeydownHandler, true);

        // Callback: onClose
        if (this.onClose) {
            this.onClose(this, e);
        }

        return this;
    }

    getButtonByKey(key: string): Button {

        let result = null;

        const buttons = this._buttons;

        for (let i = 0; i < buttons.length; i++) {
            if (!buttons[i].key) { continue; }

            if (buttons[i].key === key) {
                result = buttons[i]._button;
                break;
            }
        }

        return result;
    }

    getButtons(): Button[] {
        return this._buttons.map(button => button._button);
    }

    private _create(): void {

        this._createBase();
        this._createModal();
        this._createButtons();
    }

    private _createBase(): void {

        this._container = new Element('div', {
            id: this._id,
            'class': `flagrate flagrate-modal flagrate-sizing-${this._sizing}`
        });

        if (this._className) {
            this._container.addClassName(this._className);
        }

        if (this._target !== document.body) {
            this._container.style.position = 'absolute';
        }

        this._obi = new Element().insertTo(this._container);

        if (this._disableCloseByMask === false) {
            this._container.addEventListener('click', this._close);
        }
    }

    private _createModal(): void {

        this._modal = new Element().insertTo(this._obi);
        this._modal.addEventListener('click', e => e.stopPropagation());

        this._closeButton = new Button({
            label: '',
            onSelect: this._close
        });

        if (this._disableCloseButton === false) {
            this._closeButton.insertTo(this._modal);
        }

        this._header = new Element('hgroup').insertTo(this._modal);
        new Element('h1').insertText(this._title).insertTo(this._header);
        new Element('small').insertText(this._subtitle).insertTo(this._header);

        this._middle = new Element().insertTo(this._modal);

        if (this._content) {
            this._middle.insert(this._content);
        } else {
            this._content = new Element().insertTo(this._middle);

            if (this._element) {
                this._content.insert(this._element);
            } else if (this._html) {
                this._content.insert(this._html);
            } else if (this._text) {
                this._content.insertText(this._text);
            }
        }

        this._footer = new Element('footer').insertTo(this._modal);
    }

    private _createButtons(): void {

        if (this._footer.hasChildNodes() === true) {
            this._footer.update();
        }

        this._buttons.forEach(button => {

            button._button = new Button({
                className: button.className,
                label: button.label,
                icon: button.icon,
                color: button.color,
                isFocused: button.isFocused || false,
                isDisabled: button.isDisabled,
                onSelect: e => {

                    if (button.onSelect) {
                        button.onSelect.call(e.targetButton, e, this);
                    } else if (button['onClick']) {
                        button['onClick'](e, this);// DEPRECATED
                    }
                }
            });

            // DEPRECATED
            button['disable'] = button._button.disable.bind(button._button);
            button['enable'] = button._button.enable.bind(button._button);
            button['setColor'] = button._button.setColor.bind(button._button);

            this._footer.insert(button._button);
        });
    }

    private _positioning(): void {

        let baseWidth = -1;
        let baseHeight = -1;
        let modalWidth = -1;
        let modalHeight = -1;

        const update = () => {

            if (
                baseWidth !== this._container.getWidth() ||
                baseHeight !== this._container.getHeight() ||
                modalWidth !== this._modal.getWidth() ||
                modalHeight !== this._modal.getHeight()
            ) {
                baseWidth = this._container.getWidth();
                baseHeight = this._container.getHeight();
                modalWidth = this._modal.getWidth();
                modalHeight = this._modal.getHeight();

                if (this._sizing === 'flex') {
                    if (baseWidth - 20 <= modalWidth) {
                        this._modal.style.left = '0';
                        this._content.style.width = baseWidth + 'px';
                        this._content.style.overflowX = 'auto';
                    } else {
                        this._modal.style.left = Math.floor((baseWidth / 2) - (modalWidth / 2)) + 'px';
                        this._content.style.width = '';
                        this._content.style.overflowX = 'visible';
                    }

                    if (baseHeight - 20 <= modalHeight) {
                        this._obi.style.top = '10px';
                        this._obi.style.bottom = '10px';
                        this._obi.style.height = '';
                        this._content.style.height = baseHeight - this._header.getHeight() - this._footer.getHeight() - 20 + 'px';
                        this._content.style.overflowY = 'auto';
                    } else {
                        this._obi.style.top = (baseHeight / 2) - (modalHeight / 2) + 'px';
                        this._obi.style.bottom = '';
                        this._obi.style.height = modalHeight + 'px';
                        this._content.style.height = '';
                        this._content.style.overflowY = 'visible';
                    }
                }

                if (this._sizing === 'full') {
                    this._modal.style.right = '10px';
                    this._modal.style.left = '10px';
                    this._content.style.overflowX = 'auto';

                    this._obi.style.top = '10px';
                    this._obi.style.bottom = '10px';
                    this._obi.style.height = '';
                    this._content.style.height = baseHeight - this._header.getHeight() - this._footer.getHeight() - 20 + 'px';
                    this._content.style.overflowY = 'auto';
                }
            };

            this._positioningTimer = setTimeout(update, 30);
        }

        this._positioningTimer = setTimeout(update, 0);
    }

    private _onKeydownHandler(e: KeyboardEvent) {

        const active = document.activeElement && document.activeElement.tagName;

        if (active !== 'BODY' && active !== 'DIV' && active !== 'BUTTON') { return; }
        if (window.getSelection().toString() !== '') { return; }

        let activated = false;

        // TAB:9
        if (e.keyCode === 9 && active !== 'BUTTON') {
            activated = true;
            if (this._closeButton) {
                this._closeButton.focus();
            } else if (this._buttons[0]) {
                this._buttons[0]._button.focus();
            }
        }

        // ENTER:13
        if (e.keyCode === 13 && this._buttons[0] && active !== 'BUTTON') {
            activated = true;
            this._buttons[0]._button.click();
        }

        // ESC:27
        if (e.keyCode === 27 && this._disableCloseByEsc === false) {
            activated = true;
            this.close();
        }

        if (activated === true) {
            e.stopPropagation();
            e.preventDefault();
        }
    }
}

export function createModal(option?: Option): Modal {
    return new Modal(option);
}