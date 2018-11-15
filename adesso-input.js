import validator from "validator";

(function () {
    const inputTemplate = document.createElement("template");
    inputTemplate.innerHTML = `
    <style>
        :host {
            margin: 20px;
            flex:1;
        }
        .container {
            position:relative;
            display: flex;
            flex-direction: row;
            align-items: center;
            justify-content: center;
            height: 34px;
            border-radius: 3px;
            border-bottom: #1976d2 2px solid;
            color: #1976d2;
        }
        .floatingInputContainer {
            display:flex;
            flex-direction: row;
            flex-basis: 70%;
            flex-grow: 1;
        }
        .label {
            position: absolute;
            color: #63a4ff;
            padding: 5px;
            font-size: 16px;
            transition : transform 200ms, font-size 200ms ease-in;
        }
        .holdTight {
            color: inherit;
            font-size: 14px;
            transform: translate(0, -25px);
        }
        .input:focus + .label {
            color: inherit;
            font-size: 14px;
            transform: translate(0, -25px);
        }
        .input {
            flex:1;
            font-size: 16px;
            padding: 5px;
            border: none;
            outline: none;
        }
        .message {
            position: absolute;
            opacity: 0;
            bottom: -20px;
            left: 10px;
            color: inherit;
            font-size: 12px;
        }
        .invalid > .message {
            opacity: 1;
            -webkit-animation: fadein 500ms ease; /* Safari, Chrome and Opera > 12.1 */
            -moz-animation: fadein 500ms ease; /* Firefox < 16 */
            -ms-animation: fadein 500ms ease; /* Internet Explorer */
            -o-animation: fadein 500ms ease; /* Opera < 12.1 */
            animation: fadein 500ms ease;
        }
        @keyframes fadein {
            from { opacity: 0; transform: translateY(-10px); }
            to   { opacity: 1; transform: translateY{-20px}; }
        }
        
        /* Firefox < 16 */
        @-moz-keyframes fadein {
            from { opacity: 0; transform: translateY(-10px); }
            to   { opacity: 1; transform: translateY{-20px}; }
        }
        
        /* Safari, Chrome and Opera > 12.1 */
        @-webkit-keyframes fadein {
            from { opacity: 0; transform: translateY(-10px); }
            to   { opacity: 1; transform: translateY{-20px}; }
        }
        
        /* Internet Explorer */
        @-ms-keyframes fadein {
            from { opacity: 0; transform: translateY(-10px); }
            to   { opacity: 1; transform: translateY{-20px}; }
        }
        
        /* Opera < 12.1 */
        @-o-keyframes fadein {
            from { opacity: 0; transform: translateY(-10px); }
            to   { opacity: 1; transform: translateY{-20px}; }
        }
        ::slotted(*) {
            flex: 0.15;
            color: inherit;
            padding: 5px;
            text-align: center;
        }
        .hasText {
            color: green;
            border-color: green;
        }
        .invalid {
            color: red;
            border-color: red;
        }
    </style>
    <div class="container">
        <slot class="leftIcon" name="leftIcon"></slot>
        <div class="floatingInputContainer">
            <input id="input" name="input" class="input"/>
            <label class="label holdTight" for="input"></label>
        </div>
        <span class="message"></span>
        <slot class="rightIcon" name="rightIcon"></slot>
    </div>
    `;
    
    
    class AdessoInput extends HTMLElement {
        constructor() {
            super();
            
            Object.defineProperty(this, "onInputChange", {
                configurable: true,
                enumerable: true,
                writable: true,
                value: (e) => {
                    const value = e.target.value;
                    const containerClassList = this.shadowRoot.querySelector(".container").classList;
                    const labelElementClassList = this.shadowRoot.querySelector(".label").classList;
                    
                    
                    if (value) {
                        labelElementClassList.add("holdTight");
                        containerClassList.add("hasText");
                    }
                    else {
                        labelElementClassList.remove("holdTight");
                        containerClassList.remove("hasText");
                    }
                    
                    if (!this.invalid && this.validation(value)) {
                        containerClassList.remove("invalid");
                    } else {
                        containerClassList.add("invalid");
                        this.shadowRoot.querySelector("input").removeEventListener("blur", this.onInputChange);
                        this.shadowRoot.querySelector("input").addEventListener("keyup", this.onInputChange);
                    }
                }
            });
            
            this.attachShadow({mode: "open"});
            
            this.init();
        }
        
        
        init() {
            const inputCopy = document.importNode(inputTemplate, true).content;
            this.shadowRoot.appendChild(inputCopy);
            this.shadowRoot.querySelector("input").addEventListener("blur", this.onInputChange);
        }
        
        validation(value) {
            let errorMessage = [];
            if (this.validationRules) {
                this.validationRules.split(",").forEach(rule => {
                    switch (true) {
                        case (rule === "required" && (!value)) :
                            errorMessage.push("Cannot be empty");
                            break;
                        case (rule === "email" && !validator.isEmail(value)):
                            errorMessage.push("Please enter a valid email address");
                            break;
                        case (rule === "minlength" && !validator.isLength(value, {min: this.minlength})):
                            errorMessage.push("Cannot be less than " + this.minlength + " characters");
                            break;
                        case (rule === "alpha" && !validator.isAlpha(value, "tr-TR")):
                            errorMessage.push("Must contain only letters");
                            break;
                    }
                });
                this.shadowRoot.querySelector(".message").textContent = errorMessage[0];
            }
            console.log(errorMessage);
            
            return (errorMessage.length === 0);
        }
        
        
        attributeChangedCallback(name, oldValue, newValue) {
            console.log(`${name} changed from ${oldValue} to ${newValue}`);
            switch (name) {
                case "label":
                    this.shadowRoot.querySelector(".label").textContent = this.label;
                    break;
                case "type":
                    this.shadowRoot.querySelector("input").type = this.type;
                    break;
                case "animated":
                    this.shadowRoot.querySelector(".label").classList.remove("holdTight");
                    break;
                case "maxlength":
                    this.shadowRoot.querySelector("input").maxLength = this.maxlength;
                    break;
                default:
                    break;
            }
        }
        
        static get observedAttributes() {
            return ["label", "type", "pattern", "invalid", "valid", "validation-rules", "animated", "minlength", "maxlength"];
        }
        
        get label() {
            return this.getAttribute("label");
        }
        
        set label(newValue) {
            this.setAttribute("label", newValue);
        }
        
        get type() {
            return this.getAttribute("type");
        }
        
        set type(newValue) {
            this.setAttribute("type", newValue);
        }
        
        get invalid() {
            return this.getAttribute("invalid");
        }
        
        set invalid(newValue) {
            this.setAttribute("invalid", newValue);
        }
        
        get validationRules() {
            return this.getAttribute("validation-rules");
        }
        
        set validationRules(newValue) {
            this.setAttribute("validation-rules", newValue);
        }
        
        get animated() {
            return this.getAttribute("animated");
        }
        
        set animated(newValue) {
            this.setAttribute("animated", newValue);
        }
        
        get minlength() {
            return this.getAttribute("minlength");
        }
        
        set minlength(newValue) {
            this.setAttribute("minlength", newValue);
        }
        
        get maxlength() {
            return this.getAttribute("maxlength");
        }
        
        set maxlength(newValue) {
            this.setAttribute("maxlength", newValue);
        }
        get valid() {
            return this.getAttribute("valid");
        }
        
        set valid(newValue) {
            this.setAttribute("valid", newValue);
        }
        
    }
    
    customElements.define("adesso-input", AdessoInput)
}());
