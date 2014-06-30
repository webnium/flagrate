/*?
 *  class Flagrate.Buttons
 *  
 *  #### Example
 *  
 *      var button = Flagrate.createButtons({
 *        items: [
 *          { label: 'Left' },
 *          { label: 'Middle' },
 *          { label: 'Right' }
 *        ]
 *      }).insertTo(x);
 *  
 *  #### Structure
 *  
 *  <div class="example-container">
 *    <div class="flagrate flagrate-buttons">
 *      <button class="flagrate flagrate-button">Left</button><button class="flagrate flagrate-button">Middle</button><button class="flagrate flagrate-button">Right</button>
 *    </div>
 *  </div>
 *  
 *      <div class="flagrate flagrate-buttons">
 *        <button class="flagrate flagrate-button">Left</button>
 *        <button class="flagrate flagrate-button">Middle</button>
 *        <button class="flagrate flagrate-button">Right</button>
 *      </div>
 *  
 *  #### Inheritances
 *  
 *  * Flagrate.Button
 *  * Flagrate.Element
 *  * [HTMLDivElement](https://developer.mozilla.org/en-US/docs/Web/API/HTMLDivElement) (MDN)
**/
export interface IButtonsClass {
    new? (option?: IButtonsOption): IButtons;
    (option?: IButtonsOption): void;
    prototype: IButtonsInstance;
}

export interface IButtons extends IButtonsInstance, Flagrate.IElement { }

export interface IButtonsInstance extends Flagrate.IElementInstance {
    push(button: Flagrate.IButtonsItemOption): IButtons;
    getButtonByKey(key: string): Flagrate.IButton;
    getButtons(): Flagrate.IButton[];
}

export interface IButtonsOption {
    /** id attribute. */
    id?: string;

    /** class attribute. */
    className?: string;

    /** attribute/value pairs properties. */
    attribute?: any;

    /** CSS style properties (uses Flagrate.Element.setStyle). */
    style?: any;

    /** Button items */
    items?: IButtonsItemOption[];

    onSelect? (event?: any, buttons?: IButtons): void;
}

export interface IButtonsItemOption extends Flagrate.IButtonOption {
    /** key */
    key?: string;
}

export var Buttons: IButtonsClass = function (option: IButtonsOption = {}): IButtons {

    option.items = option.items || [];

    this.onSelect = option.onSelect || Flagrate.emptyFunction;

    var attr = option.attribute || {};

    attr.id = option.id;
    attr['class'] = option.className;

    // create a container
    var container = <IButtons>new Flagrate.Element('div', attr);
    Flagrate.extendObject(container, this);

    container.addClassName(Flagrate.className + ' ' + Flagrate.className + '-buttons');

    var i, l;
    for (i = 0, l = option.items.length; i < l; i++) {
        container.push(option.items[i]);
    }

    container.on('click', function (e) {

        e.stopPropagation();
        e.preventDefault();
    });

    if (option.style) { container.setStyle(option.style); }

    return container;
};

export function createButtons(option?: IButtonsOption): IButtons {
    return new Buttons(option);
};

Buttons.prototype = {
    push (option: IButtonsItemOption) {

        if (option.onSelect) {
            var _onSelect = option.onSelect;
        }

        option.onSelect = (e) => {

            if (_onSelect) {
                _onSelect(e);
            }

            this.onSelect(e);
        };

        var button = Flagrate.createButton(option).insertTo(this);

        if (option.key) {
            button.dataset['_key'] = option.key;
        }

        return this;
    },

    getButtonByKey (key: string) {

        var result = null;

        var elements = this.childNodes;
        var i, l;
        for (i = 0, l = elements.length; i < l; i++) {
            if (elements[i].dataset['_key'] === key) {
                result = elements[i];
                break;
            }
        }

        return result;
    },

    getButtons () {
        return this.childNodes || [];
    }
};