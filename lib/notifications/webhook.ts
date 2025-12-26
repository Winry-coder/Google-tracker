import { User } from '@/types/user';

/**
 * Sends a notification to Discord/Slack via Webhook
 */
export async function sendNewLeadNotification(user: User) {
  const webhookUrl =
    process.env.DISCORD_WEBHOOK_URL || process.env.SLACK_WEBHOOK_URL;

  if (!webhookUrl) return;

  // Format for Discord (Slack is very similar but this keys off standard payload)
  const payload = {
    content: `🚨 **New Lead Detected!**`,
    embeds: [
      {
        title: user.name || 'Unknown User',
        description: `Accessed Google Drive Folder`,
        color: 5814783, // Greenish
        thumbnail: {
          url: user.image || undefined,
        },
        fields: [
          {
            name: 'Email',
            value: user.email,
            inline: true,
          },
          {
            name: 'Source',
            value: user.source,
            inline: true,
          },
          {
            name: 'Role',
            value: user.role,
            inline: true,
          },
          {
            name: 'Time',
            value: new Date().toLocaleString(),
            inline: false,
          },
        ],
      },
    ],
  };

  try {
    await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });
  } catch (error) {
    console.error('Failed to send notification:', error);
  }
}
