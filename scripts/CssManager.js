'use strict';

class CssManager {
    get width() {
        return this.length > 0 ? this.elements[0].clientWidth : 0;
    }

    set width(value) {
        if (this.length > 0) this.elements[0].style.width = value;
    }

    get height() {
        return this.length > 0 ? this.elements[0].clientHeight : 0;
    }

    set height(value) {
        if (this.length > 0) this.elements[0].style.height = value;
    }

    get size() {
        return {width: this.width, height: this.height};
    }

    get x() {
        return this.length > 0 ? this.elements[0].offsetLeft - parseFloat(getComputedStyle(document.body).marginLeft) : 0;
    }

    set x(value) {
        if (this.length > 0) this.elements[0].style.left = value;
    }

    get y() {
        return this.length > 0 ? this.elements[0].offsetTop - parseFloat(getComputedStyle(document.body).marginTop) : 0;
    }

    set y(value) {
        if (this.length > 0) this.elements[0].style.top = value;
    }

    get offset() {
        return {x: this.x, y: this.y};
    }

    addClass(classNames) {
        let decls = classNames.split(' ');

        return this.each(function () {
            decls.forEach((c, i, a) => this.classList.add(c));
        });
    }

    removeClass(classNames) {
        let decls = classNames.split(' ');

        return this.each(function () {
            decls.forEach((c, i, a) => this.classList.remove(c));
        });
    }

    hasClass(className) {
        return this.length > 0
            ? this.elements[0].classList.contains(className)
            : false;
    }

    hide(){
        return this.css('display', 'none');
    }

    show(){
        return this.css('display', '');
    }

    css(option, value){
        if(typeof(option) === 'string')
        {
            // one property get/set
            if(value === undefined){
                return this.length > 0 ? getComputedStyle(this.elements[0]).getPropertyValue(option) : null;
            }
            else{
                return this.each(function () {
                    this.style.setProperty(option, value);
                });
            }
        }

        // apply new values
        return this.each(function () {
            for(let prop of Object.keys(option)){
                this.style.setProperty(prop, option[prop]);
            }
        });
    }
}

//TypeExtender.mutate(DomManager, CssManager);
TypeExtender.extend(DomManager, CssManager);