import Cowmand from '../../cowmand';
import { GuardLogin } from './guardLogin';
import { LoginController } from './loginController';

const program = Cowmand();

program.use(GuardLogin);

program.use(['login'], LoginController);

program.start();
