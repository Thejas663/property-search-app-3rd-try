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
    // Must send FROM your own Gmail account (authenticated sender)
    from: `"Zenhomes Contact" <${process.env.EMAIL_USER}>`,
    to: process.env.CONTACT_RECEIVER_EMAIL || process.env.EMAIL_USER,
    // Include visitor's email in the subject so you know who sent it
    subject: `New Message from ${name} (${email})`,
    text: `You have received a new contact form message:\n\nName: ${name}\nEmail: ${email}\nMessage:\n${message}`,
    html: `
      <h3>New Contact Form Message</h3>
      <p><strong>Name:</strong> ${name}</p>
      <p><strong>Email:</strong> <a href="mailto:${email}">${email}</a></p>
      <p><strong>Message:</strong></p>
      <p style="white-space: pre-wrap; padding: 10px; background-color: #f5f5f5; border-radius: 5px;">${message}</p>
      <hr/>
      <p style="color: #888; font-size: 12px;">Sent via Zenhomes contact form</p>
    `,
    // "Reply-To" lets you reply directly to the visitor's email
    replyTo: email,
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
    // Use explicit Gmail SMTP config for better reliability on cloud hosts
    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 587,
      secure: false, // Use STARTTLS on port 587
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
      tls: {
        rejectUnauthorized: false, // Prevent TLS cert issues on cloud
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
