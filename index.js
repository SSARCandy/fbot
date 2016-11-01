'use strict';

const APOD = require('node-apod');
const apod = new APOD('WmtWE15aVRPb5XBcI7WEimtMyevbhKqNhJun8PgE');
const schedule = require('node-schedule');
const login = require("facebook-chat-api");
const config = require("./config/my.js");
const jerry326 = '100002288107594';
// const jerry326 = '100000236577838';

let apiCache;

login({
    email: config.user_email,
    password: config.user_password
}, function (err, api) {
    if (err) return console.error(err);
    apiCache = api;

    api.listen(function (err, message) {
        if (!message.body) return;
        if (message.threadID === jerry326) {
            api.markAsRead(jerry326);
            handleCommand(message.body);
        }
    });
});

function handleCommand(msg) {
    if (!apiCache) return;

    switch (msg.toLowerCase()) {
        case '@apod':
            apod.get({ LANG: "zh_tw" }, function (err, data) {
                let res = {
                    url: data.url,
                    body: data.explanation
                };

                apiCache.sendMessage(res, jerry326);
            });
            break;
        case '@reminder':
            apiCache.sendMessage('記得給許書軒 "20110616 月全食" 的照片。', jerry326);            
            break;
        default:
            break;
    }
}

const j = schedule.scheduleJob('0 0 0 * * *', function(){
    handleCommand('@reminder');
});
