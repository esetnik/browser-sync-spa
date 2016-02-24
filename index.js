var historyApiFallback = require("connect-history-api-fallback");
var merger = require("opt-merger");

const PLUGIN_NAME          = "BrowserSync SPA";
const HISTORY_CHANGE_EVENT = "history:change";
const CLIENT_JS            = "/client.js";

/**
 * Plugin interface for BrowserSync
 */
var plugin = {
    "plugin:name": PLUGIN_NAME,
    "plugin": function (opts, instance) {
        var logger = instance.getLogger(PLUGIN_NAME);
        logger.info("Running...");
    },
    "hooks": {
        "client:js": "",
        "client:events": function () {
            return HISTORY_CHANGE_EVENT;
        }
    }
}

const defaults = {
    selector: "[ng-app]",
    history: {},
    ghostMode: true
};

/**
 * Allow run-time modifications to the client-side script
 * @param opts
 */
module.exports = function (opts) {
    var config   = merger.set({simple: true}).merge(defaults, opts);
    var clientJs = require("fs").readFileSync(__dirname + CLIENT_JS, "utf-8");
    plugin.hooks["client:js"] = clientJs.replace('%CONFIG%', JSON.stringify(config));
    
    if (config.history) {
        plugin.hooks["server:middleware"] = function () {
            return historyApiFallback(config.history);
        };
    }
    return plugin;
}