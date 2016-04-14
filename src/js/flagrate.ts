/*!
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

import * as util from './flagrate/util';
import * as element from './flagrate/element';
import * as button from './flagrate/button';

export default class Flagrate {

    identity<T>(a: T): T {
        return a;
    }

    extendObject<T, U>(dest: T, source: U): T {
        return util.extendObject(dest, source);
    }

    emptyFunction(...args: any[]): any;
    emptyFunction() {
        return util.emptyFunction();
    }

    jsonPointer = util.jsonPointer;

    Element = element.Element;
    createElement = element.createElement;

    Button = button.Button;
    createButton = button.createButton;
}

export declare const flagrate: Flagrate;

if (typeof window['flagrate'] === 'undefined') {
    window['flagrate'] = new Flagrate();
}