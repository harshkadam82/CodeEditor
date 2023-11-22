const express = require('express');
const bodyParser = require('body-parser');
const fetch = require('node-fetch');

const app = express();
const port = 3001;

app.use(bodyParser.json());

app.post('/compile', async (req, res) => {
    const { code } = req.body;

    try {
        const response = await fetch('https://replit.com/api/v0/repls', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                language: 'cpp',
                code,
            }),
        });

        if (response.ok) {
            const result = await response.json();
            res.json({ output: result.output });
        } else {
            const errorResult = await response.json();
            res.status(500).json({ error: errorResult.error });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});