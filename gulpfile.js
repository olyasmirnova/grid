let project_folder = "dist";
let source_folder = "src";
var scss = require('gulp-sass')(require('sass'));

let path = {
    build: {
        html: project_folder + "/",
        css: project_folder + "/css/",
        js: project_folder + "/js/",
        img: project_folder + "/img/",
        fonts: project_folder + "/fonts/",
    },
    src: {
        html: source_folder + "/*.html",
        css: source_folder + "/scss/main.scss",
        // kit: source_folder + "/kit/*.kit",
        js: source_folder + "/js/*.js",
        img: source_folder + "/img/**/*.*",
        fonts: source_folder + "/fonts/**/*.*",
    },
    watch: {
        html: source_folder + "/**/*.html",
        css: source_folder + "/scss/**/*.scss",
        kit: source_folder + "/kit/**/*.kit",
        js: source_folder + "/js/**/*.js",
        img: source_folder + "/img/**/*.*",
    },
    clean: "./" + project_folder + "/"
}
let { src, dest } = require("gulp"),
    gulp = require("gulp"),
    browsersync = require("browser-sync").create(),
    fileinclude = require("gulp-file-include"),
    del = require("del"),
    // scss = require("gulp-sass");
    autoprefixer = require("gulp-autoprefixer"),
    group_media = require("gulp-group-css-media-queries"),
    clean_css = require("gulp-clean-css"),
    rename = require("gulp-rename"),
    // kit = require('gulp-kit'),
    uglify = require("gulp-uglify-es").default,
    imagemin = require("gulp-imagemin"),
    svgSprite = require("gulp-svg-sprite");
    sourcemaps = require("gulp-sourcemaps");

function browserSync(params) {
    browsersync.init({
        server: {
            baseDir: "./" + project_folder + "/"
        },
        port: 3000,
    })
}

// function buildKit() {
//     return src(path.src.kit)
//         .pipe(kit())
//         .pipe(dest(path.build.html))
//         .pipe(browsersync.stream());
// }

function html() {
    return src(path.src.html)
        .pipe(fileinclude())
        .pipe(dest(path.build.html))
        .pipe(browsersync.stream());
}


function css() {
    return src(path.src.css)
        .pipe(
            scss({
                outputStyle: "expanded"
            })
        )
        .pipe(
            autoprefixer({
                overrideBrowserslist: ["last 5 versions"],
                cascade: true
            })
        )
        .pipe(group_media())
        .pipe(clean_css())
        .pipe(
            rename({
                extname: ".min.css"
            })
        )
        .pipe(dest(path.build.css))
        .pipe(browsersync.stream())
}

function js() {
    return src(path.src.js)
        .pipe(fileinclude())
        .pipe(dest(path.build.js))
        .pipe(
            uglify()
        )
        .pipe(
            rename({
                extname: ".min.js"
            })
        )
        .pipe(dest(path.build.js))
        .pipe(browsersync.stream())
}

function images() {
    return src(path.src.img)
        .pipe(
            imagemin({
                progressive: true,
                svgoPlugins: [{ removeViewBox: false }],
                interlaced: true,
                optimizationLevel: 3
            })
        )
        .pipe(dest(path.build.img))
}

// gulp.task('svgSprite', function () {
//     return gulp.src([path.src.img + '/iconssprite/*.svg'])
//         .pipe(svgSprite({
//             mode: {
//                 stack: {
//                     sprite: "../iconssprite/sprite.svg",
//                     example: true
//                 }
//             },
//         }))
//         .pipe(dest(path.build.img))
// })


function watchFiles() {
    // gulp.watch([path.watch.kit], buildKit);
    gulp.watch([path.watch.html], html);
    gulp.watch([path.watch.css], css);
    gulp.watch([path.watch.js], js);
    gulp.watch([path.watch.img], images);
}

function clean(params) {
    return del(path.clean);
}

let build = gulp.series(clean, gulp.parallel(js, css, html, images));
let watch = gulp.parallel(build, watchFiles, browserSync);

exports.images = images;
exports.css = css;
exports.html = html;
exports.build = build;
exports.watch = watch;
exports.default = watch;
