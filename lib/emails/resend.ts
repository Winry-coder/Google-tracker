import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY || 're_123'); // Fallback for types

export async function sendWelcomeEmail({
  to,
  subject,
  body,
  campaignName,
}: {
  to: string;
  subject: string;
  body: string;
  campaignName: string;
}) {
  if (!process.env.RESEND_API_KEY) {
    console.warn('RESEND_API_KEY is missing. Skipping email.');
    return null;
  }

  try {
    const { data, error } = await resend.emails.send({
      from: 'Access Tracker <onboarding@resend.dev>', // TODO: Update with verified domain
      to: [to],
      subject: subject || `Welcome to ${campaignName}`,
      html:
        body ||
        `<p>You have been granted access to <strong>${campaignName}</strong>.</p>`,
    });

    if (error) {
      console.error('Resend Error:', error);
      return null;
    }

    return data;
  } catch (err) {
    console.error('Failed to send email:', err);
    return null;
  }
}
