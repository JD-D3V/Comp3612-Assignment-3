const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();

const PORT = process.env.PORT || 3000;

/* Data loading from json */
const jsonPathArtiists = path.join(__dirname, 'data', 'artists.json');
const jsonPathGalleries = path.join(__dirname, 'data', 'galleries.json');
const jsonPathPaintings = path.join(__dirname, 'data', 'paintings-nested.json');

const artists = JSON.parse(fs.readFileSync(jsonPathArtiists, 'utf8'));
const galleries = JSON.parse(fs.readFileSync(jsonPathGalleries, 'utf8'));
const paintings = JSON.parse(fs.readFileSync(jsonPathPaintings, 'utf8'));

/* painting api routing */

// /api/paintings
// Return JSON for all paintings
app.get('/api/paintings', (req, res) => {
    res.json(paintings);
});

// /api/painting/id
// Return JSON for a single painting
app.get('/api/paintings/:id', (req, res) => {
    const id = parseInt(req.params.id, 10);
    const matches = paintings.filter( p => p.gallery.galleryID === id );
    if (matches.length > 0) {
        res.json(matches[0]);
    } else {
        res.status(404).json({ message: 'No paintings found for this gallery ID' });
    }
});

// /api/painting/gallery/id
// Returns paintings matching with the provides artist ID
app.get('/api/painting/artist/:id', (req, res) => {



});



// /api/painting/year/min/max
app.get( '/api/painting/year/:min/:max', (req, res) => {
    const min = parseInt(req.params.min);
    const max = parseInt(req.params.max);


});

// /api/painting/title/text
// /api/painting/color/name 
// /api/artists
// /api/artists/country
// /api/galleries
// /api/galleries/country