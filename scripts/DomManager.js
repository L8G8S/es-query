'use strict';

class DomManager
{
    constructor(selector) {
        this.elements = []

        if(selector !== undefined){
            if (selector instanceof Node) {
                this.elements.push(selector);
            }
            else if(Array.isArray(selector)) {
                this.elements = selector;
            }
            else if(typeof(selector) === 'string' && selector.startsWith('<')){
                this.elements = [this.createElementTree(selector)];
            }
            else {
                this.elements = Array.from(document.querySelectorAll(selector));
            }
        }
    }

    get length() {
        return this.elements.length;
    }

    * [Symbol.iterator]() {
        for (let el of this.elements) {
            yield el;
        }
    }

    createElementTree(value){
        if(typeof(value) === 'string'){
            /*
            let parser = new DOMParser();
            let root = parser.parseFromString(value, "text/xml");

            return root.documentElement;
            */

            var root = document.createElement("div");
            root.innerHTML = value;
            return root.firstElementChild;
        }

        return null;
    }

    each(callback) {
        for (let el of this) {
            callback.call(el);
        }

        return this;
    }

    find(selector) {
        if(selector && this.length > 0){
            var sub = [];
            this.each(function () {
                sub = sub.concat(Array.from(this.querySelectorAll(selector)));
            });

            return new DomManager(sub);
        }

        return new DomManager(selector);
    }

    children(selector){
        return this.find(":scope > " + (selector === undefined ? '*' : selector));
    }

    closest(selector){
        if(this.length > 0){
            let el = this.elements[0];
            let matchesSelector = el.matches || el.webkitMatchesSelector || el.mozMatchesSelector || el.msMatchesSelector;

            while (el) {
                if (matchesSelector.call(el, selector)) {
                    break;
                }
                el = el.parentElement;
            }

            return new DomManager(el);
        }

        return new DomManager(undefined);
    }

    parent(){
        return new DomManager(this.length > 0 ? this.elements[0].parentElement : undefined);
    }

    first(){
        return new DomManager(this.length > 0 ? this.elements[0] : undefined);
    }

    last(){
        return new DomManager(this.length > 0 ? this.elements[this.length - 1] : undefined);
    }

    eq(index){
        return new DomManager(this.length > 0 && this.length > index ? this.elements[Math.abs(index)] : undefined);
    }

    next(){
        return new DomManager(this.length > 0 ? this.elements[0].nextElementSibling : undefined);
    }

    prev(){
        return new DomManager(this.length > 0 ? this.elements[0].previousElementSibling : undefined);
    }

    append(what){
        if(what === undefined) return this;

        what = this.createElementTree(what);

        return this.each(function () {
            this.appendChild(what);
        });
    }

    appendTo(selector){
        if(selector !== undefined) {
            Array.from(document.querySelectorAll(selector)).forEach((e, i) => {
                e.appendChild(this.elements[0]);
            });
        }

        return this;
    }

    prepend(what){
        if(what === undefined) return this;

        what = this.createElementTree(what);

        return this.each(function () {
            this.insertBefore(what, this.firstElementChild);
        });
    }

    prependTo(selector){
        if(selector !== undefined) {
            Array.from(document.querySelectorAll(selector)).forEach((e, i) => {
                e.insertBefore(this.elements[0], e.firstElementChild);
            });
        }

        return this;
    }

    attr(name, value){
        // one property get/set
        if(value === undefined){
            return this.length > 0
                ? this.elements[0].getAttribute(name)
                : null;
        }
        else{
            return this.each(function () {
                this.setAttribute(name, value);
            });
        }
    }

    removeAttr(name){
        return this.each(function () {
            this.removeAttribute(name);
        });
    }

    data(name, value){
        return this.attr('data-' + name , value);
    }

    html(content){
        if(content === undefined){
            return this.length > 0
                ? this.elements[0].innerHTML
                : null;
        }
        else{
            return this.each(function () {
                this.innerHTML = content;
            });
        }
    }

    empty(){
        return this.html('');
    }
};