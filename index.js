'use strict';

const APOD = require('node-apod');
const apod = new APOD('WmtWE15aVRPb5XBcI7WEimtMyevbhKqNhJun8PgE');
const login = require("facebook-chat-api");
const config = require("./config/my.js");
const jerry326 = '100004062270676';//100000236577838;

// Create simple echo bot
login({
    email: config.user_email, 
    password: config.user_password
}, function callback (err, api) {
    if(err) return console.error(err);

    api.listen(function callback(err, message) {
        if (message.threadID === jerry326) {
            api.markAsRead(jerry326);
            handleCommand(api, message);
        }
    });
});

function handleCommand(api, msg) {
    switch (msg.body.toLowerCase()) {
        case 'apod':
            apod.get({ LANG: "zh_tw" }, function(err, data) {
                let res = {
                    url: data.url,
                    body: data.explanation
                }

                api.sendMessage(res, jerry326);          
            });
            break;
        default:
            api.sendMessage(msg.body, jerry326);            
            break;
    }
}