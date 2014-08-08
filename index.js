var dot = require('dot');
var email = require('emailjs');

var mailer = {};

mailer.send = function () {};
mailer.addAccount = function (key, data) {};
mailer.setTemplate = function (key, data) {};
mailer.removeTemplate = function (key) {};

module.exports = mailer;
