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

var getCompiled = function (obj) {
	var fns = {},
		i;

	for (i in obj) {
		fns[i] = doT.template( obj[i] );
	}
	return fns;
};

var Template = function (template) {
	this.attachment = template.attachments || [];
	delete template.attachment;
	this.src = template;
	this.compiled = getCompiled( this.src );
};

Template.prototype.render = function (data) {
	var msg = {},
		obj, i, j;
	for (i in this.src) {
		msg[i] = this.compiled[i]( data );
	}
	msg.attachment = this.attachment;

	if (msg.html) {
		msg.attachment.push({
			data: msg.html,
			alternative: true
		});
		delete msg.html;
	}
	for (i in data.attachments) {
		msg.attachment.push( data.attachments[i] );
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
	var message = template.render( data );

	//console.log( message );
	//callback('finished');
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

/**
 * Add or overwrite a mail template object with doT.js templates
 * @param {String} key      template keyname
 * @param {Object} template mail template
 */
dotmail.addTemplate = function (key, template) {
	templates[key] = {};
	templates[key] = new Template( template );
};

module.exports = dotmail;
