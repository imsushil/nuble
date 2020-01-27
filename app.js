const http = require('http');
const express = require('express');
const path = require('path');

const app = new express();

const port = 3000; // local port

app.use('/assets', express.static('assets'));

app.get('/', function(request, response){
    response.sendFile(path.join(__dirname + '/game.html'));
});

app.listen(process.env.PORT || 8080, () => {
	console.log(`Server is running at http://localhost:${process.env.PORT}`);
});