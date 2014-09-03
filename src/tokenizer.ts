/*?
 *  class Flagrate.Tokenizer
 *
 *  #### Event
 *
 *  * `change`: when the tokens/values is changed.
**/
export interface ITokenizer extends ITokenizerInstance, Flagrate.IElement { }

export interface ITokenizerClass {
    new? (option?: ITokenizerOption): ITokenizer;
    (option?: ITokenizerOption): void;
    prototype: ITokenizerInstance;
}

export interface ITokenizerInstance extends Flagrate.IElementInstance {
    disable(): ITokenizer;
    enable(): ITokenizer;
    isEnabled(): boolean;
    setValues(values: string[]): ITokenizer;
    getValues(): string[];
    removeValues(): ITokenizer;
    removeValue(value: string): ITokenizer;
    setIcon(url?: string): ITokenizer;
    getIcon(): string;

    onChange? (event?: any, tokenizer?: ITokenizer): void;
    values?: string[];
    max?: number;

    _updateTokens(): ITokenizer;
    _tokenize(): ITokenizer;
    _tokenized(candidates: string[]): ITokenizer;
    _tokenized(candidates: string): ITokenizer;
    _onClickHandler(event: any): void;
    _onKeydownHandler(event: any): void;
    _onFocusHandler(event: any): void;
    _onBlurHandler(event: any): void;
    _createTokenButtonOnRemoveHandler(tokenizer: ITokenizer, value: string): any;
    _createMenuOnSelectHandler(tokenizer: ITokenizer, cadidate: string): any;

    _tokens?: Flagrate.IElement;
    _input?: Flagrate.ITextInput;
}

export interface ITokenizerOption {
    /** id attribute. */
    id?: string;

    /** class attribute. */
    className?: string;

    /** attribute/value pairs properties. */
    attribute?: any;

    /** CSS style properties (uses Flagrate.Element.setStyle). */
    style?: any;

    /** default values. */
    values?: string[];

    /** default is `-1`. */
    max?: number;

    /** placeholder. */
    placeholder?: string;

    /** icon image URL. */
    icon?: string;

    /** default is Flagrate.identity */
    tokenize? (input: string, done: ITokenizerTokenizedCallback): void;
    tokenizeSync? (input: string): string[];

    /** default is false. */
    isDisabled?: boolean;

    onChange? (event?: any, tokenizer?: ITokenizer): void;
}

export interface ITokenizerTokenizedCallback {
    (output: string[]): void;
    (output: string): void;
}

export var Tokenizer: ITokenizerClass = function (option: ITokenizerOption = {}): ITokenizer {
    
    this.values = option.values || [];
    this.max = option.max || -1;
    this.tokenize = option.tokenize || option.tokenizeSync || Flagrate.identity;

    if (option.onChange) { this.onChange = option.onChange; }

    var attr = option.attribute || {};
    if (option.id) { attr.id = option.id; }

    //create
    var tokenizer = <ITokenizer>new Flagrate.Element('div', attr);
    Flagrate.extendObject(tokenizer, this);

    tokenizer.addClassName(Flagrate.className + ' ' + Flagrate.className + '-tokenizer');
    if (option.className) { tokenizer.addClassName(option.className); }


    tokenizer._tokens = new Flagrate.Element('span').insertTo(tokenizer);
    tokenizer._input = new Flagrate.TextInput({ placeholder: option.placeholder }).insertTo(tokenizer);

    if (tokenizer.values.length !== 0) {
        tokenizer._updateTokens();
    }

    tokenizer.on('click', tokenizer._onClickHandler.bind(tokenizer));

    tokenizer._input.on('keydown', tokenizer._onKeydownHandler.bind(tokenizer));
    tokenizer._input.on('focus', tokenizer._onFocusHandler.bind(tokenizer));
    tokenizer._input.on('blur', tokenizer._onBlurHandler.bind(tokenizer));

    if (option.style) { tokenizer.setStyle(option.style); }
    if (option.icon) { tokenizer.setIcon(option.icon); }

    if (option.isDisabled) { tokenizer.disable(); }

    return tokenizer;
};

export function createTokenizer(option?: ITokenizerOption): ITokenizer {
    return new Tokenizer(option);
};

