var fs = require('fs')
var path = require('path')
var debug = require('debug')('dnif')

const canGoUpOneDir = function(options) {
	const parsedPath = path.parse(options.startPath)
	return (parsedPath.root != options.startPath) &&
	       (options.startPath != options.topmostPath)
}

const find = function (options, callback) {
	debug('find(' + JSON.stringify(options) + ')')

	fs.readdir(options.startPath, (err, files) => {
		if (err) {
			callback(err)
		}
		else if (files.find(name => name==options.name)) {
			callback(null, options.startPath)
		} else {
			if (canGoUpOneDir(options)) {
				const newOptions = options
				newOptions.startPath = path.join(options.startPath,'..')
				find(newOptions, callback)
			} else {
				callback(null, null)
			}
		}
	})
}

module.exports = find