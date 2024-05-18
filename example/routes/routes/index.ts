import { Router } from '../../../src/cowmand';
import { ColorController } from '../controllers/colorController';
import { LoginController } from './../controllers/loginController';
import { Dash } from './dash.routes';

const Route = Router();
Route.use('login', LoginController);

Route.use('color', ColorController);

Route.use('dash', Dash);

export { Route };
