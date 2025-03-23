import nodemailer from "nodemailer";

// Create a transporter
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "shreyasjakati66@gmail.com", // Your email
    pass: "qtzp szjd ymwj yyrj", // Your app-specific password (not your actual password)
  },
});

export const sendMail = async (from: any, to: any, subject: any, text: any) => {
  // Mail options

  console.log(typeof text);
  return new Promise((resolve, reject) => {
    const mailOptions = {
      from: from,
      to: to, // Receiver's email
      subject: subject,
      text: text,
    };

    // Send the email
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log("Error:", error);
        reject(error);
      } else {
        console.log("Email sent:", info.response);
        resolve(info.response);
      }
    });
  });
};
