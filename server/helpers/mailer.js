const nodemailer = require('nodemailer');

const transport = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.SERVER_GMAIL,
    pass: process.env.SERVER_PASS
  },
  tls: {
    rejectUnauthorized: false
  }
});

module.exports = {
  sendVerifyEmail(clientEmail, title, code) {
    let mailOptions = {
      from: {
        "address": process.env.SERVER_GMAIL,
        "name": process.env.SERVER_NAME
      },
      to: clientEmail,
      subject: title,
      text: '',
      html: '<h1><img src="https://raw.githubusercontent.com/luclegen/lmaci/master/client/src/assets/img/logo/lmaci-logo-64.png" alt="Lmaci Logo"> Lmaci</h1><hr><h1>' + title + '</h1><p>Verification Code: ' + code + '</p>'
    }

    transport.sendMail(mailOptions, (err, info) => {
      if (err) console.log(err);
      else console.log('Email sent: ' + info.response);
    });
  }
}