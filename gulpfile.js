"use strict";

var config = require('./config.json');

var gulp 			= require('gulp'),
	concatCSS 	= require('gulp-concat-css'),
	minifyCSS 	= require('gulp-minify-css'),
	uglify 			= require('gulp-uglify'),
	unCSS 			= require('gulp-uncss'), //Удаляет не примененные стили
	notify 			= require('gulp-notify'),
	sourcemaps 	= require('gulp-sourcemaps'),
	livereload  = require('gulp-livereload'),
	connect 		= require('gulp-connect'),
	sass 			  = require('gulp-ruby-sass'),
	prefixer 		= require('gulp-autoprefixer'),
	open 			  = require('gulp-open'),
	pug 			  = require('gulp-pug'),
	gutil 			= require('gulp-util'),
	rename 			= require('gulp-rename'),
	prettify 		= require('gulp-prettify'),
	clean 			= require('gulp-clean'),
  pump        = require('pump'),
  cleanCSS = require('gulp-clean-css');

var errorLog = function (error) {
  console.error(error.toString());
  this.emit('end');
};

gulp.task('connect', function() {
	connect.server({
		root: 'dist',
		livereload: true
	});
	var options = {
		uri: 'http://localhost:8080',
		app: 'chrome'
	};
	gulp.src(config.dist + 'index.html')
	.pipe(open(options));
});

gulp.task('clean', function () {
	return gulp.src(config.dist, {read: false})
			.pipe(clean());
})

//scss
gulp.task('scss', function () {
  return sass(config.scss, ({
      emitCompileError: true,
      sourcemap: true,
    }))
    .on('error', sass.logError)
    .on('error', notify.onError("Task SCSS Error: <%= error.message %>"))
    .pipe(sourcemaps.init())
    .pipe(prefixer({
      browsers: ["last 50 version", "> 1%", "ie 8", "ie 7"],
      cascade: true
    }))
    .pipe(notify('Task SCSS Complete!'))
    .pipe(sourcemaps.write('.'))
    .pipe(cleanCSS())
    .pipe(gulp.dest(config.dist + 'css/'))
    .pipe(connect.reload());
});

//html
gulp.task('html', function() {
	gulp.src('src/index.html')
	.pipe(gulp.dest(config.dist))
	.pipe(notify('Task HTML Complete!'))
    .pipe(connect.reload());
});

//pug
gulp.task('pug', function() {
  gulp.src(config.pug)
    .pipe(pug({
        basedir: __dirname
    }))
    .on('error', function(err){
      gutil.log(gutil.colors.red(err))
    })
    .pipe(prettify({
      indent_size: 1,
      indent_inner_html: true,
      indent_char: '\t',
      preserve_newlines: true,
      max_preserve_newlines: 0,
      unformatted: true,
      end_with_newline: false
    }))
    .pipe(notify('Task PUG Complete!'))
    .pipe(gulp.dest(config.dist))
    .pipe(connect.reload());
});

// Inc Task
gulp.task('inc', function(){
  gulp.src(config.inc)
  .pipe(gulp.dest(config.dist + 'inc/'))
  .pipe(connect.reload());
});

// JS Task
gulp.task('js', function(cb){
	pump([
    gulp.src(config.js),
    uglify(),
    gulp.dest(config.dist + 'js/'),
    connect.reload(),
  ], cb);
});

// Image
gulp.task('img', function(){
	gulp.src(config.img)
	.pipe(gulp.dest(config.dist + 'img/'))
	.pipe(connect.reload());
});

// Fonts
gulp.task('fonts', function(){
	gulp.src(config.fonts)
	.pipe(gulp.dest(config.dist + 'fonts/'))
	.pipe(connect.reload());
});

// Main.js Task
gulp.task('main_js', function(){
	gulp.src('./src/js/main.js')
	.pipe(gulp.dest(config.dist + 'js/'));
});



//watch
gulp.task('watch', function() {
	gulp.watch('src/scss/**/*.scss', ['scss']);
	gulp.watch('src/pug/**/*.pug', ['pug']);
  gulp.watch('src/js/**/*.js', ['js']);
	gulp.watch('src/inc/**/**', ['inc']);
	gulp.watch('src/img/**/**', ['img']);
	gulp.watch('src/fonts/**/**', ['fonts']);
});

//default
gulp.task('default', ['connect', 'img', 'js', 'fonts',  'scss',  'pug', 'inc', 'watch']);

