'use strict';
const gulp = require('gulp');

gulp.task('js', () => {
  const del        = require('del');
  const browserify = require('gulp-browserify');
  const uglify     = require('gulp-uglify');
  const gutil      = require('gulp-util');

  const SOURCE = './client/development/js/app.js';
  const DEST   = './client/build/js/';

  del(['client/build/js/*.*'])
  .then((paths) => {
    gutil.colors.red('JS ' + paths + ' delted');

    return gulp.src(SOURCE)
      .pipe(browserify({
        insertGlobals: true,
        debug: true,
      }))
        .pipe(uglify())
        .pipe(gulp.dest(DEST));
  });
});
