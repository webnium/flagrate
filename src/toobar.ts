/*?
 *  class Flagrate.Toolbar
**/
export interface IToolbarClass {
    new? (option?: IToolbarOption): IToolbar;
    (option?: IToolbarOption): void;
    prototype: IToolbarInstance;
}

export interface IToolbar extends IToolbarInstance, Flagrate.IElement { }

export interface IToolbarInstance {
    push(item: IToolbarItemOption): IToolbar;
    getElementByKey(key: string): Flagrate.IElement;
    getElements(): Flagrate.IElement[];
}

export interface IToolbarOption {
    /** id attribute. */
    id?: string;

    /** class attribute. */
    className?: string;

    /** attribute/value pairs properties. */
    attribute?: any;

    /** CSS style properties (uses Flagrate.Element.setStyle). */
    style?: any;

    /** items */
    items?: IToolbarItemOption[];
}

export interface IToolbarItemOption {
    /** key */
    key?: string;

    /** element */
    element?: Flagrate.IElement;

    /** if this true ignores element option */
    isBorder?: boolean;
}

export var Toolbar: IToolbarClass = function (option: IToolbarOption = {}): IToolbar {

    option.items = option.items || [];

    var attr = option.attribute || {};
    if (option.id) { attr.id = option.id; }

    //create
    var container = <IToolbar>new Flagrate.Element('div', attr);
    Flagrate.extendObject(container, this);

    container.addClassName(Flagrate.className + ' ' + Flagrate.className + '-toolbar');
    if (option.className) { container.addClassName(option.className); }

    if (option.style) { container.setStyle(option.style); }

    var i, l;
    for (i = 0, l = option.items.length; i < l; i++) {
        container.push(option.items[i]);
    }

    return container;
};

export function createToolbar(option?: IToolbarOption): IToolbar {
    return new Toolbar(option);
};

Toolbar.prototype = {
    push (option: IToolbarItemOption) {

        if (typeof option === 'string') {
            Flagrate.createElement('hr').insertTo(this);
        } else if (option instanceof HTMLElement) {
            this.insert(option);
        } else {
            var element;

            if (option.isBorder) {
                element = Flagrate.createElement('hr').insertTo(this);
            } else {
                element = Flagrate.Element.insertTo(option.element, this);
            }

            if (option.key) {
                element.dataset['_key'] = option.key;
            }
        }

        return this;
    },

    getElementByKey (key: string) {

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

    getElements () {
        return this.childNodes || [];
    }
};