const sgMail = require("@sendgrid/mail");

const sendVerificationEmail = async (
  userName,
  userEmail,
  verificationToken
) => {
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);

  const origin = "http://localhost:5000";

  const url = `${origin}/api/v1/auth/verifyEmail?verificationToken=${verificationToken}&email=${userEmail}`;

  const html = `Hello, ${userName}<br/>
    Please verify your email by clicking <a href="${url}">here</a>
    `;

  const msg = {
    to: userEmail,
    from: "metusharjain@gmail.com",
    subject: "Verify Email - MealApp",
    text: "Verify Email",
    html,
  };

  await sgMail.send(msg);
};

module.exports = sendVerificationEmail;
