const serverless = require('serverless-http');
const express = require('express')
const app = express()
const stripe = require('stripe')('sk_test_PLN6M3i5EThfg0ETvrpOosLw00D8oBCVBv');
const bodyParser = require('body-parser');
const cors = require('cors')
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

// const accountLinks = await stripe.accountLinks.create({
//   account: 'acct_1032D82eZvKYlo2C',
//   failure_url: 'https://example.com/failure',
//   success_url: 'https://example.com/success',
//   type: 'custom_account_verification',
//   collect: 'eventually_due',
// });
app.set('trust proxy', 'loopback');

const connectToDatabase = require('./db') // initialize connection

// simple Error constructor for handling HTTP error codes
function HTTPError(statusCode, message) {
    const error = new Error(message)
    error.statusCode = statusCode
    return error
}

router.post('/signup', (req, res) => {

    const name = req.body.name;
    const email = req.body.email;
    console.log(req.body);
    const password = bcrypt.hashSync(req.body.password);

    createUser([name, email, password], (err) => {
        if (err) return res.status(500).send("Server error!");
        findUserByEmail(email, (err, user) => {
            if (err) return res.status(500).send('Server error!');
            const expiresIn = 24 * 60 * 60;
            const accessToken = jwt.sign({ id: user.id }, SECRET_KEY, {
                expiresIn: expiresIn
            });
            res.status(200).send({
                "user": user,
                "access_token": accessToken,
                "expires_in": expiresIn
            });
        });
    });
});

module.exports.handler = serverless(app);