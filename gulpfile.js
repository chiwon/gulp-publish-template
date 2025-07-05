const gulp = require('gulp');
const sass = require('gulp-sass')(require('sass'));
const fileInclude = require('gulp-file-include');
const browserSync = require('browser-sync').create();
const clean = require('gulp-clean');
const beautify = require('gulp-beautify');
const plumber = require('gulp-plumber');
const newer = require('gulp-newer');
const path = require('path');

// ────────────────────────────────
// 경로 설정
// ────────────────────────────────
const paths = {
  html: {
    src: ['src/pages/**/*.html', '!src/pages/**/_*.html'],
    watch: ['src/pages/**/*.html'],
    dest: 'dist/pages',
  },
  index: {
    src: 'src/index.html',
    dest: 'dist',
  },
  scss: {
    src: 'src/assets/scss/app.scss',
    watch: 'src/assets/scss/**/*.scss',
    dest: 'dist/assets/css',
  },
  js: {
    src: ['src/assets/js/**/*.js', '!src/assets/js/vendors/**'],
    vendor: 'src/assets/js/vendors/**/*.js',
    dest: 'dist/assets/js',
  },
  cssVendor: {
    src: 'src/assets/css/vendors/**/*.css',
    dest: 'dist/assets/css/vendors',
  },
  img: {
    src: 'src/assets/img/**/*',
    dest: 'dist/assets/img',
  },
};

// ────────────────────────────────
// 초기화
// ────────────────────────────────
gulp.task('clean', () => {
  return gulp.src('dist', { read: false, allowEmpty: true }).pipe(clean());
});

// ────────────────────────────────
// SCSS 컴파일
// ────────────────────────────────
gulp.task('scss', () => {
  return gulp
    .src(paths.scss.src)
    .pipe(plumber())
    .pipe(sass().on('error', sass.logError))
    .pipe(beautify.css({ indent_size: 2 }))
    .pipe(gulp.dest(paths.scss.dest))
    .pipe(browserSync.stream());
});

// ────────────────────────────────
// HTML (File Include 포함)
gulp.task('html', done => {
  gulp
    .src(paths.html.src)
    .pipe(plumber())
    .pipe(fileInclude({ prefix: '@@', basepath: '@file' }))
    .pipe(beautify.html({ indent_size: 2 }))
    .pipe(gulp.dest(paths.html.dest))
    .on('finish', () => {
      browserSync.reload();
      done();
    });
});

// index.html 따로
gulp.task('index', done => {
  gulp
    .src(paths.index.src)
    .pipe(beautify.html({ indent_size: 2 }))
    .pipe(gulp.dest(paths.index.dest))
    .on('finish', () => {
      browserSync.reload();
      done();
    });
});

// ────────────────────────────────
// JS 처리 (custom + vendor 분리)
gulp.task('js:custom', done => {
  gulp
    .src(paths.js.src)
    .pipe(plumber())
    .pipe(beautify.js({ indent_size: 2 }))
    .pipe(gulp.dest(paths.js.dest))
    .on('finish', () => {
      browserSync.reload();
      done();
    });
});

gulp.task('js:vendor', () => {
  return gulp
    .src(paths.js.vendor)
    .pipe(newer(path.join(paths.js.dest, 'vendors')))
    .pipe(gulp.dest(path.join(paths.js.dest, 'vendors')));
});

gulp.task('js', gulp.parallel('js:custom', 'js:vendor'));

// ────────────────────────────────
// vendor CSS 복사
gulp.task('css:vendor', () => {
  return gulp
    .src(paths.cssVendor.src)
    .pipe(newer(paths.cssVendor.dest))
    .pipe(gulp.dest(paths.cssVendor.dest));
});

// ────────────────────────────────
// 이미지 복사
gulp.task('images', () => {
  return gulp.src(paths.img.src, { encoding: false }).pipe(gulp.dest(paths.img.dest));
});

// ────────────────────────────────
// 개발 서버 + 감시
// ────────────────────────────────
gulp.task('serve', () => {
  browserSync.init({
    server: { baseDir: 'dist' },
    startPath: '/index.html',
  });

  gulp.watch(paths.index.src, gulp.series('index'));
  gulp.watch(paths.html.watch, gulp.series('html'));
  gulp.watch(paths.scss.watch, gulp.series('scss'));
  gulp.watch(paths.js.src, gulp.series('js:custom'));
  gulp.watch(paths.js.vendor, gulp.series('js:vendor'));
  gulp.watch(paths.cssVendor.src, gulp.series('css:vendor'));
  gulp.watch(paths.img.src, gulp.series('images'));
});

// ────────────────────────────────
// Build & Default
// ────────────────────────────────
gulp.task('build', gulp.parallel('index', 'html', 'scss', 'js', 'css:vendor', 'images'));
gulp.task('default', gulp.series('clean', 'build', 'serve'));
