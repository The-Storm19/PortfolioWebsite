// ---------------------------------------------------------------------
// Mobile nav toggle
// ---------------------------------------------------------------------
document.addEventListener('DOMContentLoaded', function () {
  var toggle = document.querySelector('.nav-toggle');
  var nav = document.querySelector('.primary-nav');
  if (toggle && nav) {
    toggle.addEventListener('click', function () {
      var open = nav.classList.toggle('is-open');
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
  }
});

// ---------------------------------------------------------------------
// Gallery rendering
//
// Turns a config array (see Photography/config.js or
// "Graphic Design/config.js") into a row of gallery cards inside the
// given container element. Each item needs: file, name, date, short, long.
// If an image fails to load (missing file, typo in the name, etc.) the
// card falls back to a plain tinted panel instead of a broken-image icon.
// ---------------------------------------------------------------------

var GALLERY_FALLBACK_PAIRS = [
  ['#3C4630', '#18190F'],
  ['#18190F', '#803500'],
  ['#803500', '#3C4630'],
  ['#1D2642', '#18190F']
];

function renderGalleryItems(items, folder, container, options) {
  if (!container || !items || !items.length) return;
  options = options || {};

  var frag = document.createDocumentFragment();

  items.forEach(function (item, index) {
    var card = document.createElement('article');
    card.className = 'gallery-card';
    if (options.type) card.setAttribute('data-type', options.type);

    var frame = document.createElement('div');
    frame.className = 'gallery-frame';

    if (item.file) {
      var img = document.createElement('img');
      img.src = encodeURI(folder + '/' + item.file);
      img.alt = item.name || '';
      img.loading = 'lazy';
      img.addEventListener('error', function () {
        img.remove();
        var pair = GALLERY_FALLBACK_PAIRS[index % GALLERY_FALLBACK_PAIRS.length];
        frame.style.setProperty('--c1', pair[0]);
        frame.style.setProperty('--c2', pair[1]);
        frame.classList.add('gallery-frame--fallback');
      });
      frame.appendChild(img);
    }
    card.appendChild(frame);

    var body = document.createElement('div');
    body.className = 'gallery-body';

    if (item.name) {
      var heading = document.createElement('h3');
      heading.className = 'h-card';
      heading.textContent = item.name;
      body.appendChild(heading);
    }

    if (item.date) {
      var meta = document.createElement('p');
      meta.className = 'meta';
      meta.textContent = item.date;
      body.appendChild(meta);
    }

    if (item.short) {
      var short = document.createElement('p');
      short.textContent = item.short;
      body.appendChild(short);
    }

    if (item.long) {
      var details = document.createElement('details');
      details.className = 'gallery-more';
      var summary = document.createElement('summary');
      summary.textContent = 'Read more';
      var long = document.createElement('p');
      long.className = 'caption';
      long.textContent = item.long;
      details.appendChild(summary);
      details.appendChild(long);
      body.appendChild(details);
    }

    card.appendChild(body);
    frag.appendChild(card);
  });

  container.appendChild(frag);
}

// ---------------------------------------------------------------------
// Portfolio filter (only present on portfolio.html, after gallery cards
// have been rendered into the page)
// ---------------------------------------------------------------------
function setupGalleryFilter() {
  var filterBar = document.querySelector('.filter-bar');
  if (!filterBar) return;

  var buttons = filterBar.querySelectorAll('button');

  buttons.forEach(function (btn) {
    btn.addEventListener('click', function () {
      buttons.forEach(function (b) { b.setAttribute('aria-pressed', 'false'); });
      btn.setAttribute('aria-pressed', 'true');
      var filter = btn.getAttribute('data-filter');
      var cards = document.querySelectorAll('.gallery-card');

      cards.forEach(function (card) {
        var type = card.getAttribute('data-type');
        var show = filter === 'all' || filter === type;
        card.style.display = show ? '' : 'none';
      });
    });
  });
}
