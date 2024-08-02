const express = require('express');
const path = require('path');
const app = express();
const port = 6666;

// Serve static files from the "Documentation" directory
app.use(express.static(path.join(__dirname, 'Documentation')));

// Start the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});