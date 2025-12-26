import nodemailer from 'nodemailer';
// import path from 'path';
// import { fileURLToPath } from 'url';
// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);
export class EmailService {
    transporter;
    constructor() {
        this.transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            }
        });
    }
    async sendMagicLink(email, token, name) {
        const magicLink = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/verify-magic?token=${token}`;
        let html = `
      <!DOCTYPE html>
      <html>
      <head>
          <style>
              body { font-family: Arial, sans-serif; line-height: 1.6; }
              .container { max-width: 600px; margin: 0 auto; padding: 20px; }
              .button { 
                  display: inline-block; 
                  padding: 12px 24px; 
                  background-color: #4CAF50; 
                  color: white; 
                  text-decoration: none; 
                  border-radius: 5px; 
                  margin: 20px 0; 
              }
              .footer { margin-top: 30px; font-size: 12px; color: #666; }
          </style>
      </head>
      <body>
          <div class="container">
              <h2>Hi ${name || 'there'}! 👋</h2>
              <p>You requested a magic link to login to our app.</p>
              <p>Click the button below to login instantly (no password needed!):</p>
              
              <a href="${magicLink}" class="button">✨ Click to Login ✨</a>
              
              <p>Or copy and paste this link in your browser:</p>
              <p style="word-break: break-all; color: #666;">
                  ${magicLink}
              </p>
              
              <p><strong>⚠️ This link expires in 15 minutes!</strong></p>
              
              <p>If you didn't request this, please ignore this email.</p>
              
              <div class="footer">
                  <p>Best regards,<br>Your App Team</p>
              </div>
          </div>
      </body>
      </html>
    `;
        const mailOptions = {
            from: `"Your App" <${process.env.EMAIL_USER}>`,
            to: email,
            subject: 'Your Magic Login Link 🔗',
            html: html,
            text: `Click this link to login: ${magicLink}\nThis link expires in 15 minutes.`
        };
        try {
            await this.transporter.sendMail(mailOptions);
            console.log(`✅ Magic link sent to ${email}`);
            return true;
        }
        catch (error) {
            console.error('❌ Email sending failed:', error);
            return false;
        }
    }
}
//# sourceMappingURL=email.service.js.map