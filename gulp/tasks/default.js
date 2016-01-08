'use strict';
const gulp = require('gulp');

gulp.task('default', ['watch', 'server', 'sass', 'js', 'html']);
gulp.task('build', ['img', 'html', 'sass', 'js']);
