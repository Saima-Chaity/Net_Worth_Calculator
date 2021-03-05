const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 5000;
const calculateRoute = require("./routes/calculateRoute");
const conversionRoute = require("./routes/conversionRoute");

app.use(cors())
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', function(req, res) {
	res.send({"json": "test route"})
});

app.use('/api', calculateRoute);
app.use('/api/currencyconversion', conversionRoute);

app.listen(port, () => console.log(`Listening on port ${port}`));