require('dotenv').config();
const functions = require("firebase-functions");
const express = require('express');
const bodyParser = require('body-parser');
const ejs = require('ejs');
const cookieParser = require('cookie-parser');
const cors = require('cors')({origin: true});
const userRoutes = require('./routes/userRoutes');
const publicRoutes = require('./routes/publicRoutes');
const app = express();

app.use(cookieParser());
app.use(cors);
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

app.use('/hub', userRoutes);
app.use('/', publicRoutes);
app.use(function (req, res, next) {
  res.status(404).render('404.ejs')
});

exports.app = functions.https.onRequest(app);

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//

