/*
   Copyright 2016 Webnium

   Licensed under the Apache License, Version 2.0 (the "License");
   you may not use this file except in compliance with the License.
   You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
*/
'use strict';

import { extendObject } from './util';

/*?
    class flagrate.Element

    The flagrate.Element object provides a variety of powerful DOM methods for interacting
    with DOM elements.

    #### Example

        var preview = flagrate.createElement().insertTo(x);
        preview.on('updated', function (e) {
            console.log('fired custom event', e);
        });

        var input = flagrate.createTextInput().insertTo(x);
        input.on('change', function () {
            preview.updateText(input.value);
            preview.fire('updated');
        });

    #### Inheritance

    * [HTMLElement](https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement) (MDN)
**/
export interface FHTMLElement extends Instance, HTMLElement { }
export interface FHTMLAnchorElement extends Instance, HTMLAnchorElement { }
export interface FHTMLPhraseElement extends Instance, HTMLPhraseElement { }
export interface FHTMLPhraseElement extends Instance, HTMLPhraseElement { }
export interface FHTMLBlockElement extends Instance, HTMLBlockElement { }
export interface FHTMLAppletElement extends Instance, HTMLAppletElement { }
export interface FHTMLAreaElement extends Instance, HTMLAreaElement { }
export interface FHTMLAudioElement extends Instance, HTMLAudioElement { }
export interface FHTMLPhraseElement extends Instance, HTMLPhraseElement { }
export interface FHTMLBaseElement extends Instance, HTMLBaseElement { }
export interface FHTMLBaseFontElement extends Instance, HTMLBaseFontElement { }
export interface FHTMLPhraseElement extends Instance, HTMLPhraseElement { }
export interface FHTMLPhraseElement extends Instance, HTMLPhraseElement { }
export interface FHTMLBlockElement extends Instance, HTMLBlockElement { }
export interface FHTMLBodyElement extends Instance, HTMLBodyElement { }
export interface FHTMLBRElement extends Instance, HTMLBRElement { }
export interface FHTMLButtonElement extends Instance, HTMLButtonElement { }
export interface FHTMLCanvasElement extends Instance, HTMLCanvasElement { }
export interface FHTMLTableCaptionElement extends Instance, HTMLTableCaptionElement { }
export interface FHTMLBlockElement extends Instance, HTMLBlockElement { }
export interface FHTMLPhraseElement extends Instance, HTMLPhraseElement { }
export interface FHTMLPhraseElement extends Instance, HTMLPhraseElement { }
export interface FHTMLTableColElement extends Instance, HTMLTableColElement { }
export interface FHTMLTableColElement extends Instance, HTMLTableColElement { }
export interface FHTMLDataListElement extends Instance, HTMLDataListElement { }
export interface FHTMLDDElement extends Instance, HTMLDDElement { }
export interface FHTMLModElement extends Instance, HTMLModElement { }
export interface FHTMLPhraseElement extends Instance, HTMLPhraseElement { }
export interface FHTMLDirectoryElement extends Instance, HTMLDirectoryElement { }
export interface FHTMLDivElement extends Instance, HTMLDivElement { }
export interface FHTMLDListElement extends Instance, HTMLDListElement { }
export interface FHTMLDTElement extends Instance, HTMLDTElement { }
export interface FHTMLPhraseElement extends Instance, HTMLPhraseElement { }
export interface FHTMLEmbedElement extends Instance, HTMLEmbedElement { }
export interface FHTMLFieldSetElement extends Instance, HTMLFieldSetElement { }
export interface FHTMLFontElement extends Instance, HTMLFontElement { }
export interface FHTMLFormElement extends Instance, HTMLFormElement { }
export interface FHTMLFrameElement extends Instance, HTMLFrameElement { }
export interface FHTMLFrameSetElement extends Instance, HTMLFrameSetElement { }
export interface FHTMLHeadingElement extends Instance, HTMLHeadingElement { }
export interface FHTMLHeadingElement extends Instance, HTMLHeadingElement { }
export interface FHTMLHeadingElement extends Instance, HTMLHeadingElement { }
export interface FHTMLHeadingElement extends Instance, HTMLHeadingElement { }
export interface FHTMLHeadingElement extends Instance, HTMLHeadingElement { }
export interface FHTMLHeadingElement extends Instance, HTMLHeadingElement { }
export interface FHTMLHeadElement extends Instance, HTMLHeadElement { }
export interface FHTMLHRElement extends Instance, HTMLHRElement { }
export interface FHTMLHtmlElement extends Instance, HTMLHtmlElement { }
export interface FHTMLPhraseElement extends Instance, HTMLPhraseElement { }
export interface FHTMLIFrameElement extends Instance, HTMLIFrameElement { }
export interface FHTMLImageElement extends Instance, HTMLImageElement { }
export interface FHTMLInputElement extends Instance, HTMLInputElement { }
export interface FHTMLModElement extends Instance, HTMLModElement { }
export interface FHTMLIsIndexElement extends Instance, HTMLIsIndexElement { }
export interface FHTMLPhraseElement extends Instance, HTMLPhraseElement { }
export interface FHTMLBlockElement extends Instance, HTMLBlockElement { }
export interface FHTMLLabelElement extends Instance, HTMLLabelElement { }
export interface FHTMLLegendElement extends Instance, HTMLLegendElement { }
export interface FHTMLLIElement extends Instance, HTMLLIElement { }
export interface FHTMLLinkElement extends Instance, HTMLLinkElement { }
export interface FHTMLBlockElement extends Instance, HTMLBlockElement { }
export interface FHTMLMapElement extends Instance, HTMLMapElement { }
export interface FHTMLMarqueeElement extends Instance, HTMLMarqueeElement { }
export interface FHTMLMenuElement extends Instance, HTMLMenuElement { }
export interface FHTMLMetaElement extends Instance, HTMLMetaElement { }
export interface FHTMLNextIdElement extends Instance, HTMLNextIdElement { }
export interface FHTMLPhraseElement extends Instance, HTMLPhraseElement { }
export interface FHTMLObjectElement extends Instance, HTMLObjectElement { }
export interface FHTMLOListElement extends Instance, HTMLOListElement { }
export interface FHTMLOptGroupElement extends Instance, HTMLOptGroupElement { }
export interface FHTMLOptionElement extends Instance, HTMLOptionElement { }
export interface FHTMLParagraphElement extends Instance, HTMLParagraphElement { }
export interface FHTMLParamElement extends Instance, HTMLParamElement { }
export interface FHTMLBlockElement extends Instance, HTMLBlockElement { }
export interface FHTMLPreElement extends Instance, HTMLPreElement { }
export interface FHTMLProgressElement extends Instance, HTMLProgressElement { }
export interface FHTMLQuoteElement extends Instance, HTMLQuoteElement { }
export interface FHTMLPhraseElement extends Instance, HTMLPhraseElement { }
export interface FHTMLPhraseElement extends Instance, HTMLPhraseElement { }
export interface FHTMLPhraseElement extends Instance, HTMLPhraseElement { }
export interface FHTMLPhraseElement extends Instance, HTMLPhraseElement { }
export interface FHTMLScriptElement extends Instance, HTMLScriptElement { }
export interface FHTMLSelectElement extends Instance, HTMLSelectElement { }
export interface FHTMLPhraseElement extends Instance, HTMLPhraseElement { }
export interface FHTMLSourceElement extends Instance, HTMLSourceElement { }
export interface FHTMLSpanElement extends Instance, HTMLSpanElement { }
export interface FHTMLPhraseElement extends Instance, HTMLPhraseElement { }
export interface FHTMLPhraseElement extends Instance, HTMLPhraseElement { }
export interface FHTMLStyleElement extends Instance, HTMLStyleElement { }
export interface FHTMLPhraseElement extends Instance, HTMLPhraseElement { }
export interface FHTMLPhraseElement extends Instance, HTMLPhraseElement { }
export interface FHTMLTableElement extends Instance, HTMLTableElement { }
export interface FHTMLTableSectionElement extends Instance, HTMLTableSectionElement { }
export interface FHTMLTableDataCellElement extends Instance, HTMLTableDataCellElement { }
export interface FHTMLTextAreaElement extends Instance, HTMLTextAreaElement { }
export interface FHTMLTableSectionElement extends Instance, HTMLTableSectionElement { }
export interface FHTMLTableHeaderCellElement extends Instance, HTMLTableHeaderCellElement { }
export interface FHTMLTableSectionElement extends Instance, HTMLTableSectionElement { }
export interface FHTMLTitleElement extends Instance, HTMLTitleElement { }
export interface FHTMLTableRowElement extends Instance, HTMLTableRowElement { }
export interface FHTMLTrackElement extends Instance, HTMLTrackElement { }
export interface FHTMLPhraseElement extends Instance, HTMLPhraseElement { }
export interface FHTMLPhraseElement extends Instance, HTMLPhraseElement { }
export interface FHTMLUListElement extends Instance, HTMLUListElement { }
export interface FHTMLPhraseElement extends Instance, HTMLPhraseElement { }
export interface FHTMLVideoElement extends Instance, HTMLVideoElement { }
export interface FHTMLBlockElement extends Instance, HTMLBlockElement { }

