//waits for selected element to load
export const waitForElement = (observeEl,selector) => {
    return new Promise(resolve => {
        if (document.querySelector(selector)) {
            return resolve(document.querySelector(selector));
        }

        const observer = new MutationObserver(_ => {
            if (document.querySelector(selector)) {
                resolve(document.querySelector(selector));
                observer.disconnect();
            }
        });

        observer.observe(observeEl, {
            childList: true,
            subtree: true
        });
    });
}

//waits for selected element to load
export const waitForElements = (observeEl,selector, amount) => {
    return new Promise(resolve => {
        if (document.querySelectorAll(selector).length >= amount) {
            return resolve(document.querySelectorAll(selector));
        }

        const observer = new MutationObserver(_ => {
            if (document.querySelectorAll(selector) >= amount) {
                resolve(document.querySelectorAll(selector));
                observer.disconnect();
            }
        });

        observer.observe(observeEl, {
            childList: true,
            subtree: true
        });
    });
}

//continuously waits for element to appear
export const onElementObserved = (observeEl,selectorId, callback) => {
    const observer = new MutationObserver(mutations => {
        for(let mutation of mutations){
            if(mutation.addedNodes.length > 0){
                    for(let addedNode of mutation.addedNodes){
                        
                        if(addedNode?.id && addedNode?.id.includes(selectorId)){
                            callback(addedNode);
                        }
                    }
                    
                    
            }
        }
        
    });

    observer.observe(observeEl, {
        childList: true,
        subtree: true
    });
}

//continuously waits for element to appear and returns mutations
export const onCustomElementObserved = (observerEl, callback) => {
    const observer = new MutationObserver(mutations => {
        callback(mutations);
    });

    observer.observe(observerEl, {
        subtree: true,
        childList: true,
        attributeFilter: ['TextContent']
    });
}

export const elementBuilder = (tagName, elAttributes, parentEl)=>{
    //creates element and sets any attributes passed
    const el = document.createElement(tagName);
    for(let attrKey in elAttributes){
        el[attrKey] = elAttributes[attrKey];
    }
    //append to parent if exist
    if(parentEl) parentEl.appendChild(el);
    return el;
}


export const escapeRegExp = (string) => {
    return string.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, "\\$1");
}
