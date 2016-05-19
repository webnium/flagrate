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

import { Element, FHTMLElement, FHTMLDivElement } from "./element";

/*?
    class flagrate.Notify

    The flagrate.Notify object provides a notification UI.
    also, supports **Desktop Notifications**.

    #### Example

        // create and initialize a Notify instance
        var notify = flagrate.createNotify({
            title: "Somehow Web App"
        });

        // create notify
        notify.create({ text: "Hello" });

        setTimeout(function () {
        notify.create({
            text   : "Hey, are you awake?",
            onClick: function () {
                notify.create({ text: "Aaaah" });
            }
        });
        }, 1000 * 30);

    #### Related

    * [Web Notifications](http://www.w3.org/TR/notifications/) (W3C)
**/
// ref: Hypernotifier/1.0 https://github.com/kanreisa/Hypernotifier/blob/792fa7/hypernotifier.js
export interface Option {
    /** default is `document.body` */
    target?: HTMLElement;
    /** additional className for Notify. */
    className?: string;
    /** default is `false`. */
    disableDesktopNotify?: boolean;
    /** default is `false`. */
    disableFocusDetection?: boolean;
    /** default is `"right"`. */
    hAlign?: HorizontalAlign;
    /** default is `"bottom"`. */
    vAlign?: VerticalAlign;
    /** default is `10`. */
    hMargin?: number;
    /** default is `10`. */
    vMargin?: number;
    /** default is `10`. */
    spacing?: number;
    /** default is `5`. */
    timeout?: number;
    /** default is `"Notify"`. */
    title?: string;
}

export interface CreateOption {
    title?: string;
    message?: string;
    body?: string;//deprecated
    content?: string;//deprecated
    text?: string;//deprecated
    icon?: string;
    onClick?(): void;
    onClose?(): void;
    timeout?: number;
}

export type HorizontalAlign = "right" | "left";
export type VerticalAlign = "top" | "bottom";

/*?
    flagrate.createNotify(option)
    new flagrate.Notify(option)
    - option (Object) - configuration for the notifications.

    Initialize the notifications.

    #### option

    * `target`                (Element; default `document.body`):
    * `className`             (String):
    * `disableDesktopNotify`  (Boolean; default `false`):
    * `disableFocusDetection` (Boolean; default `false`):
    * `hAlign`                (String;  default `"right"`; `"right"` | `"left"`):
    * `vAlign`                (String;  default `"bottom"`; `"top"` | `"bottom"`):
    * `hMargin`               (Number;  default `10`):
    * `vMargin`               (Number;  default `10`):
    * `spacing`               (Number;  default `10`):
    * `timeout`               (Number;  default `5`):
    * `title`                 (String;  default `"Notify"`):
**/
export class Notify {

    target: HTMLElement = document.body;
    className: string;
    disableDesktopNotify = false;
    disableFocusDetection = false;
    hAlign: HorizontalAlign = "right";
    vAlign: VerticalAlign = "bottom";
    hMargin = 10;//pixels
    vMargin = 10;//pixels
    spacing = 10;//pixels
    timeout = 5;//seconds
    title = "Notify";

    private _notifies: FHTMLDivElement[] = [];

    constructor(opt: Option = {}) {

        if (opt.target) {
            this.target = opt.target;
        }
        if (opt.className) {
            this.className = opt.className;
        }
        if (opt.disableDesktopNotify) {
            this.disableDesktopNotify = opt.disableDesktopNotify;
        }
        if (opt.disableFocusDetection) {
            this.disableFocusDetection = opt.disableFocusDetection;
        }
        if (opt.hAlign) {
            this.hAlign = opt.hAlign;
        }
        if (opt.vAlign) {
            this.vAlign = opt.vAlign;
        }
        if (opt.hMargin) {
            this.hMargin = opt.hMargin;
        }
        if (opt.vMargin) {
            this.vMargin = opt.vMargin;
        }
        if (opt.spacing) {
            this.spacing = opt.spacing;
        }
        if (opt.timeout) {
            this.timeout = opt.timeout;
        }
        if (opt.title) {
            this.title = opt.title;
        }

        this._init();
    }

