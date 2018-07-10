const express = require('express');
const bodyParser = require('body-parser');
const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const server = app.listen(process.env.PORT || 5000, () => {
  console.log('Express server listening on port %d in %s mode', server.address().port, app.settings.env);
});


/* For Facebook Validation */
app.get('/webhook', (req, res) => {
    if (req.query['hub.mode'] && req.query['hub.verify_token'] === 'tuxedo_cat') {
      res.status(200).send(req.query['hub.challenge']);
    } else {
      res.status(403).end();
    }
  });
  
  /* Handling all messenges */
  app.post('/webhook', (req, res) => {
    console.log(req.body.entry[0].messaging[0].message.text);
    console.log(req.body);

    if (req.body.object === 'page') {
      req.body.entry.forEach((entry) => {
        entry.messaging.forEach((event) => {
          if (event.message && event.message.text) {
            sendMessage(event);
          }
        });
      });
      res.status(200).end();
    }
  });



const request = require('request');
const apiaiApp = require('apiai')('20076697515940c2ab6e56f1045000ca');

function sendMessage(event) {
  let sender = event.sender.id;
  let text = event.message.text;


  let apiai = apiaiApp.textRequest(text, {
    sessionId: 'tabby_cat' // use any arbitrary id
  });

  apiai.on('response', (response) => {
    let aiText = response.result.fulfillment.speech;
  
      request({
        url: 'https://graph.facebook.com/v2.6/me/messages',
        qs: {access_token: 'EAAcltZBvZBulcBAChfrzdD2Bw0FJbzEvY8V4FjY20gWJNlsaVO26bmIVXRS1xqv26ZA68JQCNJiZC6yrnkuvBWXP27ZCwc4q53WrPClMsu1P4VF6RHnXzZBESM1IiGq4OZADQNXa6wYa9QaHPXMRNwa0g8aWn7Ll9BPI7tBm4NEKgZDZD'},
        method: 'POST',
        json: {
          recipient: {id: sender},
          message: {text: aiText}
        }
      }, (error, response) => {
        if (error) {
            console.log('Error sending message: ', error);
        } else if (response.body.error) {
            console.log('Error: ', response.body.error);
        }
      });
   });

  apiai.on('error', (error) => {
    console.log(error);
  });

  apiai.end();
}