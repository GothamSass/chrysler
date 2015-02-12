var gulp = require('gulp');
var browserSync = require('browser-sync');
var reload = browserSync.reload;
var harp = require('harp');
var scsslint = require('gulp-scss-lint');
var cache = require('gulp-cached');
var nodemon = require('gulp-nodemon');

var paths = {
  templates: '**/*.{jade, md}',
  css: 'assets/stylesheets/*.css',
  sass: ['assets/stylesheets/**/*.scss', 'assets/stylesheets/*.scss'],
  images: 'assets/stylesheets/img/**/*',
  js: 'assets/js/**/*.js',
  fonts: 'assets/fonts/**/*',
};


/**
 * Nodemon
 */
gulp.task('nodemon', function() {
  nodemon({script: 'app.js'})
    .on('start', function(){
      console.log('nodemon started');
    })
    .on('change', ['serve'])
    .on('crash', function(){
      console.log('nodemon crashed');
    });
});


/**
 * Serve the Harp Site root directory
 */
gulp.task('serve',['nodemon'], function () {
    browserSync({
      proxy: "localhost:4000",
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
  // })
});


/**
 * Lint files
 */
gulp.task('lint', function() {
  gulp.src(paths.sass)
    .pipe(cache('scsslint'))
    .pipe(scsslint({'config': 'lint.yml',}))
    .pipe(reload({stream: true}));
});


/**
 * Default task, running just `gulp` will compile the sass,
 * compile the harp site, launch BrowserSync & watch files.
 */
gulp.task('default', ['serve', 'lint']);
