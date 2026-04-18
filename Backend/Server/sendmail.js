const nodemailer = require("nodemailer");

const sendOrderMail = async (email, orderId, total) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "thanvidinesh890@gmail.com",
        pass: "ufaowiintlcwbmfq"
      },
    });

    const info = await transporter.sendMail({
      from: '"Croma UK" <thanvidinesh890@gmail.com>',
      to: email,
      subject: "Your Order Confirmed",
      html: `
        <div>
          <h2>Order from Croma UK</h2>
          <p>Delivery in 3-5 days</p>
          <p>Order ID: ${orderId}</p>
          <p>Total: ₹${total}</p>
        </div>
      `,
    });

    console.log("Email sent:", info.messageId);

  } catch (err) {
    console.log("Email error:", err.message);
  }
};

module.exports = sendOrderMail;