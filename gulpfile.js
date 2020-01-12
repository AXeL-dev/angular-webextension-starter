/**
 * Angular WebExtension starter kit
 * 
 * @author      AXeL-dev <contact.axel.dev@gmail.com>
 * @license     MPL2
 * @link        https://github.com/AXeL-dev/angular-webextension-starter
 */

/**
 * Requirements
 */
const gulp = require('gulp');
const shell = require('gulp-shell')
const argv = require('yargs').argv;
const file = require('gulp-file');
const fs = require('fs');

/**
 * Arguments
 */
const name = argv.name;
const version = argv.ver === undefined ? '0.0.0' : argv.ver;
const author = argv.author === undefined ? '' : argv.author;
const url = argv.url === undefined ? '' : argv.url;
const skipTests = argv.skipTests === undefined ? 'false' : argv.skipTests;

// Parse arguments
if (name === undefined) {
  console.log('--name argument is mandatory');
  process.exit(1);
}
console.log('name:', name);
console.log('version:', version);
console.log('author:', author ? author : '-');
console.log('url:', url ? url : '-');
console.log('skipTests:', skipTests);

/**
 * Global constants
 */
const directory = 'output/' + name;

/**
 * Functions
 */
function getFileContent(file, encoding = 'utf8') {
  return fs.readFileSync(file, encoding);
}

function getExtensionPath(path) {
  return directory + '/' + path.replace(/^\/+/g, '');
}

/**
 * Tasks
 */
gulp.task('create-angular-project',
  shell.task(`ng new ${name} --defaults --routing=true --skipGit=true --skipTests=${skipTests} --directory=${directory}`)
);

gulp.task('install-packages',
  shell.task(`cd ${directory} && npm install --save-dev web-ext-types webextension-polyfill`)
);

gulp.task('generate-popup-component',
  shell.task(`cd ${directory} && ng g c components/popup`)
);

gulp.task('generate-settings-component',
  shell.task(`cd ${directory} && ng g c components/settings`)
);

gulp.task('udpate-popup-component', gulp.series(
  function() {
    return file('popup.component.html', getFileContent('tpl/src/app/components/popup/popup.component.html'), { src: true })
      .pipe(gulp.dest(getExtensionPath('/src/app/components/popup')));
  },
  function() {
    const content = getFileContent('tpl/src/app/components/popup/popup.component.ts');
    const newContent = content.replace('${title}', name);

    return file('popup.component.ts', newContent, { src: true })
      .pipe(gulp.dest(getExtensionPath('/src/app/components/popup')));
  }
));

gulp.task('udpate-app-component', function() {
  return file('app.component.html', getFileContent('tpl/src/app/app.component.html'), { src: true })
    .pipe(gulp.dest(getExtensionPath('/src/app')));
});

gulp.task('udpate-app-routing', function() {
  return file('app-routing.module.ts', getFileContent('tpl/src/app/app-routing.module.ts'), { src: true })
    .pipe(gulp.dest(getExtensionPath('/src/app')));
});

gulp.task('add-guard-service', function() {
  return file('guard.service.ts', getFileContent('tpl/src/app/services/guard.service.ts'), { src: true })
    .pipe(gulp.dest(getExtensionPath('/src/app/services')));
});

gulp.task('add-assets', function() {
  return file('128.png', getFileContent('tpl/src/assets/icons/128.png', null), { src: true })
    .pipe(gulp.dest(getExtensionPath('/src/assets/icons')));
});

gulp.task('add-locales', function() {
  return file('messages.json', getFileContent('tpl/src/_locales/en/messages.json'), { src: true })
    .pipe(gulp.dest(getExtensionPath('/src/_locales/en')));
});

gulp.task('add-manifest', function() {
  const content = getFileContent('tpl/src/manifest.json');
  const newContent = content.replace('${version}', version);
  if (author.length) {
    newContent = newContent.replace('${author}', author);
  } else {
    newContent = newContent.replace('  "author": "${author}",' + "\n", '');
  }
  if (url.length) {
    newContent = newContent.replace('${url}', url);
  } else {
    newContent = newContent.replace('  "homepage_url": "${url}",' + "\n", '');
  }

  return file('manifest.json', newContent, { src: true })
    .pipe(gulp.dest(getExtensionPath('/src')));
});

gulp.task('add-nojekyll', function() {
  return file('.nojekyll', getFileContent('tpl/src/.nojekyll'), { src: true })
    .pipe(gulp.dest(getExtensionPath('/src')));
});

gulp.task('update-angular.json', function() {
  const content = getFileContent(getExtensionPath('/angular.json'));
  const newContent = content.replace('"src/assets"', `"src/assets",
              "src/_locales",
              "src/manifest.json",
              "src/.nojekyll"`)
                            .replace('"scripts": []', `"scripts": [
              "node_modules/webextension-polyfill/dist/browser-polyfill.min.js"
            ]`);

  return file('angular.json', newContent, { src: true })
    .pipe(gulp.dest(directory));
});

gulp.task('update-package.json', function() {
  const content = getFileContent(getExtensionPath('/package.json'));
  const newContent = content.replace(/"version": "(.*)"/g, `"version": "${version}"`)
                            .replace('"build": "ng build",', `"build": "ng build --aot --prod --sourceMap=false --outputHashing=none",
    "package": "web-ext build --source-dir=dist/${name} --artifacts-dir=.",
    "ghbuild": "ng build --prod --base-href \\"/${name}/\\"",
    "ghdeploy": "ngh --dir=dist/${name}",`);

  return file('package.json', newContent, { src: true })
    .pipe(gulp.dest(directory));
});

gulp.task('update-gitignore', function() {
  return file('.gitignore', getFileContent('tpl/.gitignore'), { src: true })
    .pipe(gulp.dest(getExtensionPath('/')));
});

gulp.task('git-init',
  shell.task(`cd ${directory} && git init && git add -A && git commit -m "initial commit"`)
);

// Main task
gulp.task('new', gulp.series(
  'create-angular-project',
  'install-packages',
  'generate-popup-component',
  'generate-settings-component',
  'udpate-popup-component',
  'udpate-app-component',
  'udpate-app-routing',
  'add-guard-service',
  'add-assets',
  'add-locales',
  'add-manifest',
  'add-nojekyll',
  'update-angular.json',
  'update-package.json',
  'update-gitignore',
  'git-init'
));