export interface Class {
    new (tagName: 'a', attribute?: Attribute): FHTMLAnchorElement;
    new (tagName: 'abbr', attribute?: Attribute): FHTMLPhraseElement;
    new (tagName: 'acronym', attribute?: Attribute): FHTMLPhraseElement;
    new (tagName: 'address', attribute?: Attribute): FHTMLBlockElement;
    new (tagName: 'applet', attribute?: Attribute): FHTMLAppletElement;
    new (tagName: 'area', attribute?: Attribute): FHTMLAreaElement;
    new (tagName: 'audio', attribute?: Attribute): FHTMLAudioElement;
    new (tagName: 'b', attribute?: Attribute): FHTMLPhraseElement;
    new (tagName: 'base', attribute?: Attribute): FHTMLBaseElement;
    new (tagName: 'basefont', attribute?: Attribute): FHTMLBaseFontElement;
    new (tagName: 'bdo', attribute?: Attribute): FHTMLPhraseElement;
    new (tagName: 'big', attribute?: Attribute): FHTMLPhraseElement;
    new (tagName: 'blockquote', attribute?: Attribute): FHTMLBlockElement;
    new (tagName: 'body', attribute?: Attribute): FHTMLBodyElement;
    new (tagName: 'br', attribute?: Attribute): FHTMLBRElement;
    new (tagName: 'button', attribute?: Attribute): FHTMLButtonElement;
    new (tagName: 'canvas', attribute?: Attribute): FHTMLCanvasElement;
    new (tagName: 'caption', attribute?: Attribute): FHTMLTableCaptionElement;
    new (tagName: 'center', attribute?: Attribute): FHTMLBlockElement;
    new (tagName: 'cite', attribute?: Attribute): FHTMLPhraseElement;
    new (tagName: 'code', attribute?: Attribute): FHTMLPhraseElement;
    new (tagName: 'col', attribute?: Attribute): FHTMLTableColElement;
    new (tagName: 'colgroup', attribute?: Attribute): FHTMLTableColElement;
    new (tagName: 'datalist', attribute?: Attribute): FHTMLDataListElement;
    new (tagName: 'dd', attribute?: Attribute): FHTMLDDElement;
    new (tagName: 'del', attribute?: Attribute): FHTMLModElement;
    new (tagName: 'dfn', attribute?: Attribute): FHTMLPhraseElement;
    new (tagName: 'dir', attribute?: Attribute): FHTMLDirectoryElement;
    new (tagName: 'div', attribute?: Attribute): FHTMLDivElement;
    new (tagName: 'dl', attribute?: Attribute): FHTMLDListElement;
    new (tagName: 'dt', attribute?: Attribute): FHTMLDTElement;
    new (tagName: 'em', attribute?: Attribute): FHTMLPhraseElement;
    new (tagName: 'embed', attribute?: Attribute): FHTMLEmbedElement;
    new (tagName: 'fieldset', attribute?: Attribute): FHTMLFieldSetElement;
    new (tagName: 'font', attribute?: Attribute): FHTMLFontElement;
    new (tagName: 'form', attribute?: Attribute): FHTMLFormElement;
    new (tagName: 'frame', attribute?: Attribute): FHTMLFrameElement;
    new (tagName: 'frameset', attribute?: Attribute): FHTMLFrameSetElement;
    new (tagName: 'h1', attribute?: Attribute): FHTMLHeadingElement;
    new (tagName: 'h2', attribute?: Attribute): FHTMLHeadingElement;
    new (tagName: 'h3', attribute?: Attribute): FHTMLHeadingElement;
    new (tagName: 'h4', attribute?: Attribute): FHTMLHeadingElement;
    new (tagName: 'h5', attribute?: Attribute): FHTMLHeadingElement;
    new (tagName: 'h6', attribute?: Attribute): FHTMLHeadingElement;
    new (tagName: 'head', attribute?: Attribute): FHTMLHeadElement;
    new (tagName: 'hr', attribute?: Attribute): FHTMLHRElement;
    new (tagName: 'html', attribute?: Attribute): FHTMLHtmlElement;
    new (tagName: 'i', attribute?: Attribute): FHTMLPhraseElement;
    new (tagName: 'iframe', attribute?: Attribute): FHTMLIFrameElement;
    new (tagName: 'img', attribute?: Attribute): FHTMLImageElement;
    new (tagName: 'input', attribute?: Attribute): FHTMLInputElement;
    new (tagName: 'ins', attribute?: Attribute): FHTMLModElement;
    new (tagName: 'isindex', attribute?: Attribute): FHTMLIsIndexElement;
    new (tagName: 'kbd', attribute?: Attribute): FHTMLPhraseElement;
    new (tagName: 'keygen', attribute?: Attribute): FHTMLBlockElement;
    new (tagName: 'label', attribute?: Attribute): FHTMLLabelElement;
    new (tagName: 'legend', attribute?: Attribute): FHTMLLegendElement;
    new (tagName: 'li', attribute?: Attribute): FHTMLLIElement;
    new (tagName: 'link', attribute?: Attribute): FHTMLLinkElement;
    new (tagName: 'listing', attribute?: Attribute): FHTMLBlockElement;
    new (tagName: 'map', attribute?: Attribute): FHTMLMapElement;
    new (tagName: 'marquee', attribute?: Attribute): FHTMLMarqueeElement;
    new (tagName: 'menu', attribute?: Attribute): FHTMLMenuElement;
    new (tagName: 'meta', attribute?: Attribute): FHTMLMetaElement;
    new (tagName: 'nextid', attribute?: Attribute): FHTMLNextIdElement;
    new (tagName: 'nobr', attribute?: Attribute): FHTMLPhraseElement;
    new (tagName: 'object', attribute?: Attribute): FHTMLObjectElement;
    new (tagName: 'ol', attribute?: Attribute): FHTMLOListElement;
    new (tagName: 'optgroup', attribute?: Attribute): FHTMLOptGroupElement;
    new (tagName: 'option', attribute?: Attribute): FHTMLOptionElement;
    new (tagName: 'p', attribute?: Attribute): FHTMLParagraphElement;
    new (tagName: 'param', attribute?: Attribute): FHTMLParamElement;
    new (tagName: 'plaintext', attribute?: Attribute): FHTMLBlockElement;
    new (tagName: 'pre', attribute?: Attribute): FHTMLPreElement;
    new (tagName: 'progress', attribute?: Attribute): FHTMLProgressElement;
    new (tagName: 'q', attribute?: Attribute): FHTMLQuoteElement;
    new (tagName: 'rt', attribute?: Attribute): FHTMLPhraseElement;
    new (tagName: 'ruby', attribute?: Attribute): FHTMLPhraseElement;
    new (tagName: 's', attribute?: Attribute): FHTMLPhraseElement;
    new (tagName: 'samp', attribute?: Attribute): FHTMLPhraseElement;
    new (tagName: 'script', attribute?: Attribute): FHTMLScriptElement;
    new (tagName: 'select', attribute?: Attribute): FHTMLSelectElement;
    new (tagName: 'small', attribute?: Attribute): FHTMLPhraseElement;
    new (tagName: 'source', attribute?: Attribute): FHTMLSourceElement;
    new (tagName: 'span', attribute?: Attribute): FHTMLSpanElement;
    new (tagName: 'strike', attribute?: Attribute): FHTMLPhraseElement;
    new (tagName: 'strong', attribute?: Attribute): FHTMLPhraseElement;
    new (tagName: 'style', attribute?: Attribute): FHTMLStyleElement;
    new (tagName: 'sub', attribute?: Attribute): FHTMLPhraseElement;
    new (tagName: 'sup', attribute?: Attribute): FHTMLPhraseElement;
    new (tagName: 'table', attribute?: Attribute): FHTMLTableElement;
    new (tagName: 'tbody', attribute?: Attribute): FHTMLTableSectionElement;
    new (tagName: 'td', attribute?: Attribute): FHTMLTableDataCellElement;
    new (tagName: 'textarea', attribute?: Attribute): FHTMLTextAreaElement;
    new (tagName: 'tfoot', attribute?: Attribute): FHTMLTableSectionElement;
    new (tagName: 'th', attribute?: Attribute): FHTMLTableHeaderCellElement;
    new (tagName: 'thead', attribute?: Attribute): FHTMLTableSectionElement;
    new (tagName: 'title', attribute?: Attribute): FHTMLTitleElement;
    new (tagName: 'tr', attribute?: Attribute): FHTMLTableRowElement;
    new (tagName: 'track', attribute?: Attribute): FHTMLTrackElement;
    new (tagName: 'tt', attribute?: Attribute): FHTMLPhraseElement;
    new (tagName: 'u', attribute?: Attribute): FHTMLPhraseElement;
    new (tagName: 'ul', attribute?: Attribute): FHTMLUListElement;
    new (tagName: 'var', attribute?: Attribute): FHTMLPhraseElement;
    new (tagName: 'video', attribute?: Attribute): FHTMLVideoElement;
    new (tagName: 'xmp', attribute?: Attribute): FHTMLBlockElement;
    new (tagName?: string, attribute?: Attribute): FHTMLElement;

