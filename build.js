var fs = require('fs')
var path = require('path')
var https = require('https')
var concat = require('concat-stream')
var yauzl = require('yauzl')
var dsv = require('d3-dsv')

var found = false

https
  .request(
    'https://iso639-3.sil.org/sites/iso639-3/files/downloads/iso-639-3_Code_Tables_20210218.zip',
    onrequest
  )
  .end()

function onrequest(res) {
  res.pipe(fs.createWriteStream('archive.zip')).on('close', onclose).on('error', console.error)
}

function onclose() {
  yauzl.open('archive.zip', { lazyEntries: true }, onopen)
}

function onopen(err, archive) {
  if (err) throw err

  read()

  archive.on('entry', onentry)
  archive.on('end', onend)

  function onentry(entry) {
    if (path.basename(entry.fileName) !== 'iso-639-3_Name_Index.tab') {
      return read()
    }

    found = true
    archive.openReadStream(entry, onreadstream)
  }

  function onreadstream(err, rs) {
    if (err) throw err

    rs.pipe(concat(onconcat)).on('error', console.error)
    rs.on('end', read)
  }

  function read() {
    archive.readEntry()
  }
}

function onend() {
  if (!found) {
    throw new Error('File not found')
  }
}

function onconcat(body) {
  var data = dsv.tsvParse(String(body)).map(map)

  write('index', data)

  function write(name, data) {
    fs.writeFile(name + '.json', JSON.stringify(data, null, 2) + '\n', function (err) {
      if (err) throw err
    })
  }
}

function map(d) {
  var name = d.Print_Name
  var code = d.Id

  if (!name) {
    console.error('Cannot handle language without name', d)
  }

  if (!code) {
    console.error('Cannot handle language without code', d)
  }

  return {
    name,
    code
  }
}
