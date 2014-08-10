'use strict';

var doT = require('dot'),
	emailjs = require('emailjs');

var accounts = {},
	templates = {};

var isObject = function (obj) {
	if (typeof obj !== 'object' || obj === null) {
		return false;
	}
	return obj.length === undefined;
};

var getCompiled = function (template) {
	var fns = {},
		i;
	for (i in template) {
		fns[i] = doT.template( template[i] );
	}
	return fns;
};

var Template = function (template) {
	this.src = template;
	this.compiled = getCompiled( template );
};

Template.prototype.getMessage = function (data) {
	var msg = {},
		i;
	for (i in this.src) {
		msg[i] = this.compiled[i]( data );
	}
	return msg;
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
		template = templates[template];
	} else if (!isObject( template )) {
		return callback( 'invalid template' );
	} else {
		template = new Template( template );
	}
	data = data || {};
	var message = template.getMessage( data );

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

dotmail.removeTemplate = function (key) {
	delete templates[key];
};

module.exports = dotmail;
