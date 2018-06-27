'use strict';
/*============MAIN VARIABLES==============*/
var gulp = require('gulp'),
    watch = require('gulp-watch'),
    prefixer = require('gulp-autoprefixer'),
    uglify = require('gulp-uglify'),
    sass = require('gulp-sass'),
    sourcemaps = require('gulp-sourcemaps'),
    notify = require('gulp-notify'),
    cssmin = require('gulp-clean-css'),
    imagemin = require('gulp-imagemin'),
    pngquant = require('imagemin-pngquant'),
    browserSync = require("browser-sync"),
    pug = require("gulp-pug"),
    rimraf = require('rimraf'),
    concat = require('gulp-concat'),
    plumber = require('gulp-plumber'),
    eslint = require('gulp-eslint'),
    postcss = require('gulp-postcss'),
    cssnext = require('postcss-cssnext'),
    reload = browserSync.reload;
/*============/MAIN VARIABLES==============*/

/*==================PATCH=========================*/
var path = {
    build: {
        html: 'build/',
        js: 'build/js/',
        css: 'build/css/',
        img: 'build/img/',
        fonts: 'build/fonts/'
    },
    src: {
        html: 'src/*.html',
        js: 'src/js/main-page.js',
        style: 'src/style/main.scss',
        img: 'src/img/**/*.*',
        fonts: 'src/fonts/**/*.*'
    },
    watch: {
        html: 'src/**/*.html',
        js: 'src/js/**/*.js',
        style: 'src/style/**/*.scss',
        img: 'src/img/**/*.*',
        fonts: 'src/fonts/**/*.*',
        pug: 'src/pug/**/*.pug'
    },
    clean: './build'
};
/*=====================/PATCH=========================*/
/*=====================CONFIG==========================*/
var config = {
    server: {
        baseDir: "./build"
    },
    //tunnel: true,
    host: 'localhost',
    port: 3000,
    logPrefix: "GULP"
};
/*====================/CONFIG============================*/
/*=====================TASKS==============================*/
gulp.task('pug', function() {
  return gulp.src(['./src/pug/*.pug'])
    .pipe( plumber() )
    .pipe(pug({pretty: true}))
    .pipe(gulp.dest('src/'))
    .pipe(browserSync.stream())
});
gulp.task('html:build', function () {
    gulp.src(path.src.html)
        .pipe(gulp.dest(path.build.html))
        .pipe(reload({stream: true}));
});

gulp.task('eslint', function () {
    return gulp.src(['./src/js/**/*.js'])
        .pipe(eslint())
        .pipe(eslint.format())
        .pipe(eslint.failAfterError())
        .on('error',notify.onError({
            message:'There is JS error, please look the console for details'
        }))

});


gulp.task('js:build', function () {
    return gulp.src(['./src/js/**/*.js'])
        .pipe(plumber())
        .pipe(concat('main.js'))
        .pipe(sourcemaps.init())
        .pipe(uglify())
        .pipe(sourcemaps.write())
        .pipe(gulp.dest(path.build.js))
        .pipe(reload({stream: true}));
});

gulp.task('style:build', function () {
    var processors = [
        cssnext({
            'customProperties' :true,
            'colorFunction' :true,
            'customSelectors' :true
        })
    ];
    gulp.src(path.src.style)
        .pipe(postcss(processors))
        .pipe(plumber())
        .pipe(sourcemaps.init())
        .pipe(sass())
        .pipe(prefixer())
        .pipe(cssmin())
        .pipe(sourcemaps.write())
        .pipe(gulp.dest(path.build.css))
        .pipe(reload({stream: true}));
});
gulp.task('image:build', function () {
    gulp.src(path.src.img)
        .pipe(imagemin({
            progressive: true,
            svgoPlugins: [{removeViewBox: false}],
            use: [pngquant()],
            interlaced: true
        }))
        .pipe(gulp.dest(path.build.img))
        .pipe(reload({stream: true}));
});
gulp.task('fonts:build', function() {
    gulp.src(path.src.fonts)
        .pipe(gulp.dest(path.build.fonts))
});


gulp.task('build', [
    'html:build',
    'eslint',
    'js:build',
    'style:build',
    'fonts:build',
    'image:build'
]);
gulp.task('watch', function(){
    watch([path.watch.pug], function(event, cb) {
        gulp.start('pug');
    });
    watch([path.watch.html], function(event, cb) {
        gulp.start('html:build');
    });
    watch([path.watch.style], function(event, cb) {
        gulp.start('style:build');
    });
    watch([path.watch.js], function(event, cb) {
        gulp.start('js:build');
    });
    watch([path.watch.img], function(event, cb) {
        gulp.start('image:build');
    });
    watch([path.watch.fonts], function(event, cb) {
        gulp.start('fonts:build');
    });
});
gulp.task('webserver', function () {
    browserSync(config);
});
gulp.task('clean', function (cb) {
    rimraf(path.clean, cb);
});
gulp.task('default', ['build', 'webserver', 'watch']);
/*===================/TASKS============================*/