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
import * as progress from './progress';

/*?
    class flagrate.Slider

    #### Events

    * `change`: when the value is changed. (by flagrate.Progress)
    * `slide` : when the slide by user.

    #### Inheritance

    * flagrate.Progress
**/
export interface Slider extends Instance, progress.Progress { }

export interface Class {
    new (option?: Option): Slider;
    prototype: Instance;
}

export interface Instance {
    disable(): this;
    enable(): this;
    isEnabled(): boolean;

    _onPointerDownHandler(e: PointerEvent): void;
    _onTouchStartHandler(e: TouchEvent): void;
    _slide(x: number, pos: number, type: "pointer" | "touch"): void;
}

export interface Option extends progress.Option {
    /** default is false. */
    isDisabled?: boolean;
}

/*?
    flagrate.createSlider(option)
    new flagrate.Slider(option)
    - option (Object) - options.
**/
function FSlider(opt: Option = {}) {

    //create
    const slider = new progress.Progress(opt) as Slider;
    extendObject(slider, this);

    slider.addClassName('flagrate-slider');

    if (window.ontouchstart !== undefined) {
        slider.addEventListener('touchstart', slider._onTouchStartHandler.bind(slider));
    }
    if (navigator.pointerEnabled) {
        slider.addEventListener('pointerdown', slider._onPointerDownHandler.bind(slider));
    } else if (navigator.msPointerEnabled) {
        // deprecated on IE11
        slider.addEventListener('MSPointerDown', slider._onPointerDownHandler.bind(slider));
    } else {
        slider.addEventListener('mousedown', slider._onPointerDownHandler.bind(slider));
    }

    if (opt.isDisabled) {
        slider.disable();
    }

    return slider;
}

export const Slider = FSlider as any as Class;

export function createSlider(option?: Option): Slider {
    return new Slider(option);
}

Slider.prototype = {
    disable() {
        return this.addClassName('flagrate-disabled');
    },

    enable() {
        return this.removeClassName('flagrate-disabled');
    },

    isEnabled() {
        return !this.hasClassName('flagrate-disabled');
    },

    _onTouchStartHandler(e) {

        if (!this.isEnabled()) {
            return;
        }

        e.preventDefault();

        this._slide(
            e.touches[0].pageX - this.cumulativeOffset().left,
            e.touches[0].clientX,
            'touch'
        );
    },

    _onPointerDownHandler(e) {

        if (!this.isEnabled()) {
            return;
        }

        e.preventDefault();

        this._slide(
            e.offsetX || e.layerX,
            e.clientX,
            'pointer'
        );
    },

    _slide(x, pos, type) {

        const slider = this as Slider;

        const unitWidth = slider.getWidth() / slider.getMax();

        const onMove = (e) => {

            e.preventDefault();

            if (e.touches && e.touches[0]) {
                x = x + e.touches[0].clientX - pos;
                pos = e.touches[0].clientX;
            } else {
                x = x + e.clientX - pos;
                pos = e.clientX;
            }

            slider.setValue(Math.round(x / unitWidth));
            slider.fire('slide', { targetSlider: slider });
        };

        const onUp = (e) => {

            e.preventDefault();

            if (type === 'pointer') {
                if (navigator.pointerEnabled) {
                    document.removeEventListener('pointermove', onMove);
                    document.removeEventListener('pointerup', onUp);
                } else if (navigator.msPointerEnabled) {
                    document.removeEventListener('MSPointerUp', onUp);
                    document.removeEventListener('MSPointerMove', onMove);
                } else {
                    document.removeEventListener('mousemove', onMove);
                    document.removeEventListener('mouseup', onUp);
                }
            } else if (type === 'touch') {
                document.removeEventListener('touchmove', onMove);
                document.removeEventListener('touchend', onUp);
                document.removeEventListener('touchcancel', onUp);
            }

            if (e.clientX) {
                x = x + e.clientX - pos;
                slider.setValue(Math.round(x / unitWidth));
                slider.fire('slide', { targetSlider: slider });
            } else if (e.touches && e.touches[0]) {
                x = x + e.touches[0].clientX - pos;
                slider.setValue(Math.round(x / unitWidth));
                slider.fire('slide', { targetSlider: slider });
            }
        };

        if (type === 'pointer') {
            if (navigator.pointerEnabled) {
                document.addEventListener('pointermove', onMove);
                document.addEventListener('pointerup', onUp);
            } else if (navigator.msPointerEnabled) {
                document.addEventListener('MSPointerMove', onMove);
                document.addEventListener('MSPointerUp', onUp);
            } else {
                document.addEventListener('mousemove', onMove);
                document.addEventListener('mouseup', onUp);
            }
        } else if (type === 'touch') {
            document.addEventListener('touchmove', onMove);
            document.addEventListener('touchend', onUp);
            document.addEventListener('touchcancel', onUp);
        }

        slider.setValue(Math.round(x / unitWidth));
        slider.fire('slide', { targetSlider: slider });
    }
};