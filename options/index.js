function saveOptions(e) {
  e.preventDefault();
  const form = document.querySelector('form')
  const countSpaces = document.querySelector('#spaces').children.length
  const formData = new FormData(form);
  const mapped = (new Array(countSpaces)).fill(null).map((_x, i) => {
    return {
      id: formData.get(`spaces[${i}].id`),
      name: formData.get(`spaces[${i}].name`),
      accessToken: formData.get(`spaces[${i}].accessToken`),
    }
  })

  browser.storage.sync.set({
    spaces: mapped
  });
}

function restoreOptions() {
  function setCurrentChoice(result) {
    if (result?.space) {
      const wrapper = document.querySelector('#spaces');
      const template = document.querySelector('#space-form-template')
      const clone = template.content.cloneNode(true);

      const idInput = clone.querySelector("[name='id']")
      idInput.value = result.space.id;
      idInput.name = 'spaces[0].id'

      const nameInput = clone.querySelector("[name='name']")
      nameInput.value = result.space.name;
      nameInput.name = 'spaces[0].name'


      const accessTokenInput = clone.querySelector("[name='accessToken']")
      accessTokenInput.value = result.space.accessToken;
      accessTokenInput.name = 'spaces[0].accessToken'

      wrapper.appendChild(clone);
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
