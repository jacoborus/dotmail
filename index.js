'use strict';
var dot = require('dot'),
	email = require('emailjs');


var isObject = function (obj) {
	if (typeof obj !== 'object' || obj === null) {
		return false;
	}
	if (obj.length === undefined) {
		return true;
	}
	return false;
};

var accounts = {},
	templates = {};

var mailer = {};

mailer.send = function (account, email, data, callback) {
	if (!account || typeof account !== 'string' || !accounts[account]) {
		return callback( 'invalid account' );
	}
	if (!email) {
		return callback( 'invalid email/template' );
	}
	if (typeof email === 'string') {
		email = templates[email];
	} else if (!isObject( email )) {
		return callback( 'invalid email/template' );
	}
	if (typeof data === 'function') {
		callback = data;
	}
};

mailer.addAccount = function (key, data) {
	accounts[key] = data;
};

mailer.setTemplate = function (key, template) {
	templates[key] = template;
};

mailer.getTemplate = function (key) {
	return templates[key];
};

mailer.removeTemplate = function (key) {
	delete templates[key];
};

module.exports = mailer;
