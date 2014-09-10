/*?
 *  class Flagrate.TextArea
 *
 *  TextArea.
 *
 *  #### Inheritances
 *  
 *  * Flagrate.Element
 *  * [HTMLInputElement](https://developer.mozilla.org/en-US/docs/Web/API/HTMLInputElement) (MDN)
**/
export interface ITextArea extends ITextAreaInstance, Flagrate.IElement, HTMLTextAreaElement { }

export interface ITextAreaClass {
    new? (option?: ITextAreaOption): ITextArea;
    (option?: ITextAreaOption): void;
    prototype: ITextAreaInstance;
}

export interface ITextAreaInstance {
    disable(): ITextArea;
    enable(): ITextArea;
    isEnabled(): boolean;
    setValue(value: string): ITextArea;
    getValue(): ITextArea;
    setIcon(url?: string): ITextArea;
    getIcon(): string;
    isValid(): boolean;
}

export interface ITextAreaOption {
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

export var TextArea: ITextAreaClass = function (option: ITextAreaOption = {}): ITextArea {

    this.regexp = option.regexp || null;

    var attr = option.attribute || {};

    if (option.id) { attr.id = option.id; }
    if (option.placeholder) { attr.placeholder = option.placeholder; }

    //create
    var textArea = <ITextArea>new Flagrate.Element('textarea', attr);
    Flagrate.extendObject(textArea, this);

    textArea.addClassName(Flagrate.className + ' ' + Flagrate.className + '-textarea');
    if (option.className) { textArea.addClassName(option.className); }

    if (option.style) { textArea.setStyle(option.style); }
    if (option.icon) { textArea.setIcon(option.icon); }
    if (option.value) { textArea.setValue(option.value); }

    if (option.isDisabled) { textArea.disable(); }

    return textArea;
};

export function createTextArea(option?: ITextAreaOption): ITextArea {
    return new TextArea(option);
};

TextArea.prototype = {
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