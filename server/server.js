const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 5000;
const calculateRoute = require("./routes/calculateRoute");

app.use(cors())
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/api', calculateRoute);
app.listen(port, () => console.log(`Listening on port ${port}`));

module.exports = app