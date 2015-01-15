var gulp = require('gulp');
var browserSync = require('browser-sync');
var reload = browserSync.reload;
var harp = require('harp');
var scsslint = require('gulp-scss-lint');

var paths = {
  templates: '**/*.{jade, md}',
  css: 'assets/stylesheets/*.css',
  sass: ['assets/stylesheets/**/*.scss', 'assets/stylesheets/*.scss'],
  images: 'assets/stylesheets/img/**/*',
  js: 'assets/js/**/*.js',
  fonts: 'aseets/fonts/**/*',
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
      notify: false
    });

    /**
     * Watch for scss changes, tell BrowserSync to refresh css
     */
    gulp.watch(paths.sass, function () {
      reload(paths.css, {stream: true});
    });

  })
});

/**
 * Lint files
 */
gulp.task('lint', function() {
  gulp.src(paths.sass)
    .pipe(scsslint());
});


/**
 * Default task, running just `gulp` will compile the sass,
 * compile the harp site, launch BrowserSync & watch files.
 */
gulp.task('default', ['serve']);
