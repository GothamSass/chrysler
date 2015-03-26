var gulp = require('gulp');

var bower = require('bower');
var bowerFiles = require('main-bower-files');
var del = require('del');
var browserSync = require('browser-sync');
var cache = require('gulp-cached');
var harp = require('harp');
var reload = browserSync.reload;
var scsslint = require('gulp-scss-lint');

var paths = {
  templates: '**/*.{jade, md}',
  css: 'assets/stylesheets/*.css',
  sass: ['assets/stylesheets/**/*.scss', 'assets/stylesheets/*.scss'],
  images: 'assets/img/**/*',
  js: 'assets/js/**/*.js',
  fonts: 'assets/fonts/**/*'
};


/**
 * Serve the Harp Site root directory
 */
gulp.task('serve', function () {
  harp.server(__dirname, {
    port: 9000
  }, function () {
    browserSync({
      proxy: 'localhost:9000',
      open: false,
      logLevel: 'debug',
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
gulp.task('lint', function() {

  gulp.src(paths.sass)
    .pipe(cache('scsslint'))
    .pipe(scsslint({ 'config': 'lint.yml' }))
    .pipe(reload({ stream: true }));
});

/**
  * Bower tasks for Sass files and utility helpers
  * move files from  `bower_components` to`sass/plugins/blower`
**/

gulp.task('bower-clean-sass', function (cb) {
  del(['assets/stylesheets/plugins/bower'], cb);
});

gulp.task('bower-clean', ['bower-clean-sass']);

gulp.task('bower-install', function (cb) {
  bower.commands.install([])
    .on('end', function () {
      cb();
    });
});

gulp.task('bower-sass', ['bower-clean-sass', 'bower-install'], function () {
  return gulp.src(bowerFiles({
      includeDev: true,
      filter: ['**/*.scss', '**/*.css'],
    }), {base: 'bower_components'})
    .pipe(gulp.dest('assets/stylesheets/plugins/bower'));
});

gulp.task('bower', ['bower-sass']);

/**
 * Default task, running just `gulp` will compile the sass,
 * compile the harp site, launch BrowserSync & watch files.
 */
gulp.task('default', ['serve', 'lint']);
