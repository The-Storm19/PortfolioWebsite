/* =========================================================================
   PHOTOGRAPHY — CONTENT LIST
   =========================================================================
   This file controls everything that shows up on the Photography page.
   You do not need to touch any other file to add, remove, or edit a photo.

   HOW TO ADD A PHOTO
   -------------------
   1. Put the image file in this same "Photography" folder, next to this
      config.js file.
   2. Copy one whole block below — from the opening "{" to the closing "},"
      — and paste it as a new line inside the square brackets [ ] further
      down this file.
   3. Fill in the five fields:

        file   the exact image file name, including its extension
               (e.g. "harbor.jpg"). Capitalization must match exactly.

        name   the title shown under the photo

        date   the date and/or place shown under the title
               (e.g. "Portland, ME — 2024")

        short  one or two sentences shown on the page

        long   the fuller description shown when someone clicks "Read more"

   4. Save this file and refresh the website in your browser.

   To remove a photo, delete its whole { ... }, block. To change the order
   photos appear in, reorder the blocks.
   ========================================================================= */

window.PHOTOGRAPHY_ITEMS = [
  {
    file: "glass.1.final.schreier.Analiese.JPG",
    name: "Glass study",
    date: "2026",
    short: "Add a one- or two-sentence description here.",
    long: "Add the longer description here — this is what shows up when someone clicks \"Read more.\""
  },
  {
    file: "IMG_7737.jpg",
    name: "Glasss with Flower",
    date: "2026",
    short: "Add a one- or two-sentence description here.",
    long: "Add the longer description here — this is what shows up when someone clicks \"Read more.\""
  },
  {
    file: "AnalieseSchreier_AlbumCover.jpg",
    name: "Album cover",
    date: "2026",
    short: "Add a one- or two-sentence description here.",
    long: "Add the longer description here — this is what shows up when someone clicks \"Read more.\""
  },
  {
    file: "Schreier.Analiese.Portrate.jpg",
    name: "Portrait",
    date: "2026",
    short: "Add a one- or two-sentence description here.",
    long: "Add the longer description here — this is what shows up when someone clicks \"Read more.\""
  }
];
