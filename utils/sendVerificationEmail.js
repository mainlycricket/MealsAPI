const sgMail = require("@sendgrid/mail");

const sendVerificationEmail = async (
  userName,
  userEmail,
  verificationToken
) => {
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);

  const origin = "http://localhost:5000";

  // const origin = "https://meals-api-express.herokuapp.com";

  const url = `${origin}/api/v1/auth/verifyEmail?verificationToken=${verificationToken}&email=${userEmail}`;

  const html = `Hello, ${userName}<br/>
    Please verify your email by clicking <a href="${url}">here</a>
    `;

  const msg = {
    to: userEmail,
    from: process.env.EMAIL_SENDER,
    subject: "Verify Email - MealApp",
    text: `${html} <br/>
    If this link doesn't work, please paste this link ${url} in a new browser tab.`,
    html,
  };

  await sgMail.send(msg);
};

const sendResetPasswordEmail = async (userName, userEmail, passwordToken) => {
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);

  const origin = "http://localhost:5000";

  // const origin = "https://meals-api-express.herokuapp.com";

  const url = `${origin}/api/v1/auth/resetPassword?passwordToken=${passwordToken}&email=${userEmail}`;

  const html = `Hello, ${userName}<br/>
    Please reset your password by clicking <a href="${url}">here</a><br/>
    <b>Note: This link is valid up to 15 minutes only.</b>
    `;

  const msg = {
    to: userEmail,
    from: process.env.EMAIL_SENDER,
    subject: "Reset Password - MealApp",
    text: `${html} <br/>
    If the link doesn't work, please paste this link ${url} in a new browser tab.`,
    html,
  };

  await sgMail.send(msg);
};

module.exports = { sendVerificationEmail, sendResetPasswordEmail };
