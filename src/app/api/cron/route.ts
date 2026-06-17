import { NextResponse } from 'next/server';
import { DownloadSwaggerUseCase } from '@/modules/snapshots/useCases/DownloadSwaggerUseCase';
import { SaveSnapshotUseCase } from '@/modules/snapshots/useCases/SaveSnapshotUseCase';

export async function GET(request: Request) {
  const authHeader = request.headers.get('authorization');
  if (authHeader !== 'Bearer ' + process.env.CRON_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  let targets: { url: string; name: string }[] = [];
  try {
    targets = JSON.parse(process.env.API_TARGETS || '[]');
  } catch (e) {
    return NextResponse.json({ error: 'Invalid API_TARGETS format in .env' }, { status: 500 });
  }

  if (targets.length === 0) {
    return NextResponse.json({ error: 'No API targets configured in API_TARGETS' }, { status: 500 });
  }

  try {
    const downloader = new DownloadSwaggerUseCase();
    const saver = new SaveSnapshotUseCase();
    const results = [];

    for (const target of targets) {
      try {
        const swaggerJson = await downloader.execute(target.url);
        const result = await saver.execute(target.name, swaggerJson);
        results.push({ name: target.name, success: true, result });
      } catch (err: any) {
        results.push({ name: target.name, success: false, error: err.message });
      }
    }

    return NextResponse.json({ success: true, results });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
