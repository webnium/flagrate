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
    //= include menu.ts
    //= include pulldown.ts
    //= include context-menu.ts
    //= include toolbar.ts
    //= include text-input.ts
    //= include tokenizer.ts
    //= include text-area.ts

}

import flagrate = Flagrate;