import Utils from './Utils';

function TSEvent() {
    this._listeners = {};
}

TSEvent.prototype.addEvent = function (type, fn) {
    if (typeof this._listeners[type] === "undefined") {
        this._listeners[type] = [];
    }
    if (typeof fn === "function") {
        this._listeners[type].push(fn);
    }
    return this;
}

TSEvent.prototype.fireEvent = function (type, data) {
    var arrayEvent = this._listeners[type];
    var _data = Utils.defaultValue(data, { data: {}, result: {} });
    _data._event = {
        _handle: false
    };
    if (arrayEvent instanceof Array) {
        for (var i = 0, length = arrayEvent.length; i < length; i += 1) {
            if (typeof arrayEvent[i] === "function") {
                arrayEvent[i](_data);
                if (_data._event._handle) break;
            }
        }
    }
    return _data;
}

TSEvent.prototype.removeEvent = function (type, fn) {
    var arrayEvent = this._listeners[type];
    if (typeof type === "string" && arrayEvent instanceof Array) {
        if (typeof fn === "function") {
            for (var i = 0, length = arrayEvent.length; i < length; i += 1) {
                if (arrayEvent[i] === fn) {
                    this._listeners[type].splice(i, 1);
                    break;
                }
            }
        } else {
            delete this._listeners[type];
        }
    }
    return this;
}

export default TSEvent;