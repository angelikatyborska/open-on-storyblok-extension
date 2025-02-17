# How to create a release

1. Bump version in `manifest.json`
2. `web-ext build`
3. `web-ext sign --api-key=$MOZILLA_API_KEY --api-secret=$MOZILLA_API_SECRET --channel=unlisted`
4. Commit the changes.
