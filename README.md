# @xutl/cmd

One [eXtremely Useful Tool Library](https://xutl.es) to facilitate writing CLI programs that need argument parsing.

## Install

```sh
npm install --save @xutl/args
```

## Usage

```javascript
import { parse, flag } from '@xutl/args';
const args = parse(process.argv, flag('version'));
```

For parameters that take a value (i.e. everything but flags) the valid formats are:

- `prog --name=value`
- `prog --name value`
- `prog -n value`

## API

`triggers` are required to be in the format `/^(-\w|--\w{2,99})$/`.

_If no `triggers` are provided, the default is to use the first letter of the name prefixed by **-** as well as the full name prefixed by **--** if the name is longer than a single character._

> `flag('version')` is equal to `flag('version', undefined, '-v', '--version')`

### Functions

- `parse(args: string[], ...extractors: Extractor[]) : Parameters`

- `flag(name: string, default?: boolean, ...triggers: string[]) : Extractor`

- `string(name: string, default?: string, ...triggers: string[]) : Extractor`

- `file(name: string, default?: string, ...triggers: string[]) : Extractor`

- `folder(name: string, default?: string, ...triggers: string[]) : Extractor`

- `number(name: string, default?: number, ...triggers: string[]) : Extractor`

- `strings(name: string, default?: string[], ...triggers: string[]) : Extractor`

- `custom(name: string, parser: CustomParser, default?: Parameter, ...triggers: string[]) : Extractor`

### Types

- `Parameter = boolean | string | number | string[]`
- `Parameters = string[] & { params: { [name: string]: Parameter } }`
- `CustomParser = (item: string) => Parameter`

## License

Copyright 2021 xutl.es

Permission to use, copy, modify, and/or distribute this software for any purpose with or without fee is hereby granted, provided that the above copyright notice and this permission notice appear in all copies.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.
