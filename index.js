'use strict';

const APOD = require('node-apod');
const apod = new APOD('WmtWE15aVRPb5XBcI7WEimtMyevbhKqNhJun8PgE');
const randomInt = require('random-int');
const schedule = require('node-schedule');
const login = require("facebook-chat-api");
const config = require("./config/my.js");

let apiCache;

login({
    email: config.user_email,
    password: config.user_password
}, function (err, api) {
    if (err) return console.error(err);
    apiCache = api;

    api.listen(function (err, message) {
        if (!message.body) return;
        if (~config.special_user_id.indexOf(message.threadID)) {
            api.markAsRead(message.threadID);
            handleCommand(message);
        } else {
            api.markAsRead(message.threadID);
            let end = api.sendTypingIndicator(message.threadID, function(err) {
                if (err) console.error(err);
            });
            setTimeout(function() {
                end();
                api.sendMessage(config.dummy_msg[randomInt(config.dummy_msg.length - 1)], message.threadID);
            }, randomInt(10000));
        }
    });
});

function handleCommand(msg) {
    if (!apiCache) return;

    switch (msg.body.toLowerCase()) {
        case '?':
            apiCache.sendMessage(
                "可用指令:\n" +
                "@apod - 今日 APOD\n" +
                "@reminder - 備忘錄", msg.threadID);
            break;

        case '@apod':
            apod.get({ LANG: "zh_tw" }, function (err, data) {
                if (err) {
                    apiCache.sendMessage('Chinese APOD not publish yet.', msg.threadID);
                }

                let res = {
                    url: data.url,
                    body: data.explanation
                };

                apiCache.sendMessage(res, msg.threadID);
            });
            break;

        case '@reminder':
            apiCache.sendMessage('記得給許書軒 "20110616 月全食" 的照片。', msg.threadID);
            break;

        default:
            apiCache.sendMessage('Hi!', msg.threadID);
            break;
    }
}

const j = schedule.scheduleJob('0 30 0 * * *', function () {
    handleCommand({
        body: '@reminder',
        threadID: config.special_user_id[1]
    });
});
