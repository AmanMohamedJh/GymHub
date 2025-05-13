const nodemailer = require("nodemailer");

/**
 * Creates and returns a configured email transporter
 * @returns {Object} - Nodemailer transporter
 */
const createTransporter = async () => {
  // Create a transporter
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS, // This should be an App Password
    },
    tls: {
      rejectUnauthorized: false, // Allow self-signed certificates
    },
  });

  // Verify connection configuration
  await new Promise((resolve, reject) => {
    transporter.verify(function (error, success) {
      if (error) {
        console.log("Transporter verification error:", error);
        reject(error);
      } else {
        console.log("Server is ready to take our messages");
        resolve(success);
      }
    });
  });

  return transporter;
};

/**
 * Sends a reply email to a contact message sender
 * @param {Object} messageData - Contact message data
 * @param {String} reply - Reply content
 * @returns {Promise} - Email sending result
 */
const sendReplyEmail = async (messageData, reply) => {
  try {
    const transporter = await createTransporter();

    const mailOptions = {
      from: `"GYMHUB Support" <${process.env.EMAIL_USER}>`,
      to: messageData.email,
      subject: `Re: ${messageData.subject || "Your Contact Request"}`,
      text: `
Dear ${messageData.name},

Thank you for contacting us. Here is our response to your inquiry:

${reply}

Original Message:
${messageData.message}

Best regards,
GYMHUB Support Team
This email was sent from GYMHUB itself.
    `,
      html: `
<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
  <h2 style="color: #1a1a1a;">Hello ${messageData.name},</h2>
  
  <p>Thank you for contacting us. Here is our response to your inquiry:</p>
  
  <div style="background-color: #f5f5f5; padding: 15px; border-radius: 5px; margin: 20px 0;">
    <p>${reply.replace(/\n/g, "<br>")}</p>
  </div>
  
  <div style="margin-top: 30px; padding-top: 15px; border-top: 1px solid #eaeaea;">
    <h3>Your Original Message:</h3>
    <p style="color: #555;">${messageData.message.replace(/\n/g, "<br>")}</p>
  </div>
  
  <div style="margin-top: 30px; color: #666; font-size: 14px;">
    <p>Best regards,<br>GYMHUB Support Team</p>
    <p style="font-size: 12px; color: #888;">This email was sent from GYMHUB itself.</p>
  </div>
</div>
    `,
    };

    // Send the email and return the result
    const result = await transporter.sendMail(mailOptions);
    console.log("Email sent successfully:", result);
    return result;
  } catch (error) {
    console.error("Error sending email:", error);
    throw error; // Re-throw the error so the calling function can handle it
  }
};

module.exports = {
  createTransporter,
  sendReplyEmail,
};
