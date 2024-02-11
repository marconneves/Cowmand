import { Router } from "../../../src/cowmand";
import { LoginController } from "./../loginController";
import { Dash } from "./dash.routes";

const Route = Router();
Route.use('login', LoginController);

Route.use('dash', Dash)
export { Route }
