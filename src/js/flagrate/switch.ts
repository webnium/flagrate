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
import { Attribute, Property } from './element';
import { Button } from './button';

/*?
    class flagrate.Switch

    #### Example

        var sw = flagrate.createSwitch().insertTo(x);

        sw.on('on', function () {
            console.log('on');
        });
        sw.on('off', function () {
            console.log('off');
        });
        sw.on('change', function (e) {
            console.log(e.target.isOn());
        });

    #### Structure

    <div class="example-container">
        <button class="flagrate flagrate-button flagrate-switch"></button>
    </div>

        <button class="flagrate flagrate-button flagrate-switch"></button>

    #### Events

    * `on`: when the switch is turned on.
    * `off`: when the switch is turned off.
    * `change`: when the on/off status is changed.

    #### Inheritances

    * flagrate.Button
    * [HTMLButtonElement](https://developer.mozilla.org/en-US/docs/Web/API/HTMLButtonElement) (MDN)
**/
export interface Switch extends Instance, Button { }

export interface Class {
    new (option?: Option): Switch;
    prototype: Instance;
}

export interface Instance {
    isOn(): boolean;
    switchOn(): this;
    switchOff(): this;
    toggleSwitch(): this;
}

export interface Option {
    /** id attribute. */
    id?: string;

    /** class attribute. */
    className?: string;

    /** attribute/value pairs properties. */
    attribute?: Attribute;

    /** CSS style properties (uses flagrate.Element.setStyle). */
    style?: Property;

    /** default is false. */
    isFocused?: boolean;

    /** default is false. */
    isDisabled?: boolean;

    /** default is false. */
    isOn?: boolean;
}

/*?
    flagrate.createSwitch(option)
    new flagrate.Switch(option)
    - option (Object) - options.
**/
function FSwitch(opt: Option = {}) {

    //create
    const sw = <Switch>new Button({
        id        : opt.id,
        className : opt.className,
        attribute : opt.attribute,
        style     : opt.style,
        isFocused : opt.isFocused,
        isDisabled: opt.isDisabled
    });
    extendObject(sw, this);

    sw.addEventListener('select', sw.toggleSwitch.bind(sw));

    sw.addClassName('flagrate-switch');

    if (sw.dataset) {
        sw.dataset['flagrateSwitchStatus'] = opt.isOn ? 'on' : 'off';
    } else {
        sw.writeAttribute('data-flagrate-switch-status', opt.isOn ? 'on' : 'off');
    }

    return sw;
}

export const Switch = FSwitch as any as Class;

export function createSwitch(option?: Option): Switch {
    return new Switch(option);
}

Switch.prototype = {
    isOn() {

        if (this.dataset) {
            return this.dataset.flagrateSwitchStatus === 'on';
        } else {
            return this.readAttribute('data-flagrate-switch-status') === 'on';
        }
    },

    switchOn() {

        if (this.dataset) {
            this.dataset.flagrateSwitchStatus = 'on';
        } else {
            this.writeAttribute('data-flagrate-switch-status', 'on');
        }

        return this.fire('on', { targetSwitch: this })
                   .fire('change', { targetSwitch: this });
    },

    switchOff() {

        if (this.dataset) {
            this.dataset.flagrateSwitchStatus = 'off';
        } else {
            this.writeAttribute('data-flagrate-switch-status', 'off');
        }

        return this.fire('off', { targetSwitch: this })
                   .fire('change', { targetSwitch: this });
    },

    toggleSwitch() {
        return this.isOn() ? this.switchOff() : this.switchOn();
    }
};