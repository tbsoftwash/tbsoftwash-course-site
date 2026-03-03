# Content Callouts (FIGURE / PHOTO / MD viewer)

## FIGURE
In markdown:

```md
FIGURE: mock-fig-103-psi-vs-gpm
```

Renders from:
- `tbsoftwash-course/08_illustrations/src/<base>_<style>.svg`

Styles:
- `A-clean`
- `B-dark-glassy`
- `C-hybrid`

## PHOTO
In markdown:

```md
PHOTO: roof_tile_after_clean.jpg | Optional caption
```

Renders from:
- `tbsoftwash-course/08_illustrations/photos/<file>`

Policy: **no faces**.

## Inline MD viewer
Any internal `.md` reference (in backticks, inline code, or plain text) is converted into a dropdown viewer.

API:
- `/api/md?path=<rel>` returns JSON with title + markdown
- `/api/md?path=<rel>&download=1` downloads raw markdown

Allowlist is enforced server-side.
