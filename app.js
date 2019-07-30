const express = require('express');
const bodyParser = require('body-parser');
const PORT = 3000;
const app = express();

app.use(bodyParser.json());
app.listen(PORT, () => {
	console.log('The server is listening to port ' + PORT);
});
