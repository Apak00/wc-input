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
    
    
    class AdessoInput extends HTMLDivElement {
        constructor() {
            super();
            
            Object.defineProperty(this, "onValidate", {
                value: (e) => {
                    const value = e.target.value;
                    const containerClassList = this.shadowRoot.querySelector(".container").classList;
                    const labelElementClassList = this.shadowRoot.querySelector(".label").classList;
                    if (value) {
                        labelElementClassList.add("holdTight");
                        containerClassList.add("hasText");
                    } else if (this.animated) {
                        labelElementClassList.remove("holdTight");
                        containerClassList.remove("hasText");
                    } else containerClassList.remove("hasText");
                    
                    if (!this.invalid && this.validation(value)) {
                        containerClassList.remove("invalid");
                    } else {
                        containerClassList.add("invalid");
                        this.shadowRoot.querySelector("input").addEventListener("keyup", this.onValidate);
                    }
                }
            });
            
            Object.defineProperty(this, "onKeyUp", {
                value: (e) => {
                    if (this.value === e.target.value) {
                        e.preventDefault();
                        return false;
                    } else if (this.hasAttribute("value")) {
                        const textChanged = new CustomEvent("textChanged", {detail: {value: e.target.value}});
                        this.dispatchEvent(textChanged);
                    } else {
                        this.value = e.target.value;
                    }
                    
                    
                }
            });
            
            Object.defineProperty(this, "onKeyPress", {
                value: (e) => {
                    const value = e.target.value;
                    const valLength = value.length;
                    const key = e.key;
                    const keyCode = event.which || event.keyCode;
                    const patternKey = this.pattern.charAt(valLength);
                    
                    if (patternKey === "A" && !validator.isAlpha(key, this.lang)) {
                        e.preventDefault();
                        return false;
                    }
                    else if (patternKey === "1" && !(keyCode > 48 && keyCode < 58)) {
                        e.preventDefault();
                        return false;
                    }
                }
            });
            
            Object.defineProperty(this, "onPaste", {
                value: (e) => {
                    const cb = e.clipboardData.getData("Text");
                    const cbLength = cb.length;
                    const patternLength = this.pattern.length;
                    const valLength = e.target.value.length;
                    
                    if (cbLength > (patternLength - valLength))
                        e.preventDefault();
                    for (let i = valLength; i < (valLength + cbLength); i++) {
                        const keyCode = cb.charCodeAt(i - valLength);
                        const patternKey = this.pattern.charAt(i);
                        
                        if (patternKey === "A" && !validator.isAlpha(cb[i - valLength], this.lang)) {
                            e.preventDefault();
                            return false;
                        }
                        else if (patternKey === "1" && !(keyCode > 48 && keyCode < 58)) {
                            e.preventDefault();
                            return false;
                        }
                    }
                }
            });
            
            Object.defineProperty(this, "validationRules", {
                configurable: true,
                enumerable: true,
                writable: true,
                value: [],
            });
            
            this.attachShadow({mode: "open"});
            
            this.init();
        }
        
        
        init() {
            const inputCopy = document.importNode(inputTemplate, true).content;
            this.shadowRoot.appendChild(inputCopy);
        }
        
        connectedCallback() {
            const inputEl = this.shadowRoot.querySelector("input");
            inputEl.addEventListener("blur", this.onValidate);
            inputEl.addEventListener("keypress", this.onKeyPress);
            if (this.pattern) {
                inputEl.addEventListener("keyup", this.onKeyUp);
                inputEl.addEventListener("paste", this.onPaste);
            }
        }
        
        validation(value) {
            let errorKey = undefined;
            let shouldError = this.validationRules.some(rule => {
                switch (true) {
                    case (rule === "required" && (!value)):
                        errorKey = "required";
                        return true;
                    case (rule === "email" && !validator.isEmail(value)):
                        errorKey = "email";
                        return true;
                    case (rule === "minlength" && !validator.isLength(value, {min: this.minlength})):
                        errorKey = "minlength";
                        return true;
                    case (rule === "alpha" && !validator.isAlpha(value, this.lang)):
                        errorKey = "alpha";
                        return true;
                    case (rule === "regex" && !validator.matches(value, this.regex)):
                        errorKey = "regex";
                        return true;
                    default:
                        return false;
                }
            });
            
            const errorEvent = new CustomEvent("errorEvent", {detail: {key: errorKey}});
            this.dispatchEvent(errorEvent);
            
            return !shouldError;
        }
        
        
        attributeChangedCallback(name, oldValue, newValue) {
            console.log(`${name} changed from ${oldValue} to ${newValue}`);
            switch (name) {
                case "animated":
                    this.shadowRoot.querySelector(".label").classList.remove("holdTight");
                    break;
                case "label":
                    this.shadowRoot.querySelector(".label").textContent = this.label;
                    break;
                case "maxlength":
                    this.shadowRoot.querySelector("input").maxLength = this.maxlength;
                    break;
                case "minlength":
                    this.validationRules.push(newValue ? "minlength" : null);
                    break;
                case "required":
                    this.validationRules.push("required");
                    break;
                case "type":
                    this.shadowRoot.querySelector("input").type = this.type;
                    this.validationRules.push(this.type);
                    break;
                case "alpha":
                    this.validationRules.push("alpha");
                    break;
                case "regex":
                    this.validationRules.push("regex");
                    break;
                case "error-message":
                    this.shadowRoot.querySelector(".message").textContent = newValue;
                    break;
                case "placeholder":
                    this.shadowRoot.querySelector("input").setAttribute("placeholder", newValue);
                    break;
                case "pattern":
                    this.maxlength = this.pattern.length;
                    this.minlength = this.pattern.length;
                    this.shadowRoot.querySelector("input").setAttribute("placeholder", newValue);
                    break;
                case "value":
                    this.shadowRoot.querySelector("input").value = newValue;
                    break;
                default:
                    break;
            }
        }
        
        static get observedAttributes() {
            return ["alpha", "animated", "error-message", "invalid", "label", "lang", "minlength", "maxlength",
                "pattern", "placeholder", "regex", "required", "type", "value",];
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
        
        get required() {
            return this.getAttribute("required");
        }
        
        set required(newValue) {
            this.setAttribute("required", newValue);
        }
        
        get alpha() {
            return this.getAttribute("alpha");
        }
        
        set alpha(newValue) {
            this.setAttribute("alpha", newValue);
        }
        
        get regex() {
            return this.getAttribute("regex");
        }
        
        set regex(newValue) {
            this.setAttribute("regex", newValue);
        }
        
        get value() {
            return this.getAttribute("value");
        }
        
        set value(newValue) {
            this.setAttribute("value", newValue);
        }
        
        get lang() {
            return this.getAttribute("lang");
        }
        
        set lang(newValue) {
            this.setAttribute("lang", newValue);
        }
        
        get pattern() {
            return this.getAttribute("pattern");
        }
        
        set pattern(newValue) {
            this.setAttribute("pattern", newValue);
        }
        
        get placeholder() {
            return this.getAttribute("placeholder");
        }
        
        set placeholder(newValue) {
            this.setAttribute("placeholder", newValue);
        }
        
    }
    
    customElements.define("adesso-input", AdessoInput, {extends: "div"})
}());
