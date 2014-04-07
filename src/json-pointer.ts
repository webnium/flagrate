/*?
 *  Flagrate.jsonPointer
 *
 *  ref: node-jsonpointer https://github.com/janl/node-jsonpointer
 *  ref: http://tools.ietf.org/html/draft-ietf-appsawg-json-pointer-08
**/
/**
 *  Json Pointer Implementation.
 *  @namespace Flagrate.jsonPointer
**/
export module jsonPointer {

    export function get(object: Object, pointer: string): any {
        var pointers = validate_input(object, pointer);
        if (pointers.length === 0) {
            return object;
        }
        return traverse(object, pointers);
    }

    export function set<T>(object: Object, pointer: string, value: T): T {
        var pointers = validate_input(object, pointer);
        if (pointer.length === 0) {
            throw new Error('Invalid JSON pointer for set.');
        }
        return traverse(object, pointers, value, true);
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

    function traverse<T>(object: Object, pointers: string[], value?: T, isSet?: boolean): T;
    function traverse(object: Object, pointers: string[], value?, isSet?): any {
        var part = untilde(pointers.shift());

        if (pointers.length !== 0) {// keep traversin!
            if (isSet && typeof object[part] !== 'object') {
                object[part] = {};
            }
            return traverse(object[part], pointers, value, isSet);
        }
        // we're done
        if (value === void 0) {
            // just reading
            return object[part];
        }
        // set new value, and return
        if (value === null) {
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

        var pointers = pointer.split('/');
        var first = pointers.shift();
        if (first !== '') {
            throw new Error('Invalid JSON pointer.');
        }

        return pointers;
    }

}