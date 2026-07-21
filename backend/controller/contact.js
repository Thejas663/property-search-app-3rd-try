import { Resend } from 'resend';

export const sendContactEmail = async (req, res) => {
  const { name, email, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({
      success: false,
      message: 'Please provide name, email, and message.',
    });
  }

  const hasConfig = !!process.env.RESEND_API_KEY;
  const to = process.env.CONTACT_RECEIVER_EMAIL || process.env.EMAIL_USER || 'yst.thejas@gmail.com';

  if (!hasConfig) {
    // Fallback: log to console in development (no API key set)
    console.log('\n--- EMAIL SIMULATION (no RESEND_API_KEY set) ---');
    console.log('To:', to);
    console.log('From:', name, '<' + email + '>');
    console.log('Message:', message);
    console.log('------------------------------------------------\n');

    return res.status(200).json({
      success: true,
      message: 'Message received! (Dev mode — set RESEND_API_KEY for real emails)',
    });
  }

  try {
    const resend = new Resend(process.env.RESEND_API_KEY);

    await resend.emails.send({
      // Use resend.dev sandbox until you verify your own domain on resend.com
      from: 'Zenhomes Contact <onboarding@resend.dev>',
      to,
      replyTo: email,
      subject: `New Message from ${name} (${email})`,
      html: `
        <h3>New Contact Form Message</h3>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> <a href="mailto:${email}">${email}</a></p>
        <p><strong>Message:</strong></p>
        <p style="white-space: pre-wrap; padding: 10px; background-color: #f5f5f5; border-radius: 5px;">${message}</p>
        <hr/>
        <p style="color: #888; font-size: 12px;">Sent via Zenhomes contact form</p>
      `,
    });

    return res.status(200).json({
      success: true,
      message: 'Message sent successfully!',
    });
  } catch (err) {
    console.error('Resend email error:', err);
    return res.status(500).json({
      success: false,
      message: 'Failed to send message. Please try again later.',
      error: err.message,
    });
  }
};
