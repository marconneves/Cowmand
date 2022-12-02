import Cowmand from '../../src/cowmand';
// @ts-ignore
import { GuardLogin } from './guardLogin';
// @ts-ignore
import { Route } from './routes';

const program = Cowmand();

program.use({ notIn: ['login'] }, GuardLogin);

program.use(Route);

program.start();
