import { NextResponse } from 'next/server';
import { prisma } from '@/core/database/prisma';

export async function GET() {
  try {
    const snapshots = await prisma.snapshot.findMany({
      orderBy: { createdAt: 'desc' },
      select: { id: true, apiName: true, createdAt: true }, // Exclude swaggerJson to save bandwidth
    });
    return NextResponse.json(snapshots);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
