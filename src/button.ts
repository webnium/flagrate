/*?
 *  class Flagrate.Button
 *  
 *  #### Example
 *  
 *      var button = Flagrate.createButton({
 *        label   : 'foo',
 *        icon    : 'icon.png',
 *        onSelect: function () {
 *          alert('hey');
 *        }
 *      }).insertTo(x);
 *  
 *  #### Structure
 *  
 *      <button class="flagrate flagrate-button flagrate-icon" style="background-image: url(icon.png);">foo</button>
 *
 *  #### Event
 *
 *  * `select`:
 *  
 *  #### Inheritances
 *  
 *  * Flagrate.Element
 *  * [HTMLButtonElement](https://developer.mozilla.org/en-US/docs/Web/API/HTMLButtonElement) (MDN)
**/
export interface IButtonClass {
    new? (option?: IButtonOption): IButton;
    (option?: IButtonOption): void;
    prototype: IButtonInstance;
}

export interface IButton extends IButtonInstance, Flagrate.IElement {}

export interface IButtonInstance extends Flagrate.IElementInstance {
    select(): IButton;
    disable(): IButton;
    enable(): IButton;
    isEnabled(): boolean;
    setLabel(label: string): IButton;
    setColor(color?: string): IButton;
    getColor(): string;
    setIcon(url?: string): IButton;
    getIcon(): string;

    _label?: Flagrate.IElement;
    _removeButton?: Flagrate.IElement;
    _onSelectHandler(event: any): void;
    _onRemoveHandler(event: any): void;
}

export interface IButtonOption {
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
    isFocused?: boolean;
    
    /** default is false. */
    isDisabled?: boolean;
    
    /** default is false. */
    isRemovableByUser?: boolean;

    onSelect? (event?: any, button?: IButton): void;
    onRemove? (event?: any, button?: IButton): void;
}

/*?
 *  Flagrate.createButton([option])
 *  new Flagrate.Button([option])
 *  
 *  Button.
**/
export var Button: IButtonClass = function (option: IButtonOption = {}): IButton {

    option.label = option.label || '';
    option.isRemovableByUser = option.isRemovableByUser || false;

    this.onSelect = option.onSelect || Flagrate.emptyFunction;
    this.onRemove = option.onRemove || Flagrate.emptyFunction;

    var attr = option.attribute || {};

    if (option.id) { attr.id = option.id; }
    if (option.isFocused) { attr.autofocus = true; }

    if (!attr.type) { attr.type = 'button'; }

    // create a button element
    var button = <IButton>new Flagrate.Element('button', attr);
    Flagrate.extendObject(button, this);

    button._label = new Flagrate.Element('span').updateText(option.label).insertTo(button);

    button.addClassName(Flagrate.className + ' ' + Flagrate.className + '-button');
    if (option.className) { button.addClassName(option.className); }

    button.on('click', button._onSelectHandler.bind(button), true);

    if (option.isRemovableByUser) {
        button.addClassName(Flagrate.className + '-button-removable');

        button._removeButton = new Flagrate.Element('button', {
            type: 'button',
            'class': Flagrate.className + '-button-remove'
        }).insertTo(button);
        button._removeButton.on('click', button._onRemoveHandler.bind(button), true);
    }

    if (option.style) { button.setStyle(option.style); }
    if (option.color) { button.setColor(option.color); }
    if (option.icon) { button.setIcon(option.icon); }

    if (option.isDisabled) { button.disable(); }

    return button;
};

/**
 *  @param option options.
**/
export function createButton(option?: IButtonOption): IButton {
    return new Button(option);
}

Button.prototype = {
    select () {
        return this._onSelectHandler(null);
    },

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

    setLabel (text) {

        this._label.updateText(text);

        return this;
    },

    setColor (color) {

        if (color.charAt(0) === '@') {
            this.style.backgroundColor = '';
            this.addClassName(Flagrate.className + '-button-color-' + color.slice(1));
        } else {
            this.style.backgroundColor = color;
        }

        this._color = color;

        return this;
    },

    getColor () {
        return this._color || '';
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

    _onSelectHandler (e) {

        if (this.isEnabled() === false) { return; }

        // for Firefox <- until when..?
        if (this._removeButton && e && e.layerX) {
            var bw = this.getWidth();
            var bh = this.getHeight();
            var bp = this._removeButton.getStyle('margin-right') === null ? 0 : parseInt(this._removeButton.getStyle('margin-right').replace('px', ''), 10);
            var rw = this._removeButton.getWidth();
            var rh = this._removeButton.getHeight();
            var lx = e.layerX;
            var ly = e.layerY;

            var isHitRemoveButton = (
                lx > bw - bp - rw &&
                lx < bw - bp &&
                ly > bh - ((bh - rh) / 2) - rh &&
                ly < bh - ((bh - rh) / 2)
            );
            if (isHitRemoveButton) {
                this._onRemoveHandler(e);

                return this;
            }
        }

        e.targetButton = this;

        this.onSelect(e, this);
        this.fire('select', { targetButton: this });
    },

    _onRemoveHandler (e) {

        if (this.isEnabled() && this.remove()) { this.onRemove(e); }
    }
};