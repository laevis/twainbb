# construx-copier

Lead Maintainer: [Matt Edelman](https://github.com/grawk)

[![Build Status](https://travis-ci.org/krakenjs/construx-copier.svg?branch=master)](https://travis-ci.org/krakenjs/construx-copier)
[![NPM version](https://badge.fury.io/js/construx-copier.png)](http://badge.fury.io/js/construx-copier)

[construx](https://github.com/krakenjs/construx) plugin for copying resources during development of [express](http://expressjs.com/) applications.

construx-copier is essentially a noop which will catch any file not processed by another construx plugin and just copy it verbatim

## Usage

### Install

```shell
$ npm install --save-dev construx-copier
```

### Configure

Where you configure your construx plugins:

```json
{
    "copier": {
        "module": "construx-copier",
        "files": "**/*"
    }
}
```

_Note: See [construx README](https://github.com/krakenjs/construx/blob/master/README.md) for general usage of construx_

