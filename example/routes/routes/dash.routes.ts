import { Router } from "../../../src/cowmand";
import { MeController } from "./../meController";

const Dash = Router();
Dash.use('me', MeController);

export { Dash }
