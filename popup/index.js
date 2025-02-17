let currentTabPromise = browser.tabs.query({active: true, currentWindow: true})
currentTabPromise.then((tabs) => {

  try {
    const url = new URL(tabs[0].url);
    const currentSlug  = document.querySelector('#current-tab-slug')
    currentSlug.textContent = url.pathname
    currentSlug.setAttribute("data-story-slug", url.pathname)
  } catch (e) {
    console.error(e)
  }
})

let currentSettingPromise = browser.storage.sync.get("spaces");

currentSettingPromise.then((result) => {
  const wrapper = document.querySelector('#spaces')
  const template = document.querySelector('#space')

  if (!result.spaces || result.spaces.length === 0) {
    const template = document.querySelector('#no-spaces')
    const clone = template.content.cloneNode(true);
    wrapper.appendChild(clone);
    return;
  }

  result.spaces.forEach(space => {
    if (!space.id || !space.name || !space.accessToken) { return }
    const clone = template.content.cloneNode(true);

    const idValue = clone.querySelector(".space-id")
    idValue.textContent = space.id;

    const nameValue = clone.querySelector(".space-name")
    nameValue.textContent = space.name;

    const linkWrapper = clone.querySelector('.story-link-wrapper')

    wrapper.appendChild(clone);

    if (space.accessToken) {
      const storySlug = document.querySelector('#current-tab-slug').getAttribute('data-story-slug')
      const apiRequestUrl = 'https://api.storyblok.com/v2/cdn/stories' + storySlug + '?token=' + space.accessToken;

      // TODO: special handling for root story
      fetch(apiRequestUrl, { headers: { 'Accept': 'application/json' }}).then(response => {
        if (response.status === 200) {
          response.json().then(body => {
            const link = document.createElement('a')
            link.setAttribute('target', '_blank')
            link.setAttribute('href', `https://app.storyblok.com/#/me/spaces/${space.id}/stories/0/0/${body.story.id}`)
            link.textContent = 'open story on Storyblok'
            linkWrapper.textContent = ''
            linkWrapper.appendChild(link)
          }).catch(e => {
            linkWrapper.textContent = 'error'
            console.error('json error', e)
          })
        } else {
          linkWrapper.textContent = 'Storyblok story not found'
        }
      }).catch(e => console.error('fetch error', e))
    }
  })
});
