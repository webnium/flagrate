/*jslint node:true, white:true */
'use strict';

var fs = require('fs');
var gulp = require('gulp');
var include = require('gulp-include');
var rename = require('gulp-rename');
var mocha = require('gulp-mocha');
var typescript = require('gulp-typescript');
var uglify = require('gulp-uglify');
var eol = require('gulp-eol');
var merge = require('merge2');

gulp.task('include-ts', function () {
    return gulp.src('src/flagrate.ts')
               .pipe(include())
               .pipe(gulp.dest('dist'));
});

gulp.task('compile-ts', ['include-ts'], function () {

    var result = gulp.src('dist/flagrate.ts').pipe(typescript({
        target: 'ES5',
        declarationFiles: true
    }));

    return merge([
        result.dts.pipe(gulp.dest('dist')),
        result.js.pipe(gulp.dest('dist'))
    ]);
});

gulp.task('wrap-js', ['compile-ts'], function () {
    return gulp.src('src/flagrate.js')
               .pipe(include())
               .pipe(eol())
               .pipe(gulp.dest('dist'));
});

gulp.task('compile-js', ['wrap-js'], function () {
    return gulp.src('dist/flagrate.js')
               .pipe(uglify({ preserveComments: 'some' }))
               .pipe(eol())
               .pipe(rename('flagrate.min.js'))
               .pipe(gulp.dest('dist'));
});

gulp.task('build', ['compile-js'], function () {
    //fs.unlink('dist/flagrate.ts');
    //todo
    return gulp.src('src/flagrate.css')
               .pipe(gulp.dest('dist'));
});

gulp.task('watch', function () {
    gulp.watch('src/*.ts', ['build']);
});

gulp.task('default', ['build']);
