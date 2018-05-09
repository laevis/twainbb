spundle
=======

Bundle `spud`-format `.properties` locale bundles into a JSON object for transport to the client.

This is a low-level library used in build tools to get an easy-to-transport pre-parsed pile of strings to ship to a browser or other places.

Use
---

```
var spundle = require('spundle');
spundle(appRoot, '*', '*', callback); // Load all content for all countries and languages
spundle(appRoot, 'US', 'en', callback); // Load content for en-US only
```

This is painfully specific to Kraken.js default layout currently, and is naive about paths mapping to parameters. A future version may refine the interface.

