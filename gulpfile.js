/*
   Copyright 2016 Webnium

   Licensed under the Apache License, Version 2.0 (the "License");
   you may not use this file except in compliance with the License.
   You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
*/
'use strict';

const fs = require('fs');
const gulp = require('gulp');
const typescript = require('gulp-typescript');
const sourcemaps = require('gulp-sourcemaps');
const rename = require('gulp-rename');
const uglify = require('gulp-uglify');
const del = require('del');
const merge = require('merge2');
const browserify = require('browserify');
const babelify = require('babelify');
const source = require('vinyl-source-stream')
const buffer = require('vinyl-buffer');
const less = require('gulp-less');
const cleanCSS = require('gulp-clean-css');
const LessAutoprefix = require('less-plugin-autoprefix');
const autoprefix = new LessAutoprefix({ browsers: ['last 2 versions'] });

gulp.task('clean-js', () => {

    return del.sync([
        'lib/js',
        'flagrate.js'
    ]);
});

gulp.task('tsc', ['clean-js'], () => {

    const tsResult = gulp
        .src([
            'src/js/**/*.ts'
        ])
        .pipe(sourcemaps.init())
        .pipe(typescript({
            typescript: require('typescript'),
            target: 'es6',
            module: 'es6',
            removeComments: false,
            declarationFiles: true
        }));

    return merge([
        tsResult
            .js
            .pipe(sourcemaps.write('./'))
            .pipe(gulp.dest('lib/js')),
        tsResult
            .dts
            .pipe(gulp.dest('lib/js'))
    ]);
});

gulp.task('browserify', ['tsc'], () => {

    return browserify({
        debug: true,
        entries: './lib/js/flagrate.js',
        extensions: ['.js']
    })
        .transform('babelify', { presets: ['es2015'], sourceMaps: true })
        .bundle()
        .pipe(source('flagrate.js'))
        .pipe(buffer())
        .pipe(gulp.dest('.'));
});

gulp.task('split', ['browserify'], () => {

    let source = fs.readFileSync('flagrate.js', { encoding: 'utf8' });

    let data = new Buffer(source.match(/\/\/. sourceMappingURL=[^,]+,(.+)/)[1], 'base64').toString('ascii');

    source = source.replace(/\/\/. sourceMappingURL=[^,]+,(.+)/, '//# sourceMappingURL=flagrate.js.map');

    fs.writeFileSync('flagrate.js', source);
    fs.writeFileSync('flagrate.js.map', data);

    return;
});

gulp.task('minify', ['split'], () => {

    return gulp.src('flagrate.js')
        .pipe(sourcemaps.init())
        .pipe(uglify({
            preserveComments: 'some'
        }))
        .pipe(rename({
            extname: '.min.js'
        }))
        .pipe(sourcemaps.write('./'))
        .pipe(gulp.dest('.'));
});

gulp.task('less', () => {

    return gulp
        .src([
            'src/css/flagrate.less'
        ])
        .pipe(sourcemaps.init())
        .pipe(less({
            plugins: [ autoprefix ]
        }))
        .pipe(sourcemaps.write('./'))
        .pipe(gulp.dest('.'));
});

gulp.task('minify-css', ['less'], () => {

    return gulp.src('flagrate.css')
        .pipe(sourcemaps.init())
        .pipe(cleanCSS())
        .pipe(rename({
            extname: '.min.css'
        }))
        .pipe(sourcemaps.write('./'))
        .pipe(gulp.dest('.'));
});

gulp.task('build-js', ['minify']);
gulp.task('build-css', ['minify-css']);

gulp.task('watch', () => {
    gulp.watch('src/js/**/*.ts', ['build-js']);
    gulp.watch('src/css/**/*.less', ['build-css']);
});

gulp.task('build', ['build-js', 'build-css']);

gulp.task('default', ['build']);