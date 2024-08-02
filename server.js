const express = require('express');
const path = require('path');
const app = express();
const port = 6666; 

// Serve static files from the root directory, excluding the Documentation folder
app.use(express.static(__dirname, {
    extensions: ['html'],
    setHeaders: (res, path) => {
        if (path.includes('Documentation')) {
            res.status(403).send('Access Forbidden');
        }
    }
}));

// Handle requests for specific HTML files directly
app.get('/:file', (req, res) => {
    const filePath = path.join(__dirname, `${req.params.file}.html`);
    res.sendFile(filePath, (err) => {
        if (err) {
            res.status(404).send('File not found');
        }
    });
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});