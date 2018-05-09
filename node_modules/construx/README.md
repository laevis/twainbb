construx
========

Lead Maintainer: [Matt Edelman](https://github.com/grawk)  

[![Build Status](https://travis-ci.org/krakenjs/construx.svg?branch=master)](https://travis-ci.org/krakenjs/construx)  
[![NPM version](https://badge.fury.io/js/construx.png)](http://badge.fury.io/js/construx)  

Compile-on-the-fly and other development tools for use when building [express](http://expressjs.com/) applications.

## Middleware compiler

The middleware compiler builds your dependencies as they are requested, allowing you to run your express application as-is and not have to set up a watch task.


### General Usage

```js
var app = require('express')(),
    construx = require('construx');

app.use(construx(/* src, dest [, config] */));
```

### Parameters

`src` - The directory of your source files  
`dest` - The destination directory for the compiled files  
`config` - Optional. An object of compilers to enable  



### Configuration

To enable a plugin, add it to the config object as follows:

```json
{
    "less": {
        "module": "construx-less",
        "files": "/css/**/*.css",
        "ext": "less"
    }
}
```

_Note: above you also would have the `construx-less` construx plugin installed in your project_

### KrakenJS Usage

KrakenJS uses [confit](https://github.com/krakenjs/confit) and [meddleware](https://github.com/krakenjs/meddleware) to configure and manage middleware registration. To use `construx` as a
krakenjs development tool, add the following to your application's `middleware` section in `development.json`

```js
"construx": {
    "enabled": true,
    "priority": 35,
    "module": {
        "name": "construx",
        "arguments": [
            "path:./public",
            "path:./.build",
            {
                "css": {
                    "module": "construx-less",
                    "files": "/css/**/*.css"
                },
                "copier": {
                    "module": "construx-copier",
                    "files": "**/*"
                }
            }
        ]
    }
}
```

This will engage the `construx` middleware only for the development environment. Note that the two configured plugins are as
an example and your actual plugin set will depend upon your application.
### Existing plugins

Please rely upon the individual plugins' README for configuration and other requirements information.

* [construx-copier](https://github.com/krakenjs/construx-copier/blob/master/README.md) - copier for static assets
* [construx-dust](https://github.com/krakenjs/construx-dust/blob/master/README.md) - DustJS template compiler
* [construx-less](https://github.com/krakenjs/construx-less/blob/master/README.md) - Less CSS compiler
* [construx-sass](https://github.com/krakenjs/construx-sass/blob/master/README.md) - Sass CSS compiler
* [construx-stylus](https://github.com/krakenjs/construx-stylus/blob/master/README.md) - Stylus CSS compiler

### How plugins work

A plugin usually would wrap a build step for a particular technology. E.g. [construx-dustjs](https://github.com/krakenjs/construx-dustjs) 
wraps the dustjs template compilation build step. This allows on-the-fly dust template changes to be reflected immediately during 
development of your application. Other examples of plugins would be CSS compilers such as Less, Sass, or Stylus.

#### Plugin registration

```js
{
    "<plugin key>": {
        "module": "<plugin module name>",
        "files": "<filter on request path>",
        "ext": "<file extension>",
        "precompile": <Function>,
        "postcompile": <Function>
    }
}
```
* `<plugin key>` just needs to be a unique string within the other registered plugins.
* `module` is the npm package name of your plugin.
* `files` is a glob string which will try and match the `req.path`. If there is a match, the plugin middleware will be engaged
* `ext` (optional) is a replacement for the requested file's extension. E.g. if a `GET` request comes across for `/css/foo.css`, and `ext` is 
set to `less`, the construx middleware will attempt to find a file named `<files source path>/foo.less`
* `precompile` (optional) is a function that can run prior to the construx middleware execution for this plugin. Its signature is 
 `(context, callback)`. Please see description of compile `context` below.
* `postcompile` (optional) is a function that will run post construx middleware execution for this plugin. Its signature is `(context, callback)`. 
A possible use case for `postcompile` would be if the plugin creates any temporary files/directories during compilation that should be deleted.

#### Middleware process a matched request

When a `req.path` is matched to a plugin, construx middleware will open the matched file (using `fs.readFile`) and call that plugin's compiler:

```js
compiler(raw, config, function (err, result) {
...
```

The `config` argument is:

```js
{
    paths: dirs, 
    context: context,
    <options>
}
```
* `paths` is an array of lookup paths based on the difference between the filesystem root of the current plugin's files and the 
 currently requested file. E.g. if the request is for `/css/foo/bar/bang.css` the `paths` array will be: `['<root css path>/', 
 '<root css path>/foo/', '<root css path>/foo/bar/']`. Use this array in your plugin according to need.
* `context` is passed through all compile steps and its initial form is:

```js
context = {
    srcRoot: <configured src root>,
    destRoot: <configured dest root>,
    filePath: <usually just req.path>,
    name: <filePath minus file extension>,
    ext: <options.ext, if set>
};
```

_Note: There are a couple possible overrides to the context object which you might want to take advantage of. See below._

* `<options>` is the JSON object used to register the plugin (see #Plugin-registration above).

The plugin's compiler will do whatever transformation to the raw buffer, and issue a `callback` to the construx middleware 
with the transformed file (or an error).

#### context overrides

`srcPath`: If you want to compute the source file differently than the construx middleware, you can add `srcPath` to the 
context object (in a `precompile` step usually) and the construx middleware will use your value instead of its own logic
`skipRead`: If you don't want the construx middleware to open the source file (because for example, your compiler does that instead) 
then set the `skipRead` flag to be true

### Author a plugin

We have created a template for construx plugins: [construx-star](https://github.com/krakenjs/construx-star). The template
includes the basic pattern of a plugin, preferred unit test/coverage modules, preferred `npm run` aliases, and license (Apache 2.0).
You can create a blank github repository and import `construx-star` as a starting point.

* If you are developing a plugin as a 3rd party (i.e. not as a PayPal employee), please be sure to remove the PayPal specific license block
at the top of each JavaScript file.
* Please use the naming convention `construx-<wrapped compiler>`

If you author and publish a `construx` plugin, please let us know so we can add it to our [existing plugins](#existing-plugins) list.

