const express = require('express');
const { add, info } = require('winston');
const cors = require('cors');
const errorsMiddleware = require('./middleware/errorsMiddleware');
const logger = require('./logger/index');
const sendEmail = require('./email/sendEmail');

add(logger);

const apiPort = process.env.PORT || 9090;
const app = express();

app.use(cors());
app.use(express.json());


app.post('/api/message', sendEmail)
app.get('/*', (req, res) => {
    res.status(200).send("hello");
});

app.use(errorsMiddleware);

app.listen(apiPort, () => info(`server running on port ${apiPort}`));