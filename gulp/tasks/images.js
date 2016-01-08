'use strict';
const gulp = require('gulp');

gulp.task('img', function() {
  const del     = require('del');
  const gutil   = require('gulp-util');
  const changed = require('gulp-changed');
  const SOURCE  = './client/development/images/**.*';
  const DEST    = './client/build/images/';

  del([DEST]).then(function(paths) {
    gutil.log(gutil.colors.red('IMAGES ' + paths + ' DELETED'));

    return gulp.src(SOURCE)
        .pipe(changed(DEST))
        .pipe(gulp.dest(DEST))
        .on('error', gutil.log);
  });
});
