const express = require('express');
const path = require('path');

const app = express();
const PORT = 3000;
const filepath = '/public';

app.use(express.static(path.join(__dirname, filepath)));

const routes = [
	["/", "index"],
	["/Games", "games"],
	["/Apps", "apps"],
	["/Settings", "settings"]
];

// Serve the HTML files directly
for (const [url, page] of routes) {
    app.get(url, (req, res) => {
        res.sendFile(path.join(__dirname, filepath, `${page}.html`));
    });
}

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
