'use strict';
const gulp = require('gulp');

gulp.task('sass', () => {
  const cssmin     = require('gulp-minify-css');
  const sass       = require('gulp-sass');
  const changed    = require('gulp-changed');
  const livereload = require('gulp-livereload');

  const SOURCE = './client/development/sass/**/*.scss';
  const DEST   = './client/build/css/';

  return gulp.src(SOURCE)
    .pipe(changed(DEST))
    .pipe(sass({outputStyle: 'compressed'}))
    .pipe(cssmin())
    .pipe(gulp.dest(DEST))
    .pipe(livereload());
});
