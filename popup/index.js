browser.tabs
  .query({ active: true, currentWindow: true })
  .then((tabs) => console.log(tabs[0].url))
