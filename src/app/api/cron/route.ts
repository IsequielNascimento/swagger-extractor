import { NextResponse } from 'next/server';
import { DownloadSwaggerUseCase } from '@/modules/snapshots/useCases/DownloadSwaggerUseCase';
import { SaveSnapshotUseCase } from '@/modules/snapshots/useCases/SaveSnapshotUseCase';

export async function GET(request: Request) {
  const authHeader = request.headers.get('authorization');
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  let targets: { url: string; name: string }[] = [];
  try {
    targets = JSON.parse(process.env.API_TARGETS || '[]');
  } catch {
    return NextResponse.json({ error: 'Invalid API_TARGETS format in .env' }, { status: 500 });
  }

  if (targets.length === 0) {
    return NextResponse.json({ error: 'No API targets configured in API_TARGETS' }, { status: 500 });
  }

  const downloader = new DownloadSwaggerUseCase();
  const saver = new SaveSnapshotUseCase();
  const results: { name: string; success: boolean; skipped?: boolean; id?: string; error?: string }[] = [];

  for (const target of targets) {
    try {
      const swaggerJson = await downloader.execute(target.url);
      const result = await saver.execute(target.name, swaggerJson);

      if (result.skipped) {
        results.push({ name: target.name, success: true, skipped: true });
      } else {
        results.push({ name: target.name, success: true, skipped: false, id: result.snapshot.id });
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Unknown error';
      results.push({ name: target.name, success: false, error: message });
    }
  }

  return NextResponse.json({ success: true, results });
}
