/* =========================================================================
   PHOTOGRAPHY — CONTENT LIST
   =========================================================================
   This file controls everything that shows up on the Photography page.
   You do not need to touch any other file to add, remove, or edit a photo.

   Everything goes inside the square brackets [ ] at the bottom of this
   file, in the order you want it to appear. Put the image files in this
   same "Photography" folder, next to this config.js file.


   A SINGLE PHOTO
   --------------
   Copy one whole block, from the opening "{" to the closing "},", and fill
   in the five fields:

        file   the exact image file name, including its extension
               (e.g. "harbor.jpg"). Capitalization must match exactly.

        name   the title shown under the photo

        date   the date and/or place shown under the title
               (e.g. "Portland, ME — 2024")

        short  one or two sentences shown on the page

        long   the fuller description shown when someone clicks "Read more"


   A GROUP OF PHOTOS
   -----------------
   A group is a set of photos that belong to one project or series. On the
   page it gets its own titled section, visibly separate from everything
   else. When someone clicks "Read more" on any photo in a group, they land
   on a page showing the group's description and ALL of the photos in the
   group.

   Copy a whole group block, from its "{" to its closing "},":

     {
       group: "Series title",
       date: "2024",
       long: "The description of the whole series.",
       photos: [
         { file: "one.jpg", name: "First photo", short: "A sentence." },
         { file: "two.jpg", name: "Second photo", short: "A sentence." }
       ]
     },

        group  the title shown above the group
        date   shown under the title (optional)
        long   ONE description for the whole series, shown on the
               "Read more" page (individual photos in a group don't
               have their own "long")
        photos the photos in the group. Each needs file, name, and short
               (and can have its own date if you like).

   To take a photo out of a group, move its { ... }, block out of the
   photos [ ] list and paste it among the other single photos.


   CROPPING THUMBNAILS (optional, any photo)
   -----------------------------------------
   Every thumbnail on the page is drawn in the same standard frame, so
   photos of different shapes get trimmed to fit. By default the trim is
   centered. To choose what stays in view, add either or both of these to
   a photo's block (don't forget the comma after the line before it):

        crop: "50% 20%",   which part of the photo to keep. The first
                           number is left-to-right (0% keeps the left
                           edge, 100% keeps the right edge), the second
                           is top-to-bottom (0% keeps the top, 100% keeps
                           the bottom). "50% 50%" is the center. Words
                           work too: "left top", "center bottom".

        zoom: 1.5,         1 = no zoom. 1.5 = 50% closer, 2 = twice as
                           close, zooming in toward the crop point.

   Cropping only affects the thumbnails. The "Read more" page always
   shows photos whole.

   (The shape of the standard frame itself is set in one place: the
   --gallery-aspect line at the top of styles.css.)


   Save this file and refresh the website in your browser to see changes.
   To remove something, delete its whole { ... }, block.
   ========================================================================= */

window.PHOTOGRAPHY_ITEMS = [
  {
    file: "IMG_0229.jpg-1.jpg",
    name: "The Train in the Window",
    date: "2023",
    short: "Framing the beautiful breaking dawn of the old world with a decaying window.",
    long: "Add the longer description here — this is what shows up when someone clicks \"Read more.\""
  },
  {
    file: "IMG_0673.jpg",
    name: "Floating Mushroom",
    date: "2023",
    short: "Studio project that worked with capturing the beauty of nature in a studio environment.",
    long: "Add the longer description here — this is what shows up when someone clicks \"Read more.\"",
    crop: "50% 40%"
  },
  {
    file: "IMG_0084.jpg",
    name: "Bucket in the Dark",
    date: "2023",
    short: "In a class project to photograph the beauty in a rundown building sat a bucket in the sun.",
    long: "Add the longer description here — this is what shows up when someone clicks \"Read more.\""
  },
  {
    group: "Macro Milkweed",
    date: "2023",
    long: "The description of the whole series goes here — this is what shows up on the \"Read more\" page for every photo in this group.",
    photos: [
      {
        file: "IMG_1079.jpg",
        name: "Macro Milkweed",
        short: "Studio project that worked with capturing the beauty of nature in a studio environment."
      },
      {
        file: "IMG_1085.jpg",
        name: "Macro Milkweed",
        short: "Studio project that worked with capturing the beauty of nature in a studio environment."
      }
    ]
  },
  {
    file: "glass.1.final.schreier.Analiese.JPG",
    name: "Glass study",
    date: "2026",
    short: "A studio lighting final that focused on line quality.",
    long: "Add the longer description here — this is what shows up when someone clicks \"Read more.\"",
    crop: "50% 40%"
  },
  {
    file: "IMG_7737.jpg",
    name: "Glasss with Flower",
    date: "2026",
    short: "A studio lighting final that combined glass and shadow to depict the delicate balance.",
    long: "Add the longer description here — this is what shows up when someone clicks \"Read more.\"",
    crop: "center bottom"
  },
  {
    group: "Senegal",
    date: "2022",
    long: "The description of the whole series goes here — this is what shows up on the \"Read more\" page for every photo in this group.",
    photos: [
      {
        file: "IMG_5156-1-3.jpg",
        name: "Returning with Lunch",
        short: "A girl returning to her family with their lunch in Senegal.",
        crop: "center top"
      },
      {
        file: "IMG_5361-1-3.jpg",
        name: "Sitting in the Waiting",
        short: "A young boy that was waiting for his turn to see the doctor in rural Senegal.",
        crop: "50% 40%"
      },
      {
        file: "IMG_5724-1-3.jpg",
        name: "The Wanderer",
        short: "A Samba (oldest boy that leads cattle) guiding his donkeys to water."
      },
      {
        file: "IMG_5740-1-2.jpg",
        name: "Dance in the Sand",
        short: "Senegalese boy teaching foreigners how to dance.",
        crop: "center top"
      }
    ]
  }
];
