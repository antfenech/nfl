'use strict';
const gulp = require('gulp');

gulp.task('watch', () => {
  const livereload = require('gulp-livereload');
  const gutil      = require('gulp-util');

  const HTMLSOURCE = './client/development/html/**/*.html';
  const SASSSOURCE = './client/development/sass/*.scss';
  const JSSOURCE   = './client/development/js/*.js';

  livereload.listen();

  gulp.watch(HTMLSOURCE, ['html'])
    .on('change', (file) => {
      livereload.changed(file.path);
      gutil.log(gutil.colors.green('HTML changed' + ' (' + file.path + ')'));
    });

  gulp.watch(SASSSOURCE, ['sass'])
    .on('change', (file) => {
      livereload.changed(file.path);
      gutil.log(gutil.colors.yellow('CSS changed' + ' (' + file.path + ')'));
    });

  gulp.watch(JSSOURCE, ['js'])
    .on('change', (file) => {
      gutil.log(gutil.colors.blue('JS changed' + ' (' + file.path + ')'));
    });
});
