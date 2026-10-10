import nodemailer from 'nodemailer';

interface MailOptions {
  to: string;
  subject: string;
  text: string;
  html: string;
}

async function sendEmail(options: MailOptions) {
  // Configuration using Beget SMTP
  // These should be moved to environment variables for security
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.beget.com',
    port: parseInt(process.env.SMTP_PORT || '465'),
    secure: true, // true for 465, false for other ports
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  try {
    await transporter.sendMail(options);
    console.log(`📧 Email sent successfully to ${options.to}`);
  } catch (error) {
    console.error('❌ Error sending email:', error);
    throw new Error('Failed to send email');
  }
}

export async function sendWelcomePasswordEmail(email: string, password: string) {
  const subject = 'Your Troffi Services Account Password';
  const text = `Welcome to Troffi Services! Your generated password is: ${password}`;
  const html = `
    <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
      <h2>Welcome to Troffi Services</h2>
      <p>Hello,</p>
      <p>Your account has been created. Use the following password to log in:</p>
      <div style="background: #f4f4f4; padding: 15px; font-family: monospace; font-size: 18px; font-weight: bold; text-align: center; border: 1px solid #ddd; border-radius: 5px; margin: 20px 0;">
        ${password}
      </div>
      <p>If you didn't request this, please ignore this email.</p>
      <p>Best regards,<br>Troffi Admin</p>
    </div>
  `;

  await sendEmail({
    to: email,
    subject,
    text,
    html,
  });
}
