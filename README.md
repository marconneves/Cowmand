![TheMath](https://i.imgur.com/dWPzX9W.png)
# _🐮 Cowmand - _IN DEVELOPMENT_

## Introduction
This lib get beginning of express to create a cli. It's a simple way to create a cli.

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


****
Esse projeto está sob a licença MIT. Veja o arquivo [LICENSE][license-link] para mais detalhes.


  <!-- Markdown link & img's -->
[license-link]: /LICENSE
