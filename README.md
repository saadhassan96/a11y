# NOLA A11y Lab website

The lab site is one plain HTML page with no build step, in the same spirit as
[saadh.info](https://saadh.info).

```
index.html        all content (news, projects, publications, people)
css/lab.css       styles; colors and fonts are tokens at the top
js/lab.js         light/dark switch and "Show all publications"
images/people/    square photos, about 320px, firstname-lastname.jpg
images/favicon.svg
archive/          the previous Hugo site (2024 to October 2026), served at /archive/
```

## Updating

- **News:** add a `<li>` at the top of the News list. Keep three items there and
  move the oldest into "Earlier news".
- **Publications:** add an `<a class="pub">` card in date order. Add `highlight`
  to its class to show it under "Highlights". Add `data-project="comm"`,
  `"info"`, or `"civic"` so it shows under that project's filter. Put lab
  members in `<b>`.
- **Projects:** the "See N publications" link on each card counts papers by
  `data-project` and opens the Publications section with that filter applied.
- **Access in New Orleans:** the panel beside the intro. Each `<li>` has a
  small line drawing (inline SVG on a sidewalk tile), a title with an `id`, one
  short sentence, and a "Read more" link whose `aria-describedby` points to
  that title.
- **People:** copy a `.person` block and add a photo to `images/people/`.
  Move people who graduate to the Alumni lists.

Preview locally by opening `index.html` in a browser.

## Deploying

Pushing to `main` runs `.github/workflows/gh-pages.yaml`. It builds the archived
Hugo site into `/archive/` and publishes it with the current site to GitHub Pages.

Design inspired by New Orleans sidewalk street tiles, French Quarter street signs,
gas lamps, balcony ironwork, curb-ramp warning strips, and Crescent City water
meter covers.
