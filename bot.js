const request = require('request');
const nodemailer = require('nodemailer');
const fs = require('fs');
require('dotenv').config();

const smtpTransport = nodemailer.createTransport({
    service: process.env.SERVICE,
    auth: {
        user: process.env.FROM_EMAIL,
        pass: process.env.FROM_EMAIL_PASSWORD
    }
});

const options = {
    uri: 'https://icanhazdadjoke.com/',
    method: 'GET',
    headers: {
        'Accept': 'text/plain'
    }
}

getJoke();
setInterval(getJoke, 3600000);

function getJoke(){
    request(options, function (error, response, body) {
        if(error) console.log('error:', error);
        else {
            var canSend = true;
            fs.readFileSync('sentjokes.txt').toString().split('\n').forEach(function(line){ 
                if(line==body){
                    canSend = false;
                }
            });
            if(canSend){
                sendText(body);
            }
        }
    });
}

function sendText(joke){
    var mailOptions = {
        from: process.env.FROM_EMAIL,
        to: process.env.TO_EMAIL,
        text: joke,
    }

    smtpTransport.sendMail(mailOptions, function(error, response){
        if(error){
            console.log(error);
        }else{
            console.log("Message sent.");
        }
    });

    fs.appendFile('sentjokes.txt',joke + "\n", function(){
        console.log('Wrote to file.');
    });
}