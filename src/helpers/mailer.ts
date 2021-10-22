import accessEnv from "./accessEnv";
import kue from "kue";
import path from "path";
import fs from "fs";
import handlebars from "handlebars";
import * as nodemailer from "nodemailer";
import logger from "../logger";

class Mailer {
  private GMAIL_USERNAME = accessEnv("GMAIL_USERNAME", "")
  private GMAIL_PASSWORD = accessEnv("GMAIL_PASSWORD", "")
  private MAIL_HOST = accessEnv("MAIL_HOST", "")
  private MAIL_SERVICE = accessEnv("MAIL_SERVICE", "")
  private MAIL_PORT = accessEnv("MAIL_PORT", "")
  private FROM_EMAIL = accessEnv("FROM_EMAIL", "")
  private FROM_NAME = accessEnv("FROM_NAME", "")

  private transporter = nodemailer.createTransport({
    host: this.MAIL_HOST,
    service: this.MAIL_SERVICE,
    port: this.MAIL_PORT,
    secure: true,
    auth: {
      user: this.GMAIL_USERNAME,
      pass: this.GMAIL_PASSWORD
    }
  });

  private queue = kue.createQueue(
    /* {
      redis: accessEnv("REDIS_URL", "")
    } */
  );


  async sendMail(type: string, templateName: string) {
    let self = this
    const filePath = path.join(__dirname, `../../email-templates/${templateName}.hbs`);
    const source = fs.readFileSync(filePath, 'utf-8').toString();
    const emailTemplate = handlebars.compile(source);
    try {
      self.queue.process(type, function (job: any, done: any) {
        const emailData: any = job.data
        emailData.year =  new Date().getFullYear()
        const htmlToSend = emailTemplate(emailData);
        const message = {
          from: `${self.FROM_NAME} <${self.FROM_EMAIL}>`,
          to: emailData.email,
          subject: emailData.subject,
          html: htmlToSend
        };
        self.transporter.sendMail(message);
        logger.log({
          level: 'verbose',
          message: `${emailData.subject} Mail Sent`,
        })
        done()
      })
    } catch (e) {
      throw e
    }
  }

}
export default new Mailer();