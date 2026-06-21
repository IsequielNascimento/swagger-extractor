import { NextResponse } from 'next/server';
import { prisma } from '@/core/database/prisma';

export async function GET() {
  try {
    const snapshots = await prisma.snapshot.findMany({
      orderBy: { createdAt: 'desc' },
      select: { id: true, apiName: true, createdAt: true },
    });
    return NextResponse.json(snapshots);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Internal server error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
