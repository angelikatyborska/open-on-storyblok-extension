let promise = browser.tabs.query({active: true, currentWindow: true})
promise.then((tabs) => document.querySelector('#current-tab-url').textContent = tabs[0].url)
