Flagrate [![Build Status](https://circleci.com/gh/webnium/flagrate/tree/master.png?circle-token=1e62d579c1775441e9f8a70ecf02ac3255b80a5e)](#)
========

#### JavaScript UI library ####

### Targeted platforms ###

Flagrate currently targets the following platforms:

* Internet Explorer 9+
* Chrome 32+
* Firefox 26+
* Safari 7+
* Opera 18+
* Windows 8.1 Store App
* Chromium Embedded Framework
* XULRunner
* TideSDK
* TideKit

### Requirements ###

* **Nothing is required**

You can use Flagrate with jQuery, Prototype, or your favorite framework if needed!

Using Flagrate
--------------

To use Flagrate in your application, download the latest release from the
Flagrate github repository `build` branch (<https://github.com/webnium/flagrate/archive/build.zip>) and copy 
`flagrate.js` `flagrate.css` to a suitable location. Then include it in your HTML like so:

    <link href="path/to/flagrate.css" rel="stylesheet">
    <script src="path/to/flagrate.js"></script>

Or, **you can use the official CDN** provided [Webnium](https://webnium.co.jp/):

    <link href="//flagrate.org/flagrate.min.css" rel="stylesheet">
    <script src="//flagrate.org/flagrate.min.js"></script>

**TypeScript** support:

    /// <reference path="path/to/flagrate.d.ts" />

Note: In production, recommended to use `flagrate.min.js` `flagrate.min.css`.

#### [CDN status](http://stats.pingdom.com/z2isnrsvidf5/874134)
[![Status banner](https://share.pingdom.com/banners/36f90d37)](http://stats.pingdom.com/z2isnrsvidf5/874134)

How to build
------------

Clone a copy of the main Flagrate git repo by running:

```bash
git clone git://github.com/webnium/flagrate.git
```

Enter the flagrate directory and run the build script:
```bash
cd flagrate && npm install && npm run build
```
The built version of Flagrate will be put in the current directory.

Documentation
-------------

Visit the Flagrate website for more information: <https://flagrate.org/>.