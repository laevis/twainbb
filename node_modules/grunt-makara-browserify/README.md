grunt-makara-browserify
=======================

By default this will extract content bundles from your application's `locales/{country}/{language}/` directories and build `.build/{locale}/_languagepack.js` files, which can be loaded on a page and `require()`ed by browserified Javascript.

The task name it exports is `makara-browserify`. To use it, in your `Gruntfile.js`, add:

```
grunt.loadNpmTasks('grunt-makara-browserify');
grunt.registerTask('i18n', [ 'makara-browserify' ]);
```

This forms the basis of a browserify-friendly application's localization, allowing dust templates to be localized using `dust-usecontent-helper` and either `dust-message-helper` or `dust-intl`, or with similar techniques for React using `react-intl` or handlebars with `handlebars-intl`
