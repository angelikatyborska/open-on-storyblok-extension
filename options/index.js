function saveOptions(e) {
  e.preventDefault();
  browser.storage.sync.set({
    space: {
      name: document.querySelector("#space-name").value,
      id: document.querySelector("#space-id").value,
      accessToken: document.querySelector("#space-access-token").value,
    }
  });
}

function restoreOptions() {
  function setCurrentChoice(result) {
    if (result?.space) {
      document.querySelector("#space-id").value = result.space.id;
      document.querySelector("#space-name").value = result.space.name;
      document.querySelector("#space-access-token").value = result.space.accessToken;
    }
  }

  function onError(error) {
    console.log(`Error: ${error}`);
  }

  let getting = browser.storage.sync.get("space");
  getting.then(setCurrentChoice, onError);
}

document.addEventListener("DOMContentLoaded", restoreOptions);
document.querySelector("form").addEventListener("submit", saveOptions)
