import { prisma } from '@/lib/prisma/client';
import { User } from '@/types/user';
import { sendWelcomeEmail } from '@/lib/emails/resend';
import { sendNewLeadNotification } from '@/lib/notifications/webhook';
import { enrichLeadData } from '@/lib/enrichment/service';

/**
 * Orchestrates all Phase 4 automation for a new lead
 * 1. Enrichment
 * 2. Welcome Email
 * 3. External Webhooks
 * 4. System Notifications (Discord/Slack)
 */
export async function processLeadAutomation(user: User, campaignId?: string) {
  try {
    // 1. Fetch Campaign if ID provided
    const campaign = campaignId
      ? await prisma.campaign.findUnique({ where: { id: campaignId } })
      : null;

    // 2. Lead Enrichment (Fire and forget updates to DB)
    enrichLeadData(user.email)
      .then(async (enriched) => {
        if (enriched) {
          await prisma.user.update({
            where: { id: user.id },
            data: {
              company: enriched.company,
              jobTitle: enriched.jobTitle,
              linkedinUrl: enriched.linkedinUrl,
              enrichedAt: new Date(),
            },
          });
        }
      })
      .catch((err) => {
        if (process.env.NODE_ENV === 'development') {
          // eslint-disable-next-line no-console
          console.error('Enrichment failed:', err);
        }
      });

    // 3. Welcome Email
    if (campaign?.emailSubject && campaign?.emailBody) {
      const personalizedBody = campaign.emailBody
        .replace(/{{name}}/g, user.name || 'there')
        .replace(/{{campaign}}/g, campaign.name);

      sendWelcomeEmail({
        to: user.email,
        subject: campaign.emailSubject,
        body: personalizedBody,
        campaignName: campaign.name,
      }).catch((err) => {
        if (process.env.NODE_ENV === 'development') {
          // eslint-disable-next-line no-console
          console.error('Email failed:', err);
        }
      });
    }

    // 4. External Webhook (Zapier/CRM/Make)
    if (campaign?.webhookUrl) {
      fetch(campaign.webhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          event: 'lead.captured',
          timestamp: new Date().toISOString(),
          lead: {
            id: user.id,
            email: user.email,
            name: user.name,
            source: user.source,
            company: user.company,
            jobTitle: user.jobTitle,
            linkedinUrl: user.linkedinUrl,
          },
          campaign: {
            id: campaign.id,
            name: campaign.name,
            slug: campaign.slug,
          },
        }),
      }).catch((err) => {
        if (process.env.NODE_ENV === 'development') {
          // eslint-disable-next-line no-console
          console.error('External Webhook failed:', err);
        }
      });
    }

    // 5. System Notification (Discord/Slack)
    await sendNewLeadNotification({
      ...user,
      name: user.name || 'Anonymous User',
    });
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      // eslint-disable-next-line no-console
      console.error('Lead automation pipeline failed:', error);
    }
  }
}
