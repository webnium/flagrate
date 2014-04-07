var fs = require('fs');
var gulp = require('gulp');
var include = require('gulp-include');
var rename = require('gulp-rename');
var mocha = require('gulp-mocha');
var typescript = require('gulp-tsc');
var closureCompiler = require('gulp-closure-compiler');

gulp.task('include-ts', function () {
    return gulp.src('src/flagrate.ts')
               .pipe(include())
               .pipe(gulp.dest('.'));
});

gulp.task('compile-ts', ['include-ts'], function () {
    return gulp.src('flagrate.ts')
               .pipe(typescript({ target: 'ES5', declaration: true }))
               .pipe(gulp.dest('.'));
});

gulp.task('wrap-js', ['compile-ts'], function () {
    return gulp.src('src/flagrate.js')
               .pipe(include())
               .pipe(gulp.dest('.'));
});

gulp.task('compile-js', ['wrap-js'], function () {
    gulp.src('flagrate.js')
        .pipe(closureCompiler())
        .pipe(rename('flagrate.min.js'))
        .pipe(gulp.dest('.'));
});

gulp.task('build', ['compile-js'], function () {
    fs.unlink('flagrate.ts');
});

gulp.task('watch', function () {
    gulp.watch('src/*.ts', ['build']);
});

gulp.task('default', ['build']);
