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

import { Element, FHTMLElement, FHTMLDivElement, FHTMLHeadingElement } from "./element";
import { Button } from "./button";

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
    text?: string;
    html?: string;
    element?: HTMLElement;
    content?: FHTMLDivElement;
    //href?: string;
    buttons?: ModalButtonOption[];
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

export interface ModalButton extends ModalButtonOption {
    _button?: Button;
}

export interface ModalButtonOption {
    key?: string;
    label?: string;
    icon?: string;
    color?: string;
    onSelect?(e?: Event, modal?: Modal): void;
    isFocused?: boolean;
    isDisabled?: boolean;
    className?: string;
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

    private _content: FHTMLDivElement;
    private _buttons: ModalButton[] = [];

    onBeforeClose: (modal?: Modal, e?: Event) => boolean;
    onClose: (modal?: Modal, e?: Event) => void;
    onShow: (modal?: Modal) => void;

    private _container: FHTMLDivElement;
    private _obi: FHTMLDivElement;

    private _modal: FHTMLDivElement;
    private _closeButton: Button;
    private _header: FHTMLElement;
    private _middle: FHTMLDivElement;
    private _footer: FHTMLElement;
    private _title: FHTMLHeadingElement;
    private _subtitle: FHTMLElement;

    private _positioningTimer: number;
    private _closingTimer: number;

    private _close = this.close.bind(this);
    private __onKeydownHandler = this._onKeydownHandler.bind(this);

    constructor(private _opt: Option = {}) {

        if (!_opt.target) {
            _opt.target = document.body;
        }
        if (!_opt.sizing) {
            _opt.sizing = "flex";
        }
        if (_opt.disableCloseButton === undefined) {
            _opt.disableCloseButton = false;
        }
        if (_opt.disableCloseByMask === undefined) {
            _opt.disableCloseByMask = false;
        }
        if (_opt.disableCloseByEsc === undefined) {
            _opt.disableCloseByEsc = false;
        }

        if (_opt["description"]) {
            // description has deprecated but no schedule to remove.
            this._opt.subtitle = _opt["description"];
        }

        if (_opt.buttons) {
            this._buttons = _opt.buttons;
        }

        if (_opt.onBeforeClose) {
            this.onBeforeClose = _opt.onBeforeClose;
        }
        if (_opt.onClose) {
            this.onClose = _opt.onClose;
        }
        if (_opt.onShow) {
            this.onShow = _opt.onShow;
        }

        if (this._buttons.length === 0) {
            this._buttons = [
                {
                    label: "OK",
                    color: "@primary",
                    onSelect: this._close,
                    isFocused: true
                }
            ];
        }

        this._create();
    }

    get buttons(): Button[] {
        return this.getButtons();
    }

    get id(): string {
        return this._container.id;
    }
    set id(id: string) {
        this._container.id = id;
    }

    get className(): string {
        return this._container.className;
    }
    set className(className: string) {
        this._container.className = className;
    }

    get content(): FHTMLDivElement {
        return this._content;
    }
    set content(div: FHTMLDivElement) {
        this.setContent(div);
    }

    get sizing(): Sizing {
        return this._opt.sizing;
    }
    set sizing(sizing: Sizing) {
        this.setSizing(sizing);
    }

    get element(): HTMLElement {
        return this._opt.element;
    }
    set element(element: HTMLElement) {
        this.setElement(element);
    }

    get html(): string {
        return this._opt.html;
    }
    set html(html: string) {
        this.setHTML(html);
    }

    get text(): string {
        return this._opt.text;
    }
    set text(text: string) {
        this.setText(text);
    }

    get title(): string {
        return this._opt.title;
    }
    set title(title: string) {
        this.setTitle(title);
    }

    get subtitle(): string {
        return this._opt.subtitle;
    }
    set subtitle(subtitle: string) {
        this.setSubtitle(subtitle);
    }

    setId(id: string): this {

        this._container.id = id;

        return this;
    }

    setClassName(className: string): this {

        this._container.className = className;

        return this;
    }

    setContent(div: FHTMLDivElement): this {

        this._opt.content = div;
        this._middle.update(div);

        return this;
    }

    setSizing(sizing: Sizing): this {

        this._container.removeClassName(`flagrate-sizing-${this._opt.sizing}`);
        this._container.addClassName(`flagrate-sizing-${sizing}`);

        this._opt.sizing = sizing;

        return this;
    }

    setElement(element: HTMLElement): this {

        this._opt.element = element;
        this._content.update(element);

        return this;
    }

    setHTML(html: string): this {

        this._opt.html = html;
        this._content.update(html);

        return this;
    }

    setText(text: string): this {

        this._opt.text = text;
        this._content.updateText(text);

        return this;
    }

    setTitle(title: string): this {

        this._opt.title = title;
        this._title.updateText(title);

        return this;
    }

    setSubtitle(subtitle: string): this {

        this._opt.subtitle = subtitle;
        this._subtitle.updateText(subtitle);

        return this;
    }

    visible(): boolean {
        return this._container.hasClassName("flagrate-modal-visible");
    }

