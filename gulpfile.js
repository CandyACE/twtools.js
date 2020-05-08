'use strict';

var fs = require('fs');
var path = require('path');
var gulp = require('gulp');
var mkdirp = require('mkdirp');
var globby = require('globby');
var rename = require('gulp-rename');
var through = require('through-gulp');
var ts = require('gulp-typescript');
var rollup = require('rollup');
var typescriptPlugin = require('rollup-plugin-typescript2');

var packageJson = require('./package.json');
var version = packageJson.version;

var sourceFiles = [
    'Source/**/*.js',
    '!Source/*.js']

var filesToClean = [
    'Source/**']


gulp.task('build', async function () {
    mkdirp.sync('bin');
    createTwtools("Source/twtools.js");
    createWorkers();
})

function createTwtools(output = "Specs/twtools.js") {
    var contents = `export var VERSION = '${version}';\n`;
    globby.sync(sourceFiles).forEach(function (file) {
        file = path.relative('Source', file);

        var moduleId = file;
        moduleId = filePathToModuleId(moduleId);

        var assignmentName = path.basename(file, path.extname(file));
        assignmentName = assignmentName.replace(/(\.|-)/g, '_');
        contents += 'export { default as ' + assignmentName + " } from './" + moduleId + ".js';\r\n";
    })
    fs.writeFileSync(output, contents);
}

function createWorkers() {
    rollup.rollup({
        input: './Source/twtools.js',
        onwarn: rollupWarning
    }).then(function (bundle) {
        return bundle.write({
            format: "iife",
            name: 'twtools',
            file: "./bin/twtools.js",
            sourcemap: true
        })
    })
}

function rollupWarning(message) {
    // Ignore eval warnings in third-party code we don't have control over
    if (message.code === 'EVAL' && /(protobuf-minimal|crunch)\.js$/.test(message.loc.file)) {
        return;
    }
    console.log(message);
}

function filePathToModuleId(moduleId) {
    return moduleId.substring(0, moduleId.lastIndexOf('.')).replace(/\\/g, '/');
}