const express = require('express');
const cors = require('cors');

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users').router;
const gateRouter = require('./routes/gate');

const app = express();

const corsOptions = {
    origin: true
};

app.use(express.json());
app.use(cors(corsOptions));

app.use('/', indexRouter);
app.use('/parkinglot', gateRouter);
app.use('/users', usersRouter);

app.listen(process.env.PORT || 3000, () => console.log('Listening for requests...'));

module.exports = app;
