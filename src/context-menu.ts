/*?
 *  class Flagrate.ContextMenu
**/
export interface IContextMenuClass {
    new? (option?: IContextMenuOption): IContextMenu;
    (option?: IContextMenuOption): void;
    prototype: IContextMenuInstance;
}

export interface IContextMenu extends IContextMenuInstance { }

export interface IContextMenuInstance {
    open? (): IContextMenu;
    close? (): IContextMenu;
    
    /** Tells whether the visibility. */
    visible (): boolean;

    /** remove the elements and listeners. */
    remove (): void;
}

export interface IContextMenuOption {
    /** target element */
    target?: Flagrate.IElement;

    /** Button items */
    items?: Flagrate.IMenuItemOption[];
}

export var ContextMenu: IContextMenuClass = function (option: IContextMenuOption = {}): IContextMenu {

    this.target = option.target || null;
    this.items = option.items || null;

    this.isShowing = false;

    this.open = (e) => {

        e = e || window.event || {};

        if (e.preventDefault) {
            e.preventDefault();
        }

        if (this.isShowing) { this.close(); }

        this.isShowing = true;

        this._menu = <Flagrate.IMenu>new Flagrate.Menu({
            className: Flagrate.className + '-context-menu',
            items: this.items,
            onSelect: this.close.bind(this)
        });

        var x = e.clientX || 0;
        var y = e.clientY || 0;

        this._menu.style.opacity = 0;

        this._menu.insertTo(document.body);

        if (x + this._menu.getWidth() > window.innerWidth) {
            x = x - this._menu.getWidth();
        }

        if (y + this._menu.getHeight() > window.innerHeight) {
            y = y - this._menu.getHeight();
        }

        this._menu.style.top = y + 'px';
        this._menu.style.left = x + 'px';
        this._menu.style.opacity = 1;

        document.body.addEventListener('click', this.close);
        document.body.addEventListener('mouseup', this.close);
        document.body.addEventListener('mousewheel', this.close);

        return this;
    };

    this.close = () => {

        document.body.removeEventListener('click', this.close);
        document.body.removeEventListener('mouseup', this.close);
        document.body.removeEventListener('mousewheel', this.close);

        this.isShowing = false;

        var menu = this._menu;
        setTimeout(function () {
            if (menu && menu.remove) { menu.remove(); }
        }, 0);

        delete this._menu;

        return this;
    };

    if (this.target !== null) {
        this.target.addEventListener('contextmenu', this.open);
    }

    return this;
};

export function createContextMenu(option?: IContextMenuOption): IContextMenu {
    return new ContextMenu(option);
};

ContextMenu.prototype = {
    visible () {
        return this.isShowing;
    },
    
    remove () {
        if (this._menu) { this.close(); }

        if (this.target !== null) {
            this.target.removeEventListener('contextmenu', this.open);
        }
    }
};