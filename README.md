![Cowmand][cowmand-logo]

# _🐮 Cowmand - \_BETA_

## Introduction

This lib get beginning of express to create a cli. It's a simple way to create a cli.

## Installation

This is a [Node.js](https://nodejs.org/en/) module available through the
[npm registry][cowmand-npm].

Use npm:

```
$ npm install cowmand
```

Use yarn:

```
$ yarn add cowmand
```

## Example Initial

Using middleware in global, but with rules to notIn `["login"]`.

```typescript
import Cowmand from 'cowmand';
import { GuardLogin } from './guardLogin';
import { LoginController } from './loginController';
import { MeController } from './meController';

const program = Cowmand();

program.use({ notIn: ['login'] }, GuardLogin);

program.use('login', LoginController);

program.use('me', MeController);

program.start();
```

Using middleware before command handle:

```typescript
import Cowmand from 'cowmand';
import { GuardLogin } from './guardLogin';
import { LoginController } from './loginController';
import { MeController } from './meController';

const program = Cowmand();

program.use('login', LoginController);

program.use('me', GuardLogin, MeController);

program.start();
```

## Router

You can also use the `Router` to organize your commands in different files.

`routes/index.ts`
```typescript
import { Router } from "cowmand";
import { LoginController } from "./../loginController";
import { Dash } from "./dash.routes";

const Route = Router();
Route.use('login', LoginController);

Route.use('dash', Dash)
export { Route }
```

`routes/dash.routes.ts`
```typescript
import { Router } from "cowmand";
import { MeController } from "./../meController";

const Dash = Router();
Dash.use('me', MeController);

export { Dash }
```

And in your main file `index.ts`:
```typescript
import Cowmand from 'cowmand';
import { GuardLogin } from './guardLogin';
import { Route } from './routes';

const program = Cowmand();

program.use({ notIn: ['login'] }, GuardLogin);

program.use(Route);

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

---

This project is under the MIT license. See the [LICENSE][license-link] file for more details.

<!-- Markdown link & img's -->

[license-link]: /LICENSE
[cowmand-logo]: https://i.imgur.com/dWPzX9W.png
[cowmand-npm]: https://www.npmjs.com/package/cowmand
