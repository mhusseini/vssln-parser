var gulp = require('gulp');
var ts = require('gulp-typescript');
var merge = require('merge2');
var runSequence = require('run-sequence');
var sourcemaps = require('gulp-sourcemaps');
var concat = require('gulp-concat');
var clean = require('gulp-clean');

var tsProject = ts.createProject({
    declaration: true,
    module: "CommonJS",
    target: "es5"
});

gulp.task('compile-app', function () {
    var tsResult = gulp.src('src/**/*.ts')
        .pipe(sourcemaps.init())
        .pipe(ts(tsProject));

    return merge([
        tsResult.dts
            .pipe(concat('index.d.ts'))
            .pipe(gulp.dest('dist/definitions')),
        tsResult.js
            .pipe(sourcemaps.write())
            .pipe(gulp.dest('dist/js'))
    ]);
});

gulp.task('copy-index', function () {
    return gulp.src('dist/js/index.js')
        .pipe(clean({force: true}))
        .pipe(gulp.dest('.'));
});

gulp.task('build-app', function (done) {
    runSequence('compile-app', 'copy-index', function () {
        done();
    });
});

gulp.task('compile-tests', function () {
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

gulp.task('build-tests', function (done) {
    runSequence('compile-tests', 'copy-test-assets', function () {
        done();
    });
});

gulp.task('build', function (done) {
    runSequence('build-app', 'build-tests', function () {
        done();
    });
});

gulp.task('watch', ['build'], function () {
    gulp.watch('src/**/*.ts', ['build-app']);
    gulp.watch('test/**/*.ts', ['build-tests']);
});