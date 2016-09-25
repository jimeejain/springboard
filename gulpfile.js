const gulp = require('gulp');
const sass = require('gulp-sass');
const autoprefixer = require('gulp-autoprefixer');
const sourcemaps = require("gulp-sourcemaps");
const babel = require("gulp-babel");
const concat = require("gulp-concat");
const minify = require('gulp-minify');
const browserSync = require('browser-sync').create();

gulp.task('browserSync',()=>{
	browserSync.init({
		server:{
			baseDir:'dist'
		}
	});
});

gulp.task('sass',() => {
    gulp.src(['src/**/*.scss'])
            .pipe(sourcemaps.init())
            .pipe(sass({ outputStyle: 'compressed' }))
            .pipe(autoprefixer())
            .pipe(sourcemaps.write("."))
            .pipe(concat("app.css"))
            .pipe(gulp.dest('dist/css/'))
            .pipe(browserSync.reload({
                stream:true
            }))            
});

gulp.task('js',()=>{
  return gulp.src([
                "src/js/index.js",
                "src/js/services/*.js",
                "src/js/controllers/*.js",
                "src/**/*.js"])
            .pipe(sourcemaps.init())
            .pipe(babel())
            .pipe(concat("app.js"))
            .pipe(minify())
            .pipe(sourcemaps.write("."))
            .pipe(gulp.dest("dist/js"))
            .pipe(browserSync.reload({
                stream:true
            })) 
});

gulp.task('html',()=>{
    return gulp.src(['src/**/*.html'])
            .pipe(gulp.dest('dist/'))
            .pipe(browserSync.reload({
                stream:true
            })) 
});
gulp.task('images',()=>{
    return gulp.src(['src/images/*.*'])
            .pipe(gulp.dest('dist/images'))
            .pipe(browserSync.reload({
                stream:true
            })) 
});
gulp.task('watch',['browserSync','sass','js','html','images'],()=>{
    gulp.watch('src/**/*.scss',['sass']);
    gulp.watch('src/**/*.js',['js']);
    gulp.watch('src/**/*.html',['html']);
});

gulp.task('default',['watch']);
