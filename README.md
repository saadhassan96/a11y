# NOLA Accessibility Lab website

Website of the NOLA Accessibility Lab at Tulane University.

- Live site: https://saadhassan96.github.io/a11y/
- Archived site (2024 to October 2026): https://saadhassan96.github.io/a11y/archive/
- Saad Hassan: https://saadh.info

## Run locally

The site is plain HTML with no build step. Open `index.html` in a browser, or
serve the folder so paths behave as they do online:

```
python3 -m http.server 8000
```

Then visit http://localhost:8000.

To preview the archived Hugo site, install Hugo 0.119 (extended) and run
`hugo server --source archive`.

Pushing to `main` runs `.github/workflows/gh-pages.yaml`, which builds the
archive into `/archive/` and publishes both with GitHub Pages.

## License

Code is under the MIT License. Written content and photos are copyright
Saad Hassan and the NOLA Accessibility Lab, all rights reserved. See
[LICENSE](LICENSE).
