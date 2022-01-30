import Cowmand from '../../src/cowmand';
import { GuardLogin } from './guardLogin';
import { LoginController } from './loginController';
import { MeController } from './meController';

const program = Cowmand();

program.use({ notIn: ['login'] }, GuardLogin);

program.use('login', LoginController);

program.use('me', MeController);

program.start();
