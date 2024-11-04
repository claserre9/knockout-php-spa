import BaseViewModel from "./BaseViewModel";

export default class HomeViewModel extends BaseViewModel{
    constructor() {
        super();

        this.template = `
<p>Home</p>
<a href="/about">About</a>  
        `;
    }
}