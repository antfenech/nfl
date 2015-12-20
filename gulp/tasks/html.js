'use strict';
const gulp = require('gulp');

gulp.task('html', () => {
  const cleanhtml = require('gulp-cleanhtml');
  const _ = require('underscore');
  const SOURCE = './client/development/html/**/*.html';
  const DEST   = './client/build/html/';

  return gulp.src(SOURCE)
    .pipe(cleanhtml())
    .pipe(gulp.dest(DEST));
});
