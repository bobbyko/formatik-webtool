import gulp from "gulp";
import change from "gulp-change"
import { base, tasks } from "./const";


gulp.task(tasks.CLIENT_PROD, () => {
  return gulp.src(base.DEV + "/index.js")
             .pipe(change((content => { return content.replace(/\{\{ENV\}\}/, "production"); })))
             .pipe(gulp.dest(base.DIST));
});
