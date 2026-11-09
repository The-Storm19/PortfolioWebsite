#!/usr/bin/env bash
# Run AFTER apply-group-changes.sh, from anywhere inside your repo:
#   bash apply-back-link.sh
# Adds a second commit to the same branch. Aborts without changing
# anything if any expected text isn't found.
set -euo pipefail

BRANCH="group-read-more-and-spotlight"

cd "$(git rev-parse --show-toplevel)"
git checkout "$BRANCH"

python3 - <<'PYEOF'
import io

def edit(path, pairs):
    with io.open(path, encoding="utf-8", newline="") as f:
        text = f.read()
    crlf = "\r\n" in text
    if crlf:
        text = text.replace("\r\n", "\n")
    for old, new in pairs:
        if text.count(old) != 1:
            raise SystemExit("Expected exactly one match in %s for:\n%s" % (path, old))
        text = text.replace(old, new)
    if crlf:
        text = text.replace("\n", "\r\n")
    with io.open(path, "w", encoding="utf-8", newline="") as f:
        f.write(text)

# ---------------------------------------------------------------- work.html
edit("work.html", [
(r'''<a class="text-link" href="index.html">&larr; Back to portfolio</a>''',
 r'''<a class="text-link" id="work-back-link" href="index.html">&larr; Back to portfolio</a>'''),
])

# ---------------------------------------------------------------- script.js
edit("script.js", [
(r'''function renderWorkDetail() {''',
r'''// Sends the "Back" link on the work page to where the visitor came from.
// If they arrived from another page of this site, the link goes back one
// step in their history (which also restores their scroll position).
// Otherwise (opened directly, or from outside the site) it falls back to
// the gallery page the project belongs to.
function setupWorkBackLink(folder) {
  var link = document.getElementById('work-back-link');
  if (!link) return;

  var fallbacks = {
    'Graphic Design': 'graphic-design.html',
    'Photography': 'photographic-design.html'
  };
  if (fallbacks[folder]) link.href = fallbacks[folder];

  var cameFromSite = false;
  try {
    var ref = document.referrer ? new URL(document.referrer) : null;
    cameFromSite = !!ref &&
      ref.origin === window.location.origin &&
      !/work\.html$/.test(ref.pathname);
  } catch (e) {}

  if (cameFromSite && window.history.length > 1) {
    link.addEventListener('click', function (e) {
      e.preventDefault();
      window.history.back();
    });
  }
}

function renderWorkDetail() {'''),

(r'''  var file = params.get('file') || '';
''',
r'''  var file = params.get('file') || '';

  setupWorkBackLink(folder);
'''),
])

print("Edits applied.")
PYEOF

git add work.html script.js
git commit -m "Make 'Back to portfolio' return to the previous page

On the Read more page, the back link now goes back to the page the
visitor came from (restoring scroll position). If there's no on-site
referrer, it falls back to the Graphic Design or Photography page the
project belongs to, instead of always going to the home page."

echo "Done. Committed on branch: $BRANCH"
