const users = require('./routes/users');
const home = require('./routes/home')
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

// Connect to mongoDB.
mongoose.connect(process.env.DB_CONNECT)
    .then(() => console.log('connected to mongoDB...'))
    .catch(err => console.error('Could not connect to database', err));

app.use(express.json());
app.use(express.static('front'));

app.use('/api/users', users);
app.use('/', home);

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening port ${port}...`));
