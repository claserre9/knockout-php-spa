import BaseViewModel from "./BaseViewModel";

export default class HomeViewModel extends BaseViewModel{
    constructor() {
        super();

        this.template = `
<h1>Home</h1>
<a href="/about">About</a>  
        `;
    }
}