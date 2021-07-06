# iso-639-3

[ISO 639-3](https://iso639-3.sil.org/code_tables/639/data) language codes in JSON format.

## Install

```sh
npm install @freearhey/iso-639-3
```

## Usage

```js
import iso6393 from '@freearhey/iso-639-3'

const language = iso6393.find(lang => lang.code === 'eng')

/*
{
  name: 'English',
  code: 'eng'
}
*/
```

## License

[MIT](LICENSE)
