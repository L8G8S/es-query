'use strict';

class EventManager {
    on(event, callback) {
        for (let el of this.elements) {
            el.addEventListener(event, callback, false);
        }

        return this;
    }

    trigger(event){
        let evt = document.createEvent("HTMLEvents");
        evt.initEvent(event, true, true);
        evt.eventName = event;

        for (let el of this.elements) {
            el.dispatchEvent(evt);
        }

        return this;
    }
}

//TypeExtender.mutate(DomManager, EventManager);
TypeExtender.extend(DomManager, EventManager);