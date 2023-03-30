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

export const escapeRegExp = (string) => {
    return string.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, "\\$1");
}
