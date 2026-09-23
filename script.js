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
      img.addEventListener('load', function () {
        // Only a successfully loaded photo opens the lightbox — a
        // fallback panel has no full-resolution image to show.
        frame.classList.add('gallery-frame--clickable');
        frame.setAttribute('tabindex', '0');
        frame.setAttribute('role', 'button');
        frame.setAttribute('aria-label', 'View full image' + (item.name ? ': ' + item.name : ''));
      });
      img.addEventListener('error', function () {
        img.remove();
        var pair = GALLERY_FALLBACK_PAIRS[index % GALLERY_FALLBACK_PAIRS.length];
        frame.style.setProperty('--c1', pair[0]);
        frame.style.setProperty('--c2', pair[1]);
        frame.classList.add('gallery-frame--fallback');
      });
      frame.appendChild(img);

      frame.addEventListener('click', function () {
        if (frame.classList.contains('gallery-frame--clickable')) {
          openLightbox(img.src, img.alt);
        }
      });
      frame.addEventListener('keydown', function (e) {
        if ((e.key === 'Enter' || e.key === ' ') && frame.classList.contains('gallery-frame--clickable')) {
          e.preventDefault();
          openLightbox(img.src, img.alt);
        }
      });
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

    if (item.long && item.file) {
      var moreLink = document.createElement('a');
      moreLink.className = 'text-link gallery-more-link';
      moreLink.href = 'work.html?folder=' + encodeURIComponent(folder) + '&file=' + encodeURIComponent(item.file);
      moreLink.textContent = 'Read more';
      body.appendChild(moreLink);
    }

    card.appendChild(body);
    frag.appendChild(card);
  });

  container.appendChild(frag);
}

// ---------------------------------------------------------------------
// Lightbox
//
// Clicking (or pressing Enter/Space on) a gallery photo opens it at
// full resolution, uncropped, over a dark overlay. One overlay element
// is created and reused for every card on the page.
// ---------------------------------------------------------------------

var lightboxEl = null;
var lightboxImgEl = null;
var lightboxReturnFocusTo = null;

function ensureLightbox() {
  if (lightboxEl) return lightboxEl;

  lightboxEl = document.createElement('div');
  lightboxEl.className = 'lightbox-overlay';
  lightboxEl.setAttribute('role', 'dialog');
  lightboxEl.setAttribute('aria-modal', 'true');
  lightboxEl.setAttribute('aria-label', 'Full-size image');
  lightboxEl.hidden = true;

  var closeBtn = document.createElement('button');
  closeBtn.type = 'button';
  closeBtn.className = 'lightbox-close';
  closeBtn.setAttribute('aria-label', 'Close full-size image');
  closeBtn.innerHTML = '&times;';
  closeBtn.addEventListener('click', closeLightbox);

  lightboxImgEl = document.createElement('img');
  lightboxImgEl.className = 'lightbox-image';

  lightboxEl.appendChild(closeBtn);
  lightboxEl.appendChild(lightboxImgEl);

  // Click on the dark backdrop (not the image or button) closes it.
  lightboxEl.addEventListener('click', function (e) {
    if (e.target === lightboxEl) closeLightbox();
  });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && lightboxEl && !lightboxEl.hidden) closeLightbox();
  });

  document.body.appendChild(lightboxEl);
  return lightboxEl;
}

function openLightbox(src, alt) {
  var el = ensureLightbox();
  lightboxImgEl.src = src;
  lightboxImgEl.alt = alt || '';
  el.hidden = false;
  document.body.classList.add('lightbox-open');
  lightboxReturnFocusTo = document.activeElement;
  el.querySelector('.lightbox-close').focus();
}

function closeLightbox() {
  if (!lightboxEl || lightboxEl.hidden) return;
  lightboxEl.hidden = true;
  lightboxImgEl.src = '';
  document.body.classList.remove('lightbox-open');
  if (lightboxReturnFocusTo && typeof lightboxReturnFocusTo.focus === 'function') {
    lightboxReturnFocusTo.focus();
  }
}

