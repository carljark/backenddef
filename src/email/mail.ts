import * as nodemailer from 'nodemailer';
import smtpTransport from 'nodemailer-smtp-transport';
import configmail from './configs';

class Mail {

  constructor(
    public to?: string,
    public subject?: string,
    public message?: string,
  ) {}

  public sendMail(callback?: () => string) {

    /* const transporter = nodemailer.createTransport({
      auth: {
        pass: '--------',
        user: 'elcal.lico@gmail.com',
      },
      service: 'gmail',
    }); */

    const transporter = nodemailer.createTransport({
      name: 'localhost',
      port: configmail.port,
    });

    const mailOptions = {
      from: 'godoy@archrog.localdomain',
      subject: this.subject,
      text: this.message,
      to: this.to,
      // html: this.message,
    };

    console.log(mailOptions);

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log('error: ', error);
        return error;
      } else {
        console.log('E-mail sent successfully!' + info.response);
      }
      if (callback) {
        callback();
      }
    });
  }
}

export default new Mail();
