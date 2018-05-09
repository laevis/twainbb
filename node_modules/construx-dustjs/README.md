# construx-dustjs

Lead Maintainer: [Matt Edelman](https://github.com/grawk)

[![Build Status](https://travis-ci.org/krakenjs/construx-dustjs.svg?branch=master)](https://travis-ci.org/krakenjs/construx-dustjs)
[![NPM version](https://badge.fury.io/js/construx-dustjs.png)](http://badge.fury.io/js/construx-dustjs)

[construx](https://github.com/krakenjs/construx) plugin for JIT-compiling dustjs resources during development of [express](http://expressjs.com/) applications.


## Usage

### Install

```shell
$ npm install --save-dev construx-dustjs
```

### Configure

Where you configure your construx plugins:

```json
{
  "template": {
    "module": "construx-dustjs",
    "files": "/templates/**/*.js",
    "base": "templates",
    "config": {
        "prepend": "",
        "append": "",
        "amd": true
    }
  }
}
```

`config` is optional but would be set to the dust module's "config" object, if desired.

_Note: See [construx README](https://github.com/krakenjs/construx/blob/master/README.md) for general usage of construx_

