(function () {
    const paginationItem = document.createElement("template");
    paginationItem.innerHTML = `
    <li class="pagination-box"></li>
    `;
    
    const template = document.createElement('template');
    
    template.innerHTML = `
    <style>
    .pagination-container {
        margin: 20px;
    }
    .pagination-container .pagination-box {
        display: inline-block;
        cursor: pointer;
        outline: 0;
        font-size: 1rem;
        font-weight: 300;
        max-width: 40px;
        width: 6%;
        height: 40px;
        line-height: 40px;
        padding: 0;
        margin-left: -1px;
        text-align: center;
        border: 1px solid rgb(222, 226, 230);
    }
    .pagination-box-active {
        background-color: #007bff;
    }
    .pagination-container :nth-child(1) {
        border-bottom-left-radius: 0.25rem;
        border-top-left-radius: 0.25rem;
    }
    
    .pagination-container :last-child {
        border-bottom-right-radius: 0.25rem;
        border-top-right-radius: 0.25rem;
    }
    </style>
    
        <div class="pagination-container">
            <ul class="innerContainer">
            </ul>
        </div>
    
    `;
    
    
    class AdessoPaginationWC extends HTMLElement {
        constructor() {
            super();
    
            Object.defineProperty(this, "state", {
                configurable: true,
                enumerable: true,
                writable: true,
                value: {currentPage: 1, startingPage: 1, pageCount: 50, range: 6}
            });
            
            this.attachShadow({mode: "open"});
            
            this.render();
        }
        
        handlePageChange(pageNumber) {
            this.state.startingPage = Math.max(1, pageNumber - Math.ceil(this.state.range / 2));
            this.state.currentPage = pageNumber;
            this.render();
        };
        
        handlePageIntervalChange(startingPageChange)  {
            this.state.startingPage = Math.max(this.state.startingPage + startingPageChange, 1);
        };
        
        render() {
            let containerCopy = document.importNode(template, true).content;
            
            const {startingPage, currentPage, range, pageCount} = this.state;
            const pageEnding = Math.min(pageCount, startingPage + range);
            const pageBegining = Math.max(Math.min(currentPage - Math.floor(range / 2), 1), pageEnding - range);
            
            
            for (let i = Math.max(1, pageBegining); i <= pageEnding; i++) {
                let itemCopy = document.importNode(paginationItem, true).content.querySelector("li");
                itemCopy.setAttribute("page_num",i);
                itemCopy.textContent = String(i);
                if (i == this.state.currentPage)
                    itemCopy.classList.add("pagination-box-active");
                let innerContainer = containerCopy.querySelector(".innerContainer");
                innerContainer.appendChild(itemCopy);
            }
            this.shadowRoot.innerHTML = containerCopy.children[0].outerHTML + containerCopy.children[1].outerHTML;
            
            
            this.shadowRoot.querySelectorAll(".pagination-box").forEach(item => {
                let pageChangedEvent = new CustomEvent('pageChangedEvent', {detail: {page_num: item.getAttribute("page_num")}});
                item.addEventListener("click", () => {
                    if (item.textContent !== this.page_num)
                        this.dispatchEvent(pageChangedEvent)
                })
            });
        }
        
        
        attributeChangedCallback(name, oldValue, newValue) {
            console.log(`${name} changed from ${oldValue} to ${newValue}`);
            if (name === "page_num") {
                this.handlePageChange(newValue)
            }
        }
        
        static get observedAttributes() {
            return ['page_num'];
        }
        
        get page_num() {
            return this.getAttribute('page_num');
        }
        
        set page_num(newValue) {
            this.setAttribute('page_num', newValue);
        }
        
    }
    
    customElements.define("adesso-pagination", AdessoPaginationWC)
}());