    /** Tells whether `element` is visible. */
    visible<T extends HTMLElement>(element: T): boolean;

    /** Tells whether `element` is exists on document. */
    exists<T extends HTMLElement>(element: T): boolean;

    /** Toggles the visibility of `element`. */
    toggle<T extends HTMLElement>(element: T): T;

    /** Sets `display: none` on `element`. */
    hide<T extends HTMLElement>(element: T): T;

    /** Removes `display: none` on `element`. */
    show<T extends HTMLElement>(element: T): T;

    /** Completely removes `element` from the document. */
    remove<T extends HTMLElement>(element: T): void;

    /** Clear the _content_ of `element`. */
    update<T extends HTMLElement>(element: T): T;
    /** Update the _content_ of `element` with the `string` as HTML. */
    update<T extends HTMLElement>(element: T, string: string): T;
    /** **DEPRECATED**: Use updateText instead. */
    update<T extends HTMLElement>(element: T, number: number): T;
    /** Replaces the _content_ of `element` with the `newContent`. */
    update<T extends HTMLElement, U extends HTMLElement>(element: T, newContent: U): T;

    /** Update the _content_ of `element` with the `string` as Text. */
    updateText<T extends HTMLElement>(element: T, string: string): T;
    /** Update the _content_ of `element` with the `number` as Text. */
    updateText<T extends HTMLElement>(element: T, number: number): T;
    /** Update the _content_ of `element` with the `boolean` as Text. */
    updateText<T extends HTMLElement>(element: T, boolean: boolean): T;
    /** Update the _content_ of `element` with the `content` element as Text. */
    updateText<T extends HTMLElement, U extends HTMLElement>(element: T, content: U): T;

    /** Insert the `string` as HTML to the _content_ of `element`. */
    insert<T extends HTMLElement>(element: T, string: string): T;
    /** **DEPRECATED**: Use updateText instead. */
    insert<T extends HTMLElement>(element: T, number: number): T;
    /** Insert the `content` to the _content_ of `element`. */
    insert<T extends HTMLElement, U extends HTMLElement>(element: T, content: U): T;
    /** Insert the content(s) to the specific position of _content_ of `element` (Advanced).  */
    insert<T extends HTMLElement>(element: T, insertion: Insertion): T;

