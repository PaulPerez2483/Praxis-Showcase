const {src, dest, watch, series} = require('gulp')
const babel = require('gulp-babel');
const plumber = require('gulp-plumber');

function babelJs() {
    return src('./src/components/**/*.js')
    .pipe(plumber())
    .pipe(babel({
        presets: [
            ['@babel/env', {
                modules:false
            }]
        ]
    }))
    .pipe(dest('./rsc/js'))
}
exports.default = function() {
    watch('./src/components/**/*.js', series(babelJs));
}