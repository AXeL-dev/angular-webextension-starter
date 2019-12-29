var gulp = require('gulp');
var shell = require('gulp-shell')
var argv = require('yargs').argv;
var file = require('gulp-file');
var fs = require('fs');

// Arguments checks
if (argv.name === undefined) {
  console.log('Please provide --name argument');
  process.exit(1);
}

// Functions
function getFileContent(file) {
  return fs.readFileSync(file, 'utf8');
}

// Global vars
var name = argv.name;
var directory = 'output/' + name;

// Tasks
gulp.task('create-angular-project',
  shell.task('ng new ' + name + ' --defaults --routing=true --directory=' + directory)
);

gulp.task('generate-main-component',
  shell.task('cd ' + directory + ' && ng g c components/main')
);

gulp.task('generate-settings-component',
  shell.task('cd ' + directory + ' && ng g c components/settings')
);

gulp.task('udpate-app-component', function() {
  return file('app.component.html', getFileContent('tpl/src/app/app.component.html'), { src: true })
    .pipe(gulp.dest(directory + '/src/app'));
});

gulp.task('udpate-app-routing', function() {
  return file('app-routing.module.ts', getFileContent('tpl/src/app/app-routing.module.ts'), { src: true })
    .pipe(gulp.dest(directory + '/src/app'));
});

gulp.task('add-guard-service', function() {
  return file('guard.service.ts', getFileContent('tpl/src/app/services/guard.service.ts'), { src: true })
    .pipe(gulp.dest(directory + '/src/app/services'));
});

gulp.task('add-assets', function() {
  return file('icon.png', getFileContent('tpl/src/assets/images/icon.png'), { src: true })
    .pipe(gulp.dest(directory + '/src/assets/images'));
});

gulp.task('add-locales', function() {
  return file('messages.json', getFileContent('tpl/src/_locales/en/messages.json'), { src: true })
    .pipe(gulp.dest(directory + '/src/_locales/en'));
});

gulp.task('add-manifest', function() {
  return file('manifest.json', getFileContent('tpl/src/manifest.json'), { src: true })
    .pipe(gulp.dest(directory + '/src'));
});

gulp.task('add-nojekyll', function() {
  return file('.nojekyll', getFileContent('tpl/src/.nojekyll'), { src: true })
    .pipe(gulp.dest(directory + '/src'));
});

gulp.task('update-angular.json', function() {
  var content = getFileContent(directory + '/angular.json');
  var newContent = content.replace('"src/assets"', `"src/assets",
              "src/_locales",
              "src/manifest.json",
              "src/.nojekyll"`);

  return file('angular.json', newContent, { src: true })
    .pipe(gulp.dest(directory));
});

gulp.task('update-package.json', function() {
  var content = getFileContent(directory + '/package.json');
  var newContent = content.replace('"build": "ng build",', `"build": "ng build --aot --prod --sourceMap=false --outputHashing=none",
    "package": "web-ext build --source-dir=dist/` + name + ` --artifacts-dir=.",
    "ghbuild": "ng build --prod --base-href \\"/` + name + `/\\"",
    "ghdeploy": "ngh --dir=dist/` + name + `",`);

  return file('package.json', newContent, { src: true })
    .pipe(gulp.dest(directory));
});

// Main task
gulp.task('new', gulp.series(
  'create-angular-project',
  'generate-main-component',
  'generate-settings-component',
  'udpate-app-component',
  'udpate-app-routing',
  'add-guard-service',
  'add-assets',
  'add-locales',
  'add-manifest',
  'add-nojekyll',
  'update-angular.json',
  'update-package.json'
));
