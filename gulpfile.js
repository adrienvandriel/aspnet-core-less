/// <binding BeforeBuild='process:less' />

var gulp = require("gulp"),
    less = require("gulp-less"),
    rename = require("gulp-rename"),
    changeCase = require('change-case'),
    cssmin = require("gulp-cssmin"),
    concat = require("gulp-concat"),
    clean = require('gulp-clean'),
    runSequence = require("run-sequence");

var paths = {};
paths.webroot = "./wwwroot/";
paths.cssTarget = "./wwwroot//css";
paths.lessSrc = "Styles/**/*.less";
paths.minCss = paths.webroot + "css/**/*.min.css";
paths.cssSrc = paths.webroot + "css/**/*.css";

gulp.task("compile:less", function () {
	return gulp.src(paths.lessSrc)
		.pipe(less())
		.pipe(rename(function (path) {
			path.dirname = changeCase.lowerCase(path.dirname);
			path.basename = changeCase.lowerCase(path.basename);
			path.extname = changeCase.lowerCase(path.extname);
		}))
		.pipe(gulp.dest(paths.cssTarget));
});

gulp.task("minify:css", function () {
	return gulp.src([paths.cssSrc, "!" + paths.minCss], { base: "." })
		.pipe(cssmin())
		.pipe(rename({ extname: ".min.css" }))
		.pipe(gulp.dest("."));
});

gulp.task("bundle:css", function () {
	return gulp.src([
			"./wwwroot/css//styles.css",
			"./wwwroot/css//second.css"])
		.pipe(concat("bundle.css"))
		.pipe(gulp.dest("./wwwroot/css"));
});

gulp.task("clean:css", function () {
	return gulp.src(paths.cssTarget, { read: false })
		.pipe(clean());
});

gulp.task("process:less", function (callback) {
	runSequence("clean:css", "compile:less", "bundle:css", "minify:css", callback);
});

gulp.task("watch:less", ["process:less"], function () {
	gulp.watch(paths.lessSrc, ["process:less"]);
});