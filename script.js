document.addEventListener('DOMContentLoaded', () => {
    const button = document.getElementById('readTagsButton');
    if (button) {
        button.addEventListener('click', () => {
            getTabId((tabId) => {
                chrome.scripting.executeScript({
                    target: { tabId: tabId, allFrames: true },
                    func: waitForPageLoadAndReadTags
                }, (results) => {
                    if (chrome.runtime.lastError) {
                        console.error(chrome.runtime.lastError);
                    } else {
                        const data = results[0].result;
                        chrome.runtime.sendMessage({ action: 'displayData', data: data });
                    }
                });
            });
        });
    } else {
        console.error('Button with ID "readTagsButton" not found.');
    }
});

function getTabId(callback) {
    chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
        if (tabs.length > 0) {
            const tabId = tabs[0].id;
            callback(tabId);
        } else {
            console.error('No active tab found');
        }
    });
}

function waitForPageLoadAndReadTags() {
    return new Promise((resolve) => {
        if (document.readyState === 'complete' || document.readyState === 'interactive') {
            resolve(readTags());
        } else {
            document.addEventListener('DOMContentLoaded', () => {
                resolve(readTags());
            });
        }
    });
}

function readTags() {
    const elements = document.querySelectorAll('p, span, h1, h2, h3, h4, h5, h6');
    let data = [];
    elements.forEach(element => {
        data.push(element.textContent);
    });
    return data;
}
