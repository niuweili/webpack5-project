const loaderUtils = require('loader-utils');

module.exports = function (source) {
    const { name } = this.query
    const url = loaderUtils.interpolateName(this, name, source)
    this.emitFile(url, source)
    return source
}