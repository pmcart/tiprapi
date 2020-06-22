const serverless = require('serverless-http');
const express = require('express')
const app = express()
const stripe = require('stripe')('sk_test_PLN6M3i5EThfg0ETvrpOosLw00D8oBCVBv');

// const accountLinks = await stripe.accountLinks.create({
//   account: 'acct_1032D82eZvKYlo2C',
//   failure_url: 'https://example.com/failure',
//   success_url: 'https://example.com/success',
//   type: 'custom_account_verification',
//   collect: 'eventually_due',
// });
app.set('trust proxy', 'loopback');
app.get('/', function (req, res) {

var clientIp = req.headers['x-forwarded-for'] || req.connection.remoteAddress;

if(clientIp.includes(',')){
  let clientIps = clientIp.split(',');
  clientIp = clientIps[0]
}

stripe.accounts.create(
    {
      type: 'custom',
      country: 'IE',
      email: 'pat.test2@example.com',
      requested_capabilities: [
        'card_payments',
        'transfers',
      ],
      business_type: 'individual',
      tos_acceptance: {
        date: Math.floor(Date.now() / 1000),
        ip: clientIp // Assumes you're not using a proxy
      },
    },
    function(err, account) {
      // asynchronously called
      if(err){
        console.log(err)
        console.log(err.toString())
      }

      if(account){
        console.log(account)
        console.log(account.toString())
      }

      res.send(clientIp)
    }
  );
})

module.exports.handler = serverless(app);