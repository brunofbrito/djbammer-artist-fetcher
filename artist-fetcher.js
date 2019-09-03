const fetch = require('node-fetch');
const Entities = require('html-entities').AllHtmlEntities;
const fs = require('fs');

const entities = new Entities();
let artists = [];
let uniqueArtists = [];

function getAllMixes() {
  const urls = [
    'https://api.djbammer.net/wp-json/wp/v2/mixes?_embed&per_page=100',
    'https://api.djbammer.net/wp-json/wp/v2/mixes?_embed&per_page=100&page=2'
  ];

  Promise.all(
    urls.map(request => {
      return fetch(request)
        .then(response => {
          return response.json();
        })
        .then(data => {
          data.forEach(element => {
            getArtists(element.acf.tracklist);
          });
        });
    })
  )
    .then(() => {
      uniqueArtists = [...new Set(artists.sort())];
      uniqueArtists = uniqueArtists.filter(el => el);
      uniqueArtists.forEach(function(performer) {
        writeToArtistsFile(performer);
      });
    })
    .then(() => {
      fs.appendFile('Artists.js', ']\n export default Artists', function(err) {
        if (err) throw err;
        console.log('File Complete!');
      });
    })
    .catch(console.error.bind(console));
}

function getArtists(tracklist) {
  const regex = /<strong>(.*?)<\/strong>/gm;
  let m;
  while ((m = regex.exec(tracklist)) !== null) {
    // This is necessary to avoid infinite loops with zero-width matches
    if (m.index === regex.lastIndex) {
      regex.lastIndex++;
    }
    // The result can be accessed through the `m`-variable.
    m.forEach((match, groupIndex) => {
      match = entities.decode(match);
      if (groupIndex === 1) {
        artists.push(match.trim());
      }
    });
  }
}

function writeToArtistsFile(artist) {
  fs.appendFile('Artists.js', `"${artist}",\n`, function(err) {
    if (err) throw err;
  });
}

fs.writeFile('Artists.js', 'const Artists = [', function(err) {
  if (err) throw err;
});

getAllMixes();
