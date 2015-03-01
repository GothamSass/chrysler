var gulp = require('gulp');
var browserSync = require('browser-sync');
var reload = browserSync.reload;
var harp = require('harp');
var scsslint = require('gulp-scss-lint');
var cache = require('gulp-cached');
var jshint = require('gulp-jshint');

var paths = {
  templates: '**/*.{jade, md}',
  json: '**/_data.json',
  css: 'assets/stylesheets/*.css',
  sass: ['assets/stylesheets/**/*.scss', 'assets/stylesheets/*.scss'],
  images: 'assets/stylesheets/img/**/*',
  js: 'assets/js/**/*.js',
  fonts: 'assets/fonts/**/*',
};


/**
 * Serve the Harp Site root directory
 */
gulp.task('serve', function () {
  harp.server(__dirname, {
    port: 9000
  }, function () {
    browserSync({
      proxy: "localhost:9000",
      open: false,
      ghostMode: {
        clicks: true,
        forms: false,
        scroll: true
      },
      logLevel: "debug",
      logPrefix: 'GothamSass',
      notify: false
    });


    /**
     * Watch for scss changes, tell BrowserSync to refresh css
     */
    gulp.watch(paths.sass, ['lint',reload]);
    gulp.watch(paths.templates, reload);
    gulp.watch(paths.images, reload);
    gulp.watch(paths.js, reload)
  })
});


/**
 * Lint files
 */
gulp.task('lint-sass', function() {
  gulp.src(paths.sass)
    .pipe(cache('scsslint'))
    .pipe(scsslint({'config': 'lint.yml',}))
    .pipe(reload({stream: true}));
});

gulp.task('lint-js', function() {
  return gulp.src([
    paths.json
    ])
    .pipe(jshint())
    .pipe(jshint.reporter('default'));
});


/**
 * Default task, running just `gulp` will compile the sass,
 * compile the harp site, launch BrowserSync & watch files.
 */
gulp.task('default', ['serve', 'lint']);
