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
"use strict";

import * as util from "./flagrate/util";
import * as element from "./flagrate/element";
import * as button from "./flagrate/button";
import * as buttons from "./flagrate/buttons";
import * as menu from "./flagrate/menu";
import * as pulldown from "./flagrate/pulldown";
import * as textInput from "./flagrate/text-input";
import * as tokenizer from "./flagrate/tokenizer";
import * as textArea from "./flagrate/text-area";
import * as comboBox from "./flagrate/combo-box";
import * as select from "./flagrate/select";
import * as contextMenu from "./flagrate/context-menu";
import * as toolbar from "./flagrate/toolbar";
import * as searchBox from "./flagrate/search-box";
import * as checkbox from "./flagrate/checkbox";
import * as checkboxes from "./flagrate/checkboxes";
import * as radio from "./flagrate/radio";
import * as radios from "./flagrate/radios";
import * as sw from "./flagrate/switch";
import * as progress from "./flagrate/progress";
import * as slider from "./flagrate/slider";
import * as tab from "./flagrate/tab";
import * as popover from "./flagrate/popover";
import * as tutorial from "./flagrate/tutorial";
import * as notify from "./flagrate/notify";
import * as modal from "./flagrate/modal";
import * as grid from "./flagrate/grid"
import * as form from "./flagrate/form";

export namespace Flagrate {

    export const identity = util.identity;
    export const extendObject = util.extendObject;
    export const emptyFunction = util.emptyFunction;
    export const jsonPointer = util.jsonPointer;

    export const Element = element.Element;
    export const createElement = element.createElement;

    export const Button = button.Button;
    export const createButton = button.createButton;

    export const Buttons = buttons.Buttons;
    export const createButtons = buttons.createButtons;

    export const Menu = menu.Menu;
    export const createMenu = menu.createMenu;

    export const Pulldown = pulldown.Pulldown;
    export const createPulldown = pulldown.createPulldown;

    export const TextInput = textInput.TextInput;
    export const createTextInput = textInput.createTextInput;

    export const Tokenizer = tokenizer.Tokenizer;
    export const createTokenizer = tokenizer.createTokenizer;

    export const TextArea = textArea.TextArea;
    export const createTextArea = textArea.createTextArea;

    export const ComboBox = comboBox.ComboBox;
    export const createComboBox = comboBox.createComboBox;

    export const Select = select.Select;
    export const createSelect = select.createSelect;

    export const ContextMenu = contextMenu.ContextMenu;
    export const createContextMenu = contextMenu.createContextMenu;

    export const Toolbar = toolbar.Toolbar;
    export const createToolbar = toolbar.createToolbar;

    export const SearchBox = searchBox.SearchBox;
    export const createSearchBox = searchBox.createSearchBox;

    export const Checkbox = checkbox.Checkbox;
    export const createCheckbox = checkbox.createCheckbox;

    export const Checkboxes = checkboxes.Checkboxes;
    export const createCheckboxes = checkboxes.createCheckboxes;

    export const Radio = radio.Radio;
    export const createRadio = radio.createRadio;

    export const Radios = radios.Radios;
    export const createRadios = radios.createRadios;

    export const Switch = sw.Switch;
    export const createSwitch = sw.createSwitch;

    export const Progress = progress.Progress;
    export const createProgress = progress.createProgress;

    export const Slider = slider.Slider;
    export const createSlider = slider.createSlider;

    export const Tab = tab.Tab;
    export const createTab = tab.createTab;

    export const Popover = popover.Popover;
    export const createPopover = popover.createPopover;

    export const Tutorial = tutorial.Tutorial;
    export const createTutorial = tutorial.createTutorial;

    export const Notify = notify.Notify;
    export const createNotify = notify.createNotify;

    export const Modal = modal.Modal;
    export const createModal = modal.createModal;

    export const Grid = grid.Grid;
    export const createGrid = grid.createGrid;

    export const Form = form.Form;
    export const createForm = form.createForm;
}

if (typeof window["flagrate"] === "undefined") {
    window["flagrate"] = Flagrate;
}

declare global {
    interface Window {
        flagrate: typeof Flagrate;
    }
}

export default Flagrate;