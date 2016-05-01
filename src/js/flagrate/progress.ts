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

/*?
    class flagrate.Progress

    #### Event

    * `change`: when the value is changed.

    #### Inheritances

    * flagrate.Element
    * [HTMLDivElement](https://developer.mozilla.org/en-US/docs/Web/API/HTMLDivElement) (MDN)
**/
export interface Progress extends Instance, FHTMLDivElement { }

export interface Class {
    new (option?: Option): Progress;
    prototype: Instance;
}

export interface Instance {
    getValue(): number;
    setValue(value: number): this;
    getMax(): number;
    setMax(value: number): this;

    _max?: number;
    _value?: number;
    _bar?: FHTMLDivElement;
    _updateProgress?(): void;
}

export interface Option {
    /** id attribute. */
    id?: string;

    /** class attribute. */
    className?: string;

    /** attribute/value pairs properties. */
    attribute?: Attribute;

    /** default is `0`. */
    value?: number;

    /** default is `100`. */
    max?: number;
}

/*?
    flagrate.createProgress(option)
    new flagrate.Progress(option)
    - option (Object) - options.
**/
function FProgress(opt: Option = {}) {

    const attr = opt.attribute || {};

    attr['id'] = opt.id || null;
    attr['class'] = opt.className || null;

    //create
    const progress = <Progress>new Element('div', attr);
    extendObject(progress, this);

    progress._value = opt.value || 0;
    progress._max = opt.max || 100;

    progress.addClassName('flagrate flagrate-progress');

    progress._bar = new Element().insertTo(progress);

    progress._updateProgress();

    return progress;
}

export const Progress = FProgress as any as Class;

export function createProgress(option?: Option): Progress {
    return new Progress(option);
}

Progress.prototype = {
    getValue() {
        return this._value;
    },

    setValue(number) {

        const progress = this as Progress;

        if (typeof number !== 'number') {
            return progress;
        }

        progress._value = Math.max(0, Math.min(progress._max, number));

        progress.fire('change', { targetProgress: progress });

        progress._updateProgress();

        return progress;
    },

    getMax() {
        return this._max;
    },

    setMax(number) {

        const progress = this as Progress;

        if (typeof number !== 'number') {
            return progress;
        }

        progress._max = number;

        progress.setValue(progress._value);

        progress._updateProgress();

        return progress;
    },

    _updateProgress() {

        const progress = this as Progress;

        const percentage = Math.max(0, Math.min(100, progress._value / progress._max * 100));

        progress._bar.setStyle({ width: `${percentage}%` });

        return;
    }
};