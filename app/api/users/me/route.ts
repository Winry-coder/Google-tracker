import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/options';
import { prisma } from '@/lib/prisma/client';

export async function GET() {
  const session = await getServerSession(authOptions);
  
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const userId = session.user.id;

  try {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore - ownerId added in recent migration
    const [user, campaignsCount] = await Promise.all([
      prisma.user.findUnique({
        where: { id: userId },
        select: {
           id: true,
           email: true,
           role: true,
           name: true,
        }
      }),
      prisma.campaign.count({
        where: {
          ownerId: userId,
          deletedAt: null,
        },
      }),
    ]);

    if (!user) {
        return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({
      ...user,
      hasCampaigns: campaignsCount > 0,
    });
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Failed to fetch user profile:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
