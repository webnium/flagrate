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

/**
 * Identity.
 */
export function identity<T>(a: T): T {
    return a;
}

/**
 * Extend Object.
 */
export function extendObject<T, U>(dest: T, source: U): T {

    let k;
    for (k in source) {
        dest[k] = source[k];
    }

    return dest;
}

/**
 * Placeholder.
 */
export function emptyFunction(...args: any[]): any;
export function emptyFunction() {}

/*?
    Flagrate#jsonPointer

    ref: node-jsonpointer https://github.com/janl/node-jsonpointer
    ref: http://tools.ietf.org/html/draft-ietf-appsawg-json-pointer-08
**/
/**
 * JSON Pointer Implementation.
 */
export namespace jsonPointer {

    export function get(object: Object, pointer: string): any {

        var pts = validate_input(object, pointer);
        if (pts.length === 0) {
            return object;
        }
        return traverse(object, pts);
    }

    export function set<T>(object: Object, pointer: string, value: T): T {

        if (pointer === '' && typeof value === 'object') {
            extendObject(object, value);
            return value;
        } else {
            var pts = validate_input(object, pointer);
            if (pts.length === 0) {
                throw new Error('Invalid JSON pointer for set.');
            }
            return traverse(object, pts, value, true);
        }
    }

    function untilde(str: string): string {

        return str.replace(/~[01]/g, function (m) {
            switch (m) {
                case '~0':
                    return '~';
                case '~1':
                    return '/';
            }
            throw new Error('Invalid tilde escape: ' + m);
        });
    }

    function traverse<T>(object: Object, pts: string[], value?: T, isSet?: boolean): T;
    function traverse(object: Object, pts: string[], value?, isSet?): any {

        var part:any = untilde(pts.shift());
        if (/^\d+$/.test(part)) {
            part = parseInt(part, 10);
        }
        if (pts.length !== 0) {// keep traversin!
            if (isSet && typeof object[part] !== 'object') {
                if (value === void 0) {
                    return value;
                }
                if (/^\d+$/.test(pts[0])) {
                    object[part] = [];
                } else {
                    object[part] = {};
                }
            }
            return traverse(object[part], pts, value, isSet);
        }
        // we're done
        if (!isSet) {
            // just reading
            return object[part];
        }
        // set new value, and return
        if (value === void 0) {
            delete object[part];
        } else {
            object[part] = value;
        }
        return value;
    }

    function validate_input(object: Object, pointer: string): string[] {

        if (typeof object !== 'object') {
            throw new Error('Invalid input object.');
        }

        if (pointer === '') {
            return [];
        }

        if (!pointer) {
            throw new Error('Invalid JSON pointer.');
        }

        var pts = pointer.split('/');
        if (pts.shift() !== '') {
            throw new Error('Invalid JSON pointer.');
        }

        return pts;
    }
}