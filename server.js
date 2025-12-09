const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();

const PORT = process.env.PORT || 3000;

/* Data loading from json */
const jsonPathArtists = path.join(__dirname, 'data', 'artists.json');
const jsonPathGalleries = path.join(__dirname, 'data', 'galleries.json');
const jsonPathPaintings = path.join(__dirname, 'data', 'paintings-nested.json');

const artists = JSON.parse(fs.readFileSync(jsonPathArtists, 'utf8'));
const galleries = JSON.parse(fs.readFileSync(jsonPathGalleries, 'utf8'));
const paintings = JSON.parse(fs.readFileSync(jsonPathPaintings, 'utf8'));

/* painting api routing */

// /api/paintings
app.get('/api/paintings', (req, res) => {
    res.json(paintings); // Return JSON for all paintings
});

// /api/painting/id
app.get('/api/painting/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const match = paintings.find(p => p.paintingID === id);

    if (match) { // Return JSON for a single painting
        res.json(match);
    } else {
        res.status(404).json({ message: 'No paintings found for that ID' });
    }
}); 

// /api/painting/gallery/id
app.get('/api/painting/gallery/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const match = paintings.filter(p => p.gallery.galleryID === id);
    
    if (match.length > 0){ // Returns paintings matching with the provided artist ID
        res.json(match);
    } else {
        res.status(404).json({message: 'No painting was found for this artist id'});
    }
});

// /api/painting/artist/id
app.get('/api/painting/artist/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const matches = paintings.filter(p => p.artist.artistID === id);

    if (matches.length > 0) { // Returns paintings matching with the provided artist ID
        res.json(matches);
    } else {
        res.status(404).json({ message: 'No paintings found for this artist id' });
    }
});
// /api/painting/year/min/max
app.get( '/api/painting/year/:min/:max', (req, res) => {
    const min = parseInt(req.params.min);
    const max = parseInt(req.params.max);
    const matches = paintings.filter( p => p.yearOfWork >= min && p.yearOfWork <= max);
    
    if (matches.length > 0) { // Returns paintings created within the provided year range
        res.json(matches);
    } else {
        res.status(404).json({ message: 'No paintings found in this year range' });
    }

});

// /api/painting/title/text
app.get('/api/painting/title/:text', (req,res) => {
    const text = req.params.text.toLowerCase();
    const matches = paintings.filter( p => p.title.toLowerCase().includes(text));
    
    if (matches.length > 0) { // Returns paintings whose title contains the provided text (case insensitive)
        res.json(matches);
    } else {
        res.status(404).json({ message: 'No paintings found with this title' });
    }
});
// /api/painting/color/name
app.get('/api/painting/color/:name', (req, res) => {
    const searchColor = req.params.name.toLowerCase();
    const match = paintings.filter(p => {
        // Find the color array in JSON
        const colors = p.details.annotation.dominantColors;
        // Check if any colors in that array match our search
        return colors.some(c => c.name.toLowerCase() === searchColor);
    })

    if (match.length > 0 ){ // Returns paintings that contain the provided color name in their dominant colors
        res.json(match);
    } else {
        res.status(404).json({message: 'No paintings found with this color'})
    }
    
});

/* Artist api routing */

// /api/artists
app.get('/api/artists', (req,res) => {
    res.json(artists); // Return JSON for all artists
});

// /api/artists/country
app.get('/api/artists/:country', (req,res) => {
    const country = req.params.country.toLowerCase();
    
    const match = artists.filter(a => a.Nationality.toLowerCase() === country)
    
    if (match.length > 0 ){ // Return JSON for artists from a specific country
        res.json(match);
    } else {
        res.status(404).json({message: 'No artists found for this country'})
    }
});

/* Gallery api routing */

// /api/galleries
app.get('/api/galleries', (req,res) => {
    res.json(galleries); // Return JSON for all galleries
}); 

// /api/galleries/country
app.get('/api/galleries/:country', (req,res) => {
    const country = req.params.country.toLowerCase();

    const match = galleries.filter(g => g.GalleryCountry.toLowerCase() === country);

    if (match.length > 0 ){ // Return JSON for galleries from a specific country
        res.json(match);
    } else {
        res.status(404).json({message: 'No galleries found for this country'})
    }
});

// Start the server and listen for incoming HTTP. 
app.listen(PORT, () => {
    console.log(`Server running at port ${PORT}`);
});