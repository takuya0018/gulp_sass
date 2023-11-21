const gulp = require('gulp');
const sass = require('gulp-sass')(require('sass'));
const browserSync = require('browser-sync').create();

// compile scss into css
function style() {
  //where is my scss file
  return gulp.src('./scss/**/*.scss')
  //pass that file through sass compiler
    .pipe(sass())
  //
    .pipe(gulp.dest('./css'))
}

exports.style = style;