dotmail
=======

Send emails with doT templates. Works with SMTP


Installation
------------

```sh
npm install dotmail
```

Example:
--------


```js
var dotmail = require('./index.js');

var account = {
    user: 'username@domain.com',
    password: 'PA55W0RD',
    host: 'smtp.your-email.com',
    ssl: true
};

var template = {
	text:    "You have {{=it.messages.length}} messages",
	from:    "{{=it.appname}}",
	to:      "{{=it.username}} <{{=it.email}}>",
	subject: "testing emailjs"
};

var data = {
	username: 'Neo',
	email: 'dotmail@domain.com',
	appname: 'dotmail co.',
	messages: [
		'New features next month',
		'Download from npm'
	]
};

dotmail.addTemplate('weekly', template );

dotmail.addAccount( 'main', account );

dotmail.send( 'main', 'weekly', data, function (err, msg) {
	console.log( err || msg );
});
```

<br><br>

---

© 2014 Jacobo Tabernero - [jacoborus](https://github.com/jacoborus)

Released under [MIT License](https://raw.github.com/jacoborus/wiretree/master/LICENSE)
