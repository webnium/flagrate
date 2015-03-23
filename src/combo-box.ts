/*?
 *  class Flagrate.ComboBox
**/
export interface IComboBox extends IComboBoxInstance, Flagrate.IElement { }

export interface IComboBoxClass {
    new? (option?: IComboBoxOption): IComboBox;
    (option?: IComboBoxOption): void;
    prototype: IComboBoxInstance;
}

export interface IComboBoxInstance {
    disable(): IComboBox;
    enable(): IComboBox;
    isEnabled(): boolean;
    getValue(): any;
    setValue(value: string): IComboBox;
    setIcon(url?: string): IComboBox;
    getIcon(): string;
    isValid(): boolean;

    /** readonly. */
    items?: any[];
    
    /** RegExp for simple validation feature. */
    regexp?: RegExp;

    _textinput?: Flagrate.ITextInput;
    _button?: Flagrate.IButton;
    _menu?: Flagrate.IMenu;
}

export interface IComboBoxOption {
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

    /** Array of any value or, ISelectItemOption object. */
    items?: any[];

    /** placeholder. */
    placeholder?: string;

    /** icon image URL. */
    icon?: string;

    /** RegExp for simple validation feature. */
    regexp?: RegExp;

    /** default is false. */
    isDisabled?: boolean;
}

export var ComboBox: IComboBoxClass = function (option: IComboBoxOption = {}): IComboBox {

    this.items = option.items || [];
    this.regexp = option.regexp || null;

    var attr = option.attribute || {};

    if (option.id) { attr.id = option.id; }

    //create
    var container = <IComboBox>new Flagrate.Element('div', attr);

    container._textinput = new Flagrate.TextInput({
        value: option.value,
        placeholder: option.placeholder,
        icon: option.icon
    }).insertTo(container);

    var createOnSelectHandler = (value) => {
        return () => {
            container.setValue(value);
            container._textinput.focus();
            container.fire('change');
        };
    };

    container._button = new Flagrate.Button({
        onSelect: () => {

            if (container._menu) {
                container._menu.remove();
                delete container._menu;
                return;
            }

            var items = [];
            var i, l;
            for (i = 0, l = container.items.length; i < l; i++) {
                items.push({
                    label: container.items[i],
                    onSelect: createOnSelectHandler(container.items[i])
                });
            }

            var menu = container._menu = new Flagrate.Menu(
                {
                    className: Flagrate.className + '-combobox-menu',
                    items: items,
                    onSelect: () => {

                        menu.remove();
                        delete container._menu;
                    }
                }
                ).insertTo(container);

            // To prevent overflow.
            var menuHeight = menu.getHeight();
            var menuMargin = parseInt(menu.getStyle('margin-top').replace('px', ''), 10);
            var cummOffsetTop = container.cumulativeOffset().top;
            var upsideSpace = - window.pageYOffset + cummOffsetTop;
            var downsideSpace = window.pageYOffset + window.innerHeight - cummOffsetTop - container.getHeight();
            if (menuHeight + menuMargin > downsideSpace) {
                if (upsideSpace > downsideSpace) {
                    if (upsideSpace < menuHeight + menuMargin) {
                        menuHeight = (upsideSpace - menuMargin - menuMargin);
                        menu.style.maxHeight = menuHeight + 'px';
                    }
                    menu.addClassName(Flagrate.className + '-combobox-menu-upper');
                } else {
                    menuHeight = (downsideSpace - menuMargin - menuMargin);
                    menu.style.maxHeight = menuHeight + 'px';
                }
            }

            var removeMenu = (e) => {

                document.body.removeEventListener('click', removeMenu);
                container.parentNode.removeEventListener('click', removeMenu);
                container.off('click', removeMenu);

                menu.style.opacity = '0';
                setTimeout(() => menu.remove(), 500);

                delete container._menu;
            };

            setTimeout(() => {
                document.body.addEventListener('click', removeMenu);
                container.parentNode.addEventListener('click', removeMenu);
                container.on('click', removeMenu);
            }, 0);
        }
    }).insertTo(container);

    Flagrate.extendObject(container, this);

    container.addClassName(Flagrate.className + ' ' + Flagrate.className + '-combobox');
    if (option.className) { container.addClassName(option.className); }

    if (option.style) { container.setStyle(option.style); }

    if (option.isDisabled) { container.disable(); }

    return container;
};

export function createComboBox(option?: IComboBoxOption): IComboBox {
    return new ComboBox(option);
};

ComboBox.prototype = {
    disable () {

        this.addClassName(Flagrate.className + '-disabled');

        this._textinput.disable();
        this._button.disable();

        return this;
    },

    enable () {

        this.removeClassName(Flagrate.className + '-disabled');

        this._textinput.enable();
        this._button.enable();

        return this;
    },

    isEnabled () {
        return !this.hasClassName(Flagrate.className + '-disabled');
    },

    getValue () {
        return this._textinput.value;
    },

    setValue (value) {

        this._textinput.value = value;

        return this;
    },

    setIcon (identifier) {

        this._textinput.setIcon(identifier);

        return this;
    },

    getIcon () {
        return this._textinput.getIcon();
    },

    isValid () {
        return this.regexp.test(this.getValue());
    }
};