import BaseViewModel from "./BaseViewModel";

export default class AboutViewModel extends BaseViewModel{
    constructor() {
        super();

        this.template = `
<h1>About</h1>
        `;
    }
}