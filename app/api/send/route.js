import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request) {
  try {
    const body = await request.json();
    const { name, email, message } = body;

    // Basic validation (optional but recommended)
    if (!name || !email || !message) {
      return Response.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const { data, error } = await resend.emails.send({
      from: 'PokéShop Contact <onboarding@resend.dev>', // Change after domain verification
      to: ['nickfchmail@gmail.com'], // Your real receiving email
      replyTo: email, // Crucial: lets you reply directly to the visitor
      subject: `New message from ${name} (${email})`,
      text: `
Name: ${name}
Email: ${email}

Message:
${message}
      `.trim(),
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">New Contact Form Submission</h2>
          <p><strong>From:</strong> ${name} &lt;${email}&gt;</p>
          <p><strong>Message:</strong></p>
          <p style="background: #f9f9f9; padding: 15px; border-left: 4px solid #6366f1;">
            ${message.replace(/\n/g, '<br>')}
          </p>
          <hr style="margin: 30px 0;">
          <p style="color: #666; font-size: 14px;">
            <em>Reply to this email to respond directly to ${email}</em>
          </p>
        </div>
      `,
    });

    if (error) {
      console.error('Resend error:', error);
      return Response.json({ success: false, error: error.message }, { status: 500 });
    }

    return Response.json({ success: true });
  } catch (err) {
    console.error('Unexpected error:', err);
    return Response.json(
      { success: false, error: 'Failed to send email' },
      { status: 500 }
    );
  }
}
