/*
  MIT License http://www.opensource.org/licenses/mit-license.php
  Author Tobias Koppers @sokra
*/
var loaderUtils = require("loader-utils");
var path = require("path");
var qs = require('querystring');

module.exports = function(content) {
  this.cacheable && this.cacheable();
  if(!this.emitFile) throw new Error("emitFile is required from module system");

  var query = loaderUtils.parseQuery(this.query);
  var configKey = query.config || "fileLoader";
  var options = this.options[configKey] || {};

  var config = {
    publicPath: false,
    name: "[hash].[ext]"
  };

  // options takes precedence over config
  Object.keys(options).forEach(function(attr) {
    config[attr] = options[attr];
  });

  // query takes precedence over config and options
  Object.keys(query).forEach(function(attr) {
    config[attr] = query[attr];
  });

  var url = loaderUtils.interpolateName(this, config.name, {
    context: config.context || this.options.context,
    content: content,
    regExp: config.regExp
  });

  var publicPath = "__webpack_public_path__ + " + JSON.stringify(path.basename(url));

  if (config.publicPath) {
    // support functions as publicPath to generate them dynamically
    publicPath = JSON.stringify(
        typeof config.publicPath === "function" 
         ? config.publicPath(url) 
         : config.publicPath + url
    );
  }

  if (query.emitFile === undefined || query.emitFile) {
    this.emitFile(url, content);
  }

  if (!!this.resourceQuery === false) { 
    // Default to asset_url
    shopifyFiltersStr = 'asset_url';
  } else {
    var shopifyFilters = qs.parse(this.resourceQuery.substring(1));
    var shopifyFiltersStr = Object.keys(shopifyFilters).map(function(key) {
      return key + ": '" + shopifyFilters[key] + "'";
    }).join(', ');
  }

  return "module.exports = " + ['"{{\'"', publicPath, '"\' | ' + shopifyFiltersStr + '}}"'].join("+") + ";";
}

module.exports.loaderTest = function(absPath) {
  var extensions = ["jpe?g", "gif", "png", "svg", "woff", "woff2", "eot", "ttf"];
  var regExp = new RegExp("\\.(" + extensions.join('|') + ")(\\?(.+?))?$");
  var matches = absPath.match(regExp);

  if ( ! matches) {
    return false;
  }

  var filters = qs.parse(matches[3]);

  // Make sure we have at least one filter
  if (Object.keys(filters).length === 0) {
    return false;
  }

  return true;
};

module.exports.raw = true;