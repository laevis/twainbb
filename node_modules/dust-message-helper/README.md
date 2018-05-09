Dust @message Helper
====================

Renders content, piping it back through dust's compiler to resolve variable references. The features supported are roughly the same as Kraken's `localizr` and older `makara` modules.

It supports `@pre` as its tag as well, to support the exact templates already used with those modules.

It looks in a Yahoo `dust-intl-helper` compatible place in the context object for strings.

How to use it
-------------

In your dust templates, like so:

```
{@message type="content" key="greet.happy" /}
```

And rendered with a context like this:

```
dust.render('template', { intl: { messages: { "greet.happy": "Hello, {who}!" } }, who: "world" }, function (err, out) {
    console.log(out);
});
```

Will give output `Hello, world!`

In-place editing support
------------------------

To support in-place editing translation systems, `<edit>` tags can be emitted around content. If you pass `enableMetadata: true` to the helper module's options, `<edit>` tags will surround content strings. Those used in contexts where HTML is inappropriate (such as inside attributes) can disable this on a case by case basis with `noEdit="true"` in the helper tag.

Differences from localizr
-------------------------

* No support for newlines in attribute values in tags. No more `{@pre sep="\r\n" /}`, for example.
* Attribute values must be quoted. `{@pre type=content /}` must now be `{@pre type="content" /}`
