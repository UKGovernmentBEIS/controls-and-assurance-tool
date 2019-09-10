'use strict';

const gulp = require('gulp');
const build = require('@microsoft/sp-build-web');
build.addSuppression(`Warning - [sass] The local CSS class 'ms-Grid' is not camelCase and will not be type-safe.`);
build.addSuppression(`Warning - [sass] src/styles/CustomFabric.scss: filename should end with module.sass or module.scss`);
build.addSuppression(`Warning - [sass] src/styles/CustomFabric2.scss: filename should end with module.sass or module.scss`);

build.initialize(gulp);
