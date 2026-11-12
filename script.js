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
// "Graphic Design/config.js") into gallery cards inside the given
// container element. An entry in that array is either:
//
//   - a single photo:  { file, name, date, short, long }
//   - a group:         { group, date, long, photos: [ { file, name, short }, ... ] }
//
// A group gets its own titled, visibly separate section, and all of its
// photos share the group's one "long" description.
//
// Every thumbnail is drawn in the same standard frame (set once, by
// --gallery-aspect in styles.css). Optional `crop` and `zoom` fields on
// a photo in config.js decide which part of the photo that frame shows.
//
// If an image fails to load (missing file, typo in the name, etc.) the
// card falls back to a plain tinted panel instead of a broken-image icon.
// ---------------------------------------------------------------------

var GALLERY_FALLBACK_PAIRS = [
  ['#3C4630', '#18190F'],
  ['#18190F', '#803500'],
  ['#803500', '#3C4630'],
  ['#1D2642', '#18190F']
];

function isGalleryGroup(entry) {
  return !!entry && Array.isArray(entry.photos);
}

// Applies the optional per-photo crop settings from config.js:
//   crop  where to anchor the crop, e.g. "50% 20%" or "left top"
//   zoom  1 = no zoom, 2 = twice as close
function applyCrop(img, item) {
  if (item.crop) img.style.objectPosition = item.crop;

  var zoom = parseFloat(item.zoom);
  if (zoom > 1) {
    img.style.transformOrigin = item.crop || 'center';
    img.style.transform = 'scale(' + zoom + ')';
  }
}

function buildGalleryCard(item, folder, index, options, showReadMore) {
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
    applyCrop(img, item);
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

  if (showReadMore && item.file) {
    var moreLink = document.createElement('a');
    moreLink.className = 'text-link gallery-more-link';
    moreLink.href = 'work.html?folder=' + encodeURIComponent(folder) + '&file=' + encodeURIComponent(item.file);
    moreLink.textContent = 'Read more';
    body.appendChild(moreLink);
  }

  card.appendChild(body);
  return card;
}

function buildGalleryGroup(group, folder, startIndex, options) {
  var section = document.createElement('section');
  section.className = 'gallery-group';
  if (options.type) section.setAttribute('data-type', options.type);
  if (group.group) section.setAttribute('aria-label', group.group);

  // One "Read more" link per group, pointing at the group's project page.
  // (Any photo in the group opens the same page, so the first one is used.)
  var firstFile = '';
  group.photos.some(function (p) {
    if (p && p.file) { firstFile = p.file; return true; }
    return false;
  });
  var hasMore = !!firstFile && !!(group.long || group.spotlight);

  if (group.group || group.date || hasMore) {
    var head = document.createElement('div');
    head.className = 'gallery-group-head';

    if (group.group) {
      var title = document.createElement('h2');
      title.className = 'gallery-group-title';
      title.textContent = group.group;
      head.appendChild(title);
    }

    if (group.date) {
      var meta = document.createElement('p');
      meta.className = 'meta';
      meta.textContent = group.date;
      head.appendChild(meta);
    }

    if (hasMore) {
      var moreLink = document.createElement('a');
      moreLink.className = 'text-link gallery-more-link';
      moreLink.href = 'work.html?folder=' + encodeURIComponent(folder) + '&file=' + encodeURIComponent(firstFile);
      moreLink.textContent = 'Read more';
      head.appendChild(moreLink);
    }

    section.appendChild(head);
  }

  var grid = document.createElement('div');
  grid.className = 'gallery-grid';
  group.photos.forEach(function (photo, i) {
    // The group shows one "Read more" link in its header, so the
    // individual photo cards don't get their own.
    grid.appendChild(buildGalleryCard(photo, folder, startIndex + i, options, false));
  });
  section.appendChild(grid);

  return section;
}

