var gulp=require('gulp');
var rename=require('gulp-rename');
var rev=require('gulp-rev');
var reUrl=require('gulp-rev-css-url');
var mincss=require('gulp-minify-css');
//var sass=require('gulp-sass');
var uglify=require('gulp-uglify');
var clean=require('gulp-clean');
var autoprefixer=require('gulp-autoprefixer');
var changed=require('gulp-changed');
var babel=require('gulp-babel');
var spritesmith=require('gulp-spritesmith');
var imagemin=require('imagemin');
var revCollector=require('gulp-rev-collector');
var minifyHTML=require('gulp-minify-html');
var browserSync=require('browser-sync').create();
var sequence=require("run-sequence");
var cwd="janeshop";
//实例化一个服务器对象
gulp.task("serve",function(){
    browserSync.init({
        server:{baseDir: "./dist"}
    })
});
//文件夹清空任务
gulp.task("clean",function(){
    gulp.src(["dist/*","rev/"],{read:false})
        .pipe(clean())
});
//css编译，语法检查，css3自动补全浏览器前缀，压缩,重命名，计算md5值，替换css文件应用路径
gulp.task('css', function () {
    return gulp.src('src/css/*.css')
        .pipe(autoprefixer())
        .pipe(mincss())
//        .pipe(rename(
//            {
//                prefix:cwd+'.',
//                suffix:'.min',
//                extname:'.css'
//            }
//        ))
        .pipe(rev())
        .pipe(gulp.dest('dist/css'))
        .pipe( rev.manifest() )
        .pipe( gulp.dest( 'rev/css' ) );
});
//javascript语法检查，压缩，重命名，计算md5值，替换js文件路径
gulp.task("js",function(){
    return gulp.src('src/js/*.js')
//        .pipe(jshint())
        .pipe(uglify())
//        .pipe(rename(
//            {
//                prefix:cwd+'.',
//                suffix:'.min',
//                extname:'.js'
//            }
//        ))
        .pipe(rev())
        .pipe(gulp.dest('dist/js'))
        .pipe( rev.manifest() )
        .pipe( gulp.dest( 'rev/js' ) );
});

gulp.task('rev', function () {
    return gulp.src(['rev/**/*.json','index.html'])
        .pipe( revCollector({
            replaceReved: true,
            dirReplacements: {
                'src/css/': 'css/',
                'src/js/': 'js/',
                'src/img/': 'img/'
            }
        }) )
        .pipe( minifyHTML({
            empty:true,
            spare:true
        }) )
        .pipe( gulp.dest('dist') );
});
//图片合成雪碧图，压缩，重命名，计算md5值，替换图片文件路径
gulp.task("sprite",function(){
    var spriteData= gulp.src('./src/img/*.png')
        .pipe(spritesmith(
            {
                imageName:'sprites.png',
                cssName:'sprites.css'
            }
        ));
        return spriteData.pipe(gulp.dest("./dist/sprites/"));
});
//图片处理
gulp.task("img",function(){
    gulp.src("./src/img/**/*.{jpg,jpeg,png,gif}")
//        .pipe(imagemin())
        .pipe(rev())
        .pipe(gulp.dest("dist/img/"))
        .pipe(rev.manifest())
        .pipe(gulp.dest("rev/img/"))
});
//gulp.task("sprite",function(){
//    return gulp.src('./src/img/**/*.{jpeg,jpg,gif,png,svg}')
//        .pipe(spritesmith())
//        .pipe(imagemin())
//        .pipe(rename())
//        .pipe(rev())
//        .pipe(revCollector())
//        .pipe(gulp.dest("./dist"))
//});
//默认任务
gulp.task("default",function(){
    sequence("clean","css","js","rev","serve");
});