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
import * as textArea from './flagrate/text-area';
import * as comboBox from './flagrate/combo-box';
import * as select from './flagrate/select';
import * as contextMenu from './flagrate/context-menu';
import * as toolbar from './flagrate/toolbar';
import * as searchBox from './flagrate/search-box';
import * as checkbox from './flagrate/checkbox';
import * as checkboxes from './flagrate/checkboxes';
import * as radio from './flagrate/radio';
import * as radios from './flagrate/radios';
import * as sw from './flagrate/switch';
import * as progress from './flagrate/progress';
import * as slider from './flagrate/slider';
import * as tab from './flagrate/tab';
import * as popover from './flagrate/popover';
import * as tutorial from './flagrate/tutorial';
import * as notify from './flagrate/notify';
import * as modal from './flagrate/modal';
import * as grid from './flagrate/grid'

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

    TextArea = textArea.TextArea;
    createTextArea = textArea.createTextArea;

    ComboBox = comboBox.ComboBox;
    createComboBox = comboBox.createComboBox;

    Select = select.Select;
    createSelect = select.createSelect;

    ContextMenu = contextMenu.ContextMenu;
    createContextMenu = contextMenu.createContextMenu;

    Toolbar = toolbar.Toolbar;
    createToolbar = toolbar.createToolbar;

    SearchBox = searchBox.SearchBox;
    createSearchBox = searchBox.createSearchBox;

    Checkbox = checkbox.Checkbox;
    createCheckbox = checkbox.createCheckbox;

    Checkboxes = checkboxes.Checkboxes;
    createCheckboxes = checkboxes.createCheckboxes;

    Radio = radio.Radio;
    createRadio = radio.createRadio;

    Radios = radios.Radios;
    createRadios = radios.createRadios;

    Switch = sw.Switch;
    createSwitch = sw.createSwitch;

    Progress = progress.Progress;
    createProgress = progress.createProgress;

    Slider = slider.Slider;
    createSlider = slider.createSlider;

    Tab = tab.Tab;
    createTab = tab.createTab;

    Popover = popover.Popover;
    createPopover = popover.createPopover;

    Tutorial = tutorial.Tutorial;
    createTutorial = tutorial.createTutorial;

    Notify = notify.Notify;
    createNotify = notify.createNotify;

    Modal = modal.Modal;
    createModal = modal.createModal;

    Grid = grid.Grid;
    createGrid = grid.createGrid;
}

export declare const flagrate: Flagrate;

if (typeof window['flagrate'] === 'undefined') {
    window['flagrate'] = new Flagrate();
}