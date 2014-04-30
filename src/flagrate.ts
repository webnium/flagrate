module Flagrate {

    export var className = 'flagrate';

    export function identity<T>(a: T): T {
        return a;
    }

    export function extendObject<T, U>(b: T, a: U): T {
        var k;
        for (k in a) {
            b[k] = a[k];
        }
        return b;
    }

    export function emptyFunction() { }
    
    //= include json-pointer.ts
    //= include element.ts
    //= include button.ts
    //= include buttons.ts

}

import flagrate = Flagrate;