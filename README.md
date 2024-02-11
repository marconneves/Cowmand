![Cowmand][cowmand-logo]
# _🐮 Cowmand - _BETA_

## Introduction
This lib get beginning of express to create a cli. It's a simple way to create a cli.


## Installation

This is a [Node.js](https://nodejs.org/en/) module available through the
[npm registry][cowmand-npm].

Use npm:
```
$ npm install cowmmand
```

Use yarn:
```
$ yarn add cowmmand
```

## Example Initial


Using middleware in global, but with rules to notIn `["login"]`.
```typescript
import Cowmand from 'cowmand';
import { GuardLogin } from './guardLogin';
import { Login } from './login';

const program = Cowmand();

program.use({ notIn: ['login'] }, GuardLogin);

program.command(['login'], Login);

program.command(['me'], (context, terminal) => {
  terminal
    .log(`Hello, ${context.session.user?.name}!`)
    .end();
});

program.start();
```


Using middleware before command handle:
```typescript
import Cowmand from 'cowmand';
import { GuardLogin } from './guardLogin';
import { Login } from './login';

const program = Cowmand();

program.command(['login'], Login);

program.command(['me'], GuardLogin, (context, terminal) => {
  terminal
    .log(`Hello, ${context.session.user?.name}!`)
    .end();
});

program.start();
```

## Docs
  **Terminal** [Docs](/docs/Terminal.md)

## New Features

- [x] Commander Routes - Similar with Router of express, for use commands in other file.
- [x] Validate errors Layers
- [ ] Terminal - Add table console
- [x] Terminal - Add question on terminal
- [x] Terminal - Add option to hide a password

****
This project is under the MIT license. See the [LICENSE][license-link] file for more details.

<!-- Markdown link & img's -->
[license-link]: /LICENSE
[cowmand-logo]: https://i.imgur.com/dWPzX9W.png
[cowmand-npm]: https://www.npmjs.com/package/cowmmand
