module.exports = function(config) {
  config.set({
    // base path, that will be used to resolve files and exclude
    basePath: '.',

    frameworks: ['jasmine', 'commonjs'],

    // list of files / patterns to load in the browser
    files: [
      'bower_components/jquery/dist/jquery.js',
      'bower_components/angular/angular.js',
      'bower_components/angular-mocks/angular-mocks.js',
      'src/*.html',
      'src/*.js',
      'example/**/*.js',
      'test/spec/*.js'
    ],

    // list of files to exclude
    // exclude: [
    //   'client/main.js'
    // ],

    preprocessors: {
      // 'client/*.js': ['commonjs'],
      // 'test/client/*.js': ['commonjs']
      'src/*.html': ['ng-html2js']
    },

    ngHtml2JsPreprocessor: {
      // strip this from the file path
      stripPrefix: ['src/'],
      // prepend this to the
      // prependPrefix: 'served/',

      // or define a custom transform function
      // cacheIdFromPath: function(filepath) {
      //   return cacheId;
      // },

      // setting this option will create only a single module that contains templates
      // from all the files, so you can load them all with module('foo')
      moduleName: 'allViews'
    },

    // use dots reporter, as travis terminal does not support escaping sequences
    // possible values: 'dots', 'progress'
    // CLI --reporters progress
    reporters: ['progress', 'junit'],

    junitReporter: {
      // will be resolved to basePath (in the same way as files/exclude patterns)
      outputFile: 'test-results.xml'
    },

    // web server port
    // CLI --port 9876
    port: 9876,

    // enable / disable colors in the output (reporters and logs)
    // CLI --colors --no-colors
    colors: true,

    // level of logging
    // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
    // CLI --log-level debug
    logLevel: config.LOG_INFO,

    // enable / disable watching file and executing tests whenever any file changes
    // CLI --auto-watch --no-auto-watch
    autoWatch: true,

    // Start these browsers, currently available:
    // - Chrome
    // - ChromeCanary
    // - Firefox
    // - Opera
    // - Safari (only Mac)
    // - PhantomJS
    // - IE (only Windows)
    // CLI --browsers Chrome,Firefox,Safari
    // browsers: [process.env.TRAVIS ? 'Firefox' : 'Chrome'],
    browsers: ['PhantomJS', 'Chrome', 'Firefox'],

    // If browser does not capture in given timeout [ms], kill it
    // CLI --capture-timeout 5000
    captureTimeout: 20000,

    // Auto run tests on start (when browsers are captured) and exit
    // CLI --single-run --no-single-run
    singleRun: false,

    // report which specs are slower than 500ms
    // CLI --report-slower-than 500
    reportSlowerThan: 500,
  });
};
