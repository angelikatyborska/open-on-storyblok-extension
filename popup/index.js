let currentTabPromise = browser.tabs.query({
  active: true,
  currentWindow: true,
});
currentTabPromise.then((tabs) => {
  try {
    const url = new URL(tabs[0].url);
    const title = tabs[0].title;
    const currentSlug = document.querySelector("#current-tab-slug");
    currentSlug.textContent = url.pathname;
    currentSlug.setAttribute("data-story-slug", url.pathname);
    const currentTitle = document.querySelector("#current-tab-title");
    currentTitle.textContent = title;
    currentTitle.setAttribute("data-story-title", title);
  } catch (e) {
    console.error(e);
  }
});

let currentSettingPromise = browser.storage.sync.get("spaces");

currentSettingPromise.then((result) => {
  const wrapper = document.querySelector("#spaces");
  const template = document.querySelector("#space");

  if (!result.spaces || result.spaces.length === 0) {
    const template = document.querySelector("#no-spaces");
    const clone = template.content.cloneNode(true);
    wrapper.appendChild(clone);
    return;
  }

  result.spaces.forEach((space) => {
    if (!space.id || !space.name || !space.accessToken) {
      return;
    }
    const clone = template.content.cloneNode(true);

    const idValue = clone.querySelector(".space-id");
    idValue.textContent = space.id;

    const nameValue = clone.querySelector(".space-name");
    nameValue.textContent = space.name;

    const linkWrapper = clone.querySelector(".story-link-wrapper");

    wrapper.appendChild(clone);

    if (space.accessToken) {
      let storySlug = document
        .querySelector("#current-tab-slug")
        .getAttribute("data-story-slug");
      let storyTitle = document
        .querySelector("#current-tab-title")
        .getAttribute("data-story-title");
      if (storySlug === "/" && space.rootStorySlug) {
        storySlug = space.rootStorySlug;
      }

      const apiRequestUrl =
        "https://api.storyblok.com/v2/cdn/stories" +
        storySlug +
        "?version=draft&token=" +
        space.accessToken;

      fetch(apiRequestUrl, { headers: { Accept: "application/json" } })
        .then((response) => {
          // when `storySlug === "/"`, the request will return multiple stories
          if (response.status === 200 && storySlug !== "/") {
            response
              .json()
              .then((body) => {
                const link = document.createElement("a");
                link.setAttribute("target", "_blank");
                link.setAttribute(
                  "href",
                  `https://app.storyblok.com/#/me/spaces/${space.id}/stories/0/0/${body.story.id}`,
                );

                link.textContent = `Edit ${storyTitle}`;
                linkWrapper.textContent = "";
                linkWrapper.appendChild(link);
              })
              .catch((e) => {
                linkWrapper.textContent = "Error. Check the browser console for more information";
                console.error("json error", e);
              });
          } else {
            linkWrapper.textContent = "Storyblok story not found";
          }
        })
        .catch((e) => console.error("fetch error", e));
    }
  });
});
