import Cowmand from '../../src/cowmand';
// @ts-ignore
import { GuardLogin } from './guardLogin';
// @ts-ignore
import { LoginController } from './loginController';
// @ts-ignore
import { MeController } from './meController';

const program = Cowmand();

program.use({ notIn: ['login'] }, GuardLogin);

program.use('login', LoginController);

program.use('me', MeController);

program.start();