    /** Insert the `string` to the _content_ of `element` */
    insertText<T extends HTMLElement>(element: T, string: string): T;
    /** Insert the `number` as Text to the _content_ of `element` */
    insertText<T extends HTMLElement>(element: T, number: number): T;
    /** Insert the content(s) to the specific position of _content_ of `element` (Advanced). */
    insertText<T extends HTMLElement>(element: T, content: Insertion): T;

    /** Insert `element` to the _content_ of `element`. */
    insertTo<T extends HTMLElement, U extends HTMLElement>(element: T, to: U): T;
    /** Insert `element` to the specific position of _content_ of `element`. */
    insertTo<T extends HTMLElement, U extends HTMLElement>(element: T, to: U, position: InsertPosition): T;

    /** **DEPRECATED**: Use getAttribute instead. */
    readAttribute<T extends HTMLElement>(element: T, name: string): string;

    /** Set attribute `name`. */
    writeAttribute<T extends HTMLElement>(element: T, name: string): T;
    /** Set or Remove attribute `name`. */
    writeAttribute<T extends HTMLElement>(element: T, name: string, exists: boolean): T;
    /** Set value of attribute `name`. */
    writeAttribute<T extends HTMLElement>(element: T, name: string, value: string): T;
    /** Set attribute(s) by name/value pairs. */
    writeAttribute<T extends HTMLElement>(element: T, attribute: Attribute): T;

    /** Get dimenstions of `element`. */
    getDimensions<T extends HTMLElement>(element: T): Dimensions;

    /** Get height of `element`. */
    getHeight<T extends HTMLElement>(element: T): number;

    /** Get width of `element`. */
    getWidth<T extends HTMLElement>(element: T): number;

    /** Get cumulative offset of `element`. */
    cumulativeOffset<T extends HTMLElement>(element: T): Offset;

    /** Get cumulative scroll offset of `element`. */
    cumulativeScrollOffset<T extends HTMLElement>(element: T): Offset;

    /** Tells weather class name is exists. */
    hasClassName<T extends HTMLElement>(element: T, className: string): boolean;

    /** Add class name to `element`. */
    addClassName<T extends HTMLElement>(element: T, className: string): T;

    /** Remove class name from `element`. */
    removeClassName<T extends HTMLElement>(element: T, className: string): T;

    /** Toggles the class name of `element`. */
    toggleClassName<T extends HTMLElement>(element: T, className: string): T;

    /** Get value of style property of `element`. */
    getStyle<T extends HTMLElement>(element: T, propertyName: NumberProperty): number;
    /** Get value of style property of `element`. */
    getStyle<T extends HTMLElement>(element: T, propertyName: string): string;

    /** Set value of style property of `element`. */
    setStyle<T extends HTMLElement>(element: T, style: Property): T;

    /** Registers an event handler on a DOM element. */
    on<T extends HTMLElement>(element: T, eventType: string, listener: EventListener, useCapture?: boolean): T;

    /** Unregisters an event handler on a DOM element. */
    off<T extends HTMLElement>(element: T, eventType: string, listener?: EventListener, useCapture?: boolean): T;

    /** Fires a custom event. */
    fire<T extends HTMLElement>(element: T, eventType: string, property?: any): T;
    /** Emit a custom event. (alias of fire) */
    emit<T extends HTMLElement>(element: T, eventType: string, property?: any): T;

    // extra class methods

    /** Extends the given `element` instance. */
    extend<T extends HTMLElement>(element: T): FHTMLElement;

    /** Check object type. */
    isElement(object: any): boolean;
}

