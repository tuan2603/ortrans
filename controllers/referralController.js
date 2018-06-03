'use strict';

var mongoose = require('mongoose'),
    Referral = mongoose.model('Referrals');

exports.list_all_referral = function (req, res) {
    Referral.find({}, function(err, task) {
        if (err)
            res.send(err);
        res.json(task);
    });
};

exports.create_a_referral = function(req, res) {
    var new_task = new Referral(req.body);
    new_task.save(function(err, task) {
        if (err)
            res.send(err);
        res.json(task);
    });
};
