const bodyParser = require('body-parser');
const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config()


const app = express()

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())


const port = process.env.PORT;
const user = process.env.USER_MONG;
const password = process.env.PASSWORD_MONG;
const database = process.env.DATABASE_MONG;


const url = `mongodb+srv://${user}:${password}@cluster0.qig5qhd.mongodb.net/${database}?retryWrites=true&w=majority`;

mongoose.connect(url)
    .then(() => console.log('Database Connected'))
    .catch(e => console.log(e))

// import routes
const authRoutes = require('./routes/auth');
const admin = require('./routes/admin');
const validateToken= require('./routes/validate-token');

// Routes middlewares
app.use('/api/user',authRoutes)
app.use('/api/admin',validateToken,admin)

    app.listen(port, () => {
        console.log('listening your requests...', port)
    })