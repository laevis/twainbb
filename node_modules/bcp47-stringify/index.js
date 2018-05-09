module.exports = function(tag) {
  if (!tag || typeof tag != 'object') {
    return null;
  } else if (tag.privateuse && tag.privateuse.length) {
    return 'x-' + tag.privateuse.join('-');
  } else if (tag.grandfathered && tag.grandfathered.regular) {
    return tag.grandfathered.regular;
  } else if (tag.grandfathered && tag.grandfathered.irregular) {
    return tag.grandfathered.irregular;
  } else {
    if (!tag.langtag || !tag.langtag.language || !tag.langtag.language.language) return null;
    var extlang = tag.langtag.language.extlang && tag.langtag.language.extlang.length
      ? '-' + tag.langtag.language.extlang.join('-')
      : '';
    var script = tag.langtag.script ? '-' + tag.langtag.script : '';
    var region = tag.langtag.region ? '-' + tag.langtag.region : '';
    var variant = tag.langtag.variant && tag.langtag.variant.length
      ? '-' + tag.langtag.variant.join('-')
      : '';
    var extension = tag.langtag.extension && tag.langtag.extension.length
      ? '-' + tag.langtag.extension.map(flatExtensions).join('-')
      : '';
    var privateuse = tag.langtag.privateuse && tag.langtag.privateuse.length
      ? '-x-' + tag.langtag.privateuse.join('-')
      : '';
    return tag.langtag.language.language + extlang + script + region +
      variant + extension + privateuse;
  }
};

function flatExtensions(ext) {
  return ext.singleton + '-' + ext.extension.join('-');
}
