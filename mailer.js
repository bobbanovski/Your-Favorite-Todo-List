const nodemailer = require("nodemailer");

const transport = nodemailer.createTransport({
    service: 'Mailgun',
    auth: {
        user: 'postmaster@sandbox7c15bb3f259e45a090a98dbd0f1c2f39.mailgun.org',
        pass: '6dd2e3a5ae71062db54b158cf0b30c95',
    },
});

message = {
    from: 'SomeDude',
    to: 'robert.coleman1@uqconnect.edu.au', // comma separated list
    subject: 'Subject Line',
    text: 'Text contents.',
    html: '<b>Text contents.</b>'
  };

transport.sendMail(message, function(error, info){
    if (error) {
      console.log(error);
    } else {
      console.log('Sent: ' + info.response);
    }
  });
