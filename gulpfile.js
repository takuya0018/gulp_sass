// const gulp = require('gulp');
const { src, dest, watch, parallel, series } = require("gulp");
// const sass = require('gulp-sass')(require('sass')); //旧sass
var sass = require('gulp-dart-sass'); //新sass
const browserSync = require('browser-sync').create();
const reload = browserSync.reload;
const plumber = require("gulp-plumber");
const notify = require("gulp-notify");
const uglify = require("gulp-uglify");
const fs = require("fs");

// sass
const compileSass = () => {
  return src("./src/sass/**/*.scss", { sourcemaps: true })
  .pipe(plumber({ errorHandler: notify.onError("Error: <%= error.message %>") }))
  .pipe(sass({ outputStyle: "compressed" }))
  .pipe(dest("./dest/css", { sourcemaps: "." }))
}

// js
const minifyJs = () => {
  return src("./src/js/*.js", { sourcemaps: true })
  .pipe(uglify())
  .pipe(dest("./dest/js", { sourcemaps: "." }))
}

// // html
const copyHtml = () => {
    return src("./src/html/**/*.html")
      .pipe(dest("./dest"))
}
    
    
const watchFiles = () => {
  watch("./src/sass/**/*.scss", { ignoreInitial: false }, compileSass).on("change", reload)
  watch("./src/js/*.js", { ignoreInitial: false }, minifyJs).on("change", reload)
  watch("./src/html/**/*.html", { ignoreInitial: false }, copyHtml).on("change", reload)

  browserSync.init({
      server: {
        baseDir: "./dest",
      },
  })
}


// - build時の設定
//Sassのコンパイル
const buildSass = () => {
  return src("./src/sass/**/*.scss")
    .pipe(sass({ outputStyle: "compressed" }))
    .pipe(dest("./dest/css"))
}
//JSの圧縮
const buildJs = () => {
  return src("./src/js/*.js")
    .pipe(uglify())
    .pipe(dest("./dest/js"))
}

const deletFiles = async (cb) => {
  const filesToDelete = ["./dest/css/style.css.map", "./dest/js/main.js.map"]

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
exports.default = watchFiles
// build設定
exports.build = parallel(buildSass, buildJs, deletFiles)