Tokenizer.prototype = {
    disable () {

        this.addClassName(Flagrate.className + '-disabled');
        this._input.disable();

        return this._updateTokens();
    },

    enable () {

        this.removeClassName(Flagrate.className + '-disabled');
        this._input.enable();

        return this._updateTokens();
    },

    isEnabled () {
        return !this.hasClassName(Flagrate.className + '-disabled');
    },

    setValues (values: string[]) {

        this.values = values;

        return this._updateTokens();
    },

    getValues () {
        return this.values;
    },

    removeValues () {

        this.values = [];

        return this._updateTokens();
    },

    removeValue (value: string) {

        this.values.splice(this.values.indexOf(value), 1);

        return this._updateTokens();
    },

    setIcon (identifier) {

        this._iconIdentifier = identifier;

        if (identifier) {
            this.addClassName(Flagrate.className + '-icon').setStyle({
                backgroundImage: 'url(' + identifier + ')'
            });
        } else {
            this.removeClassName(Flagrate.className + '-icon').setStyle({
                backgroundImage: 'none'
            });
        }

        return this._updateTokens();
    },

    getIcon () {
        return this._iconIdentifier || '';
    },

    focus () {
        this._input.focus();
    },

    _updateTokens () {

        this._tokens.update();

        var i, l;
        for (i = 0, l = this.values.length; i < l; i++) {
            var value = this.values[i];

            var label = '';

            if (typeof value === 'string') {
                label = value;
            } else {
                label = value.label;
            }

            new Flagrate.Button({
                isDisabled: (this.isEnabled() === false),
                isRemovableByUser: (this.isEnabled()),
                onRemove: this._createTokenButtonOnRemoveHandler(this, value),
                label: label
            }).insertTo(this._tokens);
        }

        var vw = this.getWidth();
        var bw = this.getStyle('border-width') === null ? 2 : parseInt(this.getStyle('border-width').replace('px', ''), 10);
        var pl = this.getStyle('padding-left') === null ? 4 : parseInt(this.getStyle('padding-left').replace('px', ''), 10);
        var pr = this.getStyle('padding-right') === null ? 4 : parseInt(this.getStyle('padding-right').replace('px', ''), 10);
        var tw = this._tokens.getWidth();
        var tm = this._tokens.getStyle('margin-left') === null ? 2 : parseInt(this._tokens.getStyle('margin-left').replace('px', ''), 10);
        var im = this._input.getStyle('margin-left') === null ? 2 : parseInt(this._input.getStyle('margin-left').replace('px', ''), 10);
        var ip = this._input.getStyle('padding-left') === null ? 2 : parseInt(this._input.getStyle('padding-left').replace('px', ''), 10);
        var aw = vw - pl - pr - tw - tm - im - ip - (bw * 2) - 2;

        if (aw > 30) {
            this._input.style.width = aw + 'px';
        } else if (aw < -5) {
            this._input.style.width = '';
        } else {
            this._input.style.width = '100%';
        }

        this.fire('change');

        return this;
    },

    _tokenize () {

        this._candidates = [];

        var str = this._input.value;

        var result = this.tokenize(str, this._tokenized.bind(this));

        if (result !== void 0) { this._tokenized(result); }

        this._lastTokenizedValue = this._input.value;

        return this;
    },

    _tokenized (candidates) {

        if (candidates instanceof Array === false) { candidates = [candidates]; }

        this._candidates = [];

        var menu = new Flagrate.Menu({
            onSelect: function () {
                menu.remove();
            }
        });

        menu.style.left = this._input.offsetLeft + 'px';

        var i, l;
        for (i = 0, l = candidates.length; i < l; i++) {
            var candidate = candidates[i];

            var a;

            if (typeof candidate === 'string') {
                if (candidate === '') { continue; }
                a = { label: candidate };
            } else {
                a = candidate;
            }

            if (a.onSelect) { a._onSelect = a.onSelect; }

            a.onSelect = this._createMenuOnSelectHandler(this, candidate, a);

            this._candidates.push(candidate);
            menu.push(a);
        }

        if (this._menu) { this._menu.remove(); }

        if (this._candidates.length !== 0) {
            this.insert({ top: menu });
            this._menu = menu;
        }

        return this;
    },

    _onClickHandler () {
        this.focus();
    },

    _onKeydownHandler (e) {

        // ENTER:13
        if (e.keyCode === 13 && this._lastTokenizedValue !== this._input.value) {
            e.stopPropagation();
            e.preventDefault();

            this._lastTokenizedValue = this._input.value;

            this._tokenize();

            return;
        }

        if (this._candidates && this._candidates.length !== 0) {
            if (
                // ENTER:13
                (e.keyCode === 13) ||
                // right:39
                (e.keyCode === 39)
            ) {
                e.stopPropagation();
                e.preventDefault();

                this._input.value = '';
                if (this.max < 0 || this.max > this.values.length) {
                    this.values.push(this._candidates[0]);
                }
                this._updateTokens();
                
                if (this.onChange) { this.onChange(); }

                if (this._menu) { this._menu.remove(); }
            }
        }

        if (this._input.value === '' && this.values.length !== 0) {
            if (
                // BS:8
                (e.keyCode === 8)
            ) {
                e.stopPropagation();
                e.preventDefault();

                this._input.value = this.values.pop();
                this._updateTokens();

                if (this.onChange) { this.onChange(); }

                if (this._menu) { this._menu.remove(); }
            }
        }

        setTimeout(() => {

            if (this.max > -1 && this.max <= this.values.length && this._input.value !== '') {
                e.stopPropagation();

                this._input.value = '';

                return;
            }

            this._tokenize();
        }, 0);
    },

    _onFocusHandler () {

        this._updateTokens();
        this._tokenize();
    },

    _onBlurHandler () {

        this._input.value = '';
        if (this._menu) {
            this._menu.style.opacity = '0';
            setTimeout(() => { this._menu.remove(); }, 500);
        }
    },

    _createTokenButtonOnRemoveHandler (tokenizer: ITokenizer, value: string) {
        return function () { tokenizer.removeValue(value); };
    },

    _createMenuOnSelectHandler (tokenizer: ITokenizer, candidate: string) {

        return function (e) {

            if (tokenizer.max < 0 || tokenizer.max > tokenizer.values.length) {
                tokenizer.values.push(candidate);
            }
            tokenizer._updateTokens();

            if (tokenizer.onChange) { tokenizer.onChange(e, this); }
        };
    }
};