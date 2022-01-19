# Terminal Object

## What is a terminal?

Terminal is a object with you can import from lib, or get in second parameters on handles of project.

## Getting Start

### Importing in your project

```typescript
import { terminal } from "cowmand";
```

or

```typescript
import { Terminal } from "cowmand"; // Importing types

program.use((context, terminal: Terminal) => {

})
```

## Properties

### terminal.log -> return terminal
Log is to you print a simple message on terminal.

Example:

```typescript
import { Terminal } from "cowmand"; // Importing types

program.use((context, terminal: Terminal) => {
    terminal
      .log("Your login is ok!");
})
```

Using log you can print multiples lines in cascade.


```typescript
import { Terminal } from "cowmand"; // Importing types

program.use((context, terminal: Terminal) => {
    terminal
      .log("Your login is ok!")
      .log("You are welcome");
})
```

### terminal.error -> return terminal
Error you can use to print a error for your user on terminal.

Example:

```typescript
import { Terminal } from "cowmand"; // Importing types

program.use((context, terminal: Terminal) => {
    terminal
      .error("Error in login: ", [
          "Your password is wrong",
          "You can't start de application",
          "Contact support on oi@support.com"
      ]);
})
```

### terminal.table -> return terminal
You can print an array of items in a table viewer.

Example:

```typescript
import { Terminal } from "cowmand"; // Importing types

program.use((context, terminal: Terminal) => {
    terminal
      .table([
        {
          name: "Marcon",
          age: 23,
          from: "Brazil"
        },
        {
          name: "Julia",
          age: 21,
          from: "Italy"
        }
      ]);
})
```

### terminal.end -> return process.exit(0)
This property ends the program, you need use on can finish.

You can use direct after .log, .error and .table, or use only terminal.end().

Direct after:
```typescript
import { Terminal } from "cowmand"; // Importing types

program.use((context, terminal: Terminal) => {
  return terminal
    .log("Hello Word")
    .end();
})

program.use((context, terminal: Terminal) => {
  return terminal
    .log("You can find file 'my-work-list.docs'")
    .error("Not found", ["You file not exist."])
    .end();
})
```

Using only terminal.end();
```typescript
import { Terminal } from "cowmand"; // Importing types

program.use((context, terminal: Terminal) => {
    terminal
    .log("Hello Word");

    // Process

    terminal
      .log("It's all ok!");

    // Process

    return terminal.end();
})
```

### terminal.loading
You can use to print a loading on terminal.

```typescript
import { Terminal } from "cowmand"; // Importing types

const delay = (ms: number) =>
  new Promise(resolve => {
    setTimeout(resolve, ms);
  });


program.use(async (context, terminal: Terminal) => {
  const loading = terminal.loading('Logging in...');

  await delay(3000);

  loading.succeed('Logged in!');

  return terminal.end();
})
```

### terminal.ask -> Promise of string
When you can ask a question to user or your user need add an information on an input, you can use this terminal property.

Example:
```typescript
import { Terminal } from "cowmand"; // Importing types

program.use(async (context, terminal: Terminal) => {
    const user = await terminal
    .ask("Username: ");

    terminal.log(`Your user name is ${user}`);

    return terminal.end();
})
```

Example hidden information:
```typescript
import { Terminal } from "cowmand"; // Importing types

program.use(async (context, terminal: Terminal) => {
    const password = await terminal
    .ask("Password: ", { hidden: true });

    terminal.log(`Your password is ${password}`);

    return terminal.end();
})
```
