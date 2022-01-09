import { Context, Terminal, NextFunction } from '../../cowmand';

const promise = () => {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve(this);
    }, 5000);
  });
};

const GuardLogin = async (
  context: Context,
  terminal: Terminal,
  next: NextFunction
) => {
  if (context.session.user || context.params.command === 'login') {
    terminal.table([
      { user: 'Marcon', status: 'actived' },
      { user: 'Lucas', status: 'inative' }
    ]);

    return next();
  }

  terminal.table([
    { user: 'Marcoas', status: 'actived' },
    { user: 'Lucas', status: 'inative' }
  ]);

  const loading = terminal.loading('Agora esta carregando.');
  await promise();
  loading.changeText('Ainda finalizando o login.');
  await promise();
  loading.succeed('User logado com sucesso.');

  terminal.error('Error:', [
    'Ok, Agora esta tudo bem, e por ai?',
    'meu nome e Marcon',
    'meu nome e Marcon',
    'meu nome e Marcon'
  ]);

  return terminal
    .log('Is verify now if has logged')
    .log('Is verify now if has logged')
    .end();
};

export { GuardLogin };
