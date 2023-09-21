const path = require('path');

const { dest, series, parallel, src, watch } = require('gulp');
const autoprefixer = require('autoprefixer');
const browserSync = require('browser-sync').create();
const changed = require('gulp-changed');
const cssnano = require('cssnano');
const minify = require('gulp-minify');
const postcss = require('gulp-postcss');
const sass = require('gulp-sass')(require('sass'));
const sourcemaps = require('gulp-sourcemaps');

const dist = process.env.DIST || 'dist'
const paths = {
    src: {
        base: 'src',
        js: {
            base: 'src/assets/js',
            files: 'src/assets/js/*.js'
        },
        scss: {
            base: 'src/assets/styles',
            files: 'src/assets/styles/*.scss'
        },
        static: [
            'src/**/*.html',
            'src/assets/img/**/*'
        ]
    },
    dest: {
        base: dist,
        css: path.join(dist, 'assets/styles'),
        js: path.join(dist, 'assets/js')
    }
}

function buildCss() {
    return src(paths.src.scss.files)
        .pipe(sourcemaps.init())
        .pipe(sass())
        .pipe(postcss([
            autoprefixer(),
            cssnano()
        ]))
        .pipe(sourcemaps.write('.'))
        .pipe(dest(paths.dest.css));
}

function buildJs() {
    return src(paths.src.js.files)
        .pipe(sourcemaps.init())
        .pipe(minify({
            ext: {
                min: '.js'
            },
            noSource: true
        }))
        .pipe(sourcemaps.write('.'))
        .pipe(dest(paths.dest.js));
}

function copyStatic() {
    return src(paths.src.static, { base: paths.src.base })
        .pipe(changed(paths.dest.base))
        .pipe(dest(paths.dest.base))
}

function serve(done) {
    browserSync.init({
        server: {
            baseDir: paths.dest.base,
            serveStaticOptions: {
                extensions: ['html']
            }
        },
        host: process.env.HOST || '127.0.0.1',
        port: process.env.PORT || 8000,
        open: false
    });
    done();
}

function reload(done) {
    browserSync.reload();
    done();
}

function watchFiles() {
    watch(paths.src.scss.base, buildCss);
    watch(paths.src.js.base, buildJs);
    watch(paths.src.static, copyStatic);
    watch(paths.dest.base, reload);
}

const buildTask = parallel(buildCss, buildJs, copyStatic);
const serveTask = parallel(serve, watchFiles);

exports.build = buildTask;
exports.serve = series(buildTask, serveTask);
exports.default = buildTask;
