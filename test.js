const test = require('tape')
const iso6393 = require('./index.json')

test('iso6393', function (t) {
  t.true(Array.isArray(iso6393), 'should be an `array`')

  const language = iso6393.find(lang => lang.code === 'eng')

  t.equal(language.code, 'eng', 'should have a 639-3 code')
  t.equal(language.name, 'English', 'should have a name')

  t.end()
})
