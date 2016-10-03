var gulp = require('gulp');
var ts = require('gulp-typescript');
var merge = require('merge2');
var runSequence = require('run-sequence');
var sourcemaps = require('gulp-sourcemaps');
var concat = require('gulp-concat');

var tsProject = ts.createProject({
    declaration: true,
    module: "CommonJS",
    target: "es5"
});

gulp.task('build-app', function () {
    var tsResult = gulp.src('src/**/*.ts')
        .pipe(sourcemaps.init())
        .pipe(ts(tsProject));

    return merge([ // Merge the two output streams, so this task is finished when the IO of both operations is done. 
        tsResult.dts
            .pipe(concat('index.d.ts'))
            .pipe(gulp.dest('dist/definitions')),
        tsResult.js
            .pipe(sourcemaps.write())
            .pipe(gulp.dest('dist/js'))
    ]);
});


gulp.task('build-tests', ['copy-test-assets'], function () {
    return gulp.src('test/*.ts')
        .pipe(sourcemaps.init())
        .pipe(ts()).js
        .pipe(sourcemaps.write())
        .pipe(gulp.dest('dist/test'));
});

gulp.task('copy-test-assets', function () {
    return gulp.src(['test/*.sln'])
        .pipe(gulp.dest('dist/test'));
});

gulp.task('build', function (done) {
    runSequence('build-app', 'build-tests', function () {
        done();
    });
});

gulp.task('watch', ['build'], function () {
    gulp.watch('src/**/*.ts', ['build-app']);
    gulp.watch('tests/**/*.ts', ['build-tests']);
});