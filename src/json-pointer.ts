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
        var pts = validate_input(object, pointer);
        if (pts.length === 0) {
            return object;
        }
        return traverse(object, pts);
    }

    export function set<T>(object: Object, pointer: string, value: T): T {
        if (pointer === '' && typeof value === 'object') {
            Flagrate.extendObject(object, value);
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
        var part = untilde(pts.shift());

        if (pts.length !== 0) {// keep traversin!
            if (isSet && typeof object[part] !== 'object') {
                object[part] = {};
            }
            return traverse(object[part], pts, value, isSet);
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

        var pts = pointer.split('/');
        if (pts.shift() !== '') {
            throw new Error('Invalid JSON pointer.');
        }

        return pts;
    }

}