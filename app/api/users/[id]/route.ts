import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma/client';
import { updateUserSchema } from '@/lib/validations/user.schema';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/options';
import type { APIResponse } from '@/types/api';
import type { User } from '@/types/user';

interface RouteContext {
  params: {
    id: string;
  };
}

/**
 * GET /api/users/[id]
 * Returns a single user by ID
 */
export async function GET(
  _request: Request,
  { params }: RouteContext
): Promise<NextResponse<APIResponse<User>>> {
  const session = await getServerSession(authOptions);
  if (!session?.user || session.user.role !== 'admin') {
    return NextResponse.json(
      { success: false, error: 'Forbidden' },
      { status: 403 }
    );
  }

  try {
    const user = await prisma.user.findUnique({
      where: { id: params.id },
      include: {
        campaign: true,
        auditLogs: {
          orderBy: { createdAt: 'desc' },
          take: 20,
        },
      },
    });

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          error: 'User not found',
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: user,
    });
  } catch {
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch user',
      },
      { status: 500 }
    );
  }
}

/**
 * PATCH /api/users/[id]
 * Updates a user by ID
 */
export async function PATCH(
  request: Request,
  { params }: RouteContext
): Promise<NextResponse<APIResponse<User>>> {
  const session = await getServerSession(authOptions);
  if (!session?.user || session.user.role !== 'admin') {
    return NextResponse.json(
      { success: false, error: 'Forbidden' },
      { status: 403 }
    );
  }

  try {
    const body = await request.json();
    const updates = updateUserSchema.parse(body);

    const user = await prisma.user.update({
      where: { id: params.id },
      data: updates,
    });

    await prisma.auditLog.create({
      data: {
        eventType: 'user.updated',
        eventSource: 'api',
        newValue: JSON.stringify(updates),
        performedBy: 'admin',
        userId: user.id,
      },
    });

    return NextResponse.json({
      success: true,
      data: user,
      message: 'User updated successfully',
    });
  } catch {
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to update user',
      },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/users/[id]
 * Deletes a user by ID
 */
export async function DELETE(
  _request: Request,
  { params }: RouteContext
): Promise<NextResponse<APIResponse<null>>> {
  const session = await getServerSession(authOptions);
  if (!session?.user || session.user.role !== 'admin') {
    return NextResponse.json(
      { success: false, error: 'Forbidden' },
      { status: 403 }
    );
  }

  try {
    await prisma.user.delete({
      where: { id: params.id },
    });

    return NextResponse.json({
      success: true,
      data: null,
      message: 'User deleted successfully',
    });
  } catch {
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to delete user',
      },
      { status: 500 }
    );
  }
}