export interface createElement {
    (tagName: 'a', attribute?: Attribute): FHTMLAnchorElement;
    (tagName: 'abbr', attribute?: Attribute): FHTMLPhraseElement;
    (tagName: 'acronym', attribute?: Attribute): FHTMLPhraseElement;
    (tagName: 'address', attribute?: Attribute): FHTMLBlockElement;
    (tagName: 'applet', attribute?: Attribute): FHTMLAppletElement;
    (tagName: 'area', attribute?: Attribute): FHTMLAreaElement;
    (tagName: 'audio', attribute?: Attribute): FHTMLAudioElement;
    (tagName: 'b', attribute?: Attribute): FHTMLPhraseElement;
    (tagName: 'base', attribute?: Attribute): FHTMLBaseElement;
    (tagName: 'basefont', attribute?: Attribute): FHTMLBaseFontElement;
    (tagName: 'bdo', attribute?: Attribute): FHTMLPhraseElement;
    (tagName: 'big', attribute?: Attribute): FHTMLPhraseElement;
    (tagName: 'blockquote', attribute?: Attribute): FHTMLBlockElement;
    (tagName: 'body', attribute?: Attribute): FHTMLBodyElement;
    (tagName: 'br', attribute?: Attribute): FHTMLBRElement;
    (tagName: 'button', attribute?: Attribute): FHTMLButtonElement;
    (tagName: 'canvas', attribute?: Attribute): FHTMLCanvasElement;
    (tagName: 'caption', attribute?: Attribute): FHTMLTableCaptionElement;
    (tagName: 'center', attribute?: Attribute): FHTMLBlockElement;
    (tagName: 'cite', attribute?: Attribute): FHTMLPhraseElement;
    (tagName: 'code', attribute?: Attribute): FHTMLPhraseElement;
    (tagName: 'col', attribute?: Attribute): FHTMLTableColElement;
    (tagName: 'colgroup', attribute?: Attribute): FHTMLTableColElement;
    (tagName: 'datalist', attribute?: Attribute): FHTMLDataListElement;
    (tagName: 'dd', attribute?: Attribute): FHTMLDDElement;
    (tagName: 'del', attribute?: Attribute): FHTMLModElement;
    (tagName: 'dfn', attribute?: Attribute): FHTMLPhraseElement;
    (tagName: 'dir', attribute?: Attribute): FHTMLDirectoryElement;
    (tagName: 'div', attribute?: Attribute): FHTMLDivElement;
    (tagName: 'dl', attribute?: Attribute): FHTMLDListElement;
    (tagName: 'dt', attribute?: Attribute): FHTMLDTElement;
    (tagName: 'em', attribute?: Attribute): FHTMLPhraseElement;
    (tagName: 'embed', attribute?: Attribute): FHTMLEmbedElement;
    (tagName: 'fieldset', attribute?: Attribute): FHTMLFieldSetElement;
    (tagName: 'font', attribute?: Attribute): FHTMLFontElement;
    (tagName: 'form', attribute?: Attribute): FHTMLFormElement;
    (tagName: 'frame', attribute?: Attribute): FHTMLFrameElement;
    (tagName: 'frameset', attribute?: Attribute): FHTMLFrameSetElement;
    (tagName: 'h1', attribute?: Attribute): FHTMLHeadingElement;
    (tagName: 'h2', attribute?: Attribute): FHTMLHeadingElement;
    (tagName: 'h3', attribute?: Attribute): FHTMLHeadingElement;
    (tagName: 'h4', attribute?: Attribute): FHTMLHeadingElement;
    (tagName: 'h5', attribute?: Attribute): FHTMLHeadingElement;
    (tagName: 'h6', attribute?: Attribute): FHTMLHeadingElement;
    (tagName: 'head', attribute?: Attribute): FHTMLHeadElement;
    (tagName: 'hr', attribute?: Attribute): FHTMLHRElement;
    (tagName: 'html', attribute?: Attribute): FHTMLHtmlElement;
    (tagName: 'i', attribute?: Attribute): FHTMLPhraseElement;
    (tagName: 'iframe', attribute?: Attribute): FHTMLIFrameElement;
    (tagName: 'img', attribute?: Attribute): FHTMLImageElement;
    (tagName: 'input', attribute?: Attribute): FHTMLInputElement;
    (tagName: 'ins', attribute?: Attribute): FHTMLModElement;
    (tagName: 'isindex', attribute?: Attribute): FHTMLIsIndexElement;
    (tagName: 'kbd', attribute?: Attribute): FHTMLPhraseElement;
    (tagName: 'keygen', attribute?: Attribute): FHTMLBlockElement;
    (tagName: 'label', attribute?: Attribute): FHTMLLabelElement;
    (tagName: 'legend', attribute?: Attribute): FHTMLLegendElement;
    (tagName: 'li', attribute?: Attribute): FHTMLLIElement;
    (tagName: 'link', attribute?: Attribute): FHTMLLinkElement;
    (tagName: 'listing', attribute?: Attribute): FHTMLBlockElement;
    (tagName: 'map', attribute?: Attribute): FHTMLMapElement;
    (tagName: 'marquee', attribute?: Attribute): FHTMLMarqueeElement;
    (tagName: 'menu', attribute?: Attribute): FHTMLMenuElement;
    (tagName: 'meta', attribute?: Attribute): FHTMLMetaElement;
    (tagName: 'nextid', attribute?: Attribute): FHTMLNextIdElement;
    (tagName: 'nobr', attribute?: Attribute): FHTMLPhraseElement;
    (tagName: 'object', attribute?: Attribute): FHTMLObjectElement;
    (tagName: 'ol', attribute?: Attribute): FHTMLOListElement;
    (tagName: 'optgroup', attribute?: Attribute): FHTMLOptGroupElement;
    (tagName: 'option', attribute?: Attribute): FHTMLOptionElement;
    (tagName: 'p', attribute?: Attribute): FHTMLParagraphElement;
    (tagName: 'param', attribute?: Attribute): FHTMLParamElement;
    (tagName: 'plaintext', attribute?: Attribute): FHTMLBlockElement;
    (tagName: 'pre', attribute?: Attribute): FHTMLPreElement;
    (tagName: 'progress', attribute?: Attribute): FHTMLProgressElement;
    (tagName: 'q', attribute?: Attribute): FHTMLQuoteElement;
    (tagName: 'rt', attribute?: Attribute): FHTMLPhraseElement;
    (tagName: 'ruby', attribute?: Attribute): FHTMLPhraseElement;
    (tagName: 's', attribute?: Attribute): FHTMLPhraseElement;
    (tagName: 'samp', attribute?: Attribute): FHTMLPhraseElement;
    (tagName: 'script', attribute?: Attribute): FHTMLScriptElement;
    (tagName: 'select', attribute?: Attribute): FHTMLSelectElement;
    (tagName: 'small', attribute?: Attribute): FHTMLPhraseElement;
    (tagName: 'source', attribute?: Attribute): FHTMLSourceElement;
    (tagName: 'span', attribute?: Attribute): FHTMLSpanElement;
    (tagName: 'strike', attribute?: Attribute): FHTMLPhraseElement;
    (tagName: 'strong', attribute?: Attribute): FHTMLPhraseElement;
    (tagName: 'style', attribute?: Attribute): FHTMLStyleElement;
    (tagName: 'sub', attribute?: Attribute): FHTMLPhraseElement;
    (tagName: 'sup', attribute?: Attribute): FHTMLPhraseElement;
    (tagName: 'table', attribute?: Attribute): FHTMLTableElement;
    (tagName: 'tbody', attribute?: Attribute): FHTMLTableSectionElement;
    (tagName: 'td', attribute?: Attribute): FHTMLTableDataCellElement;
    (tagName: 'textarea', attribute?: Attribute): FHTMLTextAreaElement;
    (tagName: 'tfoot', attribute?: Attribute): FHTMLTableSectionElement;
    (tagName: 'th', attribute?: Attribute): FHTMLTableHeaderCellElement;
    (tagName: 'thead', attribute?: Attribute): FHTMLTableSectionElement;
    (tagName: 'title', attribute?: Attribute): FHTMLTitleElement;
    (tagName: 'tr', attribute?: Attribute): FHTMLTableRowElement;
    (tagName: 'track', attribute?: Attribute): FHTMLTrackElement;
    (tagName: 'tt', attribute?: Attribute): FHTMLPhraseElement;
    (tagName: 'u', attribute?: Attribute): FHTMLPhraseElement;
    (tagName: 'ul', attribute?: Attribute): FHTMLUListElement;
    (tagName: 'var', attribute?: Attribute): FHTMLPhraseElement;
    (tagName: 'video', attribute?: Attribute): FHTMLVideoElement;
    (tagName: 'xmp', attribute?: Attribute): FHTMLBlockElement;
    (tagName?: string, attribute?: Attribute): FHTMLElement;
}

export interface Instance {
    isFlagrated: boolean;

    /** Tells whether `element` is visible. */
    visible(): boolean;

    /** Tells whether `element` is exists on document. */
    exists(): boolean;

    /** Toggles the visibility of `element`. */
    toggle(): this;

    /** Sets `display: none` on `element`. */
    hide(): this;

    /** Removes `display: none` on `element`. */
    show(): this;

    /** Completely removes `element` from the document. */
    //remove(): void;

    /** Clear the _content_ of `element`. */
    update(): this;
    /** Update the _content_ of `element` with the `string` as HTML. */
    update(string: string): this;
    /** **DEPRECATED**: Use updateText instead. */
    update(number: number): this;
    /** Replaces the _content_ of `element` with the `newContent`. */
    update<T extends HTMLElement>(newContent: T): this;

    /** Update the _content_ of `element` with the `string` as Text. */
    updateText(string: string): this;
    /** Update the _content_ of `element` with the `number` as Text. */
    updateText(number: number): this;
    /** Update the _content_ of `element` with the `boolean` as Text. */
    updateText(boolean: boolean): this;
    /** Update the _content_ of `element` with the `content` element as Text. */
    updateText<T extends HTMLElement>(content: T): this;

    /** Insert the `string` as HTML to the _content_ of `element`. */
    insert(string: string): this;
    /** **DEPRECATED**: Use updateText instead. */
    insert(number: number): this;
    /** Insert the `content` to the _content_ of `element`. */
    insert<T extends HTMLElement>(content: T): this;
    /** Insert the content(s) to the specific position of _content_ of `element` (Advanced).  */
    insert(insertion: Insertion): this;

