'use strict';

class TypeExtender
{
    static getRootPrototypeInChain(type){
        var root = type.prototype;

        while(root !== null){
            if(root.__proto__ === null || root.__proto__.isPrototypeOf(Object)){
                break;
            }
            root = root.__proto__;
        }

        return root;
    }

    static copyProperties(target, source){
        let descriptors = Object.getOwnPropertyNames(source).reduce((descriptors, key) =>
        {
            if(!key.match(/^(?:constructor|prototype|arguments|caller|name|bind|call|apply|toString|length)$/))
            {
                descriptors[key] = Object.getOwnPropertyDescriptor(source, key);
            }

            return descriptors;
        }, {});

        Object.getOwnPropertySymbols(source).forEach(sym =>
        {
            let descriptor = Object.getOwnPropertyDescriptor(source, sym);
            if (descriptor.enumerable) { descriptors[sym] = descriptor; }
        });

        Object.defineProperties(target, descriptors);
    }

    static extend(baseType, extensionType){
        // type checking
        if(typeof(baseType) !== 'function'){
            throw TypeError('baseType is not a type');
        }

        if(typeof(extensionType) !== 'function'){
            throw TypeError('extensionType is not a type');
        }

        let mixin = function(){}; //baseType.name + "_" + extensionType.name
        if(!baseType.prototype.__proto__.isPrototypeOf(Object)){
            TypeExtender.copyProperties(mixin.prototype, baseType.prototype.__proto__);
        }
        TypeExtender.copyProperties(mixin.prototype, extensionType.prototype);

        Object.setPrototypeOf(baseType.prototype, mixin.prototype);
    }

    static mutate(baseType, extensionType){
        // type checking
        if(typeof(baseType) !== 'function'){
            throw TypeError('baseType is not a type');
        }

        if(typeof(extensionType) !== 'function'){
            throw TypeError('extensionType is not a type');
        }

        // brute force : properties and methods copying in prototype
        TypeExtender.copyProperties(baseType.prototype, extensionType.prototype);
    }
}