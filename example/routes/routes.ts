import { Router } from "../../src/cowmand";
import { LoginController } from "./loginController";
import { MeController } from "./meController";

const Route = Router();
Route.use('login', LoginController);

const Dash = Router();
Dash.use('me', MeController);

Route.use('dash', Dash)
export { Route }