    /** Insert the `string` to the _content_ of `element` */
    insertText(string: string): this;
    /** Insert the `number` as Text to the _content_ of `element` */
    insertText(number: number): this;
    /** Insert the content(s) to the specific position of _content_ of `element` (Advanced). */
    insertText(content: Insertion): this;

    /** Insert `element` to the _content_ of `element`. */
    insertTo<T extends HTMLElement>(to: T): this;
    /** Insert `element` to the specific position of _content_ of `element`. */
    insertTo<T extends HTMLElement>(to: T, position: InsertPosition): this;

    /** **DEPRECATED**: Use getAttribute instead. */
    readAttribute(name: string): string;

    /** Set attribute `name`. */
    writeAttribute(name: string): this;
    /** Set or Remove attribute `name`. */
    writeAttribute(name: string, value: string): this;
    /** Set value of attribute `name`. */
    writeAttribute(name: string, exists: boolean): this;
    /** Set attribute(s) by name/value pairs. */
    writeAttribute(object: Attribute): this;

    /** Get dimenstions of `element`. */
    getDimensions(): Dimensions;

    /** Get height of `element`. */
    getHeight(): number;

    /** Get width of `element`. */
    getWidth(): number;

    /** Get cumulative offset of `element`. */
    cumulativeOffset(): Offset;

    /** Get cumulative scroll offset of `element`. */
    cumulativeScrollOffset(): Offset;

    /** Tells weather class name is exists. */
    hasClassName(className: string): boolean;

    /** Add class name to `element`. */
    addClassName(className: string): this;

    /** Remove class name from `element`. */
    removeClassName(className: string): this;

    /** Toggles the class name of `element`. */
    toggleClassName(className: string): this;

    /** Get value of style property of `element`. */
    getStyle(propertyName: NumberProperty): number;
    /** Get value of style property of `element`. */
    getStyle(propertyName: string): string;

    /** Set value of style property of `element`. */
    setStyle(style: Property): this;

    /** Registers an event handler on a DOM element. */
    on(eventType: string, listener: EventListener, useCapture?: boolean): this;

    /** Unregisters an event handler on a DOM element. */
    off(eventType: string, listener?: EventListener, useCapture?: boolean): this;

    /** Fires a custom event. */
    fire(eventType: string, property?: any): this;
    /** Emit a custom event. (alias of fire) */
    emit(eventType: string, property?: any): this;
}

export type Attribute = { [name: string]: string | boolean };
export type Property = { [name: string]: string };

export type NumberProperty = "opacity";

export type InsertPosition = "before" | "top" | "bottom" | "after";

export interface Insertion {
    before?: HTMLElement | string | number;
    top?: HTMLElement | string | number;
    bottom?: HTMLElement | string | number;
    after?: HTMLElement | string | number;
}

export interface Dimensions {
    width: number;
    height: number;
}

export interface Offset {
    top: number;
    left: number;
}

const _cache = {};

const _insertionTranslation = {
    before(element, node) {
        element.parentNode.insertBefore(node, element);
    },
    top(element, node) {
        element.insertBefore(node, element.firstChild);
    },
    bottom(element, node) {
        element.appendChild(node);
    },
    after(element, node) {
        element.parentNode.insertBefore(node, element.nextSibling);
    }
};

/*?
    flagrate.createElement([tagName = "div", attribute])
    new flagrate.Element([tagName = "div", attribute])
    - tagName (String) - The name of the HTML element to create.
    - attribute (Attribute) - An optional group of attribute/value pairs to set on the element.

    Creates an HTML element with `tagName` as the tag name, optionally with the given attributes.

    #### Example

        // The old way:
        var a = document.createElement('a');
        a.setAttribute('class', 'foo');
        a.setAttribute('href', '/foo.html');
        a.appendChild(document.createTextNode("Next page"));
        x.appendChild(a);

        // The new way:
        var a = flagrate.createElement('a', { 'class': 'foo', href: '/foo.html' })
                        .insertText("Next page")
                        .insertTo(x);
**/
function FElement(tagName: string = 'div', attribute?: Attribute) {

    let node: any;

    if (_cache[tagName]) {
        node = _cache[tagName].cloneNode(false);
    } else if ((attribute && attribute.hasOwnProperty('type')) || tagName === 'select') {
        node = document.createElement(tagName);
    } else {
        node = document.createElement(tagName);
        _cache[tagName] = node.cloneNode(false);
    }

    extendObject(node, this);

    return attribute ? node.writeAttribute(attribute) : node;
}

export const Element = FElement as any as Class;

export const createElement: createElement = (tagName, attribute) => {
    return new Element(tagName, attribute);
}

Element.prototype = {
    isFlagrated: true
};

/*?
    flagrate.Element.visible(element) -> Boolean
    - element (Element) - instance of Element.

    Tells whether `element` is visible

    This method is similar to http://api.prototypejs.org/dom/Element/visible/
**/
Element.visible = (element: HTMLElement) => {

    return element.style.display !== 'none';
};

/*?
    flagrate.Element.exists(element) -> Boolean
    - element (Element) - instance of Element.

    Tells whether `element` is exists on document.
**/
Element.exists = (element) => {

    if (element.parentNode) {
        while ((element = element.parentNode) !== null) {
            if (element === document) {
                return true;
            }
        }
    }

    return false;
};

/*?
    flagrate.Element.toggle(element) -> Element
    - element (Element) - instance of Element.

    Toggles the visibility of `element`. Returns `element`.

    This method is similar to http://api.prototypejs.org/dom/Element/toggle/
**/
Element.toggle = (element) => {

    return Element[Element.visible(element) ? 'hide' : 'show'](element);
};

/*?
    flagrate.Element.hide(element) -> Element
    - element (Element) - instance of Element.

    Sets `display: none` on `element`. Returns `element`.

    This method is similar to http://api.prototypejs.org/dom/Element/hide/
**/
Element.hide = (element) => {

    element.style.display = 'none';
    return element;
};

/*?
    flagrate.Element.show(element) -> Element
    - element (Element) - instance of Element.

    Removes `display: none` on `element`. Returns `element`.

    This method is similar to http://api.prototypejs.org/dom/Element/show/
**/
Element.show = (element) => {

    element.style.display = '';
    return element;
};

/*?
    flagrate.Element.remove(element) -> void
    - element (Element) - instance of Element.

    Completely removes `element` from the document and returns it.

    This method is similar to http://api.prototypejs.org/dom/Element/remove/
**/
Element.remove = (element) => {

    if (element.parentNode) {
        element.parentNode.removeChild(element);
    }

    return;
};

