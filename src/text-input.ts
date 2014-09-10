/*?
 *  class Flagrate.TextInput
 *
 *  TextInput.
 *
 *  #### Inheritance
 *  
 *  * Flagrate.Element
 *  * [HTMLInputElement](https://developer.mozilla.org/en-US/docs/Web/API/HTMLInputElement) (MDN)
**/
export interface ITextInput extends ITextInputInstance, Flagrate.IElement, HTMLInputElement { }

export interface ITextInputClass {
    new? (option?: ITextInputOption): ITextInput;
    (option?: ITextInputOption): void;
    prototype: ITextInputInstance;
}

export interface ITextInputInstance extends Flagrate.IElementInstance {
    disable(): ITextInput;
    enable(): ITextInput;
    isEnabled(): boolean;
    setValue(value: string): ITextInput;
    getValue(): string;
    setIcon(url?: string): ITextInput;
    getIcon(): string;
    isValid(): boolean;
}

export interface ITextInputOption {
    /** id attribute. */
    id?: string;

    /** class attribute. */
    className?: string;

    /** attribute/value pairs properties. */
    attribute?: any;

    /** CSS style properties (uses Flagrate.Element.setStyle). */
    style?: any;

    /** default value. */
    value?: string;

    /** placeholder. */
    placeholder?: string;

    /** icon image URL. */
    icon?: string;

    /** RegExp for simple validation feature. */
    regexp?: RegExp;

    /** default is false. */
    isDisabled?: boolean;
}

export var TextInput: ITextInputClass = function (option: ITextInputOption = {}): ITextInput {
    
    this.regexp = option.regexp || null;

    var attr = option.attribute || {};

    if (option.id) { attr.id = option.id; }
    if (option.value) { attr.value = option.value; }
    if (option.placeholder) { attr.placeholder = option.placeholder; }

    //create
    var input = <ITextInput>new Flagrate.Element('input', attr);
    Flagrate.extendObject(input, this);

    input.addClassName(Flagrate.className + ' ' + Flagrate.className + '-textinput');
    if (option.className) { input.addClassName(option.className); }

    if (option.style) { input.setStyle(option.style); }
    if (option.icon) { input.setIcon(option.icon); }

    if (option.isDisabled) { input.disable(); }

    return input;
};

export function createTextInput(option?: ITextInputOption): ITextInput {
    return new TextInput(option);
};

TextInput.prototype = {
    disable () {

        this.addClassName(Flagrate.className + '-disabled');
        this.writeAttribute('disabled', true);

        return this;
    },

    enable () {

        this.removeClassName(Flagrate.className + '-disabled');
        this.writeAttribute('disabled', false);

        return this;
    },

    isEnabled () {
        return !this.hasClassName(Flagrate.className + '-disabled');
    },

    setValue (value: string) {

        this.value = value;

        return this;
    },

    getValue () {
        return this.value;
    },

    setIcon (identifier) {

        this._iconIdentifier = identifier;

        if (identifier) {
            return this.addClassName(Flagrate.className + '-icon').setStyle({
                backgroundImage: 'url(' + identifier + ')'
            });
        } else {
            return this.removeClassName(Flagrate.className + '-icon').setStyle({
                backgroundImage: 'none'
            });
        }
    },

    getIcon () {
        return this._iconIdentifier || '';
    },

    isValid: function () {
        return this.regexp.test(this.getValue());
    }
};