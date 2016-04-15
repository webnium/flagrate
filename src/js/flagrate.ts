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
import * as buttons from './flagrate/buttons';
import * as menu from './flagrate/menu';
import * as pulldown from './flagrate/pulldown';
import * as textInput from './flagrate/text-input';
import * as tokenizer from './flagrate/tokenizer';

export default class Flagrate {

    identity = util.identity;
    extendObject = util.extendObject;
    emptyFunction = util.emptyFunction;
    jsonPointer = util.jsonPointer;

    Element = element.Element;
    createElement = element.createElement;

    Button = button.Button;
    createButton = button.createButton;

    Buttons = buttons.Buttons;
    createButtons = buttons.createButtons;

    Menu = menu.Menu;
    createMenu = menu.createMenu;

    Pulldown = pulldown.Pulldown;
    createPulldown = pulldown.createPulldown;

    TextInput = textInput.TextInput;
    createTextInput = textInput.createTextInput;

    Tokenizer = tokenizer.Tokenizer;
    createTokenizer = tokenizer.createTokenizer;
}

export declare const flagrate: Flagrate;

if (typeof window['flagrate'] === 'undefined') {
    window['flagrate'] = new Flagrate();
}