/**
 * Created by Angel.P on 05/12/2016.
 */
/*
 * object.watch polyfill
 *
 * 2012-04-03
 *
 * By Eli Grey, http://eligrey.com
 * Public Domain.
 * NO WARRANTY EXPRESSED OR IMPLIED. USE AT YOUR OWN RISK.
 */

// object.watch
if (!Object.prototype.watch) {
    Object.defineProperty(Object.prototype, "watch", {
        enumerable: false
        , configurable: true
        , writable: false
        , value: function (prop, handler) {
            console.log("obj-w",prop,handler);
            var
                oldval = this[prop]
                , newval = oldval
                , getter = function () {
                    console.log("getter",newval,oldval);
                    return newval;
                }
                , setter = function (val) {
                    console.log("setter",val);
                    oldval = newval;
                    return newval = handler.call(this, prop, oldval, val);
                }
                ;

            if (delete this[prop]) { // can't watch constants
                Object.defineProperty(this, prop, {
                    get: getter
                    , set: setter
                    , enumerable: true
                    , configurable: true
                });
            }
        }
    });
}

// object.unwatch
if (!Object.prototype.unwatch) {
    Object.defineProperty(Object.prototype, "unwatch", {
        enumerable: false
        , configurable: true
        , writable: false
        , value: function (prop) {
            var val = this[prop];
            delete this[prop]; // remove accessors
            this[prop] = val;
        }
    });
}