const express = require('express');
const path = require('path');

const app = express();
const PORT = 3000;

app.use(express.static('public'));

app.use(express.urlencoded({
    extended: true
}));

app.get('/', (req,res) => {
    res.sendFile(__dirname + '/public/html/index.html');
})

app.get('/softskills', (req,res) => {
    res.sendFile(__dirname + '/public/html/skills.html');
})

app.get('/aboutus', (req,res) => {
    res.sendFile(__dirname + '/public/html/aboutus.html');
})

app.get('/contact', (req,res) => {
    res.sendFile(__dirname + '/public/html/contact.html');
})

app.post('/form_submit', (req,res) => {
    const username = req.body.username;
    const password = req.body.password;
    res.end(`Your Username is: ${username} and your Password is: ${password}`);
})

app.listen(PORT, () => {
    console.log(`Listening to requests on http://localhost:${PORT}`);
})