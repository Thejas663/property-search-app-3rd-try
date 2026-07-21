import nodemailer from 'nodemailer';

export const sendContactEmail = async (req, res) => {
  const { name, email, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({
      success: false,
      message: 'Please provide name, email, and message.',
    });
  }

  // Check if email credentials are configured in environment variables
  const hasConfig = process.env.EMAIL_USER && process.env.EMAIL_PASS;

  const mailOptions = {
    from: `"${name}" <${email}>`,
    to: process.env.CONTACT_RECEIVER_EMAIL || process.env.EMAIL_USER || 'your_email@gmail.com',
    subject: `New Contact Form Query from ${name}`,
    text: `You have received a new contact form query:\n\nName: ${name}\nEmail: ${email}\nMessage: ${message}`,
    html: `
      <h3>New Contact Form Query</h3>
      <p><strong>Name:</strong> ${name}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Message:</strong></p>
      <p style="white-space: pre-wrap; padding: 10px; background-color: #f5f5f5; border-radius: 5px;">${message}</p>
    `,
  };

  if (!hasConfig) {
    // Fallback: log query to console when credentials are not yet defined
    console.log('\n--- EMAIL SIMULATION ---');
    console.log('To:', mailOptions.to);
    console.log('Subject:', mailOptions.subject);
    console.log('Body:\n', mailOptions.text);
    console.log('------------------------\n');

    return res.status(200).json({
      success: true,
      message: 'Message logged successfully (Developer Mode: Setup EMAIL_USER/EMAIL_PASS env variables for real emails).',
    });
  }

  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail', // Default service (can be changed to host/port configuration)
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.sendMail(mailOptions);

    return res.status(200).json({
      success: true,
      message: 'Message sent successfully via email!',
    });
  } catch (err) {
    console.error('Email sending failed:', err);
    return res.status(500).json({
      success: false,
      message: 'Failed to send email. Please try again later.',
      error: err.message,
    });
  }
};