    create(_opt: CreateOption | string = {}): this {

        let opt: CreateOption;

        // sugar
        if (typeof _opt === "string") {
            opt = {
                text: _opt
            };
        } else {
            opt = _opt;
        }

        /*- Desktop notify -*/
        if (this.disableDesktopNotify === false) {
            const hasFocus = !!document.hasFocus ? document.hasFocus() : false;
            if (this.disableFocusDetection === false && hasFocus === false) {
                if (this._createDesktopNotify(opt) === true) {
                    return this;
                }
            }
        }

        /*- Setting up -*/
        const title = opt.title || this.title;
        const message = opt.message || opt.body || opt.content || opt.text || null;
        const onClick = opt.onClick;
        const onClose = opt.onClose;
        const timeout = (opt.timeout !== void 0) ? opt.timeout : this.timeout;

        let isAlive = true;
        let closeTimer;

        /*- Positions -*/
        const hPosition = this.hMargin;
        const vPosition = this.vMargin;

        /*- Create a new element for notify -*/
        //
        // <div class="flagrate-notify">
        //   <div class="title">Notification</div>
        //   <div class="text">yadda yadda yadda..</div>
        //   <div class="close">&#xd7;</div>
        // </div>
        //
        const notify = new Element("div", { "class": this.className });
        notify.addClassName("flagrate flagrate-notify");
        new Element("div", { "class": "title" }).insertText(title).insertTo(notify);
        new Element("div", { "class": "text" }).insertText(message).insertTo(notify);
        const notifyClose = new Element("div", { "class": "close" }).update("&#xd7;").insertTo(notify);

        if (opt.icon) {
            notify.addClassName("flagrate-notify-icon");
            new Element("div", { "class": "icon" }).setStyle({ "backgroundImage": "url(" + opt.icon + ")" }).insertTo(notify);
        }

        /*- Remove a notify element -*/
        const closeNotify = () => {

            if (isAlive === false) {
                return;
            }

            isAlive = false;

            notify.style.opacity = "0";

            //onClose event
            if (onClose) {
                onClose.call(this);
            }

            setTimeout(() => {

                this.target.removeChild(notify);

                this._notifies.splice(this._notifies.indexOf(notify), 1);
                this._positioner();
            }, 300);
        };

        notifyClose.addEventListener("click", e => {

            e.stopPropagation();
            e.preventDefault();

            if (isAlive) {
                closeNotify();
            }
        }, false);

        notify.style.display = "none";

        notify.style.position = "fixed";
        notify.style[this.hAlign] = hPosition + "px";
        notify.style[this.vAlign] = vPosition + "px";

        /*- onClick event -*/
        if (!onClick) {
            notify.addEventListener("click", closeNotify);
        } else {
            notify.style.cursor = "pointer";
            notify.addEventListener("click", e => {

                e.stopPropagation();
                e.preventDefault();

                onClick.call(this);
                closeNotify();
            });
        }

        /*- Insert to the target -*/
        this.target.appendChild(notify);

        /*- Show notify -*/
        notify.style.display = "block";
        setTimeout(() => {
            notify.style.opacity = "1";
        }, 10);

        /*- Set timeout -*/
        if (timeout !== 0) {
            const onTimeout = () => {

                if (isAlive) {
                    closeNotify();
                }
            };

            closeTimer = setTimeout(onTimeout, timeout * 1000);

            //Clear timeout
            notify.addEventListener("mouseover", () => {

                clearTimeout(closeTimer);
                closeTimer = setTimeout(onTimeout, timeout * 1000);
            });
        }

        this._notifies.push(notify);
        this._positioner();

        return this;
    }

    private _init(): void {

        if (this.disableDesktopNotify === false) {
            /*- Check supported -*/
            if (!window["Notification"] || !window["Notification"].permission) {
                this.disableDesktopNotify = true;
            } else {
                /*- Check protocol -*/
                if (location.protocol !== "file:") {
                    /*- Get Permissions -*/
                    if (window["Notification"].permission === "default") {
                        this.create({
                            text: "Click here to Activate the Desktop Notifications...",
                            onClick() {
                                window["Notification"].requestPermission();
                            }
                        });
                    }
                }
            }
        }
    }

    private _createDesktopNotify(opt: CreateOption): boolean {

        /*- Setting up -*/
        const title = opt.title || this.title;
        const message = opt.message || opt.body || opt.content || opt.text || null;
        const onClick = opt.onClick;
        const onClose = opt.onClose;
        const timeout = (opt.timeout !== void 0) ? opt.timeout : this.timeout;

        let isAlive = true;
        let notify = null;
        let closeTimer;

        /*- Create a desktop notification -*/
        /*- Get Permissions -*/
        if (window["Notification"].permission !== "granted") {
            return false;
        }

        notify = new window["Notification"](title, {
            icon: opt.icon,
            body: message
        });

        /*- Set timeout -*/
        if (timeout !== 0) {
            closeTimer = setTimeout(() => {

                if (isAlive) {
                    notify.close();
                }
            }, timeout * 1000);
        }

        /*- onClick event -*/
        notify.addEventListener("click", () => {

            if (onClick) {
                onClick.call(this);
            }

            notify.close();
        });

        /*- onClose event -*/
        notify.onclose = () => {

            isAlive = false;

            if (onClose) {
                onClose.call(this);
            }
        };

        /*- Show notify -*/
        if (notify.show) {
            notify.show();
        }

        return true;
    }

    private _positioner(): void {

        const tH = (this.target === document.body) ? (window.innerHeight || document.body.clientHeight) : this.target.offsetHeight;
        let pX = 0;
        let pY = 0;

        for (let i = 0, l = this._notifies.length; i < l; i++) {
            const notify = this._notifies[i];

            const x = this.vMargin + pX;
            const y = this.hMargin + pY;

            notify.style[this.hAlign] = x.toString(10) + "px";
            notify.style[this.vAlign] = y.toString(10) + "px";

            pY += this.spacing + notify.offsetHeight;

            if ((pY + notify.offsetHeight + this.vMargin + this.spacing) >= tH) {
                pY = 0;
                pX += this.spacing + notify.offsetWidth;
            }
        }
    }
}

export function createNotify(option?: Option): Notify {
    return new Notify(option);
}