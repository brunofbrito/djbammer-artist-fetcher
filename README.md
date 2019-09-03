# Artist Fetcher (for [djbammer.net](https://djbammer.net))

## Instructions:

Simply run `node artist-fetcher.js` on your terminal to retrieve all the artists featured on [DJ Bammer](https://djbammer.net)'s monthy mixes. You will need to have [Node.js](https://nodejs.org/en/) installed.

## What does it do?

This file uses the DJ Bammer WordPress API to fetch all mixes and then filters the artists. After all the data treatment, it outputs an `Artists.js` file listing all the unique music producers.

## Dependencies:
- fs
- html-entities
- node-fetch