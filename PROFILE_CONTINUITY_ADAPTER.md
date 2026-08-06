# Khaemenes Profile Continuity Adapter

The included bridge exposes the local learner record to other Khaemenes portals on the same `https://vervenveda.com` origin.

## Add to Kinder Garden or Elementary

```html
<script src="https://vervenveda.com/Khaemenes_Preschool.github.io/assets/khaemenes-profile-bridge.js"></script>
<script>
  const learner = window.KhaemenesLearnerProfile.getSummary();
  const pinned = window.KhaemenesLearnerProfile.getPinnedActivities();

  console.log(learner.nickname, pinned);
</script>
```

## Available methods

- `getProfile()`
- `getContinuity()`
- `getPinnedActivities()`
- `getFavoriteIds()`
- `getVisitedIds()`
- `getSummary()`
- `subscribe(listener)`

The bridge only reads browser-local data. It does not transmit data, create an account, or grant formal grade authority.
