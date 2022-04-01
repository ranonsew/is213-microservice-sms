const { src, dest, task } = require('gulp');
const ts = require('gulp-typescript');
const tsProject = ts.createProject('tsconfig.json');

task('amqp', () => src('src/amqp/ts/*.ts').pipe(tsProject()).js.pipe(dest('src/amqp/js')));
