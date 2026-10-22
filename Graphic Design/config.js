/* =========================================================================
   GRAPHIC DESIGN — CONTENT LIST
   =========================================================================
   This file controls everything that shows up on the Graphic Design page.
   You do not need to touch any other file to add, remove, or edit a project.

   Everything goes inside the square brackets [ ] at the bottom of this
   file, in the order you want it to appear. Put the image files in this
   same "Graphic Design" folder, next to this config.js file.


   A SINGLE PHOTO
   --------------
   Copy one whole block, from the opening "{" to the closing "},", and fill
   in the five fields:

        file   the exact image file name, including its extension
               (e.g. "poster-series.jpg"). Capitalization must match exactly.

        name   the project title shown under the image

        date   the date and/or client name shown under the title
               (e.g. "Client Name — 2025")

        short  one or two sentences shown on the page

        long   the fuller description shown when someone clicks "Read more"


   A GROUP OF PHOTOS
   -----------------
   A group is a set of photos that belong to one project. On the page it
   gets its own titled section, visibly separate from everything else.
   When someone clicks "Read more" on any photo in a group, they land on a
   page showing the group's description and ALL of the photos in the group.

   Copy a whole group block, from its "{" to its closing "},":

     {
       group: "Project title",
       date: "2025",
       long: "The description of the whole project.",
       photos: [
         { file: "one.jpg", name: "First photo", short: "A sentence." },
         { file: "two.jpg", name: "Second photo", short: "A sentence." }
       ]
     },

        group  the title shown above the group
        date   shown under the title (optional)
        long   ONE description for the whole project, shown on the
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

window.GRAPHIC_DESIGN_ITEMS = [
  {
    file: "LAMBEIN_Competition.PNG",
    name: "Hall Brawl Contest Winner",
    date: "2026",
    short: "This logo won a completion for my university Dorm sweatshirt competition.",
    long: "The fuller description goes here — this is what shows up when someone clicks \"Read more.\" Delete this example once you've added your own work."
  },
  {
    file: "V&B_Logo.png",
    name: "Vine and Branches Logo",
    date: "2026",
    short: "A logo for a young adults group called Vine and Branches.",
    long: "The fuller description goes here — this is what shows up when someone clicks \"Read more.\" Delete this example once you've added your own work."
  },
  {
    file: "logo-Black.png",
    name: "Small Business Branding",
    date: "2025",
    short: "A logo designed for a private company.",
    long: "The fuller description goes here — this is what shows up when someone clicks \"Read more.\" Delete this example once you've added your own work."
  },
  {
    file: "Fairy Dust-Lable.jpg",
    name: "Fairy Dust Product Design",
    date: "2024",
    short: "Magical fairy dust product for kids tea partys that I illustrated and designed.",
    long: "The fuller description goes here — this is what shows up when someone clicks \"Read more.\" Delete this example once you've added your own work."
  },
  {
    file: "Analiese.jpg",
    name: "Screen Printing Shirt Design",
    date: "2026",
    short: "Illustration of a young dow made out of color blocking.",
    long: "The fuller description goes here — this is what shows up when someone clicks \"Read more.\" Delete this example once you've added your own work."
  },
  {
    file: "HardCider.png",
    name: "Hard Cider Packaging",
    date: "2026",
    short: "This illustration was used for product label.",
    long: "The fuller description goes here — this is what shows up when someone clicks \"Read more.\" Delete this example once you've added your own work.",
    crop: "center top"
  },
  {
    group: "Senegal Village Illustrations",
    date: "2025",
    long: "The description of the whole project goes here — this is what shows up on the \"Read more\" page for every photo in this group.",
    photos: [
      {
        file: "Final.jpg",
        name: "Narrative-Driven Imagery for Flyer",
        short: "A set of illustrations used as a set to show the culture of a small village in Senegal."
      },
      {
        file: "Final02.jpg",
        name: "African Woman with Mortar and Pestle",
        short: "A set of illustrations used as a set to show the culture of a small village in Senegal."
      },
      {
        file: "Series_2.jpg",
        name: "African Woman Carrying Water",
        short: "A set of illustrations used as a set to show the culture of a small village in Senegal."
      }
    ]
  },
  {
    group: "Children's Book Covers",
    date: "2025",
    long: "The description of the whole project goes here — this is what shows up on the \"Read more\" page for every photo in this group.",
    photos: [
      {
        file: "Book1_Mockup0.25x.jpg",
        name: "Children's Book Cover Design",
        short: "A childrens book designed while working for Masthof Press."
      },
      {
        file: "Book2_Mockup0.25x.jpg",
        name: "Children's Book Cover Design",
        short: "A childrens book designed while working for Masthof Press."
      }
    ]
  }
];
