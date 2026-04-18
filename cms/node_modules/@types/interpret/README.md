# Installation
> `npm install --save @types/interpret`

# Summary
This package contains type definitions for interpret (https://github.com/gulpjs/interpret).

# Details
Files were exported from https://github.com/DefinitelyTyped/DefinitelyTyped/tree/master/types/interpret.
## [index.d.ts](https://github.com/DefinitelyTyped/DefinitelyTyped/tree/master/types/interpret/index.d.ts)
````ts
/// <reference types="node" />

export interface Hook {
    (m: { extensions: string } | NodeJS.Module): any;
    install(m?: { extension: string; [key: string]: any }): void;
}

export type RegisterFn = (hook: Hook) => void;

export interface ExtensionDescriptor {
    module: string;
    register: RegisterFn;
}

export type Extension = string | ExtensionDescriptor | Array<string | ExtensionDescriptor>;
export interface Extensions {
    [extension: string]: Extension | null;
}

export const extensions: Extensions;
export const jsVariants: Extensions;

````

### Additional Details
 * Last updated: Fri, 14 Nov 2025 18:02:08 GMT
 * Dependencies: [@types/node](https://npmjs.com/package/@types/node)

# Credits
These definitions were written by [BendingBender](https://github.com/BendingBender).
