'use strict';

const gulp = require('gulp');
const build = require('@microsoft/sp-build-web');
build.addSuppression(`Warning - [sass] The local CSS class 'ms-Grid' is not camelCase and will not be type-safe.`);
build.addSuppression(`Warning - [sass] src/styles/CustomFabric.scss: filename should end with module.sass or module.scss`);
build.addSuppression(`Warning - [sass] src/styles/CustomFabric2.scss: filename should end with module.sass or module.scss`);

build.initialize(gulp);

// Custom Gulp task to configure the Web Api Permission Request for the package
// Uses modifyFile plugin from https://www.npmjs.com/package/gulp-modify-file
// Npm i gulp-modify-file
gulp.task('set-web-api-permission-request', () => {
    const modifyFile = require('gulp-modify-file')
 
    function getArgument(key) {
        var index = process.argv.indexOf(key);
  
        if (index > -1 && process.argv.length > index) { 
            return process.argv[index + 1];
        }

        throw "Argument '" + key + "' not supplied.";
    }

    var resource = getArgument('--resource');
    var scope = getArgument('--scope');

    return gulp
    .src('config/package-solution.json')
    .pipe(modifyFile((content, path, file) => {
        var obj = JSON.parse(content); 
        obj.solution.webApiPermissionRequests = [{ "resource" : resource, "scope" : scope }]; 
        return JSON.stringify(obj); 
    }))
    .pipe(gulp.dest('config'))
}); 