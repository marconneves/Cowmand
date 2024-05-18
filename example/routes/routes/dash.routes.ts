import { Router } from '../../../src/cowmand';
import { MeController } from './../controllers/meController';

const Dash = Router();
Dash.use('me', MeController);

export { Dash };
