import Cowmand from '../../src/cowmand';
import { StartController } from './StartController';

const program = Cowmand();

program.command('start :applicationName', {
  description: "Start a application",
  arguments: {
    port: ['-p', '--port']
  }
}, StartController);

program.command('stop :?applicationName', {
  description: "Stop the application",
  arguments: {
    applicationName: ['-a', '--application']
  }
}, StartController);


program.start();
