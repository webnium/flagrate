/*?
 *  class flagrate.Buttons
 *  
 *  #### Example
 *  
 *      var button = flagrate.createButtons({
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
 *  * flagrate.Element
 *  * [HTMLDivElement](https://developer.mozilla.org/en-US/docs/Web/API/HTMLDivElement) (MDN)
**/
export interface IButtonsClass {
    new? (option?: IButtonsOption): IButtons;
    (option?: IButtonsOption): void;
    prototype: IButtonsInstance;
}

export interface IButtons extends IButtonsInstance, Flagrate.IElement { }

export interface IButtonsInstance extends Flagrate.IElementInstance {
    push(button: Flagrate.IButtonOption): IButtons;
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
    items?: Flagrate.IButtonOption[];

    onSelect? (event?: any, button?: IButtons): void;
}

/*?
 *  flagrate.createButtons(option)
 *  new flagrate.Buttons(option)
 *  - option (Object) - options.
 *  
 *  Button group.
 *  
 *  #### option
 *  
 *  * `id`                       (String): `id` attribute of container element.
 *  * `className`                (String):
 *  * `attribute`                (Object):
 *  * `items`                    (Array): of item
 *  * `onSelect`                 (Function):
 *  
 *  #### item
 *  
 *  * `key`                      (String):
 *  * `label`                    (String; default `""`):
 *  * `icon`                     (String):
 *  * `color`                    (String):
 *  * `isDisabled`               (Boolean; default `false`):
 *  * `onSelect`                 (Function):
**/
export var Buttons: IButtonsClass = function (option: IButtonsOption = {}): IButtons {

    option.items = option.items || [];

    this.onSelect = option.onSelect || Flagrate.emptyFunction;

    var attr = option.attribute || {};

    attr.id = option.id;
    attr['class'] = option.className;

    // create a container
    var container = <IButtons>new Flagrate.Element('div', attr);
    Flagrate.extendObject(container, this);

    container.addClassName(flagrate.className + ' ' + flagrate.className + '-buttons');

    var i, l;
    for (i = 0, l = option.items.length; i < l; i++) {
        container.push(option.items[i]);
    }

    container.on('click', function (e) {

        e.stopPropagation();
        e.preventDefault();
    });

    return container;
};

export function createButtons(a) {
    return new Buttons(a);
};