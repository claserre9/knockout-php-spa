import page from "page";
import {renderView} from "./core/BaseViewModel";
import {logPathMiddleware} from "./middlewares/middlewares";
import {AppViewModel} from "./components/AppViewModel";
import {NotFoundViewModel} from "./components/NotFoundViewModel";

const BASE_PATH = "/";

page("*", logPathMiddleware);
page(BASE_PATH, (context) => renderView(AppViewModel, context));
page("*", () => renderView(NotFoundViewModel));

page();