function renderGalleryItems(items, folder, container, options) {
  if (!container || !items || !items.length) return;
  options = options || {};

  var frag = document.createDocumentFragment();
  var index = 0;

  items.forEach(function (entry) {
    if (isGalleryGroup(entry)) {
      frag.appendChild(buildGalleryGroup(entry, folder, index, options));
      index += entry.photos.length;
    } else {
      frag.appendChild(buildGalleryCard(entry, folder, index, options, !!entry.long));
      index += 1;
    }
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
// Home hero collage
//
// Scrolls the photos listed in photos/config.js past, behind the static
// logo on the home page, as a collage of horizontal strips. Every photo
// is shown whole (never cropped) at its own proportions.
//
// The layout adapts to the screen: wide screens get fewer, taller strips
// and phones get more, shorter ones, so photos stay a comfortable size
// and a good number of them are visible side by side. It re-plans itself
// when the window is resized or the phone is rotated.
//
// Each photo is preloaded first (its proportions are needed for the
// layout), so a missing or misspelled file is quietly skipped.
// ---------------------------------------------------------------------

// How fast the collage drifts, in pixels per second. Lower = slower.
// (Strips move at slightly different speeds around this value.)
var heroSpeed = 30;

// Space between photos, in pixels.
var heroGap = 6;

// Chooses how many strips fit best: aim for strips about 22% as tall as
// the screen is wide, kept between 180px and 300px.
function pickHeroRows(width, height, photoCount) {
  var target = Math.min(300, Math.max(180, width * 0.22));
  var rows = Math.round(height / target);
  return Math.max(1, Math.min(rows, 5, photoCount));
}

// Plans each strip: which photos it holds (every photo, starting from a
// different one in each strip so neighbours differ), repeated until the
// strip is comfortably wider than the screen, plus its speed and direction.
function planHeroRows(photos, rows, width, height) {
  var rowH = (height - (rows - 1) * heroGap) / rows;
  var plan = [];

  for (var r = 0; r < rows; r++) {
    var start = Math.round(r * photos.length / rows);
    var seq = [];
    var span = 0;
    var i = 0;

    do {
      var p = photos[(start + i) % photos.length];
      seq.push(p);
      span += rowH * p.ratio + heroGap;
      i += 1;
    } while (i % photos.length !== 0 || span * 0.8 < width);

    var speed = heroSpeed * (1 + 0.12 * (r % 3)) * (width < 600 ? 0.8 : 1);
    var dur = span / speed;

    plan.push({
      photos: seq,
      duration: dur,
      delay: -dur * ((r * 0.37) % 1),
      reverse: r % 2 === 1
    });
  }

  return plan;
}

function renderHeroCollage(slideshow, collage, photos) {
  var width = slideshow.clientWidth;
  var height = slideshow.clientHeight;
  var rows = pickHeroRows(width, height, photos.length);
  var plan = planHeroRows(photos, rows, width, height);

  collage.textContent = '';
  collage.style.setProperty('--hero-gap', heroGap + 'px');

  plan.forEach(function (row) {
    var rowEl = document.createElement('div');
    rowEl.className = 'hero-row' + (row.reverse ? ' hero-row--reverse' : '');

    var track = document.createElement('div');
    track.className = 'hero-track';
    track.style.animationDuration = row.duration.toFixed(2) + 's';
    track.style.animationDelay = row.delay.toFixed(2) + 's';

    // Two identical copies side by side, so the loop is seamless.
    for (var copy = 0; copy < 2; copy++) {
      row.photos.forEach(function (photo) {
        var img = document.createElement('img');
        img.src = photo.src;
        img.alt = '';
        img.draggable = false;
        img.style.aspectRatio = String(photo.ratio);
        track.appendChild(img);
      });
    }

    rowEl.appendChild(track);
    collage.appendChild(rowEl);
  });

  return { rows: rows, width: width };
}

function startHeroCollage(slideshow, photos) {
  if (!photos.length) return;

  var collage = document.createElement('div');
  collage.className = 'hero-collage';
  collage.setAttribute('aria-hidden', 'true');
  slideshow.insertBefore(collage, slideshow.firstChild);

  var state = renderHeroCollage(slideshow, collage, photos);

  // Re-plan on resize / rotation. Height-only changes (e.g. a phone's
  // address bar sliding away) are ignored so the collage doesn't restart.
  var timer = null;
  window.addEventListener('resize', function () {
    clearTimeout(timer);
    timer = setTimeout(function () {
      var width = slideshow.clientWidth;
      var rows = pickHeroRows(width, slideshow.clientHeight, photos.length);
      if (rows !== state.rows || width !== state.width) {
        state = renderHeroCollage(slideshow, collage, photos);
      }
    }, 200);
  });
}

document.addEventListener('DOMContentLoaded', function () {
  var slideshow = document.querySelector('.hero-slideshow');
  if (!slideshow) return;

  var files = (window.HERO_PHOTOS || []).slice(0, 10);
  if (!files.length) return;

  var results = new Array(files.length);
  var remaining = files.length;

  files.forEach(function (file, i) {
    var probe = new Image();
    probe.onload = function () {
      if (probe.naturalWidth && probe.naturalHeight) {
        results[i] = {
          src: probe.src,
          ratio: probe.naturalWidth / probe.naturalHeight
        };
      }
      settle();
    };
    probe.onerror = function () { settle(); };
    probe.src = encodeURI('photos/' + file);
  });

  function settle() {
    remaining -= 1;
    if (remaining === 0) {
      startHeroCollage(slideshow, results.filter(Boolean));
    }
  }
});

// ---------------------------------------------------------------------
// Work detail page (work.html)
//
// Reads ?folder= and &file= from the page's own address, finds the
// matching entry in Graphic Design/config.js or Photography/config.js,
// and renders it. This is what a gallery card's "Read more" link points to.
//
//   - A single photo shows the photo, title, date, and long description.
//   - A photo that belongs to a group shows the group's title, date, and
//     long description, followed by every photo in that group.
//
// Photos on this page are never cropped — they're shown whole, at their
// own proportions.
// ---------------------------------------------------------------------

// Finds the photo with the given file name, whether it's standing alone
// or inside a group. Returns { photo, group } (group is null when the
// photo stands alone), or null if there's no match.
function findWorkEntry(items, file) {
  for (var i = 0; i < items.length; i++) {
    var entry = items[i];
    if (isGalleryGroup(entry)) {
      for (var j = 0; j < entry.photos.length; j++) {
        if (entry.photos[j].file === file) return { photo: entry.photos[j], group: entry };
      }
    } else if (entry.file === file) {
      return { photo: entry, group: null };
    }
  }
  return null;
}

function buildWorkPhotoFrame(folder, item, lazy) {
  var frame = document.createElement('div');
  frame.className = 'gallery-frame gallery-frame--natural';

  var img = document.createElement('img');
  img.src = encodeURI(folder + '/' + item.file);
  img.alt = item.name || '';
  if (lazy) img.loading = 'lazy';
  img.addEventListener('error', function () {
    img.remove();
    frame.classList.add('gallery-frame--fallback');
    frame.style.setProperty('--c1', GALLERY_FALLBACK_PAIRS[0][0]);
    frame.style.setProperty('--c2', GALLERY_FALLBACK_PAIRS[0][1]);
  });
  frame.appendChild(img);

  return frame;
}

function renderWorkPhoto(container, folder, item) {
  if (item.name) document.title = item.name + ' — Analiese Schreier';

  container.appendChild(buildWorkPhotoFrame(folder, item, false));

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

function renderWorkGroup(container, folder, group) {
  container.classList.add('work-detail--group');
  if (group.group) document.title = group.group + ' — Analiese Schreier';

  var head = document.createElement('div');
  head.className = 'work-group-head';

  if (group.group) {
    var heading = document.createElement('h1');
    heading.className = 'h-section';
    heading.textContent = group.group;
    head.appendChild(heading);
  }

  if (group.date) {
    var meta = document.createElement('p');
    meta.className = 'meta';
    meta.textContent = group.date;
    head.appendChild(meta);
  }

  if (group.long) {
    var desc = document.createElement('p');
    desc.className = 'lede';
    desc.textContent = group.long;
    head.appendChild(desc);
  }

  container.appendChild(head);

  var grid = document.createElement('div');
  grid.className = 'work-group-photos';

  // Optional "project spotlight" (spotlight: true in config.js): the first
  // photo listed is shown larger, with a bigger title, ahead of the rest.
  var spotlightOn = !!group.spotlight;
  var shown = 0;

  group.photos.forEach(function (photo) {
    if (!photo.file) return;

    var isSpotlight = spotlightOn && shown === 0;
    shown += 1;

    var figure = document.createElement('figure');
    figure.className = 'work-group-item' + (isSpotlight ? ' work-group-item--spotlight' : '');
    figure.appendChild(buildWorkPhotoFrame(folder, photo, !isSpotlight));

    var caption = document.createElement('figcaption');
    caption.className = 'gallery-body';

    if (photo.name) {
      var name = document.createElement(isSpotlight ? 'h2' : 'h3');
      name.className = isSpotlight ? 'h-section' : 'h-card';
      name.textContent = photo.name;
      caption.appendChild(name);
    }

    if (photo.date) {
      var photoMeta = document.createElement('p');
      photoMeta.className = 'meta';
      photoMeta.textContent = photo.date;
      caption.appendChild(photoMeta);
    }

    if (photo.short) {
      var short = document.createElement('p');
      short.textContent = photo.short;
      caption.appendChild(short);
    }

    figure.appendChild(caption);
    grid.appendChild(figure);
  });

  container.appendChild(grid);
}

// Sends the "Back" link on the work page to where the visitor came from.
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

function renderWorkDetail() {
  var container = document.getElementById('work-detail');
  if (!container) return;

  var params = new URLSearchParams(window.location.search);
  var folder = params.get('folder') || '';
  var file = params.get('file') || '';

  setupWorkBackLink(folder);

  var sources = {
    'Graphic Design': window.GRAPHIC_DESIGN_ITEMS || [],
    'Photography': window.PHOTOGRAPHY_ITEMS || []
  };

  var found = findWorkEntry(sources[folder] || [], file);

  container.innerHTML = '';
  container.className = 'work-detail';

  if (!found) {
    var missing = document.createElement('p');
    missing.className = 'lede';
    missing.textContent = "We couldn't find that project — it may have been renamed or removed.";
    container.appendChild(missing);
    return;
  }

  if (found.group) {
    renderWorkGroup(container, folder, found.group);
  } else {
    renderWorkPhoto(container, folder, found.photo);
  }
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
      var cards = document.querySelectorAll('[data-type]');

      cards.forEach(function (card) {
        var type = card.getAttribute('data-type');
        var show = filter === 'all' || filter === type;
        card.style.display = show ? '' : 'none';
      });
    });
  });
}
