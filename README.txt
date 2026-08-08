DEMON STUDIO — Minecraft Bedrock Mod Download Website

FILES
- index.html                 Main responsive website
- assets/logo.jpg            Your uploaded Demon Studio logo
- assets/Graduate-Regular.ttf Your uploaded font
- mods/                      Put .mcpack, .mcaddon and .mcworld files here

HOW TO ADD A MOD
1. Copy the Minecraft file into the mods folder.
2. Open index.html in a text editor.
3. Find `const mods = [`.
4. Add a new object, for example:
   {
     id:4,
     title:"My Addon",
     type:"Addon",
     version:"1.21+",
     devices:["Android","iOS / iPadOS","Windows"],
     size:"15 MB",
     description:"My Bedrock addon.",
     file:"mods/my-addon.mcaddon"
   }
5. Open index.html in a browser.

NOTE
This is a frontend-only site, so it does not automatically upload/manage files.
For a real public download library, upload the project to a static host and place the downloadable files in the `mods` directory (or replace the file paths with your own hosted files).

The uploaded Graduate font is applied only to the website name/headline; the rest of the UI uses a normal system font.
