# construx-less

Lead Maintainer: [Matt Edelman](https://github.com/grawk)

[![Build Status](https://travis-ci.org/krakenjs/construx-star.svg?branch=master)](https://travis-ci.org/krakenjs/construx-star)
[![NPM version](https://badge.fury.io/js/construx-star.png)](http://badge.fury.io/js/construx-star)

[construx](https://github.com/krakenjs/construx) plugin for JIT-compiling less resources to css during development of [express](http://expressjs.com/) applications.

## Usage

### Install

```shell
$ npm install --save-dev construx-less
```

### Configure

Where you configure your construx plugins:

```json
{
    "star": {
        "module": "construx-less",
        "files": "/star/**/*.css",
    }
}
```

_Note: See [construx README](https://github.com/krakenjs/construx/blob/master/README.md) for general usage of construx_

