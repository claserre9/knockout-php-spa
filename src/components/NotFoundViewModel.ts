import BaseViewModel from "./BaseViewModel";

export default class NotFoundViewModel extends BaseViewModel{
    constructor() {
        super();
        this.template = `<h1>Not found</h1>`;
    }
}