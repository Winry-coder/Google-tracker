import { NextRequest, NextResponse } from 'next/server';
import { ZodError } from 'zod';
import { prisma } from '@/lib/prisma/client';
import { paginationSchema } from '@/lib/validations/api.schema';
import {
  createUserSchema,
  userFiltersSchema,
} from '@/lib/validations/user.schema';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/options';
import type { APIResponse, PaginatedResponse } from '@/types/api';
import type { User } from '@/types/user';

/**
 * GET /api/users
 * Returns paginated list of users with optional filters
 */
export async function GET(
  request: NextRequest
): Promise<NextResponse<APIResponse<PaginatedResponse<User>>>> {
  const session = await getServerSession(authOptions);
  if (!session?.user || session.user.role !== 'admin') {
    return NextResponse.json(
      { success: false, error: 'Forbidden' },
      { status: 403 }
    );
  }

  try {
    const searchParams = request.nextUrl.searchParams;
    const params = Object.fromEntries(searchParams);

    const { page, pageSize, sortBy, sortOrder } =
      paginationSchema.parse(params);
    const filters = userFiltersSchema.parse(params);

    const where: Record<string, unknown> = {
      deletedAt: null, // Filter out soft-deleted users
    };

    if (filters.status) {
      where.status = filters.status;
    }

    if (filters.source) {
      where.source = filters.source;
    }

    if (filters.hasAccess !== undefined) {
      where.hasAccess = filters.hasAccess;
    }

    if (filters.search) {
      where.OR = [
        { email: { contains: filters.search } },
        { name: { contains: filters.search } },
      ];
    }

    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where,
        skip: (page - 1) * pageSize,
        take: pageSize,
        orderBy: sortBy ? { [sortBy]: sortOrder } : { createdAt: 'desc' },
      }),
      prisma.user.count({ where }),
    ]);

    return NextResponse.json({
      success: true,
      data: {
        data: users,
        total,
        page,
        pageSize,
        totalPages: Math.ceil(total / pageSize),
      },
    });
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid query parameters',
          details: error.errors,
        },
        { status: 400 }
      );
    }
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch users',
      },
      { status: 500 }
    );
  }
}

/**
 * POST /api/users
 * Creates a new user manually
 */
export async function POST(
  request: Request
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
    const data = createUserSchema.parse(body);

    const user = await prisma.user.create({
      data,
    });

    await prisma.auditLog.create({
      data: {
        eventType: 'user.created',
        eventSource: 'api',
        newValue: JSON.stringify(user),
        performedBy: 'admin',
        userId: user.id,
      },
    });

    // Send Discord notification
    const { sendNewLeadNotification } = await import(
      '@/lib/notifications/webhook'
    );
    sendNewLeadNotification(user);

    return NextResponse.json({
      success: true,
      data: user,
      message: 'User created successfully',
    });
  } catch {
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to create user',
      },
      { status: 500 }
    );
  }
}
