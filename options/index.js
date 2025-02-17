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
  function appendSpace(space, index) {
    const wrapper = document.querySelector('#spaces');
    const template = document.querySelector('#space-form-template')
    const clone = template.content.cloneNode(true);

    const idInput = clone.querySelector("[name='id']")
    idInput.value = space.id;
    idInput.name = `spaces[${index}].id`

    const nameInput = clone.querySelector("[name='name']")
    nameInput.value = space.name;
    nameInput.name = `spaces[${index}].name`

    const accessTokenInput = clone.querySelector("[name='accessToken']")
    accessTokenInput.value = space.accessToken;
    accessTokenInput.name = `spaces[${index}].accessToken`

    const deleteButton = clone.querySelector('.delete-space')
    deleteButton.addEventListener('click', deleteSpace)

    wrapper.appendChild(clone);
  }

  function deleteSpace(event) {
    const spaceNode = event.target.closest('.space')
    spaceNode.parentElement.removeChild(spaceNode)
  }

  function setCurrentChoice(result) {
    if (result?.spaces) {
      result.spaces.forEach((space, index) => {
        appendSpace(space, index)
      })
    }

    const addSpaceButton = document.querySelector('#add-space')
    addSpaceButton.addEventListener('click', addNewSpace)
  }

  function onError(error) {
    console.log(`Error: ${error}`);
  }

  function addNewSpace() {
    const wrapper = document.querySelector('#spaces');
    const index = wrapper.children.length;
    appendSpace({ id: '', name: '', accessToken: '' }, index)
  }

  let getting = browser.storage.sync.get("spaces");
  getting.then(setCurrentChoice, onError);
}

document.addEventListener("DOMContentLoaded", restoreOptions);
document.querySelector("form").addEventListener("submit", saveOptions)
