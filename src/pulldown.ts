/*?
 *  class Flagrate.Pulldown
 *  
 *  #### Example
 *
 *      var menu = Flagrate.createPulldown({
 *        label: 'foo',
 *        items: [
 *          {
 *            label: 'bar'
 *          }
 *        ]
 *      }).insertTo(x);
 *  
 *  #### Structure
 *  
 *      <button class="flagrate flagrate-button flagrate-pulldown">
 *        "foo"
 *        <span class="flagrate-pulldown-triangle"></span>
 *      </button>
 *      <div class="flagrate-pulldown-menu flagrate flagrate-menu">
 *        <button class="flagrate flagrate-button">bar</button>
 *      </div>
 *  
 *  menu `div` are created with Flagrate.Menu
 *  
 *  #### Inheritances
 *  
 *  * Flagrate.Element
 *  * Flagrate.Button
 *  * Flagrate.Menu
**/
export interface IPulldownClass {
    new? (option?: IPulldownOption): IPulldown;
    (option?: IPulldownOption): void;
    prototype: IPulldownInstance;
}

export interface IPulldown extends IPulldownInstance, Flagrate.IButton { }

export interface IPulldownInstance extends Flagrate.IButtonInstance {
    _menu?: Flagrate.IMenu;
}

export interface IPulldownOption {
    /** id attribute. */
    id?: string;

    /** class attribute. */
    className?: string;

    /** attribute/value pairs properties. */
    attribute?: any;

    /** CSS style properties (uses Flagrate.Element.setStyle). */
    style?: any;

    /** Color (uses Flagrate.Button#setColor). */
    color?: string;

    /** Label text. */
    label?: string;

    /** icon image URL. */
    icon?: string;

    /** default is false. */
    isDisabled?: boolean;

    /** Button items */
    items?: Flagrate.IMenuItemOption[];

    onSelect? (event?: any, button?: IPulldown): void;
}

export var Pulldown: IPulldownClass = function (option: IPulldownOption = {}): IPulldown {

    option.label = option.label || '';

    this.items = option.items || [];

    var attr = option.attribute || {};
    if (option.id) { attr.id = option.id; }

    //create
    var button = <IPulldown>new Flagrate.Button({
        attribute: attr,
        label: option.label,
        icon: option.icon,

        onSelect: function () {
            
            if (button._menu) {
                removeMenu();
                return;
            }

            button._menu = Flagrate.createMenu({
                className: Flagrate.className + '-pulldown-menu',
                items: button.items,
                onSelect: function () {

                    if (option.onSelect) {
                        option.onSelect();
                    }
                    removeMenu();
                }
            });

            button._menu.style.top = button.offsetTop + button.getHeight() + 'px';
            button._menu.style.left = button.offsetLeft + 'px';

            button.insert({ after: button._menu });

            // To prevent overflow.
            var menuHeight = button._menu.getHeight();
            var menuMargin = parseInt(button._menu.getStyle('margin-top').replace('px', ''), 10);
            var cummOffsetTop = button.cumulativeOffset().top;
            var upsideSpace = - window.pageYOffset + cummOffsetTop;
            var downsideSpace = window.pageYOffset + window.innerHeight - cummOffsetTop - button.getHeight();
            if (menuHeight + menuMargin > downsideSpace) {
                if (upsideSpace > downsideSpace) {
                    if (upsideSpace < menuHeight + menuMargin) {
                        menuHeight = (upsideSpace - menuMargin - menuMargin);
                        button._menu.style.maxHeight = menuHeight + 'px';
                    }
                    button._menu.style.top = (button.offsetTop - menuHeight - (menuMargin * 2)) + 'px';
                } else {
                    menuHeight = (downsideSpace - menuMargin - menuMargin);
                    button._menu.style.maxHeight = menuHeight + 'px';
                }
            }

            setTimeout(function () {
                document.body.addEventListener('click', removeMenu);
                button.parentNode.addEventListener('click', removeMenu);
                button.on('click', removeMenu);
            }, 0);
        }
    });
    Flagrate.extendObject(button, this);

    button.addClassName(Flagrate.className + '-pulldown');
    if (option.className) { button.addClassName(option.className); }

    Flagrate.createElement('span', { 'class': Flagrate.className + '-pulldown-triangle' }).insertTo(button);

    if (option.style) { button.setStyle(option.style); }
    if (option.color) { button.setColor(option.color); }

    if (option.isDisabled) { button.disable(); }

    var removeMenu = function () {

        document.body.removeEventListener('click', removeMenu);
        button.parentNode.removeEventListener('click', removeMenu);
        button.off('click', removeMenu);

        button._menu.style.opacity = '0';
        setTimeout(function () {

            if (!button._menu) {
                return;
            }

            button._menu.remove();
            delete button._menu;
        }, 250);
    };

    return button;
};

export function createPulldown(option?: IPulldownOption): IPulldown {
    return new Pulldown(option);
};