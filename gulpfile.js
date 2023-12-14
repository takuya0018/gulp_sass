//----------------------------------------------------------------------
//  モード
//----------------------------------------------------------------------
"use strict";


//----------------------------------------------------------------------
//  モジュール読み込み
//----------------------------------------------------------------------
const { src, dest, watch, parallel, series } = require("gulp");
// const sass = require('gulp-sass')(require('sass')); //旧sass
const sass = require('gulp-dart-sass'); //新sass
const browserSync = require('browser-sync').create();
const reload = browserSync.reload;
const plumber = require("gulp-plumber");
const notify = require("gulp-notify");
const uglify = require("gulp-uglify");
const fs = require("fs");
const rename = require("gulp-rename");
const imagemin = require('gulp-imagemin');
const mozjpeg = require('imagemin-mozjpeg');
const pngquant = require("imagemin-pngquant");
const pug = require('gulp-pug');
const debug = require('gulp-debug');
const filter = require('gulp-filter');
const htmlbeautify = require('gulp-html-beautify');


//----------------------------------------------------------------------
//  各種関数設定
//----------------------------------------------------------------------

// html
// const copyHtml = () => {
//   return src("./src/html/**/*.html")
//     .pipe(dest("./dist"))
// }

// pug
const compilePug = () => {
  return src("./src/html/**/*.pug", { sourcemaps: true })
  .pipe(plumber({
    errorHandler: notify.onError('Error: <%= error.message %>')
  }))
  .pipe(filter(function (file) { // _から始まるファイルを除外
    return !/\/_/.test(file.path) && !/^_/.test(file.relative);
  }))
  .pipe(pug())
  .pipe(htmlbeautify({
    eol: '\n',
    indent_size: 2,
    indent_char: ' ',
    indent_with_tabs: false,
    end_with_newline: true,
    preserve_newlines: true,
    max_preserve_newlines: 2,
    indent_inner_html: true,
    brace_style: 'collapse',
    indent_scripts: 'normal',
    wrap_line_length: 0,
    wrap_attributes: 'auto'
  }))
  .pipe(debug({title: 'pug dist:'}))
  .pipe(dest("./dist",
  // { sourcemaps: "." }
  ))
}

// sass
const compileSass = () => {
  return src("./src/sass/**/*.scss", { sourcemaps: true })
  .pipe(plumber({ errorHandler: notify.onError("Error: <%= error.message %>") }))
  .pipe(sass({ outputStyle: "compressed" }))
  .pipe(dest("./dist/css", { sourcemaps: "." }))
}

// js
const minifyJs = () => {
  return src("./src/js/*.js", { sourcemaps: true })
  .pipe(uglify())
  .pipe(dest("./dist/js", { sourcemaps: "." }))
}
// jQuery
const jqueryMini = () => {
  return src("./node_modules/jquery/dist/jquery.min.js", { sourcemaps: true })
  .pipe(uglify())
  .pipe(dest("./dist/js/jquery/", { sourcemaps: "." }))
}

// icon
const icon = () => {
  return src("./*.jpg")
    .pipe(dest('./dist/assets/icon'))
}

// image
const copyImage = () => {
  return src("./src/assets/**")
    .pipe(imagemin([
      mozjpeg({
        quality: 80,
      }),
      pngquant({
        quality: [0.6, 0.7],
        speed: 1,
      }),
      imagemin.svgo(),
      imagemin.optipng(),
      imagemin.gifsicle({ optimizationLevel: 3 }),
    ]))
    .pipe(dest('./dist/assets/'))
}


//----------------------------------------------------------------------
//  watch関数での変更処理
//----------------------------------------------------------------------
const watchFiles = () => {
  watch("./src/sass/**/*.scss", { ignoreInitial: false }, compileSass).on("change", reload)
  watch("./src/js/*.js", { ignoreInitial: false }, minifyJs).on("change", reload)
  watch("./src/html/**/*.pug", { ignoreInitial: false }, compilePug).on("change", reload)

  browserSync.init({
      server: {
        baseDir: "./dist",
      },
  })
}


//----------------------------------------------------------------------
//  build時の設定
//----------------------------------------------------------------------

//Pugのコンパイル
const buildPug = () => {
  return src("./src/html/**/*.pug")
    .pipe(pug({ outputStyle: "compressed" }))
    .pipe(dest("./dist"))
}

//Sassのコンパイル
const buildSass = () => {
  return src("./src/sass/**/*.scss")
    .pipe(sass({ outputStyle: "compressed" }))
    .pipe(dest("./dist/css"))
}
//JSのコンパイル
const buildJs = () => {
  return src("./src/js/*.js")
    .pipe(uglify())
    .pipe(dest("./dist/js"))
}
//jQueryのコンパイル
const buildJquery = () => {
  return src("./node_modules/jquery/dist/jquery.min.js")
    .pipe(uglify())
    .pipe(dest("./dist/js/jquery"))
}
//slickのコンパイル
const buildSlickJs = () => {
  return src("./node_modules/slick-carousel/slick/slick.min.js")
    .pipe(uglify())
    .pipe(dest("./dist/js/jquery/slick"))
}
const buildSlickSass = () => {
  return src("./node_modules/slick-carousel/slick/slick.scss","./node_modules/slick-carousel/slick/slick-theme.scss")
    .pipe(sass({ outputStyle: "compressed" }))
    .pipe(dest("./dist/css/slick"))
}
const buildSlickThemeSass = () => {
  return src("./node_modules/slick-carousel/slick/slick-theme.scss")
    .pipe(sass({ outputStyle: "compressed" }))
    .pipe(dest("./dist/css/slick"))
}


const deletFiles = async (cb) => {
  const filesToDelete = ["./dist/css/style.css.map", "./dist/js/main.js.map", "./dist/js/sub.js.map", "./dist/**/index.html.map"]

  let deletedCount = 0

  filesToDelete.forEach((filePath) => {
    fs.unlink(filePath, (err) => {
      if (err) {
        console.error(err)
      } else {
        console.log(`Deleted file: ${filePath}`)
        deletedCount++
        if (deletedCount === filesToDelete.length) {
          console.log("All files deleted successfully")
          cb()
        }
      }
    })
  })
}
// watch設定
exports.dev = parallel(watchFiles, buildSass, buildJs, buildJquery)
// build設定
exports.build = parallel(buildSass, buildJs, deletFiles, buildJquery, icon, copyImage, buildSlickJs, buildSlickSass, buildSlickThemeSass, buildPug)
