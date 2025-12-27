import { NextResponse } from 'next/server';
import { z } from 'zod';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/options';
import { prisma } from '@/lib/prisma/client';

const discordSettingsSchema = z.object({
  webhookUrl: z
    .string()
    .trim()
    .optional()
    .transform((value) => (value && value.length > 0 ? value : undefined))
    .refine(
      (value) =>
        !value ||
        value.startsWith('https://discord.com/api/webhooks/') ||
        value.startsWith('https://discordapp.com/api/webhooks/'),
      {
        message: 'Please provide a valid Discord webhook URL',
      }
    ),
  enabled: z.boolean().optional(),
});

export async function PATCH(request: Request) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const userId = session.user.id;

  try {
    const json = await request.json();
    const parsed = discordSettingsSchema.parse(json);

    const updates: Record<string, unknown> = {};

    if (parsed.webhookUrl !== undefined) {
      updates.discordWebhookUrl = parsed.webhookUrl;
      // If a webhook URL is cleared, also disable notifications by default
      if (!parsed.webhookUrl) {
        updates.discordNotificationsEnabled = false;
      }
    }

    if (parsed.enabled !== undefined) {
      updates.discordNotificationsEnabled = parsed.enabled;
    }

    const user = await prisma.user.update({
      where: { id: userId },
      data: updates,
      select: {
        id: true,
        email: true,
        discordWebhookUrl: true,
        discordNotificationsEnabled: true,
      },
    });

    return NextResponse.json({
      success: true,
      data: user,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid payload',
          details: error.errors,
        },
        { status: 400 }
      );
    }

    console.error('Failed to update Discord settings', error);

    return NextResponse.json(
      {
        success: false,
        error: 'Failed to update Discord settings',
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const userId = session.user.id;

  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        discordWebhookUrl: true,
        discordNotificationsEnabled: true,
      },
    });

    if (!user) {
      return NextResponse.json(
        { success: false, error: 'User not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: user,
    });
  } catch (error) {
    console.error('Failed to load Discord settings', error);

    return NextResponse.json(
      {
        success: false,
        error: 'Failed to load Discord settings',
      },
      { status: 500 }
    );
  }
}

export async function POST() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const userId = session.user.id;

  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        name: true,
        discordWebhookUrl: true,
        discordNotificationsEnabled: true,
      },
    });

    if (!user) {
      return NextResponse.json(
        { success: false, error: 'User not found' },
        { status: 404 }
      );
    }

    const webhookUrl =
      (user.discordNotificationsEnabled && user.discordWebhookUrl) ||
      process.env.DISCORD_WEBHOOK_URL ||
      process.env.SLACK_WEBHOOK_URL;

    if (!webhookUrl) {
      return NextResponse.json(
        {
          success: false,
          error: 'No Discord/Slack webhook is configured for this account.',
        },
        { status: 400 }
      );
    }

    const payload = {
      content: '🔔 Test notification from Access Tracker Pulse',
      embeds: [
        {
          title: 'Discord webhook connected',
          description:
            'If you are seeing this message, your webhook is configured correctly.',
          color: 5814783,
          fields: [
            {
              name: 'User',
              value: user.email,
              inline: true,
            },
            {
              name: 'Time',
              value: new Date().toLocaleString(),
              inline: true,
            },
          ],
        },
      ],
    };

    await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    return NextResponse.json({
      success: true,
      message: 'Test notification sent successfully',
    });
  } catch (error) {
    console.error('Failed to send test Discord notification', error);

    return NextResponse.json(
      {
        success: false,
        error: 'Failed to send test Discord notification',
      },
      { status: 500 }
    );
  }
}
