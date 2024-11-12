import page from "page";
import AppViewModel from "./components/AppViewModel";
import NotFoundViewModel from "./components/NotFoundViewModel";



page('*', function (ctx: any, next: Function) {
    console.log('Middleware executed on route:', ctx.path);
    next();
});


page("/" ,function () {
    new AppViewModel().render();
})


page('*', function () {
    new NotFoundViewModel().render();
})

page()