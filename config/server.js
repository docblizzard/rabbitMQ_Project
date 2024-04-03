const express = require('express');
const bodyParser = require('body-parser');
const router = require('../routes/messageRoutes');

const app = express();
const port = process.env.PORT || 3030;

app.use(bodyParser.json());
app.use('/', router);

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});