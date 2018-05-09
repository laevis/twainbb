var shortstop = require('shortstop');
var resolve = require('../');
var path = require('path');
var test = require('tape');

function makeResolver() {
  var resolver = shortstop.create();
  resolver.use('resolve', resolve());
  return resolver;
}

process.chdir(__dirname);
console.log(process.cwd());

test('shortstop-resolve', function (t) {

  var resolver = makeResolver();

  t.test('resolve a module', function (st) {

    var config = {
      mock: 'resolve:fixture'
    };

    resolver.resolve(config, function (err, result) {
      var expected = path.resolve('./node_modules/fixture/index.js');
      st.error(err);
      st.equal(result.mock, expected);
      st.end();
    });
  });

  t.test('resolve a module asset', function (st) {

    var config = {
      mock: 'resolve:fixture/index.js',
      mock2: 'resolve:fixture/not-javascript.txt'
    };

    resolver.resolve(config, function (err, result) {
      var expected = path.resolve('./node_modules/fixture/index.js');
      var expected2 = path.resolve('./node_modules/fixture/not-javascript.txt');
      st.error(err);
      st.equal(result.mock, expected);
      st.equal(result.mock2, expected2);
      st.end();
    });
  });

  t.test('err if cannot resolve', function (st) {

    var config = {
      mock: 'resolve:ohManNotReal'
    };

    resolver.resolve(config, function (err, result) {
      st.error(!err);
      st.notOk(result);
      st.end();
    });
  });
});
