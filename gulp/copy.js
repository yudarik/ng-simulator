'use strict';

var path = require('path');
var gulp = require('gulp');
var conf = require('./conf');

gulp.task('copyVendorFiles', function() {
    return gulp.src(
        path.join(conf.paths.src, '/assets/vendor-files/*.*')
    )
    .pipe(gulp.dest(path.join(conf.paths.dist, '/assets/vendor-files/')));
});