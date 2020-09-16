var gulp = require('gulp');
var sass = require('gulp-sass');
var sassGlob = require('gulp-sass-glob');
var browserSync = require('browser-sync');
var postcss      = require('gulp-postcss');
var autoprefixer = require('autoprefixer');
var cssvariables = require('postcss-css-variables'); 
var calc = require('postcss-calc');  
var concat = require('gulp-concat');
var rename = require('gulp-rename');
var uglify = require('gulp-uglify');
var connect  = require('gulp-connect-php');
var pluginName = 'codyframe-wp'; // use your WP theme folder name

// js file paths
var utilJsPath = 'node_modules/codyhouse-framework/main/assets/js'; 
var componentsJsPath = 'assets/js/components/*.js'; // component js files
var scriptsJsPath = 'assets/js'; //folder for final scripts.js/scripts.min.js files

// css file paths
var cssFolder = 'assets/css'; // folder for final style.css/style-fallback.css files
var scssFilesPath = 'assets/css/**/*.scss'; // scss files to watch

function reload(done) {
  browserSync.reload({notify: false});
  done();
} 

gulp.task('sass', function() {
  return gulp.src(scssFilesPath)
  .pipe(sassGlob())
  .pipe(sass({outputStyle: 'compressed'}).on('error', sass.logError))
  .pipe(postcss([autoprefixer()]))
  .pipe(gulp.dest(cssFolder))
  .pipe(browserSync.reload({
    stream: true,
    notify: false
  })); 
  // if you need to support IE11 and below:
  // 1 - remove ; from the above line 👆
  // 2 - uncomment 3 lines below 👇
  // .pipe(rename('style-fallback.css'))
  // .pipe(postcss([cssvariables(), calc()]))
  // .pipe(gulp.dest(cssFolder));
});

gulp.task('scripts', function() {
  return gulp.src([utilJsPath+'/util.js', componentsJsPath])
  .pipe(concat('scripts.js'))
  .pipe(gulp.dest(scriptsJsPath))
  .pipe(rename('scripts.min.js'))
  .pipe(uglify())
  .pipe(gulp.dest(scriptsJsPath))
  .pipe(browserSync.reload({
    stream: true,
    notify: false
  }));
});

gulp.task('watch', gulp.series(['sass', 'scripts'], function () {
  connect.server({}, function (){
    browserSync({
      proxy: 'localhost:8888/'+pluginName,
      notify: false
    });
  });
  gulp.watch('**/*.php', gulp.series(reload));
  gulp.watch('assets/css/**/*.scss', gulp.series(['sass']));
  gulp.watch(componentsJsPath, gulp.series(['scripts']));
}));
