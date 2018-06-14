var gulp = require('gulp');
var cleanCompiledTypeScript = require('gulp-clean-compiled-typescript');

gulp.task('clean-compiled', function () {
  return gulp.src('src/app/**/*.ts')
    .pipe(cleanCompiledTypeScript());
});
