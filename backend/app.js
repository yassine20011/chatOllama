const express = require('express')
const cors = require('cors');

const app = express();
const port = 3000;

const whitelist = ['http://localhost:3000'];


app.use(cors({
    origin: (origin, callback) => {
        if (whitelist.indexOf(origin) !== -1) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
}));

const users = [
    { id: 1, name: 'Alice' },
    { id: 2, name: 'Bob' },
    { id: 3, name: 'Charlie' },
];

app.get('/users', (req, res) => {
    res.send(users);
});

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
});