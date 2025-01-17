// -Прописать таски ( задачи ) --переложить файлы .html из папки source в папку build ----если есть удалить папку build если нет, то создать ее --настроить сервер и поднять его из папки build ----статику и динамику ( то что постоянно отслеживать надо ), статика должна оставаться в режиме разработки в папке source и мониторится из папки build. Если же происходит npm run build, то все картинки и шрифты перетаскиваются в папку build. --переложить файлы .scss из папки source в папку build

import gulp from 'gulp';
import plumber from 'gulp-plumber';
import sass from 'gulp-dart-sass';
import browser from 'browser-sync';
import rimraf from 'gulp-rimraf';
import imagemin from 'gulp-imagemin';
import ttf2woff from 'gulp-ttf2woff';

// Script js

const scripts = () => {
  return gulp.src('source/js/**/*.js')
    .pipe(gulp.dest('build/js'))
}

// Шрифты ttf в woff

const fonts = () => {
  return gulp.src('source/fonts/**/*.ttf')
    .pipe(ttf2woff())
    .pipe(gulp.dest('build/fonts'))
}

// Images

const optimizeImages = () => {
  return gulp.src('source/images/**/*.*')
    .pipe(imagemin())
    .pipe(gulp.dest('build/images'))
}

// Удаляет build

const cleanBuild = () => {
  return gulp.src('build', {read: false, allowEmpty: true})
    .pipe(rimraf());
}

// Перетаскивает файлы .html

const taskHTML = () => {
  return gulp.src('source/*.html')
    .pipe(gulp.dest('build'));
}

// Перетаскивает файлы .scss

const taskStyles = () => {
  return gulp.src('source/styles/styles.scss', { sourcemap: true })
    .pipe(plumber())
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest('build/styles', { sourcemap: '.' }))
    .pipe(browser.stream());
}

// Поднимает сервер

const server = (done) => {
  browser.init({
    server: {
      baseDir: 'build'
    },
    cors: true,
    notify: false,
    ui: false,
  });
  done();
}

// Отслеживает изменения, watcher

const watcher = () => {
  gulp.watch('source/styles/**/*.scss', gulp.series(taskStyles));
  gulp.watch('source/*.html').on('change', gulp.series(taskHTML, browser.reload));
  gulp.watch('source/js/**/*.js', gulp.series(scripts));
}

const build = gulp.series(cleanBuild, taskHTML, taskStyles, optimizeImages, fonts, scripts);

export default gulp.series(
  build,
  server,
  watcher
)
