import Cowmand from '../../src/cowmand';
import { GuardLogin } from './guardLogin';

const program = Cowmand();

program.use(['test'], GuardLogin);

program.start();
