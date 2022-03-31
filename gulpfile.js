const { src, dest, task } = require('gulp');
const typescript = require('typescript');
const project = typescript.createProject('tsconfig.json');

task('amqp', () => src('src/amqp/ts').pipe(project()).js.pipe(dest('src/amqp/js')));
