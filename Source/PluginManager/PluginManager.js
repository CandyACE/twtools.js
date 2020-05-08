import Utils from '../Core/Utils';
import defineProperty from '../Core/defineProperties';

var _plugins = {};
var _loadingList = []
var _loadingSystemList = []
var _isLoaded = false;
var _data;

function PluginManager(options) {
    options = Utils.defaultValue(options, {});
    _data = options.data;
}

defineProperty(PluginManager.prototype, {
    data: {
        get: function () {
            return _data;
        }
    },
    /**
     * @description: 获取已经加载的插件集合
     * @return: 获取已经加载的插件集合
     */
    Plugins: {
        get: function () {
            return _plugins;
        }
    },
    isLoad: {
        get: function () {
            return _isLoaded;
        }
    }
})

/**
 * @description: 添加一个插件，插入到指定的地方，如果index为undefined，则插入到最后
 * @param {Function} e 插件方法
 * @param {String} desc 插件描述
 * @param {int} 优先级，0为最高，如果为undefined，则插入到最后
 * @returns {Boolean} 是否成功插入
 */
PluginManager.prototype.addPlugin = function (e, desc, index) {
    if (e == undefined || typeof e !== "function") {
        console.error(`【PluginManager】 参数为空 或者 类型不是Function e:${e}`)
        return false;
    }
    e.PluginDescription = desc;
    e.prototype.PluginDescription = desc;
    if (!e.PluginName)
        e.PluginName = e.name
    e.prototype.PluginName = e.name;
    if (index == undefined) {
        _loadingList.push(e)
    } else {
        _loadingList.splice(index, 0, e)
    }
    return true;
}

PluginManager.prototype.addSystemPlugin = function (e, desc, index) {
    if (e == undefined || typeof e !== "function") {
        console.error(`【PluginManager】 参数为空 或者 类型不是Function e:${e}`)
        return false;
    }
    e.PluginDescription = desc;
    e.prototype.PluginDescription = desc;
    if (!e.PluginName)
        e.PluginName = e.name
    e.prototype.PluginName = e.name;
    if (index == undefined) {
        _loadingSystemList.push(e)
    } else {
        _loadingSystemList.splice(index, 0, e)
    }
    return true;
}

/**
 * @description: 启动加载
 * @param {type}
 * @return:
 */
PluginManager.prototype.LoadPlugins = function () {
    if (_isLoaded) {
        console.error(`【PluginManager】已经加载过插件，不能重复加载`)
        return;
    }
    // 添加系统插件
    _loadPlugins(_loadingSystemList, window, _data, '【PluginManager】【系统】')

    // 添加业务插件
    _loadPlugins(_loadingList, _plugins, _data, '【PluginManager】')
    _isLoaded = true;
}

function _loadPlugins(pluginList, root, viewer, consoleHead) {
    let count = 0;
    // 添加系统插件
    for (let i = 0, length = pluginList.length; i < length; i++) {
        const e = pluginList[i];
        if (root[e.PluginName]) {
            let have = root[e.PluginName]
            console.error(`${consoleHead}要添加的插件 ${e.PluginName} ${e.PluginDescription == undefined ? "" : "(" + e.PluginDescription + ")"} 与已经存在的插件 ${have.PluginName} ${have.PluginDescription == undefined ? "" : "(" + have.PluginDescription + ")"} 冲突！`)
            continue;
        }
        root[e.PluginName] = new e(viewer)
        if (!root[e.PluginName].init()) {
            console.error(`${consoleHead}插件 ${e.PluginName} ${e.PluginDescription == undefined ? "" : "(" + e.PluginDescription + ")"} 初始化失败！ `)
        }
        count++
        console.info(`${consoleHead}添加插件【${count}】 ${e.PluginName} ${e.PluginDescription == undefined ? "" : "(" + e.PluginDescription + ")"}`)
    }
    console.info(`${consoleHead}一共添加 ${count} 个插件`)
}

export default PluginManager;