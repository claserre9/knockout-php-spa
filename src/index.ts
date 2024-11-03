import page from "page";
import HomeViewModel from "./components/HomeViewModel";
import NotFoundViewModel from "./components/NotFoundViewModel";
import AboutViewModel from "./components/AboutViewModel";



page('*', function (ctx: any, next: Function) {
    console.log('Middleware executed on route:', ctx.path);
    next();
});


page("/" ,function () {
    new HomeViewModel().render();
})

page("/about" ,function () {
    new AboutViewModel().render();
})


page('*', function () {
    new NotFoundViewModel().render();
})

page()