'use strict';

const request_promise = require('request-promise');

exports.recaptcha_verify = function (req, res) {

    var options = {
        method: 'POST',
        uri: 'https://www.google.com/recaptcha/api/siteverify',
        form: {
            secret: '6LfPfVwUAAAAAFs896v-B4rzTILIYqhtSy_wjfbb',
            response: req.body.token
        },
        headers: {
            'content-type': 'application/x-www-form-urlencoded'
        }
    };

    request_promise(options)
        .then(function (body) {
            let obj = JSON.parse(body);
            return res.json({
                "response": obj.success
            })
        })
        .catch(function (err) {
            if (err) return res.json({
                "response": false,
                "value": err
            });
        });

};

