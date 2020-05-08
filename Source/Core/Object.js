import Utils from './Utils';

var ObjectHelper = {};

ObjectHelper.toHtml = function ({ object, filter, paramKey, isIgnoreNull }) {
    var option = Utils.defaultValue(object, {});
    var propertieFilter = Utils.defaultValue(filter, []);
    var param = Utils.defaultValue(paramKey, {});
    isIgnoreNull = Utils.defaultValue(isIgnoreNull, false);
    // var resultHtml = '<ul id="Ts-info-attr">';
    var resultHtml = convert(option, propertieFilter, param, undefined, isIgnoreNull);
    // resultHtml += `</ul>`;
    return resultHtml;
}

function convert(val, filter, paramKey, key, isIgnoreNull) {
    if (filter.indexOf(key) != -1) return "";
    var html = "";
    if (!val && isIgnoreNull) return "";
    if (val instanceof Array) {
        html += convertArray(val, filter, paramKey, key, isIgnoreNull);
    } else if (val instanceof Object) {
        html += convertObject(val, filter, paramKey, key, isIgnoreNull);
    } else {
        if (key) {
            var itemName, value;
            if (paramKey[key]) {
                if (paramKey[key] instanceof Object) {
                    itemName = paramKey[key].key;
                    value = paramKey[key].value[val] ? paramKey[key].value[val] : val;
                } else {
                    itemName = paramKey[key];
                    value = val;
                }
            } else {
                itemName = key;
                value = val
            }

            html += `
                <li>
                    <span>${itemName}</span>
                    <span>${value}</span>
                </li>`;
        } else {
            html += `
                <li style='text-align: center;'>
                    <span style='width: 100%;'>${val}</span>
                </li>`;
        }
    }
    return html;
}

function convertArray(array, filter, paramKey, key, isIgnoreNull) {
    if (filter.indexOf(key) != -1) return "";
    var html = ``;
    if (key) {
        var itemName;
        if (paramKey[key]) {
            if (paramKey[key] instanceof Object) {
                itemName = paramKey[key].key;
            } else {
                itemName = paramKey[key];
            }
        } else {
            itemName = key;
        }
        html += `
        <ul style='text-align: center;'>
            <span style="font-size: 17px;">${itemName}</span>`;
    }
    for (let i = 0, size = array.length; i < size; i++) {
        const data = array[i];
        // html += `<ul>`
        html += convert(data, filter, paramKey, undefined, isIgnoreNull)
        // html += `</ul>`
    }
    if (key)
        html += `</ul>`
    return html
}

function convertObject(object, filter, paramKey, key, isIgnoreNull) {
    if (filter.indexOf(key) != -1) return "";
    var html = "";
    if (key) {
        var itemName;
        if (paramKey[key]) {
            if (paramKey[key] instanceof Object) {
                itemName = paramKey[key].key;
            } else {
                itemName = paramKey[key];
            }
        } else {
            itemName = key;
        }
        html += `
        <ul style='text-align: center;'>
            <span style="font-size: 17px;">${itemName}</span>`;
    }
    html += `<ul>`
    for (item in object) {
        html += convert(object[item], filter, paramKey, item, isIgnoreNull);
    }
    html += `</ul>`
    if (key)
        html += `</ul>`

    return html;
}

export default ObjectHelper;