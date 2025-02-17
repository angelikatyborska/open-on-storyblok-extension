let currentTabPromise = browser.tabs.query({active: true, currentWindow: true})
currentTabPromise.then((tabs) => {

  try {
    const url = new URL(tabs[0].url);
    const linkWrapper = document.querySelector('#story-link-wrapper')
    linkWrapper.setAttribute('data-story-slug', url.pathname)
    document.querySelector('#current-tab-slug').textContent = url.pathname
  } catch (e) {
    console.error(e)
  }
})

let currentSettingPromise = browser.storage.sync.get("space");

currentSettingPromise.then((result) => {
  document.querySelector('#space-id').textContent = result.space?.id;
  document.querySelector('#space-name').textContent = result.space?.name;

  if (result.space?.accessToken) {
    const linkWrapper = document.querySelector('#story-link-wrapper')
    const storySlug = linkWrapper.getAttribute('data-story-slug')
    const apiRequestUrl = 'https://api.storyblok.com/v2/cdn/stories' + storySlug + '?token=' + result.space?.accessToken;

    fetch(apiRequestUrl, { headers: { 'Accept': 'application/json' }}).then(response => {
      if (response.status === 200) {
          response.json().then(body => {
            const link = document.createElement('a')
            link.setAttribute('href', `https://app.storyblok.com/#/me/spaces/${result.space?.id}/stories/0/0/${body.story.id}`)
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
});
