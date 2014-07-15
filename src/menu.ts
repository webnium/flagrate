/*?
 *  class Flagrate.Menu
 *  
 *  #### Example
 *
 *      var menu = Flagrate.createMenu({
 *        items: [
 *          {
 *            label: 'foo'
 *          },
 *          {
 *            label: 'bar',
 *            icon : 'icon.png'
 *          },
 *          '--',
 *          {
 *            label: 'disabled button',
 *            isDisabled: true
 *          }
 *        ]
 *      }).insertTo(x);
 *  
 *  #### Structure
 *  
 *  <div class="example-container">
 *    <div class="flagrate flagrate-menu">
 *      <button class="flagrate flagrate-button">foo</button>
 *      <button class="flagrate flagrate-button flagrate-icon" style="background-image: url(icon.png);">bar</button>
 *      <hr>
 *      <button class="flagrate flagrate-button flagrate-disabled" disabled="disabled">disabled button</button>
 *    </div>
 *  </div>
 *  
 *      <div class="flagrate flagrate-menu">
 *        <button class="flagrate flagrate-button">foo</button>
 *        <button class="flagrate flagrate-button flagrate-icon" style="background-image: url(icon.png);">bar</button>
 *        <hr>
 *        <button class="flagrate flagrate-button flagrate-disabled" disabled="disabled">disabled button</button>
 *      </div>
 *  
 *  `button` elements are created with Flagrate.Button
 *  
 *  #### Inheritances
 *  
 *  * Flagrate.Element
 *  * Flagrate.Button
**/
export interface IMenu extends IMenuInstance, Flagrate.IElement { }

export interface IMenuClass {
    new? (option?: IMenuOption): IMenu;
    (option?: IMenuOption): void;
    prototype: IMenuInstance;
}

export interface IMenuInstance extends Flagrate.IElementInstance {
    push(item: IMenuItemOption): IMenu;
    getButtonByKey(key: string): Flagrate.IButton;
    getButtons(): Flagrate.IButton[];
}

export interface IMenuOption {
    /** id attribute. */
    id?: string;

    /** class attribute. */
    className?: string;

    /** attribute/value pairs properties. */
    attribute?: any;

    /** CSS style properties (uses Flagrate.Element.setStyle). */
    style?: any;

    /** Button items */
    items?: IMenuItemOption[];

    onSelect? (event?: any, menu?: IMenu): void;
}

export interface IMenuItemOption extends Flagrate.IButtonOption {
    /** key */
    key?: string;
}

export var Menu: IMenuClass = function (option: IMenuOption = {}): IMenu {

    option.items = option.items || [];

    this.onSelect = option.onSelect || Flagrate.emptyFunction;

    var attr = option.attribute || {};
    if (option.id) { attr.id = option.id; }

    // create a container
    var container = <IMenu>new Flagrate.Element('div', attr);
    Flagrate.extendObject(container, this);

    container.addClassName(Flagrate.className + ' ' + Flagrate.className + '-menu');
    if (option.className) { container.addClassName(option.className); }

    if (option.style) { container.setStyle(option.style); }

    var i, l;
    for (i = 0, l = option.items.length; i < l; i++) {
        container.push(option.items[i]);
    }

    container.on('click', function (e) {

        e.stopPropagation();
        e.preventDefault();
    });

    container.on('mouseup', function (e) {

        e.stopPropagation();
    });

    return container;
};

export function createMenu(option?: IMenuOption): IMenu {
    return new Menu(option);
};

Menu.prototype = {
    push (option: IMenuItemOption) {

        if (typeof option === 'string') {
            Flagrate.createElement('hr').insertTo(this);
        } else {
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
        }

        return this;
    },

    getButtonByKey: Flagrate.Buttons.prototype.getButtonByKey,

    getButtons: Flagrate.Buttons.prototype.getButtons
};