System.config({
	defaultJSExtensions: true,
  paths: {
    // paths serve as alias
    'npm:': 'node_modules/'
  },
  // map tells the System loader where to look for things
  map: {
    // our app is within the app folder
    app: 'app',

    // angular bundles
    '@angular/core': 'npm:@angular/core/bundles/core.umd.js',
    '@angular/common': 'npm:@angular/common/bundles/common.umd.js',
    '@angular/compiler': 'npm:@angular/compiler/bundles/compiler.umd.js',
    '@angular/platform-browser': 'npm:@angular/platform-browser/bundles/platform-browser.umd.js',
    '@angular/platform-browser-dynamic': 'npm:@angular/platform-browser-dynamic/bundles/platform-browser-dynamic.umd.js',
    '@angular/http': 'npm:@angular/http/bundles/http.umd.js',
    '@angular/router': 'npm:@angular/router/bundles/router.umd.js',
    '@angular/forms': 'npm:@angular/forms/bundles/forms.umd.js',

    // other libraries
    'rxjs':                       'npm:rxjs',
    'bootstrap':                  'npm:bootstrap/dist/js/bootstrap.min.js',
    'angular2-uuid':              'npm:angular2-uuid/index.js',
    'ts-clipboard':               'node_modules/ts-clipboard/ts-clipboard.js',
    'ts-md5':                     'node_modules/ts-md5/dist/md5.js',
    'angulartics2':               'npm:angulartics2/dist/core.umd.js',
    'ngx-cookie':                 'npm:ngx-cookie'
  },
  packages: {
      app: {
        main: './main.js',
        defaultExtension: 'js'
      },
      rxjs: {
        defaultExtension: 'js'
      },
      'ngx-cookie': {
        main: './index.js',
        defaultExtension: 'js'
      }
    }
});