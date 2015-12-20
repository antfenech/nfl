'use strict';
const gulp = require('gulp');

gulp.task('server', () => {
  const nodemon = require('gulp-nodemon');

  nodemon(
    {
      ext:    'html js',
      script: './server.js',
      ignore: './client/*',
    })
    .on('restart', () => {
      console.log('restarted!');
    });
});