    open(): this {

        if (this.visible() === true) {
            return this;
        }

        // make free
        if (document.activeElement && document.activeElement["blur"]) {
            (<HTMLElement>document.activeElement).blur();
        }
        window.getSelection().removeAllRanges();

        if (this._closingTimer) {
            clearTimeout(this._closingTimer);
        }

        Element.insert(this._opt.target, this._container);

        setTimeout(() => this._container.addClassName("flagrate-modal-visible"), 0);

        // Callback: onShow
        if (this.onShow) {
            this.onShow(this);
        }

        this._positioning();

        // focus to primary button
        if (this._buttons[0]) {
            this._buttons[0]._button.focus();
        }

        window.addEventListener("keydown", this.__onKeydownHandler, true);

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

        this._container.removeClassName("flagrate-modal-visible");

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

        window.removeEventListener("keydown", this.__onKeydownHandler, true);

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

    setButtons(buttons: ModalButtonOption[]): this {

        this._buttons = buttons;
        this._createButtons();

        return this;
    }

    private _create(): void {

        this._createBase();
        this._createModal();
        this._createButtons();
    }

    private _createBase(): void {

        this._container = new Element("div", {
            id: this._opt.id,
            "class": `flagrate flagrate-modal flagrate-sizing-${this._opt.sizing}`
        });

        if (this._opt.className) {
            this._container.addClassName(this._opt.className);
        }

        if (this._opt.target !== document.body) {
            this._container.style.position = "absolute";
        }

        this._obi = new Element().insertTo(this._container);

        if (this._opt.disableCloseByMask === false) {
            this._container.addEventListener("click", this._close);
        }
    }

    private _createModal(): void {

        this._modal = new Element().insertTo(this._obi);
        this._modal.addEventListener("click", e => e.stopPropagation());

        this._closeButton = new Button({
            label: "",
            onSelect: this._close
        });

        if (this._opt.disableCloseButton === false) {
            this._closeButton.insertTo(this._modal);
        }

        this._header = new Element("hgroup").insertTo(this._modal);
        this._title = new Element("h1").insertText(this._opt.title || "").insertTo(this._header);
        this._subtitle = new Element("small").insertText(this._opt.subtitle || "").insertTo(this._header);

        this._middle = new Element().insertTo(this._modal);

        if (this._opt.content) {
            this._middle.insert(this._opt.content);
        } else {
            this._content = new Element().insertTo(this._middle);

            if (this._opt.element) {
                this._content.insert(this._opt.element);
            } else if (this._opt.html) {
                this._content.insert(this._opt.html);
            } else if (this._opt.text) {
                this._content.insertText(this._opt.text);
            }
        }

        this._footer = new Element("footer").insertTo(this._modal);
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
                    } else if (button["onClick"]) {
                        console.warn("ModalButton#onClick is deprecated. Use ModalButton#onSelect instead.");
                        button["onClick"](e, this);// DEPRECATED
                    }
                }
            });

            // DEPRECATED, This is for backward compatibility.
            button._button["button"] = button;
            button["button"] = button._button;
            button["disable"] = button._button.disable.bind(button._button);
            button["enable"] = button._button.enable.bind(button._button);
            button["setColor"] = button._button.setColor.bind(button._button);

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

                if (this._opt.sizing === "flex") {
                    if (baseWidth - 20 <= modalWidth) {
                        this._modal.style.left = "0";
                        this._middle.style.width = baseWidth + "px";
                        this._middle.style.overflowX = "auto";
                    } else {
                        this._modal.style.left = Math.floor((baseWidth / 2) - (modalWidth / 2)) + "px";
                        this._middle.style.width = "";
                        this._middle.style.overflowX = "visible";
                    }

                    if (baseHeight - 20 <= modalHeight) {
                        this._obi.style.top = "10px";
                        this._obi.style.bottom = "10px";
                        this._obi.style.height = "";
                        this._middle.style.height = baseHeight - this._header.getHeight() - this._footer.getHeight() - 20 + "px";
                        this._middle.style.overflowY = "auto";
                    } else {
                        this._obi.style.top = (baseHeight / 2) - (modalHeight / 2) + "px";
                        this._obi.style.bottom = "";
                        this._obi.style.height = modalHeight + "px";
                        this._middle.style.height = "";
                        this._middle.style.overflowY = "visible";
                    }
                }

                if (this._opt.sizing === "full") {
                    this._modal.style.right = "10px";
                    this._modal.style.left = "10px";
                    this._middle.style.overflowX = "auto";

                    this._obi.style.top = "10px";
                    this._obi.style.bottom = "10px";
                    this._obi.style.height = "";
                    this._middle.style.height = baseHeight - this._header.getHeight() - this._footer.getHeight() - 20 + "px";
                    this._middle.style.overflowY = "auto";
                }
            };

            this._positioningTimer = setTimeout(update, 30);
        }

        this._positioningTimer = setTimeout(update, 0);
    }

    private _onKeydownHandler(e: KeyboardEvent) {

        const active = document.activeElement && document.activeElement.tagName;

        if (active !== "BODY" && active !== "DIV" && active !== "BUTTON") { return; }
        if (window.getSelection().toString() !== "") { return; }

        let activated = false;

        // TAB:9
        if (e.keyCode === 9 && active !== "BUTTON") {
            activated = true;
            if (this._closeButton) {
                this._closeButton.focus();
            } else if (this._buttons[0]) {
                this._buttons[0]._button.focus();
            }
        }

        // ENTER:13
        if (e.keyCode === 13 && this._buttons[0] && active !== "BUTTON") {
            activated = true;
            this._buttons[0]._button.click();
        }

        // ESC:27
        if (e.keyCode === 27 && this._opt.disableCloseByEsc === false) {
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