var gulp = require('gulp'),
    scss = require('gulp-sass'),
    pug = require('gulp-pug'),
    plumber = require('gulp-plumber'),
    webpack = require('webpack'),
    bs = require('browser-sync'),
    concat = require('gulp-concat'),
	webpackStream = require('webpack-stream'),
	notify = require('gulp-notify'),
	svgSprite = require('gulp-svg-sprite'),
	svgmin = require('gulp-svgmin'),
	cheerio = require('gulp-cheerio'),
	replace = require('gulp-replace');

const pathJS = [
    'node_modules/jquery/dist/jquery.min.js'
];

gulp.task('pug', function () {
	gulp.src('app/_pug/*.pug')
	    .pipe(plumber())
	    .pipe(pug({
      				pretty: true
    	}))
	    .pipe(gulp.dest('dist/'));
});

gulp.task('scss', function () {
  gulp.src('app/_scss/**/*.scss')
  	.pipe(plumber())
    .pipe(scss().on('error', scss.logError))
    .pipe(gulp.dest('dist/css'));
});

gulp.task('server',function(){
    bs({
        port: 9000,
        server: {
            baseDir: 'dist'
        }
    })
});

gulp.task('jsLibs', function() {
	return gulp.src(pathJS)
	  .pipe(concat('foundation.js'))
	  .pipe(gulp.dest('dist/js/'))
});

gulp.task('jsBuild', () => {
	var options =  {
			watch: true,
			output: {
			  filename: 'main.js',
			  library: 'app'
			},
			devtool: "source-map",
			module: {
				rules: [
					{
						test: /\.js$/,
						loader: 'babel-loader',
						query: {
							presets: ['es2015']
						}
					}
				]
			},
			plugins: [
				new webpack.optimize.UglifyJsPlugin({
					compress: {
						warnings: false,
						drop_console: true,
						unsafe: true
					}
				})
				//new webpack.NoEmitOnErrorsPlugin()
			]
		};
	return gulp.src('app/js/main.js')
		.pipe(plumber({
			errorHandler: notify.onError(err => ({
				title: 'Webpack',
				message: err.message
			}))	
		}))
		.pipe(webpackStream(options,webpack))
		.pipe(gulp.dest('dist/js/'));
});

gulp.task('imgCopy', () => {
	gulp.src('app/img/*')
		.pipe(gulp.dest('dist/img/'));
	gulp.src('app/pictures/*')
		.pipe(gulp.dest('dist/pictures/'));
});
gulp.task('copyData', () => {
	gulp.src('app/data/*')
		.pipe(gulp.dest('dist/data/'));
});
gulp.task('copyFonts', () => {
	gulp.src('app/fonts/**/*')
		.pipe(gulp.dest('dist/fonts/'));
});
gulp.task('sprite', function () {
	return gulp.src('app/pictures/icons/*.svg')

		// cheerio plugin create unnecessary string '&gt;', so replace it.
		.pipe(replace('&gt;', '>'))
		// build svg sprite
		.pipe(svgSprite({
			mode: {
				symbol: {
					sprite: "../../dist/pictures/sprite.svg",
					render: {
						scss: {
							dest:'../_scss/common/_spriteSvg.scss',
							template: "app/_scss/templates/_sprite_template.scss"
						}
					}
				}
			}
		}))
		.pipe(gulp.dest('app'));
});

gulp.task('watch', function(){
	gulp.watch([
			'dist/*.html',
			'dist/js/*.js',
			'dist/css/*.css'
	]).on('change', bs.reload);
	gulp.watch('app/_scss/**/*',['scss']);
	gulp.watch('app/_pug/**/*',['pug']);
});

gulp.task('default',['server','pug','scss','watch','jsLibs','imgCopy', 'copyData', 'copyFonts', 'jsBuild']);