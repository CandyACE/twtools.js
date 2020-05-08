var Utils = {};
/**
 * @description: 获得默认值
 * @param {type}
 * @return:
 */
Utils.defaultValue = function (data, defaultValue) {
    return void 0 !== data && null !== data ? data : defaultValue;
}
/**
 * @description: 序列化json，支持序列化Function
 * @param {type}
 * @return:
 */
Utils.JSONStringifyWithFun = function (obj) {
    return JSON.stringify(obj, function (key, val) {
        if (typeof val == "function") {
            return val + '';
        }
        return val;
    }, 2)
}
/**
 * @description: 反序列化为对象，支持反序列化Function
 * @param {type}
 * @return:
 */
Utils.JSONParseWithFun = function (string) {
    return JSON.parse(string, function (k, v) {
        if (v.indexOf && v.indexOf('function') > -1) {
            return eval("(function(){return " + v + " })()")
        }
        return v;
    })
}
/**
 * @description: 克隆对象
 * @param {type}
 * @return:
 */
Utils.cloneObj = function (obj) {
    var o;
    if (typeof obj == 'object') {
        if (obj === null) {
            o = null;
        } else {
            if (obj instanceof Array) {
                o = [];
                for (var i = 0, len = obj.length; i < len; i++) {
                    o.push(this.cloneObj(obj[i]));
                }
            } else {
                o = {};
                for (var j in obj) {
                    o[j] = this.cloneObj(obj[j]);
                }
            }
        }
    } else {
        o = obj;
    }
    return o;
}

/**
 * 安全获取对象中深度的值
 * @param from
 * @param selectors
 * @returns {*[]}
 */
Utils.getter = (from, ...selectors) => [...selectors].map(s =>
    s
        .replace(/\[([^\[\]]*)\]/g, '.$1.')
        .split('.')
        .filter(t => t !== "")
        .reduce((prev, cur) => prev && prev[cur], from)
)

/**
 * 安全获取对象中深度的值
 * @param from 对象
 * @param selectors 选择的
 * @param defaultValue 默认值
 * @returns {*}
 */
Utils.get = function (from, selectors, defaultValue) {
    var res = this.getter(from, selectors)[0];
    return this.defaultValue(res, defaultValue);
}

/**
 * 计时器，使用setTimeout防止重复触发
 * @param fn 触发的方法
 * @param millisec 触发的时间
 * @param count 重试次数
 */
Utils.updateInterval = function (fn, millisec, count) {
    function interval() {
        if (typeof count === "undefined" || --count > 0) {
            setTimeout(interval, millisec);
            try {
                fn()
            } catch (e) {
                count = 0;
                throw e.toString();
            }
        }
    }

    setTimeout(interval, millisec)
}

export default Utils;