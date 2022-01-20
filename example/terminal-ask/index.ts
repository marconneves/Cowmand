import Cowmand from '../../src/cowmand';

const program = Cowmand();

program.use('hidden', async (context, terminal) => {
  const password = await terminal.ask("What is your password? ", {
    hidden: true
  });

  return terminal.log(`Your password is ${password}`).end();
});

program.use(
  'text', async (context, terminal) => {
    const email = await terminal.ask("What is your email? ");

    return terminal.log(`Your email is ${email}`).end();
  }
)


program.start();
