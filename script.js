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

document.getElementById('readTagsButton').addEventListener('click', () => {
    getTabId((tabId) => {
        chrome.scripting.executeScript({
            target: { tabId: tabId, allFrames: true },
            func: readAndPrintTags
        });
    });
});

function readAndPrintTags() {
    const elements = document.querySelectorAll('p, span, h1, h2, h3, h4, h5, h6');
    let data = [];
    elements.forEach(element => {
        data.push(element.textContent);
    });

    async function fetchPredictions(data) {
        try {
            const response = await fetch('http://localhost:3000/predict', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    texts: data.join(';'),
                    task: 'QUESTION_ANSWERING',
                    outputDimensionality: 768
                })
            });
    
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
    
            const predictions = await response.json();
            console.log('Received predictions:', predictions);
        } catch (error) {
            console.error('Error:', error);
        }
    }
   fetchPredictions(data);
}
