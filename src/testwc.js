const inputTemplate = document.createElement("template");
inputTemplate.innerHTML = `
    <div class="container">
        Hey There
    </div>
    `;


export default class testwc extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({mode: "open"});
        this.shadowRoot.innerHTML = `<div><span>test1</span><span>test2</span></div>`;
    }
    
    connectedCallback() {
        console.log("CONNECTED")
    }
    disconnectedCallback() {
        console.log("DISconnected")
    }
    
    attributeChangedCallback(name, oldValue, newValue) {
        console.log(`${name} changed from ${oldValue} to ${newValue}`);
    }
    
    static get observedAttributes() {
        return ["some"];
    }
    
}

customElements.define("test-wc", testwc);
