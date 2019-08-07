"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var nodemailer = __importStar(require("nodemailer"));
var configs_1 = __importDefault(require("./configs"));
var Mail = /** @class */ (function () {
    function Mail(to, subject, message) {
        this.to = to;
        this.subject = subject;
        this.message = message;
    }
    Mail.prototype.sendMail = function (callback) {
        /* const transporter = nodemailer.createTransport({
          auth: {
            pass: '--------',
            user: 'elcal.lico@gmail.com',
          },
          service: 'gmail',
        }); */
        var transporter = nodemailer.createTransport({
            name: 'localhost',
            port: configs_1.default.port,
        });
        var mailOptions = {
            from: 'godoy@archrog.localdomain',
            subject: this.subject,
            text: this.message,
            to: this.to,
        };
        console.log(mailOptions);
        transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
                console.log('error: ', error);
                return error;
            }
            else {
                console.log('E-mail sent successfully!' + info.response);
            }
            if (callback) {
                callback();
            }
        });
    };
    return Mail;
}());
exports.default = new Mail();
