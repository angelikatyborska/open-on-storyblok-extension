let currentTabPromise = browser.tabs.query({active: true, currentWindow: true})
currentTabPromise.then((tabs) => document.querySelector('#current-tab-url').textContent = tabs[0].url)

let currentSettingPromise = browser.storage.sync.get("color");
currentSettingPromise.then((result) => document.querySelector('#current-settings').textContent = result.color);
