const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const router = require('../routes/Routes');


const app = express();
const port = process.env.PORT || 3030;

app.use(cors());
app.use(bodyParser.json());
app.use('/', router);

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});