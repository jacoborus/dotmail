dotmail
=======

Send emails with templates.

Template engine: **[doT.js](https://github.com/olado/doT)**

Email driver: **[emailjs](https://github.com/eleith/emailjs#emailserverconnectoptions)**


Installation
------------

```sh
npm install dotmail
```



Example:
--------

```js
var dotmail = require('dotmail');

var account = {
    user: 'username@domain.com',
    password: 'PA55W0RD',
    host: 'smtp.your-email.com',
    ssl: true
};

// add an email account and connect it to its SMTP server
dotmail.addAccount( 'main', account );


// you can write doT templates in template fields
var template = {
    from:    "{{=it.appname}}",
    to:      "{{=it.username}} <{{=it.email}}>",
    subject: "testing emailjs",
    html:    "<html>You have <strong>{{=it.messages.length}} messages</strong></html>",
    text:    "You have {{=it.messages.length}} messages"
};

// add an email template with its key
dotmail.addTemplate('weekly', template );


// data to render the template
var data = {
    username: 'Neo',
    email: 'dotmail@domain.com',
    appname: 'dotmail co.',
    messages: [
        'New features next month',
        'Download from npm'
    ],
    attachments: [ // attachments don't use templates
      {path:"path/to/file.zip", type:"application/zip", name:"renamed.zip"}
   ]
};

dotmail.send( 'main', 'weekly', data, function (err, msg) {
    console.log( err || msg );
});
```



API
---

### dotmail.addAccount( key, account)

Add an email account and connect it to its SMTP server

- **`key`** *String*: account  keyname
- **`data`** *Object*: data account credentials


### dotmail.addTemplate( key, template )

Add or overwrite a mail template object with doT.js templates

- **`key`** *String*: template keyname
- **`template`** *Object*: mail template


### dotmail.send( account, template, data, callback )

Send email

Parameters:

- **`account`** *String*: account keyname
- **`template`** *String||Object*: template keyname or template object
- **`data`** *Object*: data for template rendering
- **`callback`** *Function*: Callback function. Signature: err, message


Email server connection options
-------------------------------

[Same as **emailjs**](https://github.com/eleith/emailjs#emailserverconnectoptions).


Message and attachments options
-------------------------------

Same as **emailjs**:

**Message:**

```
// headers is an object ('from' and 'to' are required)
// returns a Message object

// you can actually pass more message headers than listed, the below are just the
// most common ones you would want to use

headers =
{
    text        // text of the email
    from        // sender of the format (address or name <address> or "name" <address>)
    to          // recipients (same format as above), multiple recipients are separated by a comma
    cc          // carbon copied recipients (same format as above)
    bcc     // blind carbon copied recipients (same format as above)
    subject // string subject of the email
  attachment // one attachment or array of attachments
}
```

**Attachments**

```
// can be called multiple times, each adding a new attachment
// options is an object with the following possible keys:

options =
{
    // one of these fields is required
    path      // string to where the file is located
    data      // string of the data you want to attach
    stream    // binary stream that will provide attachment data (make sure it is in the paused state)
              // better performance for binary streams is achieved if buffer.length % (76*6) == 0
              // current max size of buffer must be no larger than Message.BUFFERSIZE

    // optionally these fields are also accepted
    type          // string of the file mime type
    name        // name to give the file as perceived by the recipient
    alternative // if true, will be attached inline as an alternative (also defaults type='text/html')
    inline      // if true, will be attached inline
    encoded     // set this to true if the data is already base64 encoded, (avoid this if possible)
    headers     // object containing header=>value pairs for inclusion in this attachment's header
    related     // an array of attachments that you want to be related to the parent attachment
}
```

<br><br>

---

© 2014 Jacobo Tabernero - [jacoborus](https://github.com/jacoborus)

Released under [MIT License](https://raw.github.com/jacoborus/wiretree/master/LICENSE)
