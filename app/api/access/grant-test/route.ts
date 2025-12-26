import { NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma/client';
import { sendNewLeadNotification } from '@/lib/notifications/webhook';

export const dynamic = 'force-dynamic';

// Validation schema
const requestAccessSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  name: z
    .string()
    .optional()
    .transform((val) => (val && val.trim() ? val : undefined)),
});

/**
 * POST /api/access/grant-test
 * Test version - grants access without calling Google Drive API
 * Use this to test the flow while Google API issues are being resolved
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, name } = requestAccessSchema.parse(body);

    // Check if user already has access
    const existingUser = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    });

    if (existingUser && existingUser.hasAccess) {
      return NextResponse.json(
        {
          success: false,
          error: 'You already have access to this resource',
        },
        { status: 400 }
      );
    }

    // Create or update user in database (skipping Google Drive API for now)
    const user = await prisma.user.upsert({
      where: { email: email.toLowerCase() },
      create: {
        email: email.toLowerCase(),
        name: name || null,
        hasAccess: true,
        role: 'viewer',
        source: 'access_request',
        status: 'active',
        googleEmail: email,
        lastSyncedAt: new Date(),
      },
      update: {
        hasAccess: true,
        status: 'active',
        lastSyncedAt: new Date(),
      },
    });

    // Create audit log
    await prisma.auditLog.create({
      data: {
        eventType: 'access.granted',
        eventSource: 'access_request_test',
        newValue: JSON.stringify({ email }),
        performedBy: 'system',
        userId: user.id,
      },
    });

    // Send Discord notification
    sendNewLeadNotification(user).catch(console.error);

    return NextResponse.json({
      success: true,
      message: 'Access granted! (Test mode - Google Drive integration pending)',
      data: {
        email: user.email,
        name: user.name,
      },
    });
  } catch (error) {
    console.error('Access grant failed:', error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          success: false,
          error: error.errors[0].message,
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        success: false,
        error: 'Failed to grant access. Please try again.',
      },
      { status: 500 }
    );
  }
}