// ---------------------------------------------------------------------
// Home hero slideshow
//
// Cross-fades through the photos listed in photos/config.js behind the
// static logo on the home page. Each photo is preloaded first, so a
// missing or misspelled file is quietly skipped rather than flashing a
// broken image.
// ---------------------------------------------------------------------

// This variable sets the time each photo stays on screen on the home page before fading to the next photo
var hangTime = 2500;

document.addEventListener('DOMContentLoaded', function () {
  var slideshow = document.querySelector('.hero-slideshow');
  if (!slideshow) return;

  var files = (window.HERO_PHOTOS || []).slice(0, 10);
  if (!files.length) return;

  var loaded = [];
  var remaining = files.length;

  files.forEach(function (file) {
    var probe = new Image();
    probe.onload = function () { loaded.push(file); settle(); };
    probe.onerror = function () { settle(); };
    probe.src = encodeURI('photos/' + file);
  });

  function settle() {
    remaining -= 1;
    if (remaining === 0) startHeroSlideshow(slideshow, loaded);
  }
});

function startHeroSlideshow(slideshow, files) {
  if (!files.length) return;

  files.forEach(function (file, i) {
    var slide = document.createElement('div');
    slide.className = 'hero-slide' + (i === 0 ? ' is-active' : '');
    slide.style.backgroundImage = 'url("' + encodeURI('photos/' + file) + '")';
    slideshow.insertBefore(slide, slideshow.firstChild);
  });

  if (files.length < 2) return;

  var slides = slideshow.querySelectorAll('.hero-slide');
  var current = 0;
  setInterval(function () {
    slides[current].classList.remove('is-active');
    current = (current + 1) % slides.length;
    slides[current].classList.add('is-active');
  }, hangTime);
}

// ---------------------------------------------------------------------
// Work detail page (work.html)
//
// Reads ?folder= and &file= from the page's own address, finds the
// matching entry in Graphic Design/config.js or Photography/config.js,
// and renders the photo, title, date, and long description. This is
// what a gallery card's "Read more" link points to.
// ---------------------------------------------------------------------
function renderWorkDetail() {
  var container = document.getElementById('work-detail');
  if (!container) return;

  var params = new URLSearchParams(window.location.search);
  var folder = params.get('folder') || '';
  var file = params.get('file') || '';

  var sources = {
    'Graphic Design': window.GRAPHIC_DESIGN_ITEMS || [],
    'Photography': window.PHOTOGRAPHY_ITEMS || []
  };

  var items = sources[folder] || [];
  var item = null;
  for (var i = 0; i < items.length; i++) {
    if (items[i].file === file) { item = items[i]; break; }
  }

  container.innerHTML = '';

  if (!item) {
    var missing = document.createElement('p');
    missing.className = 'lede';
    missing.textContent = "We couldn't find that project — it may have been renamed or removed.";
    container.appendChild(missing);
    return;
  }

  if (item.name) document.title = item.name + ' — Analiese Schreier';

  var frame = document.createElement('div');
  frame.className = 'gallery-frame work-detail-frame';
  var img = document.createElement('img');
  img.src = encodeURI(folder + '/' + item.file);
  img.alt = item.name || '';
  img.addEventListener('error', function () {
    img.remove();
    frame.classList.add('gallery-frame--fallback');
    frame.style.setProperty('--c1', GALLERY_FALLBACK_PAIRS[0][0]);
    frame.style.setProperty('--c2', GALLERY_FALLBACK_PAIRS[0][1]);
  });
  frame.appendChild(img);
  container.appendChild(frame);

  var body = document.createElement('div');
  body.className = 'work-detail-body';

  if (item.name) {
    var heading = document.createElement('h1');
    heading.className = 'h-section';
    heading.textContent = item.name;
    body.appendChild(heading);
  }

  if (item.date) {
    var meta = document.createElement('p');
    meta.className = 'meta';
    meta.textContent = item.date;
    body.appendChild(meta);
  }

  var description = item.long || item.short;
  if (description) {
    var desc = document.createElement('p');
    desc.className = 'lede';
    desc.textContent = description;
    body.appendChild(desc);
  }

  container.appendChild(body);
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
