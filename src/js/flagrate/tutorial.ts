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

import { emptyFunction } from './util';
import { Element } from './element';
import { Button, Option as ButtonOption } from './button';
import { Popover } from './popover';
import { Modal } from './modal';

/*?
    class flagrate.Tutorial

    The flagrate.Tutorial object provides a tutorial UI.

    #### Example

        // create
        var tutorial = flagrate.createTutorial({
        steps: [
            {
                target: '#tutorial-step1',// using selector string
                text  : 'step1'
            },
            {
                target: '#tutorial-step2',
                text  : 'step2',
            },
            {
                target: element,
                text  : 'step3'
            },
            {
                title : 'Finish',
                text  : 'Good luck!'
            }
        ]
        });

        // open
        tutorial.open();
**/
export interface Option {
    steps?: Step[];
    index?: number;

    onFinish?(tutorial?: this): void;
    onAbort?(tutorial?: this): void;
    onClose?(tutorial?: this): void;
}

export interface Step {
    /** Element to target. If target is undefined or not found, will creates flagrate.Modal. */
    target?: string | HTMLElement;
    /** Title for this step. */
    title?: string;
    /** Descriptive text for this step. */
    text?: string;
    /** Descriptive html for this step. */
    html?: string;

    /** Triggered whenever a step is started. */
    onStep?(): void;
    /** Triggered at before starting of this step. */
    onBeforeStep?(done?: AsyncCallback): void;
    /** Triggered at after of this step. */
    onAfterStep?(done?: AsyncCallback): void;
}

export interface AsyncCallback {
    (): void;
}

/*?
    flagrate.createTutorial(option)
    new flagrate.Tutorial(option)
    - option (Object) - options.

    Creates new tutorial.

    #### option

    * `steps`              (Array; required): Array of **step** object.
    * `count`              (Number; default `0`): current count of step.
    * `onFinish`           (Function): callback when finish.
    * `onAbort`            (Function): callback when abort.
    * `onClose`            (Function): callback when close.

    #### step

    * `target`             (Element|String): Element to target. If target is undefined or not found, will creates flagrate.Modal.
    * `title`              (String): Title for this step.
    * `text`               (String): Descriptive text for this step.
    * `html`               (String): Descriptive html for this step.
    * `onStep`             (Function): Triggered whenever a step is started.
    * `onBeforeStep`       (Function): Triggered at before starting of this step.
    * `onAfterStep`        (Function): Triggered at after of this step.

    ##### onBeforeStep / onAfterStep

        // async callback
        function (done) {// if expects callback, will waits for it.
            setTimeout(done, 1000);
        }

        // sync
        function () {
            // ...
        }
**/
export class Tutorial {

    onFinish: (tutorial?: this) => void = emptyFunction;
    onAbort: (tutorial?: this) => void = emptyFunction;
    onClose: (tutorial?: this) => void = emptyFunction;

    private _steps: Step[] = [];
    private _index: number = 0;

    private _popover: Popover;
    private _modal: Modal;
    private _inStep: boolean;

    constructor(opt: Option = {}) {

        if (opt.steps) {
            this._steps = opt.steps;
        }
        if (opt.index) {
            this._index = opt.index;
        }
        if (opt.onFinish) {
            this.onFinish = opt.onFinish;
        }
        if (opt.onAbort) {
            this.onAbort = opt.onAbort;
        }
        if (opt.onClose) {
            this.onClose = opt.onClose;
        }
    }

    visible(): boolean {
        return !!this._popover || !!this._modal || !!this._inStep;
    }

    open(): this {

        if (this.visible() === false) {
            this._main();
        }

        return this;
    }

    close(): this {

        if (this.visible() === true) {
            this._afterStep(this.onClose.bind(this));
        }

        return this;
    }

    abort(): this {

        if (this.visible() === true) {
            this._afterStep(this.onAbort.bind(this));
        }

        return this;
    }

    finish(): this {

        this._afterStep(this.onFinish.bind(this));
        this._index = 0;

        return this;
    }

    prev(): this {

        this._afterStep(() => {

            if (this._index > 0) { --this._index; }
            this._main();
        });

        return this;
    }

    next(): this {

        this._afterStep(() => {

            if ((this._index + 1) < this._steps.length) {
                ++this._index;
            }
            this._main();
        });

        return this;
    }

    private _main(): this {

        this._inStep = true;

        const step = this._steps[this._index];

        if (step.onBeforeStep) {
            if (step.onBeforeStep.length) {
                step.onBeforeStep.call(this, this._step.bind(this));
                return this;
            } else {
                step.onBeforeStep.call(this);
            }
        }

        this._step();

        return this;
    }

    private _step(): this {

        const step = this._steps[this._index];

        const buttons: ButtonOption[] = [];

        if ((this._index + 1) >= this._steps.length) {
            buttons.push({
                className: 'flagrate-tutorial-button-finish',
                onSelect: () => {
                    this._afterStep(this.finish.bind(this));
                }
            });
        } else {
            buttons.push({
                className: 'flagrate-tutorial-button-next',
                onSelect: () => {
                    this._afterStep(this.next.bind(this));
                }
            });
        }

        if (this._index > 0) {
            buttons.push({
                className: 'flagrate-tutorial-button-prev',
                onSelect: () => {
                    this._afterStep(this.prev.bind(this));
                }
            });
        }

        if ((this._index + 1) < this._steps.length) {
            buttons.push({
                className: 'flagrate-tutorial-button-abort',
                onSelect: () => {
                    this._afterStep(this.abort.bind(this));
                }
            });
        }

        buttons[0].color = '@primary';

        let target;
        if (typeof step.target === 'string') {
            target = document.querySelector(step.target as string);
        } else if (Element.isElement(step.target) === true) {
            target = step.target;
        }

        if (target) {
            const container = new Element();
            const body = new Element();

            if (step.html) {
                body.insert(step.html).insertTo(container);
            }

            if (step.text) {
                body.insertText(step.text).insertTo(container);
            }

            const buttonContainer = new Element('footer').insertTo(container);
            buttons.forEach(button => {
                new Button(button).insertTo(buttonContainer);
            });

            this._popover = new Popover({
                className: 'flagrate-tutorial',
                element: container
            });

            this._popover.open(target);
        } else {
            this._modal = new Modal({
                disableCloseByMask: true,
                disableCloseButton: true,
                disableCloseByEsc: true,
                className: 'flagrate-tutorial',
                title: step.title,
                text: step.text,
                html: step.html,
                buttons: buttons
            });

            this._modal.open();
        }

        if (step.onStep) {
            step.onStep.call(this);
        }

        return this;
    }

    _afterStep(done: AsyncCallback) {

        this._inStep = false;

        let pp = false;

        if (this._popover) {
            pp = true;
            this._popover.remove();
            delete this._popover;
        }
        if (this._modal) {
            pp = true;
            this._modal.close();
            delete this._modal;
        }

        if (pp === true) {
            const step = this._steps[this._index];

            if (step.onAfterStep) {
                if (step.onAfterStep.length) {
                    step.onAfterStep.call(this, done);
                    return this;
                } else {
                    step.onAfterStep.call(this);
                }
            }
        }

        done();

        return this;
    }
}

export function createTutorial(option?: Option): Tutorial {
    return new Tutorial(option);
}