require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const ejs = require('ejs');
const cookieParser = require('cookie-parser')
const userRoutes = require('./routes/userRoutes')
const publicRoutes = require('./routes/publicRoutes')
const app = express();

app.set('view engine', 'ejs');
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

app.use('/hub', userRoutes)
app.use('/', publicRoutes)

// localhost:3000
app.listen(3000, () => {
  console.log('Now listening on port 3000');
});
