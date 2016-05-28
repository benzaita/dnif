var assert = require('assert')
var find = require('..')
var fs = require('fs')
var os = require('os')
var mktemp = require('mktemp')
var path = require('path')
var rmdir = require('rmdir')

describe('dnif', function() {
	describe('#find()', function() {

		beforeEach(function(done) {
			const testContext = this
			mktemp.createDir(path.join(os.tmpdir(),'XXXX'), function(err,path) {
				testContext.workspace = path
				done()
			})
		})

		afterEach(function(done) {
			rmdir(this.workspace, function(err) {
				this.workspace = undefined
				done()
			})
		})

		it('should find "foo" in the working directory', function(done) {
			const fooPath = this.workspace
			const workingPath = this.workspace

			fs.writeFileSync(path.join(fooPath, 'foo'), '')
			
			find(
			{
				name: 'foo',
				startPath: workingPath, 
				topmostPath: this.workspace
			},
			function(err, dir) {
				assert.equal(null, err)
				assert.equal(fooPath, dir)
				done()
			})
		})

		it('should find "foo" up the directory tree', function(done) {
			const testContext = this

			const fooPath = this.workspace
			const workingPath = path.join(this.workspace, 'subdir')

			fs.mkdir(workingPath, function(err) {
				fs.writeFileSync(path.join(fooPath, 'foo'), '')

				find(
				{
					name: 'foo',
					startPath: workingPath, 
					topmostPath: testContext.workspace
				}, 
				function(err, dir) {
					assert.equal(null, err)
					assert.equal(fooPath, dir)
					done()
				})	
			})
		})

		it('should return null if "foo" was not found', function(done) {
			const testContext = this

			const workingPath = path.join(this.workspace, 'subdir')

			fs.mkdir(workingPath, function(err) {
				find(
				{
					name: 'foo',
					startPath: workingPath, 
					topmostPath: testContext.workspace
				}, 
				function(err, dir) {
					assert.equal(null, err)
					assert.equal(null, dir)
					done()
				})	
			})
		})

		it('should stop at root dir', function(done) {
			const testContext = this

			find(
			{
				name: 'nonexistent_file',
				startPath: testContext.workspace, 
				topmostPath: 'nonexistent_dir'
			}, 
			function(err, dir) {
				assert.equal(null, err)
				assert.equal(null, dir)
				done()
			})	
		})
	})
})
