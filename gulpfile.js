var gulp = require('gulp');
var connect = require('gulp-connect');
var del = require('del');
var rename = require('gulp-rename');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var sass = require('gulp-sass');
var tsc = require('gulp-typescript');
var Builder = require('systemjs-builder');
var inlineNg2Template = require('gulp-inline-ng2-template');

// Directories
var src = 'src';
var app = src + '/app';
var dist = 'dist';

// Globs
var appCss = app + '/**/*.css';
var appSass = app + '/**/*.scss';
var appTypeScript = app + '/**/*.ts';
var appHtml = app + '/**/*.html';

// Start dev server
gulp.task('connect', function () {
    connect.server({
        root: ['./', src],
        fallback: src + '/index.html',
        livereload: true
    });
});

// Dev Server Reloader
gulp.task('reload', function () {
    return gulp.src(src + '/index.html')
        .pipe(connect.reload());
});

// SASS Watcher
gulp.task('sass:watch', function () {
    gulp.watch(app + '/**/*.scss', gulp.series('sass'));
});

// App Watcher
gulp.task('app:watch', function () {
    gulp.watch([appCss, appTypeScript, appHtml], gulp.series('reload'));
});

// SASS Compiler
gulp.task('sass', function () {
    return gulp.src(appSass)
        .pipe(sass().on('error', sass.logError))
        .pipe(gulp.dest(app));
});

// Cleanup
gulp.task('clean', function () {
    return del([appCss, dist]);
});

// Inline Angular Templates
gulp.task('inline-templates', function () {
    return gulp.src([appTypeScript, '!' + app + '/app.main.development.ts'])
        .pipe(inlineNg2Template({
            UseRelativePaths: true,
            indent: 0,
            removeLineBreaks: true
        }))
        .pipe(tsc({
            'target': 'ES5',
            'module': 'system',
            'moduleResolution': 'node',
            'sourceMap': true,
            'emitDecoratorMetadata': true,
            'experimentalDecorators': true,
            'removeComments': true,
            'noImplicitAny': false
        }))
        .pipe(gulp.dest(dist + '/app'));
});

// Copy index.html to dist folder
gulp.task('copy-index', function () {
    return gulp.src(src + '/index.production.html')
        .pipe(rename('index.html'))
        .pipe(gulp.dest(dist));
});

// Copy CSS Files to dist folder
gulp.task('copy-css', function () {
   return gulp.src(appCss)
       .pipe(gulp.dest(dist + '/app'));
});

// Build dependencies .js file
gulp.task('copy-libraries', function () {
    return gulp.src([
        'node_modules/core-js/client/shim.min.js',
        'node_modules/zone.js/dist/zone.min.js',
        'node_modules/reflect-metadata/Reflect.js',
        'node_modules/systemjs/dist/system.js'])
        .pipe(concat('dependencies.js'))
        .pipe(uglify())
        .pipe(gulp.dest(dist));
});

// Bundle application as SFX build
gulp.task('bundle-app', function () {
    var builder = new Builder('', 'systemjs.config.production.js');

    return builder
        .buildStatic(dist + '/app/**/*.js', dist + '/app.js', {
            minify: true
        });
});

// Clean build artifacts
gulp.task('clean-artifacts', function () {
    return del(dist + '/app/');
});

// Run dev-server
gulp.task('run-dev',
    gulp.series('sass',
    gulp.parallel('app:watch', 'sass:watch', 'connect')));

// Build for production
gulp.task('build',
    gulp.series('clean',
    gulp.series('sass'),
    gulp.series('copy-css'),
    gulp.parallel('copy-index', 'copy-libraries', 'inline-templates'),
    gulp.series('bundle-app'),
    gulp.series('clean-artifacts')));