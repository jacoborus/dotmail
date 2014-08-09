'use strict';
var doT = require('dot'),
	emailjs = require('emailjs');

var accounts = {},
	templates = {};

var isObject = function (obj) {
	if (typeof obj !== 'object' || obj === null) {
		return false;
	}
	if (obj.length === undefined) {
		return true;
	}
	return false;
};

var getCompiled = function (template) {
	var compiled = {},
		i;
	for (i in template) {
		compiled[i] = doT.template( template[i] );
	}
	return compiled;
};

var Template = function (template) {
	var self = this;
	this.src = template;
	this.compiled = getCompiled( template );
	this.getMessage = function (data) {
		var msg = {},
			i;
		for (i in template) {
			msg[i] = self.compiled[i]( data );
		}
		return msg;
	};
};


var dotmail = {};

/**
 * Send email
 * @param  {String}   account  account key
 * @param  {String|Object}   template template key or template object
 * @param  {Object}   data     data for template rendering
 * @param  {Function} callback Signature: err, message
 */
dotmail.send = function (account, template, data, callback) {
	callback = callback || function () {};
	if (!account || typeof account !== 'string' || !accounts[account]) {
		return callback( 'invalid account' );
	}
	account = accounts[account];
	if (!template) {
		return callback( 'invalid template' );
	}
	if (typeof template === 'string') {
		template = templates[template].getMessage;
	} else if (!isObject( template )) {
		return callback( 'invalid template' );
	} else {
		template = new Template( template ).getMessage;
	}
	data = data || {};
	var message = template( data );

	account.server.send( message, callback );
};

/**
 * Add an email account and connect it to its SMTP server
 * @param {String} key  keyname
 * @param {Object} data account credentials
 */
dotmail.addAccount = function (key, data) {
	accounts[key] = {
		src: data,
		server: emailjs.server.connect( data )
	};
};

dotmail.addTemplate = function (key, template) {
	templates[key] = new Template( template );
};

dotmail.getTemplate = function (key) {
	return templates[key].src;
};

dotmail.removeTemplate = function (key) {
	delete templates[key];
};

module.exports = dotmail;