/*?
    flagrate.Element.update(element[, newContent]) -> Element
    - element (Element) - instance of Element.
    - newContent (String|Number|Element) - new content.

    Replaces _the content_ of `element` with the `newContent` argument and
    returns `element`.

    This method is similar to http://api.prototypejs.org/dom/Element/update/
**/
Element.update = (element, content?) => {

    let i = element.childNodes.length;
    while (i--) {
        Element.remove(element.childNodes[i]);
    }

    if (!content) {
        return element;
    }

    if (Element.isElement(content) === true) {
        element.appendChild(content);
        return element;
    }

    if (typeof content !== 'string') {
        content = content.toString(10);
    }

    element.innerHTML = content;

    return element;
};

/*?
    flagrate.Element.updateText(element[, newContent]) -> Element
    - element (Element) - instance of Element.
    - newContent (String|Number) - new text content.
**/
Element.updateText = (element, content) => {

    let i = element.childNodes.length;
    while (i--) {
        Element.remove(element.childNodes[i]);
    }

    if (content === undefined) {
        return element;
    }

    if (Element.isElement(content) === true && (content.toString !== void 0)) {
        return Element.updateText(element, content.toString());
    }

    if (typeof content !== 'string') {
        content = content.toString(10);
    }

    element.appendChild(document.createTextNode(content));

    return element;
};

/*?
    flagrate.Element.insert(element, content) -> Element
    - element (Element) - instance of Element.
    - content (String|Number|Element|Object) - The content to insert

    Inserts content `above`, `below`, at the `top`, and/or at the `bottom` of
    the given element, depending on the option(s) given.

    This method is similar to http://api.prototypejs.org/dom/Element/insert/
**/
Element.insert = (element, insertion) => {

    if (typeof insertion === 'string' || typeof insertion === 'number' || Element.isElement(insertion) === true) {
        insertion = { bottom: insertion };
    }

    let position, content, insert, div;
    for (position in insertion) {
        if (insertion.hasOwnProperty(position)) {
            content = insertion[position];
            position = position.toLowerCase();
            insert = _insertionTranslation[position];

            if (Element.isElement(content) === true) {
                insert(element, content);
                continue;
            }

            if (typeof content !== 'string') {
                content = content.toString(10);
            }

            div = new Element();
            div.innerHTML = content;
            if (position === 'top' || position === 'after') {
                [...div.childNodes].reverse();
            }
            while (div.childNodes.length !== 0) {
                insert(element, div.childNodes[0]);
            }
        }
    }

    return element;
};

/*?
    flagrate.Element.insertText(element, content) -> Element
    - element (Element) - instance of Element.
    - content (String|Number|Object) - The content to insert

    Inserts content `above`, `below`, at the `top`, and/or at the `bottom` of
    the given element, depending on the option(s) given.
**/
Element.insertText = (element, insertion) => {

    if (typeof insertion === 'string' || typeof insertion === 'number') {
        insertion = { bottom: insertion };
    }

    let position, content, insert;
    for (position in insertion) {
        if (insertion.hasOwnProperty(position)) {
            content = insertion[position];
            position = position.toLowerCase();
            insert = _insertionTranslation[position];

            if (typeof content !== 'string') {
                content = content.toString(10);
            }

            insert(element, document.createTextNode(content));
        }
    }

    return element;
};

/*?
    flagrate.Element.insertTo(element, to[, position = "bottom"]) -> Element
    - element (Element) - insert this.
    - to (Element) - insert to this element.
    - position (String) - `before` or `top` or `bottom` or `after`.
**/
Element.insertTo = (element, to, position = 'bottom') => {

    var insertion = {};

    if (position) {
        insertion[position] = element;
    } else {
        insertion['bottom'] = element;
    }

    Element.insert(to, insertion);

    return element;
};

/*?
    flagrate.Element.readAttribute(element, attributeName) -> String | null
    - element (Element) - instance of Element.
    - attributeName (String) - attribute name.

    Returns the value of `element`'s `attribute` or `null` if `attribute` has
    not been specified.

    This method is similar to http://api.prototypejs.org/dom/Element/readAttribute/
**/
Element.readAttribute = (element, name) => {

    // ref: https://github.com/sstephenson/prototype/blob/1fb9728/src/dom/dom.js#L1856

    return element.getAttribute(name);
};

/*?
    flagrate.Element.writeAttribute(element, attribute[, value = true]) -> Element
    - element (Element) - instance of Element.
    - attribute (String|Object) - attribute name or name/value pairs object.
    - value (Boolean|String) - value of attribute.

    Adds, specifies or removes attributes passed as either a hash or a name/value pair.

    This method is similar to http://api.prototypejs.org/dom/Element/writeAttribute/
**/
Element.writeAttribute = (element: HTMLElement, name, value?) => {

    let attr: Attribute;

    if (typeof name === 'object') {
        attr = name;
    } else {
        attr = {};
        attr[name] = (value === undefined) ? true : value;
    }

    let k;
    for (k in attr) {
        if (attr.hasOwnProperty(k) === true) {
            value = attr[k];
            if (value === false || value === null) {
                element.removeAttribute(k);
            } else if (value === true) {
                element.setAttribute(k, k);
            } else if (value !== undefined) {
                element.setAttribute(k, value);
            }
        }
    }

    return element;
};

/*?
    flagrate.Element.getDimensions(element) -> Object
    - element (Element) - instance of Element.

    Finds the computed width and height of `element` and returns them as
    key/value pairs of an object.

    This method is similar to http://api.prototypejs.org/dom/Element/getDimensions/
**/
Element.getDimensions = (element: HTMLElement) => {

    const display = Element.getStyle(element, 'display');

    if (display && display !== 'none') {
        return {
            width: element.offsetWidth,
            height: element.offsetHeight
        };
    }

    const before: any = {
        visibility: element.style.visibility,
        position: element.style.position,
        display: element.style.display
    };

    const after: any = {
        visibility: 'hidden',
        display: 'block'
    };

    // Switching `fixed` to `absolute` causes issues in Safari.
    if (before.position !== 'fixed') {
        after.position = 'absolute';
    }

    Element.setStyle(element, after);

    const dimensions = {
        width: element.offsetWidth,
        height: element.offsetHeight
    };

    Element.setStyle(element, before);

    return dimensions;
};

/*?
    flagrate.Element.getHeight(element) -> Number
    - element (Element) - instance of Element.

    This method is similar to http://api.prototypejs.org/dom/Element/getHeight/
**/
Element.getHeight = (element) => {

    return Element.getDimensions(element).height;
};

/*?
    flagrate.Element.getWidth(element) -> Number
    - element (Element) - instance of Element.

    This method is similar to http://api.prototypejs.org/dom/Element/getWidth/
**/
Element.getWidth = (element) => {

    return Element.getDimensions(element).width;
};

/*?
    flagrate.Element.cumulativeOffset(element) -> Object
    - element (Element) - instance of Element.

    This method is similar to http://api.prototypejs.org/dom/Element/cumulativeOffset/
**/
Element.cumulativeOffset = (element) => {

    let t = 0, l = 0;
    if (element.parentNode) {
        do {
            t += element.offsetTop || 0;
            l += element.offsetLeft || 0;
            element = element.offsetParent;
        } while (element);
    }

    return {
        top: t,
        left: l
    };
};

/*?
    flagrate.Element.cumulativeScrollOffset(element) -> Object
    - element (Element) - instance of Element.

    This method is similar to http://api.prototypejs.org/dom/Element/cumulativeScrollOffset/
**/
Element.cumulativeScrollOffset = (element) => {

    let t = 0, l = 0;
    do {
        t += element.scrollTop || 0;
        l += element.scrollLeft || 0;
        // for Chrome
        if (element.parentNode === document.body && document.documentElement.scrollTop !== 0) {
            element = document.documentElement;
        } else {
            element = element.parentNode;
        }
    } while (element);

    return {
        top: t,
        left: l
    };
};

/*?
    Flagrate.Element.hasClassName(element, className) -> Boolean
    - element (Element) - instance of Element.
    - className (String) -

    This method is similar to http://api.prototypejs.org/dom/Element/hasClassName/
**/
Element.hasClassName = (element, className) => {

    return (element.className.length > 0 && (element.className === className || new RegExp('(^|\\s)' + className + '(\\s|$)').test(element.className)));
};

/*?
    flagrate.Element.addClassName(element, className) -> Element
    - element (Element) - instance of Element.
    - className (String) - The class name to add.

    This method is similar to http://api.prototypejs.org/dom/Element/addClassName/
**/
Element.addClassName = (element, className) => {

    if (!Element.hasClassName(element, className)) {
        element.className += (element.className ? ' ' : '') + className;
    }

    return element;
};

/*?
    flagrate.Element.removeClassName(element, className) -> Element
    - element (Element) - instance of Element.
    - className (String) -

    This method is similar to http://api.prototypejs.org/dom/Element/removeClassName/
**/
Element.removeClassName = (element, className) => {

    element.className = element.className.replace(new RegExp('(^|\\s+)' + className + '(\\s+|$)'), ' ').trim();

    return element;
};

/*?
    flagrate.Element.toggleClassName(element, className) -> Element
    - element (Element) - instance of Element.
    - className (String) -

    This method is similar to http://api.prototypejs.org/dom/Element/toggleClassName/
**/
Element.toggleClassName = (element, className) => {

    return Element[Element.hasClassName(element, className) ? 'removeClassName' : 'addClassName'](element, className);
};

/*?
    flagrate.Element.getStyle(element, propertyName) -> String | Number | null
    - element (Element) - instance of Element.
    - propertyName (String) - The property name of style to be retrieved.

    This method is similar to http://api.prototypejs.org/dom/Element/getStyle/
**/
Element.getStyle = (element, style) => {

    style = style === 'float' ? 'cssFloat' : style.replace(/-+([a-z])?/g, (m, s) => {
        return s ? s.toUpperCase() : '';
    });

    let value = element.style[style];
    if (!value || value === 'auto') {
        const css = document.defaultView.getComputedStyle(element, null);
        value = css && (css[style] !== void 0) && css[style] !== "" ? css[style] : null;
    }

    if (style === 'opacity') {
        return value ? parseFloat(value) : 1.0;
    }

    return value === 'auto' ? null : value;
};

/*?
    flagrate.Element.setStyle(element, style) -> Element
    - element (Element) - instance of Element.
    - style (Object) -

    This method is similar to http://api.prototypejs.org/dom/Element/setStyle/
**/
Element.setStyle = (element, style) => {

    let p;
    for (p in style) {
        if (style.hasOwnProperty(p)) {
            element.style[(p === 'float' || p === 'cssFloat') ? 'cssFloat' : p] = style[p];
        }
    }

    return element;
};

/*?
    flagrate.Element.on(element, eventName, listener[, useCapture = false]) -> Element
    - element (Element) - instance of Element.
    - eventName (String) - name of event.
    - listener (Function) - The function to call when the event occurs.
    - useCapture (Boolean) -

    Registers an event handler on a DOM element.
**/
Element.on = (element, name, listener, useCapture) => {

    if (element._flagrateEvent === undefined) {
        element._flagrateEvent = {};
    }
    if (element._flagrateEvent[name] === undefined) {
        element._flagrateEvent[name] = [];
    }
    element._flagrateEvent[name].push({
        listener: listener,
        useCapture: useCapture
    });

    element.addEventListener(name, listener, useCapture || false);

    return element;
};

/*?
    flagrate.Element.off(element, eventName[, listener, useCapture = false]) -> Element
    - element (Element) - instance of Element.
    - eventName (String) - name of event.
    - listener (Function) - The function to call when the event occurs.
    - useCapture (Boolean) -

    Unregisters an event handler on a DOM element.
**/
Element.off = (element, name, listener?, useCapture?) => {

    if (listener) {
        element.removeEventListener(name, listener, useCapture || false);
        return;
    }

    if (element._flagrateEvent === undefined) {
        element._flagrateEvent = {};
    }
    if (element._flagrateEvent[name] === undefined) {
        element._flagrateEvent[name] = [];
    }

    element._flagrateEvent[name].forEach(fevent => {
        element.removeEventListener(name, fevent.listener, fevent.useCapture || false);
    });

    return element;
};

/*?
    flagrate.Element.fire(element, eventName[, property]) -> Element
    - element (Element) - instance of Element.
    - eventName (String) - name of event.
    - property (Object) -

    Fires a custom event.
**/
Element.fire = (element, name, property) => {

    const event = document.createEvent('HTMLEvents');
    event.initEvent(name, true, true);
    if (property) {
        extendObject(event, property);
    }
    element.dispatchEvent(event);

    return element;
};

/*?
    flagrate.Element.emit(element, eventName[, property]) -> Element
    Alias of: flagrate.Element.fire
**/
Element.emit = Element.fire;

//
// create instance methods
//

for (const name in Element) {
    if (!(name in Element.prototype)) {
        Element.prototype[name] = wrapper(name);
    }
}

function wrapper(name: string) {
    return function() {
        return Element[name](this, ...arguments);
    }
}

//
// extra class methods
//

/*?
    flagrate.Element.extend(element) -> flagrate.Element
    - element (Element) - instance of Element.

    Extends the given `element` instance.

    **Caution**: This method will add Flagrate.Element instance methods to given element instance.
**/
Element.extend = (element) => {

    if (element.isFlagrated) {
        return element;
    }

    extendObject(element, Element.prototype);

    return element;
};

/*?
    flagrate.Element.isElement(element) -> Boolean
    - element (Element) - instance of Element.
**/
if (typeof HTMLElement === 'object') {
    Element.isElement = (object) => {
        return object instanceof HTMLElement;
    };
} else {
    Element.isElement = (object) => {
        return !!(object && object.nodeType === 1 && typeof object.nodeName === 'string');
    };
}